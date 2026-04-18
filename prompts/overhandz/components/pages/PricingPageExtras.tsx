"use client"
// "use client" needed: uses Framer Motion for entrance animations.

import { motion } from "framer-motion"
import SectionWrapper from "@/components/ui/SectionWrapper"
import type { Dict } from "@/lib/getDictionary"

// ---------------------------------------------------------------------------
// PricingPageExtras — header and FAQ for the /pricing page
//
// Provides the page h1 (required — exactly one h1 per page) and
// a FAQ section to reduce friction / increase conversion.
// ---------------------------------------------------------------------------

interface PricingPageExtrasProps {
  dict: Dict["pricing_page"];
}

export default function PricingPageExtras({ dict }: PricingPageExtrasProps) {
  return (
    <>
      {/* PAGE HEADER */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-surface border-b border-edge">
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-2">
              {dict.eyebrow}
            </p>
            {/* h1 — exactly one per page */}
            <h1 className="text-white font-bold text-5xl md:text-7xl tracking-tight">
              {dict.heading}
            </h1>
            <p className="text-dim text-base mt-4 max-w-lg">
              {dict.subtext}
            </p>
          </motion.div>
        </SectionWrapper>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
        <SectionWrapper>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-10"
          >
            <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
              {dict.faq_heading}
            </h2>
          </motion.div>

          <div className="divide-y divide-edge">
            {dict.faqs.map((faq, index) => (
              <motion.div
                key={faq.q}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.06 }}
                className="py-6"
              >
                <p className="text-white font-medium mb-2">{faq.q}</p>
                <p className="text-dim text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>
    </>
  );
}
