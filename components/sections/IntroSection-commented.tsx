"use client"
// ^^ "use client" must be the ABSOLUTE FIRST LINE — nothing above this, not even a blank line.
// This tells Next.js to run this component in the browser rather than on the server.
// We need it here because Framer Motion uses browser APIs to drive animations.

import { motion } from "framer-motion"
// Framer Motion is the animation library used across this project.
// `motion` gives us animated versions of HTML elements — e.g. <motion.p> is a <p>
// tag that can fade in, slide, blur, and respond to scroll position.

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
//
// In Framer Motion, "variants" are named animation states — like CSS class
// presets you can switch between, but with timing and coordination built in.
//
//   "hidden" = the starting state (invisible, offset)
//   "show"   = the final resting state (fully visible, in position)
//
// Defining variants outside the component prevents them from being re-created
// on every render, which would waste memory.
// ─────────────────────────────────────────────────────────────────────────────

// LEFT BLOCK — standard fade + upward scroll reveal
// Pattern taken directly from skills/animate-section.md.

const fadeContainer = {
  // The container itself has no visual animation — it only coordinates
  // when its children begin their own animations (via staggerChildren).
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12, // Each child starts 0.12s after the one before it
    },
  },
}

const fadeItem = {
  hidden: { opacity: 0, y: 20 },  // Invisible, 20px below its resting position
  show: {
    opacity: 1,
    y: 0,                          // Rises into its natural position
    transition: {
      duration: 0.7,               // Slow and confident — matches brand feel
      ease: "easeOut",
    },
  },
}

// RIGHT BLOCK — subtle snap/glitch effect
// Same stagger structure, but the motion feel is sharper:
//   • Items slide in from a small x-offset (as if snapping into a grid slot)
//   • A 1px blur clears on arrival — like a signal locking into focus
//   • A sharp cubic-bezier ease gives the "snap" without bouncing
//
// This deviates slightly from the default "easeOut" string to use a custom
// cubic-bezier that is still an ease-out curve — just steeper, giving the
// requested snap quality. Duration is 0.4s (the short end of the allowed range).

const glitchContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,  // Slightly tighter stagger for a crisper cascade
    },
  },
}

const glitchItem = {
  hidden: {
    opacity: 0,
    x: 8,                // Starts 8px to the right of its final position
    filter: "blur(1px)", // Very slight blur — just enough to feel "unresolved"
  },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      // [0.16, 1, 0.3, 1] is a cubic-bezier with a very fast initial acceleration
      // that snaps to a clean stop. Still eases out — just with sharper intent.
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function IntroSection() {
  return (
    // <section> is a semantic HTML5 landmark — Google and screen readers use it
    // to understand that this is a distinct, self-contained block of content.
    //
    // id="intro" allows anchor links (<a href="#intro">) to jump directly here.
    //
    // Spacing follows skills/component.md:
    //   Mobile-first base: py-20 px-6
    //   Desktop override:  md:py-36 md:px-12
    <section
      id="intro"
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12"
    >
      {/* max-w-6xl mx-auto: constrains content to a readable max width and centers it.
          flex flex-col: stacks the two blocks vertically (top = left-aligned, bottom = right-aligned).
          gap-24 / md:gap-32: generous whitespace between blocks — "never crowd elements". */}
      <div className="max-w-6xl mx-auto flex flex-col gap-24 md:gap-32">

        {/* ── LEFT BLOCK ──────────────────────────────────────────────────────
            Five lines reveal one by one as the section enters the viewport.
            whileInView: triggers the animation when the element scrolls into view.
            viewport={{ once: true }}: only animates once — not every time you scroll past. */}
        <motion.div
          variants={fadeContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-4 md:gap-6"
        >
          {/* LINE 1 — High contrast, strong emphasis.
              <h2> is required by SEO rules: every section must have exactly one
              semantic headline element. font-playfair + uppercase + tracking-tight
              is the standard headline style defined in skills/component.md. */}
          <motion.h2
            variants={fadeItem}
            className="font-instrument text-4xl md:text-5xl tracking-tight text-white-axis leading-tight"
          >
            You have attention through Instagram.
          </motion.h2>

          {/* LINES 2–4 — Quieter lines. Lower contrast, smaller size.
              These "trail off" — visually listing the incomplete actions.
              font-instrument is the body/UI font from skills/component.md.
              text-soft-grey is the muted label color token from globals.css. */}
          <motion.p
            variants={fadeItem}
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
          >
            People watch.
          </motion.p>

          <motion.p
            variants={fadeItem}
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
          >
            Like.
          </motion.p>

          <motion.p
            variants={fadeItem}
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
          >
            Follow.
          </motion.p>

          {/* LINE 5 — Punchline. Returns to high contrast to land the point.
              Not uppercase: intentionally reads like a sentence, not a headline —
              it should feel like a damning conclusion, not a repeated shout.
              mt-6 / md:mt-10: extra breathing room before the punchline. */}
          <motion.p
            variants={fadeItem}
            className="font-instrument text-4xl md:text-5xl tracking-tight text-white-axis leading-tight mt-6 md:mt-10"
          >
            But they don't book.
          </motion.p>
        </motion.div>

        {/* ── RIGHT BLOCK ─────────────────────────────────────────────────────
            Four lines snap in with a subtle glitch effect.
            bg-grey-axis: #121212 vs the #000000 page background — just enough
            contrast to signal a tonal shift without being decorative.
            items-end + text-right: aligns everything to the right edge. */}
        <motion.div
          variants={glitchContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-4 md:gap-6 items-end text-right bg-grey-axis py-10 px-6 md:py-16 md:px-12"
        >
          {/* LINE 1 — High contrast, strong emphasis.
              <h3> because this is a sub-heading within the same section as the <h2> above.
              SEO rule: heading levels must not skip — h1 → h2 → h3 is valid.
              Styling is visually identical to the h2 — the tag level is semantic, not visual. */}
          <motion.h3
            variants={glitchItem}
            className="font-instrument text-4xl md:text-5xl tracking-tight text-white-axis leading-tight"
          >
            Your studio has visibility. <br />But no structure.
          </motion.h3>

          {/* LINES 2–4 — The three specific gaps.
              Each snaps in with the glitch variant, cascading via staggerChildren above.
              Quiet, deliberate — each line is a single missing piece. */}
          <motion.p
            variants={glitchItem}
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
          >
            No clear offer.
          </motion.p>

          <motion.p
            variants={glitchItem}
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
          >
            No way to book.
          </motion.p>

          <motion.p
            variants={glitchItem}
            className="font-instrument text-xl md:text-3xl text-soft-grey tracking-wide"
          >
            No link that converts.
          </motion.p>
        </motion.div>

      </div>
    </section>
  )
}
