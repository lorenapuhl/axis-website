"use client"
// "use client" must be the first line — it tells Next.js to render this component
// in the browser rather than on the server. We need it here because Framer Motion
// animations (whileInView, whileHover) require the browser's scroll and DOM APIs.

// Framer Motion: the animation library used throughout this project.
// `motion` wraps any HTML element to give it animation props like whileInView and whileHover.
import { motion } from "framer-motion"

// next/image: Next.js's optimised image component. Always use this instead of
// a raw <img> tag — it auto-resizes, converts to WebP, and prevents layout shift.
import Image from "next/image"

// next/link: Next.js's internal navigation component. Always use this instead of
// <a href> for links that stay within the site — it does a fast client-side
// navigation without a full page reload.
import Link from "next/link"

// motion(Link) creates a Framer-Motion-enhanced version of next/link so we can
// attach animation props (like whileHover) directly on it.
const MotionLink = motion(Link)

// ── Animation variants ────────────────────────────────────────────────────────
// Variants let us define named animation states and share them across elements.
// `container` controls the parent — it staggers its children 0.12s apart.
// `item` is applied to each child — they fade up from y:20 to y:0.
const container = {
  // "hidden" is the initial (invisible) state — no visible properties needed here
  // because each child item defines its own hidden state.
  hidden: {},
  show: {
    transition: {
      // staggerChildren: each direct child starts its animation 0.12s after
      // the previous one — creates the "assembling" effect.
      staggerChildren: 0.12,
    },
  },
}

