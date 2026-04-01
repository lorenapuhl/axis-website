"use client"
// "use client" must be the absolute first line — no blank lines or comments above it.
// This component uses useState and useEffect (browser-only React hooks) for the
// micro-animations inside the cards. Framer Motion's whileInView also needs the
// browser's IntersectionObserver API. Both require a Client Component.

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL ANIMATION VARIANTS
// Framer Motion "variants" are reusable named animation states.
// The parent container controls WHEN children animate via staggerChildren.
// ─────────────────────────────────────────────────────────────────────────────

// container: no visual animation — only coordinates child stagger timing.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
    // Each child starts its entrance 120ms after the previous one.
  },
}

// item: the standard fade-up animation (per animate-section.md: 0.7s, easeOut).
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

// cardItem: same fade-up for the grid cards — slightly larger travel distance.
const cardItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAL INLINE SVG ICONS (one per feature card)
// No icon library installed — inline SVGs keep the bundle small.
// stroke="currentColor" means the icon inherits the text color from its parent.
// aria-hidden="true" hides them from screen readers (decorative only).
// strokeLinecap="round" gives the paths softer, modern-feeling ends.
// ─────────────────────────────────────────────────────────────────────────────

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="2" y="4" width="16" height="14" rx="2" />
      <path d="M2 8h16M6 2v4M14 2v4" />
    </svg>
  )
}

function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="1" y="5" width="18" height="12" rx="2" />
      <path d="M1 9h18M5 13h3" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 6v4l2.5 2.5" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" />
      <path d="M13 13l4 4" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="7" r="3" />
      <path d="M2 18c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="15" cy="7" r="2" />
      <path d="M18 18c0-2.2-1.3-4-3-4" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="2" y="2" width="16" height="16" rx="4" />
      <circle cx="10" cy="10" r="3.5" />
      <circle cx="14.5" cy="5.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TECH FEATURES STRIP DATA
// Each entry: an SVG path string (rendered by TechIcon) + a short label.
// TechIcon is a small shared component that draws any path in a 16×16 SVG.
// ─────────────────────────────────────────────────────────────────────────────

