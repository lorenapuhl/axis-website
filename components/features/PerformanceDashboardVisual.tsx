"use client"
// PerformanceDashboardVisual — coded UI mockup for the performance-dashboard feature page.
//
// Contains:
//   1. Four metric stat cards
//   2. SVG revenue line chart (current vs previous period)
//   3. Trial conversion donut chart (SVG)
//   4. Membership distribution bar

import { motion } from "framer-motion"

// Revenue data — 12 months of current period vs comparison period
const CURRENT_DATA = [42, 58, 51, 67, 74, 68, 82, 88, 79, 91, 87, 98]
const PREV_DATA    = [30, 41, 36, 50, 55, 48, 60, 65, 59, 70, 66, 75]

// SVG canvas dimensions — unitless, scaled by viewBox to fill the container
const W = 480, H = 100, PAD = 10, MAX = 110

// cx: converts a data index (0–11) to an X pixel coordinate on the SVG canvas
function cx(i: number): number {
  return PAD + (i / (CURRENT_DATA.length - 1)) * (W - PAD * 2)
}

// cy: converts a data value to a Y pixel coordinate.
// SVG Y=0 is the TOP of the canvas, so we invert the value so higher = higher on screen.
function cy(v: number): number {
  return H - PAD - (v / MAX) * (H - PAD * 2)
}

