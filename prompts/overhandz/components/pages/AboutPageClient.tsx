"use client"
// "use client" needed: uses Framer Motion for animations.

import { motion } from "framer-motion"
import Image from "next/image"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Button from "@/components/ui/Button"
import FinalCTA from "@/components/sections/FinalCTA"
import type { Dict, Lang } from "@/lib/getDictionary"

// ---------------------------------------------------------------------------
// AboutPageClient — full about page
//
// Sections:
//   1. Hero header (h1)
//   2. Story — expanded coach + gym narrative
//   3. Coaches — three coach cards
//   4. Philosophy — gym values
//   5. FinalCTA — shared booking push
// ---------------------------------------------------------------------------

const coachImages: Record<string, string> = {
  rudy: "/images/coaches/rudy.png",
  fabrice: "/images/coaches/fabrice.png",
  morad: "/images/coaches/morad.png",
}

interface AboutPageClientProps {
  dict: Dict;
  lang: Lang;
}

export default function AboutPageClient({ dict, lang }: AboutPageClientProps) {
  const ap = dict.about_page
  return (
    <main>
      {/* PAGE HEADER */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-surface border-b border-edge">
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-2">
              {ap.eyebrow}
            </p>
            {/* h1 — exactly one per page */}
            <h1 className="text-white font-bold text-5xl md:text-7xl tracking-tight">
              {ap.heading}
            </h1>
          </motion.div>
        </SectionWrapper>
      </section>

      {/* STORY SECTION */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
        <SectionWrapper>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Full-width image */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <Image
                src="/images/ui/about-picture.png"
                alt="Interior of Overhandz Boxing Club gym in Ivry-sur-Seine Paris showing boxing bags and ring"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>

            <div className="flex gap-3 justify-center">
              <Button href={`/${lang}/schedule`} variant="primary">
                {ap.cta_primary}
              </Button>
              <Button href={`/${lang}/contact`} variant="secondary">
                {ap.cta_secondary}
              </Button>
            </div>
          </motion.div>
        </SectionWrapper>
      </section>

      {/* COACHES SECTION */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-surface">
        <SectionWrapper>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-12"
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-2">
              {ap.coaches_eyebrow}
            </p>
            <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
              {ap.coaches_heading}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ap.coaches.map((coach, index) => (
              <motion.div
                key={coach.id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
              >
                {/* Coach image */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-5">
                  <Image
                    src={coachImages[coach.id] ?? `/images/coaches/${coach.id}.png`}
                    alt={`${coach.name} — ${coach.role} at Overhandz Boxing Club`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-white font-semibold text-lg">{coach.name}</p>
                <p className="text-dim text-sm mb-3">{coach.role}</p>
                <p className="text-dim text-sm leading-relaxed">{coach.bio}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
        <SectionWrapper>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-3">
              {ap.philosophy_eyebrow}
            </p>
            <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight mb-8">
              {ap.philosophy_heading}
            </h2>

            <div className="space-y-6 text-dim text-base leading-relaxed">
              <p>
                <span className="text-white font-medium">{ap.philosophy_p1_bold}</span>{" "}
                {ap.philosophy_p1_rest}
              </p>
              <p>
                <span className="text-white font-medium">{ap.philosophy_p2_bold}</span>{" "}
                {ap.philosophy_p2_rest}
              </p>
              <p>
                <span className="text-white font-medium">{ap.philosophy_p3_bold}</span>{" "}
                {ap.philosophy_p3_rest}
              </p>
            </div>
          </motion.div>
        </SectionWrapper>
      </section>

      {/* CLOSING CTA */}
      <FinalCTA dict={dict.final_cta} lang={lang} />
    </main>
  );
}
