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
    text: "I've worked with many Software companies, but working with this was different. Communication was clear, deadlines were always respected, and the attention to detail really stood out. The final result felt polished, professional, and exactly what I needed. It made the whole process easy.",
  },
  {
    id: 2,
    name: "Overhands Club",
    role: "Boxing Studio",
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
// `hidden` = initial state (invisible, shifted down).
// `show`   = final state (fully visible, in position).
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TestimonialSection() {
  return (
    // bg-gray-50: very light off-white background — creates a subtle contrast
    // break between the dark FAQ section above and the dark Final CTA below.
    // py-20 px-6: mobile padding (375px). md:py-36 md:px-12: desktop padding.
    <section className="bg-gray-50 py-20 px-6 md:py-36 md:px-12">

      {/* max-w-6xl mx-auto: constrains content to ~1152px and centers it.
          This prevents lines from stretching too wide on ultra-wide screens. */}
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ────────────────────────────────────────────────── */}
        {/* motion.div with whileInView: this block fades up when it scrolls
            into the viewport. viewport={{ once: true }} means it animates
            only the first time — not every time the user scrolls past it. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          {/* Small muted label above the headline — purely decorative context.
              tracking-widest: very wide letter-spacing, typical of SaaS eyebrow labels. */}
          <p className="font-instrument uppercase tracking-widest text-xs text-soft-grey mb-4">
            Testimonials
          </p>

          {/* h2 because the page already has exactly one h1 in the Hero section.
              Every section headline must be h2 — see skills/seo.md.
              font-playfair uppercase tracking-tight: brand headline style.
              text-black-axis: dark text on light background.
              max-w-xl: keeps the headline from stretching too wide. */}
          <h2 className="font-playfair uppercase tracking-tight text-black-axis text-3xl md:text-5xl max-w-xl">
            Studios and companies trust the system
          </h2>
        </motion.div>

        {/* ── Cards container ───────────────────────────────────────────────── */}
        {/*
          Responsive layout:
          • Mobile (default): flex-row + overflow-x-auto + snap-x snap-mandatory
            creates a horizontal swipe carousel. Each card is min-w-[85%] so the
            edge of the next card peeks in to signal that more content is swipeable.
            scrollbar-none hides the native scrollbar on all browsers.
          • Desktop (md:): flex-col resets to vertical stacking, overflow-visible
            removes the scroll constraint, gap-8 adds 32px between cards.

          variants={container}: triggers the staggered entry animation when
          this element enters the viewport (whileInView="show").
        */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="
            flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-4
            md:flex-col md:overflow-visible md:gap-8 md:pb-0
          "
        >
          {/*
            Array.map in JSX is like a for-loop that returns HTML.
            For each testimonial object `t`, we render a card.
            `key={t.id}` is required by React to efficiently track list items —
            think of it as a unique primary key for the virtual DOM.
          */}
          {testimonials.map((t) => (
            <motion.article
              key={t.id}
              variants={item}
              // whileHover: lifts the card 2px when the mouse hovers over it.
              // The transition here overrides the default spring for a smoother feel.
              whileHover={{ y: -2 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              // Tailwind classes explained:
              // bg-white: white card surface.
              // border border-gray-200: subtle 1px light-gray border.
              // rounded-2xl: 16px corner radius for a modern SaaS card look.
              // p-8: 32px padding on all sides.
              // shadow-sm: very soft drop shadow.
              // min-w-[85%]: on mobile, each card takes 85% of the viewport width —
              //   the remaining 15% lets the next card peek in (tease interaction).
              // snap-start: scroll-snap aligns the left edge of each card to the viewport.
              // flex-shrink-0: prevents cards from being squished by the flex container.
              // md:min-w-0 md:w-full: on desktop, reset to full container width.
              className="
                bg-white border border-gray-200 rounded-2xl p-8 shadow-sm
                min-w-[85%] snap-start flex-shrink-0
                md:min-w-0 md:w-full
              "
            >
              {/* ── Top row: avatar + identity ──────────────────────────────── */}
              {/* flex items-center gap-4: horizontal row, vertically centered,
                  with 16px gap between avatar and text block. */}
              <div className="flex items-center gap-4 mb-6">

                {/* Circular avatar container.
                    overflow-hidden clips the square image into a circle.
                    flex-shrink-0 prevents the avatar from being squeezed. */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  {/* next/image: optimised image. Width/height must match the
                      intrinsic size so Next.js can calculate the aspect ratio.
                      alt describes the image content for screen readers and SEO. */}
                  <Image
                    src="https://placehold.co/48x48/121212/FFFFFF"
                    alt={`Avatar placeholder for ${t.name}`}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Name and role text block */}
                <div>
                  {/* font-semibold: medium-bold weight for the name.
                      text-black-axis: dark text for high contrast on white card.
                      text-sm: slightly smaller than default body to keep the
                      identity row compact next to the avatar. */}
                  <p className="font-instrument font-semibold text-black-axis text-sm">
                    {t.name}
                  </p>
                  {/* Role label — muted and smaller. mt-0.5 = 2px top margin. */}
                  <p className="font-instrument text-soft-grey text-xs mt-0.5">
                    {t.role}
                  </p>
                </div>
              </div>

              {/* ── Testimonial body text ─────────────────────────────────── */}
              {/* text-base: ~16px, slightly larger than the identity text above.
                  leading-relaxed: line-height ~1.625 for comfortable reading.
                  max-w-xl: ~36rem — prevents overly long lines in wide cards. */}
              <p className="font-instrument text-soft-grey text-base leading-relaxed max-w-xl">
                {/* &ldquo; and &rdquo; are HTML entities for curly quotation marks
                    — typographically correct, unlike straight " marks. */}
                &ldquo;{t.text}&rdquo;
              </p>

              {/* ── Footer: verified badge ───────────────────────────────── */}
              {/* mt-6 = 24px top margin to visually separate from the testimonial text. */}
              <div className="mt-6">
                {/* text-blue-axis is the single accent color used in this section.
                    text-[10px]: custom 10px size, smaller than the standard xs (12px),
                    keeping this label very subtle and secondary.
                    tracking-widest: wide letter-spacing matches other label elements. */}
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
