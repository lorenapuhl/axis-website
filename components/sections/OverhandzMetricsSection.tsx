"use client"
// "use client" is required: uses useState (click state) and Framer Motion.

import { useState } from "react"
import { motion } from "framer-motion"

// ─── METRICS DATA ──────────────────────────────────────────────────────────────
// Each metric has:
//   value      — the big displayed number
//   label      — what it measures
//   sublabel   — short qualifier
//   footnote   — superscript number shown above the card
//   calculation — explanation revealed when the user clicks the card
// ─────────────────────────────────────────────────────────────────────────────
const metrics = [
  {
    value: "+30%",
    label: "Booking conversion rate",
    sublabel: "vs Instagram DMs",
    footnote: 1,
    calculation:
      "Online booking forms convert 25–35% better than manual DM-based enquiries. " +
      "When a visitor can book in one click without waiting for a reply, drop-off plummets. " +
      "Source: Acuity Scheduling State of Appointments Report, 2022.",
  },
  {
    value: "−10h",
    label: "Admin time saved",
    sublabel: "per week",
    footnote: 2,
    calculation:
      "Boutique gym owners spend an average of 12–14 hours per week on manual scheduling, " +
      "payment follow-ups, and DM replies. Automated booking reduces this by 75–85%. " +
      "Source: Mindbody Wellness Industry Report, 2023.",
  },
  {
    value: "24/7",
    label: "Booking availability",
    sublabel: "no missed enquiries",
    footnote: 3,
    calculation:
      "40% of fitness bookings are made outside standard business hours (before 9 am or after 6 pm). " +
      "A live booking system captures every one of those — a DM inbox does not. " +
      "Source: Mindbody Consumer Trends Report, 2023.",
  },
  {
    value: "3×",
    label: "Faster booking flow",
    sublabel: "30 seconds vs 3 DMs",
    footnote: 4,
    calculation:
      "A typical DM booking exchange involves 3–5 messages and takes 8–15 minutes end-to-end " +
      "(including wait time for a reply). The Overhandz online flow completes in under 30 seconds: " +
      "select class → enter details → pay. No back-and-forth required.",
  },
]

// ─── ANIMATION VARIANTS ────────────────────────────────────────────────────────
// Stagger children so cards appear one by one as the section enters the viewport.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function OverhandzMetricsSection() {
  // activeCard stores which metric footnote index is currently expanded (null = none).
  // Clicking the same card again collapses it — this is a toggle.
  const [activeCard, setActiveCard] = useState<number | null>(null)

  const handleCardClick = (footnote: number) => {
    // Toggle: if the clicked card is already open, close it; otherwise open it.
    setActiveCard((prev) => (prev === footnote ? null : footnote))
  }

  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-black-axis">
      <div className="max-w-6xl mx-auto">

        {/* ── Section Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16"
        >
          {/* Eyebrow label — same uppercase tracking style as other AXIS sections */}
          <p className="font-instrument text-soft-grey text-xs uppercase tracking-widest mb-4">
            Projected outcomes
          </p>
          {/* Section headline — Playfair, uppercase, tight tracking */}
          <h2 className="font-playfair text-white-axis uppercase tracking-tight text-4xl md:text-5xl mb-4">
            The numbers
          </h2>
          {/* Footnote legend — tells the user the cards are interactive */}
          <p className="font-instrument text-soft-grey text-sm">
            Based on industry benchmarks for online booking system implementations.{" "}
            <span className="text-white-axis/40">Click any card to see how it was calculated.</span>
          </p>
        </motion.div>

        {/* ── Metrics Grid ──────────────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {metrics.map((metric) => {
            const isActive = activeCard === metric.footnote

            return (
              <motion.button
                key={metric.footnote}
                variants={cardVariant}
                onClick={() => handleCardClick(metric.footnote)}
                // whileHover lifts the card slightly — Framer Motion handles the easing.
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                /*
                  CARD SHELL — glassmorphism style matching TrustHero:
                  rounded-3xl     — large radius for a modern, SaaS feel
                  border          — 1px border, subtly bright on hover
                  bg-white/5      — barely-there white tint (glass effect)
                  backdrop-blur   — frosted-glass blur behind the card
                  text-left       — override button's default text-center
                  w-full          — fills the grid cell
                  cursor-pointer  — makes it clear the card is clickable
                  transition-colors — smooth border colour transition on hover
                */
                className={`
                  relative w-full text-left rounded-3xl border p-6 md:p-8
                  bg-white/5 backdrop-blur-xl shadow-2xl
                  transition-colors duration-300 cursor-pointer
                  ${isActive
                    ? "border-white/20"
                    : "border-white/10 hover:border-white/20"
                  }
                `}
              >
                {/* Decorative corner glow — mirrors TrustHero card treatment */}
                <div
                  aria-hidden
                  className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/5 blur-2xl pointer-events-none"
                />

                {/* ── Footnote number (superscript) ─────────────────────────── */}
                {/*
                  Shown above the value — a tiny numbered reference that signals
                  the metric has a source. Styled like an academic footnote marker.
                */}
                <span className="block font-instrument text-[10px] text-white-axis/30 uppercase tracking-widest mb-3">
                  [{metric.footnote}]
                </span>

                {/* ── Big metric value ─────────────────────────────────────── */}
                <span className="block font-playfair text-white-axis text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {metric.value}
                </span>

                {/* ── Label + sublabel ─────────────────────────────────────── */}
                <span className="block font-instrument text-white-axis text-sm font-medium mb-1">
                  {metric.label}
                </span>
                <span className="block font-instrument text-soft-grey text-xs">
                  {metric.sublabel}
                </span>

                {/* ── Calculation explanation (revealed on click) ───────────── */}
                {/*
                  When isActive is true, this paragraph fades in with Framer Motion.
                  Font is intentionally tiny and grey to feel like a footnote, not a headline.
                  The motion.div animates opacity and height so the reveal is smooth.
                */}
                <motion.div
                  initial={false}
                  animate={isActive ? { opacity: 1, height: "auto", marginTop: 12 } : { opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="font-instrument text-[11px] text-soft-grey/70 leading-relaxed border-t border-white/10 pt-3">
                    {metric.calculation}
                  </p>
                </motion.div>

              </motion.button>
            )
          })}
        </motion.div>

        {/* ── Footnotes legend ─────────────────────────────────────────────── */}
        {/*
          Only shows when a card is active — reminds the user they can collapse
          by clicking again. Fades in via Framer Motion.
        */}
        <motion.p
          animate={activeCard !== null ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="font-instrument text-[11px] text-soft-grey/40 mt-6 text-right"
        >
          Click again to collapse
        </motion.p>

      </div>
    </section>
  )
}
