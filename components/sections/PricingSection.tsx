"use client"
// ^ "use client" tells Next.js this component runs in the browser, not the server.
// It's required because this file uses useState, useEffect (interactive state for
// the booking animation loop and pulse timer), and Framer Motion browser APIs.
// This MUST be the very first line — no blank lines, no imports, nothing above it.

// useState: like a Python variable, but changing it automatically re-renders the UI.
// useEffect: runs code after the component first appears in the browser (like window.onload).
// useRef: creates a stable reference to a DOM element without triggering re-renders.
// Fragment: a wrapper that doesn't add any extra element to the DOM — used for returning
//           multiple sibling elements from a map() call that needs a key.
import { useState, useEffect, useRef, Fragment } from "react"
// useCTAModal gives us openModal() from the global CTA context.
// Called by all CTA buttons on this page so clicking any of them opens the funnel.
import { useCTAModal } from "@/components/cta/CTAContext"

// motion:         wraps any HTML element to give it animation superpowers.
// AnimatePresence: lets elements play an exit animation before being removed from the DOM.
// useInView:      returns true once a referenced element scrolls into the viewport.
import { motion, AnimatePresence, useInView } from "framer-motion"

// Variants: TypeScript type for named animation state objects.
// Without it TypeScript widens literal strings like "easeOut" to `string`,
// which breaks Framer Motion's stricter union type expectations.
import type { Variants } from "framer-motion"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// TypeScript interfaces define the exact shape of our data objects.
// Think of them like Python dataclasses — they enforce that every card or step
// has exactly the fields we expect, and catch typos at compile time.
// ─────────────────────────────────────────────────────────────────────────────

type PricingCard = {
  id: string
  title: string
  price: string
  tagline: string
  features: string[]
  missing?: string[]   // features shown as greyed-out with × (Starter card only)
  roi: string          // pre-formatted ROI text shown in the blue "This pays for itself" box
  painLine: string
  cta: string
  isHero: boolean      // true only for Growth — drives all the special styling
}

type ProcessStep = {
  number: string       // "01", "02", "03" — large decorative label
  title: string
  bullets: string[]
  microLine: string    // short italic reassurance below the bullets
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// Defined at module scope (outside the component function) so these arrays
// are created once when the file loads, not on every render.
// ─────────────────────────────────────────────────────────────────────────────

const PRICING_CARDS: PricingCard[] = [
  {
    id: "starter",
    title: "Starter",
    price: "$149",
    tagline: "Just the basics",
    features: [
      "Professional website",
      "Instagram auto-sync",
      "Class schedule",
      "Contact & location",
    ],
    missing: [
      "Online booking",
      "Online payments",
    ],
    roi: "Just 2 extra bookings / month → $160",
    painLine: "For studios that just need an online presence",
    cta: "Get started",
    isHero: false,
  },
  {
    id: "growth",
    title: "Growth",
    price: "$249",
    tagline: "Everything you need to get booked and paid automatically",
    features: [
      "Everything from Starter",
      "Accept bookings 24/7",
      "Sell memberships & packages",
      "Manage class booking-status",
      "Client list and overview dashboard",
      "SEO Google Search optimization",
    ],
    roi: "Just 3 extra bookings / month → $240",
    painLine: "Stop answering the same messages every day.",
    cta: "Start accepting bookings",
    isHero: true,
  },
  {
    id: "pro",
    title: "Pro",
    price: "$399",
    tagline: "For scaling studios",
    features: [
      "All features from Growth",
      "All-in-One Studio Command Dashboard",
      "Weekly Performance Reports (auto-generated)",
      "Revenue Dashboard (bookings, memberships, LTV)",
      "Offer Performance Tracking & Demand Insights (optimize schedule and offers for max bookings)",
      "Automated Client Segmentation (new, active, inactive clients)",
    ],
    roi: "Just 5 extra bookings / month → $400",
    painLine: "For studios running ads or multiple locations",
    cta: "Scale your studio",
    isHero: false,
  },
]

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Send us your Instagram",
    bullets: [
      "Share your handle",
      "We create your preview automatically",
      "No long forms",
    ],
    microLine: "Takes less than 2 minutes",
  },
  {
    number: "02",
    title: "We build everything for you",
    bullets: [
      "Website created",
      "Booking + payments connected",
      "Fully tested",
    ],
    microLine: "You don't touch any tech",
  },
  {
    number: "03",
    title: "Start receiving bookings",
    bullets: [
      "Website goes live",
      "Clients book & pay online",
      "No more DMs",
    ],
    microLine: "You focus on teaching",
  },
]

// These two columns appear in the Trust Layer section.
const TRUST_COLUMNS = [
  {
    id: "setup",
    heading: "We set everything up",
    points: ["Website ready in days", "We connect everything", "No technical work"],
  },
  {
    id: "risk",
    heading: "No risk to try",
    points: ["No upfront cost", "No hidden fees", "Cancel after 3 months"],
  },
]

