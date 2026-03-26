"use client"
// "use client" tells Next.js this component runs in the browser, not the server.
// Required because Framer Motion needs browser APIs (viewport intersection observer)
// to trigger scroll-based animations.

// motion is Framer Motion's core primitive. Any element wrapped in motion.*
// (motion.div, motion.h1, etc.) can be animated declaratively via props instead
// of writing raw CSS keyframes or transition classes.
import { motion } from "framer-motion"

// Official SVG brand logos as React components from Simple Icons.
// Each accepts a `color` prop (SVG fill) and a `size` prop (width/height in px).
// Passing color="currentColor" makes the icon inherit the CSS text color from
// its parent element, so we can tint it using Tailwind text-* classes.
import {
  SiInstagram,
  SiGoogle,
  SiStripe,
  SiGooglemaps,
  SiWhatsapp,
  SiFacebook,
  SiX,
} from "@icons-pack/react-simple-icons"

// ─── DATA ─────────────────────────────────────────────────────────────────────

// Brands shown in the scrolling marquee — platforms the product integrates with.
// `Icon` (uppercase I) is a React component reference; JSX requires components
// to start with an uppercase letter to distinguish them from HTML tags.
const BRANDS = [
  { name: "Instagram", Icon: SiInstagram },
  { name: "Google", Icon: SiGoogle },
  { name: "Stripe", Icon: SiStripe },
  { name: "Google Maps", Icon: SiGooglemaps },
  { name: "WhatsApp", Icon: SiWhatsapp },
  { name: "Facebook", Icon: SiFacebook },
  { name: "X (Twitter)", Icon: SiX },
]

// Four functional benchmarks shown in the right-side stats card.
// Each has a value (the headline number) and a label (what it measures).
const STATS = [
  { value: "<7 Days",   label: "Average Setup Time" },
  { value: "100%",      label: "Instagram Content Sync" },
  { value: "24/7",      label: "Automated Booking" },
  { value: "SEO Ready", label: "Google Search Optimized" },
]

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

// Framer Motion "variants" define named animation states. The parent `container`
// variant triggers its children to animate one after another (staggerChildren).
// This creates the effect of elements assembling from top to bottom on the left.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 }, // 120ms delay between each child
  },
}

