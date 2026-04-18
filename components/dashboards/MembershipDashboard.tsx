"use client"
// MembershipDashboard — displays membership plan cards with price, member count, and status.
// Clicking a card opens an edit panel. "+ New Plan" button opens a creation modal.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript interface for a membership plan
interface Plan {
  id: string
  name: string
  price: string
  billing: string
  members: number
  status: "active" | "archived"
  description: string
  maxClasses: string
}

const PLANS: Plan[] = [
  {
    id: "1",
    name: "Unlimited",
    price: "$120",
    billing: "/ month",
    members: 28,
    status: "active",
    description: "Unlimited access to all group classes",
    maxClasses: "Unlimited",
  },
  {
    id: "2",
    name: "10-Class Pack",
    price: "$90",
    billing: "one-time",
    members: 14,
    status: "active",
    description: "10 classes to use within 60 days",
    maxClasses: "10",
  },
  {
    id: "3",
    name: "Drop-in",
    price: "$20",
    billing: "per class",
    members: 6,
    status: "active",
    description: "Pay-as-you-go, no commitment required",
    maxClasses: "1",
  },
  {
    id: "4",
    name: "Student",
    price: "$80",
    billing: "/ month",
    members: 0,
    status: "archived",
    description: "Discounted unlimited for full-time students",
    maxClasses: "Unlimited",
  },
]

// EditPanel — right-side panel shown when a plan card is selected
function EditPanel({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute right-0 top-0 bottom-0 w-64 bg-zinc-900 border-l border-zinc-800 flex flex-col z-10"
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
        <p className="text-white text-xs font-semibold font-instrument">Edit Plan</p>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div>
          <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Name</label>
          <input defaultValue={plan.name} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none" />
        </div>
        <div>
          <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Price</label>
          <input defaultValue={plan.price} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none" />
        </div>
        <div>
          <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Billing</label>
          <select defaultValue={plan.billing} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none">
            <option>/ month</option>
            <option>one-time</option>
            <option>per class</option>
          </select>
        </div>
        <div>
          <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Description</label>
          <textarea defaultValue={plan.description} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none resize-none" />
        </div>
        <div>
          <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Status</label>
          <select defaultValue={plan.status} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none">
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800 shrink-0">
        <button onClick={onClose} className="w-full py-2 rounded-lg bg-white text-black text-xs font-instrument font-semibold hover:bg-zinc-100 transition-colors">
          Save Changes
        </button>
      </div>
    </motion.div>
  )
}

// NewPlanModal — full-screen modal for creating a new membership plan
function NewPlanModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm mx-4"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white text-sm font-semibold font-instrument">New Plan</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">×</button>
        </div>
        <div className="space-y-3">
          {["Plan name", "Price", "Description"].map((label) => (
            <div key={label}>
              <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">{label}</label>
              {label === "Description"
                ? <textarea rows={2} placeholder={label} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument placeholder:text-zinc-600 focus:outline-none resize-none" />
                : <input placeholder={label} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument placeholder:text-zinc-600 focus:outline-none" />
              }
            </div>
          ))}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Billing</label>
            <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none">
              <option>/ month</option>
              <option>one-time</option>
              <option>per class</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-zinc-800 text-zinc-400 text-xs font-instrument hover:border-zinc-700 transition-colors">Cancel</button>
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-instrument font-semibold hover:bg-zinc-100 transition-colors">Create Plan</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function MembershipDashboard() {
  // activePlan — the plan card currently selected (null = edit panel closed)
  const [activePlan, setActivePlan] = useState<Plan | null>(null)
  const [showNewPlan, setShowNewPlan] = useState(false)

  return (
    <div className="relative bg-zinc-950 rounded-2xl border border-zinc-900 h-96 flex flex-col overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 shrink-0">
        <p className="text-zinc-500 text-xs font-instrument uppercase tracking-wider">Membership Plans</p>
        <button
          onClick={() => setShowNewPlan(true)}
          className="bg-white text-black text-xs font-instrument font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          + New Plan
        </button>
      </div>

      {/* ── PLAN CARDS ── */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 content-start">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setActivePlan(plan)}
            className={`text-left bg-zinc-900 border rounded-xl p-3 hover:border-zinc-600 transition-colors
              ${activePlan?.id === plan.id ? "border-white/20" : "border-zinc-800"}
              ${plan.status === "archived" ? "opacity-50" : ""}
            `}
          >
            {/* Plan name + status */}
            <div className="flex items-start justify-between gap-1 mb-2">
              <p className="text-white text-xs font-semibold font-instrument leading-snug">{plan.name}</p>
              {plan.status === "archived" && (
                <span className="text-zinc-600 text-xs font-instrument shrink-0">archived</span>
              )}
            </div>

            {/* Price */}
            <p className="text-white text-base font-semibold font-instrument leading-none">
              {plan.price}
              <span className="text-zinc-500 text-xs font-normal ml-1">{plan.billing}</span>
            </p>

            {/* Member count */}
            <p className="text-zinc-600 text-xs font-instrument mt-2">
              {plan.members} member{plan.members !== 1 ? "s" : ""}
            </p>
          </button>
        ))}
      </div>

      {/* ── DESKTOP EDIT PANEL ── */}
      <div className="hidden md:block">
        <AnimatePresence>
          {activePlan && <EditPanel plan={activePlan} onClose={() => setActivePlan(null)} />}
        </AnimatePresence>
      </div>

      {/* ── MOBILE EDIT MODAL ── */}
      <AnimatePresence>
        {activePlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="md:hidden absolute inset-0 z-20 bg-zinc-950 overflow-y-auto"
          >
            <div className="flex items-center gap-3 p-4 border-b border-zinc-900">
              <button onClick={() => setActivePlan(null)} className="text-zinc-400 hover:text-white text-sm font-instrument transition-colors">← Back</button>
              <span className="text-white text-xs font-semibold font-instrument">{activePlan.name}</span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-1">Price</p>
                <p className="text-white text-lg font-semibold font-instrument">{activePlan.price} <span className="text-zinc-500 text-xs font-normal">{activePlan.billing}</span></p>
              </div>
              <div>
                <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-1">Members</p>
                <p className="text-zinc-300 text-sm font-instrument">{activePlan.members}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-1">Description</p>
                <p className="text-zinc-400 text-xs font-instrument">{activePlan.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NEW PLAN MODAL ── */}
      <AnimatePresence>
        {showNewPlan && <NewPlanModal onClose={() => setShowNewPlan(false)} />}
      </AnimatePresence>
    </div>
  )
}
