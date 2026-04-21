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
  // ── Founding offer fields (Growth card only) ──────────────────────────────
  foundingRateLabel?: string     // "Founding studio rate (limited)"
  regularPrice?: string          // "$299/month" shown with strikethrough
  earlyAccessBenefits?: string[] // bullet points for Early Access Benefits box
  foundingSpots?: string         // scarcity copy — stored in data so it can be updated without touching JSX
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
      "Clear schedule clients can book instantly",
      "Contact & location",
    ],
    missing: [
      "Accept bookings 24/7",
      "Get paid online",
    ],
    roi: "→ Just 2 extra bookings / month",
    painLine: "For studios that just need an online presence",
    cta: "Get started",
    isHero: false,
  },
  {
    id: "growth",
    title: "Growth",
    price: "$149",
    tagline: "Get booked and paid automatically",
    features: [
      "Everything from Starter",
      "Accept bookings 24/7",
      "Sell memberships & packages",
      "Manage class booking-status",
      "Client list and overview dashboard",
      "SEO Google Search optimization",
    ],
    roi: "→ Just 3 extra bookings / month",
    painLine: "Stop answering the same messages every day.",
    cta: "Claim founding spot",
    isHero: true,
    // Founding offer fields
    foundingRateLabel: "Launch rate (limited)",
    regularPrice: "$299/month",
    foundingSpots: "Only 5 studios — 2 spots remaining",
  },
  {
    id: "pro",
    title: "Pro",
    price: "$399",
    tagline: "For scaling studios",
    features: [
      "All features from Growth",
      "All-in-One Studio Command Dashboard",
      "Weekly Performance Reports",
      "Revenue Dashboard (bookings, memberships, LTV)",
      "Offer Performance Tracking & Demand Insights (optimize schedule and offers for max bookings)",
      "Automated Client Segmentation (new, active, inactive clients)",
    ],
    roi: "→ Just 5 extra bookings / month",
    painLine: "For studios with high demand",
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

// WHY_FIVE_COLUMNS: data for the "Why only 5 studios?" section below the pricing grid.
// Each column has an icon character, title, and body text.
const WHY_FIVE_COLUMNS = [
  {
    title: "Built with real studios",
    text: "We're working closely with a small group to refine the system based on real workflows.",
  },
  {
    title: "High-quality setup",
    text: "Each studio gets a fully customized setup, not a template.",
  },
  {
    title: "Direct support",
    text: "You'll have direct access during setup and launch.",
  },
]

// TrustColumn: TypeScript type for each column in the Trust Layer.
// h3Delay: absolute seconds from whileInView trigger when the heading appears.
// bulletDelays: a 3-tuple of absolute delays, one per bullet row.
type TrustColumn = {
  id: string
  heading: string
  points: string[]
  h3Delay: number
  bulletDelays: [number, number, number]
}

// These two columns appear in the Trust Layer section.
// Delays are calibrated for a sequential left-to-right reading-order reveal:
//   h2 (0.0s) → col1 h3 (0.3s) → col1 bullets → col2 h3 (1.40s) → col2 bullets
const TRUST_COLUMNS: TrustColumn[] = [
  {
    id: "setup",
    heading: "We set everything up",
    points: ["Website ready in days", "We connect everything", "No technical work"],
    h3Delay: 0.3,
    bulletDelays: [0.60, 0.82, 1.04],
  },
  {
    id: "risk",
    heading: "No risk to try",
    points: ["No upfront cost", "No hidden fees", "Cancel after 3 months"],
    h3Delay: 1.40,
    bulletDelays: [1.65, 1.87, 2.09],
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
// custom (d): absolute delay in seconds, passed via the `custom` prop on each motion element.
// Using a function variant lets each element carry its own explicit delay rather than
// relying on staggerChildren, which broke the sequential chain across columns.
const checkmarkVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: (d: number) => ({ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const, delay: d } }),
}

// labelVariant: the text fades in after the checkmark has settled.
// d + 0.1: label always lags 100ms behind its checkmark — same relative offset as before,
// now expressed as an absolute delay instead of a staggerChildren offset.
const labelVariant: Variants = {
  hidden: { opacity: 0 },
  show: (d: number) => ({ opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const, delay: d + 0.1 } }),
}

