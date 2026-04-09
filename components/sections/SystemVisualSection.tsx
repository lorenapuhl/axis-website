"use client"
// "use client" tells Next.js this component runs in the BROWSER, not on the server.
// We need it here because:
//   1. useState / useEffect are React hooks that only work in the browser.
//   2. Framer Motion animations require a live DOM to run.
// Without this line, Next.js would try to render this on the server and crash.

import { motion, AnimatePresence } from "framer-motion"
// motion     → Framer Motion's supercharged version of HTML/SVG elements.
//              e.g. <motion.div> behaves like <div> but accepts animation props.
// AnimatePresence → A wrapper that lets elements animate OUT before being removed
//                   from the DOM. Used here for the rotating attribute text.

import { useState, useEffect } from "react"
// useState  → Lets a component "remember" a value across re-renders.
//             Like a class variable that triggers a re-render when it changes.
// useEffect → Runs a side-effect (e.g. a timer) after the component renders.
//             Clean equivalent of "run this code once the DOM is ready."

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// Defined outside the component so they are not re-created on every render.
// In Python terms, think of these as module-level constants.
// ─────────────────────────────────────────────────────────────────────────────

// The three rotating attributes shown under the Websystem node.
// The component cycles through these every 2.8 seconds.
const ATTRIBUTES = [
  "Automatically syncs to Instagram",
  "Adapts to your content",
  "Always up to date",
]

// The static capabilities list shown under the Booking node.
const BOOKING_ITEMS = [
  "Bookings",
  "Payments",
  "Client analytics",
  "Growth dashboards",
]

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
//
// A "variant" is a named animation state. Instead of writing animation values
// directly on each element, you define named states ("hidden", "show") in an
// object, then tell the element which object to use via the `variants` prop.
//
// When a parent switches from "hidden" → "show", all children that share the
// same variant names automatically inherit and animate — with individual
// `transition.delay` values creating a staggered sequence.
// ─────────────────────────────────────────────────────────────────────────────

// NODE variant — each system node (Instagram, Websystem, Booking) fades up.
const nodeVariant = {
  hidden: {
    opacity: 0, // Fully invisible at start.
    y: 12,      // Starts 12px below its final resting position.
  },
  show: {
    opacity: 1, // Fully visible at rest.
    y: 0,       // Back to its natural document position.
    // NOTE: Each node overrides `transition` via its own prop to set a unique
    // delay — this creates the Instagram → Websystem → Booking sequence.
  },
}

// LINE variant — the SVG connector paths draw themselves left-to-right.
// `pathLength` is a Framer Motion shorthand that animates stroke-dasharray /
// stroke-dashoffset under the hood — the visual result is a line "drawing" in.
const lineVariant = {
  hidden: {
    pathLength: 0, // Stroke is fully "un-drawn" — invisible.
    opacity: 0,    // Also fade in slightly for a softer reveal.
  },
  show: {
    pathLength: 1, // Stroke fully drawn.
    opacity: 1,
    // Delay is also overridden per connector via the element's transition prop.
  },
}

