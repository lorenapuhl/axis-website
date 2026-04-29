"use client"
// FeaturePageShell — shared layout template used by all 8 feature sub-pages.
//
// Structure:
//   1. Hero         (bg-black-axis) — centered category label, h1, subtitle. NO CTA.
//   2. Row A        (bg-grey-axis)  — features 1–3 LEFT + visual RIGHT
//   3. Row B        (bg-black-axis) — visual LEFT + features 4–6 RIGHT (reversed)
//   4. Quote        (bg-black-axis) — OverhandzTestimonialSection-style blockquote
// (FinalCTA and FooterSection are rendered by each page file, not here.)

// ReactNode is the TypeScript type for any valid React content — JSX, strings, null, etc.
import type { ReactNode } from "react"
import { motion } from "framer-motion"

// FeatureBlock: shape of each item in the features list.
interface FeatureBlock {
  name: string
  description: string
}

// Props this component accepts from each feature page.
interface FeaturePageShellProps {
  category:    string          // e.g. "GROW & EXPAND" — small label above the h1
  headline:    string          // the page h1 (one per page, SEO)
  subtitle:    string          // supporting body copy
  features:    FeatureBlock[]  // list of features (expect 6, split 3+3 across the two rows)
  quote:       string          // testimonial quote text
  quoteAuthor: string          // attribution line
  children:    ReactNode       // the unique coded UI visual (chart, dashboard, calendar, etc.)
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

// FeatureTextBlock renders one feature name + description.
// Used inside both Row A and Row B.
function FeatureTextBlock({ feature, dark }: { feature: FeatureBlock; dark: boolean }) {
  return (
    // border-t: thin horizontal rule above each block — editorial separator.
    // pt-6: padding below the rule.
    <motion.div variants={item} className="border-t border-white/10 pt-6">
      {/* h3 — feature name. h1 is the page hero, h2 would be section headline.
          h3 is correct for items within a section. */}
      <h3 className={`font-playfair uppercase tracking-tight text-xl ${dark ? "text-white-axis" : "text-white-axis"}`}>
        {feature.name}
      </h3>
      <p className="font-instrument text-soft-grey text-sm mt-3 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  )
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
  // Split features into two halves: first 3 go in Row A (left), last 3 in Row B (right).
  // If fewer than 6 features, slice handles it gracefully.
  const firstHalf  = features.slice(0, 3)
  const secondHalf = features.slice(3)

  return (
    <>
      {/* ── 1. HERO SECTION ──────────────────────────────────────────────── */}
      {/* text-center + items-center: everything centred, no CTA button. */}
      <section className="bg-black-axis py-20 px-6 md:py-36 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center gap-6"
          >
            {/* Category label — small, electric blue, all-caps, very wide tracking. */}
            <motion.p
              variants={item}
              className="font-instrument uppercase tracking-widest text-blue-axis text-xs"
            >
              {category}
            </motion.p>

            {/* h1 — the SEO page headline. Exactly one per page.
                Centred; max-w-3xl prevents very long headlines from spanning the full width. */}
            <motion.h1
              variants={item}
              className="font-playfair uppercase tracking-tight text-white-axis text-4xl md:text-6xl leading-none max-w-3xl"
            >
              {headline}
            </motion.h1>

            {/* Subtitle — instrument sans body copy, muted grey, capped width for readability */}
            <motion.p
              variants={item}
              className="font-instrument text-soft-grey text-base max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* NO CTA button here — only one CTA at the very bottom of the page (FinalCTA). */}
          </motion.div>
        </div>
      </section>

      {/* ── 2. ROW A — features 1–3 LEFT, visual RIGHT ───────────────────── */}
      {/* bg-grey-axis (#121212) creates visual separation from the black hero. */}
      <section className="bg-grey-axis py-20 px-6 md:py-36 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Two-column grid on desktop; single column stacked on mobile.
              gap-16: generous gutter between text and visual.
              items-center: vertically centres the two columns relative to each other. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

            {/* LEFT column — first 3 feature text blocks */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col gap-8"
            >
              {firstHalf.map((feature) => (
                <FeatureTextBlock key={feature.name} feature={feature} dark={false} />
              ))}
            </motion.div>

            {/* RIGHT column — the coded UI visual (chart, calendar, dashboard, etc.)
                On mobile this appears below the features (natural DOM order). */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              {children}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 3. ROW B — visual LEFT, features 4–6 RIGHT ───────────────────── */}
      {/* bg-black-axis alternates back for visual rhythm. */}
      {/* Only rendered if there are more than 3 features. */}
      {secondHalf.length > 0 && (
        <section className="bg-black-axis py-20 px-6 md:py-36 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

              {/* Visual LEFT (desktop) — order-2 on mobile so features read first.
                  md:order-1 restores left position on desktop. */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true }}
                className="order-2 md:order-1"
              >
                {children}
              </motion.div>

              {/* Features RIGHT (desktop) — order-1 on mobile so they appear first. */}
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-col gap-8 order-1 md:order-2"
              >
                {secondHalf.map((feature) => (
                  <FeatureTextBlock key={feature.name} feature={feature} dark={true} />
                ))}
              </motion.div>

            </div>
          </div>
        </section>
      )}

      {/* ── 4. QUOTE SECTION ─────────────────────────────────────────────── */}
      {/* Styled after OverhandzTestimonialSection:
          - No card, no stars, no avatar, no logo
          - Large italic opening quote mark in text-blue-axis, anchored top-left of the text block
          - Italic instrument body text
          - Attribution in small uppercase tracking-widest */}
      <section className="bg-black-axis py-20 px-6 md:py-36 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-[720px]"
          >
            <div className="text-center">
              {/* relative + text-left on the blockquote so the quote mark can be pinned
                  to the top-left corner of the text block, not the page edge. */}
              <blockquote className="relative mx-auto max-w-[640px] text-left">
                {/* Opening quote mark — huge, italic Playfair in brand blue.
                    absolute + -top-10 -left-1 anchors it above-left of the first line.
                    aria-hidden removes it from screen readers (purely decorative). */}
                <span
                  aria-hidden
                  className="absolute -top-10 -left-1 md:-left-10 font-playfair italic text-[80px] md:text-[100px] leading-none text-blue-axis select-none"
                >
                  &ldquo;
                </span>
                {/* Quote body — italic, instrument sans, large, left-aligned on desktop */}
                <p className="font-instrument italic text-white-axis text-lg md:text-xl leading-relaxed text-center md:text-left pt-8 md:pt-10">
                  {quote}
                </p>
              </blockquote>

              {/* Attribution — small, muted, wide tracking. No logo, no stars. */}
              <div className="mt-8 flex flex-col items-center">
                <p className="font-instrument text-sm uppercase tracking-widest text-gray-400">
                  {quoteAuthor}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
