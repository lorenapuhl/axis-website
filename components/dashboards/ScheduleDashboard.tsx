"use client"
// ScheduleDashboard — a weekly class calendar with hour-based time slots.
// Shows a 5-column Mon–Fri grid with class blocks.
// Click a class → edit modal. "Create Class" → create modal.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript interfaces — define the shape of each object this component uses
interface ScheduledClass {
  id: string
  day: string
  time: string
  endTime: string
  name: string
  coach: string
  capacity: number
  booked: number
  // gridRow maps the time slot to a CSS grid row for positioning
  gridRow: number
}

// NewClassForm — shape of the create-class form state
interface NewClassForm {
  name: string
  day: string
  startTime: string
  endTime: string
  coach: string
  capacity: string
}

// Mock class schedule data
const CLASSES: ScheduledClass[] = [
  { id: "1",  day: "Mon", time: "7:00",  endTime: "8:00",  name: "Boxing Fundamentals", coach: "Miguel", capacity: 12, booked: 10, gridRow: 1  },
  { id: "2",  day: "Mon", time: "12:00", endTime: "13:00", name: "Cardio Boxing",        coach: "Aisha",  capacity: 15, booked: 15, gridRow: 5  },
  { id: "3",  day: "Tue", time: "8:00",  endTime: "9:00",  name: "Advanced Sparring",   coach: "Miguel", capacity: 8,  booked: 6,  gridRow: 2  },
  { id: "4",  day: "Tue", time: "18:00", endTime: "19:00", name: "Boxing Fundamentals", coach: "Aisha",  capacity: 12, booked: 9,  gridRow: 9  },
  { id: "5",  day: "Wed", time: "7:00",  endTime: "8:00",  name: "Cardio Boxing",       coach: "Carlos", capacity: 15, booked: 11, gridRow: 1  },
  { id: "6",  day: "Wed", time: "10:00", endTime: "11:00", name: "Bag Work",            coach: "Miguel", capacity: 10, booked: 7,  gridRow: 4  },
  { id: "7",  day: "Thu", time: "12:00", endTime: "13:00", name: "Boxing Fundamentals", coach: "Carlos", capacity: 12, booked: 12, gridRow: 5  },
  { id: "8",  day: "Thu", time: "19:00", endTime: "20:00", name: "Advanced Sparring",   coach: "Miguel", capacity: 8,  booked: 5,  gridRow: 10 },
  { id: "9",  day: "Fri", time: "7:00",  endTime: "8:00",  name: "Bag Work",            coach: "Aisha",  capacity: 10, booked: 8,  gridRow: 1  },
  { id: "10", day: "Fri", time: "18:00", endTime: "19:00", name: "Cardio Boxing",       coach: "Carlos", capacity: 15, booked: 14, gridRow: 9  },
]

const DAYS    = ["Mon", "Tue", "Wed", "Thu", "Fri"]
const TIMES   = ["7:00", "8:00", "9:00", "10:00", "12:00", "14:00", "16:00", "18:00", "19:00", "20:00"]
const COACHES = ["Miguel", "Aisha", "Carlos"]
const CLASS_NAMES = [
  "Boxing Fundamentals",
  "Cardio Boxing",
  "Advanced Sparring",
  "Bag Work",
  "Strength & Conditioning",
  "Open Gym",
]

