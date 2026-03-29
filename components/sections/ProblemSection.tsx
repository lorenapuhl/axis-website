"use client"
// "use client" must be the absolute first line.
// This component uses Framer Motion's whileInView and animate (browser-only APIs),
// and passes a renderCard function that contains animated child elements.
// Both require a Client Component — not a Server Component.

import type { ReactElement } from "react"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { CardStack } from "@/components/ui/card-stack"
import type { CardStackItem } from "@/components/ui/card-stack"

// ─────────────────────────────────────────────────────────────────────────────
// TYPE
// ProblemCard extends the base CardStackItem type with a `tag` label.
// TypeScript "extends" is like Python class inheritance — ProblemCard
// inherits all fields from CardStackItem and adds one more.
// ─────────────────────────────────────────────────────────────────────────────
type ProblemCard = CardStackItem & {
  tag: string
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// Six real pain points that fitness studio owners experience daily.
// No imageSrc — content is rendered as live JSX "UI fragments" (see renderCard).
// This gives richer, more specific visuals than placeholder images.
// ─────────────────────────────────────────────────────────────────────────────
const items: ProblemCard[] = [
  {
    id: 1,
    title: "+47 DMs today",
    description: "Clients asking for schedule, prices, availability",
    tag: "DM overload",
  },
  {
    id: 2,
    title: "Where do I book?",
    description: "Visitors don't find a clear next step",
    tag: "No structure",
  },
  {
    id: 3,
    title: "Seen \u2022 no reply",
    description: "Conversations drop off before booking",
    tag: "Lost clients",
  },
  {
    id: 4,
    title: "Pilates near me",
    description: "Your studio doesn't show up",
    tag: "No Google presence",
  },
  {
    id: 5,
    title: "\u201cCheck our Story highlights\u201d",
    description: "Making clients hunt through 40 highlights just to find a price list.",
    tag: "Bad UX",
  },
  {
    id: 6,
    title: "Everything is manual",
    description: "DMs, notes, calendar, payments",
    tag: "No system",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL ANIMATION VARIANTS
// Per animate-section.md: 0.7s default, easeOut, stagger 0.12s.
// "container" coordinates when children animate (staggerChildren).
// "item" is the actual per-element fade-up animation.
// ─────────────────────────────────────────────────────────────────────────────
// Variants is the Framer Motion type for named animation state objects.
// Without it, TypeScript widens "easeOut" to string instead of the specific
// Easing type framer-motion expects — causing a type error.
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
    // Each child element begins its entrance 120ms after the previous one.
  },
}

const animItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

// ─────────────────────────────────────────────────────────────────────────────
// DRIFT ANIMATION CONSTANTS
// Each card drifts with a slow oscillating rotation and Y movement.
// Using fixed keyframe arrays (not Math.random) ensures stable, deterministic
// renders on every paint — no visual jumps or inconsistency.
// Each array row is a different card's keyframe sequence [start → ... → end].
// ─────────────────────────────────────────────────────────────────────────────
const DRIFT_ROT: number[][] = [
  [0,  0.8, -0.4,  1.1, 0],
  [0, -1.0,  0.5, -0.7, 0],
  [0,  0.6, -1.2,  0.3, 0],
  [0, -0.8,  0.9, -1.3, 0],
  [0,  1.0, -0.5,  0.7, 0],
  [0, -0.7,  1.1, -0.4, 0],
]
const DRIFT_Y: number[][] = [
  [0, -2.5,  1.0, -1.8, 0],
  [0,  2.0, -2.8,  1.5, 0],
  [0, -1.5,  2.2, -0.8, 0],
  [0,  2.8, -1.2,  2.0, 0],
  [0, -2.0,  1.8, -2.5, 0],
  [0,  1.5, -2.0,  1.0, 0],
]

// ─────────────────────────────────────────────────────────────────────────────
// CARD FRAGMENT COMPONENTS
// Each simulates a "screenshot moment" from the daily chaos of running a
// studio — designed to feel real, messy, and slightly stressful.
//
// Visual language (to match FeatureSection.tsx):
//   - bg-grey-axis (#121212): dark phone-screen background
//   - text-white-axis + text-soft-grey: light text on dark
//   - font-instrument throughout (UI text)
//   - No images — all content is inline JSX
//
// Accent rule: only text-magenta-axis (one accent per section).
//   Badges, tags, and notification dots all use magenta = "alarm / unread".
// ─────────────────────────────────────────────────────────────────────────────

// Card 1: Instagram DM screen — flooded with unanswered questions from clients.
function FragmentDmOverload() {
  return (
    // relative: allows the content inside to use absolute positioning if needed.
    // bg-grey-axis: simulates a dark phone screen (#121212).
    <div className="relative h-full w-full bg-grey-axis flex flex-col overflow-hidden">

      {/* Phone status bar — small clock + screen title + menu indicator */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="font-instrument text-[10px] text-soft-grey">9:41</span>
        <span className="font-instrument text-xs font-semibold text-white-axis">Messages</span>
        <span className="font-instrument text-[10px] text-soft-grey" aria-hidden="true">···</span>
      </div>

      {/* DM thread list — 4 unanswered messages */}
      {/* divide-y: draws a thin horizontal line between each row */}
      <div className="flex flex-col divide-y divide-white-axis/5 flex-1">
        {[
          { name: "Ana G.",     preview: "hey what time is class?",     time: "2:14",  unread: 2 },
          { name: "Diego R.",   preview: "price?",                       time: "1:58",  unread: 1 },
          { name: "Mariana L.", preview: "is there space tomorrow?",     time: "1:32",  unread: 3 },
          { name: "Sofía V.",   preview: "when is the next class??",     time: "12:47", unread: 1 },
        ].map((dm) => (
          <div key={dm.name} className="flex items-center gap-3 px-4 py-2.5">

            {/* Avatar placeholder circle */}
            <div className="w-8 h-8 rounded-full bg-white-axis/10 shrink-0" aria-hidden="true" />

            {/* Sender name + message preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-instrument text-[11px] font-semibold text-white-axis">
                  {dm.name}
                </span>
                <span className="font-instrument text-[9px] text-soft-grey">{dm.time} PM</span>
              </div>
              {/* truncate: cuts long text with "..." instead of wrapping */}
              <span className="font-instrument text-[10px] text-soft-grey/70 truncate block mt-0.5">
                {dm.preview}
              </span>
            </div>

            {/* Unread count badge — magenta-axis = alarm / unread signal */}
            <div className="w-4 h-4 rounded-full bg-magenta-axis flex items-center justify-center shrink-0">
              <span className="font-instrument text-[8px] font-bold text-white-axis">{dm.unread}</span>
            </div>

          </div>
        ))}
      </div>

      {/* Typing indicator — another person is about to ask a question */}
      <div className="px-4 py-2.5 flex items-center gap-2 border-t border-white-axis/5">
        <div className="w-6 h-6 rounded-full bg-white-axis/10 shrink-0" aria-hidden="true" />

        {/* Three dots that pulse in sequence — the classic "someone is typing" animation.
            Each dot has a different delay so they pulse one after another (0s, 0.2s, 0.4s). */}
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-1.5 h-1.5 rounded-full bg-soft-grey"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: dot * 0.2,   // staggered start: dot 0 at 0s, dot 1 at 0.2s, dot 2 at 0.4s
              }}
            />
          ))}
        </div>
        <span className="font-instrument text-[9px] text-soft-grey/70">typing...</span>
      </div>

    </div>
  )
}

