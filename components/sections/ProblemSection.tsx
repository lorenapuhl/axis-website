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
    // No imageAlt — this card uses the JSX fragment instead of an image
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
// DRIFT ANIMATION CONSTANTS — used only for the JSX card (id=4)
// The card oscillates slowly on rotation and Y, giving a sense of instability.
// Fixed keyframe arrays (not Math.random) for deterministic, consistent renders.
// Row index 3 is used (id=4, idx = 4-1 = 3).
// ─────────────────────────────────────────────────────────────────────────────
const JSX_DRIFT_ROT = [0, -0.8,  0.9, -1.3, 0]
const JSX_DRIFT_Y   = [0,  2.8, -1.2,  2.0, 0]

// ─────────────────────────────────────────────────────────────────────────────
// JSX FRAGMENT — GOOGLE MISSING (card id=4)
// Simulates a Google search results page where competitors appear but your
// studio doesn't. Background is bg-[#D8D8D8] (light grey) to match a real
// browser search page aesthetic — all text uses black/dark tokens for contrast.
// ─────────────────────────────────────────────────────────────────────────────
function FragmentGoogleMissing() {
  return (
    // bg-[#D8D8D8]: light grey simulating a Google search results background.
    // flex flex-col: stacks the search bar, results, and footer vertically.
    <div className="relative h-full w-full bg-[#D8D8D8] flex flex-col overflow-hidden">

      {/* Search bar — rounded pill with magnifier icon and query text */}
      <div className="flex items-center gap-2 mx-4 mt-4 mb-3 bg-black-axis/8 rounded-full px-3 py-2 border border-black-axis/15">
        {/* Magnifier icon — inline SVG, no icon library needed */}
        <svg
          width="11" height="11" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          className="text-black-axis/50 shrink-0"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3 3" />
        </svg>
        <span className="font-instrument text-[11px] text-black-axis flex-1">pilates near me</span>
      </div>

      {/* Competitor search results — two other studios show up instead */}
      {/* divide-y: draws a thin horizontal rule between each result row */}
      <div className="flex flex-col divide-y divide-black-axis/10 px-4">
        {[
          { name: "FitLife Studio",  url: "fitlife.com",  stars: 5, rating: "4.8", reviews: "120" },
          { name: "MoveMX Pilates",  url: "movemx.com",   stars: 4, rating: "4.5", reviews: "67"  },
        ].map((result) => (
          <div key={result.name} className="py-2.5">
            {/* Result title — styled like a Google blue-link heading */}
            <span className="font-instrument text-[11px] font-semibold text-black-axis block leading-tight">
              {result.name} — Book Online
            </span>
            <span className="font-instrument text-[9px] text-black-axis/60 block">{result.url}</span>
            {/* Star rating row — ★ is the filled star HTML entity */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] text-black-axis/70">
                {"★".repeat(result.stars)}{"☆".repeat(5 - result.stars)}
              </span>
              <span className="font-instrument text-[9px] text-black-axis/50">
                {result.rating} &middot; {result.reviews} reviews
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer — your studio is simply absent from results */}
      <div className="mt-auto px-4 pb-4 pt-2 border-t border-black-axis/10">
        <span className="font-instrument text-[10px] text-black-axis/40 italic">
          Your studio: no results found
        </span>
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER CARD FUNCTION
// Passed as the `renderCard` prop to CardStack.
// CardStack calls this once per visible card, giving us full control over
// each card's visual content.
//
// Cards are split into two types:
//   Image cards (id ≠ 4) — full-bleed next/image screenshot from public/problems_visual/
//   JSX card   (id = 4) — the FragmentGoogleMissing component with drift animation
//
// Shared overlays on every card:
//   1. Tag label top-left (text-magenta-axis = alarm/problem signal)
//   2. Bottom gradient for title/description readability
//   3. Active pulse ring (when card is in front)
// ─────────────────────────────────────────────────────────────────────────────
function renderProblemCard(
  cardItem: ProblemCard,
  state: { active: boolean },
) {
  // isJsxCard: true only for id=4 (NO GOOGLE PRESENCE), the one card that
  // uses a hand-built JSX fragment instead of a real screenshot.
  const isJsxCard = Number(cardItem.id) === 4

  return (
    // relative + overflow-hidden: the tag, gradient, and pulse ring are
    // absolutely positioned inside this boundary.
    <div className="relative h-full w-full overflow-hidden">

      {/* ── CARD VISUAL CONTENT ─────────────────────────────────────────── */}
      {isJsxCard ? (
        // JSX card: wrap in Framer Motion for the slow drift animation.
        // This makes the card feel unstable and alive, reinforcing "chaos".
        // Duration: 7 + 4*1.3 = 12.2s — long, calm oscillation.
        <motion.div
          className="h-full w-full"
          animate={{
            rotateZ: JSX_DRIFT_ROT,
            y:       JSX_DRIFT_Y,
          }}
          transition={{
            duration:   12.2,
            ease:       "easeInOut",
            repeat:     Infinity,
            repeatType: "loop",
          }}
        >
          <FragmentGoogleMissing />
        </motion.div>
      ) : (
        // Image card: full-bleed screenshot using next/image with fill.
        // `fill` stretches the image to cover the parent's width and height.
        // The parent (CardStack's card div) has explicit px dimensions set via
        // the cardWidth/cardHeight props (340×280), so fill works correctly.
        // No width/height props needed when using fill — parent dimensions apply.
        <Image
          src={`/problems_visual/img_${cardItem.id}.png`}
          alt={cardItem.imageAlt ?? cardItem.title}
          fill
          // object-cover: scales the image to fill the card without distortion,
          // cropping edges if the aspect ratio doesn't match exactly.
          className="object-cover"
          draggable={false}
        />
      )}

      {/* ── TAG LABEL ───────────────────────────────────────────────────── */}
      {/* Top-left corner. text-magenta-axis = single accent for this section,
          signals "alarm / problem" across all 6 cards. */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <span className="font-instrument text-[9px] uppercase tracking-[0.15em] text-magenta-axis">
          {cardItem.tag}
        </span>
      </div>

      {/* ── BOTTOM GRADIENT OVERLAY ─────────────────────────────────────── */}
      {/* Ensures the title and description text are readable over any card visual.
          from-black-axis/90: near-opaque at the bottom.
          via-black-axis/40: semi-transparent mid-zone.
          to-transparent: fades out toward the top of the overlay area. */}
      <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black-axis/90 via-black-axis/40 to-transparent px-4 pt-10 pb-4 pointer-events-none">
        <p className="font-instrument text-xs font-semibold text-white-axis leading-snug">
          {cardItem.title}
        </p>
        {/* Subtle opacity flicker — simulates unstable UI, reads as "glitch".
            Amplitude is small (1.0 → 0.82) so it's barely perceptible. */}
        <motion.p
          className="font-instrument text-[10px] text-soft-grey mt-0.5 leading-relaxed"
          animate={{ opacity: [1, 0.82, 1, 0.91, 1] }}
          transition={{
            duration:   3.5 + Number(cardItem.id) * 0.6,
            repeat:     Infinity,
            ease:       "easeInOut",
          }}
        >
          {cardItem.description}
        </motion.p>
      </div>

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
        {/*
          Moved to the top of the section (was previously at the bottom).
          Uses the stagger container: h2 fades in first, subline 120ms later.
          viewport={{ once: true }}: plays once as section enters viewport.
        */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          {/* h2: SEO requirement — one h2 per section. The page's h1 is in Hero. */}
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
              <p className="font-instrument text-xs uppercase tracking-widest text-soft-grey">
                {TEXT_CONTENT[activeIndex]?.title}
              </p>

              {/* Two-line paragraph.
                  Line 1: muted/grey — describes the symptom
                  Line 2: white + bold — the consequence / punchline
                  <br />: explicit line break between the two lines */}
              <p className="font-instrument text-sm mt-3 leading-relaxed">
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

        {/* ── CLOSING STATEMENT ───────────────────────────────────────────── */}
        {/*
          Final statement that reframes the entire section.
          Fade-up on scroll, plays once.
          Uses font-playfair for visual weight — matches the headline style.
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-24"
        >
          <p className="font-playfair uppercase tracking-tight text-white-axis text-xl md:text-2xl leading-tight">
            Your studio runs on attention — not a system.
          </p>
          <p className="font-instrument text-soft-grey text-sm tracking-wide mt-2">
            And attention doesn&apos;t scale.
          </p>
        </motion.div>
        {/* END CLOSING STATEMENT */}

      </div>
      {/* END MAIN CONTENT */}

    </section>
  )
}
