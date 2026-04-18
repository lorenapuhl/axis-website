"use client"
// BookingsDashboard — shows bookings per class with actions (Confirm, Waitlist, Remove).
//
// Mobile layout:  horizontal class chips at top → booking cards stacked full-width below.
//                 Each card has name + status badge on one row, action buttons on the next.
//                 No fixed height — all content visible without inner scrolling.
//
// Desktop layout: classic split view — class list on left, booking rows on right.
//                 Fixed h-96 with inner scroll (standard dashboard card look).

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript interfaces — shape of each data object
interface Booking {
  id: string
  name: string
  status: "confirmed" | "waitlist" | "cancelled"
}

interface ClassItem {
  id: string
  name: string
  day: string
  time: string
  coach: string
  bookings: Booking[]
}

// Mock data — realistic booking records per class
const CLASSES: ClassItem[] = [
  {
    id: "1",
    name: "Boxing Fundamentals",
    day: "Mon",
    time: "7:00 AM",
    coach: "Miguel",
    bookings: [
      { id: "b1", name: "Marcus Rivera", status: "confirmed" },
      { id: "b2", name: "Sofia Chen",    status: "confirmed" },
      { id: "b3", name: "Luca Ferretti", status: "confirmed" },
      { id: "b4", name: "Amara Diallo",  status: "waitlist"  },
      { id: "b5", name: "Dante Moreau",  status: "confirmed" },
    ],
  },
  {
    id: "2",
    name: "Cardio Boxing",
    day: "Mon",
    time: "12:00 PM",
    coach: "Aisha",
    bookings: [
      { id: "b6", name: "Yara Okonkwo",  status: "cancelled" },
      { id: "b7", name: "Marcus Rivera", status: "confirmed" },
      { id: "b8", name: "Sofia Chen",    status: "waitlist"  },
    ],
  },
  {
    id: "3",
    name: "Advanced Sparring",
    day: "Tue",
    time: "8:00 AM",
    coach: "Miguel",
    bookings: [
      { id: "b9",  name: "Dante Moreau",  status: "confirmed" },
      { id: "b10", name: "Luca Ferretti", status: "confirmed" },
    ],
  },
  {
    id: "4",
    name: "Bag Work",
    day: "Wed",
    time: "10:00 AM",
    coach: "Carlos",
    bookings: [
      { id: "b11", name: "Marcus Rivera", status: "confirmed" },
      { id: "b12", name: "Amara Diallo",  status: "confirmed" },
      { id: "b13", name: "Yara Okonkwo",  status: "waitlist"  },
    ],
  },
]

// Status badge colours — each status has its own tint
const STATUS_STYLES: Record<Booking["status"], string> = {
  confirmed: "bg-green-500/10 text-green-400 border border-green-500/20",
  waitlist:  "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
}

