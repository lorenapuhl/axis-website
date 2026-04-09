"use client"
// "use client" tells Next.js this component runs in the BROWSER.
// We need it because:
//   1. useState / useEffect / useRef are React hooks that only work in the browser.
//   2. Framer Motion's useInView and animate props require a live DOM.

import { motion, useInView } from "framer-motion"
// motion     → Framer Motion's animated version of any HTML element.
//              e.g. <motion.div> behaves like <div> but accepts animation props.
// useInView  → A Framer Motion hook that returns true/false depending on whether
//              a referenced element is currently inside the browser viewport.

import { useRef, useState, useEffect } from "react"
// useRef    → Stores a reference to a real DOM element so we can pass it to useInView.
//             Like a pointer that persists across re-renders without causing them.
// useState  → Lets the component "remember" a value (the animation step) across re-renders.
// useEffect → Runs code after render. Used here to fire the animation sequence
//             once the section scrolls into view.

import Image from "next/image"
// next/image → Next.js optimised image component.
//              Automatically resizes, lazy-loads, and prevents layout shift.
//              Required by project rules — never use raw <img> tags.

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// Defined outside the component so they are not recreated on every render.
// In Python terms, think of these as module-level constants.
// ─────────────────────────────────────────────────────────────────────────────

// The three schedule entries shown in the website preview.
// imgSrc corresponds to the same fitness image used in the Instagram grid cell.
const SCHEDULE_ITEMS = [
  { name: "Martial Arts",  time: "08:00", instructor: "Maria L.", src: "/product_visual/img2.png" },
  { name: "Boxing Basics", time: "12:00", instructor: "Alex R.",  src: "/product_visual/img3.png" },
  { name: "Heavy Core",    time: "18:00", instructor: "Sofia M.", src: "/product_visual/img4.png" },
]

// Pricing cards shown in row C of the website preview.
const PRICING_CARDS = [
  { name: "Drop-in",    price: "$25",     cta: "Book"     },
  { name: "10 Classes", price: "$99",    cta: "Buy pack" },
  { name: "Unlimited",  price: "$149/mo", cta: "Start"    },
]

// The nine Instagram grid images.
// Each has:
//   id        → unique identifier used to target the animation.
//   w/h       → placehold.co dimensions (4:5 = portrait, 1:1 = square).
//   aspect    → Tailwind class that sets the CSS aspect-ratio on the grid cell.
//   alt       → descriptive alt text (SEO requirement — never leave this blank).
//   role      → what this image maps to in the website preview.
const GRID_IMAGES = [
  { id: "img1", src: "/product_visual/img1.png", aspect: "aspect-[4/5]",  alt: "Wide fitness studio panorama view",                          role: "hero"     },
  { id: "img2", src: "/product_visual/img2.png", aspect: "aspect-square", alt: "Martial arts training",                                      role: "schedule" },
  { id: "img3", src: "/product_visual/img3.png", aspect: "aspect-square", alt: "Boxing training session with heavy bag workout",              role: "schedule" },
  { id: "img4", src: "/product_visual/img4.png", aspect: "aspect-[4/5]",  alt: "Pilates reformer class with precision movement focus",       role: "schedule" },
  { id: "img5", src: "/product_visual/img5.png", aspect: "aspect-square", alt: "Studio promotional post featuring class packages",           role: "pricing"  },
  { id: "img6", src: "/product_visual/img6.png", aspect: "aspect-square", alt: "Fitness studio aesthetic — natural light and equipment",     role: "filler"   },
  { id: "img7", src: "/product_visual/img7.png", aspect: "aspect-square", alt: "Workout class atmosphere with motivated participants",       role: "filler"   },
  { id: "img8", src: "/product_visual/img8.png", aspect: "aspect-[4/5]",  alt: "Studio interior with clean architectural lines",            role: "filler"   },
  { id: "img9", src: "/product_visual/img9.png", aspect: "aspect-square", alt: "Fitness equipment detail shot — minimal and editorial",     role: "filler"   },
]

