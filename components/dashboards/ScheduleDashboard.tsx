"use client"
// ScheduleDashboard — a weekly class calendar with hour-based time slots.
// Shows a 5-column Mon–Fri grid (abbreviated for dashboard view) with class blocks.
// Click a class → edit modal opens.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript interfaces — define the shape of scheduled classes
interface ScheduledClass {
  id: string
  day: string
  time: string
  endTime: string
  name: string
  coach: string
  capacity: number
  booked: number
  // gridRow maps the time to a CSS grid row for positioning
  gridRow: number
}

// Mock class schedule data
const CLASSES: ScheduledClass[] = [
  { id: "1", day: "Mon", time: "7:00", endTime: "8:00", name: "Boxing Fundamentals", coach: "Miguel", capacity: 12, booked: 10, gridRow: 1 },
  { id: "2", day: "Mon", time: "12:00", endTime: "13:00", name: "Cardio Boxing", coach: "Aisha", capacity: 15, booked: 15, gridRow: 5 },
  { id: "3", day: "Tue", time: "8:00", endTime: "9:00", name: "Advanced Sparring", coach: "Miguel", capacity: 8, booked: 6, gridRow: 2 },
  { id: "4", day: "Tue", time: "18:00", endTime: "19:00", name: "Boxing Fundamentals", coach: "Aisha", capacity: 12, booked: 9, gridRow: 9 },
  { id: "5", day: "Wed", time: "7:00", endTime: "8:00", name: "Cardio Boxing", coach: "Carlos", capacity: 15, booked: 11, gridRow: 1 },
  { id: "6", day: "Wed", time: "10:00", endTime: "11:00", name: "Bag Work", coach: "Miguel", capacity: 10, booked: 7, gridRow: 4 },
  { id: "7", day: "Thu", time: "12:00", endTime: "13:00", name: "Boxing Fundamentals", coach: "Carlos", capacity: 12, booked: 12, gridRow: 5 },
  { id: "8", day: "Thu", time: "19:00", endTime: "20:00", name: "Advanced Sparring", coach: "Miguel", capacity: 8, booked: 5, gridRow: 10 },
  { id: "9", day: "Fri", time: "7:00", endTime: "8:00", name: "Bag Work", coach: "Aisha", capacity: 10, booked: 8, gridRow: 1 },
  { id: "10", day: "Fri", time: "18:00", endTime: "19:00", name: "Cardio Boxing", coach: "Carlos", capacity: 15, booked: 14, gridRow: 9 },
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
// Time labels shown on the left of the calendar
const TIMES = ["7:00", "8:00", "9:00", "10:00", "12:00", "14:00", "16:00", "18:00", "19:00", "20:00"]

// ClassEditModal — opens when a class block is clicked
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
          {/* Time */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Time</label>
            <input
              defaultValue={`${cls.time} – ${cls.endTime}`}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            />
          </div>
          {/* Coach */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Coach</label>
            <select
              defaultValue={cls.coach}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            >
              <option>Miguel</option>
              <option>Aisha</option>
              <option>Carlos</option>
            </select>
          </div>
          {/* Capacity */}
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

export default function ScheduleDashboard() {
  // activeClass — the class currently being edited (null = modal closed)
  const [activeClass, setActiveClass] = useState<ScheduledClass | null>(null)
  // weekOffset — 0 = current week, -1 = previous, +1 = next
  const [weekOffset, setWeekOffset] = useState(0)
  const [filterCoach, setFilterCoach] = useState("All")

  // Classes filtered by selected coach
  const filtered = filterCoach === "All"
    ? CLASSES
    : CLASSES.filter((c) => c.coach === filterCoach)

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-900 h-96 flex flex-col overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center gap-2 p-3 border-b border-zinc-900 shrink-0 flex-wrap">
        {/* Week switcher */}
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

        {/* Coach filter */}
        <select
          value={filterCoach}
          onChange={(e) => setFilterCoach(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-400 text-xs font-instrument focus:outline-none"
        >
          <option>All</option>
          <option>Miguel</option>
          <option>Aisha</option>
          <option>Carlos</option>
        </select>

        <div className="flex-1" />

        {/* Create class CTA */}
        <button className="bg-white text-black text-xs font-instrument font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors whitespace-nowrap">
          + Create Class
        </button>
      </div>

      {/* ── CALENDAR GRID ── */}
      <div className="flex-1 overflow-auto">
        {/* Column headers — day names */}
        <div className="grid grid-cols-6 border-b border-zinc-900 sticky top-0 bg-zinc-950 z-10">
          <div className="py-2 px-2" /> {/* empty time column */}
          {DAYS.map((day) => (
            <div key={day} className="py-2 text-center text-zinc-500 text-xs font-instrument uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Time rows */}
        {TIMES.map((time, rowIdx) => (
          <div key={time} className="grid grid-cols-6 border-b border-zinc-900/50 min-h-10">
            {/* Time label */}
            <div className="px-2 py-2 text-zinc-700 text-xs font-instrument text-right pr-3 shrink-0">
              {time}
            </div>
            {/* Day cells */}
            {DAYS.map((day) => {
              // Find classes that fall on this day and time row
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
                      {/* Capacity indicator */}
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

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {activeClass && <ClassEditModal cls={activeClass} onClose={() => setActiveClass(null)} />}
      </AnimatePresence>
    </div>
  )
}
