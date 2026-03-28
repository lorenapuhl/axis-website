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
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12"
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
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-3 font-playfair text-3xl md:text-4xl text-soft-grey tracking-tight leading-tight"
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
              className="font-playfair text-3xl md:text-4xl text-soft-grey tracking-wide"
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
              className="font-playfair text-3xl md:text-4xl text-soft-grey tracking-wide"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Like.
            </motion.span>

            {/* WORD 3 — 0.3s after word 2 */}
            <motion.span
              className="font-playfair text-3xl md:text-4xl text-soft-grey tracking-wide"
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
            initial={{ opacity: 0, filter: "blur(0px)", scale: 1 }}
            whileInView={{
              opacity: [0,          1,          1,          0         ],
              filter:  ["blur(0px)","blur(0px)","blur(0px)","blur(12px)"],
              scale:   [1,          1,          1,          1.15      ],
            }}
            transition={{
              duration: 7,
              // 7s total — the evaporation phase alone is ~3.85s (> 2.5s requirement).
              // Feels slow and ethereal, not snappy.

              times: [0, 0.2, 0.45, 1],
              // times: maps each keyframe value to a position in the 0→1 timeline.
              // 0    → opacity 0  (invisible on entry)
              // 0.2  → opacity 1  (fully appeared)
              // 0.45 → opacity 1  (still fully visible — the "beat of silence")
              // 1    → opacity 0  (fully evaporated)

              ease: "easeOut",
              delay: 1.5,
              // delay: 1.5s after section enters view — gives the spring words
              // time to settle before the tragedy drops.
            }}
            viewport={{ once: true }}
            className="font-playfair font-thin text-5xl md:text-4xl tracking-tight text-white-axis leading-tight"
          >
            But they don't book.
          </motion.p>

        </div>

        {/* ── DIAGNOSTIC BLOCK ──────────────────────────────────────────────── */}
        {/*
          Plain div — no animation on the container itself.
          The section is right-aligned and sits on a dark grey surface
          to signal a tonal shift: from observation to diagnosis.
        */}
        <div
          className={[
            "flex flex-col",
            // Stacks all lines vertically.

            "gap-4 md:gap-6",
            // Consistent line spacing throughout.

            "items-end",
            // items-end: aligns each child to the RIGHT edge of the container.

            "text-right",
            // text-right: aligns text content to the right inside each element.

            "bg-grey-axis",
            // bg-grey-axis: background = #121212 (near-black grey).
            // Slightly darker than the page's #000000 — a subtle surface shift.

            "py-10 px-6",
            // 40px vertical / 24px horizontal padding on mobile.

            "md:py-16 md:px-12",
            // 64px vertical / 48px horizontal padding on desktop.
          ].join(" ")}
        >

          {/* ── PHASE 1: "Your studio has visibility." + underline draw ───────────── */}
          {/*
            Soft entrance — ease-out fade, 0.8s duration, fires immediately (delay: 0).
            Represents the "status quo" the studio owner is proud of.
            Stays fully visible as the hammering sequence builds below it.

            The wrapper div uses w-fit so it shrinks to the exact text width.
            This ensures the underline spans from under "Y" in "Your studio" to
            the end of "visibility." — not the full container width.
          */}
          <div className="w-fit">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              // amount: 0.5 → animation fires only when 50% of the section is
              // in the viewport, ensuring the user is focused on this content.
              transition={{ duration: 0.8, ease: "easeOut", delay: 0 }}
              className="font-playfair text-4xl md:text-3xl tracking-tight text-soft-grey leading-tight"
            >
              Your studio has visibility.
            </motion.h3>

            {/*
              Underline: draws left-to-right starting from under "Y" in "Your studio".
              scaleX: 0 → 1 scales the element horizontally.
              origin-left: anchors the scale transform to the left edge,
                           so it draws rightward (not from the center outward).
              delay: 0.85s — starts just after the h3 finishes fading in (0.8s).
              duration: 0.6s — finishes at ~1.45s, giving the eye time to read the line.
            */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.85 }}
              className="h-px bg-soft-grey w-full mt-2 origin-left"
            />
          </div>

          {/* ── PHASE 2: The Staggered "No" Sequence ─────────────────────────── */}
          {/*
            Four lines. Each is split into two parts to create a "double-beat":
              Part A ("The Snap")   — the "No" / "But no" prefix.
              Part B ("The Suffix") — the reason, 100ms after Part A.

            Each motion.div wraps one full line and handles the vertical entrance
            (y: 10 → 0 spring). The nested motion.spans control opacity, creating
            the internal 100ms offset between prefix and suffix.

            Spring: stiffness 400, damping 30.
            - High stiffness → fast, mechanical snap (not a float).
            - Damping 30    → minimal oscillation; arrives and stops cleanly.

            Absolute delays (from viewport entry):
              Line 1 → 1.5s  (after underline finishes drawing at ~1.45s)
              Line 2 → 2.0s
              Line 3 → 2.5s
              Line 4 → 3.0s

            Part B is always 100ms (0.1s) after Part A of the same line.
          */}

          {/* LINE 1: "But no" + "structure." — starts at 2.0s */}
          <motion.div
            initial={{ y: 10 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, delay: 2.0 }}
            // This div moves the whole line upward into place at 2.0s.
            className="flex flex-row gap-x-2 items-baseline justify-end flex-wrap"
          >
            {/* Part A — snaps in at 2.0s */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 2.0 }}
              className="font-instrument text-4xl md:text-3xl tracking-tight text-white-axis leading-tight"
            >
              But no
            </motion.span>
            {/* Part B — snaps in 100ms after Part A */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 2.1 }}
              className="font-playfair text-xl md:text-3xl text-soft-grey tracking-wide"
            >
              structure.
            </motion.span>
          </motion.div>

          {/* LINE 2: "No" + "clear offer." — starts at 2.5s */}
          <motion.div
            initial={{ y: 10 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, delay: 2.5 }}
            className="flex flex-row gap-x-2 items-baseline justify-end flex-wrap"
          >
            {/* Part A — snaps in at 2.5s */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 2.5 }}
              className="font-instrument text-4xl md:text-3xl tracking-tight text-white-axis leading-tight"
            >
              No
            </motion.span>
            {/* Part B — snaps in 100ms after Part A */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 2.6 }}
              className="font-playfair text-xl md:text-3xl text-soft-grey tracking-wide"
            >
              clear offer.
            </motion.span>
          </motion.div>

          {/* LINE 3: "No" + "way to buy." — starts at 3.0s */}
          <motion.div
            initial={{ y: 10 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, delay: 3.0 }}
            className="flex flex-row gap-x-2 items-baseline justify-end flex-wrap"
          >
            {/* Part A — snaps in at 3.0s */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 3.0 }}
              className="font-instrument text-4xl md:text-3xl tracking-tight text-white-axis leading-tight"
            >
              No
            </motion.span>
            {/* Part B — snaps in 100ms after Part A */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 3.1 }}
              className="font-playfair text-xl md:text-3xl text-soft-grey tracking-wide"
            >
              way to buy.
            </motion.span>
          </motion.div>

          {/* LINE 4: "No" + "link that converts." — starts at 3.5s */}
          <motion.div
            initial={{ y: 10 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, delay: 3.5 }}
            className="flex flex-row gap-x-2 items-baseline justify-end flex-wrap"
          >
            {/* Part A — snaps in at 3.5s */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 3.5 }}
              className="font-instrument text-4xl md:text-3xl tracking-tight text-white-axis leading-tight"
            >
              No
            </motion.span>
            {/* Part B — snaps in 100ms after Part A */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 3.6 }}
              className="font-playfair text-xl md:text-3xl text-soft-grey tracking-wide"
            >
              link that converts.
            </motion.span>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
