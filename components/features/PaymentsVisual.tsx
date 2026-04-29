"use client"
// PaymentsVisual — coded UI mockup for the payments feature page.
//
// Light-mode SaaS UI: white background, dark text, Instrument Sans throughout.
// Shows:
//   - Accepted payment methods bar
//   - Transaction list with status badges
//   - Summary stat tiles (monthly revenue, recovered, avg transaction)

import { motion } from "framer-motion"

// TypeScript interface for a transaction row
interface Transaction {
  name:   string
  plan:   string
  amount: string
  status: "paid" | "retry"
  date:   string
}

// Recent transaction data — placeholder names and amounts
const TRANSACTIONS: Transaction[] = [
  { name: "Sofia M.",  plan: "Annual Membership", amount: "$899", status: "paid",  date: "Apr 28" },
  { name: "Carlos R.", plan: "10-Class Pack",      amount: "$149", status: "paid",  date: "Apr 27" },
  { name: "Aria T.",   plan: "Monthly Sub",        amount: "$79",  status: "paid",  date: "Apr 27" },
  { name: "James K.",  plan: "Annual Membership",  amount: "$899", status: "retry", date: "Apr 26" },
  { name: "Luna B.",   plan: "Drop-in",            amount: "$22",  status: "paid",  date: "Apr 25" },
  { name: "Marco V.",  plan: "10-Class Pack",      amount: "$149", status: "paid",  date: "Apr 24" },
]

// Accepted payment methods — shown as text chips in the header
const METHODS = ["Apple Pay", "Google Pay", "PayPal", "Visa", "Amex"]

// Summary tiles below the transaction list
const SUMMARY = [
  { label: "This Month",        value: "$12,840" },
  { label: "Failed Recovered",  value: "$2,190"  },
  { label: "Avg Transaction",   value: "$183"    },
]

export default function PaymentsVisual() {
  return (
    // White background, flat — no shadow, no border-radius
    <div className="bg-white border border-gray-100 p-4 md:p-6 w-full">

      {/* ── Header: label + payment method chips ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="font-instrument text-gray-900 text-[9px] uppercase tracking-widest font-semibold">
          Recent Transactions
        </p>
        {/* Payment method chips — text labels styled as small bordered tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {METHODS.map((m) => (
            <span
              key={m}
              className="font-instrument text-gray-500 text-[8px] border border-gray-200 px-1.5 py-0.5 uppercase tracking-wide"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* ── Transaction list ── */}
      <div className="flex flex-col bg-gray-50 px-4">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 py-2 border-b border-gray-200">
          <p className="font-instrument text-gray-400 text-[8px] uppercase tracking-widest">Member</p>
          <p className="font-instrument text-gray-400 text-[8px] uppercase tracking-widest">Date</p>
          <p className="font-instrument text-gray-400 text-[8px] uppercase tracking-widest">Status</p>
          <p className="font-instrument text-gray-400 text-[8px] uppercase tracking-widest">Amount</p>
        </div>

        {/* Transaction rows */}
        {TRANSACTIONS.map((tx, i) => (
          <motion.div
            key={`${tx.name}-${tx.date}`}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.06 }}
            viewport={{ once: true }}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 py-3 border-b border-gray-100 items-center"
          >
            {/* Member name + plan */}
            <div>
              <p className="font-instrument text-gray-900 text-xs font-medium">{tx.name}</p>
              <p className="font-instrument text-gray-400 text-[9px]">{tx.plan}</p>
            </div>

            {/* Date */}
            <p className="font-instrument text-gray-400 text-[9px]">{tx.date}</p>

            {/* Status badge — "paid" in blue, "retry" in muted grey */}
            <span className={`font-instrument text-[8px] uppercase tracking-widest px-2 py-0.5 border ${
              tx.status === "paid"
                ? "border-blue-axis text-blue-axis"
                : "border-gray-300 text-gray-400"
            }`}>
              {tx.status}
            </span>

            {/* Amount — semibold instrument number */}
            <p className="font-instrument text-gray-900 text-sm font-semibold text-right">{tx.amount}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Summary tiles ── */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="bg-gray-50 border border-gray-100 p-3">
            <p className="font-instrument text-gray-400 text-[8px] uppercase tracking-widest">{s.label}</p>
            <p className="font-instrument text-gray-900 text-lg font-semibold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
