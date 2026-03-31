"use client"
// "use client" must be the absolute first line.
// This component uses useState (active card tracking) and Framer Motion's
// whileInView / AnimatePresence — all browser-only APIs that require a Client Component.

import { useState } from "react"
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
// Shown in the dynamic text block that sits below the CardStack.
//   title — uppercase label (e.g. "DM OVERLOAD")
//   line1 — first line of paragraph: muted/grey, normal weight
//   line2 — second line: white, bold — the punchline
// ─────────────────────────────────────────────────────────────────────────────
const TEXT_CONTENT = [
  {
    title: "DM OVERLOAD",
    line1: "Clients constantly ask for schedules, prices, and availability in DMs.",
    line2: "You spend hours replying manually instead of running your studio.",
  },
  {
    title: "NO STRUCTURE",
    line1: "Visitors land on your Instagram but don't know how to book a class.",
    line2: "Without a clear next step, most leave without taking action.",
  },
  {
    title: "LOST CLIENTS",
    line1: "Conversations start in DMs but rarely turn into confirmed bookings.",
    line2: "Each back-and-forth increases the chance the client disappears.",
  },
  {
    title: "NO GOOGLE PRESENCE",
    line1: "People search for studios like yours on Google but can't find you.",
    line2: "You miss high-intent clients who are ready to book.",
  },
  {
    title: "BAD UX",
    line1: "Important information is buried in story highlights and scattered posts.",
    line2: "Clients waste time searching and often give up before booking.",
  },
  {
    title: "NO SYSTEM",
    line1: "Bookings, payments, schedules, and messages are handled across different tools.",
    line2: "Without a system, everything depends on you and nothing scales.",
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
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
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
          the cardWidth/cardHeight props (340×280), so fill works correctly.
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
  // Drives the dynamic text block below the stack.
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    // relative: anchor for the absolutely-positioned background chaos layer.
    // overflow-hidden: clips floating chaos elements near the edges.
    // bg-black-axis: this section is part of the same dark system — not a break.
    <section className="relative overflow-hidden bg-black-axis py-20 px-6 md:py-36 md:px-12">

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
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── HEADLINE ────────────────────────────────────────────────────── */}
        {/* h2: SEO requirement — one h2 per section. The page's h1 is in Hero.
            Uses the stagger container: h2 fades in first, subline 120ms later.
            viewport={{ once: true }}: plays once as section enters viewport. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            variants={animItem}
            className="font-playfair uppercase tracking-tight text-white-axis text-3xl md:text-4xl leading-tight"
          >
            Your studio has visibility — but no structure.
          </motion.h2>
          <motion.p
            variants={animItem}
            className="font-instrument text-soft-grey text-sm md:text-base tracking-wide mt-3"
          >
            And visibility doesn&apos;t scale.
          </motion.p>
        </motion.div>
        {/* END HEADLINE */}

        {/* ── CARD STACK ────────────────────────────────────────────────── */}
        {/*
          CardStack from components/ui/card-stack.tsx.
          Props unchanged from previous version — only onChangeIndex is added.

          onChangeIndex: CardStack fires this callback whenever the active card
          changes (auto-advance, click, or drag). We use it to keep activeIndex
          in sync so the text block below updates correctly.
        */}
        <CardStack
          items={items}
          cardWidth={340}
          cardHeight={280}
          overlap={0.65}
          spreadDeg={65}
          activeScale={1.06}
          inactiveScale={0.93}
          autoAdvance={true}
          intervalMs={2400}
          pauseOnHover={true}
          loop={true}
          showDots={true}
          randomOffsets={true}
          renderCard={renderProblemCard}
          onChangeIndex={(index) => setActiveIndex(index)}
        />
        {/* END CARD STACK */}

        {/* ── DYNAMIC TEXT BLOCK ──────────────────────────────────────────── */}
        {/*
          Updates every time the active card changes.
          AnimatePresence with mode="wait": waits for the exit animation to
          finish before mounting the new content — creating a clean fade-out →
          fade-in sequence (not a cross-fade overlap).
          key={activeIndex}: React re-mounts the motion.div on every index change,
          triggering the entrance animation from scratch.
        */}
        <div className="mt-12 md:mt-16 flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              // Entrance: fade in from slightly below (y: 5 → 0)
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              // Exit: fade out moving slightly upward (y: 0 → -5)
              exit={{ opacity: 0, y: -5 }}
              // 250ms: fast enough to feel responsive, slow enough to feel intentional
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-[560px]"
            >
              {/* Title: uppercase, small, wide tracking, muted */}
              <p className="font-instrument text-xl uppercase tracking-widest text-soft-grey">
                {TEXT_CONTENT[activeIndex]?.title}
              </p>

              {/* Two-line paragraph.
                  Line 1: muted/grey — describes the symptom
                  Line 2: white + bold — the consequence / punchline
                  <br />: explicit line break between the two lines */}
              <p className="font-instrument text-xm mt-3 leading-relaxed">
                <span className="text-soft-grey">
                  {TEXT_CONTENT[activeIndex]?.line1}
                </span>
                <br />
                <span className="text-white-axis font-bold">
                  {TEXT_CONTENT[activeIndex]?.line2}
                </span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* END DYNAMIC TEXT BLOCK */}

      </div>
      {/* END MAIN CONTENT */}

    </section>
  )
}
