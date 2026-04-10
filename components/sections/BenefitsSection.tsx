"use client"
// "use client" must be the absolute first line — nothing above this, not even blank lines.
// This component uses useState, useEffect, useRef (interactive state),
// Framer Motion drag (browser API) — all require a Client Component in Next.js App Router.

import { useState, useEffect, useRef } from "react"
// motion          — wraps HTML/SVG elements to make them animatable
// AnimatePresence — lets exiting elements play their exit animation before unmounting
// useInView       — returns true once the referenced element enters the viewport
import { motion, AnimatePresence, useInView } from "framer-motion"
// Variants: TypeScript type for named animation state objects.
// Without it, TypeScript widens literal strings (e.g. "easeOut") to `string`,
// which breaks Framer Motion's expected Easing union type.
import type { Variants } from "framer-motion"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type SidebarMetric = {
  value: string  // e.g. "0"
  label: string  // e.g. "Lost DM's"
}

type BenefitBlock = {
  id: number
  label: string
  bullets: string[]
  stat: string               // large primary number, e.g. "+24%"
  statLabel: string          // label under the stat, e.g. "Revenue Growth"
  sidebarMetrics: SidebarMetric[]
  trendData: number[]        // 6 data points for the graph line
  primaryDisclaimer: string  // footnote for the * superscript
  secondaryDisclaimer: string // footnote for the ** superscript
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const benefits: BenefitBlock[] = [
  {
    id: 0,
    label: "More Revenue",
    bullets: [
      "Accept bookings 24/7",
      "Sell memberships & packages online",
      "Capture clients you currently lose",
    ],
    stat: "+24%",
    statLabel: "Revenue Growth",
    sidebarMetrics: [
      { value: "0", label: "Lost DM's" },
      { value: "0", label: "Manual Payments" },
    ],
    trendData: [20, 45, 30, 80, 95, 110],
    primaryDisclaimer:
      "This is the \"Hybrid Effect.\" Mindbody's 2025 State of the Industry Report and WellnessLiving show that adding automated digital touchpoints and 24/7 booking availability typically increases Average Revenue Per User (ARPU) by 20–40% by capturing late-night bookings that would otherwise be lost in a DM inbox.",
    secondaryDisclaimer:
      "'0' represents processes handled automatically by the system rather than manually. In practice, this removes most operational friction points.",
  },
  {
    id: 1,
    label: "Less Admin",
    bullets: [
      "No more back-and-forth in DMs",
      "Automatic scheduling",
      "Centralized system",
    ],
    stat: "+12h",
    statLabel: "Saved Weekly",
    sidebarMetrics: [
      { value: "0", label: "Inbox Chaos" },
      { value: "0", label: "Spreadsheet Tracking" },
    ],
    trendData: [10, 20, 35, 55, 75, 90],
    primaryDisclaimer:
      "Derived from PushPress and Wodify 2026 case studies. The average boutique owner spends 8–11 hours on manual billing, \"ghosted\" lead follow-ups, and schedule coordination. Your system centralizes this, reclaiming roughly 1.5 days of work per week.",
    secondaryDisclaimer:
      "'0' represents processes handled automatically by the system rather than manually. In practice, this removes most operational friction points.",
  },
  {
    id: 2,
    label: "More Clients",
    bullets: [
      "Show up on Google",
      "Share a professional link",
      "Convert visitors into bookings",
    ],
    stat: "~3.5x",
    statLabel: "Client Conv. Rate",
    sidebarMetrics: [
      { value: "0", label: "Checkout Friction" },
      { value: "0", label: "Manual Confirmations" },
    ],
    trendData: [5, 10, 40, 60, 90, 150],
    primaryDisclaimer:
      "Based on conversion audits comparing \"Link-in-bio\" aggregators (like Linktree) to dedicated, branded landing pages. Pete Bowen's research shows that reducing friction and increasing brand focus can double or triple conversion rates (99.8%+ increase).",
    secondaryDisclaimer:
      "'0' represents processes handled automatically by the system rather than manually. In practice, this removes most operational friction points.",
  },
  {
    id: 3,
    label: "Better Experience",
    bullets: [
      "Clean, simple interface",
      "Clients find everything instantly",
      "Use your Instagram branding",
    ],
    stat: "> 80 %",
    statLabel: "Faster Bookings",
    sidebarMetrics: [
      { value: "0", label: "Outdated Information" },
      { value: "0", label: "Confusion" },
    ],
    trendData: [20, 40, 80, 120, 180, 250],
    primaryDisclaimer:
      "If a manual booking takes 4 hours (including the wait for a reply) and an automated one takes 45 seconds, the automated flow is technically 99% faster. We use 80% as a conservative stat to account for the time a user spends actually reading the site.",
    secondaryDisclaimer:
      "'0' represents processes handled automatically by the system rather than manually. In practice, this removes most operational friction points.",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: getLastPoint
// Returns the SVG (x, y) of the final data point — used for the endpoint dot.
// ─────────────────────────────────────────────────────────────────────────────
function getLastPoint(
  data: number[],
  w: number,
  h: number,
): { x: number; y: number } {
  const padding = 8
  const maxVal = Math.max(...data)
  const minVal = Math.min(...data)
  const range = maxVal - minVal || 1
  return {
    x: w - padding,
    y: h - padding - ((data[data.length - 1] - minVal) / range) * (h - padding * 2),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: buildPath
// Converts an array of numeric data values into an SVG cubic-bezier path string.
// viewBox assumed to be w × h SVG units with 8-unit padding on all sides.
// ─────────────────────────────────────────────────────────────────────────────
function buildPath(data: number[], w: number, h: number): string {
  const padding = 8
  const maxVal = Math.max(...data)
  const minVal = Math.min(...data)
  const range = maxVal - minVal || 1
  const step = (w - padding * 2) / (data.length - 1)

  // SVG Y axis is inverted: 0 = top, h = bottom.
  // Subtracting from h flips values so higher data → higher on screen.
  const pts = data.map((v, i) => ({
    x: padding + i * step,
    y: h - padding - ((v - minVal) / range) * (h - padding * 2),
  }))

  // Smooth cubic bezier: midpoint X for both control points keeps curves
  // flowing without vertical overshoot.
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1]
    const c = pts[i]
    const cpx = ((p.x + c.x) / 2).toFixed(2)
    d += ` C ${cpx} ${p.y.toFixed(2)}, ${cpx} ${c.y.toFixed(2)}, ${c.x.toFixed(2)} ${c.y.toFixed(2)}`
  }
  return d
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// Per animate-section.md: 0.7s default, ease "easeOut", stagger 0.12s.
// ─────────────────────────────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const animItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

// Carousel slide variants.
// custom prop carries direction: 1 = forward (next), -1 = backward (prev).
// Enter: card arrives from the far side (off-screen).
// Center: card rests in place — this is the active, visible state.
// Exit: card departs to the near side (off-screen).
const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  }),
}

// "Weightless Dissolve": 2px Y-shift + fade for disclaimers.
// Applied whenever the active benefit changes.
const dissolve: Variants = {
  hidden: { opacity: 0, y: 2 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit:   { opacity: 0, y: -2, transition: { duration: 0.3, ease: "easeOut" as const } },
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BenefitsSection() {

  // activeIndex: which of the 4 benefit cards is currently shown in the carousel.
  const [activeIndex, setActiveIndex] = useState(0)

  // direction: controls which way the slide animation runs.
  // 1 = next card comes from the right, -1 = prev card comes from the left.
  const [direction, setDirection] = useState(1)

  // isHovered: pauses auto-cycle while user is hovering over the carousel.
  const [isHovered, setIsHovered] = useState(false)

  // sectionRef + isInView: gates the trendline draw animation so it only
  // plays after the section enters the viewport.
  // "once: true" means isInView stays permanently true after first trigger.
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  // Navigate forward, wrapping from last back to first.
  const next = () => {
    setDirection(1)
    setActiveIndex(prev => (prev + 1) % benefits.length)
  }

  // Navigate backward, wrapping from first back to last.
  const prev = () => {
    setDirection(-1)
    setActiveIndex(prev => (prev - 1 + benefits.length) % benefits.length)
  }

  // Jump to a specific card; infer direction from whether target is ahead or behind.
  const goTo = (index: number) => {
    setDirection(index >= activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  // Auto-cycle: advances every 3 seconds unless user is hovering.
  // Cleanup function (clearInterval) runs before the effect re-fires or
  // on component unmount — prevents multiple intervals stacking up.
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [isHovered])

  // Snapshot of the currently visible benefit block.
  const active = benefits[activeIndex]

  return (
    <section
      ref={sectionRef}
      className="bg-grey-axis py-20 px-6 md:py-36 md:px-12"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADLINE ────────────────────────────────────────────── */}
        {/* h2: one per section, per SEO rules. Page's h1 is in the Hero. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16 md:mb-24 max-w-2xl"
        >
          <motion.h2
            variants={animItem}
            className="font-playfair uppercase tracking-tight text-white-axis text-4xl leading-tight"
          >
            Stop running your studio manually.<br />
            Start running it like a system.
          </motion.h2>
        </motion.div>

        {/* ── DESKTOP TAB NAVIGATION ──────────────────────────────────────── */}
        {/* Hidden on mobile — swipe gesture serves as navigation there.
            Four tab buttons sit above the carousel card; the active one gets
            a blue underline border. border-b on the wrapper + border-b-2 -mb-px
            on each button creates the "connected tab" effect. */}
        <div className="hidden md:flex justify-center gap-0 mb-8 border-b border-white-axis/[0.08]">
          {benefits.map((benefit, index) => (
            <motion.button
              key={benefit.id}
              onClick={() => goTo(index)}
              animate={{ opacity: index === activeIndex ? 1 : 0.4 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className={[
                // -mb-px: pulls the button 1px down so its bottom border
                // overlaps the container's border-b, creating a flush tab look.
                "px-6 py-3 font-instrument text-xs uppercase tracking-widest font-semibold border-b-2 -mb-px",
                index === activeIndex
                  ? "border-blue-axis text-white-axis"
                  : "border-transparent text-soft-grey",
              ].join(" ")}
            >
              {benefit.label}
            </motion.button>
          ))}
        </div>

        {/* ── CAROUSEL ────────────────────────────────────────────────────── */}
        {/* overflow-hidden: clips entering/exiting cards so they don't appear
            outside the card boundary during the slide transition.
            mode="popLayout": the exiting card gets position:absolute
            (so it no longer affects layout) while the entering card takes its
            space — both animate simultaneously without any layout jumps. */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              // Changing key unmounts the old card and mounts a new one.
              // AnimatePresence intercepts this to play exit/enter animations.
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              // drag="x": enables horizontal drag on the card.
              // On touch screens this becomes the swipe-to-navigate gesture.
              drag="x"
              // dragConstraints: the card rubber-bands back to x=0 after drag.
              // The actual navigation happens in onDragEnd, not via position.
              dragConstraints={{ left: 0, right: 0 }}
              // dragElastic: how far beyond the constraints the card can stretch.
              // 0.08 = subtle rubber-band feedback without flying off screen.
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                // info.offset.x: total distance moved from drag start.
                // ±50px threshold before committing to a navigation step.
                if (info.offset.x < -50) next()
                else if (info.offset.x > 50) prev()
              }}
              // select-none: prevents text from being highlighted while dragging.
              // cursor-grab / active:cursor-grabbing: visual hint on desktop.
              className="relative overflow-hidden bg-black-axis/70 backdrop-blur-xl border border-white-axis/[0.08] rounded-2xl p-6 md:p-8 cursor-grab active:cursor-grabbing select-none"
            >

              {/* ── DECORATIVE GLOWS ────────────────────────────────────── */}
              {/* Two ambient glow circles give the card a lit surface feel
                  on the dark background. pointer-events-none: they don't
                  block clicks or drag gestures. */}
              <div
                className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-white-axis/[0.08] blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-white-axis/[0.05] blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              {/* ── MOBILE LABEL ────────────────────────────────────────── */}
              {/* Shown only on mobile — desktop has the tab nav above the card.
                  Blue color distinguishes it as a section/category label. */}
              <p className="md:hidden font-instrument text-xs uppercase tracking-widest text-blue-axis mb-6">
                {active.label}
              </p>

              {/* ── CARD BODY ───────────────────────────────────────────── */}
              {/* Stacked vertically on both mobile and desktop, centered.
                  items-center: horizontally centers each block.
                  text-center: centers all text within each block. */}
              <div className="flex flex-col items-center text-center gap-8 md:flex-row md:justify-center md:gap-16">

                {/* Stat + metrics — top */}
                <div>

                  {/* Primary stat number — Playfair Display, large */}
                  <div className="font-playfair text-5xl md:text-6xl text-white-axis tracking-tight leading-none">
                    {active.stat}
                    {/* <sup>: HTML superscript — slightly raised, smaller text.
                        Signals the reader to check Source * below the card. */}
                    <sup className="font-instrument text-sm text-soft-grey ml-1 align-super">
                      *
                    </sup>
                  </div>
                  <p className="font-instrument text-xs uppercase tracking-widest text-soft-grey mt-3">
                    {active.statLabel}
                  </p>

                  {/* Glassmorphism metrics card — below the primary stat.
                      inline-block: shrinks to fit its content width.
                      min-w: prevents it from being too narrow on mobile. */}
                  <div className="mt-5 relative overflow-hidden bg-white-axis/[0.06] backdrop-blur-md border border-white-axis/[0.10] rounded-xl p-4 inline-block min-w-[150px]">
                    <div
                      className="absolute top-0 right-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-white-axis/[0.08] blur-2xl pointer-events-none"
                      aria-hidden="true"
                    />
                    {active.sidebarMetrics.map((metric, mi) => (
                      <div
                        key={mi}
                        className={[
                          // flex + items-baseline: value and label sit on the
                          // same text baseline, so numbers and labels align cleanly.
                          "flex items-baseline gap-2 py-1.5",
                          mi < active.sidebarMetrics.length - 1
                            ? "border-b border-white-axis/[0.08]"
                            : "",
                        ].join(" ")}
                      >
                        <span className="font-playfair text-base text-white-axis leading-none flex-shrink-0">
                          {metric.value}
                          <sup className="font-instrument text-[9px] text-soft-grey ml-0.5 align-super">
                            **
                          </sup>
                        </span>
                        <span className="font-instrument text-[11px] text-soft-grey leading-snug">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bullets — below stat */}
                <div className="flex justify-center md:justify-start">
                  <ul className="flex flex-col gap-4 text-left">
                    {active.bullets.map((bullet, bi) => (
                      <li
                        key={bi}
                        className="flex items-start gap-3 font-instrument text-sm md:text-base text-soft-grey"
                      >
                        {/* Minimal checkmark — blue accent, fixed width
                            so all bullet text aligns regardless of check width. */}
                        <span
                          className="text-blue-axis text-xs mt-1 flex-shrink-0 w-3 text-center"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
              {/* END CARD BODY */}

              {/* ── TRENDLINE ───────────────────────────────────────────── */}
              {/* SVG viewBox "0 0 400 100": internal coordinate system.
                  preserveAspectRatio="none": stretches to fill h-20 (80px) container.
                  key={`path-${activeIndex}`}: remounts the path on every card change,
                  replaying the pathLength 0→1 draw animation from scratch.
                  isInView is "once:true" (stays true permanently after first trigger),
                  so every card transition after scroll-in animates immediately. */}
              <div className="w-full h-20 mt-8">
                <svg
                  viewBox="0 0 400 100"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  {/* Subtle horizontal grid lines */}
                  {[25, 50, 75].map(y => (
                    <line
                      key={y}
                      x1="0" y1={y} x2="400" y2={y}
                      stroke="var(--color-white-axis)"
                      strokeOpacity="0.05"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Trend path: draws itself via pathLength 0→1 animation. */}
                  <motion.path
                    key={`path-${activeIndex}`}
                    d={buildPath(active.trendData, 400, 100)}
                    stroke="var(--color-blue-axis)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isInView ? 1 : 0,
                      opacity:    isInView ? 1 : 0,
                    }}
                    transition={{
                      pathLength: { duration: 0.8, ease: "easeOut" as const },
                      opacity:    { duration: 0.3, ease: "easeOut" as const },
                    }}
                  />

                  {/* Endpoint dot — appears after the line finishes drawing. */}
                  {(() => {
                    const pt = getLastPoint(active.trendData, 400, 100)
                    return (
                      <motion.circle
                        key={`dot-${activeIndex}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="var(--color-blue-axis)"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: isInView ? 1 : 0,
                          scale:   isInView ? 1 : 0,
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" as const, delay: 0.7 }}
                      />
                    )
                  })()}
                </svg>
              </div>
              {/* END TRENDLINE */}

            </motion.div>
          </AnimatePresence>
        </div>
        {/* END CAROUSEL */}

        {/* ── NAVIGATION: DOTS ────────────────────────────────────────────── */}
        {/* Active dot is wider (20px) and full opacity to show position.
            Inactive dots are narrow (6px) and faded.
            Framer Motion animates width and opacity smoothly between states. */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {benefits.map((_, i) => (
            // h-1.5 is fixed; width is controlled entirely by animate below.
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              animate={{
                width:   i === activeIndex ? 20 : 6,
                opacity: i === activeIndex ? 1 : 0.35,
              }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="h-1.5 rounded-full bg-blue-axis"
              aria-label={`Show ${benefits[i].label}`}
            />
          ))}
        </div>
        {/* END NAVIGATION */}

        {/* ── DISCLAIMERS — outside the card, below navigation ────────────── */}
        {/* Dissolve transition: fades + shifts 2px whenever active benefit changes. */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`disclaimer-${activeIndex}`}
            variants={dissolve}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8"
          >
            <p className="font-instrument text-[10px] text-soft-grey leading-relaxed opacity-60">
              <span className="text-white-axis opacity-70 not-italic">
                Source * —{" "}
              </span>
              {active.primaryDisclaimer}
            </p>
            <p className="font-instrument text-[10px] text-soft-grey leading-relaxed opacity-60">
              <span className="text-white-axis opacity-70 not-italic">
                Source ** —{" "}
              </span>
              {active.secondaryDisclaimer}
            </p>
          </motion.div>
        </AnimatePresence>
        {/* END DISCLAIMERS */}

      </div>
    </section>
  )
}
