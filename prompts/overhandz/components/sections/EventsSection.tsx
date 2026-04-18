"use client"
// "use client" needed: uses Framer Motion for scroll animations.

import { motion } from "framer-motion"
import Image from "next/image"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Badge from "@/components/ui/Badge"
import { events } from "@/components/data/events"
import type { Dict, Lang } from "@/lib/getDictionary"

interface EventsSectionProps {
  dict: Dict["events"];
  lang: Lang;
}

function formatDate(iso: string, lang: Lang): string {
  const date = new Date(iso)
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function EventsSection({ dict, lang }: EventsSectionProps) {
  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-surface">
      <SectionWrapper>

        {/* SECTION HEADER */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="text-dim text-sm font-medium tracking-widest uppercase mb-2">
            {dict.eyebrow}
          </p>
          <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
            {dict.heading}
          </h2>
        </motion.div>

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <a
              key={event.id}
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                whileHover="hovered"
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
                className="bg-canvas border border-edge rounded-xl overflow-hidden"
              >
                {/* IMAGE */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    variants={{ hovered: { scale: 1.05 } }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Image
                      src={event.imageUrl}
                      alt={`${event.title[lang]} — Overhandz Boxing Club event`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="absolute top-3 left-3">
                    <Badge>{dict.types[event.type] ?? event.type}</Badge>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-5">
                  <p className="text-dim text-xs mb-1">
                    {formatDate(event.date, lang)}{event.time ? ` · ${event.time}` : ""}
                  </p>
                  <h3 className="text-white font-semibold text-lg mb-2 leading-snug">
                    {event.title[lang]}
                  </h3>
                  <p className="text-dim text-sm leading-relaxed mb-4">
                    {event.description[lang]}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-dim text-xs">{event.location}</p>
                    {event.spotsLeft !== null && (
                      <Badge variant={event.spotsLeft <= 10 ? "urgent" : "default"}>
                        {event.spotsLeft} {dict.spots_left}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            </a>
          ))}
        </div>
      </SectionWrapper>
    </section>
  )
}
