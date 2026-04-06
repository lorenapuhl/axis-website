"use client"
// "use client" must be the absolute first line.
// This component uses Framer Motion browser APIs — requires a Client Component
// in Next.js App Router. Server Components cannot run browser-side JS.

import Image from "next/image"
// motion — wraps standard HTML/SVG elements to make them animatable via Framer Motion
import { motion } from "framer-motion"
// Variants: TypeScript type for named animation state objects (e.g. "hidden" / "show").
// Without it, TypeScript widens literal strings like "easeOut" to `string`,
// which breaks Framer Motion's Easing union type.
import type { Variants } from "framer-motion"
// ReactNode: TypeScript type for anything renderable in JSX —
// strings, elements, arrays, fragments, etc.
import type { ReactNode } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

// Stat: one cell in the 2-column stats grid beneath the portrait.
// desc uses ReactNode so we can embed <strong> highlights inline.
type Stat = {
  num: string     // large credential or number, e.g. "M.Sc." or "5+"
  desc: ReactNode // description — may contain <strong> for keyword emphasis
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: stats + pills
// ─────────────────────────────────────────────────────────────────────────────

// Stats displayed in the 2-column grid beneath the portrait.
// The original HTML used a bold() notation — translated here to <strong>.
// text-white-axis: lifts highlighted keywords off the soft-grey body text.
const stats: Stat[] = [
  {
    num: "M.Sc.",
    desc: (
      <>
        <strong className="text-white-axis font-medium">Statistical Physics</strong>, Heidelberg (DE)
      </>
    ),
  },
  {
    num: "5+",
    desc: (
      <>
        Years of engineering{" "}
        <strong className="text-white-axis font-medium">data systems</strong>
      </>
    ),
  },
  {
    num: "5",
    desc: (
      <>
        <strong className="text-white-axis font-medium">Languages</strong> (DE, FR, EN, ES, NL)
      </>
    ),
  },
  {
    num: "6",
    desc: (
      <>
        <strong className="text-white-axis font-medium">Countries</strong> (DE, BEL, FR, HK, ES, MX)
      </>
    ),
  },
  {
    num: "6",
    desc: (
      <>
        <strong className="text-white-axis font-medium">Sports</strong> (Karate, Tennis, Swimming,
        Yoga, Dancing, Boxing)
      </>
    ),
  },
  {
    num: "100%",
    desc: (
      <strong className="text-white-axis font-medium">Automation-oriented</strong>
    ),
  },
]

// Skill/context pills shown in a flex-wrap row at the bottom of the right column.
const pills: string[] = [
  "Next.js Development",
  "Machine Learning Architecture",
  "Data Science and Statistics",
  "Business Automation",
  "UI/UX for SaaS",
  "Brussels / Mexico City",
]

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// Per animate-section.md: 0.7s default, ease "easeOut", stagger 0.12s.
// ─────────────────────────────────────────────────────────────────────────────

// containerVariants: applied to the parent wrapper.
// No visual change on the parent — its only job is to stagger its children.
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

// itemVariants: each staggered child fades in and rises 20px from below.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutmeSection() {
  return (
    // bg-black-axis: primary surface (#000000)
    // Mobile-first padding: py-20 px-6 | Desktop override: md:py-36 md:px-12
    <section className="bg-black-axis py-20 px-6 md:py-36 md:px-12">
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION LABEL ──────────────────────────────────────────────────── */}
        {/* Wraps the label in a fade-up so it enters before the grid below. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          // mb-10: breathing room between the label and the two-column grid
          className="mb-10"
        >
          {/* Label row: text + decorative short line.
              The <span> replicates the ::after pseudo-element from the HTML template —
              a short horizontal stroke that visually anchors the label. */}
          <div className="flex items-center gap-3">
            {/* font-instrument uppercase tracking-[0.14em]: AXIS subheading style */}
            <span className="font-instrument text-[11px] uppercase tracking-[0.14em] text-blue-axis font-medium">
              Founding Story
            </span>
            {/* Decorative line — visual punctuation after the label.
                aria-hidden: invisible to screen readers, purely decorative. */}
            <span className="block w-8 h-px bg-blue-axis opacity-50" aria-hidden="true" />
          </div>
        </motion.div>

        {/* ── TWO-COLUMN GRID ────────────────────────────────────────────────── */}
        {/* Mobile: single column stacked | Desktop: left 1fr, right 1.4fr
            The fractional columns match the HTML template's grid proportions.
            items-start: columns align to their top edges, not stretched. */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-14 items-start">

          {/* ── LEFT COLUMN: PORTRAIT + STATS ────────────────────────────────── */}
          {/* Left column fades in slightly after the label (delay 0.1s). */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
          >

            {/* PORTRAIT FRAME
                relative: required so the overlay tag can use absolute positioning.
                aspect-[3/4]: portrait crop ratio — taller than wide.
                overflow-hidden: clips the image and any absolute children to this box.
                border border-white-axis/[0.08]: very subtle frame at 8% white opacity. */}
            <div className="relative w-100 aspect-square overflow-hidden border border-white-axis/[0.08] rounded-xl mb-5">

              {/* next/image with fill prop: stretches to fill the relative parent.
                  object-cover: scales and crops the photo to cover the container
                  without distortion — same as CSS background-size: cover.
                  Priority: loads eagerly since it's visible near the top of the page. */}
              <Image
                src="/profile.png"
                alt="Lorena Puhl, Physicist and Tech Founder, creator of AXIS"
                fill
                className="object-cover object-top"
                priority
              />

              {/* PORTRAIT OVERLAY TAG
                  Pinned to the bottom-left corner of the portrait frame.
                  bg-grey-axis/90: semi-transparent dark surface (#121212 at 90% opacity)
                  so the name remains readable against any photo background.
                  backdrop-blur-sm: soft blur blends the tag with the photo beneath. */}
              <div className="absolute bottom-4 left-4 bg-grey-axis/90 backdrop-blur-sm border border-white-axis/[0.08] rounded-sm px-3 py-2">
                <p className="font-instrument text-[13px] font-medium text-white-axis mb-[3px] leading-none">
                  Lorena Puhl
                </p>
                <p className="font-instrument text-[11px] text-soft-grey leading-none">
                  Physicist &amp; Tech Founder
                </p>
              </div>

            </div>
            {/* END PORTRAIT FRAME */}

            {/* STATS GRID
                Stagger animation: each stat card enters 0.12s after the previous one.
                containerVariants + itemVariants — see variants defined above.
                whileInView: animation triggers when the grid scrolls into view.
                viewport once: true — plays only once, not on every scroll pass. */}
            <motion.div
              className="grid grid-cols-2 gap-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                // Each stat is a stagger child via itemVariants.
                // bg-white-axis/[0.04]: near-invisible white tint lifts the card off black.
                // border border-white-axis/[0.08]: structural border, not decorative —
                // defines the card boundary against the dark background.
                // whileHover y: -2px + scale 1.02: subtle lift on hover, slow and confident.
                // The element-level transition governs whileHover; the stagger enter
                // animation uses itemVariants' own transition (duration: 0.7) instead.
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="bg-white-axis/[0.04] border border-white-axis/[0.08] rounded-sm px-4 py-3 cursor-default"
                >
                  {/* Stat number — Playfair Display, magenta accent */}
                  <div className="font-playfair text-xl text-white-axis leading-none mb-1">
                    {stat.num}
                  </div>
                  {/* Stat description — soft-grey base, bold keywords in white */}
                  <div className="font-instrument text-[11px] text-soft-grey leading-snug">
                    {stat.desc}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {/* END STATS GRID */}

          </motion.div>
          {/* END LEFT COLUMN */}

          {/* ── RIGHT COLUMN: COPY + CTA ──────────────────────────────────────── */}
          {/* Enters 0.1s after the left column (delay 0.2s total) for a wave effect. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >

            {/* SECTION HEADLINE
                h2: one per section, per SEO rules (the h1 lives in the Hero).
                font-playfair uppercase tracking-tight: AXIS headline convention.
                <em>: the italicised phrase uses UV accent to mark the key message.
                Playfair italic + uppercase creates a deliberate typographic contrast. */}
            <h2 className="font-playfair uppercase tracking-tight text-white-axis text-3xl md:text-4xl leading-tight mb-7">
              Built by a scientist,{" "} <br />
              <em className="text-blue-axis">designed for the studio floor.</em>
            </h2>

            {/* BODY PARAGRAPHS
                font-instrument text-soft-grey: AXIS body text convention.
                leading-relaxed: generous line-height keeps long paragraphs readable.
                <strong>: white highlight lifts key phrases — used sparingly. */}
            <p className="font-instrument text-soft-grey text-[15px] leading-relaxed mb-5">
              I spent years as a Data Scientist and Physicist, building complex Machine Learning
              (ML) models, conducting research, and working for private businesses and embassies.
              But I noticed a pattern in my own neighborhood: my favorite dancing, boxing, and
              karate studios were being held back by their own success.
            </p>

            <p className="font-instrument text-soft-grey text-[15px] leading-relaxed mb-5">
              <strong className="text-white-axis font-medium">
                They were crushing it on Instagram, but drowning in DMs. They had incredible
                classes, but no presence on Google.
              </strong>{" "}
              I realized that the tech used for big startups was too complex for local studios, and
              the simple tools were too clunky. So, I built <em>Axis</em>.
            </p>

            {/* QUOTE BLOCK
                border-l-2 border-blue-axis: 2px left border in UV — structural accent
                that anchors the quote visually and signals its importance.
                pl-5 py-1: padding so the text doesn't touch the border.
                my-8: generous vertical spacing separates this from surrounding text. */}
            <blockquote className="border-l-2 border-blue-axis pl-5 py-1 my-8">
              <p className="font-playfair italic text-white-axis text-lg leading-relaxed">
                "I take the same rigor used in ML research and apply it to one goal: making your
                studio grow while you sleep."
              </p>
            </blockquote>

            <p className="font-instrument text-soft-grey text-[15px] leading-relaxed mb-5">
              <em>Axis</em> isn't just another website builder. It's an automated growth engine.
              It takes the content you're already creating on Instagram and transforms it into a
              high-converting, professional booking platform. No manual updates. No coding. No
              technical debt.
            </p>

            <p className="font-instrument text-soft-grey text-[15px] leading-relaxed">
              I've spent my career engineering systems that work; now, I'm building them so you
              can stop managing your DMs and start scaling your community.
            </p>

            {/* DIVIDER
                A thin horizontal line separating the body copy from the skills pills below.
                bg-white-axis/[0.08]: matches the subtle border tone used on cards.
                aria-hidden: decorative, not meaningful to screen readers. */}
            <div className="w-10 h-px bg-white-axis/[0.08] my-8" aria-hidden="true" />

            {/* SKILLS PILLS
                Stagger: each pill enters 0.12s after the previous — same pattern as stats.
                flex-wrap: pills reflow onto multiple rows on narrow screens. */}
            <motion.div
              className="flex flex-wrap gap-2 mb-9"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {pills.map((pill, index) => (
                // motion.span as a stagger child — each pill is a small text label.
                // border border-white-axis/10: 10% white border gives the pill shape.
                // rounded-full: pill silhouette matching the HTML template.
                // whileHover scale 1.05: gentle grow on hover, slow and confident.
                <motion.span
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="font-instrument text-[12px] text-white-axis border border-white-axis/10 rounded-full px-[14px] py-[6px] tracking-[0.02em] cursor-default"
                >
                  {pill}
                </motion.span>
              ))}
            </motion.div>
            {/* END SKILLS PILLS */}

            {/* CTA ROW
                flex items-center gap-5: button and link sit on the same baseline. */}
            <div className="flex items-center gap-5">

              {/* PRIMARY CTA BUTTON
                  bg-blue-axis: UV accent as background, per user spec.
                  text-white-axis: white text readable on the dark UV surface.
                  whileHover scale 1.03: slow, confident hover (0.35s easeOut) —
                  matches the AXIS primary button hover pattern. */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-blue-axis text-white-axis font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
              >
                Let&apos;s get in touch
              </motion.button>

              {/* LINKEDIN LINK
                  External URL — <a href> is allowed here per component.md rules.
                  ("never <a> styled as a button unless navigating to an external URL"
                  — this is a text link, not styled as a button.)
                  border-b: underline-style stroke signals clickability without bold weight.
                  rel="noopener noreferrer": security best practice for target="_blank". */}
              <a
                href="https://linkedin.com/in/lorena-puhl"
                target="_blank"
                rel="noopener noreferrer"
                className="font-instrument text-[13px] text-soft-grey border-b border-soft-grey/40 pb-px"
              >
                LinkedIn ↗
              </a>

            </div>
            {/* END CTA ROW */}

          </motion.div>
          {/* END RIGHT COLUMN */}

        </div>
        {/* END TWO-COLUMN GRID */}

      </div>
    </section>
  )
}