// ── Main component ──────────────────────────────────────────────────────────
export default function BookingsDashboard() {
  // selectedClass — which class is currently being viewed
  const [selectedClass, setSelectedClass] = useState<ClassItem>(CLASSES[0])
  // bookingStates — local overrides for booking status (no backend needed in demo)
  const [bookingStates, setBookingStates] = useState<Record<string, Booking["status"]>>({})

  // Get the effective status — local override wins over the original data
  const getStatus = (booking: Booking): Booking["status"] =>
    bookingStates[booking.id] ?? booking.status

  // Update a booking's status locally
  const updateStatus = (id: string, status: Booking["status"]) => {
    setBookingStates((prev) => ({ ...prev, [id]: status }))
  }

  // Count confirmed bookings for the selected class
  const confirmedCount = selectedClass.bookings.filter(
    (b) => getStatus(b) === "confirmed"
  ).length

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-900">

      {/* ══════════════════════════════════════════════════════
          MOBILE LAYOUT — visible on small screens only (md:hidden)
          Class chips at top → full-width booking cards below.
          No fixed height — expands to show all content.
          ══════════════════════════════════════════════════════ */}
      <div className="md:hidden">

        {/* Class chip selector — horizontally scrollable row of pills */}
        <div className="relative">
          {/* Fade mask on right edge — hints that there are more chips to scroll to */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none z-10" />
          <div className="flex gap-2 overflow-x-auto scrollbar-none p-3">
            {CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-instrument border whitespace-nowrap transition-colors
                  ${selectedClass.id === cls.id
                    ? "bg-zinc-900 border-white/20 text-white"
                    : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected class info bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-b border-zinc-900">
          <div>
            <p className="text-white text-xs font-semibold font-instrument">{selectedClass.name}</p>
            <p className="text-zinc-600 text-xs font-instrument mt-0.5">
              {selectedClass.day} · {selectedClass.time} · {selectedClass.coach}
            </p>
          </div>
          <span className="text-zinc-600 text-xs font-instrument shrink-0">{confirmedCount} confirmed</span>
        </div>

        {/* Booking cards — one per member, animates when class changes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedClass.id + "-mobile"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {selectedClass.bookings.map((booking) => {
              const status = getStatus(booking)
              return (
                <div key={booking.id} className="px-4 py-3 border-b border-zinc-900/50">
                  {/* Row 1: member name + status badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs font-instrument font-medium">
                      {booking.name}
                    </span>
                    <span className={`text-xs font-instrument px-2 py-0.5 rounded-full capitalize shrink-0 ${STATUS_STYLES[status]}`}>
                      {status}
                    </span>
                  </div>
                  {/* Row 2: action buttons — only the relevant ones appear */}
                  <div className="flex gap-1.5 flex-wrap">
                    {status !== "confirmed" && (
                      <button
                        onClick={() => updateStatus(booking.id, "confirmed")}
                        className="text-xs text-green-400 border border-green-500/20 px-2.5 py-1 rounded font-instrument hover:bg-green-500/10 transition-colors"
                      >
                        Confirm
                      </button>
                    )}
                    {status !== "waitlist" && (
                      <button
                        onClick={() => updateStatus(booking.id, "waitlist")}
                        className="text-xs text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded font-instrument hover:bg-yellow-500/10 transition-colors"
                      >
                        Waitlist
                      </button>
                    )}
                    {status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        className="text-xs text-red-400 border border-red-500/20 px-2.5 py-1 rounded font-instrument hover:bg-red-500/10 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP LAYOUT — hidden on mobile, shown on md+
          Classic split view: class list left, booking rows right.
          Fixed h-96 with inner scroll — standard dashboard card.
          ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex h-96 overflow-hidden">

        {/* ── LEFT: Class list ── */}
        <div className="w-44 shrink-0 border-r border-zinc-900 flex flex-col">
          <div className="px-3 py-2.5 border-b border-zinc-900 shrink-0">
            <p className="text-zinc-600 text-xs font-instrument uppercase tracking-wider">Classes</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`w-full text-left px-3 py-3 border-b border-zinc-900/50 hover:bg-zinc-900/50 transition-colors
                  ${selectedClass.id === cls.id ? "bg-zinc-900/60 border-l-2 border-l-white/20" : ""}
                `}
              >
                <p className="text-white text-xs font-instrument font-medium leading-snug truncate">
                  {cls.name}
                </p>
                <p className="text-zinc-600 text-xs font-instrument mt-0.5">
                  {cls.day} · {cls.time}
                </p>
                <p className="text-zinc-700 text-xs font-instrument">{cls.coach}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Booking rows for the selected class ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with class name and confirmed count */}
          <div className="px-4 py-2.5 border-b border-zinc-900 flex items-center justify-between shrink-0">
            <div>
              <p className="text-white text-xs font-semibold font-instrument">{selectedClass.name}</p>
              <p className="text-zinc-600 text-xs font-instrument">
                {selectedClass.day} · {selectedClass.time} · {selectedClass.coach}
              </p>
            </div>
            <span className="text-zinc-600 text-xs font-instrument">{confirmedCount} confirmed</span>
          </div>

          {/* Booking rows — animates when switching classes */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedClass.id + "-desktop"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {selectedClass.bookings.map((booking) => {
                  const status = getStatus(booking)
                  return (
                    // h-12 = 48px row height — consistent with other table-style dashboards
                    <div
                      key={booking.id}
                      className="flex items-center gap-2 px-4 h-12 border-b border-zinc-900/50"
                    >
                      {/* Member name */}
                      <span className="text-white text-xs font-instrument font-medium flex-1 truncate">
                        {booking.name}
                      </span>
                      {/* Status badge */}
                      <span className={`text-xs font-instrument px-2 py-0.5 rounded-full capitalize shrink-0 ${STATUS_STYLES[status]}`}>
                        {status}
                      </span>
                      {/* Action buttons */}
                      <div className="flex gap-1 shrink-0">
                        {status !== "confirmed" && (
                          <button
                            onClick={() => updateStatus(booking.id, "confirmed")}
                            className="text-xs text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-instrument hover:bg-green-500/10 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {status !== "waitlist" && (
                          <button
                            onClick={() => updateStatus(booking.id, "waitlist")}
                            className="text-xs text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded font-instrument hover:bg-yellow-500/10 transition-colors"
                          >
                            Waitlist
                          </button>
                        )}
                        {status !== "cancelled" && (
                          <button
                            onClick={() => updateStatus(booking.id, "cancelled")}
                            className="text-xs text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-instrument hover:bg-red-500/10 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