// Card 2: Instagram profile — no booking button, no clear path.
function FragmentIgConfusion() {
  return (
    <div className="relative h-full w-full bg-grey-axis flex flex-col overflow-hidden">

      {/* Profile header bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="font-instrument text-[11px] text-soft-grey">‹</span>
        <span className="font-instrument text-[11px] font-semibold text-white-axis">
          @studioflow_pilates
        </span>
        <span className="font-instrument text-[10px] text-soft-grey" aria-hidden="true">···</span>
      </div>

      {/* Profile info: avatar + name + bio */}
      <div className="flex flex-col items-center gap-1 py-2">
        <div className="w-12 h-12 rounded-full bg-white-axis/10" aria-hidden="true" />
        <span className="font-instrument text-xs font-semibold text-white-axis">
          Studio Flow Pilates
        </span>
        <span className="font-instrument text-[10px] text-soft-grey">
          Pilates · Movement · Mexico City
        </span>
        {/* The classic vague bio CTA — sends users on a treasure hunt */}
        <span className="font-instrument text-[9px] text-soft-grey/50 italic">
          &quot;Check the link in bio for more info&quot;
        </span>
      </div>

      {/* Story highlights — 5 vaguely labeled circles, none says "Book" */}
      <div className="flex justify-center gap-3 px-4 pt-1 pb-2">
        {["prices", "info", "more", "FAQs", "other"].map((label) => (
          <div key={label} className="flex flex-col items-center gap-0.5 w-10">
            {/* Circle with faint border — simulates the Instagram highlights ring */}
            <div
              className="w-9 h-9 rounded-full border border-soft-grey/30 bg-white-axis/5"
              aria-hidden="true"
            />
            <span className="font-instrument text-[8px] text-soft-grey/60 truncate w-full text-center">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Profile action buttons — neither says "Book" or "Reserve" */}
      <div className="flex gap-2 px-4 mt-auto pb-4">
        <div className="flex-1 border border-soft-grey/20 rounded-lg py-1.5 flex items-center justify-center">
          <span className="font-instrument text-[10px] text-white-axis/60">Follow</span>
        </div>
        <div className="flex-1 border border-soft-grey/20 rounded-lg py-1.5 flex items-center justify-center">
          <span className="font-instrument text-[10px] text-white-axis/60">Message</span>
        </div>
      </div>

      {/* "Where do I book?" overlay — the visitor's frustrated thought.
          pointer-events-none: decorative only, does not intercept taps. */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-instrument text-sm font-semibold text-white-axis bg-black-axis/70 px-3 py-2 rounded-xl">
          Where do I book?
        </span>
      </div>

    </div>
  )
}

// Card 3: Chat drop-off — a promising conversation that went cold.
function FragmentDropoff() {
  return (
    <div className="relative h-full w-full bg-grey-axis flex flex-col overflow-hidden">

      {/* Chat header — back arrow + contact name */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-white-axis/5">
        <span className="font-instrument text-[11px] text-soft-grey">‹</span>
        <div className="w-7 h-7 rounded-full bg-white-axis/10 shrink-0" aria-hidden="true" />
        <span className="font-instrument text-[11px] font-semibold text-white-axis">Ana García</span>
      </div>

      {/* Message thread */}
      <div className="flex flex-col gap-2 px-4 pt-3 flex-1">

        {/* Studio's outgoing message — right-aligned bubble */}
        <div className="flex justify-end">
          <div className="bg-white-axis/15 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[78%]">
            <span className="font-instrument text-[10px] text-white-axis leading-relaxed">
              Hi! Classes are Mon–Fri at 7pm 💪 Let me know if you want to book!
            </span>
          </div>
        </div>

        {/* Client's reply — short, left-aligned bubble */}
        <div className="flex justify-start">
          <div className="bg-white-axis/8 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[55%]">
            <span className="font-instrument text-[10px] text-white-axis/70">ok thanks</span>
          </div>
        </div>

        {/* "Seen" timestamp — visible below the last message sent by studio */}
        <div className="flex justify-end">
          <span className="font-instrument text-[9px] text-soft-grey/50">Seen · 2:14 PM</span>
        </div>

        {/* Empty space — the silence after the drop-off */}
        <div className="flex-1 flex items-center justify-center">
          <span
            className="font-instrument text-[9px] text-soft-grey/20 tracking-[0.3em] uppercase"
            aria-hidden="true"
          >
            · · ·
          </span>
        </div>

      </div>
    </div>
  )
}

// Card 4: Google search results — competitors show up, your studio doesn't.
function FragmentGoogleMissing() {
  return (
    <div className="relative h-full w-full bg-grey-axis flex flex-col overflow-hidden">

      {/* Search bar */}
      <div className="flex items-center gap-2 mx-4 mt-4 mb-3 bg-white-axis/8 rounded-full px-3 py-2 border border-white-axis/10">
        {/* Magnifier icon — inline SVG, no library needed */}
        <svg
          width="11" height="11" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          className="text-soft-grey shrink-0"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3 3" />
        </svg>
        <span className="font-instrument text-[11px] text-white-axis/80 flex-1">pilates near me</span>
      </div>

      {/* Competitor search results — two other studios are listed */}
      <div className="flex flex-col divide-y divide-white-axis/5 px-4">
        {[
          { name: "FitLife Studio",  url: "fitlife.com",  stars: 5, rating: "4.8", reviews: "120" },
          { name: "MoveMX Pilates",  url: "movemx.com",   stars: 4, rating: "4.5", reviews: "67"  },
        ].map((result) => (
          <div key={result.name} className="py-2.5">
            {/* Result title — styled like a Google blue link */}
            <span className="font-instrument text-[11px] font-semibold text-white-axis block leading-tight">
              {result.name} — Book Online
            </span>
            <span className="font-instrument text-[9px] text-soft-grey/60 block">{result.url}</span>
            {/* Star rating row — ★ is HTML entity #9733 */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] text-soft-grey/70">
                {"★".repeat(result.stars)}{"☆".repeat(5 - result.stars)}
              </span>
              <span className="font-instrument text-[9px] text-soft-grey/50">
                {result.rating} &middot; {result.reviews} reviews
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Your studio: absent from results */}
      <div className="mt-auto px-4 pb-4 pt-2 border-t border-white-axis/5">
        <span className="font-instrument text-[10px] text-soft-grey/40 italic">
          Your studio: no results found
        </span>
      </div>

    </div>
  )
}

// Card 5: Instagram Story Highlights — 38 circles, none of them helpful.
// This card simulates the frustration of having to tap through dozens of
// vaguely labeled highlights to find basic information like a price list.
function FragmentInfoHunting() {
  // 15 highlight circles with confusing or unhelpful labels
  const highlights = [
    "prices", "info", "more", "FAQs", "schedule??",
    "2023", "📍", "new", "rules", "wait",
    "🏋️", "???", "other", "news", "read",
  ]

  return (
    <div className="relative h-full w-full bg-grey-axis flex flex-col overflow-hidden">

      {/* Header — "Highlights" title + total count (the overwhelming "38 total") */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="font-instrument text-[10px] text-soft-grey">‹</span>
        <span className="font-instrument text-[11px] font-semibold text-white-axis">Highlights</span>
        <span className="font-instrument text-[9px] text-soft-grey/40">38 total</span>
      </div>

      {/* Grid of highlight circles — flex-wrap causes them to fill the space
          like the actual Instagram highlights row, but much more of them. */}
      <div className="flex flex-wrap gap-x-2 gap-y-2 px-3 pt-2 pb-1">
        {highlights.map((label) => (
          // w-[44px]: fixed width per circle + label pair to align the grid
          <div key={label} className="flex flex-col items-center gap-0.5 w-[44px]">
            {/* Highlight circle — faint border simulates the Instagram highlight ring */}
            <div
              className="w-9 h-9 rounded-full border border-soft-grey/25 bg-white-axis/5 flex items-center justify-center"
              aria-hidden="true"
            >
              {/* Show emoji icons inside circles, text labels sit below */}
              {(label === "📍" || label === "🏋️") && (
                <span className="text-[12px]">{label}</span>
              )}
            </div>
            {/* Label — truncated since space is very limited */}
            <span className="font-instrument text-[7px] text-soft-grey/60 truncate w-full text-center leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* The studio's typical non-answer to "where is the info?" */}
      <div className="mt-auto px-4 pb-3 pt-1">
        <span className="font-instrument text-[9px] text-soft-grey/40 italic">
          &quot;Check our Story highlights&quot;
        </span>
      </div>

    </div>
  )
}

// Card 6: System chaos — six disconnected apps, all with notification backlogs.
function FragmentSystemChaos() {
  // Each app the studio owner uses manually, every single day
  const apps: { name: string; badge: number }[] = [
    { name: "WhatsApp", badge: 12 },
    { name: "Notes",    badge: 3  },
    { name: "Calendar", badge: 7  },
    { name: "DMs",      badge: 24 },
    { name: "Sheets",   badge: 0  },
    { name: "Trello",   badge: 2  },
  ]

  return (
    <div className="relative h-full w-full bg-grey-axis flex flex-col justify-between p-4 overflow-hidden">

      {/* App icon grid — 3 columns, simulates a phone home screen */}
      <div className="grid grid-cols-3 gap-3">
        {apps.map((app) => (
          // relative: lets the notification badge position absolutely in the top-right corner
          <div key={app.name} className="relative flex flex-col items-center gap-1">

            {/* App icon — rounded square with label inside */}
            <div className="w-12 h-12 rounded-2xl bg-white-axis/10 border border-white-axis/10 flex items-center justify-center">
              <span className="font-instrument text-[8px] text-soft-grey text-center leading-tight px-1">
                {app.name}
              </span>
            </div>

            {/* Notification badge — red dot with unread count.
                Only shown when badge > 0. Uses magenta-axis (the section accent). */}
            {app.badge > 0 && (
              <div className="absolute -top-1 -right-0.5 min-w-[16px] h-4 rounded-full bg-magenta-axis flex items-center justify-center px-1">
                <span className="font-instrument text-[8px] text-white-axis font-bold">
                  {app.badge}
                </span>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Tagline — states the core problem plainly */}
      <p className="font-instrument text-[9px] text-soft-grey/40 text-center tracking-widest uppercase">
        All manual. All disconnected.
      </p>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER CARD FUNCTION
// This is passed as the `renderCard` prop to CardStack.
// CardStack calls this function once per visible card instead of its own
// DefaultFanCard — giving us full control over the card's visual.
//
// Structure per card:
//   1. The UI fragment fills the full card area (h-full w-full)
//   2. A subtle drift animation makes the card feel "alive" and unstable
//   3. A tag label sits top-left (text-magenta-axis = alarm / problem)
//   4. A bottom gradient overlay provides title + description readability
//   5. The active card shows a faint pulse ring to draw focus
// ─────────────────────────────────────────────────────────────────────────────
function renderProblemCard(
  cardItem: ProblemCard,
  state: { active: boolean },
) {
  // idx: maps card id (1–6) to a 0-based index for the drift arrays.
  // (Number(cardItem.id) - 1) converts id=1 → idx=0, id=2 → idx=1, etc.
  const idx = (Number(cardItem.id) - 1) % DRIFT_ROT.length

  // Select the correct UI fragment for this card's id.
  // Switch is used instead of a lookup object so React only creates the
  // element for the card being rendered (not all 6 at once).
  let fragment: ReactElement
  switch (Number(cardItem.id)) {
    case 1: fragment = <FragmentDmOverload />;    break
    case 2: fragment = <FragmentIgConfusion />;   break
    case 3: fragment = <FragmentDropoff />;       break
    case 4: fragment = <FragmentGoogleMissing />; break
    case 5: fragment = <FragmentInfoHunting />;   break
    case 6: fragment = <FragmentSystemChaos />;   break
    default: fragment = <div className="h-full w-full bg-grey-axis" />
  }

  return (
    // relative + overflow-hidden: the tag overlay and bottom gradient are
    // absolutely positioned inside this boundary.
    <div className="relative h-full w-full overflow-hidden">

      {/* UI fragment — wrapped in a Framer Motion div for the drift animation.
          Each card oscillates on rotation and Y at a different speed and phase
          so no two cards ever drift in sync (organic, not robotic feel).
          Duration varies by card id: 7.3s, 8.6s, 9.9s... */}
      <motion.div
        className="h-full w-full"
        animate={{
          rotateZ: DRIFT_ROT[idx] as number[],
          y:       DRIFT_Y[idx]   as number[],
        }}
        transition={{
          duration:   7 + Number(cardItem.id) * 1.3,
          ease:       "easeInOut",
          repeat:     Infinity,
          repeatType: "loop",
        }}
      >
        {fragment}
      </motion.div>

      {/* Tag label — top-left corner, small and muted.
          text-magenta-axis is the single accent color for this section:
          it signals "alarm / problem" across all 6 cards. */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <span className="font-instrument text-[9px] uppercase tracking-[0.15em] text-magenta-axis">
          {cardItem.tag}
        </span>
      </div>

      {/* Bottom gradient overlay — ensures the title and description are
          readable over any fragment background.
          from-black-axis/90: near-opaque black at the very bottom.
          via-black-axis/40: semi-transparent mid-zone.
          to-transparent: fades to nothing at the top of the overlay. */}
      <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black-axis/90 via-black-axis/40 to-transparent px-4 pt-10 pb-4 pointer-events-none">
        <p className="font-instrument text-xs font-semibold text-white-axis leading-snug">
          {cardItem.title}
        </p>
        {/* Subtle opacity flicker on the description — simulates unstable UI.
            Amplitude is small (1.0 → 0.82) so it reads as "glitch", not "broken". */}
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

      {/* Active card pulse ring — a faint white border that breathes when the
          card is in front. Draws attention without being decorative. */}
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
  return (
    // relative: anchor for the absolutely-positioned background chaos layer.
    // overflow-hidden: clips chaos elements that float near the edges.
    // bg-black-axis: matches the rest of the page — this section is part of
    //   the same dark system, not a bright "product showcase" break.
    <section className="relative overflow-hidden bg-black-axis py-20 px-6 md:py-36 md:px-12">

      {/* ── BACKGROUND CHAOS LAYER ────────────────────────────────────────── */}
      {/*
        Floating notification badges and message fragments at ~6% opacity.
        These create a sense of ambient chaos behind the card stack without
        distracting from the primary content.

        Each element:
          - Is absolutely positioned relative to the <section>
          - Oscillates slowly on the Y axis (8–11 second cycles)
          - Has a different delay so they never move together
          - Uses pointer-events-none so they never intercept user interactions
          - Is aria-hidden since they're purely decorative

        Class names are written as full static strings so Tailwind's JIT
        compiler (which scans source code for class names) can find them.
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
      {/* relative z-10: this wrapper sits above the background chaos layer.
          max-w-6xl mx-auto: constrains content to 1152px, centered. */}
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── CARD STACK ────────────────────────────────────────────────── */}
        {/*
          CardStack from components/ui/card-stack.tsx (21st.dev base, adapted).

          Props tuned for the "chaos" feel:
            overlap=0.65    → cards overlap 65% — tight stack, dense visual
            spreadDeg=65    → wide fan arc — clearly showing multiple cards
            activeScale=1.06→ active card lifts noticeably above the others
            inactiveScale=0.93 → background cards recede
            autoAdvance=true → cycles automatically — user doesn't need to click
            intervalMs=2400 → ~2.4 second intervals (within the 2200–2600 range)
            randomOffsets=true → enables the per-card rotation/Y jitter
                                  added to card-stack.tsx (see CARD_ROT_JITTER)
            renderCard      → our custom JSX fragments replace DefaultFanCard
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
        />

        {/* ── SECTION TEXT ──────────────────────────────────────────────── */}
        {/*
          The section headline and subline appear below the card stack.
          They use the stagger container variant: headline fades in first,
          then the subline 120ms later.
          viewport={{ once: true }}: animation plays once as the section
          enters the viewport, then stays visible — does not replay on scroll-back.
        */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16"
        >
          {/* h2: SEO rule — one h2 per section, this is the section headline.
              The page's single h1 lives in the Hero (TrustHeroSection). */}
          <motion.h2
            variants={animItem}
            className="font-playfair uppercase tracking-tight text-white-axis text-3xl md:text-4xl leading-tight"
          >
            Your studio has visibility — but no structure.
          </motion.h2>

          {/* Subline: short, factual, no decoration */}
          <motion.p
            variants={animItem}
            className="font-instrument text-soft-grey text-sm md:text-base tracking-wide mt-3"
          >
            And visibility doesn&apos;t scale.
          </motion.p>
        </motion.div>
        {/* END SECTION TEXT */}

      </div>
      {/* END MAIN CONTENT */}

    </section>
  )
}
