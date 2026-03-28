"use client"
import { motion } from "framer-motion"

import { SiInstagram } from "@icons-pack/react-simple-icons"
// SiInstagram: Instagram logo from Simple Icons, already in the project.

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS — RIGHT BLOCK (snap/glitch) — unchanged
// ─────────────────────────────────────────────────────────────────────────────

const glitchItem = {
  hidden: {
    opacity: 0,
    // Starts invisible.

    x: 8,
    // x: horizontal offset in pixels. Positive = pushed RIGHT from final position.
    // The line starts 8px to the right and snaps left into place.
    // → Increase (e.g. 16) for a more visible horizontal snap.
    // → Decrease (e.g. 4) for a barely-there micro-snap.
    // → Negate (e.g. -8) to snap in from the LEFT instead.

    filter: "blur(5px)",
    // "blur(5px)" makes the text soft at the start —
    // as if the signal hasn't locked in yet. Clears to sharp on arrival.
  },
  show: {
    opacity: 1,
    x: 0,                // Snaps to its natural horizontal position.
    filter: "blur(0px)", // Fully sharp at rest.
    transition: {
      duration: 0.4,
      // 0.4s is the minimum allowed by brand guidelines — this is what makes
      // it feel like a snap rather than a float.

      ease: [0.25, 1, 0.5, 1],
      // Custom cubic-bezier: very steep initial acceleration → clean sudden stop.
      // That steep entry creates the "snap" quality.
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function IntroSection() {
  return (
    <section
      id="intro"
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-24 md:gap-32">

        {/* ── TOP BLOCK: scroll sequence ────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-10 md:gap-14">

          {/* ── OPENING LINE ──────────────────────────────────────────────── */}
          {/*
            "You have attention through Instagram." — the section headline (h2).
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

        {/* ── RIGHT BLOCK ───────────────────────────────────────────────────── */}
        {/* Plain div — no animation on the container itself.
            Each child carries its own whileInView trigger so every line
            fires when IT enters the viewport, not when the parent does. */}
        <div
          className={[
            "flex flex-col",
            // Stacks the four lines vertically.

            "gap-4 md:gap-6",
            // Same line spacing as the original left block for visual consistency.

            "items-end",
            // items-end: in a flex-col layout, aligns children to the RIGHT edge
            // of the container. This is what right-aligns each line of text.
            // → "items-start" to switch back to left-aligned.
            // → "items-center" to center every line.

            "text-right",
            // text-right: aligns the TEXT inside each element to the right.
            // items-end handles block alignment; text-right handles the text
            // inside multi-line elements. Both are needed.

            "bg-grey-axis",
            // bg-grey-axis: background = #121212 (near-black grey).
            // Just barely darker than the page's #000000 — a subtle surface shift
            // that signals a tonal change without being a bold visual break.

            "py-10 px-6",
            // py-10: 40px vertical padding inside the grey box on mobile.
            // px-6: 24px horizontal padding on mobile.

            "md:py-16 md:px-12",
            // py-16: 64px vertical padding on desktop.
            // px-12: 48px horizontal padding on desktop.
          ].join(" ")}
        >
          {/* LINE 1 — sub-headline, high contrast */}
          <motion.h3
            variants={glitchItem}
            // Each right-block child gets its own whileInView trigger.
            // The animation fires when THIS element is 80px above the viewport
            // bottom — guaranteeing it's clearly visible when it snaps in.
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            // No transition prop here — delay is 0 (fires immediately on entering view).
            className={[
              "font-instrument",
              "text-4xl md:text-3xl",
              "tracking-tight",
              "text-white-axis",
              // The heading level is h3 (semantic hierarchy: h1→h2→h3), but it's
              // styled to match the h2 — the tag controls SEO, not appearance.

              "leading-tight",
            ].join(" ")}
          >
            Your studio has visibility. <br />
            {/* <br />: forces a line break mid-sentence.
                Splits "visibility." and "But no structure." onto separate lines.
                → Remove the <br /> to let it wrap naturally based on container width. */}
            But no structure.
          </motion.h3>

          {/* LINES 2–4 — the three specific gaps, quiet, deliberate */}
          <motion.p
            variants={glitchItem}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ delay: 0.08 }}
            // delay: 0.08s — fires 80ms after the h3. Creates a manual cascade
            // since staggerChildren is not used on the container.
            className={[
              "font-instrument",
              "text-xl md:text-3xl",
              // Smaller than the h3 — creates the "trailing off" effect.

              "text-soft-grey",
              // Muted colour — these are supporting detail, not the main statement.

              "tracking-wide",
            ].join(" ")}
          >
            No clear offer.
          </motion.p>

          <motion.p
            variants={glitchItem}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ delay: 0.16 }}
            // delay: 0.16s — 80ms after "No clear offer."
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
          >
            No way to buy.
          </motion.p>

          <motion.p
            variants={glitchItem}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ delay: 0.24 }}
            // delay: 0.24s — 80ms after "No way to buy." Last in the cascade.
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
          >
            No link that converts.
          </motion.p>
        </div>

      </div>
    </section>
  )
}