const TRUST_QUOTES = [
  {
    text: "My processes just became too messy… The waking up at 3am in the morning no longer happens. Clients just pay.",
    source: "Claire Willett, Owner of Millstream Pilates, Oxfordshire",
  },
  {
    text: "We found that we were missing stuff. We weren't sure where people were, whether they were showing up, whether their payments were going through.",
    source: "Jake Allen, Founder of JPT Fitness, London",
  },
  {
    text: "We were just on this hamster wheel of admin and organization… That's not what we want to do as Pilates instructors or yoga teachers. We just want to teach.",
    source: "Katie Bell, Pilates Studio Owner & Business Coach",
  },
]

// Steps shown under the main CTA to eliminate last-moment hesitation.
const WHAT_HAPPENS = [
  "You share your Instagram",
  "We schedule a quick call",
  "We start your setup immediately",
]

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// Named objects that Framer Motion uses to transition between states.
// "hidden" is the initial (invisible) state; "show" is the final (visible) state.
// ─────────────────────────────────────────────────────────────────────────────

// container: the parent that orchestrates staggered child animations.
// staggerChildren: 0.12 means each child starts animating 120ms after the previous.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

// item: each child fades in and slides up 20px from its final resting position.
// duration 0.7s + easeOut: slow and confident — matches the AXIS brand feel.
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

// bulletContainer: staggers each heading + bullet point within a trust column.
// A tighter 0.08s stagger makes the list feel rapid-fire — like a waterfall of
// advantages landing one by one rather than the whole column appearing at once.
const bulletContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.5 } },
}

// bulletItemContainer: each li acts as a sub-orchestrator for its two children
// (the ✓ and the text). staggerChildren: 0.08 means the text starts 80ms after
// the checkmark — the checkmark always lands first, text confirms it.
const bulletItemContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

// checkmarkVariant: the ✓ slides in from the left as it fades in.
// x: -8 → x: 0 gives it a short horizontal travel — purposeful, not bouncy.
const checkmarkVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

// labelVariant: the text fades in after the checkmark has settled.
// No y-movement here — the checkmark already provides the motion cue.
const labelVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
}

// timelineNodeVariant: each timeline node (circle + label) fades up into place.
// Mirrors the nodeVariant pattern from SystemVisualSection.tsx.
const timelineNodeVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