// mobileCheckmarkVariant: on mobile the ✓ "stamps" into place (scale 0.4 → 1)
// rather than sliding from the left. Feels like a quality seal confirming each point.
const mobileCheckmarkVariant: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: (d: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const, delay: d } }),
}

// mobileLabelVariant: on mobile the text slides in from the left after the stamp.
// x: -6 → 0 reinforces reading direction and connects to the stamp animation.
const mobileLabelVariant: Variants = {
  hidden: { opacity: 0, x: -6 },
  show: (d: number) => ({ opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const, delay: d + 0.1 } }),
}

// seqStep: fade + slide up driven by an explicit absolute delay (custom prop).
// Used for h2, h3 elements in the Trust Layer so they all share one whileInView
// trigger but appear in a strict reading-order sequence.
const seqStep: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: d },
  }),
}

// seqFade: pure opacity fade with an explicit delay.
// Used for the quote section — slower duration (1.0s) gives the testimonial a
// softer, more reflective entrance compared to the crisp bullet animations above.
const seqFade: Variants = {
  hidden: { opacity: 0 },
  show: (d: number) => ({
    opacity: 1,
    transition: { duration: 1.0, ease: "easeOut" as const, delay: d },
  }),
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

// mobileVerticalLineVariant: the single track line that draws itself top-to-bottom on mobile,
// behind all nodes and cards. transformOrigin "top" (set via style prop) makes scaleY grow
// downward. Duration 2.5s covers the full sequence so the line leads the eye throughout.
const mobileVerticalLineVariant: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  show: { scaleY: 1, opacity: 1, transition: { duration: 5.5, ease: "easeOut" as const, delay: 0 } },
}

// mobileNodeStampVariant: the entire node row (dot + label) stamps into place.
// scale: 0.5 → 1 feels like a system checkpoint locking onto its position.
// custom (d): absolute delay so each node appears in strict sequence after the line passes it.
const mobileNodeStampVariant: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: (d: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const, delay: d } }),
}

// mobileNodeGlowVariant: one-shot glow that expands and fades as the node stamps in.
// opacity/scale arrays are Framer Motion keyframes: 0 → peak → 0 gives a single pulse.
// Signals the checkpoint has activated — like a node lighting up in the system diagram.
const mobileNodeGlowVariant: Variants = {
  hidden: { opacity: 0, scale: 1 },
  show: (d: number) => ({
    opacity: [0, 0.6, 0],
    scale: [1, 2.5, 3.5],
    transition: { duration: 0.8, ease: "easeOut" as const, delay: d },
  }),
}

