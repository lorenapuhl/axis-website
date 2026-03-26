"use client"
import { motion } from "framer-motion"

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS — LEFT BLOCK (fade + rise)
// ─────────────────────────────────────────────────────────────────────────────

const fadeContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      // staggerChildren: how many seconds to wait before starting the NEXT child's animation.
      // 0.12 = each line starts 120ms after the previous one.
      // → Increase (e.g. 0.2) for a slower, more dramatic cascade.
      // → Decrease (e.g. 0.06) for a faster, tighter cascade.
    },
  },
}

const fadeItem = {
  hidden: {
    opacity: 0,
    // opacity: visibility. 0 = fully invisible. 1 = fully visible.
    // The line starts completely invisible and fades in.

    y: 20,
    // y: vertical offset in pixels. Positive = pushed DOWN from final position.
    // 20 means each line starts 20px below where it will land.
    // → Increase (e.g. 40) for a more dramatic upward travel.
    // → Decrease (e.g. 8) for a very subtle lift.
    // → Set to 0 to remove the upward motion entirely (pure fade only).
  },
  show: {
    opacity: 1,  // Fully visible at rest.
    y: 0,        // Back to its natural document position.
    transition: {
      duration: 1.0,
      // duration: how many seconds the animation takes from hidden → show.
      // 0.7s is "slow and confident" per brand guidelines.
      // → Increase (e.g. 1.0) for an even more languid feel.
      // → Decrease toward 0.4 (the allowed minimum) for snappier reveals.

      ease: "easeOut",
      // ease: the acceleration curve of the animation.
      // "easeOut" = starts fast, decelerates to a smooth stop.
      // Other options: "easeIn" (slow start, fast end), "easeInOut", "linear".
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS — RIGHT BLOCK (snap/glitch)
// ─────────────────────────────────────────────────────────────────────────────

const glitchItem = {
  hidden: {
    opacity: 0,
    // Starts invisible, same as fadeItem.

    x: 8,
    // x: horizontal offset in pixels. Positive = pushed RIGHT from final position.
    // The line starts 8px to the right and snaps left into place.
    // → Increase (e.g. 16) for a more visible horizontal snap.
    // → Decrease (e.g. 4) for a barely-there micro-snap.
    // → Negate (e.g. -8) to snap in from the LEFT instead.

    filter: "blur(5px)",
    // filter: CSS filter applied to the element.
    // "blur(1px)" makes the text very slightly soft at the start —
    // as if the signal hasn't locked in yet. Clears to sharp on arrival.
    // → Increase (e.g. "blur(3px)") for a more obvious focus-pull effect.
    // → Remove (set to "blur(0px)" in hidden too) to eliminate the blur entirely.
  },
  show: {
    opacity: 1,
    x: 0,             // Snaps to its natural horizontal position.
    filter: "blur(0px)", // Fully sharp at rest.
    transition: {
      duration: 0.4,
      // Shorter than the fade block (0.4 vs 0.7) — this is what makes it feel
      // like a snap rather than a float. 0.4s is the minimum allowed by brand guidelines.

      //ease: [0.16, 1, 0.3, 1],
      ease: [0.25, 1, 0.5, 1],
      // Custom cubic-bezier curve — replaces the "easeOut" string with a sharper version.
      // A cubic-bezier takes 4 numbers: [x1, y1, x2, y2].
      // This curve: very steep initial acceleration → clean sudden stop.
      // That steep entry is what creates the "snap" quality.
      // → [0.25, 1, 0.5, 1] for a slightly softer snap.
      // → [0.05, 1, 0.1, 1] for an even more aggressive snap.
      // → Replace with "easeOut" to remove the snap and use standard easing.
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
      className={[
        "bg-black-axis",
        // bg-black-axis: section background = brand black (#000000).
        // Defined as a token in globals.css. Never use the raw hex here.
        // → Change to "bg-grey-axis" (#121212) if you want a slightly lighter surface.

        "py-20 px-6",
        // py-20: vertical padding (top + bottom) = 80px on mobile.
        //   → Increase (py-24 = 96px, py-28 = 112px) for more breathing room.
        //   → Decrease (py-16 = 64px) to compress the section height.
        // px-6: horizontal padding = 24px on mobile — keeps text off the screen edge.
        //   → px-4 (16px) for tighter mobile margins.

        "md:py-36 md:px-12",
        // md: prefix = applies only at ≥768px (tablet and up).
        // py-36 = 144px vertical padding on desktop — much more spacious.
        // px-12 = 48px horizontal padding on desktop.
        // → md:py-24 if the section feels too tall on desktop.
      ].join(" ")}
    >
      <div
        className={[
          "max-w-6xl",
          // max-w-6xl: maximum content width = 1152px.
          // Prevents text from stretching too wide on large monitors.
          // → max-w-4xl (896px) for a narrower, more editorial column.
          // → max-w-7xl (1280px) if you want content to use more of the screen.

          "mx-auto",
          // mx-auto: centers the content block horizontally within the section.
          // Works by setting left and right margins to "auto" (equal on both sides).

          "flex flex-col",
          // flex: enables Flexbox layout — children can be positioned relative to each other.
          // flex-col: stacks children VERTICALLY (top to bottom).
          // → Remove flex-col (use flex-row) to place blocks side by side instead.

          "gap-24 md:gap-32",
          // gap-24: 96px of space between the left block and right block on mobile.
          // md:gap-32: 128px on desktop — the two blocks breathe apart more on large screens.
          // → Decrease (gap-16) to pull the blocks closer together.
          // → Increase (gap-40) for even more dramatic separation.
        ].join(" ")}
      >

        {/* ── LEFT BLOCK ──────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeContainer}
          // variants: connects this element to the fadeContainer object above.
          // Framer Motion will look up "hidden" and "show" keys from that object.

          initial="hidden"
          // initial: which variant state to start in. "hidden" = invisible + offset.

          whileInView="show"
          // whileInView: switches to the "show" variant when this element
          // scrolls into the visible area of the browser window.
          // This is what triggers the animation on scroll.

          viewport={{ once: true }}
          // viewport.once: if true, the animation fires only the first time the
          // element enters view. It won't reset and replay if you scroll away and back.
          // → Set to false if you want it to re-animate every time it enters view.

          className={[
            "flex flex-col",
            // Stacks all five lines vertically.

            "gap-4 md:gap-6",
            // gap-4: 16px between lines on mobile.
            // md:gap-6: 24px between lines on desktop.
            // → Increase (gap-8 / md:gap-10) for more dramatic line spacing.
            // → Decrease (gap-2) to pack lines tightly together.
          ].join(" ")}
        >
          {/* LINE 1 — headline, high contrast */}
          <motion.h2
            variants={fadeItem}
            // variants={fadeItem}: this element uses the fadeItem animation
            // (opacity 0→1, y 20→0). The container's staggerChildren means
            // this is the FIRST element to animate.
            className={[
              "font-instrument",
              // font-instrument: Instrument Sans — the body/UI typeface.
              // → Change to "font-playfair" for a serif editorial headline feel.

              "text-4xl md:text-3xl",
              // text-4xl: font size 36px on mobile.
              // md:text-5xl: font size 48px on desktop.
              // Scale reference: text-3xl=30px, text-4xl=36px, text-5xl=48px,
              //                  text-6xl=60px, text-7xl=72px, text-8xl=96px.
              // → Increase for a more dominant opening statement.
              // → Decrease if it feels too large on mobile.

              "tracking-tight",
              // tracking-tight: slightly reduces letter-spacing (tighter than normal).
              // Creates a dense, confident feel for large display text.
              // → "tracking-normal" to remove the tightening.
              // → "tracking-widest" for an open, airy label feel (used on subheadings).

              "text-white-axis",
              // text-white-axis: text color = brand white (#FFFFFF).
              // Full brightness — this is the HIGH CONTRAST treatment.
              // → "text-soft-grey" (#A1A1A1) to reduce emphasis.

              "leading-tight",
              // leading-tight: line-height ≈ 1.25× the font size.
              // Keeps multi-line headlines compact — lines sit close together.
              // → "leading-normal" (1.5×) for more breathing room between lines.
              // → "leading-none" (1×) for the tightest possible stacking.
            ].join(" ")}
          >
            You have attention through Instagram.
          </motion.h2>

          {/* LINES 2–4 — body text, low contrast, trailing off */}
          <motion.p
            variants={fadeItem}
            className={[
              "font-instrument",
              // font-instrument: same typeface, but these are <p> elements —
              // same font, lower visual weight via smaller size + softer colour.

              "text-xl md:text-3xl",
              // text-xl: 20px on mobile. md:text-3xl: 30px on desktop.
              // Notably smaller than the h2 (36px / 48px) — creates the
              // "trailing off" effect where the middle lines feel quieter.
              // → Match h2 size (text-4xl md:text-5xl) to make all lines equal weight.

              "text-soft-grey",
              // text-soft-grey: muted grey (#A1A1A1) — lower contrast than white.
              // These lines are intentionally de-emphasised.
              // → "text-white-axis" to bring them to full brightness.

              "tracking-wide",
              // tracking-wide: increases letter-spacing slightly.
              // Gives these smaller lines a more open, readable feel.
              // → "tracking-normal" to remove the extra spacing.
              // → "tracking-widest" for a very airy, label-like look.
            ].join(" ")}
          >
            People watch.
          </motion.p>

          <motion.p
            variants={fadeItem}
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
            // Same classes as "People watch." — see comments above.
          >
            Like.
          </motion.p>

          <motion.p
            variants={fadeItem}
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
            // Same classes — the three quiet lines are intentionally identical in style.
          >
            Follow.
          </motion.p>

          {/* LINE 5 — punchline, high contrast, extra top margin */}
          <motion.p
            variants={fadeItem}
            // This is the last child, so it animates last in the stagger sequence.
            className={[
              "font-instrument",
              "text-4xl md:text-3xl",
              // Same size as line 1 — returns to full weight for the punchline.

              "tracking-tight",
              // Matches line 1's tight tracking — mirrors it visually.

              "text-uv-axis",
              // Full contrast — this line demands attention, same as line 1.

              "leading-tight",

              "mt-6 md:mt-10",
              // mt-6: 24px of EXTRA top margin on mobile (on top of the container gap).
              // md:mt-10: 40px on desktop.
              // This gap is intentional — it separates the punchline from the quiet
              // middle lines, giving it more dramatic weight.
              // → mt-4 / md:mt-6 to reduce the pause before the punchline.
              // → mt-12 / md:mt-16 to make the pause even more dramatic.
            ].join(" ")}
          >
            But they don't book.
          </motion.p>
        </motion.div>

        {/* ── RIGHT BLOCK ─────────────────────────────────────────────────── */}
        {/* Plain div — no animation on the container itself.
            Each child carries its own whileInView trigger so every line
            fires when IT enters the viewport, not when the parent does. */}
        <div
          className={[
            "flex flex-col",
            // Stacks the four lines vertically, same as the left block.

            "gap-4 md:gap-6",
            // Same line spacing as the left block for visual consistency.

            "items-end",
            // items-end: in a flex-col layout, aligns children to the RIGHT edge
            // of the container. This is what right-aligns each line of text.
            // → "items-start" to switch back to left-aligned.
            // → "items-center" to center every line.

            "text-right",
            // text-right: aligns the TEXT inside each element to the right.
            // items-end handles block alignment; text-right handles the text
            // inside multi-line elements. Both are needed.
            // → "text-left" to revert to left-aligned text.

            "bg-grey-axis",
            // bg-grey-axis: background = #121212 (near-black grey).
            // Just barely darker than the page's #000000 — a subtle surface shift
            // that signals a tonal change without being a bold visual break.
            // → "bg-black-axis" to remove the contrast shift entirely.
            // → Remove this class and add a "border-t border-white/10" instead
            //   for a divider line rather than a background shift.

            "py-10 px-6",
            // py-10: 40px vertical padding inside the grey box on mobile.
            // px-6: 24px horizontal padding on mobile.

            "md:py-16 md:px-12",
            // py-16: 64px vertical padding on desktop.
            // px-12: 48px horizontal padding on desktop.
            // → Adjust to control how much space the grey box takes up internally.
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
              // Same high-contrast, large-text treatment as line 1 of the left block.
              // The heading level is h3 (semantic hierarchy: h1→h2→h3), but it's
              // styled identically to the h2 — the tag controls SEO, not appearance.

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
            // delay: 0.08s — fires 80ms after the h3 would have fired had they
            // triggered at the same moment. Creates a manual cascade since
            // staggerChildren is no longer used on the container.
            className={[
              "font-instrument",
              "text-xl md:text-3xl",
              // Smaller than the h3, same as the quiet lines in the left block.

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
            // delay: 0.24s — 80ms after "No way to book." Last in the cascade.
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
          >
            No link that converts.
          </motion.p>
        </div>

      </div>
    </section>
  )
}
