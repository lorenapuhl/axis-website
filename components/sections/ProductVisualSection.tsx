"use client"
// "use client" tells Next.js this component runs in the BROWSER.
// We need it because useState / useEffect / useRef are React hooks that only
// work in the browser, and Framer Motion requires a live DOM.

import { motion, useInView, AnimatePresence } from "framer-motion"
// motion        → Framer Motion's animated version of any HTML element.
// useInView     → Returns true when a referenced element enters the viewport.
// AnimatePresence → Lets elements animate OUT before being removed from the DOM.
//                   Required for layoutId transitions — Framer Motion needs to
//                   detect the unmount so it can fly the element to its destination.

import { useRef, useState, useEffect } from "react"
import Image from "next/image"

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────

const SCHEDULE_ITEMS = [
  { name: "Martial Arts",  time: "08:00", instructor: "Maria L.", src: "/product_visual/img2.png" },
  { name: "Boxing Basics", time: "12:00", instructor: "Alex R.",  src: "/product_visual/img3.png" },
  { name: "Heavy Core",    time: "18:00", instructor: "Sofia M.", src: "/product_visual/img4.png" },
]

const PRICING_CARDS = [
  { name: "Drop-in",    price: "$25",     cta: "Book"     },
  { name: "10 Classes", price: "$99",     cta: "Buy pack" },
  { name: "Unlimited",  price: "$149/mo", cta: "Start"    },
]

// Each grid image has a `src` pointing to public/product_visual/ and a `role`
// describing what it maps to in the website preview panel.
const GRID_IMAGES = [
  { id: "img1", src: "/product_visual/img1.png", aspect: "aspect-[4/5]",  alt: "Wide fitness studio panorama view",                      role: "hero"     },
  { id: "img2", src: "/product_visual/img2.png", aspect: "aspect-square", alt: "Martial arts training session",                          role: "schedule" },
  { id: "img3", src: "/product_visual/img3.png", aspect: "aspect-square", alt: "Boxing training session with heavy bag workout",         role: "schedule" },
  { id: "img4", src: "/product_visual/img4.png", aspect: "aspect-[4/5]",  alt: "Pilates reformer class with precision movement focus",  role: "schedule" },
  { id: "img5", src: "/product_visual/img5.png", aspect: "aspect-square", alt: "Studio promotional post featuring class packages",      role: "pricing"  },
  { id: "img6", src: "/product_visual/img6.png", aspect: "aspect-square", alt: "Fitness studio aesthetic — natural light and equipment", role: "filler"  },
  { id: "img7", src: "/product_visual/img7.png", aspect: "aspect-square", alt: "Workout class atmosphere with motivated participants",   role: "filler"  },
  { id: "img8", src: "/product_visual/img8.png", aspect: "aspect-[4/5]",  alt: "Studio interior with clean architectural lines",        role: "filler"  },
  { id: "img9", src: "/product_visual/img9.png", aspect: "aspect-square", alt: "Fitness equipment detail shot — minimal and editorial", role: "filler"  },
]

