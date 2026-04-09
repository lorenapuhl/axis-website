"use client"
// "use client" must be the very first line — no blank lines or comments above it.
// This tells Next.js to run this file in the browser, not on the server.
// We need it here because we use useState, useEffect, and browser timers.

import { motion } from "framer-motion"
// motion is Framer Motion's special version of HTML elements.
// motion.div and motion.button accept animation props like whileHover, initial, etc.

import React, { useEffect, useRef, useState } from "react"
// useEffect: runs code after the component renders — used here to start the shuffle timer.
// useRef: holds a value (the timer ID) that won't trigger a re-render when it changes.
// useState: holds reactive state — when squares changes, the component re-renders.

// ─── Stagger animation variants (from skills/animate-section.md) ──────────────
// These two objects work as a pair. The container fires "show", which automatically
// cascades to each child — staggering them 0.12 seconds apart.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  // opacity 0 = invisible; y: 20 = shifted 20px downward
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  // Animate to fully visible and in final position over 0.7s
}

// ─── Type definition ──────────────────────────────────────────────────────────
// TypeScript requires us to declare the shape of our data — like a Python dataclass.
// Each square in the grid has a numeric id and an image URL string.
type SquareItem = {
  id: number
  src: string
}

// ─── Image data ───────────────────────────────────────────────────────────────
// TODO: Replace these placeholder URLs with real studio photos from public/.
// placehold.co generates solid-colour rectangles — dimensions are WIDTHxHEIGHT.
// Keeping all 16 as CSS background images (not <img> tags) to support
// the layout animation that repositions tiles on each shuffle.
const squareData: SquareItem[] = [
  { id: 1,  src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 2,  src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 3,  src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 4,  src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 5,  src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 6,  src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 7,  src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 8,  src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 9,  src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 10, src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 11, src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 12, src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 13, src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 14, src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 15, src: "https://placehold.co/400x400/121212/FFFFFF" },
  { id: 16, src: "https://placehold.co/400x400/121212/FFFFFF" },
]

