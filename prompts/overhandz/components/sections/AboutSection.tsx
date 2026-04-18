"use client"
// "use client" needed: uses Framer Motion for scroll animations.

import { motion } from "framer-motion"
import Image from "next/image"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Button from "@/components/ui/Button"
import type { Dict, Lang } from "@/lib/getDictionary"

interface AboutSectionProps {
  dict: Dict["about_section"];
  lang: Lang;
}

export default function AboutSection({ dict, lang }: AboutSectionProps) {
  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
      <SectionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* LEFT — text content */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-3">
              {dict.eyebrow}
            </p>
            <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight mb-6">
              {dict.h2_line1}
              <br />
              {dict.h2_line2}
            </h2>
            <p className="text-dim text-base leading-relaxed mb-4">{dict.p1}</p>
            <p className="text-dim text-base leading-relaxed mb-4">{dict.p2}</p>
            <p className="text-dim text-base leading-relaxed mb-8">{dict.p3}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button href={`/${lang}/about`} variant="primary">
                {dict.cta_primary}
              </Button>
              <Button href={`/${lang}/contact`} variant="secondary">
                {dict.cta_secondary}
              </Button>
            </div>
          </motion.div>

          {/* RIGHT — image */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="relative aspect-square rounded-2xl overflow-hidden"
          >
            <Image
              src="/images/ui/about-cropped.png"
              alt="Coach training a student at Overhandz Boxing Club in Ivry-sur-Seine, Paris"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </SectionWrapper>
    </section>
  )
}
