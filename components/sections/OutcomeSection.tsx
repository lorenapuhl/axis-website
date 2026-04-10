"use client"
// "use client" must be the FIRST line — Framer Motion uses browser APIs (IntersectionObserver
// for whileInView), so this file cannot run as a React Server Component.

import { motion } from "framer-motion"

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// Framer Motion "variants" are named animation states stored as an object.
// The parent container defines the stagger timing; each child inherits it.
// ─────────────────────────────────────────────────────────────────────────────

// Container variant — no visual animation itself, only controls child timing.
const container = {
  hidden: {},
  // hidden: the initial state. Nothing to set here because the visual
  // animation lives on each child (fadeItem), not the container.

  show: {
    transition: {
      staggerChildren: 0.18,
      // staggerChildren: delay (in seconds) between each child starting its animation.
      // 0.18s = each line waits 180ms after the previous one begins.
      // Slightly slower than the 0.12s default to give each statement room to land.
      // → 0.12 for a faster cascade. → 0.25 for a more dramatic, deliberate reveal.
    },
  },
}

// Item variant — the actual fade + rise applied to each line.
const fadeItem = {
  hidden: {
    opacity: 0,
    // opacity 0: each line starts fully invisible.

    y: 24,
    // y: vertical offset in pixels. 24 = each line starts 24px below its final position.
    // As the animation plays, it rises upward into place.
    // → 40 for a more dramatic travel. → 10 for a subtler lift. → 0 for pure fade.
  },
  show: {
    opacity: 1,   // Fully visible at rest.
    y: 0,         // Settled at its natural document position.
    transition: {
      duration: 0.7,
      // 0.7s is the brand default for "slow and confident" — per animate-section.md.
      // → 0.8s for the most languid, headline-weight feel.
      // → 0.5s if three lines in sequence feels too slow on mobile.

      ease: "easeOut" as const,
      // easeOut: the element decelerates as it arrives — feels like it floats into place.
      // → "easeInOut" for a more symmetrical acceleration curve.
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function OutcomeSection() {
  return (
    <section
      id="outcomes"
      // id="outcomes": anchor target — allows #outcomes deep-linking and
      // lets the nav header scroll directly to this section.

      className={[
        "bg-grey-axis",
        // bg-grey-axis: #121212 — slightly lighter than pure black.
        // Signals a tonal shift from the sections above and below without
        // introducing a bold colour break. Keeps the page feeling continuous.
        // → "bg-black-axis" to remove the tonal shift.

        "py-20 px-6",
        // Mobile-first padding: 80px vertical, 24px horizontal.
        // Keeps text away from the screen edge on small devices.

        "md:py-36 md:px-12",
        // Desktop padding: 144px vertical, 48px horizontal.
        // Generous whitespace makes the section feel editorial, not crowded.

        "text-center",
        // Centers all inline/inline-block content (text, motion elements)
        // within their containing block. Combined with mx-auto on the inner
        // wrapper, this makes everything appear centred on the page.
      ].join(" ")}
    >
      {/* ── INNER WRAPPER ────────────────────────────────────────────────── */}
      {/* max-w-6xl: standard brand content width = 1152px.
          mx-auto: centers the block horizontally within the section. */}
      <div className="max-w-6xl mx-auto">

        {/* ── THREE OUTCOME LINES ───────────────────────────────────────── */}
        {/* motion.div as the stagger container.
            initial="hidden" → whileInView="show" fires the container variant,
            which cascades through each child via staggerChildren. */}
        <motion.div
          variants={container}
          // variants connects this element to the container object defined above.

          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}

          className={[
            "flex flex-col",
            // Stacks the three lines vertically.

            "gap-6 md:gap-10",
            // gap-6: 24px between lines on mobile.
            // md:gap-10: 40px on desktop — generous spacing so each statement
            // reads as its own complete thought, not a bullet list.
            // → gap-4 / md:gap-6 to pack them tighter.
            // → gap-8 / md:gap-14 for more dramatic separation.
          ].join(" ")}
        >

          {/* LINE 1 — h2 per SEO rules: one section headline per section */}
          {/* h2 is the semantic section headline. It is styled visually at display
              scale so it carries equal weight with lines 2 and 3. */}
          <motion.h2
            variants={fadeItem}
            // variants={fadeItem}: this is the FIRST child, so it animates first.
            // The stagger delay (0.18s) means lines 2 and 3 start 180ms and 360ms later.

            className={[
              "font-playfair",
              // font-playfair: Playfair Display — the required brand serif for headlines.
              // Per component.md: "Headlines: font-playfair uppercase tracking-tight text-white-axis"

              "text-lg md:text-2xl",
              // text-3xl: 30px on mobile. md:text-5xl: 48px on desktop.
              // Large enough to feel like a headline, balanced across three lines.
              // → text-4xl / md:text-6xl if you want more visual dominance.
              // → text-2xl / md:text-4xl for a quieter, more editorial scale.

              "tracking-tight",
              // tracking-tight: slightly reduced letter-spacing. Combined with uppercase
              // Playfair, creates a dense, authoritative headline feel.

              "text-white-axis",
              // text-white-axis: full brightness — maximum contrast on grey-axis background.

              "leading-tight",
              // leading-tight: line-height ≈ 1.25×. Keeps any line wraps compact.
            ].join(" ")}
          >
            Your content becomes a system.
          </motion.h2>

          {/* LINE 2 */}
          <motion.p
            variants={fadeItem}
            // Second child — starts 0.18s after line 1 via staggerChildren.

            className={[
              "font-playfair",
              "text-lg md:text-2xl",
              "tracking-tight",
              "text-white-axis",
              "leading-tight",
              // Identical styling to line 1 — the three lines are parallel in
              // both meaning and visual weight. No hierarchy between them.
            ].join(" ")}
          >
            Your profile becomes a platform.
          </motion.p>

          {/* LINE 3 — punchline */}
          <motion.p
            variants={fadeItem}
            // Third child — starts 0.36s after line 1. Last in the sequence.
            // Arriving last gives it natural emphasis as the closing statement.

            className={[
              "font-playfair",
              "text-lg md:text-2xl",
              "text-white-axis",
              // text-blue-axis: Electric Blue (#0033FF) — the single accent colour
              // in this section. Applied only to the final, most consequential line:
              // "Your audience becomes clients" is the entire value proposition.
              // → text-white-axis to remove the accent and keep all three equal.
              // Rule: only ONE accent colour per section. Do not add uv or magenta here.
            ].join(" ")}
          >
            Your audience becomes clients.
          </motion.p>

        </motion.div>
      </div>
    </section>
  )
}