// mobileStepCardVariant: each card slides down (y: 20 → 0) after its node appears.
// Top-to-bottom motion reinforces the downward reading direction of the timeline.
const mobileStepCardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay: d } }),
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

  // isMobile: true when the viewport is narrower than the md breakpoint (768px).
  // Switches bullet animations between the stamp (mobile) and slide (desktop) variants.
  // Recalculates if the window is resized (e.g. rotating a phone to landscape).
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

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
            className="font-instrument text-soft-grey text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6"
          >
            Get more clients, accept payments, and stop managing your studio in DMs
          </motion.p>

          {/* ── FOUNDING ANNOUNCEMENT BAR ─────────────────────────────────
              Minimal one-liner signalling limited early access.
              Appears between subheadline and trust indicators.
              No background box — stays part of the text flow.
              A small blue dot acts as a subtle accent before the text. */}
          <motion.p
            variants={item}
            className="font-instrument text-soft-grey/70 text-xs text-center mb-10 flex items-center justify-center gap-2"
          >
            {/* Blue dot — decorative, signals "active / live" status */}
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-axis flex-shrink-0" aria-hidden="true" />
            Launching with 5 studios — limited early access
          </motion.p>

          {/* ── MICRO TRUST BAR ────────────────────────────────────────────
              4 short trust signals in a horizontal row.
              flex-wrap: naturally wraps to a second row on narrow screens. */}
          {/* flex-col items-center: stacks trust signals vertically on mobile.
              md:flex-row md:flex-wrap md:justify-center: switches to a horizontal
              wrapping row on desktop. Updated copy matches the card guarantees. */}
          <motion.div
            variants={item}
            className="flex flex-col ml-20 gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-10"
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
                // snap-center for Growth: centers it in the viewport on mobile swipe.
                // snap-start for the others: aligns left edge to viewport edge.
                card.isHero ? "snap-center shrink-0 w-[75vw] md:w-auto" : "snap-start shrink-0 w-[75vw] md:w-auto",
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

              {/* ── HERO BADGES (Growth card only) ───────────────────────────
                  Two stacked badges: FOUNDING OFFER (new) above MOST POPULAR (existing).
                  Uses blue-axis only — no second accent colour. */}
              {card.isHero && (
                <div className="text-center mb-6 flex flex-col items-center gap-2">
                  {/* Founding offer badge — filled blue pill, slightly larger on mobile for visibility */}
                  <span className="font-instrument text-[10px] md:text-[10px] uppercase tracking-[0.25em] text-black-axis bg-blue-axis px-4 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,51,255,0.45)]">
                    Founding Offer
                  </span>
                  {/* Most popular — keeps its existing outline style */}
                  <span className="font-instrument text-[10px] uppercase tracking-[0.25em] text-blue-axis border border-blue-axis/40 px-4 py-1.5 rounded-full">
                    ★ Most popular
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

                {/* ── FOUNDING PRICE CONTEXT (Growth card only) ───────────
                    "Founding studio rate (limited)" labels this as the special rate.
                    The regular price is shown with line-through to signal savings.
                    mt-3: breathing room below the main price. */}
                {card.isHero && card.foundingRateLabel && (
                  <div className="mt-3 flex flex-col gap-1">
                    <p className="font-instrument text-blue-axis text-xs uppercase tracking-widest">
                      {card.foundingRateLabel}
                    </p>
                    {card.regularPrice && (
                      <p className="font-instrument text-soft-grey/60 text-xs">
                        Regular price:{" "}
                        <span className="line-through">{card.regularPrice}</span>
                      </p>
                    )}
                  </div>
                )}
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
                "font-instrument text-sm leading-relaxed mb-8", "text-white-axis font-semibold","text-center",
              ].join(" ")}>
                {card.painLine}
              </p>

              {/* ── SCARCITY LINE (Growth card only) ─────────────────────────
                  Dynamic-ready: the copy lives in card.foundingSpots in the data array,
                  so it can be updated (e.g. "1 spot remaining") without editing JSX.
                  my-4 md:my-3: extra vertical space on mobile so it doesn't feel cramped. */}
              {card.isHero && card.foundingSpots && (
                <p className="font-instrument text-white-axis/80 text-xs text-center my-4 md:my-3 uppercase tracking-widest">
                  {card.foundingSpots}
                </p>
              )}

              {/* ── CTA BUTTON ──────────────────────────────────────────────
                  mt-auto: pushes the button to the bottom of the flex column
                           so all three card CTAs align at the same vertical position.
                  component.md: always use <button> — never <a> styled as a button.
                  py-5 md:py-4 on the hero card: slightly taller tap target on mobile. */}
              <motion.button
                onClick={openModal}
                className={[
                  "mt-auto w-full font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-6",
                  card.isHero ? "py-5 md:py-4" : "py-4",
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
            BLOCK 2.5 — FOUNDING OFFER STRIP
            Compact promotional banner placed directly below the pricing cards.
            Desktop: 3 horizontal zones (heading | paragraph | chips).
            Mobile: stacked vertically (heading → paragraph → chips → spots left).
            Feels like a promotion banner, not a text section.
        ══════════════════════════════════════════════════════════════════ */}

        {/* motion.div with whileInView: fades + slides up when scrolled into view.
            rounded-2xl: same border-radius as the pricing cards above.
            bg-grey-axis + border-blue-axis: stands out from the black background
            without overpowering the cards. relative overflow-hidden: needed so the
            absolutely-positioned glow cannot bleed outside the rounded corners. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-24 md:mb-36 rounded-2xl px-6 py-5 md:px-8 md:py-6 relative overflow-hidden border border-blue-axis/[0.25] bg-grey-axis md:w-fit md:mx-auto"
        >

          {/* Subtle blue tint overlay — creates the "dark blue / accent tint" gradient feel
              without using any hardcoded hex values. pointer-events-none so it never
              blocks interaction with text or buttons below it. */}
          <div
            className="absolute inset-0 bg-blue-axis/[0.04] rounded-2xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Soft ambient glow — same technique as the Growth card's glow above.
              Positioned top-right to create directionality without overpowering. */}
          <div
            className="absolute top-0 right-0 h-40 w-64 rounded-full bg-blue-axis/[0.10] blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Centered stacked layout: pill title → paragraph → chips.
              items-center + text-center: everything centered on both mobile and desktop.
              gap-5: consistent breathing room between each zone. */}
          <div className="flex flex-col items-center gap-5 relative text-center">

            {/* ── Title pill — identical design to the "Founding Offer" badge on the
                Growth pricing card above: filled blue, dark text, rounded-full, glow. */}
            <span className="font-instrument text-[10px] md:text-xs uppercase tracking-[0.25em] text-black-axis bg-blue-axis px-4 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,51,255,0.45)]">
              Founding Offer
            </span>

            {/* ── Paragraph — max-w-xl keeps line length comfortable on wide screens */}
            <p className="font-instrument text-soft-grey text-xs leading-relaxed max-w-xl">
              We&apos;re onboarding a small group of studios as we launch this system.
              You&apos;ll get priority setup for a faster go-live, features tailored to
              your exact needs, and a locked-in discounted rate as an early partner.
            </p>

            {/* ── Chips row — justify-center centers the row; flex-wrap lets chips
                flow onto a second line on narrow screens.
                whitespace-nowrap: each chip label stays on one line. */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Priority setup",
                "Features tailored to your studio",
                "Discounted lifetime rate",
              ].map((chip) => (
                <span
                  key={chip}
                  className="font-instrument text-[10px] uppercase tracking-widest text-soft-grey border border-white-axis/[0.15] rounded-full px-3 py-1.5 whitespace-nowrap"
                >
                  {chip}
                </span>
              ))}
            </div>

          </div>

        </motion.div>
        {/* END BLOCK 2.5 */}


        {/* ══════════════════════════════════════════════════════════════════
            BLOCK 3 — TRUST LAYER
            Title → 3 columns: Setup / Risk / Real problem quotes.
        ══════════════════════════════════════════════════════════════════ */}

        {/* Block 3 outer wrapper.
            No `variants={container}` here — we've replaced staggerChildren with
            explicit absolute delays on each child (seqStep / seqFade / custom prop).
            whileInView="show" is the trigger: the moment this div enters the viewport,
            Framer Motion sets state to "show", which every descendant motion element
            reads and uses to start its own individually-delayed transition.
            Framer Motion propagates animation state through plain <div> children, so
            we don't need every wrapper to be a motion element. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="ml-5 mb-24 md:mb-36"
        >

          {/* h2: section-level headline per SEO rules — one per section.
              seqStep custom={0}: appears immediately when the section enters view. */}
          <motion.h2
            variants={seqStep}
            custom={0}
            className="font-playfair uppercase tracking-tight text-white-axis text-2xl md:text-3xl mb-16"
          >
            You don&apos;t have to figure this out
          </motion.h2>

          {/* 3-column grid on desktop, stacked on mobile.
              Plain <div> — Framer Motion propagates "show" state through it to all
              motion descendants below without this needing to be a motion element. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

            {/* ── COLUMNS 1 & 2 — Setup and Risk ───────────────────────────
                Each column is a plain div — no stagger orchestration needed here
                because every element carries its own absolute delay via `custom`.
                Reading order: col.h3Delay → col.bulletDelays[0..2] */}
            {TRUST_COLUMNS.map((col) => (
              <div key={col.id}>

                {/* h3: fades + slides up at its column-specific h3Delay. */}
                <motion.h3
                  variants={seqStep}
                  custom={col.h3Delay}
                  className="font-playfair uppercase tracking-tight text-white-axis text-lg mb-5"
                >
                  {col.heading}
                </motion.h3>

                {/* Each li is a plain element — no bulletItemContainer stagger needed.
                    The checkmark and label each carry their own absolute delay via `custom`.
                    bulletIndex 0/1/2 selects the matching delay from col.bulletDelays. */}
                <ul className="flex flex-col gap-3">
                  {col.points.map((point, bulletIndex) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 font-instrument text-sm text-soft-grey"
                    >
                      {/* ✓ — on mobile: stamps into place (scale). On desktop: slides from left.
                          custom passes the absolute delay; the variant function reads it as `d`. */}
                      <motion.span
                        variants={isMobile ? mobileCheckmarkVariant : checkmarkVariant}
                        custom={col.bulletDelays[bulletIndex]}
                        className="text-blue-axis text-xs mt-0.5 flex-shrink-0 w-3 text-center"
                        aria-hidden="true"
                      >
                        ✓
                      </motion.span>

                      {/* Text — on mobile: slides in from left. On desktop: fades in only.
                          The variant adds 0.1s on top of the bullet delay (label always lags checkmark). */}
                      <motion.span
                        variants={isMobile ? mobileLabelVariant : labelVariant}
                        custom={col.bulletDelays[bulletIndex]}
                      >
                        {point}
                      </motion.span>
                    </li>
                  ))}
                </ul>

              </div>
            ))}

            {/* ── COLUMN 3 — Quote carousel ─────────────────────────────────
                3 real testimonial quotes cycling every 3 seconds.
                Pauses on hover so users can read the full quote.
                No card/box — transparent background, matching columns 1 & 2.
                Large " marks in blue-axis anchor the quote visually.
                Plain div wrapper — state propagates through it from the outer motion.div. */}
            <div className="flex flex-col">

              {/* h3 appears at 2.45s — after all col2 bullets have landed (last at 2.09s).
                  The 0.36s pause gives breathing room before the third column begins. */}
              <motion.h3
                variants={seqStep}
                custom={2.45}
                className="font-playfair uppercase tracking-tight text-white-axis text-lg mb-5"
              >
                Solve your problems instantly
              </motion.h3>

              {/* Quote carousel + dots wrapped together in a seqFade.
                  duration 1.0s (slower than the bullets) gives the testimonial a
                  softer entrance — it's a moment of reflection, not a rapid-fire list.
                  custom={2.8}: 0.35s after the h3, matching the h2→h3 spacing pattern. */}
              <motion.div
                variants={seqFade}
                custom={2.8}
                className="flex flex-col"
              >

                {/* Carousel wrapper: hover detection pauses the auto-advance */}
                <div
                  onMouseEnter={() => setQuoteHovered(true)}
                  onMouseLeave={() => setQuoteHovered(false)}
                  // h-[210px] overflow-hidden: fixed height sized to the longest quote (quote 2,
                  // 3 lines of body + attribution) so the section height never shifts when quotes switch.
                  className="relative h-[210px] overflow-hidden"
                >
                  {/* AnimatePresence: the exiting quote fades + slides up before
                      the entering quote fades + slides up from below.
                      mode="wait": exit animation completes before enter begins. */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quoteIndex}
                      // absolute inset-0: layers all quotes in the same fixed space so entering/exiting
                      // quotes don't affect document flow or push surrounding content.
                      className="absolute inset-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease: "easeOut" as const }}
                    >
                      {/* Large opening " — Playfair Display, blue accent, decorative but purposeful:
                          it visually anchors the quote and signals "this is a testimonial". */}
                      <span
                        className="font-playfair text-5xl text-blue-axis leading-none block mb-1 text-left"
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
                <div className="flex justify-start gap-2 mt-5">
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

          {/* Steps row — DESKTOP ONLY.
              hidden: hides on mobile (the merged layout below takes over).
              md:flex md:flex-row: side-by-side grid on desktop.
              items-stretch: all step cards share the same height on desktop. */}
          <div className="hidden md:flex md:flex-row items-stretch">

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

          {/* ── MOBILE MERGED LAYOUT — nodes interleaved with cards ──────────
              Visible on mobile only (md:hidden). Replaces both the desktop
              step-card row and the old separate mobile timeline.
              A single vertical line (A) draws top-to-bottom behind all elements.
              Each node stamps in (B) then its card slides down (C).
              The line is absolutely positioned at left-[5px] — the centre of the
              10px-wide dot — so it always passes precisely through each node. */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex md:hidden flex-col relative"
          >

            {/* Vertical line — z-0 keeps it behind nodes (z-10) and cards (z-10).
                bg-black-axis on each dot and bg-grey-axis on each card cover the
                line as it passes through them, creating the "line behind" effect.
                transformOrigin top (via style): scaleY grows downward from the first node. */}
            <motion.div
              className="absolute left-[5px] top-0 bottom-0 w-px bg-soft-grey/40 z-0 pointer-events-none"
              style={{ transformOrigin: "top" }}
              variants={mobileVerticalLineVariant}
              aria-hidden="true"
            />

            {PROCESS_STEPS.map((step, index) => {
              // Delays timed so each node appears just as the line reaches it,
              // and each card follows 0.4s later — giving the feeling of the line
              // "leading" the eye to each checkpoint before the content reveals.
              // node 1: 0.5s, card 1: 0.9s
              // node 2: 2.5s, card 2: 2.9s
              // node 3: 4.5s, card 3: 4.9s
              const NODE_DELAYS = [0.5, 2.5, 4.5] as const
              const nodeDelay = NODE_DELAYS[index]
              const cardDelay = nodeDelay + 0.4
              const nodeLabel = (["Day 1", "Days 2–7", "Days 7–8"] as const)[index]

              return (
                <div key={step.number} className="flex flex-col">

                  {/* NODE ROW: ● Day X ──────────────────────────────────────────
                      The whole row (dot + label) stamps in via mobileNodeStampVariant.
                      z-10: floats above the absolutely-positioned vertical line. */}
                  <motion.div
                    variants={mobileNodeStampVariant}
                    custom={nodeDelay}
                    className="flex items-center gap-3 relative z-10 mb-4"
                  >
                    {/* Dot container: relative so the glow div can be abs-positioned inside */}
                    <div
                      className="relative flex items-center justify-center flex-shrink-0"
                      style={{ width: "10px", height: "10px" }}
                    >
                      {/* One-shot glow: expands and fades once as the node stamps in.
                          custom fires 0.1s after the node so the glow trails the stamp. */}
                      <motion.div
                        className="absolute rounded-full bg-blue-axis/40 pointer-events-none"
                        style={{ width: "10px", height: "10px" }}
                        aria-hidden="true"
                        variants={mobileNodeGlowVariant}
                        custom={nodeDelay + 0.1}
                      />
                      {/* bg-black-axis fills the dot so the vertical line doesn't bleed through */}
                      <div className="w-2.5 h-2.5 rounded-full border border-soft-grey bg-black-axis relative z-10" />
                    </div>

                    {/* Day label — same style as the desktop timeline labels */}
                    <p className="font-instrument text-[10px] uppercase tracking-[0.2em] text-blue-axis">
                      {nodeLabel}
                    </p>
                  </motion.div>

                  {/* CARD ────────────────────────────────────────────────────────
                      Slides down (y: 20 → 0) after its node — reinforces top-to-bottom
                      reading direction (animation C).
                      z-10: sits above the vertical line; bg-grey-axis covers the line
                      so the "line passes behind card" effect is automatic. */}
                  <motion.div
                    variants={mobileStepCardVariant}
                    custom={cardDelay}
                    className="bg-grey-axis border border-white-axis/[0.06] rounded-2xl p-8 flex flex-col gap-4 relative z-10 mb-8"
                  >
                    {/* Large muted step number — decorative, signals position in sequence */}
                    <span className="font-playfair text-4xl text-white-axis/20 leading-none">
                      {step.number}
                    </span>
                    {/* h3: sub-item within the "3 simple steps" h2 section */}
                    <h3 className="font-playfair uppercase tracking-tight text-white-axis text-lg leading-snug">
                      {step.title}
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {step.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 font-instrument text-sm text-soft-grey">
                          <span className="text-blue-axis text-xs mt-0.5 flex-shrink-0 w-3 text-center" aria-hidden="true">✓</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {/* Micro reassurance — italic blue, same as desktop cards */}
                    <p className="font-instrument text-xs text-blue-axis uppercase tracking-widest mt-auto">
                      {step.microLine}
                    </p>
                  </motion.div>

                </div>
              )
            })}

          </motion.div>
          {/* END MOBILE MERGED LAYOUT */}

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

          {/* Three sentences grouped together with even mb-3 spacing between them.
              The last sentence has mb-10 to create clear breathing room before the
              scarcity card below — separating the narrative from the social proof. */}
          <motion.p
            variants={item}
            className="font-instrument text-soft-grey text-sm leading-relaxed max-w-lg mx-auto mb-3"
          >
            We work closely with every studio we onboard.
          </motion.p>
          <motion.p
            variants={item}
            className="font-instrument text-soft-grey text-sm leading-relaxed max-w-lg mx-auto mb-3"
          >
            We adapt everything to your specific needs.
          </motion.p>
          <motion.p
            variants={item}
            className="font-instrument text-soft-grey text-sm leading-relaxed max-w-lg mx-auto mb-10"
          >
            You&apos;ll have direct support during setup and launch.
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
            className="flex flex-col md:flex-row md:justify-center gap-6 md:gap-12 mb-12"
          >
            {[
              "Free setup",
              "Direct contact with us",
              "Launch in 7 days",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2">
                <span className="text-blue-axis text-xs" aria-hidden="true">✓</span>
                <span className="font-instrument text-soft-grey text-xs uppercase tracking-widest">
                  {point}
                </span>
              </div>
            ))}
          </motion.div>

          {/* ── REPEAT CTA ────────────────────────────────────────────────── */}
          <motion.div variants={item}>
            {/* Founding urgency line — appears directly above the CTA button.
                Connects limited availability to the price-increase consequence. */}
            <p className="font-instrument text-soft-grey text-xs uppercase tracking-widest text-center mb-6">
              Founding spots are limited — once filled, pricing increases
            </p>
            <motion.button
              onClick={openModal}
              className="bg-white-axis text-black-axis font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35, ease: "easeOut" as const }}
            >
              Apply for early access
            </motion.button>
            <motion.p
            className="font-instrument tracking-tight text-soft-grey text-sm md:text-sm mt-3"
          >
            Start in less than 2 minutes <br />
            No credit card required
            
          </motion.p>
          </motion.div>

        </motion.div>
        {/* END BLOCK 6 */}


      </div>
    </section>
  )
}
