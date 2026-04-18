"use client"
// "use client" needed: uses Framer Motion for scroll-triggered animations.

import { motion } from "framer-motion"
import SectionWrapper from "@/components/ui/SectionWrapper"
import type { Dict } from "@/lib/getDictionary"

interface SocialProofStripProps {
  dict: Dict["social_proof"];
}

export default function SocialProofStrip({ dict }: SocialProofStripProps) {
  return (
    <section className="py-20 px-6 md:py-36 md:px-12 border-y border-edge bg-canvas">
      <SectionWrapper>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {dict.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
              className="text-center md:border-r border-edge last:border-0 md:px-8"
            >
              <p className="text-white font-bold text-3xl md:text-4xl tracking-tight">
                {stat.value}
              </p>
              <p className="text-dim text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </section>
  )
}