// ── ClassEditModal ──────────────────────────────────────────────────────────
// Opens when a class block on the calendar is clicked.
// Allows editing time, coach, and capacity.
function ClassEditModal({ cls, onClose }: { cls: ScheduledClass; onClose: () => void }) {
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
          <h3 className="text-white text-sm font-semibold font-instrument">{cls.name}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Time</label>
            <input
              defaultValue={`${cls.time} – ${cls.endTime}`}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            />
          </div>
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Coach</label>
            <select
              defaultValue={cls.coach}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            >
              {COACHES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Capacity</label>
            <input
              type="number"
              defaultValue={cls.capacity}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
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

// ── CreateClassModal ────────────────────────────────────────────────────────
// Opens when the "Create Class" button is clicked.
// Collects all the information needed to define a new class.
function CreateClassModal({ onClose }: { onClose: () => void }) {
  // useState — React hook that stores the form values and updates them as the user types.
  // Each field is a key in the NewClassForm object.
  const [form, setForm] = useState<NewClassForm>({
    name:      CLASS_NAMES[0],
    day:       "Mon",
    startTime: "07:00",
    endTime:   "08:00",
    coach:     COACHES[0],
    capacity:  "12",
  })

  // Helper that updates a single form field without touching the others.
  // "keyof NewClassForm" means the field name must be one of the defined keys.
  const set = (field: keyof NewClassForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

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
          <h3 className="text-white text-sm font-semibold font-instrument">New Class</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        <div className="space-y-3">
          {/* Class name — dropdown of known class types */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Class Name</label>
            <select
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            >
              {CLASS_NAMES.map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>

          {/* Day of the week */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Day</label>
            <select
              value={form.day}
              onChange={(e) => set("day", e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Start and end time — side by side using a 2-column grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Start</label>
              {/* type="time" gives a native time picker */}
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => set("startTime", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">End</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => set("endTime", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
              />
            </div>
          </div>

          {/* Coach assigned to this class */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Coach</label>
            <select
              value={form.coach}
              onChange={(e) => set("coach", e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            >
              {COACHES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Maximum number of spots */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Capacity</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => set("capacity", e.target.value)}
              min={1}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-zinc-800 text-zinc-400 text-xs font-instrument hover:border-zinc-700 transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-instrument font-semibold hover:bg-zinc-100 transition-colors">
            Create Class
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ScheduleDashboard() {
  // activeClass — the class the user clicked to edit (null = edit modal closed)
  const [activeClass, setActiveClass] = useState<ScheduledClass | null>(null)
  // createOpen — controls whether the "Create Class" modal is showing
  const [createOpen, setCreateOpen] = useState(false)
  // weekOffset — 0 = this week, negative = past, positive = future
  const [weekOffset, setWeekOffset] = useState(0)
  const [filterCoach, setFilterCoach] = useState("All")

  // Filter the class list by selected coach
  const filtered = filterCoach === "All"
    ? CLASSES
    : CLASSES.filter((c) => c.coach === filterCoach)

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-900 h-96 flex flex-col overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center gap-2 p-3 border-b border-zinc-900 shrink-0 flex-wrap">
        {/* Week navigation — prev / current / next */}
        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-0.5">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="text-zinc-400 hover:text-white px-2 py-1 text-xs font-instrument transition-colors rounded"
          >
            ←
          </button>
          <span className="text-zinc-400 text-xs font-instrument px-2">
            {weekOffset === 0 ? "This week" : weekOffset < 0 ? `${Math.abs(weekOffset)}w ago` : `In ${weekOffset}w`}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="text-zinc-400 hover:text-white px-2 py-1 text-xs font-instrument transition-colors rounded"
          >
            →
          </button>
        </div>

        {/* Coach filter dropdown */}
        <select
          value={filterCoach}
          onChange={(e) => setFilterCoach(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-400 text-xs font-instrument focus:outline-none"
        >
          <option>All</option>
          {COACHES.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Spacer pushes the button to the right */}
        <div className="flex-1" />

        {/* Create Class — opens the create modal */}
        <button
          onClick={() => setCreateOpen(true)}
          className="bg-white text-black text-xs font-instrument font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors whitespace-nowrap"
        >
          + Create Class
        </button>
      </div>

      {/* ── CALENDAR GRID ── */}
      <div className="flex-1 overflow-auto">
        {/* Sticky header row with day names */}
        <div className="grid grid-cols-6 border-b border-zinc-900 sticky top-0 bg-zinc-950 z-10">
          <div className="py-2 px-2" />
          {DAYS.map((day) => (
            <div key={day} className="py-2 text-center text-zinc-500 text-xs font-instrument uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* One row per time slot */}
        {TIMES.map((time, rowIdx) => (
          <div key={time} className="grid grid-cols-6 border-b border-zinc-900/50 min-h-10">
            {/* Time label on the left */}
            <div className="px-2 py-2 text-zinc-700 text-xs font-instrument text-right pr-3 shrink-0">
              {time}
            </div>
            {/* A cell for each day — renders a class block if one is scheduled here */}
            {DAYS.map((day) => {
              const cls = filtered.find((c) => c.day === day && c.gridRow === rowIdx + 1)
              return (
                <div key={day} className="relative p-0.5">
                  {cls && (
                    <button
                      onClick={() => setActiveClass(cls)}
                      className="w-full h-full bg-zinc-900 border border-zinc-800 rounded text-left p-1.5 hover:border-zinc-600 transition-colors"
                    >
                      <p className="text-white text-xs font-instrument font-medium leading-tight truncate">
                        {cls.name}
                      </p>
                      <p className="text-zinc-500 text-xs font-instrument truncate">{cls.coach}</p>
                      {/* Red = full, green = spots available */}
                      <p className={`text-xs font-instrument ${cls.booked >= cls.capacity ? "text-red-400" : "text-green-400"}`}>
                        {cls.booked}/{cls.capacity}
                      </p>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* ── MODALS ──
          AnimatePresence allows the exit animation to play before the component is removed from the DOM.
          Without it, modals would disappear instantly. */}
      <AnimatePresence>
        {activeClass && <ClassEditModal cls={activeClass} onClose={() => setActiveClass(null)} />}
        {createOpen  && <CreateClassModal onClose={() => setCreateOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