// timelineLineVariant: SVG connector paths draw themselves left-to-right (or top-to-bottom).
// pathLength 0 → 1 animates stroke-dasharray under the hood — the line "draws" into view.
const timelineLineVariant: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1 },
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function PricingSection() {

  // Get the openModal function from the CTA context.
  // All three card CTAs and the repeat CTA use this to open the funnel modal.
  const { openModal } = useCTAModal()

  // carouselRef: attached to the pricing card scroll container so we can read
  // scrollLeft on each scroll event and update the dot indicators accordingly.
  const carouselRef = useRef<HTMLDivElement>(null)

  // activeCard: index (0, 1, or 2) of the card currently snapped into view
  // in the mobile carousel. Drives which dot appears full-white.
  const [activeCard, setActiveCard] = useState(0)

  // Updates activeCard as the user swipes the mobile carousel.
  // scrollLeft / (scrollWidth - offsetWidth) gives a 0→1 scroll fraction.
  // Multiplying by (cardCount - 1) and rounding gives the snapped card index.
  // passive: true — tells the browser we won't call preventDefault(), so it
  // can handle scroll immediately without waiting for this listener to finish.
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const handleScroll = () => {
      const fraction = el.scrollLeft / Math.max(el.scrollWidth - el.offsetWidth, 1)
      setActiveCard(Math.round(fraction * (PRICING_CARDS.length - 1)))
    }
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  // quoteIndex: which of the 3 testimonial quotes is currently visible.
  // Cycles 0 → 1 → 2 → 0 every 3 seconds unless the user is hovering.
  const [quoteIndex, setQuoteIndex] = useState(0)

  // quoteHovered: pauses the carousel while the user reads the active quote.
  const [quoteHovered, setQuoteHovered] = useState(false)

  // Auto-advance the quote carousel every 3 seconds.
  // Returns early (without creating an interval) when quoteHovered is true —
  // this effectively pauses the timer for as long as the user is hovering.
  // Cleanup (clearInterval) prevents a memory leak on unmount.
  useEffect(() => {
    if (quoteHovered) return
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % TRUST_QUOTES.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [quoteHovered])

  // spots: tracks how many onboarding spots remain for the scarcity counter.
  const [spots, setSpots] = useState(5)

  // scarcityRef: attached to the scarcity block div so we can detect when it
  // enters the viewport. useInView returns true once the element is visible.
  // once: true — the countdown triggers exactly once, never restarts on re-scroll.
  const scarcityRef = useRef(null)
  const scarcityInView = useInView(scarcityRef, { once: true })

  // Countdown 5 → 2, triggered only after the scarcity block scrolls into view.
  // Each step has a different delay to feel organic, not mechanical:
  //   5 → 4: 1.2 s  (quick opening — establishes the counter is live)
  //   4 → 3: 2.8 s  (noticeably slower — builds tension)
  //   3 → 2: 5.0 s  (longest pause — makes the last spot feel precious)
  const SPOT_DELAYS: Record<number, number> = { 5: 1200, 4: 2800, 3: 5000 }

  useEffect(() => {
    if (!scarcityInView) return
    if (spots <= 2) return
    const timer = setTimeout(() => setSpots((prev) => prev - 1), SPOT_DELAYS[spots] ?? 1500)
    return () => clearTimeout(timer)
  }, [spots, scarcityInView])

  return (
    // Root element MUST be <section> per component.md rules.
    // py-20 px-6: mobile padding (375px viewport).
    // md:py-36 md:px-12: desktop padding (≥768px viewport).
    // Tailwind is mobile-first: unprefixed classes apply to all sizes;
    // md: prefix overrides at the medium breakpoint and above.
    // pt-32: extra top padding on mobile gives breathing room between the page
    // header and the "Pricing" accent label. pb-20 keeps the bottom balanced.
    // md:py-36: restores the standard symmetric section padding on desktop.
    <section className="bg-black-axis pt-32 pb-20 px-6 md:py-36 md:px-12">

      {/* max-w-6xl mx-auto: caps content width at 72rem and centres it.
          All section content must live inside this wrapper per component.md. */}
      <div className="max-w-6xl mx-auto">


        {/* ══════════════════════════════════════════════════════════════════
            BLOCK 1 — HERO HEADER
            Centered layout: accent label → h1 → subhead → micro trust bar.
        ══════════════════════════════════════════════════════════════════ */}

        {/* motion.div with container variant: orchestrates stagger for children.
            whileInView: triggers the animation when this block scrolls into view.
            viewport={{ once: true }}: plays once, never replays on re-scroll. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >

          {/* Accent label — small blue all-caps tag that sets context */}
          <motion.p
            variants={item}
            className="font-instrument text-blue-axis text-xs uppercase tracking-[0.3em] mb-6"
          >
            Pricing
          </motion.p>

          {/* h1: exactly ONE per page per SEO rules.
              This is the primary headline for the /pricing route.
              font-playfair uppercase tracking-tight: brand headline style. */}
          <motion.h1
            variants={item}
            className="font-playfair uppercase tracking-tight text-white-axis text-3xl md:text-5xl leading-tight mb-6 max-w-3xl mx-auto"
          >
            Turn your Instagram<br />into a booking machine
          </motion.h1>

          {/* Subheadline — body text, Instrument Sans */}
          <motion.p
            variants={item}
            className="font-instrument text-soft-grey text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-12"
          >
            Get more clients, accept payments, and stop managing your studio in DMs
          </motion.p>

          {/* ── MICRO TRUST BAR ────────────────────────────────────────────
              4 short trust signals in a horizontal row.
              flex-wrap: naturally wraps to a second row on narrow screens. */}
          {/* flex-col items-center: stacks trust signals vertically on mobile.
              md:flex-row md:flex-wrap md:justify-center: switches to a horizontal
              wrapping row on desktop. Updated copy matches the card guarantees. */}
          <motion.div
            variants={item}
            className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-10"
          >
            {["No setup fee", "No hidden costs", "3-month minimum", "Cancel anytime after", "Live in 7 days"].map((trust) => (
              <div key={trust} className="flex items-center gap-2">
                <span className="text-blue-axis text-xs" aria-hidden="true">✓</span>
                <span className="font-instrument text-soft-grey text-xs uppercase tracking-widest">
                  {trust}
                </span>
              </div>
            ))}
          </motion.div>

        </motion.div>
        {/* END BLOCK 1 */}


        {/* ══════════════════════════════════════════════════════════════════
            BLOCK 2 — PRICING GRID
            3 columns on desktop, stacked on mobile.
            Growth (hero) card: slightly larger, lifted, highlighted border.
        ══════════════════════════════════════════════════════════════════ */}

        {/* PRICING CARDS
            Mobile: horizontal snap-scroll carousel. Each card is 75vw wide so the
            next card peeks in from the right, signalling the user can swipe.
            overflow-x-auto snap-x snap-mandatory: browser handles snapping per card.
            [scrollbar-width:none]: hides scrollbar in Firefox.
            [&::-webkit-scrollbar]:hidden: hides scrollbar in Chrome / Safari.
            Desktop (md+): switches to a standard 3-column grid.
            md:overflow-visible: resets overflow so the hero card's scale-up isn't clipped. */}
        <motion.div
          ref={carouselRef}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-4 md:grid md:grid-cols-3 md:overflow-visible md:items-stretch mb-0 md:mb-36"
        >

          {PRICING_CARDS.map((card) => (
            <motion.div
              key={card.id}
              variants={item}
              className={[
                // snap-start: card snaps to the left edge of the carousel on mobile.
                // shrink-0 w-[75vw]: fixed width at 75% of viewport so the next card
                //   peeks in from the right (~30px on a 375px phone).
                // md:w-auto: inside the desktop grid, card width is grid-controlled.
                "snap-start shrink-0 w-[75vw] md:w-auto",
                // All cards share: dark surface, rounded corners, flex column layout.
                "relative overflow-hidden rounded-2xl p-8 flex flex-col",
                card.isHero
                  ? "bg-grey-axis border border-blue-axis md:scale-105 md:-mt-4"
                  : "bg-grey-axis border border-white-axis/[0.08]",
              ].join(" ")}
              // Hover behaviour per spec:
              // Starter: slight fade (de-emphasis — draws eye toward Growth)
              // Growth: lift upward
              // Pro: slight lift
              whileHover={
                card.id === "starter"
                  ? { opacity: 0.65 }
                  : card.isHero
                  ? { y: -10 }
                  : { y: -4 }
              }
              transition={{ duration: 0.35, ease: "easeOut" as const }}
            >

              {/* ── AMBIENT GLOW PULSE (Growth card only) ───────────────────
                  An absolutely-positioned blurred circle that creates a soft
                  ambient glow behind the card content.
                  animate with a keyframes array [a, b, a]: pulses from dim → bright → dim.
                  repeat: Infinity + repeatDelay: 5 → breathes every ~7 seconds. */}
              {card.isHero && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-blue-axis/[0.15] blur-3xl pointer-events-none"
                  aria-hidden="true"
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* ── HERO BADGE (Growth card only) ────────────────────────────
                  "Most studios choose this" — single highlight moment.
                  Uses blue-axis only — no second accent colour. */}
              {card.isHero && (
                <div className="text-center mb-6">
                  <span className="font-instrument text-[10px] uppercase tracking-[0.25em] text-blue-axis border border-blue-axis/40 px-4 py-1.5 rounded-full">
                    ★ Most studios choose this
                  </span>
                </div>
              )}

              {/* ── CARD TITLE + TAGLINE ──────────────────────────────────── */}
              <div className="mb-5">
                {/* Card title: styled paragraph, not a heading — these are card labels,
                    not page section headlines. Headings are reserved for section-level content. */}
                <p className={[
                  "font-playfair uppercase tracking-tight leading-none mb-2",
                  card.isHero ? "text-white-axis text-2xl" : "text-white-axis text-xl",
                ].join(" ")}>
                  {card.title}
                </p>
                <p className="font-instrument text-soft-grey text-xs uppercase tracking-widest leading-relaxed">
                  {card.tagline}
                </p>
              </div>

              {/* ── PRICE ─────────────────────────────────────────────────── */}
              <div className="mb-8">
                <span className={[
                  "font-playfair tracking-tight leading-none",
                  card.isHero ? "text-white-axis text-5xl" : "text-white-axis text-4xl",
                ].join(" ")}>
                  {card.price}
                </span>
                <span className="font-instrument text-soft-grey text-sm ml-2">/ month</span>
              </div>

              {/* ── VALUE BLOCK — shown on every card ────────────────────────
                  card.roi holds the plan-specific ROI line (e.g. "Just 2 extra
                  bookings / month → $160"). Rendered on all three cards now. */}
              <div className="bg-blue-axis/[0.08] border border-blue-axis/[0.20] rounded-xl p-4 mb-6">
                <p className="font-instrument text-soft-grey text-xs leading-relaxed text-center">
                  <span className="text-white-axis font-semibold">This pays for itself:</span><br />
                  If 1 client = $80<br />
                  {card.roi}
                </p>
              </div>

              {/* ── FEATURES LIST ─────────────────────────────────────────── */}
              <ul className="flex flex-col gap-3 my-6">
                {/* Included features.
                    featureIndex 0 on Growth → "Everything from <em>Starter</em>"
                    featureIndex 0 on Pro   → "All features from <em>Growth</em>"
                    The <em> tag renders the plan name in italics to show inheritance.
                    All other bullets render as plain text strings. */}
                {card.features.map((feature, featureIndex) => (
                  <li key={feature} className="flex items-start gap-3 font-instrument text-sm text-soft-grey">
                    <span className="text-blue-axis text-xs mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                    {featureIndex === 0 && card.id === "growth" ? (
                      <>Everything from <em>Starter</em></>
                    ) : featureIndex === 0 && card.id === "pro" ? (
                      <>All features from <em>Growth</em></>
                    ) : (
                      feature
                    )}
                  </li>
                ))}

                {/* Missing features (Starter only) — greyed out with × symbol. */}
                {card.missing && card.missing.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 font-instrument text-sm text-white-axis/25">
                    <span className="text-xs mt-0.5 flex-shrink-0" aria-hidden="true">×</span>
                    {feature}
                  </li>
                ))}
              </ul>


              {/* ── PAIN LINE ─────────────────────────────────────────────── */}
              <p className={[
                "font-instrument text-sm leading-relaxed mb-8",
                card.isHero ? "text-white-axis font-semibold" : "text-soft-grey",
              ].join(" ")}>
                {card.painLine}
              </p>

              {/* ── CTA BUTTON ──────────────────────────────────────────────
                  mt-auto: pushes the button to the bottom of the flex column
                           so all three card CTAs align at the same vertical position.
                  component.md: always use <button> — never <a> styled as a button. */}
              <motion.button
                onClick={openModal}
                className={[
                  "mt-auto w-full font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-6 py-4",
                  card.isHero
                    ? "bg-white-axis text-black-axis"
                    : "border border-white-axis/40 text-white-axis",
                ].join(" ")}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.35, ease: "easeOut" as const }}
              >
                {card.cta}
              </motion.button>

              {/* ── SUBTEXT UNDER BUTTON — shown on all cards ─────────────── */}
              <div className="mt-4 flex flex-col gap-1 text-center">
                {[
                  "Takes less than 2 minutes to start",
                  "No credit card required",
                ].map((line) => (
                  <p key={line} className="font-instrument text-xs text-soft-grey">
                    {line}
                  </p>
                ))}
              </div>

            </motion.div>
          ))}

        </motion.div>

        {/* ── CAROUSEL DOT INDICATORS — mobile only ──────────────────────
            Three dots below the carousel show which card is currently snapped.
            activeCard (updated by the scroll listener above) drives which dot
            is full-white vs muted.
            Clicking a dot calls scrollIntoView on the matching card element,
            which the browser animates smoothly into the snap position.
            md:hidden: dots are hidden on desktop where all three cards are visible. */}
        <div className="flex justify-center gap-3 mt-4 mb-24 md:hidden">
          {PRICING_CARDS.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => {
                if (!carouselRef.current) return
                // .children gives the list of card motion.div elements.
                // scrollIntoView with inline: "start" matches the snap-start alignment.
                const children = carouselRef.current.children
                children[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
              }}
              className={[
                "w-1.5 h-1.5 rounded-full transition-colors",
                i === activeCard ? "bg-white-axis" : "bg-white-axis/20",
              ].join(" ")}
              whileHover={{ scale: 1.4 }}
              transition={{ duration: 0.2, ease: "easeOut" as const }}
              aria-label={`Show ${card.title} card`}
            />
          ))}
        </div>
        {/* END BLOCK 2 */}


        {/* ══════════════════════════════════════════════════════════════════
            BLOCK 3 — TRUST LAYER
            Title → 3 columns: Setup / Risk / Real problem quotes.
        ══════════════════════════════════════════════════════════════════ */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-24 md:mb-36"
        >

          {/* h2: section-level headline per SEO rules — one per section. */}
          <motion.h2
            variants={item}
            className="font-playfair uppercase tracking-tight text-white-axis text-2xl md:text-3xl text-center mb-16"
          >
            You don&apos;t have to figure this out
          </motion.h2>

          {/* 3-column grid on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

            {/* ── COLUMNS 1 & 2 — Setup and Risk ───────────────────────────
                Each column uses bulletContainer to stagger its heading + bullets
                individually, creating a rapid-fire waterfall of advantages.
                The h3 + each li all appear as separate motion items. */}
            {TRUST_COLUMNS.map((col) => (
              <motion.div key={col.id} variants={bulletContainer}>

                {/* h3: first child — appears first in the stagger sequence */}
                <motion.h3
                  variants={item}
                  className="font-playfair uppercase tracking-tight text-white-axis text-lg mb-5"
                >
                  {col.heading}
                </motion.h3>

                {/* Each li is a sub-orchestrator (bulletItemContainer) that staggers
                    its two children: ✓ slides in first, text fades in 80ms later.
                    The li itself has no visual animation — only its children do. */}
                <ul className="flex flex-col gap-3">
                  {col.points.map((point) => (
                    <motion.li
                      key={point}
                      variants={bulletItemContainer}
                      className="flex items-start gap-3 font-instrument text-sm text-soft-grey"
                    >
                      {/* ✓ — slides in from the left first */}
                      <motion.span
                        variants={checkmarkVariant}
                        className="text-blue-axis text-xs mt-0.5 flex-shrink-0 w-3 text-center"
                        aria-hidden="true"
                      >
                        ✓
                      </motion.span>

                      {/* Text — fades in 80ms after the checkmark has landed */}
                      <motion.span variants={labelVariant}>
                        {point}
                      </motion.span>
                    </motion.li>
                  ))}
                </ul>

              </motion.div>
            ))}

            {/* ── COLUMN 3 — Quote carousel ─────────────────────────────────
                3 real testimonial quotes cycling every 3 seconds.
                Pauses on hover so users can read the full quote.
                No card/box — transparent background, matching columns 1 & 2.
                Large " marks in blue-axis anchor the quote visually. */}
            <motion.div variants={item} className="flex flex-col">

              <h3 className="font-playfair uppercase tracking-tight text-white-axis text-lg mb-5">
                Solve your problems instantly
              </h3>

              {/* Carousel wrapper: hover detection pauses the auto-advance */}
              <div
                onMouseEnter={() => setQuoteHovered(true)}
                onMouseLeave={() => setQuoteHovered(false)}
                // min-h-[160px]: reserves enough vertical space for the longest quote
                // so the section height never jumps when quotes switch.
                className="relative min-h-[160px]"
              >
                {/* AnimatePresence: the exiting quote fades + slides up before
                    the entering quote fades + slides up from below.
                    mode="wait": exit animation completes before enter begins. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeOut" as const }}
                  >
                    {/* Large opening " — Playfair Display, blue accent, decorative but purposeful:
                        it visually anchors the quote and signals "this is a testimonial". */}
                    <span
                      className="font-playfair text-5xl text-blue-axis leading-none block mb-1"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>

                    {/* Quote body */}
                    <p className="font-instrument text-soft-grey text-sm leading-relaxed mb-4">
                      {TRUST_QUOTES[quoteIndex].text}
                    </p>

                    {/* Attribution — matches the muted style of body text in cols 1 & 2 */}
                    <p className="font-instrument text-xs uppercase tracking-widest text-white-axis/30">
                      — {TRUST_QUOTES[quoteIndex].source}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dot indicator — shows which quote is active (same pattern as BenefitsSection).
                  3 small circles; active dot is full-white, inactive are muted. */}
              <div className="flex gap-2 mt-5">
                {TRUST_QUOTES.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setQuoteIndex(i)}
                    className={[
                      "w-1.5 h-1.5 rounded-full transition-colors",
                      i === quoteIndex ? "bg-white-axis" : "bg-white-axis/20",
                    ].join(" ")}
                    whileHover={{ scale: 1.4 }}
                    transition={{ duration: 0.2, ease: "easeOut" as const }}
                    aria-label={`Show quote ${i + 1}`}
                  />
                ))}
              </div>

            </motion.div>

          </div>
        </motion.div>
        {/* END BLOCK 3 */}


        {/* ══════════════════════════════════════════════════════════════════
            BLOCK 4 — PROCESS SECTION
            3 steps: horizontal on desktop, vertical on mobile.
            Arrow connectors between steps.
            Timeline bar below the steps.
        ══════════════════════════════════════════════════════════════════ */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-24 md:mb-36"
        >

          <motion.h2
            variants={item}
            className="font-playfair uppercase tracking-tight text-white-axis text-2xl md:text-3xl text-center mb-16"
          >
            From Instagram to bookings in 3 simple steps
          </motion.h2>

          {/* Steps row:
              flex-col: stacked vertically on mobile.
              md:flex-row: side-by-side on desktop.
              items-stretch: all step cards share the same height on desktop. */}
          <div className="flex flex-col md:flex-row items-stretch">

            {PROCESS_STEPS.map((step, index) => (
              // Fragment with key: lets us render the card and its connector
              // as siblings in the array without adding an extra DOM wrapper.
              <Fragment key={step.number}>

                {/* STEP CARD */}
                <motion.div
                  variants={item}
                  className="flex-1 bg-grey-axis border border-white-axis/[0.06] rounded-2xl p-8 flex flex-col gap-4"
                  // Hover: lift the card — same pattern as the pricing cards above.
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35, ease: "easeOut" as const }}
                >
                  {/* Step number — large, Playfair, very muted — decorative but purposeful */}
                  <span className="font-playfair text-4xl text-white-axis/20 leading-none">
                    {step.number}
                  </span>

                  {/* h3: sub-item within the Process h2 section */}
                  <h3 className="font-playfair uppercase tracking-tight text-white-axis text-lg leading-snug">
                    {step.title}
                  </h3>

                  <ul className="flex flex-col gap-2">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 font-instrument text-sm text-soft-grey">
                        {/* ✓ hook per BenefitsSection pattern — clear visual confirmation */}
                        <span className="text-blue-axis text-xs mt-0.5 flex-shrink-0 w-3 text-center" aria-hidden="true">✓</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Micro reassurance line — italic, blue accent */}
                  <p className="font-instrument text-xs text-blue-axis uppercase tracking-widest mt-auto">
                    {step.microLine}
                  </p>
                </motion.div>

                {/* DESKTOP CONNECTOR ARROW (not shown after the last step) */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div
                    className="hidden md:flex items-center justify-center px-4 flex-shrink-0"
                    aria-hidden="true"
                  >
                    {/* Arrow: purposeful — shows directional flow between steps */}
                    <span className="text-white-axis/20 text-2xl">→</span>
                  </div>
                )}

                {/* MOBILE VERTICAL CONNECTOR (not shown after the last step) */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div
                    className="flex md:hidden justify-center py-4"
                    aria-hidden="true"
                  >
                    {/* Vertical line: purposeful — shows downward flow on mobile */}
                    <div className="w-px h-8 bg-white-axis/[0.10]" />
                  </div>
                )}

              </Fragment>
            ))}
          </div>

          {/* ── TIMELINE — SystemVisual-style circles + animated lines ────────
              On desktop: node wrappers use flex-1 (matching the step cards' flex-1)
              and connectors use flex-shrink-0 px-4 (matching the arrow connectors).
              This means Day 1 is automatically centred under Card 1, Days 2–7 under
              Card 2, and Days 7-8 under Card 3 — pure CSS flexbox alignment.
              On mobile: nodes and connectors stack vertically.
          ──────────────────────────────────────────────────────────────────── */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8"
          >

            {/* ── DESKTOP TIMELINE ───────────────────────────────────────────
                relative: lets the full-width line be positioned absolutely behind
                the dots, which sit on top via z-10.
                The two invisible flex-shrink-0 spacers preserve the same flex
                column widths as the arrow connectors in the step cards row above,
                keeping each node centred under its card. */}
            <div className="hidden md:flex flex-row items-start relative">

              {/* Full-width line: draws left → right via scaleX 0 → 1.
                  top-[5px]: aligns with the vertical centre of the 12px dot.
                  transformOrigin left: the line grows from the left edge. */}
              <motion.div
                className="absolute left-0 right-0 bg-soft-grey/40 pointer-events-none"
                style={{ top: "5px", height: "1px", transformOrigin: "left" }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" as const, delay: 0.3 }}
                aria-hidden="true"
              />

              {/* Node 1 wrapper — flex-1 matches Card 1 column.
                  z-10: floats above the absolute line. */}
              <motion.div
                variants={timelineNodeVariant}
                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.1 }}
                className="flex-1 flex flex-col items-center text-center relative z-10"
              >
                <div className="w-3 h-3 rounded-full border border-soft-grey bg-black-axis" />
                <p className="font-instrument text-[10px] uppercase tracking-[0.2em] text-blue-axis mt-3 mb-1">
                  Day 1
                </p>
                <p className="font-playfair uppercase tracking-tight text-white-axis text-sm">
                  Call
                </p>
              </motion.div>

              {/* Invisible spacer — same flex-shrink-0 px-4 as the arrow connector,
                  so the flex column widths stay identical to the step cards row. */}
              <div className="flex-shrink-0 px-4" aria-hidden="true" />

              {/* Node 2 wrapper — flex-1 matches Card 2 column */}
              <motion.div
                variants={timelineNodeVariant}
                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.8 }}
                className="flex-1 flex flex-col items-center text-center relative z-10"
              >
                <div className="w-3 h-3 rounded-full border border-soft-grey bg-black-axis" />
                <p className="font-instrument text-[10px] uppercase tracking-[0.2em] text-blue-axis mt-3 mb-1">
                  Days 2–7
                </p>
                <p className="font-playfair uppercase tracking-tight text-white-axis text-sm">
                  Setup
                </p>
              </motion.div>

              {/* Invisible spacer 2 */}
              <div className="flex-shrink-0 px-4" aria-hidden="true" />

              {/* Node 3 wrapper — flex-1 matches Card 3 column */}
              {/* Destination node uses border-white-axis (full brightness) to signal
                  it is the goal state — same convention as SystemVisualSection. */}
              <motion.div
                variants={timelineNodeVariant}
                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 1.5 }}
                className="flex-1 flex flex-col items-center text-center relative z-10"
              >
                <div className="relative flex items-center justify-center">
                  {/* One-shot glow halo */}
                  <motion.div
                    className="absolute w-3 h-3 rounded-full bg-blue-axis/[0.40] pointer-events-none"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 1 }}
                    whileInView={{ opacity: [0, 0.5, 0], scale: [1, 3, 4.5] }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.0, duration: 1.2, ease: "easeOut" as const }}
                  />
                  {/* bg-black-axis fills the dot so the line doesn't bleed through it */}
                  <div className="w-3 h-3 rounded-full border border-white-axis bg-black-axis relative z-10" />
                </div>
                <p className="font-instrument text-[10px] uppercase tracking-[0.2em] text-blue-axis mt-3 mb-1">
                  Days 7-8
                </p>
                <p className="font-playfair uppercase tracking-tight text-white-axis text-sm">
                  Launch
                </p>
              </motion.div>

            </div>
            {/* END DESKTOP TIMELINE */}

            {/* ── MOBILE TIMELINE — stacked vertically ─────────────────────── */}
            <div className="flex md:hidden flex-col items-center">

              {/* Node 1 */}
              <motion.div
                variants={timelineNodeVariant}
                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.1 }}
                className="flex flex-col items-center text-center shrink-0"
              >
                <div className="w-3 h-3 rounded-full border border-soft-grey" />
                <p className="font-instrument text-[10px] uppercase tracking-[0.2em] text-blue-axis mt-3 mb-1">
                  Day 1
                </p>
                <p className="font-playfair uppercase tracking-tight text-white-axis text-sm">
                  Call
                </p>
              </motion.div>

              <div className="flex my-5" aria-hidden="true">
                <svg width="2" height="32" viewBox="0 0 2 32">
                  <motion.path
                    d="M 1 0 L 1 32"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                    className="text-soft-grey"
                    variants={timelineLineVariant}
                    transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.4 }}
                  />
                </svg>
              </div>

              {/* Node 2 */}
              <motion.div
                variants={timelineNodeVariant}
                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.8 }}
                className="flex flex-col items-center text-center shrink-0"
              >
                <div className="w-3 h-3 rounded-full border border-soft-grey" />
                <p className="font-instrument text-[10px] uppercase tracking-[0.2em] text-blue-axis mt-3 mb-1">
                  Days 2–7
                </p>
                <p className="font-playfair uppercase tracking-tight text-white-axis text-sm">
                  Setup
                </p>
              </motion.div>

              <div className="flex my-5" aria-hidden="true">
                <svg width="2" height="32" viewBox="0 0 2 32">
                  <motion.path
                    d="M 1 0 L 1 32"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                    className="text-soft-grey"
                    variants={timelineLineVariant}
                    transition={{ duration: 0.7, ease: "easeOut" as const, delay: 1.1 }}
                  />
                </svg>
              </div>

              {/* Node 3 */}
              <motion.div
                variants={timelineNodeVariant}
                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 1.5 }}
                className="flex flex-col items-center text-center shrink-0"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute w-3 h-3 rounded-full bg-blue-axis/[0.40] pointer-events-none"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 1 }}
                    whileInView={{ opacity: [0, 0.5, 0], scale: [1, 3, 4.5] }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.0, duration: 1.2, ease: "easeOut" as const }}
                  />
                  <div className="w-3 h-3 rounded-full border border-white-axis relative z-10" />
                </div>
                <p className="font-instrument text-[10px] uppercase tracking-[0.2em] text-blue-axis mt-3 mb-1">
                  Days 7-8
                </p>
                <p className="font-playfair uppercase tracking-tight text-white-axis text-sm">
                  Launch
                </p>
              </motion.div>

            </div>
            {/* END MOBILE TIMELINE */}

          </motion.div>
          {/* END TIMELINE */}

        </motion.div>
        {/* END BLOCK 4 */}

        {/* ══════════════════════════════════════════════════════════════════
            BLOCK 6 — EXCLUSIVITY + URGENCY
            Creates a sense of personal attention and limited availability.
            Ends with a repeat of the primary CTA.
        ══════════════════════════════════════════════════════════════════ */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="border border-white-axis/[0.06] rounded-2xl p-8 md:p-16 text-center"
        >

          {/* Accent label */}
          <motion.p
            variants={item}
            className="font-instrument text-blue-axis text-xs uppercase tracking-[0.3em] mb-6"
          >
            Limited availability
          </motion.p>

          {/* h2: section-level headline */}
          <motion.h2
            variants={item}
            className="font-playfair uppercase tracking-tight text-white-axis text-2xl md:text-4xl leading-tight mb-6"
          >
            We&apos;re not a mass product
          </motion.h2>

          <motion.p
            variants={item}
            className="font-instrument text-soft-grey text-sm leading-relaxed max-w-lg mx-auto mb-3"
          >
            We work closely with every studio we onboard.
          </motion.p>
          <motion.p
            variants={item}
            className="font-instrument text-soft-grey text-sm leading-relaxed max-w-lg mx-auto mb-12"
          >
            We adapt everything to your specific needs.
          </motion.p>

          {/* ── SCARCITY BLOCK ────────────────────────────────────────────── */}
          {/* ref={scarcityRef}: tells useInView to watch this element.
              When it enters the viewport, scarcityInView flips to true
              and the countdown useEffect fires for the first time. */}
          <motion.div
            ref={scarcityRef}
            variants={item}
            className="bg-grey-axis border border-white-axis/[0.06] rounded-xl p-6 max-w-sm mx-auto mb-12"
          >
            <p className="font-instrument text-soft-grey text-sm leading-relaxed mb-2">
              We&apos;re currently onboarding{" "}
              <span className="text-white-axis font-semibold">5 studios this month</span>{" "}
              to ensure 100% personal attention
            </p>
            {/* Spots remaining — animated countdown from 5 → 2.
                AnimatePresence: when `spots` changes, the old number plays its exit
                animation (slide down + fade) before the new number enters (slide up + fade).
                key={spots}: changing the key unmounts the old element and mounts a new one,
                which is what triggers AnimatePresence to play the exit → enter sequence. */}
            <div className="flex items-baseline justify-center gap-2 mt-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={spots}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.4, ease: "easeOut" as const }}
                  className="font-playfair text-white-axis text-2xl uppercase tracking-tight leading-none"
                >
                  {spots}
                </motion.span>
              </AnimatePresence>
              <span className="font-playfair text-white-axis text-2xl uppercase tracking-tight leading-none">
                spots left
              </span>
            </div>
          </motion.div>

          {/* ── HUMAN CONNECTION ──────────────────────────────────────────── */}
          <motion.div
            variants={item}
            className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 mb-12"
          >
            {[
              "Free setup",
              "Direct contact with us",
              "Launch in 7 days",
            ].map((point) => (
              <div key={point} className="flex items-center justify-center gap-2">
                <span className="text-blue-axis text-xs" aria-hidden="true">✓</span>
                <span className="font-instrument text-soft-grey text-xs uppercase tracking-widest">
                  {point}
                </span>
              </div>
            ))}
          </motion.div>

          {/* ── REPEAT CTA ────────────────────────────────────────────────── */}
          <motion.div variants={item}>
            <motion.button
              onClick={openModal}
              className="bg-white-axis text-black-axis font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35, ease: "easeOut" as const }}
            >
              get your axis
            </motion.button>
          </motion.div>

        </motion.div>
        {/* END BLOCK 6 */}


      </div>
    </section>
  )
}
