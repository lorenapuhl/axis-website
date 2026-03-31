"use client"
// "use client" must be the absolute first line.
// This component uses useState, useEffect, useRef (interactive state for
// auto-cycling and hover detection) and Framer Motion browser APIs —
// all require a Client Component in Next.js App Router.

import { useState, useEffect, useRef } from "react"
// motion       — wraps HTML/SVG elements to make them animatable
// AnimatePresence — lets exiting elements play their exit animation before unmounting
// useInView    — returns true once the referenced element enters the viewport
import { motion, AnimatePresence, useInView } from "framer-motion"
// Variants: TypeScript type for named animation state objects.
// Without it, TypeScript widens literal strings (e.g. "easeOut") to `string`,
// which breaks Framer Motion's expected Easing union type.
import type { Variants } from "framer-motion"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// TypeScript interfaces work like Python dataclasses — they describe the
// shape of an object without creating a real class.
// ─────────────────────────────────────────────────────────────────────────────

// A single metric shown in the sidebar of the dashboard card.
type SidebarMetric = {
  value: string  // e.g. "0"
  label: string  // e.g. "Lost DM's"
}

// All data for one benefit block (left column + right dashboard).
type BenefitBlock = {
  id: number
  label: string              // headline for the left-column block, e.g. "More Revenue"
  bullets: string[]          // 3 bullet points shown when this block is active
  stat: string               // large primary number, e.g. "+24%"
  statLabel: string          // label under the stat, e.g. "Revenue Growth"
  sidebarMetrics: SidebarMetric[]  // 2 smaller metric cards
  trendData: number[]        // 6 data points for the graph line
  primaryDisclaimer: string  // footnote for the * superscript
  secondaryDisclaimer: string // footnote for the ** superscript
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// All content for the 4 benefit blocks.
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
    // Steep growth: accelerates sharply toward the right
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
    stat: "12h",
    statLabel: "Saved Weekly",
    sidebarMetrics: [
      { value: "0", label: "Inbox Chaos" },
      { value: "0", label: "Spreadsheet Tracking" },
    ],
    // Steady growth: consistent upward slope, no sharp jumps
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
    stat: "3.5x",
    statLabel: "Conv. Rate",
    sidebarMetrics: [
      { value: "0", label: "Checkout Friction" },
      { value: "0", label: "Manual Confirmations" },
    ],
    // Exponential growth: slow start, then rapid climb
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
    stat: "< 2s",
    statLabel: "Booking",
    sidebarMetrics: [
      { value: "0", label: "Outdated Information" },
      { value: "0", label: "Confusion" },
    ],
    // Inverted / decreasing trend: visually represents friction being reduced
    trendData: [250, 180, 120, 80, 40, 20],
    primaryDisclaimer:
      "This is the Google/Deloitte 2025 Standard. Research shows that mobile users abandon sites after 3 seconds. By using a modern stack (Next.js), you ensure a load-to-checkout time that is 8% more likely to convert for every 0.1s saved.",
    secondaryDisclaimer:
      "'0' represents processes handled automatically by the system rather than manually. In practice, this removes most operational friction points.",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: getLastPoint
// Returns the (x, y) SVG coordinates of the final data point in a trend dataset.
// Used to position the endpoint dot on the trendline without parsing the path string.
// Parameters mirror buildPath (same padding, same coordinate system).
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
//
// Parameters:
//   data — array of numbers (6 values from trendData)
//   w    — SVG viewBox width in SVG units (e.g. 400)
//   h    — SVG viewBox height in SVG units (e.g. 100)
//
// Returns: a path `d` string — "M x y C cx1 cy1, cx2 cy2, x y ..."
// The path fits within the viewBox with 8-unit padding on all sides.
// ─────────────────────────────────────────────────────────────────────────────
function buildPath(data: number[], w: number, h: number): string {
  const padding = 8
  const maxVal = Math.max(...data)
  const minVal = Math.min(...data)
  // range: prevents division by zero if all data points are equal
  const range = maxVal - minVal || 1
  // step: horizontal distance between each data point in SVG units
  const step = (w - padding * 2) / (data.length - 1)

  // Map each data value to an (x, y) coordinate in SVG space.
  // SVG Y axis is inverted — 0 is at the top, h is at the bottom.
  // We subtract from h to flip this so higher data values appear higher on the chart.
  const pts = data.map((v, i) => ({
    x: padding + i * step,
    y: h - padding - ((v - minVal) / range) * (h - padding * 2),
  }))

  // Build a smooth cubic bezier path through every point.
  // Each "C" command takes two control points and a destination.
  // We use the midpoint X between adjacent points for both control points,
  // keeping each at the same Y as its anchor — this creates smooth S-curves
  // without vertical overshoot or oscillation.
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
// Per animate-section.md: default 0.7s, ease "easeOut", stagger 0.12s.
// Variants are plain objects with named states (e.g. "hidden", "show").
// Framer Motion transitions between these states when the variant name changes.
// ─────────────────────────────────────────────────────────────────────────────

// container + animItem: staggered fade-up for the section headline.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const animItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

// "Weightless Dissolve": a 2px Y-axis shift combined with a fade.
// Used whenever the active stat, sidebar metrics, or disclaimer text changes.
// The small shift creates a sense of the content "lifting away" and "settling in".
const dissolve: Variants = {
  hidden: { opacity: 0, y: 2 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit:   { opacity: 0, y: -2, transition: { duration: 0.3, ease: "easeOut" } },
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BenefitsSection() {

  // activeIndex: 0-based index of the currently highlighted benefit block.
  // Controls the left-column block styling (opacity, border) and all content
  // inside the right-column dashboard card.
  const [activeIndex, setActiveIndex] = useState(0)

  // isHovered: true while the user's cursor is over the benefit blocks column.
  // When true, the auto-cycle is paused so the user can read without disruption.
  const [isHovered, setIsHovered] = useState(false)

  // sectionRef: attached to the <section> element.
  // useInView watches it and flips isInView to true once it enters the viewport.
  // Used to gate the trendline "draw" animation — it should only draw when visible.
  const sectionRef = useRef<HTMLElement>(null)
  // once: true — only fires once, even if the user scrolls away and back.
  // margin: "-100px" — triggers 100px before the section fully enters view.
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  // Auto-cycle effect: advances activeIndex every 3 seconds.
  // useEffect(() => { ... }, [isHovered]) re-runs whenever isHovered changes:
  //   - When isHovered becomes true  → early return, no interval is set
  //   - When isHovered becomes false → interval restarts from scratch
  // The returned function () => clearInterval(timer) is the "cleanup" —
  // React calls it before re-running the effect or when the component unmounts.
  // This prevents multiple intervals from running at the same time.
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % benefits.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [isHovered])

  // Shorthand for the currently active benefit, used throughout the JSX below.
  const active = benefits[activeIndex]

  return (
    // ref={sectionRef}: connects this element to the useInView hook above.
    // bg-grey-axis: secondary section background (slightly lighter than pure black).
    // py-20 px-6 — mobile padding | md:py-36 md:px-12 — desktop padding
    <section
      ref={sectionRef}
      className="bg-grey-axis py-20 px-6 md:py-36 md:px-12"
    >
      {/* max-w-6xl mx-auto: constrains content to 1152px and centers it */}
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADLINE ────────────────────────────────────────────── */}
        {/* h2: SEO requirement — each section gets exactly one <h2>.
            The page's single <h1> lives in the Hero section.
            Stagger container: h2 fades in first, 120ms later any following
            elements animate in (none here, but the pattern is kept consistent). */}
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
        {/* END SECTION HEADLINE */}

        {/* ── TWO-COLUMN LAYOUT ─────────────────────────────────────────────── */}
        {/* flex-col on mobile (blocks stack vertically),
            flex-row on md+ (blocks sit side by side).
            items-start: columns align to their tops, not stretched to equal height. */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">

          {/* ── LEFT COLUMN: BENEFIT BLOCKS (40% desktop) ──────────────────── */}
          {/* onMouseEnter/Leave: sets isHovered to pause/resume the auto-cycle.
              The hover detection is on the column as a whole, not individual blocks,
              so moving between blocks doesn't restart the cycle. */}
          <div
            className="w-full md:w-[40%] flex flex-col gap-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* benefits.map: React's equivalent of a Python for-loop that builds HTML.
                Each iteration renders one benefit block as a <button>.
                key={benefit.id}: React uses this to track which element is which
                when the list re-renders — must be unique and stable. */}
            {benefits.map((benefit, index) => {
              const isActive = index === activeIndex
              return (
                // motion.button: a Framer Motion-enhanced <button>.
                // Per component.md: every clickable element must be <button>.
                // onClick: manually sets this block as active when clicked.
                // animate.opacity: active = full visibility, inactive = 30% dim.
                // transition: 0.4s easeOut for the opacity change.
                <motion.button
                  key={benefit.id}
                  onClick={() => setActiveIndex(index)}
                  animate={{ opacity: isActive ? 1 : 0.3 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={[
                    "text-left w-full px-6 py-5 border-l-2",
                    // Active block: Electric Blue left border.
                    // Inactive: transparent border (reserves the space so layout doesn't shift).
                    isActive ? "border-blue-axis" : "border-transparent",
                  ].join(" ")}
                >
                  {/* Block label — Instrument Sans (as specified), uppercase, high contrast */}
                  <p className={[
                    "font-instrument text-sm uppercase tracking-widest font-semibold",
                    isActive ? "text-white-axis" : "text-soft-grey",
                  ].join(" ")}>
                    {benefit.label}
                  </p>

                  {/* Bullet points — only visible when this block is active.
                      AnimatePresence: lets the bullet list animate OUT before
                      unmounting (the height collapses smoothly instead of snapping).
                      height: "auto" / 0 transition creates the accordion effect.
                      overflow-hidden: hides content that extends beyond the
                      collapsing height during the exit animation. */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="mt-3 flex flex-col gap-1 overflow-hidden"
                      >
                        {benefit.bullets.map((bullet, bi) => (
                          // Each bullet fades in slightly after the previous one
                          // (delay: bi * 0.08 staggers them 80ms apart).
                          <motion.li
                            key={bi}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.4,
                              ease: "easeOut",
                              delay: bi * 0.08,
                            }}
                            className="font-instrument text-sm text-soft-grey"
                          >
                            {bullet}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>

                </motion.button>
              )
            })}
          </div>
          {/* END LEFT COLUMN */}

          {/* ── RIGHT COLUMN: DASHBOARD CARD (60% desktop) ──────────────────── */}
          {/* The card fades in when first scrolled into view (delay: 0.2s,
              slightly after the left column, so they feel like one reveal). */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full md:w-[60%] bg-black-axis border border-white-axis/10 p-6 md:p-8"
          >

            {/* ── CARD HEADER LABEL ──────────────────────────────────────── */}
            <p className="font-instrument text-xs uppercase tracking-widest text-soft-grey mb-8 opacity-50">
              Midnight Performance
            </p>

            {/* ── PRIMARY STAT ───────────────────────────────────────────── */}
            {/* AnimatePresence mode="wait": waits for the exit animation to
                complete before mounting the new content. Without mode="wait",
                the enter and exit would overlap (cross-fade), which is messier.
                key={`stat-${activeIndex}`}: React re-mounts this element whenever
                activeIndex changes, triggering the entrance animation fresh.
                This is the "Weightless Dissolve" — the variants object above
                defines the hidden, show, and exit animation states. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`stat-${activeIndex}`}
                variants={dissolve}
                initial="hidden"
                animate="show"
                exit="exit"
                className="text-center mb-6"
              >
                {/* Large central stat — Playfair Display at display size.
                    The stat string (e.g. "+24%") is rendered as-is, with a
                    superscript asterisk appended to indicate a footnoted source. */}
                <div className="font-playfair text-6xl md:text-7xl text-white-axis tracking-tight leading-none">
                  {active.stat}
                  {/* <sup>: HTML superscript — renders slightly raised and smaller.
                      The * signals the reader to check the Source note below. */}
                  <sup className="font-instrument text-sm text-soft-grey ml-1 align-super">
                    *
                  </sup>
                </div>
                {/* Stat label: describes what the number measures */}
                <p className="font-instrument text-xs uppercase tracking-widest text-soft-grey mt-3">
                  {active.statLabel}
                </p>
              </motion.div>
            </AnimatePresence>
            {/* END PRIMARY STAT */}

            {/* ── TRENDLINE GRAPH ────────────────────────────────────────── */}
            {/* SVG: scalable vector graphic — draws shapes with coordinates.
                viewBox="0 0 400 100": the internal coordinate system (400 wide, 100 tall).
                preserveAspectRatio="none": stretches to fill the container exactly.
                The actual display size is controlled by the parent div (h-20 = 80px). */}
            <div className="w-full h-20 mb-8">
              <svg
                viewBox="0 0 400 100"
                preserveAspectRatio="none"
                className="w-full h-full"
                aria-hidden="true"
              >
                {/* Subtle horizontal grid lines at 25%, 50%, 75% of chart height */}
                {[25, 50, 75].map(y => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="400"
                    y2={y}
                    stroke="var(--color-white-axis)"
                    strokeOpacity="0.05"
                    strokeWidth="1"
                  />
                ))}

                {/* The trend path.
                    key={activeIndex}: re-mounts this element whenever activeIndex
                    changes, so the draw animation (pathLength 0 → 1) replays.
                    d={buildPath(...)}: the SVG path string computed from trendData.
                    stroke="var(--color-blue-axis)": uses the CSS variable defined
                    in globals.css — avoids hardcoding the hex value.
                    pathLength: SVG attribute that Framer Motion animates from 0
                    (invisible) to 1 (fully drawn), creating the "drawing" effect.
                    isInView gates the animation — the line only draws after the
                    section has entered the viewport. */}
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
                    opacity: isInView ? 1 : 0,
                  }}
                  transition={{
                    pathLength: { duration: 0.8, ease: "easeOut" },
                    opacity:    { duration: 0.3, ease: "easeOut" },
                  }}
                />

                {/* End-point dot: a small circle at the last data point.
                    Gives the trendline a visual terminus — reads as "where you are now".
                    getLastPoint() computes the x/y coordinates directly from the data
                    (same math as buildPath) — avoids fragile string parsing. */}
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
                      animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
                    />
                  )
                })()}

              </svg>
            </div>
            {/* END TRENDLINE GRAPH */}

            {/* ── SIDEBAR METRICS ──────────────────────────────────────────── */}
            {/* Two metric cards laid out in a 2-column grid.
                AnimatePresence + Weightless Dissolve: both cards swap together
                when activeIndex changes, keeping them in sync with the main stat. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`sidebar-${activeIndex}`}
                variants={dissolve}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-2 gap-4 mb-8"
              >
                {active.sidebarMetrics.map((metric, mi) => (
                  // Each metric card: thin border, generous inner padding.
                  <div
                    key={mi}
                    className="border border-white-axis/10 p-4"
                  >
                    {/* Metric value with ** superscript.
                        "0" here means "zero manual steps" — fully automated.
                        ** signals the secondary disclaimer at the bottom of the card. */}
                    <div className="font-playfair text-2xl text-white-axis leading-none">
                      {metric.value}
                      <sup className="font-instrument text-xs text-soft-grey ml-0.5 align-super">
                        **
                      </sup>
                    </div>
                    {/* Metric label — small, muted, wrapped for multi-word labels */}
                    <p className="font-instrument text-xs text-soft-grey mt-2 leading-snug">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
            {/* END SIDEBAR METRICS */}

            {/* ── SOURCE DISCLAIMER ─────────────────────────────────────────── */}
            {/* Bottom-right corner of the card.
                10px Instrument Sans, soft grey, right-aligned (per spec).
                Two notes shown: one for * (primary stat source) and one for **
                (secondary metrics source — same text for all 4 benefit blocks).
                AnimatePresence + Weightless Dissolve: the disclaimer text fades
                out and back in whenever the active benefit changes, matching the
                stat transition timing for a coherent feel. */}
            <div className="flex justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`disclaimer-${activeIndex}`}
                  variants={dissolve}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="max-w-[300px] text-right"
                >
                  {/* Primary stat source (*) */}
                  <p className="font-instrument text-[10px] text-soft-grey leading-relaxed opacity-60">
                    <span className="text-white-axis opacity-70">Source * — </span>
                    {active.primaryDisclaimer}
                  </p>
                  {/* Secondary stats source (**) — spacer between the two notes */}
                  <p className="font-instrument text-[10px] text-soft-grey leading-relaxed opacity-60 mt-3">
                    <span className="text-white-axis opacity-70">Source ** — </span>
                    {active.secondaryDisclaimer}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* END SOURCE DISCLAIMER */}

          </motion.div>
          {/* END RIGHT COLUMN */}

        </div>
        {/* END TWO-COLUMN LAYOUT */}

      </div>
    </section>
  )
}