// TechIcon renders a single SVG path inside a 16×16 viewport.
// The `path` prop is a standard SVG "d" attribute string.
function TechIcon({ path }: { path: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

// techFeatures: the 8 items in the secondary "everything else" strip.
const techFeatures: { d: string; label: string }[] = [
  { d: "M8 1a7 7 0 100 14A7 7 0 008 1zm0 0c-2 2-3 4-3 7s1 5 3 7m0-14c2 2 3 4 3 7s-1 5-3 7M1 8h14", label: "Your own domain" },
  { d: "M6 1h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V3a2 2 0 012-2zm2 11h.01", label: "Mobile-optimized" },
  { d: "M2 13l3-4 3 3 3-5 3-4", label: "Built-in analytics" },
  { d: "M7 7a4 4 0 100 8 4 4 0 000-8zm5.5 5.5l2.5 2.5M9 4h5M9 6.5h3", label: "SEO-ready" },
  { d: "M8 2l-5 2v4c0 3 2 5.5 5 6.5 3-1 5-3.5 5-6.5V4L8 2z", label: "Secure hosting" },
  { d: "M9 2L4 9h5l-2 5 7-7.5H9L11 2z", label: "Fast performance" },
  { d: "M8 1a7 7 0 100 14A7 7 0 008 1zM5 9s1 2 3 2 3-2 3-2M6 6h.01M10 6h.01", label: "WhatsApp & email" },
  { d: "M4 8l2 2 4-4M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z", label: "Easy setup" },
]

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function FeatureSection() {

  // selectedSlot: which time slot is "selected" in the Bookings card (Card 1).
  // useState(0) means it starts at index 0 ("6:00 PM").
  // It automatically cycles 0 → 1 → 2 → 0 every 2 seconds to demonstrate
  // the booking interaction without any user action.
  const [selectedSlot, setSelectedSlot] = useState<number>(0)

  // instaVisible: toggles the Instagram Auto-Sync animation (Card 6).
  // false = website block faded out; true = website block faded in.
  const [instaVisible, setInstaVisible] = useState<boolean>(false)

  // useEffect runs once after the component appears in the browser.
  // setInterval schedules a function to run on repeat (every 2000ms = 2 seconds).
  // The return function cancels the interval when the component is removed —
  // this prevents memory leaks.
  useEffect(() => {
    // (p) => (p + 1) % 3 cycles: 0 → 1 → 2 → 0 → 1 → ...
    const slotId = setInterval(() => setSelectedSlot((p) => (p + 1) % 3), 2000)
    return () => clearInterval(slotId)
  }, []) // The empty [] array means "run this effect once, on first render only"

  useEffect(() => {
    // (p) => !p toggles: false → true → false → ...
    const instaId = setInterval(() => setInstaVisible((p) => !p), 3000)
    return () => clearInterval(instaId)
  }, [])

  return (
    <section
      id="features"
      // id="features": anchor for header navigation deep-links (#features URL).
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12"
      // bg-black-axis: pure black (#000000) — white cards contrast strongly against it.
      // py-20 px-6: mobile padding (80px vertical, 24px horizontal).
      // md:py-36 md:px-12: desktop padding (144px vertical, 48px horizontal).
    >
      <div className="max-w-6xl mx-auto">
        {/* max-w-6xl: constrains content to 1152px. mx-auto: centers it horizontally. */}

        {/* ── SECTION HEADER ──────────────────────────────────────────────── */}
        {/*
          Stagger container: headline and subheadline enter the screen
          120ms apart as the user scrolls down to this section.
          viewport={{ once: true }}: the animation plays once and stays —
          it does not replay when the user scrolls back up.
        */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          {/* h2: SEO rule — exactly one h2 per section (the section headline).
              The page's single h1 lives in the Hero section. */}
          <motion.h2
            variants={item}
            className="font-playfair uppercase tracking-tight text-white-axis text-4xl md:text-5xl leading-tight mb-5"
            // font-playfair: Playfair Display — brand serif for all headlines.
            // uppercase tracking-tight: all-caps with tight letter-spacing = editorial weight.
          >
            The axis your studio needs to grow
          </motion.h2>

          <motion.p
            variants={item}
            className="font-instrument text-soft-grey text-base md:text-lg tracking-wide max-w-xl mx-auto"
            // font-instrument: Instrument Sans — brand sans-serif for body/UI.
            // text-soft-grey: muted secondary text color.
            // max-w-xl: prevents the subheadline from stretching too wide on desktop.
          >
            Bookings. Payments. Clients. All in one simple system.
          </motion.p>
        </motion.div>

        {/* ── FEATURE GRID ────────────────────────────────────────────────── */}
        {/*
          3-column grid on desktop, 1 column on mobile.
          Per the brief — Row 1: [LARGE][LARGE][SMALL], Row 2: [SMALL][SMALL][SMALL]
          Cards 1 and 2 are "large": explicit min-h makes them taller than the others.
          Card 3 has self-start so it does not stretch to match the large card height.
        */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >

          {/* ── CARD 1 (LARGE): Online Bookings ─────────────────────────── */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            // transition: applies to the whileHover y-lift only.
            // The scroll-in animation uses the transition inside cardItem.show.
            className="bg-white-axis rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
            // bg-white-axis: white card on black background — strong contrast.
            // rounded-2xl: soft, modern card corners.
            // flex flex-col gap-5: stacks card sections vertically.
            // shadow-sm: static base shadow (Framer Motion handles the hover lift).
          >
            {/* Card top row: icon (left) + tag label (right) */}
            <div className="flex items-start justify-between">
              <span className="text-grey-axis">
                {/* text-grey-axis (#121212): dark icon on white card = readable */}
                <IconCalendar />
              </span>
              <span className="font-instrument text-xs uppercase tracking-widest text-blue-axis">
                {/* text-blue-axis: the single accent color used across all tags in this section */}
                24/7
              </span>
            </div>

            {/* Card title (h3) + description */}
            <div>
              {/* h3: correct heading level — a sub-item under the section's h2. Per SEO rules. */}
              <h3 className="font-instrument font-semibold text-black-axis text-sm leading-snug">
                Online Bookings
              </h3>
              <p className="font-instrument text-soft-grey text-xs mt-1 leading-relaxed">
                Clients book instantly — no messages needed
              </p>
            </div>

            {/* ── UI FRAGMENT: Booking time slots ──────────────────────────
                A simplified booking widget: three time slots + a Book Now button.
                The "selected" slot is highlighted in blue-axis via an animated overlay.
                selectedSlot state cycles automatically every 2 seconds (see useEffect above).
            */}
            <div className="flex flex-col gap-1.5 mt-auto">
              {/* border-soft-grey wraps the slot list to frame it as a widget */}
              <div className="border border-soft-grey rounded-xl p-2 flex flex-col gap-1.5">
              {["6:00 PM", "7:00 PM", "8:00 PM"].map((slot, i) => (
                <div
                  key={slot}
                  // relative + overflow-hidden: lets the animated blue overlay sit
                  // BEHIND the text content without spilling outside the rounded corner.
                  className="relative rounded-lg overflow-hidden"
                >
                  {/* Animated blue background: fades in when this slot is "selected".
                      animate={{ opacity: ... }} is a Framer Motion direct animation —
                      it smoothly transitions the opacity between 0 and 1.
                      This avoids any raw CSS transition on the interactive element. */}
                  <motion.div
                    className="absolute inset-0 bg-blue-axis"
                    animate={{ opacity: selectedSlot === i ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />

                  {/* Slot text sits on top of the animated overlay via z-10.
                      The text color switches instantly via JS ternary — no CSS transition.
                      The smooth visual comes entirely from the background opacity above. */}
                  <div className="relative z-10 flex items-center justify-between px-3 py-2">
                    <span
                      className={`font-instrument text-xs font-medium ${
                        selectedSlot === i ? "text-white-axis" : "text-grey-axis"
                      }`}
                    >
                      {slot}
                    </span>

                    {/* Checkmark appears only on the selected slot, animating in with a pop */}
                    {selectedSlot === i && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-white-axis font-instrument text-xs"
                      >
                        &#10003;
                        {/* &#10003; is the HTML entity for the checkmark character ✓ */}
                      </motion.span>
                    )}
                  </div>
                </div>
              ))}
              </div>
              {/* Primary action button for this UI fragment */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mt-2 bg-black-axis text-white-axis font-instrument text-xs uppercase tracking-widest py-2.5 rounded-lg w-full"
              >
                Book Now
              </motion.button>
            </div>
          </motion.div>

          {/* ── CARD 2 (LARGE): Memberships & Payments ──────────────────── */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white-axis rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="text-grey-axis">
                <IconCard />
              </span>
              <span className="font-instrument text-xs uppercase tracking-widest text-blue-axis">
                Auto
              </span>
            </div>

            <div>
              <h3 className="font-instrument font-semibold text-black-axis text-sm leading-snug">
                Memberships &amp; Payments
              </h3>
              <p className="font-instrument text-soft-grey text-xs mt-1 leading-relaxed">
                Sell plans and get paid automatically
              </p>
            </div>

            {/* ── UI FRAGMENT: Pricing plan carousel ────────────────────────
                A horizontally scrolling carousel of three pricing cards.
                scroll-snap-type (via Tailwind's snap-x snap-mandatory) makes each
                card "click" into the center of the view when the user scrolls —
                this is CSS Scroll Snapping, no JavaScript required.

                Scrollbar is hidden visually but the container is still scrollable
                via touch swipe or mouse-wheel. Three vendor-specific properties
                cover all modern browsers:
                  [&::-webkit-scrollbar]:hidden — Chrome/Safari (hides the track element)
                  [scrollbar-width:none]         — Firefox CSS property
                  [-ms-overflow-style:none]      — IE/Edge legacy property

                Cards are 78% wide so adjacent cards peek in from either side,
                signalling that the user can scroll to discover more plans.
            */}
            <div
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
              // role="region" + aria-label expose the carousel to screen readers
              role="region"
              aria-label="Pricing plans"
            >
              {[
                {
                  name: "Drop-in",
                  price: "$20",
                  unit: "per class",
                  description: "Walk in any time, no commitment.",
                  cta: "Book a Class",
                },
                {
                  name: "Pack \u00d710",
                  price: "$150",
                  unit: "10 classes",
                  description: "Pre-purchase and save per session.",
                  cta: "Get the Pack",
                },
                {
                  name: "Monthly",
                  price: "$80",
                  unit: "/ month",
                  description: "Unlimited classes, billed automatically.",
                  cta: "Subscribe",
                },
              ].map((plan) => (
                // snap-center: this card snaps to the horizontal centre when scrolling.
                // shrink-0 prevents flex from compressing the card below its set width.
                // w-[78%]: slightly narrower than the parent so adjacent cards peek in.
                <div
                  key={plan.name}
                  className="snap-center shrink-0 w-[78%] flex flex-col gap-4 rounded-2xl border border-soft-grey p-5"
                >
                  {/* Plan title — Playfair for editorial weight */}
                  <h4 className="font-playfair uppercase tracking-tight text-black-axis text-base leading-tight">
                    {plan.name}
                  </h4>

                  {/* Price block — large number draws the eye first */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-instrument text-black-axis text-3xl leading-none">
                      {plan.price}
                    </span>
                    <span className="font-instrument text-soft-grey text-xs">
                      {plan.unit}
                    </span>
                  </div>

                  {/* Short description line */}
                  <p className="font-instrument text-soft-grey text-xs leading-relaxed">
                    {plan.description}
                  </p>

                  {/* CTA button — mt-auto pushes it to the bottom of the card */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="mt-auto bg-black-axis text-white-axis font-instrument text-xs uppercase tracking-widest py-2.5 rounded-lg w-full"
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── CARD 3 (NORMAL): Live Class Schedule ─────────────────────── */}
          {/*
            self-start: this card does NOT stretch to match the height of the large
            cards in the same row. It sits at the top of its grid cell, shorter.
            This creates the LARGE / LARGE / SMALL visual hierarchy in row 1.
          */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white-axis rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="text-grey-axis">
                <IconClock />
              </span>
              <span className="font-instrument text-xs uppercase tracking-widest text-blue-axis">
                Live
              </span>
            </div>

            <div>
              <h3 className="font-instrument font-semibold text-black-axis text-sm leading-snug">
                Live Class Schedule
              </h3>
              <p className="font-instrument text-soft-grey text-xs mt-1 leading-relaxed">
                Always up-to-date
              </p>
            </div>

            {/* ── UI FRAGMENT: Class roster ──────────────────────────────── */}
            {/* border-soft-grey wraps the roster to frame it as a widget,
                matching the same treatment used on the Bookings card above. */}
            <div className="my-auto border border-soft-grey rounded-xl p-2 flex flex-col">
              {[
                { time: "7:00 AM", name: "Pilates Flow", full: false },
                { time: "9:00 AM", name: "Yoga Basics",  full: false },
                { time: "6:00 PM", name: "HIIT Circuit", full: true  },
              ].map((cls, i, arr) => (
                <div
                  key={cls.name}
                  className={`flex items-center justify-between py-2 px-1 ${
                    i < arr.length - 1 ? "border-b border-soft-grey" : ""
                    // Divider between rows; skipped on the last item.
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-instrument text-xs text-soft-grey w-14 shrink-0">
                      {cls.time}
                    </span>
                    <span className="font-instrument text-xs text-grey-axis font-medium">
                      {cls.name}
                    </span>
                  </div>

                  {/* When full: muted "Full" label — no action available.
                      When available: a small Book button with a Framer Motion
                      scale hover so it feels interactive and tappable. */}
                  {cls.full ? (
                    <span className="font-instrument text-xs text-soft-grey">
                      Full
                    </span>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="font-instrument text-xs uppercase tracking-widest text-white-axis bg-black-axis rounded-md px-2.5 py-1"
                    >
                      Book
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── CARD 4 (NORMAL): Get Found on Google ─────────────────────── */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white-axis rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="text-grey-axis">
                <IconSearch />
              </span>
              {/* No tag for this card — the concept is self-evident from title + fragment */}
            </div>

            <div>
              <h3 className="font-instrument font-semibold text-black-axis text-sm leading-snug">
                Get Found on Google
              </h3>
              <p className="font-instrument text-soft-grey text-xs mt-1 leading-relaxed">
                Turn searches into new clients
              </p>
            </div>

            {/* ── UI FRAGMENT: Simulated Google search result ───────────────
                A simplified SERP (Search Engine Results Page) snippet showing
                how the studio appears when someone searches on Google.
                This is purely illustrative — no real Google API is used.
            */}
            <div className="mt-auto flex flex-col gap-1.5 rounded-xl border border-soft-grey p-3">
              {/* Fake search bar */}
              <div className="flex items-center gap-2 border border-soft-grey rounded-full px-3 py-1.5 mb-2">
                <span className="text-soft-grey shrink-0">
                  <IconSearch />
                </span>
                <span className="font-instrument text-xs text-grey-axis">pilates near me</span>
              </div>

              {/* Result title — blue, like a real Google link */}
              <span className="font-instrument text-xs font-semibold text-blue-axis leading-tight">
                Studio Flow Pilates — Book a Class Online
              </span>

              {/* Green URL line */}
              <span className="font-instrument text-xs text-soft-grey">
                studioflow.com
              </span>

              {/* Star rating */}
              <div className="flex items-center gap-1">
                <span className="font-instrument text-xs text-grey-axis tracking-tight">
                  &#9733;&#9733;&#9733;&#9733;&#9733;
                  {/* &#9733; is the HTML entity for the filled star character ★ */}
                </span>
                <span className="font-instrument text-xs text-soft-grey">
                  4.9 &middot; 48 reviews
                </span>
              </div>

              {/* Description snippet */}
              <p className="font-instrument text-xs text-soft-grey leading-relaxed">
                Book your Pilates class online. Easy scheduling and secure payments.
              </p>
            </div>
          </motion.div>

          {/* ── CARD 5 (NORMAL): All Your Clients Organized ──────────────── */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white-axis rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
          >
            <div className="flex items-start">
              <span className="text-grey-axis">
                <IconUsers />
              </span>
            </div>

            <div>
              <h3 className="font-instrument font-semibold text-black-axis text-sm leading-snug">
                All Your Clients Organized
              </h3>
              <p className="font-instrument text-soft-grey text-xs mt-1 leading-relaxed">
                Everything in one place
              </p>
            </div>

            {/* ── UI FRAGMENT: Client list ───────────────────────────────── */}
            <div className="mt-auto border border-soft-grey rounded-xl p-3 flex flex-col gap-3">
              {[
                { name: "Ana García",     status: "new"    },
                { name: "Diego Ruiz",     status: "active" },
                { name: "Mariana López",  status: "new"    },
                { name: "Carlos Vega",    status: "active" },
              ].map((client) => (
                <div key={client.name} className="flex items-center justify-between">
                  {/* Client row: initial avatar + name */}
                  <div className="flex items-center gap-2">
                    {/* Initial avatar: a small circle with the first letter of the name */}
                    <div className="w-6 h-6 rounded-full bg-grey-axis flex items-center justify-center shrink-0">
                      {/* bg-grey-axis (#121212) on the card's white background = dark circle */}
                      <span className="font-instrument text-white-axis text-xs font-semibold">
                        {client.name[0]}
                        {/* [0] gets the first character of the name string (Python equiv: name[0]) */}
                      </span>
                    </div>
                    <span className="font-instrument text-xs text-grey-axis">
                      {client.name}
                    </span>
                  </div>

                  {/* Status label: blue-axis accent for "new", muted for "active" */}
                  <span
                    className={`font-instrument text-xs uppercase tracking-wide ${
                      client.status === "new" ? "text-blue-axis" : "text-soft-grey"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── CARD 6 (NORMAL): Instagram Auto-Sync ────────────────────── */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white-axis rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="text-grey-axis">
                <IconInstagram />
              </span>
              <span className="font-instrument text-xs uppercase tracking-widest text-blue-axis">
                Auto
              </span>
            </div>

            <div>
              <h3 className="font-instrument font-semibold text-black-axis text-sm leading-snug">
                Instagram Auto-Sync
              </h3>
              <p className="font-instrument text-soft-grey text-xs mt-1 leading-relaxed">
                Your content updates your site automatically
              </p>
            </div>

            {/* ── UI FRAGMENT: IG post → website transformation ─────────────
                Two panels side-by-side with an animated arrow between them.
                Left panel: an Instagram post thumbnail (static).
                Right panel: a website content block that fades in and out.
                instaVisible state alternates every 3 seconds (see useEffect above).
            */}
            <div className="flex items-center gap-3 mt-auto">
              {/* Instagram post panel */}
              <div className="flex-1 rounded-xl border border-soft-grey aspect-square flex flex-col items-center justify-center gap-1.5">
                <span className="text-grey-axis">
                  <IconInstagram />
                </span>
                <span className="font-instrument text-xs text-soft-grey">Post</span>
              </div>

              {/* Arrow: oscillates left-right to indicate "flowing" transformation.
                  animate x cycles between 0 and 4px on repeat. */}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
                className="text-blue-axis font-instrument text-base shrink-0"
                aria-hidden="true"
              >
                &#8594;
                {/* &#8594; is the HTML entity for the right arrow → */}
              </motion.span>

              {/* Website block: fades in/out based on instaVisible state.
                  opacity goes 0.25 (dim) → 1 (bright) on a 0.6s ease transition. */}
              <motion.div
                animate={{ opacity: instaVisible ? 1 : 0.25 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1 rounded-xl border border-soft-grey aspect-square flex flex-col items-center justify-center gap-1.5 px-3"
              >
                {/* Placeholder content lines representing a website text block */}
                <div className="w-full h-1.5 rounded-full bg-grey-axis" />
                <div className="w-3/4 h-1 rounded-full bg-soft-grey" />
                <div className="w-1/2 h-1 rounded-full bg-soft-grey" />
                <span className="font-instrument text-xs text-soft-grey mt-1">Site</span>
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
        {/* END FEATURE GRID */}

        {/* ── TECH FEATURES STRIP ─────────────────────────────────────────── */}
        {/*
          Secondary section directly below the grid.
          Purpose: show that supporting infrastructure is already included —
          without cluttering the main feature message above.
          Lower visual hierarchy: smaller text, muted colors, no white cards.
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24"
        >
          {/* Strip title: very small and muted — signals secondary importance */}
          <p className="font-instrument text-soft-grey text-xs uppercase tracking-widest text-center mb-8">
            Everything else is already handled
          </p>

          {/* 8 items in a 2-column mobile / 4-column desktop grid.
              Each item is an icon + short label — no descriptions needed. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {techFeatures.map((feature) => (
              // motion.div: Framer Motion wrapper enables the whileHover lift effect.
              // group: Tailwind group — lets child elements react to this div's hover state
              // via group-hover: classes without needing JavaScript.
              <motion.div
                key={feature.label}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center gap-2.5 py-3 px-4 rounded-xl bg-grey-axis cursor-default"
                // bg-grey-axis (#121212): very dark grey on black = subtle tile definition.
                // cursor-default: tells the browser this is not a clickable link.
              >
                {/* group-hover:text-white-axis: icon switches to white when the card is hovered */}
                <span className="text-white-axis shrink-0">
                  <TechIcon path={feature.d} />
                </span>
                {/* text-sm: one step up from xs — more readable at rest and on hover. */}
                <span className="font-instrument text-sm text-white-axis leading-tight">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Trust line: short reassurance copy, centered and muted */}
          <p className="font-instrument text-soft-grey text-xs text-center mt-8 tracking-wide">
            No setup. No maintenance. No tech headaches.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
