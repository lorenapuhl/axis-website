// "use client" tells Next.js to run this file in the browser, not on the server.
// By default, Next.js renders components on the server (like a Python script that
// outputs HTML). But this header needs to listen to scroll events, which only
// exist in the browser — so we opt into client-side rendering here.
// This directive MUST be the very first line of the file.
"use client"

// React hooks: useState and useEffect are functions React gives us to manage
// behaviour inside a component.
//   - useState: like a variable, but when it changes, React re-renders the UI.
//   - useEffect: like an event listener setup — runs code after the component
//     appears in the browser (analogous to window.onload in plain JS).
import { useEffect, useState } from "react"

// Link is Next.js's replacement for <a href>. It handles client-side navigation
// (no full page reload) and prefetches pages in the background for speed.
// Think of it as a smarter <a> tag — use it for every internal link.
import Link from "next/link"
import Image from "next/image"

// Framer Motion is the animation library used throughout this project.
// `motion` is a function that wraps any HTML element and gives it animation
// superpowers — like whileHover, animate, and scroll-triggered effects.
import { motion, AnimatePresence } from "framer-motion"
// AnimatePresence: lets the drawer and backdrop play their exit animations
// before being removed from the DOM (the slide-out and fade-out effects).

// motion(Link) creates a version of Next.js's Link component that also accepts
// Framer Motion animation props (like whileHover). You can't pass whileHover
// directly to a plain <Link>, so we wrap it first.
const MotionLink = motion(Link)

// NAV_LINKS is defined outside the component so it isn't recreated on every
// render. In React, everything inside a function component re-runs when the
// component updates — constants that never change belong outside.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Our Work", href: "/our-work" },
  { label: "About", href: "/about" },
]

