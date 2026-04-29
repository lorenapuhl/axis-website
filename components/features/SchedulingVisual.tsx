"use client"
// SchedulingVisual — coded UI mockup for the scheduling-booking feature page.
//
// Shows a weekly class calendar grid with:
//   - Day columns (Mon–Sun)
//   - Class slots showing time, name, and fill rate
//   - Full classes highlighted in blue
//   - Summary stat tiles below

import { motion } from "framer-motion"

// TypeScript interface: shape of each class slot in the grid
interface ClassSlot {
  day:      number  // 0 = Monday … 6 = Sunday
  time:     string
  name:     string
  capacity: number
  booked:   number
}

// Days of the week shown as column headers
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Class schedule data — one entry per class
const CLASSES: ClassSlot[] = [
  { day: 0, time: "07:00", name: "HIIT",    capacity: 20, booked: 18 },
  { day: 0, time: "09:00", name: "Yoga",    capacity: 15, booked: 15 },
  { day: 1, time: "07:00", name: "Boxing",  capacity: 12, booked: 9  },
  { day: 1, time: "18:30", name: "Pilates", capacity: 10, booked: 10 },
  { day: 2, time: "06:30", name: "HIIT",    capacity: 20, booked: 14 },
  { day: 2, time: "10:00", name: "Spin",    capacity: 16, booked: 16 },
  { day: 3, time: "07:00", name: "Yoga",    capacity: 15, booked: 11 },
  { day: 3, time: "19:00", name: "Boxing",  capacity: 12, booked: 12 },
  { day: 4, time: "07:00", name: "HIIT",    capacity: 20, booked: 17 },
  { day: 4, time: "09:00", name: "Pilates", capacity: 10, booked: 8  },
  { day: 5, time: "08:00", name: "Yoga",    capacity: 15, booked: 15 },
  { day: 5, time: "10:00", name: "Spin",    capacity: 16, booked: 13 },
  { day: 6, time: "09:00", name: "HIIT",    capacity: 20, booked: 20 },
]

// Summary stats shown below the calendar
const SUMMARY = [
  { label: "Classes this week",  value: "13"  },
  { label: "Spots filled",       value: "178" },
  { label: "Avg fill rate",      value: "91%" },
]

export default function SchedulingVisual() {
  return (
    <div className="bg-grey-axis p-4 md:p-6 w-full">

      {/* Calendar header bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest">
          Weekly Schedule
        </p>
        <p className="font-instrument text-soft-grey text-[9px]">Apr 28 — May 4</p>
      </div>

      {/* Calendar grid — horizontally scrollable on very small screens.
          min-w-[600px] ensures columns don't collapse on narrow viewports. */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px] grid grid-cols-7 gap-1.5">
          {DAYS.map((day, dayIndex) => {
            // Filter to only the classes that fall on this day
            const dayClasses = CLASSES.filter((c) => c.day === dayIndex)
            return (
              <div key={day}>
                {/* Day label — compact, muted */}
                <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest text-center mb-2">
                  {day}
                </p>

                {/* Class slot cards for this day */}
                <div className="flex flex-col gap-1.5">
                  {dayClasses.map((cls) => {
                    // A class is "full" when booked equals capacity
                    const full = cls.booked === cls.capacity
                    return (
                      <motion.div
                        key={`${cls.day}-${cls.time}`}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        viewport={{ once: true }}
                        // Full classes get a blue accent border; others get a subtle white border
                        className={`p-2 border ${
                          full
                            ? "border-blue-axis bg-blue-axis/10"
                            : "border-white/10 bg-black-axis"
                        }`}
                      >
                        {/* Time */}
                        <p className="font-instrument text-soft-grey text-[8px]">{cls.time}</p>
                        {/* Class name */}
                        <p className="font-playfair text-white-axis text-[10px] mt-0.5 uppercase">
                          {cls.name}
                        </p>
                        {/* Fill ratio — blue if full, grey if not */}
                        <p className={`font-instrument text-[8px] mt-0.5 ${full ? "text-blue-axis" : "text-soft-grey"}`}>
                          {cls.booked}/{cls.capacity}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Summary tiles ── */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="bg-black-axis p-3">
            <p className="font-instrument text-soft-grey text-[8px] uppercase tracking-widest">{s.label}</p>
            <p className="font-playfair text-white-axis text-lg mt-1">{s.value}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
