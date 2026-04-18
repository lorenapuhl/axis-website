"use client"
// "use client" needed: uses Framer Motion for scroll animations.

import { motion } from "framer-motion"
import Image from "next/image"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Badge from "@/components/ui/Badge"
import { newsItems } from "@/components/data/news"
import type { Dict, Lang } from "@/lib/getDictionary"

interface NewsSectionProps {
  dict: Dict["news"];
  lang: Lang;
}

function formatDate(iso: string, lang: Lang): string {
  const date = new Date(iso)
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function NewsSection({ dict, lang }: NewsSectionProps) {
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

        {/* NEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((item, index) => (
            <a
              key={item.id}
              href={item.link}
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
                      src={item.imageUrl}
                      alt={`${item.title[lang]} — Overhandz Boxing Club news`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="absolute top-3 left-3">
                    <Badge>{dict.categories[item.category] ?? item.category}</Badge>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-dim text-xs">{formatDate(item.date, lang)}</p>
                    <p className="text-dim text-xs">{item.author}</p>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 leading-snug">
                    {item.title[lang]}
                  </h3>
                  <p className="text-dim text-sm leading-relaxed line-clamp-3">
                    {item.excerpt[lang]}
                  </p>
                </div>
              </motion.div>
            </a>
          ))}
        </div>
      </SectionWrapper>
    </section>
  )
}
