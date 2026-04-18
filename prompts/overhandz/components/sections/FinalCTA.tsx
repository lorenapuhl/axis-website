"use client"
// "use client" needed: uses Framer Motion for scroll animations.

import { motion } from "framer-motion"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Button from "@/components/ui/Button"
import type { Dict, Lang } from "@/lib/getDictionary"

interface FinalCTAProps {
  dict: Dict["final_cta"];
  lang: Lang;
}

export default function FinalCTA({ dict, lang }: FinalCTAProps) {
  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-surface border-t border-edge">
      <SectionWrapper>
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-white font-bold text-4xl md:text-6xl tracking-tight mb-4">
            {dict.heading}
          </h2>
          <p className="text-dim text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            {dict.subtext}
          </p>

          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <Button href={`/${lang}/schedule`} variant="primary">
              {dict.cta_primary}
            </Button>
            <Button href={`/${lang}/pricing`} variant="secondary">
              {dict.cta_secondary}
            </Button>
          </div>

          <p className="text-dim text-sm mt-8">{dict.location}</p>
        </motion.div>
      </SectionWrapper>
    </section>
  )
}
