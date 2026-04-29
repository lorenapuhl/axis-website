"use client"
// FeaturesHubSection — the /features index page.
// Displays all AXIS platform features organised into three categories,
// each as a grid of icon cards linking to their dedicated sub-page.

import { motion } from "framer-motion"
import Link from "next/link"
// useCTAModal: pulls the openModal() function from CTAContext so clicking
// "Get your AXIS" opens the booking funnel modal.
import { useCTAModal } from "@/components/cta/CTAContext"

// ── SVG ICON COMPONENTS ──────────────────────────────────────────────────────
// All icons use stroke="currentColor" so the colour is set by a Tailwind text-* class.
// This avoids hardcoded hex values in SVG attributes (a project rule violation).
// strokeWidth={1.5} + round caps = clean, editorial line style.

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  )
}

function CreditCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </svg>
  )
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
      <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <path d="M3 11v2h4l5 5V6L7 11H3Z" />
      <path d="M16 8a4 4 0 0 1 0 8" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function TrendingUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  )
}

// ArrowRight: small directional cue shown on each feature card.
function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

// ── DATA ─────────────────────────────────────────────────────────────────────
// CATEGORIES defines the three feature groups.
// Each feature has: name, description, href (internal), and Icon (a React component).
// `as const` tells TypeScript to treat every string as a literal.
const CATEGORIES = [
  {
    label: "Run Your Operations",
    features: [
      {
        name:        "Scheduling & Booking",
        description: "Fewer clicks, fuller classes",
        href:        "/features/scheduling-booking",
        Icon:        CalendarIcon,
      },
      {
        name:        "Payments",
        description: "Secure, automatic, always on time",
        href:        "/features/payments",
        Icon:        CreditCardIcon,
      },
      {
        name:        "Membership Management",
        description: "Flexible and retention-driven",
        href:        "/features/membership-management",
        Icon:        BadgeIcon,
      },
      {
        name:        "Team & Payroll",
        description: "Retain your instructors",
        href:        "/features/team-payroll",
        Icon:        UsersIcon,
      },
    ],
  },
  {
    label: "Reach Your Members",
    features: [
      {
        name:        "Marketing Essentials",
        description: "Engage from day one",
        href:        "/features/marketing",
        Icon:        MegaphoneIcon,
      },
      {
        name:        "Audience",
        description: "Behaviour-based targeting",
        href:        "/features/audience",
        Icon:        TargetIcon,
      },
      {
        name:        "Integrations",
        description: "Keep everything in sync",
        href:        "/features/integrations",
        Icon:        LinkIcon,
      },
    ],
  },
  {
    label: "Grow & Expand",
    features: [
      {
        name:        "Performance Dashboard",
        description: "See what's really happening",
        href:        "/features/performance-dashboard",
        Icon:        TrendingUpIcon,
      },
    ],
  },
]

// ── ANIMATION VARIANTS ───────────────────────────────────────────────────────
// container: triggers child animations in a staggered sequence (0.12s apart).
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

// item: each child fades up 20px into position.
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

// ── COMPONENT ────────────────────────────────────────────────────────────────
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
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-6 mb-24"
        >
          {/* Category label — small, electric blue, all-caps, very wide tracking. */}
          <motion.p
            variants={item}
            className="font-instrument uppercase tracking-widest text-blue-axis text-xs"
          >
            The AXIS Platform
          </motion.p>

          {/* h1 is the page's primary SEO headline — exactly one per page. */}
          <motion.h1
            variants={item}
            className="font-playfair uppercase tracking-tight text-white-axis text-5xl md:text-7xl leading-none"
          >
            Everything your<br />studio needs.
          </motion.h1>

          {/* Subtitle — instrument sans body copy, muted grey */}
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
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.label} variants={item}>

              {/* Category label — sits above the feature cards, separated by a thin border. */}
              <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs pb-6 border-b border-white/10 mb-4">
                {cat.label}
              </p>

              {/* Feature cards — each is a link to the feature's dedicated sub-page. */}
              <div className="flex flex-col gap-3">
                {cat.features.map((feature) => (
                  // Link is Next.js's internal navigation component — never use <a href> for internal links.
                  <Link key={feature.href} href={feature.href}>
                    {/* whileHover lifts the card 3px — subtle, editorial hover feedback.
                        Never use raw CSS :hover — always use Framer Motion for interactive animations. */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.3, ease: "easeOut" as const }}
                      className="border border-white/10 p-4 flex flex-col gap-3 hover:border-white/20"
                    >
                      {/* Top row: icon (blue) + arrow (muted) */}
                      <div className="flex items-center justify-between">
                        {/* Icon — text-blue-axis colours the SVG stroke via currentColor */}
                        <span className="text-blue-axis">
                          <feature.Icon />
                        </span>
                        {/* Arrow — muted soft grey, points right */}
                        <span className="text-soft-grey">
                          <ArrowRight />
                        </span>
                      </div>

                      {/* Feature name — playfair serif, white */}
                      <p className="font-playfair uppercase tracking-tight text-white-axis text-base">
                        {feature.name}
                      </p>

                      {/* Feature description — instrument sans, small, muted */}
                      <p className="font-instrument text-soft-grey text-xs uppercase tracking-widest">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-24 flex justify-center"
        >
          {/* Primary button — white bg, black text, uppercase, wide tracking. */}
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
