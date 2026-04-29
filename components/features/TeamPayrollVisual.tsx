"use client"
// TeamPayrollVisual — coded UI mockup for the team-payroll feature page.
//
// Light-mode SaaS UI: white background, dark text, Instrument Sans throughout.
// Shows:
//   - Payroll table with instructor names, roles, class count, rate, and total
//   - Status badge (confirmed / sub needed)
//   - Payout summary tiles

import { motion } from "framer-motion"

// TypeScript interface for a staff row
interface StaffMember {
  name:    string
  role:    string
  classes: number
  rate:    string
  total:   string
  status:  "confirmed" | "sub needed"
}

// Staff roster data — placeholder instructor names and compensation
const STAFF: StaffMember[] = [
  { name: "Elena V.", role: "Head Coach", classes: 18, rate: "$45/class", total: "$810",  status: "confirmed"  },
  { name: "Marco R.", role: "Pilates",    classes: 12, rate: "$40/class", total: "$480",  status: "confirmed"  },
  { name: "Yuki S.",  role: "Yoga",       classes: 14, rate: "$38/class", total: "$532",  status: "sub needed" },
  { name: "Dana O.",  role: "Boxing",     classes: 10, rate: "$45/class", total: "$450",  status: "confirmed"  },
  { name: "Paul T.",  role: "HIIT",       classes: 16, rate: "$40/class", total: "$640",  status: "confirmed"  },
]

// Totals summary below the table
const TOTALS = [
  { label: "Total Payout",     value: "$2,912" },
  { label: "Classes Covered",  value: "70"     },
  { label: "Substitutions",    value: "3"      },
]

// Table column headers
const COLUMNS = ["Instructor", "Role", "Classes", "Rate", "Total"]

export default function TeamPayrollVisual() {
  return (
    // White background, flat — no shadow, no border-radius
    <div className="bg-white border border-gray-100 p-4 md:p-6 w-full">

      {/* ── Payroll period header ── */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-instrument text-gray-900 text-[9px] uppercase tracking-widest font-semibold">
          Payroll — April 2026
        </p>
        {/* "Processed automatically" badge in blue — reinforces the automation value prop */}
        <p className="font-instrument text-blue-axis text-[9px] uppercase tracking-widest">
          Processed automatically
        </p>
      </div>

      {/* ── Payroll table ── */}
      <div className="bg-gray-50 px-4 pb-2">

        {/* Column headers */}
        <div className="grid grid-cols-5 gap-2 py-3 border-b border-gray-200">
          {COLUMNS.map((col) => (
            <p key={col} className="font-instrument text-gray-400 text-[8px] uppercase tracking-widest">
              {col}
            </p>
          ))}
        </div>

        {/* Staff rows — each fades in with a small stagger */}
        {STAFF.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.07 }}
            viewport={{ once: true }}
            className="grid grid-cols-5 gap-2 py-3 border-b border-gray-100 items-center"
          >
            {/* Instructor name + status badge */}
            <div>
              <p className="font-instrument text-gray-900 text-xs font-medium">{s.name}</p>
              {/* "confirmed" in blue, "sub needed" in soft grey */}
              <span className={`font-instrument text-[8px] uppercase tracking-widest ${
                s.status === "confirmed" ? "text-blue-axis" : "text-gray-400"
              }`}>
                {s.status}
              </span>
            </div>

            {/* Role */}
            <p className="font-instrument text-gray-500 text-[9px]">{s.role}</p>

            {/* Class count */}
            <p className="font-instrument text-gray-900 text-xs font-medium">{s.classes}</p>

            {/* Rate */}
            <p className="font-instrument text-gray-500 text-[9px]">{s.rate}</p>

            {/* Total — instrument semibold number */}
            <p className="font-instrument text-gray-900 text-sm font-semibold">{s.total}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Payout totals ── */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {TOTALS.map((t) => (
          <div key={t.label} className="bg-gray-50 border border-gray-100 p-3">
            <p className="font-instrument text-gray-400 text-[8px] uppercase tracking-widest">{t.label}</p>
            <p className="font-instrument text-gray-900 text-xl font-semibold mt-1">{t.value}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