// GLOW variant — a blue halo that expands and fades once the Booking node
// has appeared, creating the "slight glow" effect described in the spec.
// Uses Framer Motion keyframe arrays: [start, peak, end].
const glowVariant = {
  hidden: {
    opacity: 0, // Invisible at start.
    scale: 1,   // Normal size at start.
  },
  show: {
    opacity: [0, 0.45, 0],   // Fades in, peaks, fades out.
    scale: [1, 2.8, 4],      // Expands outward like a ripple.
    transition: {
      delay: 2.3,            // Fires after Booking node has fully appeared
                             // (node delay 1.6s + duration 0.7s ≈ 2.3s).
      duration: 1.2,
      ease: "easeOut" as const,
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SystemVisualSection() {
  // `attrIndex` tracks which rotating attribute is currently displayed.
  // useState(0) → starts at index 0, i.e. the first attribute in the array.
  // setAttrIndex → a function that updates the value and re-renders the component.
  const [attrIndex, setAttrIndex] = useState(0)
  const [bookIndex, setBookIndex] = useState(0)
  // useEffect with an empty dependency array [] runs once, after the first render.
  // It sets up a repeating interval that advances the attribute index every 2.8s.
  // The function it returns ("cleanup") runs when the component is unmounted,
  // clearing the interval to prevent memory leaks — like a destructor in OOP.
  useEffect(() => {
    const interval = setInterval(() => {
      // Functional update: (i) => ... ensures we always read the latest value
      // rather than a stale one captured at the time of the setInterval call.
      // The % (modulo) wraps back to 0 after the last attribute.
      setAttrIndex(i => (i + 1) % ATTRIBUTES.length)
      setBookIndex(i => (i + 1) % BOOKING_ITEMS.length)
    }, 2800)

    return () => clearInterval(interval) // Cleanup: stop the timer on unmount.
  }, []) // [] = run once on mount, never re-run.

  return (
    <section
      id="system_visual"
      // id="system_visual": allows in-page anchor links to jump to this section
      // and is used by the header navigation.

      className={[
        "bg-grey-axis",
        // bg-grey-axis: #121212 — slightly lighter than bg-black-axis (#000000).
        // Creates a subtle surface shift that signals a new section block.
        // → Change to "bg-black-axis" to remove the tonal break.

        "py-20 px-6",
        // Mobile padding: 80px top/bottom, 24px left/right.
        // Keeps content from touching screen edges on small devices.

        "md:py-36 md:px-12",
        // Desktop padding (≥768px): 144px top/bottom, 48px left/right.
        // Much more spacious — matches all other sections in the system.
      ].join(" ")}
    >
      <div
        className={[
          "max-w-6xl",
          // max-w-6xl: caps the content width at 1152px.
          // Prevents the diagram from stretching too wide on large monitors.

          "mx-auto",
          // mx-auto: centers the content block by setting left/right margins to equal auto values.
        ].join(" ")}
      >

        {/* ── SECTION HEADER ────────────────────────────────────────────── */}
        {/* A simple fade-up reveal for the label + headline.
            This uses inline initial/whileInView props instead of named variants
            because it is a standalone element that does not need to coordinate
            with child animations. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          // initial: the starting animation state — invisible and 20px below.

          whileInView={{ opacity: 1, y: 0 }}
          // whileInView: switches to this state when the element scrolls into view.
          // Framer Motion monitors the element's position relative to the viewport.

          transition={{ duration: 0.7, ease: "easeOut" as const }}
          // duration 0.7s and easeOut = slow, decelerating reveal.
          // Brand guideline: "animations are slow and confident."

          viewport={{ once: true }}
          // once: true → fires only the first time this element enters view.
          // It will not re-animate if the user scrolls away and back.

          className="mb-20 md:mb-28 text-center"
          // text-center: horizontally centers the label and headline text.
          // mb-20 / md:mb-28: pushes the diagram below the header with generous space.
        >
          {/* Accent label — uses text-blue-axis, the single accent for this section */}
          {/*<p
            className={[
              "font-instrument",
              // font-instrument: Instrument Sans — the body/UI typeface.

              "uppercase tracking-widest",
              // uppercase: all-caps treatment for labels (brand convention).
              // tracking-widest: very wide letter-spacing → airy, system-signal feel.

              "text-blue-axis",
              // text-blue-axis: #0033FF electric blue — the ONLY accent used in this section.
              // Rules: never use more than one accent color per section.

              "text-xs",
              // text-xs: 12px — small label, intentionally de-emphasised.

              "mb-4",
              // 16px gap between the label and the headline below it.
            ].join(" ")}
          >
            The AXIS
          </p> /*}

          {/* Section headline — must be <h2> per SEO rules.
              The page has exactly one <h1> (in the Hero).
              Every other section headline is <h2>. */}
          *<h2
            className={[
              "font-playfair",
              // font-playfair: Playfair Display — the serif headline typeface.
              // Loaded via Google Fonts in app/layout.tsx and available globally.

              "uppercase tracking-tight",
              // uppercase: brand rule — all headlines are capitalised.
              // tracking-tight: slightly reduced letter-spacing → dense, editorial.

              "text-white-axis",
              // text-white-axis: #FFFFFF — full-brightness white for headlines.

              "text-4xl md:text-4xl",
              // text-4xl: 36px on mobile. md:text-6xl: 60px on desktop.
              // Large enough to anchor the section, small enough not to crowd.

              "leading-tight",
              // leading-tight: line-height ≈ 1.25× font-size.
              // Keeps multi-word uppercase headlines from feeling too airy.
            ].join(" ")}
          >
            HOW IT WORKS
          </h2>
        </motion.div>

        {/* ── SYSTEM DIAGRAM ────────────────────────────────────────────── */}
        {/* The diagram is a single motion.div that acts as the animation
            ORCHESTRATOR. When it scrolls into view, it switches from
            "hidden" → "show", and all child elements that use `variants`
            automatically inherit this state change — with each child's own
            `transition.delay` controlling WHEN it animates. */}
        <motion.div
          initial="hidden"
          // initial="hidden": all children start in their "hidden" variant state.

          whileInView="show"
          // whileInView="show": when this container enters the viewport, it
          // broadcasts "show" to all children, triggering the full sequence.

          viewport={{ once: true }}
          // once: true → the sequence fires only the first time. No repeat on re-scroll.

          className={[
            "flex flex-col items-center",
            // flex-col: stacks nodes vertically on mobile.
            // items-center: centers each node horizontally on mobile.

            "md:flex-row md:items-start",
            // md:flex-row: switches to horizontal layout on desktop (≥768px).
            // md:items-start: aligns node tops — dots sit on the same baseline,
            //   content below each node can vary in height independently.
          ].join(" ")}
        >

          {/* ════════════════════════════════════════════════════════════════
              NODE 1 — Instagram
              Appears first (delay: 0) — the starting point of the flow.
          ════════════════════════════════════════════════════════════════ */}
          <motion.div
            variants={nodeVariant}
            // variants={nodeVariant}: this element uses the nodeVariant object above.
            // Framer Motion looks up "hidden" and "show" from that object when
            // the parent broadcasts the corresponding state.

            transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0 }}
            // delay: 0 → appears immediately when the section enters view.
            // This is the anchor of the sequence — everything else follows it.

            className="flex flex-col items-center text-center shrink-0"
            // shrink-0: prevents this node from being compressed by the flex layout.
            //           The connectors (flex-1) absorb all extra space instead.
          >
            {/* Node indicator dot — a hollow circle representing Instagram */}
            <div
              className={[
                "w-3 h-3",
                // w-3 h-3: 12px × 12px — small, precise dot.

                "rounded-full",
                // rounded-full: turns the square div into a perfect circle.

                "border border-soft-grey",
                // border: 1px solid border.
                // border-soft-grey: #A1A1A1 muted grey — quiet, not the focal point.
                // The Booking node uses border-white-axis to signal it is the destination.
              ].join(" ")}
            />

            {/* Node label */}
            <p
              className={[
                "font-instrument uppercase tracking-widest",
                // Same treatment as the section label: small, all-caps, wide tracking.

                "text-white-axis text-xs",
                // text-white-axis: full brightness — node names are the primary identifiers.

                "mt-4",
                // 16px gap between the dot and the label below it.
              ].join(" ")}
            >
              Instagram
            </p>
            
            <p
              className={[
                "font-instrument tracking-widest",
                "text-white-axis text-xs",
                // text-blue-axis: the only accent color in this section.
                // Used here as an "active state" label per brand conventions.
                "mb-3",
              ].join(" ")}
            >
              You send us your handle.
            </p>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════════
              CONNECTOR 1 — Line from Instagram → Websystem
              Desktop: horizontal SVG line (hidden on mobile)
              Mobile: vertical SVG line (hidden on desktop)
          ════════════════════════════════════════════════════════════════ */}

          {/* Desktop connector — horizontal */}
          <div
            className={[
              "hidden md:block",
              // hidden: invisible on mobile. md:block: visible on desktop.

              "flex-1",
              // flex-1: grows to fill all available horizontal space between the nodes.
              // This is what pushes the nodes to their correct positions.

              "mt-[5px]",
              // mt-[5px]: arbitrary Tailwind value. 5px of top margin aligns the
              // SVG line with the visual center of the 12px dot above it
              // (dot center = 6px, SVG line is at y=1 in a 2px-tall viewBox → ~6px total).

              "px-6",
              // px-6: 24px of horizontal padding keeps the line from touching the dots.
            ].join(" ")}
          >
            {/* SVG draws a horizontal 1px line that fills the container width.
                viewBox="0 0 100 2" + preserveAspectRatio="none" means the SVG
                stretches to fill the parent's width while keeping the 2px height.
                The path "M 0 1 L 100 1" is a horizontal line at the vertical midpoint. */}
            <svg
              className="w-full"
              height="2"
              viewBox="0 0 100 2"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 0 1 L 100 1"
                stroke="currentColor"
                // stroke="currentColor": inherits the CSS `color` property set
                // by the className below. This lets us use Tailwind color tokens
                // for SVG strokes without hardcoding hex values.

                strokeWidth="0.5"
                // strokeWidth 0.5 → visually 1px at normal scale. Very thin line.

                fill="none"
                // fill="none": paths default to black fill. Override to remove it.

                className="text-soft-grey"
                // Sets `color: #A1A1A1` which is picked up by `stroke="currentColor"`.

                variants={lineVariant}
                // Connects to the lineVariant object: pathLength 0 → 1 (draw animation).

                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.4 }}
                // delay: 0.4s → starts drawing after Instagram has appeared (delay 0 + ~0.3s).
                // The line "draws" for 0.7s, finishing around t=1.1s.
              />
            </svg>
          </div>

          {/* Mobile connector — vertical */}
          <div className="md:hidden my-6">
            {/* my-6: 24px top and bottom margin creates spacing around the vertical connector. */}
            <svg
              width="2"
              height="40"
              viewBox="0 0 2 40"
              // Fixed size: 2px wide, 40px tall. The path runs through the center (x=1).
            >
              <motion.path
                d="M 1 0 L 1 40"
                // Vertical line: starts at top (0) and ends at bottom (40) of the SVG.
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-soft-grey"
                variants={lineVariant}
                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.4 }}
                // Same delay as the desktop connector — both are connector 1.
              />
            </svg>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              NODE 2 — Websystem
              Appears second (delay: 0.8) — after the first line finishes drawing.
              Contains the "Powered by Instagram" label and a rotating attribute.
          ════════════════════════════════════════════════════════════════ */}
          <motion.div
            variants={nodeVariant}
            transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.8 }}
            // delay: 0.8s → connector 1 finishes drawing at ~1.1s.
            // 0.8s means Websystem STARTS appearing while the line is still drawing
            // (overlap is intentional — it feels more continuous).

            className="flex flex-col items-center text-center shrink-0"
          >
            {/* Node indicator dot */}
            <div className="w-3 h-3 rounded-full border border-soft-grey" />

            {/* Node label */}
            <p className="font-instrument tracking-widest text-white-axis text-xs mt-4 mb-6">
              AXIS < br/> 
              We build your system.
            </p>
            

            {/* Accent sub-label — "Powered by Instagram" */}
            <p
              className={[
                "font-instrument uppercase tracking-widest",
                "text-magenta-axis text-xs",
                // text-blue-axis: the only accent color in this section.
                // Used here as an "active state" label per brand conventions.
                "mb-3",
              ].join(" ")}
            >
              Powered by Instagram
            </p>

            {/* Rotating attribute — cycles through ATTRIBUTES every 2.8s.
                AnimatePresence lets the exiting item animate OUT (fade + slide up)
                before the entering item animates IN (fade + slide up from below).
                `mode="wait"` ensures the exit finishes before the enter starts. */}
            <div
              className={[
                "h-8",
                // h-8: fixed 32px height prevents layout shift when the text changes.
                // Without this, the section height would jump with each attribute change.

                "flex items-center justify-center",
                // Centers the text vertically and horizontally within the fixed box.
              ].join(" ")}
            >
              <AnimatePresence mode="wait">
                {/* The `key` prop is critical here.
                    When `key` changes (i.e. attrIndex changes), React unmounts the
                    old element and mounts a new one. AnimatePresence detects the
                    unmount and plays the `exit` animation before actually removing it. */}
                <motion.p
                  key={attrIndex}
                  initial={{ opacity: 0, y: 6 }}
                  // Enters from slightly below and invisible.

                  animate={{ opacity: 1, y: 0 }}
                  // Settles to normal position and full opacity.

                  exit={{ opacity: 0, y: -6 }}
                  // Exits by fading out and sliding slightly upward.

                  transition={{ duration: 0.4, ease: "easeOut" as const }}
                  // 0.4s is the minimum allowed duration — appropriate for a
                  // small, subtle element like this label.

                  className={[
                    "font-instrument text-soft-grey text-xs tracking-wide",
                    // font-instrument: body typeface.
                    // text-soft-grey: muted — this is supportive detail, not a headline.
                    // tracking-wide: slightly open letter-spacing for readability at 12px.

                    "max-w-[180px]",
                    // Limits text width to prevent very long attributes from
                    // pushing the nodes apart on mobile.
                  ].join(" ")}
                >
                  {ATTRIBUTES[attrIndex]}
                  {/* Reads the current string from the array.
                      As attrIndex cycles 0 → 1 → 2 → 0, this text changes. */}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════════
              CONNECTOR 2 — Line from Websystem → Booking
          ════════════════════════════════════════════════════════════════ */}

          {/* Desktop connector — horizontal */}
          <div className="hidden md:block flex-1 mt-[5px] px-6">
            <svg className="w-full" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
              <motion.path
                d="M 0 1 L 100 1"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-soft-grey"
                variants={lineVariant}
                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 1.2 }}
                // delay: 1.2s → draws after Websystem has appeared (delay 0.8 + ~0.4s).
              />
            </svg>
          </div>

          {/* Mobile connector — vertical */}
          <div className="md:hidden my-6">
            <svg width="2" height="40" viewBox="0 0 2 40">
              <motion.path
                d="M 1 0 L 1 40"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-soft-grey"
                variants={lineVariant}
                transition={{ duration: 0.7, ease: "easeOut" as const, delay: 1.2 }}
              />
            </svg>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              NODE 3 — Booking
              Appears last (delay: 1.6) — the destination and outcome of the flow.
              Features a one-shot glow halo and a static capability list.
          ════════════════════════════════════════════════════════════════ */}
          <motion.div
            variants={nodeVariant}
            transition={{ duration: 0.7, ease: "easeOut" as const, delay: 1.6 }}
            // delay: 1.6s → connector 2 begins drawing at 1.2s and takes 0.7s (= 1.9s).
            // Booking starts appearing at 1.6s for a deliberate slight overlap with the line.

            className="flex flex-col items-center text-center shrink-0"
          >
            {/* Dot wrapper — uses `relative` so the glow ring can be
                absolutely positioned behind the dot using `absolute`. */}
            <div className="relative flex items-center justify-center">

              {/* Glow halo — an absolutely positioned blue circle that
                  expands from the dot and fades out once after the node appears.
                  `absolute` removes it from normal document flow so it sits
                  behind the dot without pushing other elements around. */}
              <motion.div
                variants={glowVariant}
                // glowVariant uses keyframe arrays to animate opacity and scale
                // in a single motion: fade in → peak → fade out.
                // The 2.3s delay means it fires after the node is fully visible.

                className={[
                  "absolute",
                  // absolute: positioned relative to the nearest `relative` ancestor.
                  // Centered by default since the parent uses flex justify-center.

                  "w-3 h-3 rounded-full",
                  // Same size and shape as the dot, so the glow starts from the dot's bounds.

                  "bg-magenta-axis",
                  // bg-blue-axis: #0033FF — the glow uses the accent color for impact.
                  // The opacity animation in glowVariant controls visibility;
                  // the `scale` animation expands the ring outward.
                ].join(" ")}
              />

              {/* Node indicator dot — Booking uses border-white-axis (full white)
                  instead of border-soft-grey to signal it is the destination/goal node. */}
              <div
                className={[
                  "w-3 h-3 rounded-full",
                  "border border-white-axis",
                  // border-white-axis: brighter than the other nodes' soft-grey border.
                  // Subtle visual cue that Booking is the "active" end state.

                  "relative z-10",
                  // z-10: ensures the dot renders ON TOP of the glow halo behind it.
                ].join(" ")}
              />
            </div>

            {/* Node label */}
            <p className="font-instrument tracking-widest text-white-axis text-xs mt-4 mb-6">
              CLIENT CONVERSION <br />
              You grow.
            </p>
            
                        <p
              className={[
                "font-instrument uppercase tracking-widest",
                "text-magenta-axis text-xs",
                // text-blue-axis: the only accent color in this section.
                // Used here as an "active state" label per brand conventions.
                "mb-3",
              ].join(" ")}
            >
              Zero Maintenance
            </p>

	 <div
              className={[
                "h-8",
                // h-8: fixed 32px height prevents layout shift when the text changes.
                // Without this, the section height would jump with each attribute change.

                "flex items-center justify-center",
                // Centers the text vertically and horizontally within the fixed box.
              ].join(" ")}
            >
              <AnimatePresence mode="wait">
                {/* The `key` prop is critical here.
                    When `key` changes (i.e. attrIndex changes), React unmounts the
                    old element and mounts a new one. AnimatePresence detects the
                    unmount and plays the `exit` animation before actually removing it. */}
                <motion.p
                  key={bookIndex}
                  initial={{ opacity: 0, y: 6 }}
                  // Enters from slightly below and invisible.

                  animate={{ opacity: 1, y: 0 }}
                  // Settles to normal position and full opacity.

                  exit={{ opacity: 0, y: -6 }}
                  // Exits by fading out and sliding slightly upward.

                  transition={{ duration: 0.4, ease: "easeOut" as const }}
                  // 0.4s is the minimum allowed duration — appropriate for a
                  // small, subtle element like this label.

                  className={[
                    "font-instrument text-soft-grey text-xs tracking-wide",
                    // font-instrument: body typeface.
                    // text-soft-grey: muted — this is supportive detail, not a headline.
                    // tracking-wide: slightly open letter-spacing for readability at 12px.

                    "max-w-[180px]",
                    // Limits text width to prevent very long attributes from
                    // pushing the nodes apart on mobile.
                  ].join(" ")}
                >
                  {BOOKING_ITEMS[bookIndex]}
                  {/* Reads the current string from the array.
                      As attrIndex cycles 0 → 1 → 2 → 0, this text changes. */}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