// Only these five images physically fly to the website panel.
// img6–img9 are filler and never leave the grid.
const ANIMATED_IDS = new Set(["img1", "img2", "img3", "img4", "img5"])

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION STEPS
//
// The sequence is driven by a `step` integer that advances via setTimeout.
//
//  0 → Initial:    Instagram visible. Website panel faded (opacity 0.2).
//  1 (0.3s)  → Highlight:  img1–img5 scale up and brighten in the grid.
//  2 (0.8s)  → Flight:     Grid images UNMOUNT (AnimatePresence detects exit).
//                           Destination images MOUNT with the same layoutId.
//                           Framer Motion automatically flies each image from
//                           its measured grid position to its destination.
//                           Website panel fades to full opacity simultaneously.
//  3 (1.6s)  → UI builds:  Hero text, schedule labels, pricing text fade in.
//
// WHY layoutId WORKS HERE:
// When a motion element with layoutId="img1" unmounts, Framer Motion records its
// screen position. When another motion element with layoutId="img1" mounts anywhere
// in the tree, Framer Motion projects it back to the recorded position using CSS
// transforms, then animates those transforms to zero — creating the illusion of
// the element flying across the screen.
//
// OVERFLOW CLIPPING RULE:
// overflow-hidden must be on the layoutId motion.div itself — NOT on a parent.
// If the parent has overflow-hidden, the element gets clipped while it is still
// visually outside the parent during the flight. Putting overflow-hidden on the
// element ensures it clips only its own image content, at whatever size/position
// it occupies during the transition.
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductVisualSection() {

  // sectionRef is attached to the <section> element so useInView can watch it.
  const sectionRef = useRef<HTMLElement>(null)

  // isInView fires when 60% of the section is visible — ensures the user is
  // actually watching before the animation begins. once:false so it can retrigger.
  const isInView = useInView(sectionRef, { once: false, amount: 0.6 })

  // hasLeft fires when <1% is visible — used to reset the animation only once
  // the section is fully out of the viewport (avoids visible reverse-flight artifacts).
  const hasLeft = useInView(sectionRef, { once: false, amount: 0.01 })

  // `step` tracks the current animation phase (0–3).
  const [step, setStep] = useState(0)

  // Reset to step 0 once the section has fully scrolled out of view.
  // By the time the user scrolls back, the section starts fresh.
  useEffect(() => {
    if (!hasLeft) setStep(0)
  }, [hasLeft])

  // When the section reaches 60% visibility, advance through animation phases.
  // Timings are slower than the original to give viewers time to catch the motion.
  // Cleanup cancels pending timers if the component unmounts mid-animation.
  useEffect(() => {
    if (!isInView) return
    const t1 = setTimeout(() => setStep(s => s < 1 ? 1 : s), 700)    // highlight
    const t2 = setTimeout(() => setStep(s => s < 2 ? 2 : s), 2000)   // flight
    const t3 = setTimeout(() => setStep(s => s < 3 ? 3 : s), 4500)   // UI builds in
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [isInView])

  // ── DERIVED STATE ─────────────────────────────────────────────────────────

  // Should website UI text (hero copy, schedule, pricing) be visible?
  const uiVisible = step >= 3

  // Website panel opacity: faded before flight, full once images arrive.
  const websiteOpacity = step >= 2 ? 1 : 0.2

  // ── GRID IMAGE HIGHLIGHT ANIMATION ───────────────────────────────────────
  // Returns the Framer Motion `animate` target for a grid image.
  // Only img1–img5 get the highlight; fillers always return {}.
  // At step 2, these images unmount from the grid entirely (via AnimatePresence),
  // so no animate value is needed for step >= 2.
  function getGridAnimate(id: string): { scale?: number; filter?: string; opacity?: number } {
    if (!ANIMATED_IDS.has(id)) return {}
    if (step === 1) return { scale: 1.05, filter: "brightness(1.3)", opacity: 1 }
    return {}
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          viewport={{ once: true }}
          className="text-center mx-auto mb-20 md:mb-28 max-w-[600px]"
        >
          <h2 className="font-instrument tracking-tight text-white-axis text-3xl leading-tight">
            Your content already exists. <br />
            We turn it into a system that converts.
          </h2>
        </motion.div>

        {/* ── TWO-COLUMN GRID ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-40 items-start">

          {/* ══════════════════════════════════════════════════════════════
              LEFT — INSTAGRAM FEED
          ══════════════════════════════════════════════════════════════ */}
          <div>
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-4">
              Your Instagram
            </p>

            <div className="bg-grey-axis border border-white-axis/10 rounded-2xl p-4">

              {/* Profile header: avatar + name + handle */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="/product_visual/img5.png"
                    alt="Sports Studio Instagram profile avatar"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
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

              {/* Photo grid — 3 columns, 9 images */}
              <div className="grid grid-cols-3 gap-[6px]">
                {GRID_IMAGES.map((img) => {

                  // ── FILLER IMAGES (img6–img9) ──────────────────────────
                  // These never leave the grid. Rendered as simple motion.divs.
                  if (!ANIMATED_IDS.has(img.id)) {
                    return (
                      <motion.div
                        key={img.id}
                        className={`${img.aspect} overflow-hidden rounded-sm relative`}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.35, ease: "easeOut" as const }}
                      >
                        <Image src={img.src} alt={img.alt} fill className="object-cover" />
                      </motion.div>
                    )
                  }

                  // ── ANIMATED IMAGES (img1–img5) ───────────────────────
                  // Structure:
                  //   • Outer div — always rendered, always occupies grid space.
                  //     This prevents the remaining cells from reflowing when
                  //     the image flies away.
                  //   • Inner motion.div (with layoutId) — conditionally rendered.
                  //     Unmounts at step 2. AnimatePresence detects the unmount
                  //     and triggers the layoutId flight to the destination.
                  //   • Placeholder div — shown after the image has left.
                  //     Very faint so the grid still reads as "posts, but extracted."
                  return (
                    <div key={img.id} className={`${img.aspect} relative`}>

                      {/* ── PERMANENT BACKGROUND LAYER ──────────────────────
                          Always visible at 50% opacity. Before step 2 it is
                          covered by the flying copy on top. After the flying copy
                          departs, this remains so the grid never shows a hole —
                          the viewer can still read which images "came from" Instagram.
                          overflow-hidden clips the Image to the rounded cell. */}
                      <div className="absolute inset-0 overflow-hidden rounded-sm opacity-50">
                        <Image src={img.src} alt={img.alt} fill className="object-cover" />
                      </div>

                      {/* ── FLYING COPY ──────────────────────────────────────
                          Present only at step < 2. At step 2 it unmounts so
                          Framer Motion can fly it (via layoutId) to its destination
                          in the website preview panel. The permanent layer behind
                          it is already in place — no grey gap appears. */}
                      <AnimatePresence>
                        {step < 2 && (
                          <motion.div
                            key="active"
                            layoutId={img.id}
                            animate={getGridAnimate(img.id)}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            whileHover={{ scale: 1.03 }}
                            className="absolute inset-0 overflow-hidden rounded-sm"
                          >
                            <Image src={img.src} alt={img.alt} fill className="object-cover" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT — WEBSITE PREVIEW
              Fades from opacity 0.2 → 1 as images arrive at step 2.
          ══════════════════════════════════════════════════════════════ */}
          <div>
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-4">
              Your website
            </p>

            <motion.div
              initial={{ opacity: 0.2, y: 10 }}
              animate={{ opacity: websiteOpacity, y: step >= 2 ? 0 : 10 }}
              transition={{ duration: 0.7, ease: "easeOut" as const }}
              className="bg-white-axis rounded-2xl p-6"
            >

              {/* ── A. HERO BLOCK ─────────────────────────────────────── */}
              {/*
                No overflow-hidden on this outer div.
                The layoutId motion.div below carries its own overflow-hidden
                so img1 stays clipped to its own bounds while flying in.
              */}
              <div className="h-40 rounded-xl relative bg-black-axis/10">

                <AnimatePresence>
                  {step >= 2 && (
                    <motion.div
                      layoutId="img1"
                      // layoutId="img1" matches the grid cell's layoutId.
                      // When the grid version unmounts and this mounts,
                      // Framer Motion flies the element between the two positions.
                      className="absolute inset-0 rounded-xl overflow-hidden"
                      transition={{ duration: 1.4, ease: "easeInOut" }}
                    >
                      <Image
                        src="/product_visual/img1.png"
                        alt="Wide fitness studio panorama — website hero background image"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dark scrim — sits above the image so hero text is legible */}
                <div className="absolute inset-0 bg-black-axis/50 rounded-xl z-10" />

                {/* Hero text + CTA — fades in at step 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: uiVisible ? 1 : 0, y: uiVisible ? 0 : 8 }}
                  transition={{ duration: 0.5, ease: "easeOut" as const }}
                  className="absolute bottom-4 left-4 flex flex-col gap-2 z-20"
                >
                  <p className="font-instrument text-white-axis text-sm font-semibold leading-snug">
                    Train smarter.<br />Book instantly.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.35, ease: "easeOut" as const }}
                    className="bg-black-axis text-white-axis font-instrument text-xs font-semibold rounded-lg px-3 h-9 w-fit"
                  >
                    Book a class
                  </motion.button>
                </motion.div>

              </div>

              {/* ── B. SCHEDULE LIST ─────────────────────────────────── */}
              <div className="mt-5 flex flex-col gap-3">
                {SCHEDULE_ITEMS.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">

                    {/* Thumbnail destination for img2 (i=0), img3 (i=1), img4 (i=2).
                        No overflow-hidden on the outer div — see OVERFLOW CLIPPING RULE. */}
                    <div className="w-12 h-12 relative bg-black-axis/10 rounded-lg shrink-0">
                      <AnimatePresence>
                        {step >= 2 && (
                          <motion.div
                            layoutId={`img${i + 2}`}
                            // i=0 → "img2", i=1 → "img3", i=2 → "img4"
                            // Matches the layoutId on the grid cells above.
                            className="absolute inset-0 rounded-lg overflow-hidden"
                            transition={{
                              duration: 1.4,
                              ease: "easeInOut",
                              delay: i * 0.2,
                              // 200ms stagger (was 150ms): slightly more separation
                              // between each thumbnail's flight so each is distinct.
                            }}
                          >
                            <Image
                              src={item.src}
                              alt={`${item.name} class thumbnail`}
                              fill
                              className="object-cover"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Class info — slides in from the right at step 3 */}
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: uiVisible ? 1 : 0, x: uiVisible ? 0 : 8 }}
                      transition={{ duration: 0.5, ease: "easeOut" as const, delay: i * 0.05 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="font-instrument text-black-axis text-xs font-semibold leading-tight">
                        {item.name}
                      </p>
                      <p className="font-instrument text-black-axis/50 text-xs leading-tight mt-0.5">
                        {item.time} — {item.instructor}
                      </p>
                    </motion.div>

                    {/* Book button */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: uiVisible ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" as const, delay: i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="font-instrument text-xs text-black-axis border border-black-axis/20 rounded px-3 py-1 shrink-0"
                    >
                      Book
                    </motion.button>

                  </div>
                ))}
              </div>

              {/* ── C. PRICING CARDS ─────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: uiVisible ? 1 : 0, y: uiVisible ? 0 : 8 }}
                transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.1 }}
                className="mt-5 grid grid-cols-3 gap-2"
              >
                {PRICING_CARDS.map((card, i) => (
                  // No overflow-hidden on the card div — the layoutId motion.div
                  // below carries its own, so img5 stays clipped during flight.
                  <div
                    key={card.name}
                    className="rounded-lg p-3 flex flex-col gap-1 relative bg-black-axis/5"
                  >
                    {/* img5 (promo post) flies into the centre card (i === 1).
                        It becomes a background image at low opacity — a subtle
                        visual proof that the content came from Instagram. */}
                    {i === 1 && (
                      <AnimatePresence>
                        {step >= 2 && (
                          <motion.div
                            layoutId="img5"
                            className="absolute inset-0 rounded-lg overflow-hidden"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0.2 }}
                            // Fades from full opacity (during flight) to 20% (settled).
                            // Full opacity during flight makes the movement clearly visible.
                            transition={{ duration: 1.4, ease: "easeInOut", delay: 0.4 }}
                          >
                            <Image
                              src="/product_visual/img5.png"
                              alt="Studio promotional post — pricing card background"
                              fill
                              className="object-cover"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}

                    {/* Card text — relative z-10 so it renders above the img5 background */}
                    <p className="font-instrument text-black-axis text-xs font-semibold leading-tight relative z-10">
                      {card.name}
                    </p>
                    <p className="font-playfair text-black-axis text-lg font-bold leading-tight relative z-10">
                      {card.price}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.35, ease: "easeOut" as const }}
                      className="font-instrument text-xs text-white-axis bg-black-axis rounded px-2 py-1 mt-1 relative z-10"
                    >
                      {card.cta}
                    </motion.button>
                  </div>
                ))}
              </motion.div>

              {/* ── D. SECONDARY CTA ─────────────────────────────────── */}
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
