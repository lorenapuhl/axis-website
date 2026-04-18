"use client"
// "use client" needed: uses useState (day filter) and Framer Motion.

import { useState } from "react"
import { motion } from "framer-motion"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import { classes, weekDays } from "@/components/data/classes"
import type { ScheduleClass, DayOfWeek } from "@/components/data/classes"
import type { Dict, Lang } from "@/lib/getDictionary"

interface SchedulePreviewProps {
  dict: Dict["schedule_preview"];
  lang: Lang;
  onBook: (cls: ScheduleClass) => void;
}

export default function SchedulePreview({ dict, lang, onBook }: SchedulePreviewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday")

  const filtered = classes.filter((cls) => cls.day === selectedDay)

  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-surface">
      <SectionWrapper>

        {/* SECTION HEADER */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-2">
              {dict.eyebrow}
            </p>
            <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
              {dict.heading}
            </h2>
          </div>
          <Button href={`/${lang}/schedule`} variant="secondary" className="self-start md:self-auto">
            {dict.full_schedule}
          </Button>
        </motion.div>

        {/* DAY FILTER */}
        <motion.div
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-6"
        >
          {weekDays.map((day) => {
            const label = dict.days[day] ?? day
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`
                  shrink-0 px-4 py-2 rounded-full text-sm font-medium
                  ${selectedDay === day ? "bg-white text-black" : "bg-edge text-dim"}
                `}
              >
                <span className="md:hidden">{label.slice(0, 3)}</span>
                <span className="hidden md:inline">{label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* CLASS ROWS */}
        <div className="divide-y divide-edge">
          {filtered.length === 0 ? (
            <p className="text-dim text-sm py-8 text-center">
              {dict.no_classes} {dict.days[selectedDay] ?? selectedDay}.
            </p>
          ) : (
            filtered.map((cls, index) => (
              <motion.div
                key={cls.id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3"
              >
                {/* LEFT — time + class info */}
                <div className="flex items-start sm:items-center gap-4">
                  <span className="text-white font-medium text-sm w-12 shrink-0 font-mono">
                    {cls.time}
                  </span>
                  <div>
                    <p className="text-white font-medium text-sm">{cls.name}</p>
                    <p className="text-dim text-xs mt-0.5">
                      {cls.coach} · {cls.durationMinutes}min
                    </p>
                  </div>
                </div>

                {/* RIGHT — spots badge + book button */}
                <div className="flex items-center gap-3 sm:ml-auto">
                  <Badge variant={cls.spotsLeft <= 3 ? "urgent" : "default"}>
                    {cls.spotsLeft <= 3
                      ? dict.only_left.replace("{n}", String(cls.spotsLeft))
                      : `${cls.spotsLeft} ${dict.spots}`}
                  </Badge>
                  <button
                    onClick={() => onBook(cls)}
                    className="bg-white text-black text-xs font-medium px-3 py-1.5 rounded-md hover:opacity-90 transition-none"
                  >
                    {dict.book}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </SectionWrapper>
    </section>
  )
}