const item = {
  // Starts invisible and 20px below its final position.
  hidden: { opacity: 0, y: 20 },
  // Animates to fully visible and in its natural position.
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

// ── Component ─────────────────────────────────────────────────────────────────
// `export default` makes this the primary export of the file.
// Other files import it with: import FooterSection from "@/components/sections/FooterSection"
export default function FooterSection() {
  return (
    // <section> is the required root element for all section components.
    // bg-grey-axis: secondary section background (#121212) — distinguishes the
    //   footer from the main black-axis content above.
    // py-20 px-6: mobile-first base padding (top/bottom 80px, sides 24px).
    // md:py-36 md:px-12: on medium screens (≥768px), larger padding (144px / 48px).
    <section className="bg-grey-axis py-20 px-6 md:py-36 md:px-12">

      {/* max-w-6xl mx-auto: caps content at 72rem and centres it horizontally —
          prevents the layout from stretching on ultra-wide screens.
          variants/initial/whileInView/viewport: Framer Motion scroll animation.
          `initial="hidden"` sets the starting state; `whileInView="show"` triggers
          the animation when the element enters the viewport.
          `viewport={{ once: true }}` means the animation plays only once — not
          every time the user scrolls past the section. */}
      <motion.div
        className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-12"
        // flex flex-col: stacks left and right blocks vertically on mobile.
        // md:flex-row md:justify-between: on desktop, places them side-by-side
        //   with maximum space between them.
        // gap-12: 48px of breathing room between the two blocks on mobile.
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >

        {/* ── Left block: logo + brand identity ──────────────────────────── */}
        <motion.div
          variants={item}
          // flex items-center gap-4: places the logo and text side-by-side,
          // vertically centred, with 16px space between them.
          className="flex items-center gap-4"
        >
          {/* next/image is required for all images — never a raw <img> tag.
              width and height tell Next.js what size to render the image at,
              so it can prepare the correct optimised variant. */}
          {/* mix-blend-screen: makes the PNG's solid black background transparent
              so the logo merges with the section background behind it. */}
          <Image
            src="/logo.png"
            alt="AXIS logo mark"
            width={52}
            height={52}
            className="mix-blend-screen"
          />

          {/* flex flex-col: stacks the wordmark and subtitle vertically.
              gap-[5px]: 5px space between them — square-bracket syntax lets us
              use arbitrary values not on Tailwind's default spacing scale. */}
          <div className="flex flex-col gap-[5px]">

            {/* font-playfair: Playfair Display serif — used for all headlines.
                uppercase tracking-tight: all-caps with slightly condensed letter spacing.
                text-white-axis: white from the brand token, not the raw CSS colour. */}
            <span className="font-playfair uppercase tracking-tight text-white-axis text-base font-bold leading-none">
              AXIS
            </span>

            {/* font-instrument: Instrument Sans — body/UI text.
                tracking-widest: widest letter spacing in Tailwind's scale (0.1em).
                text-soft-grey: muted grey token for secondary/supporting copy.
                text-[10px]: arbitrary size for a compact subtitle beneath the wordmark. */}
            <span className="font-instrument uppercase tracking-widest text-soft-grey text-[10px] leading-snug max-w-[200px]">
              Client conversion systems for sports studios
            </span>
          </div>
        </motion.div>

        {/* ── Right block: social links + legal ──────────────────────────── */}
        <motion.div
          variants={item}
          // flex flex-col gap-5: stacks the content vertically on both mobile and desktop.
          // md:items-end: on desktop, right-aligns everything to the container edge.
          className="flex flex-col gap-5 md:items-end"
        >

          {/* ── DESKTOP layout (hidden on mobile) ─────────────────────────────
              Instagram sits above the legal row on desktop, right-aligned. */}
          <motion.a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            // hidden: invisible on mobile — the mobile layout below handles Instagram.
            // md:block: visible on desktop as a block element.
            className="hidden md:block font-instrument uppercase tracking-[0.2em] text-white-axis text-xs w-fit"
            whileHover={{ opacity: 0.5 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
          >
            Instagram
          </motion.a>

          {/* Desktop legal row: copyright + privacy + terms on one line.
              hidden: invisible on mobile — copyright gets its own row there.
              md:flex: visible on desktop as a horizontal row. */}
          <div className="hidden md:flex md:flex-row md:gap-6 md:items-center">
            <span className="font-instrument text-soft-grey text-xs">
              © 2026 Axis | Client Conversion Systems
            </span>
            <MotionLink
              href="/PrivacyPolicy"
              className="font-instrument text-soft-grey text-xs uppercase tracking-[0.15em]"
              whileHover={{ opacity: 0.5 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
            >
              Privacy Policy
            </MotionLink>
            <MotionLink
              href="/TermsOfService"
              className="font-instrument text-soft-grey text-xs uppercase tracking-[0.15em]"
              whileHover={{ opacity: 0.5 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
            >
              Terms of Service
            </MotionLink>
          </div>

          {/* ── MOBILE layout (hidden on desktop) ─────────────────────────────
              justify-between: pushes Privacy/Terms to the left and Instagram to the right.
              items-start: aligns both columns to the top so they don't stretch. */}
          <div className="flex justify-between items-start md:hidden w-full">

            {/* Left column: Privacy Policy and Terms of Service stacked vertically. */}
            <div className="flex flex-col gap-3">
              <MotionLink
                href="/PrivacyPolicy"
                className="font-instrument text-soft-grey text-xs uppercase tracking-[0.15em]"
                whileHover={{ opacity: 0.5 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
              >
                Privacy Policy
              </MotionLink>
              <MotionLink
                href="/TermsOfService"
                className="font-instrument text-soft-grey text-xs uppercase tracking-[0.15em]"
                whileHover={{ opacity: 0.5 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
              >
                Terms of Service
              </MotionLink>
            </div>

            {/* Right column: Instagram link aligned to the right. */}
            <motion.a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-instrument uppercase tracking-[0.2em] text-white-axis text-xs"
              whileHover={{ opacity: 0.5 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
            >
              Instagram
            </motion.a>
          </div>

          {/* Copyright — mobile only, sits at the very bottom of the footer.
              Desktop copyright is inside the legal row above. */}
          <span className="md:hidden font-instrument text-soft-grey text-xs">
            © 2026 Axis | Client Conversion Systems
          </span>

        </motion.div>
      </motion.div>
    </section>
  )
}