// Each direct child of the container uses these variant states.
// hidden = invisible, shifted 20px down.
// show   = fully visible at natural position, animating over 0.8s.
const item = {
  hidden: { opacity: 0, y: 20 },
  // `as const` narrows "easeOut" from type `string` to the literal type
  // "easeOut" — Framer Motion's Variants type requires a specific Easing
  // literal, not a plain string.
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    // Responsive two-column grid.
    // Mobile (default): single column, elements stacked vertically.
    // lg (1024px+): left column spans 7/12, right column spans 5/12.
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

      {/* ── LEFT COLUMN ─────────────────────────────────────────────────────── */}
      {/*
        motion.div with variants={container} acts as the stagger orchestrator.
        It doesn't animate itself — it just controls the timing of its children.
        whileInView fires the "show" state when this element scrolls into view.
        viewport={{ once: true }} means the animation only runs once per page load,
        not every time the element enters/exits the viewport.
      */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8"
      >

        {/* Badge — live indicator pill */}
        <motion.div variants={item}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
            {/*
              Pulsing live dot — two overlapping circles.
              The outer span (the ripple) scales outward and fades with Framer Motion,
              replacing Tailwind's animate-ping so all animations stay in one system.
              The inner span is the solid anchor dot that stays visible.
            */}
            <span className="relative flex h-2 w-2">
              <motion.span
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.7, 0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inline-flex h-full w-full rounded-full bg-blue-axis"
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-axis" />
            </span>
            <span className="font-instrument text-xs font-semibold uppercase tracking-[0.2em] text-blue-axis">
              For Fitness Studios
            </span>
          </div>
        </motion.div>

        {/*
          H1 — the one and only page headline.
          SEO rule: exactly one <h1> per page. This is it.
          All other section headlines must use <h2>.

          font-playfair: Playfair Display (editorial serif — brand headline font)
          uppercase: all-caps treatment per AXIS brand style
          tracking-tight: tight letter spacing for large display type
          text-white-axis: brand white (#FFFFFF)
          leading-[0.9]: very compressed line height — standard for oversized display type
        */}
        <motion.h1
          variants={item}
          className="font-playfair uppercase tracking-tight text-white-axis text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9]"
        >
          Turn Your Instagram Feed Into a{" "}
          {/* {" "} inserts a literal space — JSX collapses whitespace without it */}
          <span className="text-blue-axis">Booking Machine.</span>
        </motion.h1>

        {/* Subtitle — body copy that explains the product value proposition */}
        <motion.p
          variants={item}
          className="font-instrument text-soft-grey text-lg leading-relaxed max-w-xl"
        >
          We build high-converting websites for boutique fitness studios that sync
          automatically with your Instagram. Stop chasing DMs and start selling
          memberships 24/7.
        </motion.p>

        {/*
          Primary CTA button.
          The outer motion.div carries the stagger `item` variant so it animates
          in sequence with the rest of the left column content.
          The inner motion.button adds an independent hover scale effect.
          whileHover runs separately from the entry animation — they don't conflict.
        */}
        <motion.div variants={item}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white-axis text-black-axis font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
          >
            Get your AXIS
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── RIGHT COLUMN ────────────────────────────────────────────────────── */}
      {/*
        The right column fades in as one block, delayed 300ms so the left column
        leads. Using a single animation on the whole column (not staggered children)
        keeps the right side from feeling too busy relative to the left.
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: true }}
        className="lg:col-span-5 space-y-6 lg:mt-12"
      >

        {/* ── Stats Card ──────────────────────────────────────────────────── */}
        {/*
          Glassmorphism card — creates a frosted-glass surface.
          backdrop-blur-md: blurs content visually behind the card (browser compositing)
          bg-white/5: white at 5% opacity — barely-there tinted background
          border-white/10: white border at 10% opacity — subtle card edge
          relative overflow-hidden: clips the decorative glow to the card boundary
        */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl">

          {/* Decorative corner glow — a large blurred circle clipped by the card */}
          <div
            aria-hidden
            className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none"
          />

          {/*
            2×2 stats grid. .map() iterates the STATS array and returns a JSX
            element for each entry — equivalent to a Python for loop building
            a list of HTML nodes. `key` must be unique per item so React can
            track changes efficiently.
          */}
          <div className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                {/* Stat headline — large serif number/label */}
                <span className="font-playfair text-white-axis text-2xl tracking-tight">
                  {stat.value}
                </span>
                {/* Stat description — small muted label below the number */}
                <span className="font-instrument text-soft-grey text-xs uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Brand Marquee Card ──────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 py-8 backdrop-blur-md">

          {/* Section label */}
          <p className="mb-6 px-8 font-instrument text-soft-grey text-xs uppercase tracking-widest">
            Integrated with the Tools You Use
          </p>

          {/*
            Fade-edge mask — Tailwind has no utility for mask-image, so this
            inline style is the correct and necessary approach. It creates a
            gradient mask that fades the strip to transparent at both edges,
            giving the impression that the list extends beyond the card.
            WebkitMaskImage is the Safari-compatible version of the same property.
          */}
          <div
            className="relative flex overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            }}
          >
            {/*
              Framer Motion marquee — replaces the original CSS @keyframes marquee.
              animate={{ x: ["0%", "-50%"] }} slides the strip from its natural
              position to exactly half its width to the left, then loops instantly.
              Because the brand list is duplicated ([...BRANDS, ...BRANDS]),
              -50% lands exactly where the original list started, making the
              loop seamless with no visible jump or gap.

              ease: "linear" is essential — any other easing would cause a
              visible speed ramp at each loop boundary.
              repeat: Infinity keeps it running indefinitely.
            */}
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-10 whitespace-nowrap px-4"
            >
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                /*
                  Each brand item:
                  - initial={{ opacity: 0.3 }}: starts dimmed (30% opacity)
                  - whileHover={{ opacity: 1 }}: brightens to full on hover

                  The text-soft-grey class on the wrapper sets the CSS `color`
                  property. The icon uses color="currentColor" so it inherits
                  this value — no hardcoded hex needed.

                  Note: using index `i` as key is acceptable here because
                  the list is static and never reordered.
                */
                <motion.div
                  key={i}
                  initial={{ opacity: 0.3 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-center gap-2 cursor-default text-soft-grey"
                >
                  {/* color="currentColor" inherits the text-soft-grey value from the parent */}
                  <brand.Icon color="currentColor" size={18} />
                  <span className="font-instrument text-sm font-medium tracking-wide">
                    {brand.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
