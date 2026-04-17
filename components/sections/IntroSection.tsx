"use client"
import { motion } from "framer-motion"

import { SiInstagram } from "@icons-pack/react-simple-icons"
// SiInstagram: Instagram logo from Simple Icons, already in the project.

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function IntroSection() {
  return (
    <section
      id="intro"
      className="bg-black-axis py-70 px-6 md:py-50 md:px-12"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-26 md:gap-70">

        {/* ── TOP BLOCK: scroll sequence ────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-10 md:gap-14">

          {/* ── OPENING LINE ──────────────────────────────────────────────── */}
          {/*
            "You have attention." — the section headline (h2).
            Opening premise — the thing the reader already knows.
            Fades and rises in as the section enters the viewport.
          */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-3 font-playfair text-xl md:text-4xl text-soft-grey tracking-wider leading-tight"
          >
            {/* Instagram logo sits above the headline text */}
            <SiInstagram className="text-soft-grey" size={28} />
            You have attention.
          </motion.h2>

          {/* ── WORD BUILD: "People watch. Like. Follow." ─────────────────── */}
          {/*
            Three words on the same horizontal line (flex-row flex-wrap).
            Each word slides in from x:-100 with a physics-based spring.

            Spring transition:
            - type: "spring" → physics-based, not a eased curve.
            - stiffness: 80  → how hard the spring pulls toward the target.
                               Higher = faster arrival. Lower = more floaty.
            - damping: 20    → how quickly the oscillation dies out.
                               Lower = more bounce. Higher = no bounce.
            - delay: staggered 0.3s per word → each word pushes in after the last.

            No overflow-hidden on the wrappers — the clip effect was hiding
            words that wrapped onto new lines on smaller screens.
          */}
          <div className=" flex flex-row flex-wrap gap-x-4 md:gap-x-6 gap-y-2 items-baseline justify-center">

            {/* WORD 1 */}
            <motion.span
              className="font-playfair text-xl md:text-4xl text-soft-grey tracking-wider"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
              // delay: 0.3s — lets the opening h2 finish fading in first.
              viewport={{ once: true }}
            >
              People watch.
            </motion.span>

            {/* WORD 2 — 0.3s after word 1 */}
            <motion.span
              className="font-playfair text-xl md:text-4xl text-soft-grey tracking-wider"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Like.
            </motion.span>

            {/* WORD 3 — 0.3s after word 2 */}
            <motion.span
              className="font-playfair text-xl md:text-4xl text-soft-grey tracking-wide tracking-wider"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.9 }}
              viewport={{ once: true }}
            >
              Follow.
            </motion.span>
          </div>

          {/* ── "BUT THEY DON'T BOOK." — WEIGHTLESS DISSOLVE ─────────────── */}
          {/*
            This element plays a three-phase keyframe sequence (all time-based,
            no scroll dependency):

            Phase 1 — APPEAR  (0% → 20% of 7s = 0–1.4s):
              opacity 0 → 1, blur stays at 0px, scale stays at 1.
              The text arrives clearly and sharply.

            Phase 2 — HOLD    (20% → 45% of 7s = 1.4–3.15s):
              Everything stays at full opacity, 0 blur, scale 1.
              A beat of silence — the message lands.

            Phase 3 — EVAPORATE (45% → 100% of 7s = 3.15–7s = 3.85s long):
              opacity 1 → 0, blur 0px → 12px, scale 1 → 1.15.
              The ink evaporates into the black background.
              Duration of evaporation ≈ 3.85s (well above the 2.5s minimum).

            delay: 1.5s — fires 1.5s after the section enters view,
            so the three spring words have time to land first.

            Framer Motion keyframes: pass an array to any animated property.
            The `times` array controls WHERE in the 0→1 timeline each keyframe sits.
            times: [0, 0.2, 0.45, 1] maps to the four keyframe values above.
          */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{
              // Phase 1 (0→0.2 of 4s = 0–0.8s): fades in sharply.
              // Phase 2 (0.2→0.45 of 4s = 0.8–1.8s): holds fully visible.
              // Phase 3 (0.45→1 of 4s = 1.8–4s): stays fully visible — does NOT disappear.
              opacity: [0, 1, 1, 1],
            }}
            transition={{
              duration: 4,
              times: [0, 0.2, 0.45, 1],
              ease: "easeOut" as const,
              delay: 1.5,
              // delay: 1.5s after section enters view — gives the spring words
              // time to settle before this line arrives.
            }}
            viewport={{ once: true }}
            className="font-playfair font-thin text-xl md:text-4xl tracking-tight text-white-axis leading-tight tracking-wider"
          >
            But they don't book.
          </motion.p>

        </div>

      </div>
    </section>
  )
}