// A React component is just a function that returns JSX (HTML-like syntax).
// `export default` makes this the main thing exported from this file, so other
// files can import it by name: import HeaderSection from "..."
export default function HeaderSection() {

  // useState(false) creates a state variable `scrolled` that starts as false.
  // `setScrolled` is the setter — calling setScrolled(true) updates the value
  // AND tells React to re-render this component with the new value.
  // Think of it like: scrolled = False in Python, but with automatic UI updates.
  const [scrolled, setScrolled] = useState(false)

  // menuOpen: tracks whether the mobile slide-in drawer is visible.
  // false = closed (default), true = open.
  const [menuOpen, setMenuOpen] = useState(false)

  // useEffect runs once after the component first appears in the browser.
  // The empty array [] at the end is the "dependency list" — an empty list means
  // "run this effect only once, on mount." If we listed [scrolled] it would
  // re-run every time scrolled changed (we don't want that here).
  useEffect(() => {
    // Every time the user scrolls, check if they've gone past 10px.
    // If yes, setScrolled(true) triggers a re-render and the header background fades in.
    const handleScroll = () => setScrolled(window.scrollY > 10)

    // { passive: true } is a performance hint to the browser: "this listener
    // won't call preventDefault(), so you don't need to wait for it before
    // scrolling." This keeps scrolling smooth on mobile.
    window.addEventListener("scroll", handleScroll, { passive: true })

    // The function returned from useEffect is a "cleanup" function.
    // React calls it when the component is removed from the page, preventing
    // memory leaks — like closing a file handle in Python.
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scrolling when the mobile menu is open.
  // This prevents the page from scrolling behind the drawer overlay.
  // The cleanup function restores scrolling if the component unmounts while open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  // JSX looks like HTML but it's actually JavaScript. A few key differences:
  //   - `className` instead of `class` (class is a reserved word in JS)
  //   - Curly braces {} embed any JS expression inline, like f-strings in Python
  //   - Self-closing tags must have a slash: <img /> not <img>
  // JSX looks like HTML but it's actually JavaScript. A few key differences:
  //   - `className` instead of `class` (class is a reserved word in JS)
  //   - Curly braces {} embed any JS expression inline, like f-strings in Python
  //   - Self-closing tags must have a slash: <img /> not <img>
  // The outer <> … </> is a React Fragment — it groups multiple elements without
  // adding an extra DOM node (no <div> wrapper). We need it because JSX must
  // return a single root element, but we have two: the header AND the drawer.
  return (
    <>
      {/* ── FIXED HEADER BAR ─────────────────────────────────────────── */}
      {/* motion.header is a Framer Motion-enhanced <header> element.
          `animate` accepts an object of CSS properties — Framer Motion smoothly
          interpolates between them whenever the values change.
          Here: when `scrolled` flips to true, the background transitions from
          fully transparent to #121212 (our grey-axis brand colour).
          We use actual hex values here because Framer Motion interpolates
          numerically — it can't animate between CSS variable names. */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        // fixed: positions the header relative to the viewport, not the page —
        //        it stays pinned at the top as the user scrolls.
        // z-50: stacking order — ensures the header sits above all page content.
        animate={{ backgroundColor: scrolled ? "#121212" : "rgba(0,0,0,0)" }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        // duration 0.5s: slow and confident — matches the brand feel.
        // easeOut: starts fast, decelerates to a stop. Never use linear or bounce.
      >
        {/* max-w-6xl mx-auto: centres content and caps width at 72rem so the
            layout doesn't stretch uncomfortably on very wide screens.
            px-6 md:px-12: mobile gets 24px side padding; md: (≥768px) gets 48px.
            flex items-center justify-between: horizontal row, vertically centred,
            with logo pushed left and nav pushed right. */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">

          {/* ── Logo lockup ─────────────────────────────────────────────── */}
          {/* flex items-center gap-3: places the SVG mark and text side-by-side
              with 12px of space between them. */}
          <div className="flex items-center gap-3">

            {/* next/image is required for all images in this project — never use
                a raw <img> tag. next/image automatically optimises the file
                (resizes, converts to WebP, lazy-loads) and prevents layout shift
                by reserving space before the image loads.
                width/height tell Next.js the rendered size in pixels so it can
                generate the correct optimised variant. */}
            <Image
              src="/logo.png"
              alt="AXIS logo"
              width={70}
              height={70}
            />

            {/* flex flex-col: stacks the wordmark and subtitle vertically.
                leading-none: removes default line-height so the two lines sit tight.
                gap-[3px]: 3px of space between wordmark and subtitle — [x] syntax
                lets us use an arbitrary value not in Tailwind's default scale. */}
            <div className="flex flex-col leading-none gap-[3px]">

              {/* font-playfair: Playfair Display serif — used for all headlines.
                  uppercase tracking-tight: all-caps, slightly compressed letter spacing.
                  text-white-axis: white from our brand token, not raw "white". */}
              <span className="font-playfair uppercase tracking-tight text-white-axis text-base font-bold leading-none">
                AXIS
              </span>

              {/* font-instrument: Instrument Sans — used for all body/UI text.
                  tracking-widest: maximum letter spacing from Tailwind's scale (0.1em)
                  text-soft-grey: muted grey token for secondary text.
                  text-[8px]: arbitrary size — smaller than Tailwind's smallest preset. */}
              <span className="font-instrument uppercase tracking-widest text-soft-grey text-[8px] leading-none">
                Client Conversion Systems
              </span>
            </div>
          </div>

          {/* ── Desktop Navigation ──────────────────────────────────────── */}
          {/* hidden md:flex: the nav is display:none on mobile (< 768px) and
              becomes a flex row on medium screens and up. */}
          <nav className="hidden md:flex items-center gap-8">

            {/* .map() iterates over NAV_LINKS and returns a JSX element for each.
                This is equivalent to a for-loop that builds a list of HTML in Python.
                The result is an array of <MotionLink> elements rendered side-by-side. */}
            {NAV_LINKS.map(({ label, href }) => (
              // `key` is required by React whenever you render a list. It lets React
              // identify which item changed/moved/was removed when the list updates.
              // Use a stable unique value — here, the link label works fine.
              <MotionLink
                key={label}
                href={href}
                className="font-instrument uppercase tracking-[0.15em] text-white-axis text-xs"
                // tracking-[0.15em]: slightly wide letter spacing for a refined UI feel.

                // whileHover: Framer Motion animates to these values when the user
                // hovers. When they stop hovering, it animates back automatically.
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
                // 0.3s is the shortest duration we use — appropriate for a quick hover.
              >
                {/* {label} renders the string value from the NAV_LINKS object,
                    equivalent to {{ label }} in a Jinja2 template. */}
                {label}
              </MotionLink>
            ))}
          </nav>

          {/* ── Hamburger Button (mobile only) ──────────────────────────── */}
          {/* md:hidden: visible only below the md breakpoint (< 768px).
              Three <span> elements form the classic "three-line" hamburger icon.
              Each span is a thin white horizontal bar (1px tall, 24px wide).
              gap-[5px]: 5px between each bar for clear visual separation. */}
          <motion.button
            className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            // whileHover: dims the icon slightly to acknowledge the touch target.
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
          >
            <span className="block w-6 h-px bg-white-axis" />
            <span className="block w-6 h-px bg-white-axis" />
            <span className="block w-6 h-px bg-white-axis" />
          </motion.button>

        </div>
      </motion.header>

      {/* ── Mobile Drawer + Backdrop ─────────────────────────────────────── */}
      {/* AnimatePresence: detects when `menuOpen` changes and lets both the
          backdrop and drawer animate OUT before being removed from the DOM.
          Without AnimatePresence, removing an element is instant — no exit animation. */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* ── BACKDROP ──────────────────────────────────────────────── */}
            {/* Semi-transparent overlay that dims the page behind the drawer.
                fixed inset-0: covers the entire viewport.
                z-40: sits below the drawer (z-50) but above all page content.
                Clicking the backdrop closes the menu. */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black-axis/70 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* ── SLIDE-IN DRAWER ───────────────────────────────────────── */}
            {/* The drawer slides in from the right edge of the screen.
                initial x: "100%" — starts completely off-screen to the right.
                animate x: 0      — slides into its natural position.
                exit   x: "100%" — slides back out on close.
                fixed top-0 right-0 h-screen: pinned to top-right, full height.
                w-72: 288px wide — wide enough to read links, narrow enough
                      that the backdrop peek gives context to the page behind.
                z-50: above the backdrop (z-40) and all page content. */}
            <motion.nav
              key="drawer"
              aria-label="Mobile navigation"
              className="fixed top-0 right-0 h-screen w-72 bg-grey-axis z-50 flex flex-col px-8 pt-8 pb-12"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" as const }}
            >

              {/* ── CLOSE BUTTON ────────────────────────────────────────── */}
              {/* self-end: pushes the button to the right edge of the drawer.
                  mb-12: generous space between the X and the first nav link. */}
              <motion.button
                onClick={() => setMenuOpen(false)}
                className="self-end mb-12 text-soft-grey"
                aria-label="Close navigation menu"
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
              >
                {/* Inline SVG X icon — no external library needed for a single icon. */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 4l12 12M16 4L4 16" />
                </svg>
              </motion.button>

              {/* ── NAV LINKS ───────────────────────────────────────────── */}
              {/* Stacked vertically with generous gap (32px) for easy tapping.
                  font-playfair uppercase: large editorial serif links — matches
                  the brand voice and gives the drawer a clean, high-end feel. */}
              <div className="flex flex-col gap-8">
                {NAV_LINKS.map(({ label, href }) => (
                  <MotionLink
                    key={label}
                    href={href}
                    // Clicking a link navigates AND closes the drawer.
                    onClick={() => setMenuOpen(false)}
                    className="font-instrument uppercase tracking-tight text-white-axis text-base leading-none"
                    whileHover={{ opacity: 0.6 }}
                    transition={{ duration: 0.3, ease: "easeOut" as const }}
                  >
                    {label}
                  </MotionLink>
                ))}
              </div>

            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
