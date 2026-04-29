"use client"
// FeaturesHubSection — the /features index page.
// Displays all AXIS platform features organized into three categories,
// each linking to its own dedicated sub-page.

import { motion } from "framer-motion"
import Link from "next/link"
// useCTAModal: pulls the openModal() function from CTAContext so clicking
// "Get your AXIS" opens the booking funnel modal.
import { useCTAModal } from "@/components/cta/CTAContext"

// CATEGORIES defines the three feature groups displayed in three columns.
// Each feature has a name (headline), description (subline), and an internal href.
// `as const` tells TypeScript to treat every string as a literal — prevents accidental mutation.
const CATEGORIES = [
  {
    label: "Run Your Operations",
    features: [
      { name: "Scheduling & Booking",    description: "Fewer clicks, fuller classes",          href: "/features/scheduling-booking"      },
      { name: "Payments",                description: "Secure, automatic, always on time",      href: "/features/payments"                },
      { name: "Membership Management",   description: "Flexible and retention-driven",           href: "/features/membership-management"   },
      { name: "Team & Payroll",          description: "Retain your instructors",                 href: "/features/team-payroll"            },
    ],
  },
  {
    label: "Reach Your Members",
    features: [
      { name: "Marketing Essentials",    description: "Engage from day one",                    href: "/features/marketing"               },
      { name: "Audience",                description: "Behaviour-based targeting",               href: "/features/audience"                },
      { name: "Integrations",            description: "Keep everything in sync",                 href: "/features/integrations"            },
    ],
  },
  {
    label: "Grow & Expand",
    features: [
      { name: "Performance Dashboard",   description: "See what's really happening",             href: "/features/performance-dashboard"   },
    ],
  },
] as const

// container: triggers child animations in a staggered sequence (0.12s apart).
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

// item: each child fades up 20px into position.
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

export default function FeaturesHubSection() {
  // openModal: calling this function opens the CTA booking funnel modal.
  const { openModal } = useCTAModal()

  return (
    // py-20 px-6 = mobile padding. md:py-36 md:px-12 = desktop padding.
    // bg-black-axis = primary brand surface (pure black).
    <section className="bg-black-axis py-20 px-6 md:py-36 md:px-12">
      {/* max-w-6xl mx-auto: caps content width at 72rem and centres it horizontally. */}
      <div className="max-w-6xl mx-auto">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        {/* variants={container}: this div is the animation parent — it staggers its children.
            whileInView: animation triggers when this element scrolls into the viewport.
            viewport={{ once: true }}: plays once and stays — never re-triggers on scroll up. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-6"
        >
          {/* Category label — small, electric blue, all-caps, very wide tracking. */}
          <motion.p
            variants={item}
            className="font-instrument uppercase tracking-widest text-blue-axis text-xs"
          >
            The AXIS Platform
          </motion.p>

          {/* h1 is the page's primary SEO headline — exactly one per page.
              font-playfair = Playfair Display serif (editorial, high-end).
              uppercase tracking-tight = brand headline style.
              leading-none = removes default line-height so the two lines sit tight together. */}
          <motion.h1
            variants={item}
            className="font-playfair uppercase tracking-tight text-white-axis text-5xl md:text-7xl leading-none"
          >
            Everything your<br />studio needs.
          </motion.h1>

          {/* Subtitle — instrument sans body copy, muted grey, max-width to keep lines short. */}
          <motion.p
            variants={item}
            className="font-instrument text-soft-grey text-base max-w-xl leading-relaxed"
          >
            One system. Every client touchpoint. Built for sports studios that convert
            browsers into committed members.
          </motion.p>
        </motion.div>

        {/* ── FEATURE CATEGORY GRID ────────────────────────────────────── */}
        {/* 3 columns on desktop (md:grid-cols-3), single column stacked on mobile. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
        >
          {/* .map() iterates over each category and renders a column. */}
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.label} variants={item}>

              {/* Category label — sits above the feature list, separated by a thin border. */}
              <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs pb-6 border-b border-white/10">
                {cat.label}
              </p>

              {/* Feature list — each item is a link to the feature's dedicated sub-page. */}
              <div className="flex flex-col">
                {cat.features.map((feature) => (
                  // Link is Next.js's internal navigation component — never use <a href> for internal links.
                  <Link key={feature.href} href={feature.href}>
                    {/* whileHover nudges the card 4px right — subtle, editorial hover feedback.
                        Never use raw CSS :hover — always use Framer Motion for interactive animations. */}
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.3, ease: "easeOut" as const }}
                      className="py-5 border-b border-white/10"
                    >
                      {/* Feature name — playfair serif, large, white */}
                      <p className="font-playfair uppercase tracking-tight text-white-axis text-lg">
                        {feature.name}
                      </p>
                      {/* Feature description — instrument sans, small, muted */}
                      <p className="font-instrument text-soft-grey text-xs mt-1 uppercase tracking-widest">
                        {feature.description}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        {/* Fades in independently from the grid above. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-24 flex justify-center"
        >
          {/* Primary button — white bg, black text, uppercase, wide tracking.
              whileHover scales up 3% — slow and confident, never bouncy. */}
          <motion.button
            onClick={openModal}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
            className="bg-white-axis text-black-axis text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
          >
            Get your AXIS
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}
