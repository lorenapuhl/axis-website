"use client"
// "use client" needed: uses useState for day filter + booking modal state.

import { useState } from "react"
import { motion } from "framer-motion"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Badge from "@/components/ui/Badge"
import BookingModal from "@/components/BookingModal"
import { classes, weekDays, classTypes } from "@/components/data/classes"
import type { ScheduleClass, DayOfWeek, ClassType } from "@/components/data/classes"
import type { Dict, Lang } from "@/lib/getDictionary"

interface SchedulePageClientProps {
  dict: Dict;
  lang: Lang;
}

export default function SchedulePageClient({ dict, lang }: SchedulePageClientProps) {
  const sd = dict.schedule_page
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "All">("All")
  const [selectedType, setSelectedType] = useState<ClassType | "All">("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ScheduleClass | null>(null)

  const filtered = classes.filter((cls) => {
    const dayMatch = selectedDay === "All" || cls.day === selectedDay
    const typeMatch = selectedType === "All" || cls.type === selectedType
    return dayMatch && typeMatch
  })

  const handleBook = (cls: ScheduleClass) => {
    setSelectedClass(cls)
    setModalOpen(true)
  }

  return (
    <main className="bg-canvas pb-24 md:pb-0">

      {/* PAGE HEADER */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-surface border-b border-edge">
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-2">
              {sd.eyebrow}
            </p>
            <h1 className="text-white font-bold text-5xl md:text-7xl tracking-tight">
              {sd.heading}
            </h1>
            <p className="text-dim text-base mt-4 max-w-lg">{sd.subtext}</p>
          </motion.div>
        </SectionWrapper>
      </section>

      {/* FILTERS + CLASS LIST */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
        <SectionWrapper>

          {/* FILTER ROW */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {/* DAY FILTERS */}
            <div className="flex gap-2 overflow-x-auto pb-1 w-full">
              <FilterPill
                label={sd.all_days}
                active={selectedDay === "All"}
                onClick={() => setSelectedDay("All")}
              />
              {weekDays.map((day) => {
                const label = dict.schedule_preview.days[day] ?? day
                return (
                  <FilterPill
                    key={day}
                    label={label.slice(0, 3)}
                    active={selectedDay === day}
                    onClick={() => setSelectedDay(day)}
                  />
                )
              })}
            </div>

            {/* TYPE FILTERS */}
            <div className="flex gap-2 flex-wrap">
              <FilterPill
                label={sd.all_types}
                active={selectedType === "All"}
                onClick={() => setSelectedType("All")}
              />
              {classTypes.map((type) => (
                <FilterPill
                  key={type}
                  label={type}
                  active={selectedType === type}
                  onClick={() => setSelectedType(type)}
                />
              ))}
            </div>
          </motion.div>

          {/* RESULTS COUNT */}
          <p className="text-dim text-sm mb-6">
            {filtered.length}{" "}
            {filtered.length !== 1 ? sd.classes_found_plural : sd.classes_found_singular}
          </p>

          {/* CLASS TABLE */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-dim">{sd.no_match}</div>
          ) : (
            <div className="divide-y divide-edge">
              {filtered.map((cls, index) => (
                <ClassRow
                  key={cls.id}
                  cls={cls}
                  index={index}
                  lang={lang}
                  dict={sd}
                  onBook={handleBook}
                />
              ))}
            </div>
          )}
        </SectionWrapper>
      </section>

      {/* BOOKING MODAL */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedClass={selectedClass}
        dict={dict.booking_modal}
        lang={lang}
      />

      {/* STICKY MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 md:hidden p-4 bg-canvas/95 backdrop-blur border-t border-edge">
        <p className="text-white text-center text-sm font-medium">{sd.select_class}</p>
      </div>
    </main>
  )
}

// ---------------------------------------------------------------------------
// FilterPill
// ---------------------------------------------------------------------------
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
        ${active ? "bg-white text-black" : "bg-edge text-dim hover:text-white"}
      `}
    >
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// ClassRow
// ---------------------------------------------------------------------------
function ClassRow({
  cls,
  index,
  lang,
  dict,
  onBook,
}: {
  cls: ScheduleClass;
  index: number;
  lang: Lang;
  dict: Dict["schedule_page"];
  onBook: (cls: ScheduleClass) => void;
}) {
  const isUrgent = cls.spotsLeft <= 3

  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.04 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-4"
    >
      {/* LEFT */}
      <div className="flex items-start sm:items-center gap-5">
        <div className="w-14 shrink-0">
          <p className="text-white font-medium text-sm font-mono">{cls.time}</p>
          <p className="text-dim text-xs">{cls.durationMinutes}min</p>
        </div>
        <div>
          <p className="text-white font-medium text-sm">{cls.name}</p>
          <p className="text-dim text-xs mt-0.5">
            {cls.day} · {cls.coach} · {cls.type}
          </p>
          <p className="text-dim text-xs mt-1 max-w-md hidden md:block">
            {cls.description[lang]}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:ml-auto">
        <Badge variant={isUrgent ? "urgent" : "default"}>
          {isUrgent
            ? dict.only_left.replace("{n}", String(cls.spotsLeft))
            : `${cls.spotsLeft} ${dict.spots}`}
        </Badge>
        <button
          onClick={() => onBook(cls)}
          className="bg-white text-black text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-none"
        >
          {dict.book}
        </button>
      </div>
    </motion.div>
  )
}