// linePath: builds an SVG "M x y L x y L x y ..." path string from a data array
function linePath(data: number[]): string {
  return data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`)
    .join(' ')
}

// areaPath: a closed path that traces the line and drops to the bottom of the chart.
// Used to create the translucent fill area below the line.
function areaPath(data: number[]): string {
  const last = data.length - 1
  return `${linePath(data)} L ${cx(last).toFixed(1)} ${(H - PAD).toFixed(1)} L ${cx(0).toFixed(1)} ${(H - PAD).toFixed(1)} Z`
}

// Top metric cards data
const METRICS = [
  { label: "Monthly Revenue", value: "$24.8K", change: "+18%", positive: true  },
  { label: "Active Members",  value: "342",    change: "+12%", positive: true  },
  { label: "Retention Rate",  value: "87%",    change: "+4%",  positive: true  },
  { label: "Bookings / Week", value: "1,204",  change: "−3%",  positive: false },
]

// Donut chart — trial conversion breakdown
// R = 36 → C (circumference) = 2π × 36 ≈ 226.19
// Each segment is a full circle (r=36) with stroke-dasharray to mask all but its arc,
// and stroke-dashoffset to rotate it into the correct starting position.
// We start at 12 o'clock by offsetting by 25% of the circumference (SVG starts at 3 o'clock).
const DONUT_R = 36
const DONUT_C = 2 * Math.PI * DONUT_R

// Cumulative pct offsets: segment starts after all previous segments end
// dashArray = "[this segment length] [rest of circle]"
// dashOffset = (25% start - accumulated pct) × C  → rotates arc to correct position
const DONUT_SEGMENTS = [
  { label: "To Pass",  pct: 38, opacity: 1,    textClass: "text-blue-axis",  dotClass: "bg-blue-axis",
    dashArray: `${(0.38 * DONUT_C).toFixed(1)} ${(0.62 * DONUT_C).toFixed(1)}`,
    dashOffset: DONUT_C * 0.25 },
  { label: "To Sub",   pct: 29, opacity: 1,    textClass: "text-soft-grey",  dotClass: "bg-soft-grey",
    dashArray: `${(0.29 * DONUT_C).toFixed(1)} ${(0.71 * DONUT_C).toFixed(1)}`,
    dashOffset: DONUT_C * (0.25 - 0.38) },
  { label: "Expired",  pct: 21, opacity: 0.35, textClass: "text-white-axis", dotClass: "bg-white-axis/30",
    dashArray: `${(0.21 * DONUT_C).toFixed(1)} ${(0.79 * DONUT_C).toFixed(1)}`,
    dashOffset: DONUT_C * (0.25 - 0.67) },
  { label: "Active",   pct: 12, opacity: 0.15, textClass: "text-white-axis", dotClass: "bg-white-axis/10",
    dashArray: `${(0.12 * DONUT_C).toFixed(1)} ${(0.88 * DONUT_C).toFixed(1)}`,
    dashOffset: DONUT_C * (0.25 - 0.88) },
]

// Membership distribution — stacked horizontal bar
// widthClass uses Tailwind arbitrary values ([x%]) instead of inline styles
const DISTRIBUTION = [
  { label: "Annual",   pct: "50%", barClass: "bg-blue-axis w-1/2",     textClass: "text-blue-axis" },
  { label: "Monthly",  pct: "25%", barClass: "bg-soft-grey w-1/4",     textClass: "text-soft-grey" },
  { label: "10-class", pct: "15%", barClass: "bg-white-axis/20 w-[15%]", textClass: "text-soft-grey" },
  { label: "Drop-in",  pct: "10%", barClass: "bg-white-axis/10 w-[10%]", textClass: "text-soft-grey" },
]

export default function PerformanceDashboardVisual() {
  return (
    // overflow-hidden prevents chart edges from clipping outside the container
    <div className="bg-grey-axis p-4 md:p-6 w-full overflow-hidden">

      {/* ── Dashboard header bar ── */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-instrument uppercase tracking-widest text-white-axis text-[10px]">
          Performance Overview
        </p>
        <p className="font-instrument text-soft-grey text-[10px]">Last 12 months</p>
      </div>

      {/* ── Metric cards ── 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
            viewport={{ once: true }}
            className="bg-black-axis p-3"
          >
            <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest leading-tight">
              {m.label}
            </p>
            {/* font-playfair gives the number an editorial weight */}
            <p className="font-playfair text-white-axis text-xl mt-2">{m.value}</p>
            {/* text-blue-axis for positive change, text-soft-grey for negative */}
            <p className={`font-instrument text-[9px] mt-1 uppercase tracking-widest ${m.positive ? "text-blue-axis" : "text-soft-grey"}`}>
              {m.change} vs prev
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Revenue line chart ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="bg-black-axis p-4 mb-4"
      >
        {/* Chart legend */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest">Revenue Trend</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="block w-4 h-px bg-blue-axis" />
              <span className="font-instrument text-soft-grey text-[9px]">Current</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="block w-4 h-px bg-soft-grey opacity-40" />
              <span className="font-instrument text-soft-grey text-[9px]">Previous</span>
            </span>
          </div>
        </div>

        {/* SVG line chart.
            stroke="currentColor" means the element inherits the CSS `color` property.
            Tailwind's text-* classes set that color — so we get brand colors with no hex values.
            viewBox="0 0 480 100" sets the coordinate system; the element scales to fill its container. */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          aria-label="Revenue trend line chart comparing current and previous period over 12 months"
        >
          {/* Subtle horizontal grid lines at 25%, 50%, 75% of the value range */}
          {[25, 50, 75].map((pct) => (
            <line
              key={pct}
              x1={PAD}
              y1={cy((pct / 100) * MAX).toFixed(1)}
              x2={W - PAD}
              y2={cy((pct / 100) * MAX).toFixed(1)}
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-white-axis opacity-5"
            />
          ))}

          {/* Translucent fill area below the current period line */}
          <path
            d={areaPath(CURRENT_DATA)}
            fill="currentColor"
            fillOpacity={0.06}
            stroke="none"
            className="text-blue-axis"
          />

          {/* Previous period line — muted grey, 40% opacity */}
          <path
            d={linePath(PREV_DATA)}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-soft-grey"
            opacity={0.4}
          />

          {/* Current period line — electric blue, full opacity */}
          <path
            d={linePath(CURRENT_DATA)}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-axis"
          />

          {/* Dot marking the latest data point */}
          <circle
            cx={cx(CURRENT_DATA.length - 1).toFixed(1)}
            cy={cy(CURRENT_DATA[CURRENT_DATA.length - 1]).toFixed(1)}
            r={3}
            fill="currentColor"
            className="text-blue-axis"
          />
        </svg>
      </motion.div>

      {/* ── Bottom row: donut + distribution ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Trial conversion donut chart */}
        <div className="bg-black-axis p-4">
          <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest mb-4">
            Trial Conversion
          </p>
          <div className="flex items-center gap-5">
            {/* SVG donut: each circle element draws one arc segment using stroke-dasharray + dashoffset */}
            <svg
              viewBox="0 0 100 100"
              className="w-20 h-20 shrink-0"
              aria-label="Donut chart showing trial conversion breakdown"
            >
              {/* Background ring — very faint */}
              <circle cx="50" cy="50" r={DONUT_R} fill="none" stroke="currentColor" strokeWidth={10} className="text-white-axis opacity-5" />
              {/* Segment arcs */}
              {DONUT_SEGMENTS.map((seg) => (
                <circle
                  key={seg.label}
                  cx="50"
                  cy="50"
                  r={DONUT_R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={10}
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  strokeLinecap="butt"
                  className={seg.textClass}
                  opacity={seg.opacity}
                />
              ))}
            </svg>

            {/* Donut legend */}
            <div className="flex flex-col gap-2">
              {DONUT_SEGMENTS.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                  {/* Coloured dot — dotClass maps each segment to a bg- brand token */}
                  <span className={`w-2 h-2 shrink-0 rounded-full ${seg.dotClass}`} />
                  <span className="font-instrument text-soft-grey text-[9px] uppercase tracking-wide">
                    {seg.label}
                  </span>
                  <span className="font-instrument text-white-axis text-[9px] ml-auto">
                    {seg.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Membership distribution stacked bar */}
        <div className="bg-black-axis p-4">
          <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest mb-4">
            Membership Mix
          </p>
          {/* Stacked horizontal bar — widths set via Tailwind classes, no inline styles */}
          <div className="flex h-2 mb-4">
            {DISTRIBUTION.map((d) => (
              <div key={d.label} className={`h-full ${d.barClass}`} />
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-2">
            {DISTRIBUTION.map((d) => (
              <div key={d.label} className="flex items-center justify-between">
                <span className={`font-instrument text-[9px] uppercase tracking-wide ${d.textClass}`}>
                  {d.label}
                </span>
                <span className="font-instrument text-white-axis text-[9px]">{d.pct}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
