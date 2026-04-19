"use client"
// ^ This directive tells Next.js to render this component in the browser, not
// on the server. We need it because Framer Motion's whileInView and whileHover
// hooks rely on browser APIs (IntersectionObserver, pointer events).

import { motion } from "framer-motion"
// ^ Framer Motion is our animation library. `motion` is a factory that wraps
// standard HTML elements (div, article, p…) and adds animation superpowers.

import Image from "next/image"
// ^ Next.js's optimised image component. Always use this instead of <img> —
// it automatically handles lazy-loading, WebP conversion, and correct sizing.

// ─── Types ────────────────────────────────────────────────────────────────────
// TypeScript interface: like a Python dataclass definition, it describes the
// "shape" of each testimonial object so TypeScript can catch typos at build time.
interface Testimonial {
  id: number
  name: string
  role: string
  // logo: path to the client's logo file, served from the /public folder.
  // In Next.js, files in /public are available at the root URL — so
  // "/testimonials/logo-soriano.png" maps to public/testimonials/logo-soriano.png.
  logo: string
  text: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Defined outside the component so it isn't re-created on every render.
// In Python terms, think of this as a module-level constant.
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Luis Soriano",
    role: "Founder · Grupo Soriano",
    logo: "/testimonials/logo-soriano.png",
    text: "I've worked with many Software companies, but working with this was different. Communication was clear, deadlines were always respected, and the attention to detail really stood out. The final result felt polished, professional, and exactly what I needed. It made the whole process easy.",
  },
  {
    id: 2,
    name: "Overhands Club",
    role: "Boxing Studio",
    logo: "/testimonials/logo-overhandz.png",
    text: "The preview already showed how powerful this could be for our gym. The design looks professional, the structure is clear, and it actually feels like something that could bring in more clients. It's a big step up from relying only on Instagram.",
  },
]

// ─── Animation variants ───────────────────────────────────────────────────────
// Framer Motion "variants" are named animation states. The `container` variant
// does nothing visually itself — its only job is to stagger its children by 0.12s
// so each card animates in one after the other rather than all at once.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

