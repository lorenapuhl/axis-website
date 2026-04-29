"use client"
// FeaturePageShell — shared layout template used by all 8 feature sub-pages.
//
// Structure:
//   1. Hero         (bg-black-axis) — category label, h1, subtitle, CTA button
//   2. Feature grid (bg-grey-axis)  — 2-column grid of included features
//   3. Visual       (bg-black-axis) — unique coded UI mockup passed via children prop
//   4. Quote        (bg-grey-axis)  — testimonial / social proof

// ReactNode is the TypeScript type for any valid React content — JSX, strings, null, etc.
import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useCTAModal } from "@/components/cta/CTAContext"

// FeatureBlock: shape of each item in the features grid.
interface FeatureBlock {
  name: string
  description: string
}

// Props this component accepts from each feature page.
interface FeaturePageShellProps {
  category:    string          // e.g. "GROW & EXPAND" — small label above the h1
  headline:    string          // the page h1 (one per page, SEO)
  subtitle:    string          // supporting body copy
  features:    FeatureBlock[]  // list of features shown in the 2-column grid
  quote:       string          // testimonial quote text
  quoteAuthor: string          // attribution line
  children:    ReactNode       // the unique coded visual (chart, dashboard, etc.)
}

// Stagger container — children animate in sequence, 0.12s apart.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

// Each child fades up from y: 20.
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

export default function FeaturePageShell({
  category,
  headline,
  subtitle,
  features,
  quote,
  quoteAuthor,
  children,
}: FeaturePageShellProps) {
  // openModal: opens the CTA booking funnel modal. Provided by CTAContext.
  const { openModal } = useCTAModal()

  // React Fragment (<>) wraps multiple sibling elements without adding a DOM node.
  return (
    <>
      {/* ── 1. HERO SECTION ──────────────────────────────────────────── */}
      <section className="bg-black-axis py-20 px-6 md:py-36 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Category label — contextualises where this feature sits in the platform */}
            <motion.p
              variants={item}
              className="font-instrument uppercase tracking-widest text-blue-axis text-xs"
            >
              {category}
            </motion.p>

            {/* h1 — the SEO page headline. Exactly one per page.
                max-w-3xl: keeps long headlines from spanning the full 72rem container. */}
            <motion.h1
              variants={item}
              className="font-playfair uppercase tracking-tight text-white-axis text-4xl md:text-6xl leading-none max-w-3xl"
            >
              {headline}
            </motion.h1>

            {/* Subtitle — supporting copy, instrument sans body style */}
            <motion.p
              variants={item}
              className="font-instrument text-soft-grey text-base max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* CTA button — opens the booking funnel modal */}
            <motion.div variants={item}>
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.35, ease: "easeOut" as const }}
                className="bg-white-axis text-black-axis text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4 mt-4"
              >
                Get your AXIS
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. FEATURE GRID SECTION ──────────────────────────────────── */}
      {/* bg-grey-axis (#121212) creates visual separation from the black hero above. */}
      <section className="bg-grey-axis py-20 px-6 md:py-36 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Section label — tells the user what this section contains */}
            <motion.p
              variants={item}
              className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-12"
            >
              What&apos;s included
            </motion.p>

            {/* 2-column grid on desktop, single column on mobile.
                gap-x-16: generous horizontal gutter between columns.
                gap-y-10: vertical spacing between rows. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {features.map((feature) => (
                // border-t: thin horizontal rule above each feature block — editorial separator.
                // pt-6: padding below the rule so headline doesn't sit on the line.
                <motion.div key={feature.name} variants={item} className="border-t border-white/10 pt-6">
                  {/* h3 — feature name. h1 is the page hero, h2 would be section headline.
                      h3 is correct for items within a section. */}
                  <h3 className="font-playfair uppercase tracking-tight text-white-axis text-xl">
                    {feature.name}
                  </h3>
                  {/* Feature description — body copy, muted, relaxed line height */}
                  <p className="font-instrument text-soft-grey text-sm mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. VISUAL SECTION ────────────────────────────────────────── */}
      {/* children is the unique coded UI (chart, dashboard, calendar, etc.)
          passed from each individual feature page. */}
      <section className="bg-black-axis py-20 px-6 md:py-36 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Label above the visual */}
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-10">
              See it in action
            </p>
            {/* Render the visual component passed in as a child */}
            {children}
          </motion.div>
        </div>
      </section>

      {/* ── 4. QUOTE SECTION ─────────────────────────────────────────── */}
      {/* bg-grey-axis again — alternates back for rhythm. */}
      <section className="bg-grey-axis py-20 px-6 md:py-36 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center max-w-2xl mx-auto"
          >
            {/* Quote — large, editorial, serif. No stars, no avatar. Premium. */}
            <p className="font-playfair uppercase tracking-tight text-white-axis text-2xl md:text-3xl leading-snug">
              &ldquo;{quote}&rdquo;
            </p>
            {/* Attribution — small, muted, wide tracking */}
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mt-8">
              {quoteAuthor}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
