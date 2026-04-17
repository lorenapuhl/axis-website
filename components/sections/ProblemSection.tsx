"use client"
// "use client" must be the absolute first line.
// This component uses useState (active card tracking) and Framer Motion's
// whileInView / AnimatePresence — all browser-only APIs that require a Client Component.

import { useState, useEffect } from "react"
// next/image: Next.js optimized image component. Required for all images.
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
// Variants: Framer Motion TypeScript type for named animation state objects.
// Without it, TypeScript widens literal strings (e.g. "easeOut") to `string`,
// which breaks the expected Easing union type.
import type { Variants } from "framer-motion"
import { CardStack } from "@/components/ui/card-stack"
import type { CardStackItem } from "@/components/ui/card-stack"

// ─────────────────────────────────────────────────────────────────────────────
// TYPE
// ProblemCard extends the base CardStackItem type.
// TypeScript "extends" is like Python class inheritance — ProblemCard inherits
// all fields from CardStackItem and adds two more:
//   tag      — short label shown top-left of each card (e.g. "DM overload")
//   imageAlt — descriptive alt text for image cards (SEO + accessibility)
//              undefined for the JSX card (id=4) which has no image
// ─────────────────────────────────────────────────────────────────────────────
type ProblemCard = CardStackItem & {
  tag: string
  imageAlt?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// Six real pain points fitness studio owners face daily.
// Cards 1–3 and 5–6 use real screenshots (img_1.png → img_6.png, no img_4).
// Card 4 (id=4) uses a hand-built JSX fragment with a light bg to simulate
// a Google search results page.
// ─────────────────────────────────────────────────────────────────────────────
const items: ProblemCard[] = [
  {
    id: 1,
    title: "+47 DMs today",
    description: "Clients asking for schedule, prices, availability",
    tag: "DM overload",
    imageAlt: "Instagram DM inbox flooded with unread messages from clients asking about schedules, prices, and availability",
  },
  {
    id: 2,
    title: "Where do I book?",
    description: "Visitors don't find a clear next step",
    tag: "No structure",
    imageAlt: "Instagram profile page with no booking button or clear call to action for new visitors",
  },
  {
    id: 3,
    title: "Seen \u2022 no reply",
    description: "Conversations drop off before booking",
    tag: "Lost clients",
    imageAlt: "Instagram chat showing a studio conversation that went cold — message sent, seen, but client never booked",
  },
  {
    id: 4,
    title: "Pilates near me",
    description: "Your studio doesn't show up",
    tag: "No Google presence",
    imageAlt: "Google search results for 'pilates near me' showing competitor studios but not your studio",
  },
  {
    id: 5,
    title: "\u201cCheck our Story highlights\u201d",
    description: "Making clients hunt through 40 highlights just to find a price list.",
    tag: "Bad UX",
    imageAlt: "Instagram story highlights screen packed with dozens of vaguely labeled circles, making it impossible to find a price list",
  },
  {
    id: 6,
    title: "Everything is manual",
    description: "DMs, notes, calendar, payments",
    tag: "No system",
    imageAlt: "Phone home screen showing multiple disconnected apps — WhatsApp, Calendar, Notes, Trello — each with a notification backlog",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// TEXT BLOCK CONTENT
// Each entry maps to a card by array index (0-based, matches items above).
// Shown in the right-panel that sits beside the CardStack on desktop.
//   title       — uppercase label (e.g. "DM OVERLOAD")
//   line1       — first line of paragraph: muted/grey, normal weight
//   line2       — second line: white, bold — the punchline
//   quote       — real quote from a studio owner (sourced from prompts/problem-quotes.md)
//   attribution — speaker name and studio, displayed below the quote
// ─────────────────────────────────────────────────────────────────────────────
const TEXT_CONTENT = [
  {
    title: "DM OVERLOAD",
    line1: "Clients constantly ask for schedules, prices, and availability in DMs.",
    line2: "You spend hours replying manually instead of running your studio.",
    quote: "\"I did everything — managing socials and outreach... If a client needed me at 6am, I was there. [...]\"",
    attribution: "— Gaby Noble, Founder of Exhale Pilates, London",
  },
  {
    title: "NO STRUCTURE",
    line1: "Visitors land on your Instagram but don't know how to book a class.",
    line2: "Without a clear next step, most leave without taking action.",
    quote: "\"Having thousands of followers who don't take your classes, don't engage with your product, and don't live in a vicinity [...] doesn't help you out in the day-to-day.\"",
    attribution: "— Lesley Logan, Pilates Studio Owner",
  },
  {
    title: "LOST CLIENTS",
    line1: "Conversations start in DMs but rarely turn into confirmed bookings.",
    line2: "Each back-and-forth increases the chance the client disappears.",
    quote: "\"Consumers demand immediate responses [...]. How quickly you respond can determine whether they become a paying member or walk away.\"",
    attribution: "— Jim Thomas, Founder and President of Fitness Management USA",
  },
  {
    title: "NO GOOGLE PRESENCE",
    line1: "People search for studios like yours on Google but can't find you.",
    line2: "You miss high-intent clients who are ready to book.",
    quote: "\"Engagement is down. Posts aren't reaching people anymore. We're getting likes, but not bookings.\"",
    attribution: "— Fitness Studio Owner (via AppInstitute research)",
  },
  {
    title: "BAD UX",
    line1: "Important information is buried in story highlights and scattered posts.",
    line2: "Clients waste time searching and often give up before booking.",
    quote: "\"From spending hours and hours with inquiries and problems that kept cropping up [...]\"",
    attribution: "— Michelle Koton, Owner of MPower Pilates, Sydney",
  },
  {
    title: "NO SYSTEM",
    line1: "Bookings, payments, schedules, and messages are handled across different tools.",
    line2: "Without a system, everything depends on you and nothing scales.",
    quote: "\"Before, I had spreadsheets which I had to juggle, and occasionally I would miss payments. Six months later I'd realize someone hadn't paid me and it was too late to ask them.\"",
    attribution: "— Jane Mansley, Owner of Ease Pilates, Cambridge",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL ANIMATION VARIANTS
// Per animate-section.md: 0.7s default, easeOut, stagger 0.12s.
// "container" coordinates when children animate (staggerChildren).
// "item" is the actual per-element fade-up animation.
// ─────────────────────────────────────────────────────────────────────────────
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

const animItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}


// ─────────────────────────────────────────────────────────────────────────────
// RENDER CARD FUNCTION
// Passed as the `renderCard` prop to CardStack.
// CardStack calls this once per visible card, giving us full control over
// each card's visual content.
// All 6 cards show a full-bleed screenshot from public/problems_visual/.
// The only overlay is the active pulse ring.
// ─────────────────────────────────────────────────────────────────────────────
function renderProblemCard(
  cardItem: ProblemCard,
  state: { active: boolean },
) {
  return (
    // relative + overflow-hidden: the pulse ring is absolutely positioned
    // inside this boundary.
    <div className="relative h-full w-full overflow-hidden">

      {/* Full-bleed screenshot.
          `fill` stretches the image to cover the parent's width and height.
          The parent (CardStack's card div) has explicit px dimensions set via
          the cardWidth/cardHeight props (260×210), so fill works correctly.
          No width/height props needed when using fill — parent dimensions apply. */}
      <Image
        src={`/problems_visual/img_${cardItem.id}.png`}
        alt={cardItem.imageAlt ?? cardItem.title}
        fill
        // object-cover: scales the image to fill the card without distortion,
        // cropping edges if the aspect ratio doesn't match exactly.
        className="object-cover"
        draggable={false}
      />

      {/* ── ACTIVE CARD PULSE RING ──────────────────────────────────────── */}
      {/* Shown only when this card is the active (front) card.
          Breathes slowly to draw focus without being distracting. */}
      {state.active && (
        <motion.div
          className="absolute inset-0 z-30 rounded-xl border border-white-axis/15 pointer-events-none"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ProblemSection() {
  // activeIndex: 0-based index of the card currently in front of the stack.
  // Initialized to 0 (first card). Updated by the onChangeIndex callback
  // that CardStack fires whenever the active card changes (auto-advance or click).
  // Drives the right-panel text and quote.
  const [activeIndex, setActiveIndex] = useState(0)

  // cardDims: responsive card dimensions — smaller on phone (< 768px = md breakpoint),
  // standard size on desktop. Reads window.innerWidth in useEffect because `window`
  // doesn't exist on the server; this component is client-only but the initial render
  // happens server-side. useState default = desktop values to avoid layout shift.
  const [cardDims, setCardDims] = useState({ width: 360, height: 290, lift: 50, yJitter: [100, -30, 50, -70, 80, -50, 90] })

  useEffect(() => {
    function update() {
      if (window.innerWidth < 768) {
        // On phone: narrower card (fits within 375px content area), shorter height,
        // reduced lift so the lifted card doesn't bleed into the text below,
        // and tighter Y jitter so cards don't spread too far vertically on small screens.
        setCardDims({ width: 280, height: 220, lift: 35, yJitter: [20, -8, 14, -18, 22, -12, 18] })
      } else {
        setCardDims({ width: 360, height: 290, lift: 50, yJitter: [100, -30, 50, -70, 80, -50, 90] })
      }
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    // relative: anchor for the absolutely-positioned background chaos layer.
    // overflow-hidden: clips floating chaos elements near the edges.
    // bg-black-axis: this section is part of the same dark system — not a break.
    <section className="relative overflow-hidden bg-black-axis py-20 px-6 md:py-26 md:px-6">

      {/* ── BACKGROUND CHAOS LAYER ────────────────────────────────────────── */}
      {/*
        Floating notification fragments at ~6% opacity.
        Creates ambient chaos behind the card stack without distracting from content.
        Each element:
          - Absolutely positioned within the <section>
          - Oscillates slowly on the Y axis (7–11s cycles)
          - Different delay so they never move in sync
          - pointer-events-none: never intercepts user interactions
          - aria-hidden: purely decorative, invisible to screen readers
      */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">

        <motion.div
          className="absolute left-[4%] top-[22%] font-instrument text-xs text-white-axis opacity-[0.06]"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, delay: 0 }}
        >
          +3
        </motion.div>

        <motion.div
          className="absolute left-[87%] top-[14%] font-instrument text-xs text-white-axis opacity-[0.06]"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, delay: 1.2 }}
        >
          ●●●
        </motion.div>

        <motion.div
          className="absolute left-[9%] top-[73%] font-instrument text-xs text-white-axis opacity-[0.06]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 2.4 }}
        >
          +12
        </motion.div>

        <motion.div
          className="absolute left-[83%] top-[67%] font-instrument text-xs text-white-axis opacity-[0.06]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, delay: 3.6 }}
        >
          DM
        </motion.div>

        <motion.div
          className="absolute left-[47%] top-[6%] font-instrument text-xs text-white-axis opacity-[0.06]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 11, ease: "easeInOut", repeat: Infinity, delay: 1.5 }}
        >
          +47
        </motion.div>

      </div>
      {/* END BACKGROUND CHAOS LAYER */}

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      {/* relative z-10: sits above the background chaos layer.
          max-w-6xl mx-auto: constrains content to 1152px, centered. */}
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── MOBILE-ONLY HEADLINE ─────────────────────────────────────────── */}
        {/* block md:hidden: visible ONLY on mobile (< 768px).
            On desktop the headline lives inside the right column next to the stack.
            Placed here so on mobile (flex-col) it renders FIRST — above the card
            stack — with no overlap risk.
            mb-10: breathing room between headline and the card stack below. */}
        <motion.div
          className="block md:hidden mb-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair uppercase tracking-tight text-white-axis text-4xl leading-tight">
            Your studio has visibility — but no structure.
          </h2>
        </motion.div>
        {/* END MOBILE-ONLY HEADLINE */}

        {/* ── 2-COLUMN LAYOUT ─────────────────────────────────────────────── */}
        {/*
          On mobile (default): flex-col stacks left col above right col.
          On md+: flex-row places CardStack (50%) left and right panel (50%) right.
          md:items-center: vertically centers the two columns relative to each other.
          md:gap-16: generous horizontal spacing between columns (4rem).
        */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-20">

          {/* ── LEFT COLUMN: CARD STACK ─────────────────────────────────── */}
          {/*
            md:w-[50%]: occupies 50% of the row on desktop.
            On mobile, this stacks above the right panel.
            The CardStack is centered within this column via flex/justify.
          */}
          {/* pb-16 on mobile: extra space below the card pile so the background
              cards (which extend downward) don't bleed into the text panel below.
              md:pb-0: no bottom padding needed on desktop (side-by-side layout). */}
          {/* flex-col so the custom dots render directly below the card stack.
              showDots={false} disables CardStack's built-in dots — they use
              `bg-foreground` which is not in this project's Tailwind @theme
              and therefore never gets a colour. We render our own dots instead,
              using the project's palette tokens so they're always visible. */}
          <div className="md:w-[40%] -mt-15 flex flex-col items-center pb-8 md:pb-0">

            {/*
              CardStack props — vertical pile layout:
                spreadDeg=3        slight Z rotation — organic pile feel
                overlap=0.94       near-full card overlap
                maxVisible=5       5 cards visible — richer depth
                activeLiftPx=lift  front card lifts above the pile
                randomOffsets=true Y-jitter per card creates a hand-placed look
                value=activeIndex  syncs CardStack's internal active to our state
                                   so dot clicks can drive navigation
            */}
            <CardStack
              items={items}
              cardWidth={cardDims.width}
              cardHeight={cardDims.height}
              overlap={0.94}
              spreadDeg={3}
              activeScale={1.06}
              inactiveScale={0.93}
              activeLiftPx={cardDims.lift}
              maxVisible={5}
              autoAdvance={false}
              pauseOnHover={true}
              loop={true}
              showDots={false}
              randomOffsets={true}
              yJitterValues={cardDims.yJitter}
              renderCard={renderProblemCard}
              value={activeIndex}
              onChangeIndex={(index) => setActiveIndex(index)}
            />

            {/* ── CUSTOM DOTS ───────────────────────────────────────────── */}
            {/* Rendered below the card stage.
                One dot per card. Active dot = full white. Others = white at 30%.
                Clicking a dot updates activeIndex, which syncs back to CardStack
                via the `value` prop. On mobile the user swipes the card; on
                desktop they can also click here. */}
            {/* mt-16 on mobile: cards overflow the stage by up to ~42px (yJitter max 22 +
                abs*10). mt-32 on desktop: yJitter goes up to +100 and abs*10 up to +20,
                meaning cards can extend 120px below the stage — the dots need to clear that. */}
            <div className="flex items-center justify-center gap-2 mt-16 md:mt-32">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to card ${idx + 1}: ${item.title}`}
                  className={[
                    "h-2 w-2 rounded-full transition-all duration-300",
                    idx === activeIndex
                      ? "bg-white-axis"
                      : "bg-white-axis/30 hover:bg-white-axis/60",
                  ].join(" ")}
                />
              ))}
            </div>
            {/* END CUSTOM DOTS */}

          </div>
          {/* END LEFT COLUMN */}

          {/* ── RIGHT COLUMN: HEADLINE + DYNAMIC TEXT + QUOTE ───────────── */}
          {/*
            md:w-[45%]: occupies 45% of the row on desktop.
            mt-12: top margin on mobile only (when stacked below CardStack).
            md:mt-0: remove that margin on desktop (columns are side-by-side).
          */}
          {/* mt-16 on mobile: extra clearance so the lifted card doesn't overlap
              this text column when both are stacked vertically on phone. */}
          <div className="md:flex-1 mt-6 md:mt-0">

            {/* ── STATIC HEADLINE ─────────────────────────────────────────── */}
            {/*
              Wrapped in the stagger container so it animates in on scroll.
              This h2 is static — it does NOT change per card.
              viewport={{ once: true }}: plays the animation only once.
            */}
            {/* hidden md:block: desktop only — the mobile version of this headline
                is rendered above the card stack (see MOBILE-ONLY HEADLINE above).
                Hiding it here on mobile avoids a duplicate h2 being visible. */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <motion.h2
                variants={animItem}
                className="font-playfair uppercase text-center tracking-tight text-white-axis text-4xl leading-tight mb-6 md:mb-8"
              >
                Your studio has visibility — but no structure.
              </motion.h2>
            </motion.div>
            {/* END STATIC HEADLINE */}

            {/* ── ANIMATED PANEL: TAG + TEXT + SEPARATOR + QUOTE ──────────── */}
            {/*
              AnimatePresence mode="wait": the exit animation finishes before
              the new content mounts — clean fade-out → fade-in, no overlap.
              key={activeIndex}: React sees a new component on every index
              change, triggering the entrance animation fresh each time.
            */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                // Entrance: fade in from slightly below
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                // Exit: fade out moving slightly upward
                exit={{ opacity: 0, y: -5 }}
                // 250ms: fast enough to feel responsive, slow enough to feel intentional
                transition={{ duration: 0.25, ease: "easeOut" as const }}
              >

                {/* TAG label — uppercase, wide tracking, muted grey */}
                <p className="font-instrument uppercase tracking-widest text-magenta-axis text-base">
                  {TEXT_CONTENT[activeIndex]?.title}
                </p>

                {/* Two-line paragraph.
                    Line 1 (muted grey): describes the symptom.
                    Line 2 (bold white): the consequence / punchline.
                    <br />: explicit line break between the two lines. */}
                <p className="font-instrument text-base mt-2 leading-relaxed">
                  <span className="text-soft-grey">
                    {TEXT_CONTENT[activeIndex]?.line1}
                  </span>
                  <br />
                  <span className="text-white-axis font-bold">
                    {TEXT_CONTENT[activeIndex]?.line2}
                  </span>
                </p>

                {/* ── HORIZONTAL SEPARATOR ────────────────────────────────── */}
                {/* Thin line to visually separate the text block from the quote.
                    w-8 = 2rem wide, h-px = 1px tall, soft-grey at 30% opacity. */}
                <div className="w-8 h-px bg-soft-grey/30 my-6" aria-hidden="true" />

                {/* ── QUOTE BLOCK ──────────────────────────────────────────── */}
                {/*
                  Displays a real quote from a studio owner sourced from
                  prompts/problem-quotes.md. Updates in sync with the active card.
                */}
                <div>
                  {/* Large decorative opening quotation mark.
                      aria-hidden: purely decorative, not read aloud by screen readers.
                      select-none: prevents accidental text selection of the glyph. */}
                  <span
                    className="font-playfair text-7xl leading-none text-magenta-axis select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>

                  {/* Quote body: Playfair italic, slight opacity to differentiate
                      from the headline above. -mt-2 pulls it up under the large quote mark. */}
                  <p className="font-playfair italic text-white-axis/90 text-base leading-relaxed -mt-2">
                    {TEXT_CONTENT[activeIndex]?.quote}
                  </p>

                  {/* Attribution: instrument sans, muted, uppercase, wide tracked.
                      No truncation — wraps fully on narrow screens. */}
                  <p className="font-instrument text-soft-grey text-sm uppercase tracking-widest mt-3">
                    {TEXT_CONTENT[activeIndex]?.attribution}
                  </p>
                </div>
                {/* END QUOTE BLOCK */}

              </motion.div>
            </AnimatePresence>
            {/* END ANIMATED PANEL */}

          </div>
          {/* END RIGHT COLUMN */}

        </div>
        {/* END 2-COLUMN LAYOUT */}

      </div>
      {/* END MAIN CONTENT */}

    </section>
  )
}