// Each card fades up from y=20px to y=0 with a slow, confident 0.7s ease.
// `hidden` = initial state (invisible, shifted down 20px).
// `show`   = final state (fully visible, at natural position).
// `as const` narrows the `ease` type from `string` to the literal "easeOut"
// so it satisfies Framer Motion's strict Easing union type.
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TestimonialSection() {
  return (
    // bg-grey-axis: brand secondary dark background (#121212).
    // Using a slightly lighter dark than bg-black-axis creates a visual
    // section break that feels intentional without breaking the dark theme.
    // py-20 px-6: mobile padding. md:py-36 md:px-12: desktop padding.
    <section className="bg-grey-axis py-20 px-6 md:py-36 md:px-12">

      {/* max-w-6xl mx-auto: constrains content to ~1152px and centers it.
          This prevents lines from stretching too wide on ultra-wide screens. */}
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ────────────────────────────────────────────────── */}
        {/* motion.div with whileInView: this block fades up when it enters the
            viewport. viewport={{ once: true }} means it plays only once. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          {/* Small muted eyebrow label — uppercase, wide-tracked, soft grey.
              This is the brand subheading style: font-instrument uppercase tracking-widest. */}
          <p className="font-instrument uppercase tracking-widest text-xs text-soft-grey mb-4">
            Testimonials
          </p>

          {/* h2 because the page has exactly one h1 in the Hero (SEO rule).
              font-playfair uppercase tracking-tight: brand headline style.
              text-white-axis: white headline on dark background — primary brand contrast.
              max-w-xl keeps the line short and punchy. */}
          <h2 className="font-playfair uppercase tracking-tight text-white-axis text-3xl md:text-5xl max-w-xl">
            Studios and companies trust the system
          </h2>
        </motion.div>

        {/* ── Cards container ───────────────────────────────────────────────── */}
        {/*
          flex-col: cards stack vertically on every screen size — both mobile
          and desktop. gap-8 = 32px gap between cards.

          variants={container}: this element orchestrates the staggered
          entry of its children when it scrolls into view (whileInView="show").
        */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          {/*
            Array.map in JSX is like a Python for-loop that returns HTML.
            For each testimonial object `t`, we render one card.
            `key={t.id}` is required by React to track list items efficiently —
            like a primary key in a database.
          */}
          {testimonials.map((t) => (
            // motion.article: semantic HTML for a self-contained piece of content.
            // variants={item}: this card plays the fade-up animation when the
            //   parent container triggers its "show" state (staggered entry).
            // whileHover: lifts the card 2px when the mouse hovers over it.
            // transition: element-level fallback — used by whileHover (0.35s).
            //   The variant's own transition (0.7s) takes over for the entry animation.
            <motion.article
              key={t.id}
              variants={item}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.35, ease: "easeOut" as const }}
              // bg-black-axis: pure black card on the dark grey section background —
              //   creates depth and layering consistent with the brand system.
              // border border-white-axis/10: white border at 10% opacity.
              //   /10 is a Tailwind opacity modifier — no hex value needed.
              //   Gives the card a subtle glowing edge on the dark background.
              // rounded-2xl: 16px corner radius.
              // p-8: 32px padding on all sides.
              className="bg-black-axis border border-white-axis/10 rounded-2xl p-8"
            >
              {/* ── Top row: logo + identity ─────────────────────────────────── */}
              {/* flex items-center: horizontal row, vertically centered.
                  gap-4 = 16px between logo and the name/role block. */}
              <div className="flex items-center gap-4 mb-8">

                {/* Logo container — fixed height so both logos align consistently.
                    h-10 = 40px height. w-auto lets the width scale with the logo's
                    natural aspect ratio. overflow-hidden clips any overflow. */}
                <div className="relative h-10 w-16 flex-shrink-0">
                  {/* next/image with fill: the image expands to fill its parent.
                      object-contain: scales the logo down to fit within the container
                      without cropping, preserving the aspect ratio.
                      object-left: aligns the logo to the left edge of the container.
                      Both logos have transparent backgrounds (PNG with alpha) so they
                      sit cleanly on the black card. */}
                  <Image
                    src={t.logo}
                    alt={`${t.name} logo`}
                    fill
                    className="object-contain object-left"
                  />
                </div>

                {/* Name and role text block */}
                <div>
                  {/* font-semibold: medium-bold weight, stands out from body.
                      text-white-axis: white text for maximum contrast on black card.
                      text-sm: keeps the identity row compact next to the logo. */}
                  <p className="font-instrument font-semibold text-white-axis text-sm">
                    {t.name}
                  </p>
                  {/* Role — muted and smaller. mt-1 = 4px gap below the name. */}
                  <p className="font-instrument text-soft-grey text-xs mt-1">
                    {t.role}
                  </p>
                </div>
              </div>

              {/* ── Testimonial body text ─────────────────────────────────── */}
              {/* text-soft-grey: muted body text, the standard brand body color.
                  text-base: ~16px — slightly larger than the identity row above.
                  leading-relaxed: line-height ~1.625 for comfortable reading.
                  max-w-xl: ~36rem — prevents overly long lines inside wide cards. */}
              <p className="font-instrument text-soft-grey text-base leading-relaxed max-w-xl">
                {/* &ldquo; and &rdquo; are HTML entities for typographically
                    correct curly quotation marks, unlike straight " characters. */}
                &ldquo;{t.text}&rdquo;
              </p>

              {/* ── Footer: verified badge ───────────────────────────────── */}
              {/* mt-8 = 32px top margin separates this visually from the quote. */}
              <div className="mt-8">
                {/* text-blue-axis: the single accent color used in this section.
                    tracking-widest + uppercase: matches the brand label style.
                    text-[10px]: intentionally tiny — this detail should whisper,
                    not shout. It adds trust without competing with the quote. */}
                <span className="font-instrument uppercase tracking-widest text-[10px] text-blue-axis">
                  Verified client
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
