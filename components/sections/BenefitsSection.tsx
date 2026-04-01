"use client"
// "use client" must be the absolute first line.
// This component uses useState, useEffect, useRef (interactive state for
// auto-cycling and hover detection) and Framer Motion browser APIs —
// all require a Client Component in Next.js App Router.

import { useState, useEffect, useRef } from "react"
// motion         — wraps HTML/SVG elements to make them animatable
// AnimatePresence — lets exiting elements play their exit animation before unmounting
// useInView      — returns true once the referenced element enters the viewport
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
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

// "Weightless Dissolve": 2px Y-shift + fade.
// Applied to every dynamic element in the dashboard whenever activeIndex changes.
const dissolve: Variants = {
  hidden: { opacity: 0, y: 2 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit:   { opacity: 0, y: -2, transition: { duration: 0.3, ease: "easeOut" } },
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BenefitsSection() {

  // activeIndex: which of the 4 benefit blocks is highlighted.
  // Drives left-column styling and all dashboard content.
  const [activeIndex, setActiveIndex] = useState(0)

  // isHovered: pauses auto-cycle while user is over the benefit blocks.
  const [isHovered, setIsHovered] = useState(false)

  // sectionRef + isInView: gates the trendline draw animation so it only
  // plays after the section enters the viewport, not on page load.
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  // Auto-cycle: advances every 3 seconds unless hovering.
  // Cleanup function (clearInterval) runs before the effect re-fires or
  // on component unmount — prevents multiple intervals stacking up.
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % benefits.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [isHovered])

  const active = benefits[activeIndex]

  return (
    <section
      ref={sectionRef}
      className="bg-grey-axis py-20 px-6 md:py-36 md:px-12 [overflow-anchor:none]"
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
            className="font-playfair uppercase tracking-tight text-white-axis text-3xl md:text-4xl leading-tight"
          >
            Stop running your studio manually.<br />
            Start running it like a system.
          </motion.h2>
        </motion.div>

        {/* ── TWO-COLUMN LAYOUT ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">

          {/* ── LEFT COLUMN: BENEFIT BLOCKS (40%) ───────────────────────────── */}
          {/* Hover on the column as a whole pauses the auto-cycle.
              Moving between blocks doesn't restart the timer. */}
          <div
            className="w-full md:w-[40%] flex flex-col gap-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {benefits.map((benefit, index) => {
              const isActive = index === activeIndex
              return (
                // motion.button: clickable per component.md rule (no div onClick).
                // opacity animates between 1 (active) and 0.3 (inactive).
                <motion.button
                  key={benefit.id}
                  onClick={() => setActiveIndex(index)}
                  animate={{ opacity: isActive ? 1 : 0.3 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={[
                    "text-left w-full px-6 py-5 border-l-2",
                    isActive ? "border-blue-axis" : "border-transparent",
                  ].join(" ")}
                >
                  {/* Block label — Instrument Sans, uppercase */}
                  <p className={[
                    "font-instrument text-sm uppercase tracking-widest font-semibold",
                    isActive ? "text-white-axis" : "text-soft-grey",
                  ].join(" ")}>
                    {benefit.label}
                  </p>

                  {/* Bullets — always rendered in the DOM so height never changes.
                      Only opacity animates: no layout shift, no scroll-anchor jitter.
                      Inactive bullets are invisible but occupy the same space,
                      which reads as generous whitespace (consistent with AXIS feel).
                      pointer-events-none + select-none prevent interaction when hidden. */}
                  <motion.ul
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={[
                      "mt-3 flex flex-col gap-2 overflow-hidden",
                      !isActive ? "pointer-events-none select-none" : "",
                    ].join(" ")}
                  >
                    {benefit.bullets.map((bullet, bi) => (
                      // Stagger: each bullet fades in 80ms after the previous.
                      <motion.li
                        key={bi}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: bi * 0.08,
                        }}
                        className="flex items-start gap-3 font-instrument text-sm text-soft-grey"
                      >
                        {/* Minimal checkmark hook symbol — blue accent, fixed width
                            so all bullet text aligns regardless of check width */}
                        <span
                          className="text-blue-axis text-xs mt-0.5 flex-shrink-0 w-3 text-center"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        {bullet}
                      </motion.li>
                    ))}
                  </motion.ul>

                </motion.button>
              )
            })}
          </div>
          {/* END LEFT COLUMN */}

          {/* ── RIGHT COLUMN (60%) ───────────────────────────────────────────── */}
          {/* Outer wrapper: black card + disclaimers stacked vertically.
              The disclaimers live outside the black card but inside this column. */}
          <div className="w-full md:w-[60%] flex flex-col gap-6">

            {/* ── GLASSMORPHISM DASHBOARD CARD ────────────────────────────── */}
            {/* Glassmorphism: semi-transparent dark surface + backdrop blur +
                subtle border + rounded corners. Sits on bg-grey-axis (#121212),
                so the slight transparency creates visible depth and separation. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-black-axis/70 backdrop-blur-xl border border-white-axis/[0.08] rounded-2xl p-6 md:p-8"
            >

              {/* ── DECORATIVE GLOWS ────────────────────────────────────────── */}
              {/* Two glow circles create an ambient light field across the card.
                  Top-right: primary glow — brighter, larger.
                  Bottom-left: secondary glow — same size, slightly dimmer.
                  Together they give the card a lit surface feel on the dark bg. */}
              <div
                className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-white-axis/[0.08] blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-white-axis/[0.05] blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              {/* ── STAT ROW: primary stat (left) + glass card (right) ────── */}
              {/* flex-col on mobile so the glass card stacks below the stat.
                  sm:flex-row on wider screens: stat flush-left, card flush-right,
                  both vertically centred.
                  mb-8: space before the trendline below. */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`stat-row-${activeIndex}`}
                  variants={dissolve}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-8"
                >

                  {/* Primary stat — Playfair Display, left side */}
                  <div>
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
                  </div>

                  {/* Glassmorphism metrics card — right side, next to the primary stat.
                      relative overflow-hidden: required to contain the inner glow div.
                      Each metric is laid out as a horizontal row: value left,
                      label right — aligned on the baseline so they read as one line.
                      flex-shrink-0 prevents the card from being squeezed by the stat. */}
                  <div className="relative overflow-hidden bg-white-axis/[0.06] backdrop-blur-md border border-white-axis/[0.10] rounded-xl p-4 flex-shrink-0">

                    {/* Inner glow — top-right corner, smaller than the outer card's
                        glow to match the card's smaller scale. */}
                    <div
                      className="absolute top-0 right-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-white-axis/[0.08] blur-2xl pointer-events-none"
                      aria-hidden="true"
                    />
                    {active.sidebarMetrics.map((metric, mi) => (
                      <div
                        key={mi}
                        className={[
                          // flex + items-baseline: value and label sit on the same
                          // text baseline, so numbers and labels align cleanly.
                          "flex items-baseline gap-2 py-1.5",
                          mi < active.sidebarMetrics.length - 1
                            ? "border-b border-white-axis/[0.08]"
                            : "",
                        ].join(" ")}
                      >
                        {/* Value — compact size to keep the row tight */}
                        <span className="font-playfair text-base text-white-axis leading-none flex-shrink-0">
                          {metric.value}
                          <sup className="font-instrument text-[9px] text-soft-grey ml-0.5 align-super">
                            **
                          </sup>
                        </span>
                        {/* Label — sits directly to the right on the same line */}
                        <span className="font-instrument text-[11px] text-soft-grey leading-snug">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>
              {/* END STAT ROW */}

              {/* ── TRENDLINE GRAPH ─────────────────────────────────────────── */}
              {/* SVG viewBox "0 0 400 100": internal coordinate system.
                  preserveAspectRatio="none": stretches to fill h-20 (80px) container.
                  key={activeIndex} on the path re-mounts it on every change,
                  replaying the pathLength 0→1 draw animation from scratch. */}
              <div className="w-full h-20">
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

                  {/* Trend path: draws itself via pathLength 0→1.
                      isInView gates the animation — won't draw off-screen.
                      var(--color-blue-axis): CSS variable from globals.css,
                      avoids hardcoding the hex value directly. */}
                  <motion.path
                    key={activeIndex}
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
                      pathLength: { duration: 0.8, ease: "easeOut" },
                      opacity:    { duration: 0.3, ease: "easeOut" },
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
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
                      />
                    )
                  })()}

                </svg>
              </div>
              {/* END TRENDLINE */}

            </motion.div>
            {/* END BLACK DASHBOARD CARD */}

            {/* ── DISCLAIMERS — outside the card, below it ─────────────────── */}
            {/* Two columns side by side on desktop, stacked on mobile.
                AnimatePresence + Weightless Dissolve: both columns fade+shift
                together whenever the active benefit changes. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`disclaimer-${activeIndex}`}
                variants={dissolve}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {/* Source * — primary stat footnote */}
                <p className="font-instrument text-[10px] text-soft-grey leading-relaxed opacity-60">
                  <span className="text-white-axis opacity-70 not-italic">
                    Source * —{" "}
                  </span>
                  {active.primaryDisclaimer}
                </p>

                {/* Source ** — secondary metrics footnote (same text for all blocks) */}
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
          {/* END RIGHT COLUMN */}

        </div>
        {/* END TWO-COLUMN LAYOUT */}

      </div>
    </section>
  )
}