// The IDs that participate in the transformation animation.
// img6–img9 are filler and stay static throughout.
const ANIMATED_IDS = new Set(["img1", "img2", "img3", "img4", "img5"])

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION STEPS
//
// The animation is an orchestrated 5-step sequence driven by a `step` integer.
// Each step corresponds to a visual phase of the transformation.
//
//  0 → Initial:    Instagram visible. Website faded (opacity 0.2). UI text hidden.
//  1 → Highlight:  img1–img5 scale up slightly and brighten in the grid.
//  2 → Fade out:   img1–img5 disappear from the grid.
//  3 → Snap in:    Website opacity rises. Images appear inside their destinations.
//  4 → UI builds:  Hero text, schedule labels, pricing text fade in with stagger.
//  5 → Final:      Instagram grid returns to normal. Full website visible.
//
// This "choreographed illusion" — fade-out in source, fade-in at destination —
// visually communicates movement without pixel-level position tracking.
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductVisualSection() {

  // sectionRef is attached to the <section> element below.
  // useInView watches this element and tells us when it enters the viewport.
  const sectionRef = useRef<HTMLElement>(null)

  // once: true  → the callback fires only the first time (no repeat on re-scroll).
  // amount: 0.3 → triggers when 30% of the section is visible, per the spec.
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  // `step` tracks the current animation phase (0–5).
  // useState(0) → starts at 0 before any animation fires.
  // setStep     → updates the value and triggers a re-render.
  const [step, setStep] = useState(0)

  // When the section enters view, chain setTimeout calls to advance through steps.
  // Each timeout fires once and moves the animation to the next phase.
  // The cleanup function (return () => …) cancels all pending timers if the
  // component unmounts before they fire — prevents memory leaks.
  useEffect(() => {
    if (!isInView) return

    const t1 = setTimeout(() => setStep(1), 300)   // Step 1: highlight images
    const t2 = setTimeout(() => setStep(2), 600)   // Step 2: fade out from grid
    const t3 = setTimeout(() => setStep(3), 1000)  // Step 3: snap into website
    const t4 = setTimeout(() => setStep(4), 1200)  // Step 4: UI text builds in
    const t5 = setTimeout(() => setStep(5), 1600)  // Step 5: grid returns normal

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [isInView]) // Re-run only if isInView changes (it will: false → true, once).

  // ── DERIVED ANIMATION STATE ────────────────────────────────────────────────
  // These booleans translate the integer `step` into readable flags used below.

  // Should destination images (hero, thumbnails, pricing) be visible?
  const destVisible  = step >= 3

  // Should website UI text (hero copy, schedule labels, pricing text) be visible?
  const uiVisible    = step >= 4

  // Website panel opacity: 0.2 before snap-in, 1 after.
  const websiteOpacity = step >= 3 ? 1 : 0.2

  // ── GRID IMAGE ANIMATION ──────────────────────────────────────────────────
  // Returns the Framer Motion `animate` target for a given grid image ID.
  // Non-animated images always return an empty object (no override).
  function getGridAnimate(id: string): Record<string, unknown> {
    if (!ANIMATED_IDS.has(id)) return {}

    if (step === 1) {
      // Step 1: highlighted images scale up and brighten.
      return { scale: 1.05, filter: "brightness(1.3)", opacity: 1 }
    }
    if (step >= 2 && step <= 4) {
      // Steps 2–4: highlighted images are invisible in the grid.
      // At the same time they appear at their destinations (see right panel).
      return { scale: 1.05, filter: "brightness(1.3)", opacity: 0 }
    }
    if (step >= 5) {
      // Step 5: grid returns to normal — animation complete.
      return { scale: 1, filter: "brightness(1)", opacity: 1 }
    }
    return {}
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      // ref={sectionRef} attaches the DOM element to our ref so useInView can track it.
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12 min-h-screen"
      // bg-black-axis → #000000, the primary dark surface.
      // py-20 px-6     → mobile padding (80px vertical, 24px horizontal).
      // md:py-36 md:px-12 → desktop padding (144px vertical, 48px horizontal).
      // min-h-screen   → section fills at least the full viewport height.
    >
      <div className="max-w-6xl mx-auto">
        {/*
          max-w-6xl  → caps content width at 1152px.
          mx-auto    → centers the container by applying equal left/right auto margins.
        */}

        {/* ── SECTION HEADER ────────────────────────────────────────────── */}
        {/*
          A simple fade-up reveal using inline whileInView props.
          viewport={{ once: true }} prevents re-animation on re-scroll.
          The header uses its own whileInView rather than the step system
          so it can appear as soon as the section enters view, independently.
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          viewport={{ once: true }}
          className="text-center mx-auto mb-20 md:mb-28 max-w-[600px]"
          // max-w-[600px] → arbitrary Tailwind value. Constrains the headline width
          //                  so it line-breaks naturally at the phrase boundary.
        >
          {/*
            <h2> — this is the section headline.
            SEO rule: exactly one <h1> per page (in the Hero). All other section
            headlines must use <h2>. Never skip heading levels.
          */}
          <h2 className="font-instrument tracking-tight text-white-axis text-3xl leading-tight">
            Your content already exists. <br />
            {/*
              {" "} — inserts a single space between the two strings.
              Without it, JSX would collapse the line break and join words without spacing.
            */}
            We turn it into a system that converts.
          </h2>
        </motion.div>

        {/* ── TWO-COLUMN GRID ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-40 items-start">
          {/*
            grid-cols-1         → single column on mobile (panels stack vertically).
            md:grid-cols-2      → two equal columns on desktop (≥768px).
            gap-16 md:gap-40    → 64px gap mobile, 160px gap desktop (matches spec).
            items-start         → aligns both columns to the top edge, not center.
          */}

          {/* ══════════════════════════════════════════════════════════════
              LEFT COLUMN — INSTAGRAM FEED
              Shows a simulated Instagram profile with a 3×3 photo grid.
              Images img1–img5 animate out during the transformation.
          ══════════════════════════════════════════════════════════════ */}
          <div>

            {/* Column label */}
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-4">
              Your Instagram
            </p>

            {/* Instagram card container.
                bg-grey-axis       → #121212, closest token to spec's #0a0a0a.
                border-white-axis/10 → white at 10% opacity ≈ a very subtle divider line.
                rounded-2xl        → 16px border-radius (matches spec).
                p-4                → 16px internal padding on all sides.
            */}
            <div className="bg-grey-axis border border-white-axis/10 rounded-2xl p-4">

              {/* Instagram profile header: avatar circle + name + handle */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  {/*
                    shrink-0 → prevents the avatar from being compressed in the flex row.
                    relative removed — no longer needed since we use explicit width/height.
                  */}
                  <Image
                    src="https://placehold.co/64x64/121212/FFFFFF"
                    alt="Sports Studio Instagram profile avatar"
                    width={32}
                    height={32}
                    // width/height in pixels — matches the w-8 h-8 (32px) parent container.
                    className="object-cover w-full h-full"
                    // w-full h-full → ensures the image fills the circular container.
                  />
                </div>
                <div>
                  <p className="font-instrument text-white-axis text-xs font-semibold leading-tight">
                    Sports Studio
                  </p>
                  <p className="font-instrument text-soft-grey text-xs">
                    @sports.studio
                  </p>
                </div>
              </div>

              {/* Instagram photo grid: 3 columns, 9 images, gap-[6px] per spec. */}
              <div className="grid grid-cols-3 gap-[6px]">
                {/*
                  .map() is JavaScript's equivalent of a Python list comprehension.
                  Each GRID_IMAGES entry becomes a <motion.div> containing a next/image.
                  `key={img.id}` is required by React to efficiently reconcile the list.
                */}
                {GRID_IMAGES.map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ scale: 1, opacity: 1 }}
                    // initial → the state Framer Motion starts from before any animation.
                    // Non-animated images will stay here; animated ones override via `animate`.

                    animate={getGridAnimate(img.id)}
                    // animate → the target state. Framer Motion interpolates from `initial`
                    // (or the current state) to this target whenever the value changes.
                    // `getGridAnimate` returns different objects as `step` advances.

                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    // duration 0.6s, easeInOut → smooth deceleration at both ends.
                    // easeInOut (vs easeOut) is used here because the image fades both
                    // in and out, so symmetrical easing feels more natural.

                    whileHover={{ scale: 1.03 }}
                    // whileHover → applies this state while the user hovers over the element.
                    // scale 1.03 = a subtle zoom (per spec: "hover on Instagram images: slight zoom").

                    className={`${img.aspect} overflow-hidden rounded-sm relative`}
                    // img.aspect → e.g. "aspect-[4/5]" or "aspect-square".
                    //              Sets the CSS aspect-ratio so the grid cell has a
                    //              defined height based on its column width.
                    // overflow-hidden → clips the image to the rounded corners.
                    // relative        → required for next/image with fill.
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      // object-cover → scales the image to fill the container,
                      //               cropping edges if aspect ratios differ.
                    />
                  </motion.div>
                ))}
              </div>

            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN — WEBSITE PREVIEW
              Simulates the generated website with hero, schedule, and pricing.
              Starts at opacity 0.2 (faded) and animates to full opacity at step 3.
              Images appear inside the UI as their grid counterparts disappear.
          ══════════════════════════════════════════════════════════════ */}
          <div>

            {/* Column label */}
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-4">
              Your website
            </p>

            {/* Website card container.
                initial={{ opacity: 0.2, y: 10 }} → starts faded and slightly below.
                animate={{ opacity: websiteOpacity, y: ... }} → drives the reveal.
                The `y: step >= 3 ? 0 : 10` creates a subtle upward slide on reveal.
            */}
            <motion.div
              initial={{ opacity: 0.2, y: 10 }}
              animate={{
                opacity: websiteOpacity,
                y: step >= 3 ? 0 : 10,
              }}
              transition={{ duration: 0.7, ease: "easeOut" as const }}
              className="bg-white-axis rounded-2xl p-6"
              // bg-white-axis → #FFFFFF. The website panel uses the white-axis token.
            >

              {/* ── A. HERO BLOCK ────────────────────────────────────────── */}
              {/*
                height h-40 = 160px per spec.
                overflow-hidden + rounded-xl → clips the image to rounded corners.
                relative → positioning context for the absolutely placed children below.
              */}
              <div className="h-40 rounded-xl overflow-hidden relative bg-black-axis/10">

                {/* Hero background image (img1 flies here from the grid).
                    Wrapped in a motion.div so we can fade it in at step 3.
                    The absolute inset-0 means it covers the entire hero block. */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: destVisible ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/product_visual/img1.png"
                    alt="Wide pilates and yoga studio — website hero background image"
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Semi-transparent overlay so hero text is legible over any image.
                    bg-black-axis/50 → black at 50% opacity = a dark scrim. */}
                <div className="absolute inset-0 bg-black-axis/50" />

                {/* Hero overlay text and CTA button.
                    Positioned bottom-left inside the hero block.
                    Fades in at step 4 with a subtle upward slide. */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: uiVisible ? 1 : 0,
                    y:       uiVisible ? 0 : 8,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" as const }}
                  className="absolute bottom-4 left-4 flex flex-col gap-2 z-10"
                  // z-10 → renders on top of the image and dark overlay beneath it.
                >
                  <p className="font-instrument text-white-axis text-sm font-semibold leading-snug">
                    Train smarter.<br />Book instantly.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.35, ease: "easeOut" as const }}
                    className="bg-black-axis text-white-axis font-instrument text-xs font-semibold rounded-lg px-3 h-9 w-fit"
                    // w-fit → button only as wide as its text content, not full-width.
                    // h-9   → 36px height per spec.
                  >
                    Book a class
                  </motion.button>
                </motion.div>

              </div>

              {/* ── B. SCHEDULE LIST ─────────────────────────────────────── */}
              {/*
                3 schedule items, each row: [thumbnail] [name + time] [Book button].
                Thumbnails receive their images at step 3 (destVisible).
                Text and buttons build in at step 4 (uiVisible) with stagger.
                The stagger is implemented via transition.delay on each item.
              */}
              <div className="mt-5 flex flex-col gap-3">
                {SCHEDULE_ITEMS.map((item, i) => (
                  // `i` is the array index (0, 1, 2) — used to compute stagger delay.
                  <div key={item.name} className="flex items-center gap-3">

                    {/* Schedule row thumbnail.
                        bg-black-axis/10 → faint background placeholder while image is invisible.
                        relative removed — no longer needed since we use explicit width/height. */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-black-axis/10">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: destVisible ? 1 : 0 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                          delay: i * 0.05,
                          // 0.05s stagger between thumbnails → they appear one after another.
                        }}
                      >
                        <Image
                          src={item.src}
                          alt={`${item.name} class thumbnail`}
                          width={48}
                          height={48}
                          // width/height in pixels — matches the w-12 h-12 (48px) parent container.
                          className="object-cover w-full h-full"
                        />
                      </motion.div>
                    </div>

                    {/* Class name and time — slides in from the right at step 4. */}
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{
                        opacity: uiVisible ? 1 : 0,
                        x:       uiVisible ? 0 : 8,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut" as const,
                        delay: i * 0.05,
                      }}
                      className="flex-1 min-w-0"
                      // flex-1   → takes all remaining space in the row.
                      // min-w-0  → allows text to truncate if the column is narrow.
                    >
                      <p className="font-instrument text-black-axis text-xs font-semibold leading-tight">
                        {item.name}
                      </p>
                      {/*
                        text-black-axis → #000000. Intentionally dark because this element
                        sits on the white website panel, not the dark brand background.
                        text-black-axis/50 → 50% opacity = muted subtext for time/instructor.
                      */}
                      <p className="font-instrument text-black-axis/50 text-xs leading-tight mt-0.5">
                        {item.time} — {item.instructor}
                      </p>
                    </motion.div>

                    {/* Book button for each schedule row. */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: uiVisible ? 1 : 0 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut" as const,
                        delay: i * 0.05,
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="font-instrument text-xs text-black-axis border border-black-axis/20 rounded px-3 py-1 shrink-0"
                      // border-black-axis/20 → very subtle 1px border on white background.
                      // shrink-0             → button never compresses in the flex row.
                    >
                      Book
                    </motion.button>

                  </div>
                ))}
              </div>

              {/* ── C. PRICING CARDS ─────────────────────────────────────── */}
              {/*
                3 equal-width cards in a row.
                Each card: name / price / CTA button.
                The entire row fades in as one unit at step 4 (slight delay offset).
              */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: uiVisible ? 1 : 0,
                  y:       uiVisible ? 0 : 8,
                }}
                transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.1 }}
                // delay: 0.1 → pricing appears slightly after the first schedule row.
                className="mt-5 grid grid-cols-3 gap-2"
              >
                {PRICING_CARDS.map((card) => (
                  <div
                    key={card.name}
                    className="bg-black-axis/5 rounded-lg p-3 flex flex-col gap-1"
                    // bg-black-axis/5 → black at 5% opacity = a very faint grey tint
                    //                   on the white panel background.
                  >
                    <p className="font-instrument text-black-axis text-xs font-semibold leading-tight">
                      {card.name}
                    </p>
                    <p className="font-playfair text-black-axis text-lg font-bold leading-tight">
                      {card.price}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.35, ease: "easeOut" as const }}
                      className="font-instrument text-xs text-white-axis bg-black-axis rounded px-2 py-1 mt-1"
                    >
                      {card.cta}
                    </motion.button>
                  </div>
                ))}
              </motion.div>

              {/* ── D. SECONDARY CTA ─────────────────────────────────────── */}
              {/* A plain text link styled with underline. Uses <button> (not <a>)
                  because it performs an action, not navigation. */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: uiVisible ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" as const, delay: 0.2 }}
                className="mt-4 text-center"
              >
                <button className="font-instrument text-xs text-black-axis/50 underline">
                  View full schedule
                </button>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
