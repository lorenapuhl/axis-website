"use client"
// AttendanceDashboard — take attendance for a selected class.
// Each attendee row has a toggle (present / absent).
// "Mark all present" button toggles everyone at once.

import { useState } from "react"
import { motion } from "framer-motion"

// TypeScript types
interface Attendee {
  id: string
  name: string
}

interface ClassOption {
  id: string
  label: string
  attendees: Attendee[]
}

// Mock class data with attendees for each
const CLASS_OPTIONS: ClassOption[] = [
  {
    id: "1",
    label: "Boxing Fundamentals · Mon 7:00 AM",
    attendees: [
      { id: "a1", name: "Marcus Rivera" },
      { id: "a2", name: "Sofia Chen" },
      { id: "a3", name: "Luca Ferretti" },
      { id: "a4", name: "Amara Diallo" },
      { id: "a5", name: "Dante Moreau" },
    ],
  },
  {
    id: "2",
    label: "Cardio Boxing · Mon 12:00 PM",
    attendees: [
      { id: "b1", name: "Marcus Rivera" },
      { id: "b2", name: "Yara Okonkwo" },
      { id: "b3", name: "Carlos Webb" },
    ],
  },
  {
    id: "3",
    label: "Advanced Sparring · Tue 8:00 AM",
    attendees: [
      { id: "c1", name: "Dante Moreau" },
      { id: "c2", name: "Luca Ferretti" },
      { id: "c3", name: "Nadia Sousa" },
      { id: "c4", name: "Marcus Rivera" },
    ],
  },
  {
    id: "4",
    label: "Bag Work · Wed 10:00 AM",
    attendees: [
      { id: "d1", name: "Sofia Chen" },
      { id: "d2", name: "Amara Diallo" },
      { id: "d3", name: "Yara Okonkwo" },
    ],
  },
]

// Toggle — a styled switch button (present = white, absent = dark)
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      // Role switch makes it semantically correct for accessibility
      role="switch"
      aria-checked={checked}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0
        ${checked ? "bg-green-500" : "bg-zinc-700"}
      `}
    >
      <motion.span
        // The sliding knob animates left to right
        animate={{ x: checked ? 16 : 2 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  )
}

export default function AttendanceDashboard() {
  // selectedClass — which class is being checked in
  const [selectedClassId, setSelectedClassId] = useState(CLASS_OPTIONS[0].id)
  // presentIds — set of attendee IDs marked as present
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set())

  const selectedClass = CLASS_OPTIONS.find((c) => c.id === selectedClassId)!

  // Toggle a single attendee's presence
  const toggleAttendee = (id: string) => {
    setPresentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Mark everyone in the current class as present (or deselect all if all already present)
  const markAll = () => {
    const allIds = selectedClass.attendees.map((a) => a.id)
    const allPresent = allIds.every((id) => presentIds.has(id))
    if (allPresent) {
      // Deselect all
      setPresentIds((prev) => {
        const next = new Set(prev)
        allIds.forEach((id) => next.delete(id))
        return next
      })
    } else {
      // Mark all present
      setPresentIds((prev) => {
        const next = new Set(prev)
        allIds.forEach((id) => next.add(id))
        return next
      })
    }
  }

  // Count present for the selected class
  const presentCount = selectedClass.attendees.filter((a) => presentIds.has(a.id)).length
  const allPresent = presentCount === selectedClass.attendees.length

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-900 h-96 flex flex-col overflow-hidden">

      {/* ── CLASS SELECTOR ── */}
      <div className="p-3 border-b border-zinc-900 shrink-0">
        <select
          value={selectedClassId}
          onChange={(e) => {
            setSelectedClassId(e.target.value)
            // Clear presence when switching class
            setPresentIds(new Set())
          }}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs font-instrument focus:outline-none"
        >
          {CLASS_OPTIONS.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.label}</option>
          ))}
        </select>
      </div>

      {/* ── ATTENDANCE HEADER ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 shrink-0">
        <p className="text-zinc-500 text-xs font-instrument">
          {presentCount} / {selectedClass.attendees.length} present
        </p>
        <button
          onClick={markAll}
          className={`text-xs font-instrument px-3 py-1.5 rounded-lg border transition-colors
            ${allPresent
              ? "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              : "border-green-500/30 text-green-400 hover:bg-green-500/10"
            }`}
        >
          {allPresent ? "Clear all" : "Mark all present"}
        </button>
      </div>

      {/* ── ATTENDEE LIST ── */}
      <div className="flex-1 overflow-y-auto">
        {selectedClass.attendees.map((attendee) => {
          const isPresent = presentIds.has(attendee.id)
          return (
            // Row height h-12 = 48px
            <div
              key={attendee.id}
              className="flex items-center justify-between px-4 h-12 border-b border-zinc-900/50"
            >
              {/* Initials avatar */}
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-instrument shrink-0
                  ${isPresent ? "bg-green-500/20 text-green-400" : "bg-zinc-800 text-zinc-500"}`}
                >
                  {attendee.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className={`text-xs font-instrument font-medium transition-colors
                  ${isPresent ? "text-white" : "text-zinc-500"}`}
                >
                  {attendee.name}
                </span>
              </div>

              {/* Presence toggle */}
              <Toggle
                checked={isPresent}
                onChange={() => toggleAttendee(attendee.id)}
              />
            </div>
          )
        })}
      </div>

      {/* ── FOOTER — save button ── */}
      <div className="p-3 border-t border-zinc-900 shrink-0">
        <button className="w-full py-2 rounded-lg bg-white text-black text-xs font-instrument font-semibold hover:bg-zinc-100 transition-colors">
          Save Attendance
        </button>
      </div>
    </div>
  )
}
