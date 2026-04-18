"use client"
// CoachDashboard — grid of coach cards showing name, assigned classes, and weekly hours.
// Clicking a card opens an "Assign Classes" modal.
// "+ Add Coach" button opens a form to add a new coach.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript interfaces
interface Coach {
  id: string
  name: string
  initials: string
  role: string
  classes: string[]
  weeklyHours: number
  classesThisWeek: number
}

// Mock coach data
const COACHES: Coach[] = [
  {
    id: "1",
    name: "Miguel Santos",
    initials: "MS",
    role: "Head Coach",
    classes: ["Boxing Fundamentals", "Advanced Sparring", "Bag Work"],
    weeklyHours: 18,
    classesThisWeek: 9,
  },
  {
    id: "2",
    name: "Aisha Kamara",
    initials: "AK",
    role: "Cardio Coach",
    classes: ["Cardio Boxing", "Boxing Fundamentals"],
    weeklyHours: 12,
    classesThisWeek: 6,
  },
  {
    id: "3",
    name: "Carlos Webb",
    initials: "CW",
    role: "Coach",
    classes: ["Cardio Boxing", "Bag Work"],
    weeklyHours: 10,
    classesThisWeek: 5,
  },
  {
    id: "4",
    name: "Leila Torres",
    initials: "LT",
    role: "Junior Coach",
    classes: [],
    weeklyHours: 0,
    classesThisWeek: 0,
  },
]

// All available class types that can be assigned to a coach
const ALL_CLASSES = [
  "Boxing Fundamentals",
  "Cardio Boxing",
  "Advanced Sparring",
  "Bag Work",
  "Strength & Conditioning",
  "Open Gym",
]

const ROLES = ["Head Coach", "Cardio Coach", "Coach", "Junior Coach"]

// ── AssignModal ─────────────────────────────────────────────────────────────
// Opens when a coach card is clicked.
// Shows a checklist of all class types — the user can assign or unassign each one.
function AssignModal({ coach, onClose }: { coach: Coach; onClose: () => void }) {
  // Set — a JavaScript data structure that automatically prevents duplicates.
  // We use it here to track which classes are checked.
  const [assigned, setAssigned] = useState<Set<string>>(new Set(coach.classes))

  // Toggle a class on or off in the assigned set
  const toggle = (cls: string) => {
    setAssigned((prev) => {
      const next = new Set(prev)
      if (next.has(cls)) {
        next.delete(cls)
      } else {
        next.add(cls)
      }
      return next
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-white text-sm font-semibold font-instrument">Assign Classes</h3>
            <p className="text-zinc-500 text-xs font-instrument">{coach.name}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        {/* Checklist — each class is a toggleable button */}
        <div className="space-y-1 mb-5">
          {ALL_CLASSES.map((cls) => (
            <button
              key={cls}
              onClick={() => toggle(cls)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                ${assigned.has(cls) ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"}`}
            >
              {/* Visual checkbox indicator */}
              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                ${assigned.has(cls) ? "bg-white border-white" : "border-zinc-600"}`}
              >
                {assigned.has(cls) && (
                  <span className="text-black text-xs leading-none font-bold">✓</span>
                )}
              </span>
              <span className="text-xs font-instrument">{cls}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-zinc-800 text-zinc-400 text-xs font-instrument hover:border-zinc-700 transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-instrument font-semibold hover:bg-zinc-100 transition-colors">
            Save
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── AddCoachModal ────────────────────────────────────────────────────────────
// Opens when "+ Add Coach" is clicked.
// Collects the name and role for a new coach.
function AddCoachModal({ onClose }: { onClose: () => void }) {
  // useState — stores each form field value independently
  const [name, setName] = useState("")
  const [role, setRole] = useState(ROLES[2]) // default: "Coach"

  // Derive initials from the name — e.g. "Jordan Lee" → "JL"
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("")

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
          <h3 className="text-white text-sm font-semibold font-instrument">Add Coach</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        <div className="space-y-3">
          {/* Avatar preview — updates live as the user types their name */}
          {initials && (
            <div className="flex justify-center mb-1">
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-sm text-zinc-300 font-semibold font-instrument">
                {initials}
              </div>
            </div>
          )}

          {/* Full name */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none placeholder:text-zinc-700"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            >
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-zinc-800 text-zinc-400 text-xs font-instrument hover:border-zinc-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={onClose}
            disabled={!name.trim()}
            className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-instrument font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Coach
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CoachDashboard() {
  // activeCoach — which coach card was clicked (null = assign modal closed)
  const [activeCoach, setActiveCoach] = useState<Coach | null>(null)
  // addOpen — whether the "Add Coach" modal is showing
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-900 flex flex-col md:h-96 md:overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 shrink-0">
        <p className="text-zinc-500 text-xs font-instrument uppercase tracking-wider">Coaches</p>
        {/* Add Coach — opens the add modal */}
        <button
          onClick={() => setAddOpen(true)}
          className="bg-white text-black text-xs font-instrument font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          + Add Coach
        </button>
      </div>

      {/* ── COACH CARD GRID ── */}
      <div className="md:flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 content-start">
        {COACHES.map((coach, idx) => (
          // motion.button — a Framer Motion-enhanced button that animates on mount
          <motion.button
            key={coach.id}
            onClick={() => setActiveCoach(coach)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.07 }}
            className="text-left bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-600 transition-colors"
          >
            {/* Avatar + name */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-300 font-semibold font-instrument shrink-0">
                {coach.initials}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold font-instrument truncate">{coach.name}</p>
                <p className="text-zinc-600 text-xs font-instrument">{coach.role}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-1 pt-2 border-t border-zinc-800">
              <div className="flex justify-between">
                <span className="text-zinc-600 text-xs font-instrument">Classes</span>
                <span className="text-zinc-300 text-xs font-instrument">{coach.classesThisWeek} this week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 text-xs font-instrument">Hours</span>
                <span className="text-zinc-300 text-xs font-instrument">{coach.weeklyHours}h / week</span>
              </div>
            </div>

            {/* Assigned class tags — shows up to 2, then "+N more" */}
            {coach.classes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {coach.classes.slice(0, 2).map((cls) => (
                  <span key={cls} className="text-zinc-500 text-xs font-instrument bg-zinc-800 rounded px-1.5 py-0.5 truncate max-w-full">
                    {cls.split(" ")[0]}
                  </span>
                ))}
                {coach.classes.length > 2 && (
                  <span className="text-zinc-600 text-xs font-instrument">+{coach.classes.length - 2}</span>
                )}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* ── MODALS ──
          AnimatePresence keeps both modals from clashing — only one shows at a time. */}
      <AnimatePresence>
        {activeCoach && <AssignModal coach={activeCoach} onClose={() => setActiveCoach(null)} />}
        {addOpen      && <AddCoachModal onClose={() => setAddOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
