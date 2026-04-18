"use client"
// "use client" is required: uses useCTAModal (context hook) and Framer Motion.

import { motion } from "framer-motion"
import { useCTAModal } from "@/components/cta/CTAContext"

// ─── COMPONENT ────────────────────────────────────────────────────────────────
// Final CTA section — closes the Overhandz case study page.
// Two actions:
//   1. "See the live site" — external link to the deployed Overhandz site.
//   2. "Get your AXIS"    — opens the main CTA modal (booking funnel).
// ─────────────────────────────────────────────────────────────────────────────
export default function PortfolioFinalCTASection() {
  // openModal() comes from CTAContext — triggers the booking funnel overlay.
  const { openModal } = useCTAModal()

  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-black-axis border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto">

        {/* ── Centred content block ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto"
        >

          {/* Eyebrow label */}
          <p className="font-instrument text-blue-axis text-xs uppercase tracking-widest mb-6">
            Your studio is next
          </p>

          {/* Main headline */}
          <h2 className="font-playfair text-white-axis uppercase tracking-tight text-4xl md:text-5xl mb-6">
            Does your studio run on DMs?
          </h2>

          {/* Supporting copy */}
          <p className="font-instrument text-soft-grey text-base leading-relaxed mb-12">
            We build this exact system for boxing gyms, Muay Thai clubs, CrossFit boxes,
            and boutique fitness studios. In 4 weeks, your clients book and pay online — automatically.
          </p>

          {/* ── CTA buttons ─────────────────────────────────────────────── */}
          {/*
            Layout:
            - Mobile:  buttons stacked. w-fit on the outer container makes it shrink to the
                       widest child ("See the live site" + px-9). w-full on both buttons then
                       stretches them to that same width — no guessing, always in sync.
            - Desktop: sm:w-auto releases the w-fit constraint; buttons sit side by side.
                       Sub-comments are anchored below "Get your AXIS" only.
          */}
          <div className="w-fit mx-auto sm:w-auto flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4">

            {/* CTA 1 — See the live site (external link, so <a> is correct here) */}
            <a
              href="https://overhandz-website.vercel.app/en"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-full sm:w-auto
                font-instrument text-xs font-semibold uppercase tracking-[0.2em]
                px-9 py-4 border border-white/20 text-white-axis text-center
                hover:border-white/40 transition-colors duration-300
                whitespace-nowrap
              "
            >
              See the live site
            </a>

            {/* CTA 2 — Get your AXIS + sub-comments as a unit below it */}
            <div className="w-full sm:w-auto flex flex-col items-center gap-3">
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full sm:w-auto bg-white-axis text-black-axis font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4 whitespace-nowrap"
              >
                Get your AXIS
              </motion.button>

              {/* Sub-comments anchored below "Get your AXIS" — small, muted */}
              <p className="font-instrument text-[11px] text-soft-grey/60 tracking-wide">
                Get started in less than 2 minutes
              </p>
              <p className="font-instrument text-[11px] text-soft-grey/60 tracking-wide -mt-1">
                No setup fees
              </p>
            </div>

          </div>

        </motion.div>
      </div>
    </section>
  )
}
