"use client"
// RevenueDashboard — shows top-level revenue metrics, a bar chart, and a breakdown list.
// Time filter toggles between 7 / 30 / 90 day views.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript types
type Period = "7d" | "30d" | "90d"

interface PeriodData {
  revenue: string
  members: number
  fillRate: number
  // bars — 7 values for the chart (one per day/week/month)
  bars: number[]
  breakdown: { label: string; amount: string; pct: number }[]
}

// Mock data for each time period
const DATA: Record<Period, PeriodData> = {
  "7d": {
    revenue: "$3,240",
    members: 48,
    fillRate: 82,
    bars: [60, 80, 45, 90, 70, 55, 75],
    breakdown: [
      { label: "Monthly memberships", amount: "$2,160", pct: 67 },
      { label: "Class packs", amount: "$720", pct: 22 },
      { label: "Drop-ins", amount: "$240", pct: 7 },
      { label: "Merchandise", amount: "$120", pct: 4 },
    ],
  },
  "30d": {
    revenue: "$14,800",
    members: 52,
    fillRate: 78,
    bars: [70, 85, 60, 90, 75, 88, 65],
    breakdown: [
      { label: "Monthly memberships", amount: "$9,840", pct: 66 },
      { label: "Class packs", amount: "$3,200", pct: 22 },
      { label: "Drop-ins", amount: "$960", pct: 6 },
      { label: "Merchandise", amount: "$800", pct: 6 },
    ],
  },
  "90d": {
    revenue: "$43,200",
    members: 55,
    fillRate: 80,
    bars: [72, 80, 68, 88, 76, 84, 79],
    breakdown: [
      { label: "Monthly memberships", amount: "$28,800", pct: 67 },
      { label: "Class packs", amount: "$9,400", pct: 22 },
      { label: "Drop-ins", amount: "$3,000", pct: 7 },
      { label: "Merchandise", amount: "$2,000", pct: 4 },
    ],
  },
}

// Metric card — one of the three top-level KPI cards
function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
      <p className="text-zinc-500 text-xs font-instrument uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-xl font-semibold font-instrument">{value}</p>
      {sub && <p className="text-zinc-600 text-xs font-instrument mt-0.5">{sub}</p>}
    </div>
  )
}

export default function RevenueDashboard() {
  // activePeriod — which time filter is selected
  const [activePeriod, setActivePeriod] = useState<Period>("30d")
  const d = DATA[activePeriod]

  const PERIODS: { key: Period; label: string }[] = [
    { key: "7d", label: "7 days" },
    { key: "30d", label: "30 days" },
    { key: "90d", label: "90 days" },
  ]

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-900 flex flex-col md:h-96 md:overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 shrink-0">
        <p className="text-zinc-500 text-xs font-instrument uppercase tracking-wider">Revenue</p>
        {/* Period filter pills */}
        <div className="flex gap-1 bg-zinc-900 rounded-lg p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePeriod(p.key)}
              className={`px-2.5 py-1 rounded text-xs font-instrument transition-colors
                ${activePeriod === p.key ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="md:flex-1 overflow-y-auto p-3 space-y-3">
        {/* ── TOP METRIC CARDS ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePeriod}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-3 gap-2"
          >
            <MetricCard label="Revenue" value={d.revenue} sub={`Last ${activePeriod}`} />
            <MetricCard label="Members" value={`${d.members}`} sub="Active" />
            <MetricCard label="Fill Rate" value={`${d.fillRate}%`} sub="Avg per class" />
          </motion.div>
        </AnimatePresence>

        {/* ── BAR CHART ── Simple SVG bars */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <p className="text-zinc-500 text-xs font-instrument uppercase tracking-wider mb-3">Revenue trend</p>
          <div className="flex items-end gap-1 h-16">
            {d.bars.map((val, i) => (
              <motion.div
                key={`${activePeriod}-${i}`}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.04 }}
                className="flex-1 bg-white/20 rounded-t-sm min-h-1"
              />
            ))}
          </div>
          {/* X-axis labels */}
          <div className="flex gap-1 mt-1">
            {(activePeriod === "7d"
              ? ["M", "T", "W", "T", "F", "S", "S"]
              : activePeriod === "30d"
              ? ["W1", "W2", "W3", "W4", "W5", "W6", "W7"]
              : ["M1", "M2", "M3", "M4", "M5", "M6", "M7"]
            ).map((label, i) => (
              <span key={i} className="flex-1 text-center text-zinc-700 text-xs font-instrument">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── REVENUE BREAKDOWN ── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <p className="text-zinc-500 text-xs font-instrument uppercase tracking-wider mb-2">Breakdown</p>
          <div className="space-y-2">
            {d.breakdown.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-zinc-400 text-xs font-instrument">{item.label}</span>
                  <span className="text-white text-xs font-semibold font-instrument">{item.amount}</span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-white/40 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
