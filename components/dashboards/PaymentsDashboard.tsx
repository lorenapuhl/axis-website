"use client"
// PaymentsDashboard — full payment transaction log with status badges.
// Clicking a row opens a detail panel. Refund button available in the panel.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript interface for a payment record
interface Payment {
  id: string
  user: string
  amount: string
  type: string
  status: "paid" | "refunded" | "failed" | "pending"
  date: string
  method: string
}

const PAYMENTS: Payment[] = [
  { id: "1", user: "Marcus Rivera", amount: "$120.00", type: "Monthly", status: "paid", date: "Apr 1, 2025", method: "Visa ···4242" },
  { id: "2", user: "Sofia Chen", amount: "$90.00", type: "10-Class Pack", status: "paid", date: "Apr 3, 2025", method: "Mastercard ···8811" },
  { id: "3", user: "Luca Ferretti", amount: "$120.00", type: "Monthly", status: "paid", date: "Apr 1, 2025", method: "Visa ···3311" },
  { id: "4", user: "Amara Diallo", amount: "$20.00", type: "Drop-in", status: "refunded", date: "Mar 28, 2025", method: "Visa ···9901" },
  { id: "5", user: "Dante Moreau", amount: "$120.00", type: "Monthly", status: "paid", date: "Apr 1, 2025", method: "Amex ···4400" },
  { id: "6", user: "Yara Okonkwo", amount: "$120.00", type: "Monthly", status: "failed", date: "Apr 1, 2025", method: "Visa ···7720" },
  { id: "7", user: "Carlos Webb", amount: "$90.00", type: "10-Class Pack", status: "paid", date: "Mar 25, 2025", method: "Mastercard ···5531" },
  { id: "8", user: "Nadia Sousa", amount: "$20.00", type: "Drop-in", status: "pending", date: "Apr 16, 2025", method: "Apple Pay" },
]

// Status badge styles
const STATUS_STYLES: Record<Payment["status"], string> = {
  paid: "bg-green-500/10 text-green-400 border border-green-500/20",
  refunded: "bg-zinc-700/40 text-zinc-400 border border-zinc-700",
  failed: "bg-red-500/10 text-red-400 border border-red-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
}

// PaymentDetailPanel — slides in on desktop when a row is clicked
function PaymentDetailPanel({ payment, onClose }: { payment: Payment; onClose: () => void }) {
  const [refunded, setRefunded] = useState(payment.status === "refunded")

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute right-0 top-0 bottom-0 w-64 bg-zinc-900 border-l border-zinc-800 flex flex-col z-10"
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
        <p className="text-white text-xs font-semibold font-instrument">Payment Detail</p>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">×</button>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Amount — large display */}
        <div className="text-center py-3 border-b border-zinc-800">
          <p className="text-white text-2xl font-semibold font-instrument">{payment.amount}</p>
          <p className={`text-xs font-instrument mt-1 inline-block px-2 py-0.5 rounded-full ${STATUS_STYLES[refunded ? "refunded" : payment.status]}`}>
            {refunded ? "refunded" : payment.status}
          </p>
        </div>

        {/* Detail fields */}
        {[
          { label: "Member", value: payment.user },
          { label: "Type", value: payment.type },
          { label: "Method", value: payment.method },
          { label: "Date", value: payment.date },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-zinc-600 text-xs font-instrument">{label}</span>
            <span className="text-zinc-300 text-xs font-instrument">{value}</span>
          </div>
        ))}
      </div>

      {/* Refund button — only show if payment was successful */}
      {!refunded && payment.status === "paid" && (
        <div className="p-4 border-t border-zinc-800 shrink-0">
          <button
            onClick={() => setRefunded(true)}
            className="w-full py-2 rounded-lg border border-red-500/20 text-red-400 text-xs font-instrument hover:bg-red-500/10 transition-colors"
          >
            Issue Refund
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default function PaymentsDashboard() {
  // activePayment — which row is selected (null = panel closed)
  const [activePayment, setActivePayment] = useState<Payment | null>(null)

  return (
    <div className="relative bg-zinc-950 rounded-2xl border border-zinc-900 flex flex-col md:h-96 md:overflow-hidden">

      {/* ── TABLE HEADER ── */}
      <div className="grid grid-cols-5 px-3 py-2 border-b border-zinc-900 shrink-0 sticky top-0 bg-zinc-950 z-10">
        {["User", "Amount", "Type", "Status", "Date"].map((col) => (
          <span key={col} className="text-zinc-600 text-xs font-instrument uppercase tracking-wider">
            {col}
          </span>
        ))}
      </div>

      {/* ── PAYMENT ROWS ── */}
      <div className="md:flex-1 overflow-y-auto">
        {PAYMENTS.map((payment) => (
          <button
            key={payment.id}
            onClick={() => setActivePayment(payment)}
            className={`w-full grid grid-cols-5 px-3 items-center h-12 border-b border-zinc-900/50 hover:bg-zinc-900/50 transition-colors text-left
              ${activePayment?.id === payment.id ? "bg-zinc-900/60" : ""}
            `}
          >
            <span className="text-white text-xs font-instrument font-medium truncate pr-2">{payment.user}</span>
            <span className="text-zinc-300 text-xs font-instrument font-semibold">{payment.amount}</span>
            <span className="text-zinc-500 text-xs font-instrument truncate pr-2">{payment.type}</span>
            {/* Status badge */}
            <span className={`text-xs font-instrument px-1.5 py-0.5 rounded-full inline-block w-fit capitalize ${STATUS_STYLES[payment.status]}`}>
              {payment.status}
            </span>
            <span className="text-zinc-600 text-xs font-instrument truncate">{payment.date.split(",")[0]}</span>
          </button>
        ))}
      </div>

      {/* ── DESKTOP SIDE PANEL ── */}
      <div className="hidden md:block">
        <AnimatePresence>
          {activePayment && (
            <PaymentDetailPanel
              key={activePayment.id}
              payment={activePayment}
              onClose={() => setActivePayment(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE FULL-SCREEN DETAIL ── */}
      <AnimatePresence>
        {activePayment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="md:hidden absolute inset-0 z-20 bg-zinc-950 overflow-y-auto"
          >
            <div className="flex items-center gap-3 p-4 border-b border-zinc-900">
              <button onClick={() => setActivePayment(null)} className="text-zinc-400 hover:text-white text-sm font-instrument transition-colors">← Back</button>
              <span className="text-white text-xs font-semibold font-instrument">Payment Detail</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-center py-3">
                <p className="text-white text-2xl font-semibold font-instrument">{activePayment.amount}</p>
                <p className={`text-xs font-instrument mt-1 inline-block px-2 py-0.5 rounded-full ${STATUS_STYLES[activePayment.status]}`}>
                  {activePayment.status}
                </p>
              </div>
              {[
                { label: "Member", value: activePayment.user },
                { label: "Type", value: activePayment.type },
                { label: "Method", value: activePayment.method },
                { label: "Date", value: activePayment.date },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-600 text-xs font-instrument">{label}</span>
                  <span className="text-zinc-300 text-xs font-instrument">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