// ─── Fisher-Yates Shuffle ─────────────────────────────────────────────────────
// A standard algorithm that randomises an array in-place.
// It walks backwards through the array and swaps each element with a random
// earlier element — guaranteeing a perfectly unbiased shuffle.
const shuffle = (array: SquareItem[]): SquareItem[] => {
  let currentIndex = array.length
  let randomIndex: number

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    // Swap currentIndex and randomIndex using array destructuring
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

// ─── Generate shuffled tile elements ─────────────────────────────────────────
// Shuffles squareData and maps each entry to a Framer Motion div.
// The `layout` prop tells Framer Motion to animate the tile smoothly
// whenever its position in the DOM changes — this is how the shuffle looks fluid.
const generateSquares = (): React.JSX.Element[] => {
  return shuffle([...squareData]).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      // layout: Framer Motion watches this element's position and animates
      // any change — so when the grid order changes, each tile glides to its new spot.
      transition={{ duration: 1.5, type: "spring" }}
      // Spring physics give the shuffle a natural, weighted feel.
      className="w-full h-full overflow-hidden bg-grey-axis"
      // bg-grey-axis: AXIS dark-grey token (#121212) — fallback while image loads.
      // No border-radius — sharp edges match the editorial brand.
      style={{
        // backgroundImage is a dynamic value (from sq.src), so an inline style
        // is necessary here — Tailwind cannot generate dynamic URLs at build time.
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  ))
}

// ─── ShuffleGrid — the animated 4×4 tile grid ────────────────────────────────
const ShuffleGrid = () => {
  // timeoutRef holds the timer ID so we can cancel it when the component unmounts.
  // useRef is used instead of useState because changing the timer ID should NOT
  // trigger a re-render — it's an implementation detail, not display data.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // squares holds the array of JSX tile elements currently rendered.
  // Every time setSquares is called with a new shuffled array, the grid re-renders
  // and Framer Motion's layout animation handles the smooth repositioning.
  const [squares, setSquares] = useState<React.JSX.Element[]>([])

  // useEffect runs after the first render — like __init__ code that needs the DOM ready.
  // The empty dependency array [] means "run once on mount, never again".
  // The returned function is a cleanup — it runs when the component is removed from
  // the page, cancelling the timer to prevent memory leaks.
  useEffect(() => {
    shuffleSquares()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // shuffleSquares generates a new shuffled array and schedules itself to run again
  // in 3 seconds — creating an infinite loop that stops only when the component unmounts.
  const shuffleSquares = () => {
    setSquares(generateSquares())
    timeoutRef.current = setTimeout(shuffleSquares, 3000)
    // 3s interval keeps the motion visible and rhythmic without being distracting.
  }

  return (
    // 4 columns × 4 rows grid, fixed height to keep the layout predictable.
    // gap-1: 4px gap between tiles — tight grid feels like a contact sheet.
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares}
    </div>
  )
}

// ─── ShuffleHero — the full hero section ─────────────────────────────────────
// This is the exported component used by ShuffleHeroSection.tsx.
// It contains the full two-column hero layout: text left, shuffle grid right.
export const ShuffleHero = () => {
  return (
    // <section> is the semantic HTML landmark for a self-contained page section.
    // bg-black-axis: AXIS primary background (#000000).
    // py-36 px-12: AXIS section padding (skills/component.md).
    // Mobile overrides (py-20 px-6) come first — mobile-first approach.
    <section className="bg-black-axis py-20 px-6 md:py-36 md:px-12">

      {/* max-w-6xl mx-auto: constrains content width and centres it horizontally. */}
      {/* grid-cols-1 on mobile stacks the columns; md:grid-cols-2 goes side-by-side. */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16">

        {/* ── Left column: text content with stagger animation ── */}
        {/* motion.div with variants="container" triggers the stagger cascade. */}
        {/* whileInView fires the animation when the element scrolls into the viewport. */}
        {/* viewport={{ once: true }} means it only animates once, not every scroll. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >

          {/* <h1> is the primary page headline — exactly ONE per page (SEO requirement). */}
          {/* font-playfair: Playfair Display (AXIS headline font). */}
          {/* uppercase tracking-tight: all-caps with tight letter-spacing — editorial feel. */}
          {/* text-white-axis: pure white (#FFFFFF) on the black background. */}
	  <motion.h1
	    variants={item}
	    className="font-playfair text-4xl md:text-6xl uppercase tracking-tight text-white-axis mb-6 leading-[0.9] md:leading-[0.9]"
	  >
	    {/* The 'mb-10' and 'md:mb-14' create the specific gap you want */}
	    <span className="block mb-10 md:mb-14">
	      Fill your <br /> classes.
	    </span>
	  
	    <span className="block">
	      Not your DM&apos;s.
	    </span>
	  </motion.h1>

          {/* Body paragraph — supporting copy below the headline. */}
          {/* font-instrument text-soft-grey: Instrument Sans in muted grey (#A1A1A1). */}
          <motion.p
            variants={item}
            className="font-instrument text-base md:text-lg text-soft-grey mb-8 md:mb-10"
          >
            AXIS builds the digital infrastructure sports studios need — bridging the gap between
            Instagram attention and consistent, booked revenue.
          </motion.p>

          {/* Primary button — AXIS standard pattern from skills/component.md. */}
          {/* motion.button: Framer Motion's <button> so we can add whileHover. */}
          {/* whileHover={{ scale: 1.03 }}: subtle scale-up on hover — no raw CSS transitions. */}
          {/* bg-white-axis text-black-axis: inverted colours (white button on black section). */}
          <motion.div variants={item}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35, ease: "easeOut" as const }}
              className="bg-white-axis text-black-axis font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
            >
              Get your AXIS
            </motion.button>
          </motion.div>

        </motion.div>

        {/* ── Right column: the animated shuffle grid ── */}
        {/* ShuffleGrid handles its own internal animation (Framer Motion layout). */}
        <ShuffleGrid />

      </div>
    </section>
  )
}
