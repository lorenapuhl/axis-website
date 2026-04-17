"use client"
// OverhandzFeaturesSection — pill-based feature showcase for the Overhandz case study.
// This is "The solution" — it replaces the static solution section from CaseStudyClient.tsx
// with an interactive demo where each pill shows a real section of the Overhandz website.
//
// Layout:
//   Desktop: horizontal pill nav → two-column (left: text, right: browser frame + panel)
//   Mobile:  horizontal scrolling chips → stacked (text above, panel below)
//
// Panels are imported from components/overhandz/FeaturePanels.tsx.
// Each panel is a self-contained simulation of an Overhandz website section.

import { useState, type ComponentType } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MobileExperiencePanel,
  SchedulePanel,
  MembershipsPanel,
  OnlinePaymentsPanel,
  LiveInstagramPanel,
  EventsAutoPanel,
  OffersMerchPanel,
  TrustBrandingPanel,
} from "@/components/overhandz/FeaturePanels"

// ─── PILL DEFINITIONS ─────────────────────────────────────────────────────────
// Each pill has: a label (tab text), headline + text (shown left on desktop),
// and a Panel component (shown right on desktop / below on mobile).

interface Pill {
  id: string
  label: string
  headline: string
  text: string
  // ComponentType: a React component with no required props
  Panel: ComponentType
}

const PILLS: Pill[] = [
  {
    id: "mobile",
    label: "Mobile Experience",
    headline: "Designed for how clients actually browse",
    text: "Optimized for mobile-first users — where most bookings happen.",
    Panel: MobileExperiencePanel,
  },
  {
    id: "booking",
    label: "Instant Booking",
    headline: "Book a class in seconds",
    text: "No DMs. No waiting. Capture users exactly when they're ready.",
    Panel: SchedulePanel,
  },
  {
    id: "schedule",
    label: "Class Schedule",
    headline: "Clear, filterable class schedule",
    text: "Users instantly find the right class by day or training type.",
    Panel: SchedulePanel,
  },
  {
    id: "memberships",
    label: "Memberships & Packages",
    headline: "Turn visitors into recurring revenue",
    text: "Sell memberships and packages directly on your website.",
    Panel: MembershipsPanel,
  },
  {
    id: "payments",
    label: "Online Payments",
    headline: "Seamless purchase experience",
    text: "From selecting a package to checkout in one smooth flow.",
    Panel: OnlinePaymentsPanel,
  },
  {
    id: "instagram",
    label: "Live Instagram Feed",
    headline: "Your website updates itself",
    text: "Every post you publish instantly appears on your website.",
    Panel: LiveInstagramPanel,
  },
  {
    id: "events",
    label: "Events (Auto from Instagram)",
    headline: "Events created automatically from Instagram",
    text: "Promotions, workshops, and announcements become structured events.",
    Panel: EventsAutoPanel,
  },
  {
    id: "merch",
    label: "Offers & Merch (Auto from Instagram)",
    headline: "Turn posts into revenue",
    text: "Merch and offers are automatically transformed into shoppable content.",
    Panel: OffersMerchPanel,
  },
  {
    id: "trust",
    label: "Trust & Branding",
    headline: "Feels like a real, established brand",
    text: "Your Instagram identity becomes a consistent, professional website.",
    Panel: TrustBrandingPanel,
  },
]

export default function OverhandzFeaturesSection() {
  // activeId tracks which pill is selected — defaults to the first
  const [activeId, setActiveId] = useState(PILLS[0].id)

  // Find the active pill object so we can render its headline, text, and Panel
  const activePill = PILLS.find((p) => p.id === activeId)!

  // Panel is the component function — must start with uppercase to use as JSX
  const ActivePanel = activePill.Panel

  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-grey-axis">
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12"
        >
          {/* "The solution" label continues the narrative from the problem section above */}
          <p className="font-instrument text-blue-axis text-xs uppercase tracking-widest mb-4">
            The solution
          </p>
          <h2 className="font-playfair text-white-axis uppercase tracking-tight text-4xl md:text-5xl">
            A conversion-focused booking system.
          </h2>
        </motion.div>

        {/* ── PILL NAVIGATION ──
            Desktop: all pills visible in a single scrollable row.
            Mobile:  scrollable chips with snap — partial overflow hints there are more.
            Active pill: slightly brighter background + white border. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-4 mb-12 snap-x snap-mandatory scrollbar-none"
        >
          {PILLS.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveId(pill.id)}
              className={`
                shrink-0 snap-start px-4 py-2 rounded-full text-xs font-instrument font-medium
                uppercase tracking-widest transition-colors duration-200
                ${activeId === pill.id
                  ? "bg-white-axis/10 text-white-axis border border-white-axis/30"
                  : "text-soft-grey hover:text-white-axis border border-transparent"
                }
              `}
            >
              {pill.label}
            </button>
          ))}
        </motion.div>

        {/* ── CONTENT AREA ──
            Desktop: two-column grid — left text (fixed) + right browser frame (fluid).
            Mobile:  single column — text stacks above the preview frame. */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 items-start">

          {/* LEFT — headline + description for the active pill.
              AnimatePresence with mode="wait" fades out the old text before fading in new.
              key includes "-text" suffix to be distinct from the right panel key. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId + "-text"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
            >
              <h3 className="font-playfair text-white-axis uppercase tracking-tight text-2xl md:text-3xl mb-4">
                {activePill.headline}
              </h3>
              <p className="font-instrument text-soft-grey text-base leading-relaxed">
                {activePill.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT — browser frame wrapping the active overhandz panel.
              The frame has a URL bar + macOS-style window dots (desktop)
              or a simple green live dot (mobile), matching OverhandzSection.tsx.
              overflow-hidden ensures modals (absolute inset-0) stay inside the frame. */}
          <div
            className="rounded-2xl overflow-hidden bg-zinc-950"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Browser bar */}
            <div
              className="flex items-center gap-2 px-4 py-3 bg-zinc-900"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* macOS window controls — visible only on desktop */}
              <div className="hidden md:flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>

              {/* Mobile: single green live dot */}
              <span className="md:hidden w-2 h-2 rounded-full shrink-0 bg-green-500" />

              {/* URL bar */}
              <div className="flex-1 text-center rounded-md px-2 py-1 bg-zinc-800">
                <span className="text-xs text-zinc-400">overhandz-website.vercel.app</span>
              </div>

              {/* Live badge — links directly to the actual site */}
              <a
                href="https://overhandz-website.vercel.app/en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-0.5 rounded font-medium shrink-0 text-green-400"
                style={{ background: "rgba(34,197,94,0.12)" }}
              >
                Live
              </a>
            </div>

            {/* Panel content — AnimatePresence fades + scales between pills.
                key={activeId} causes React to unmount/remount the panel on pill change,
                resetting all internal state (e.g. selected day, open modal). */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, ease: "easeOut" },
                }}
              >
                <ActivePanel />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── VIEW WEBSITE BUTTON ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mt-20"
        >
          <a
            href="https://overhandz-website.vercel.app/en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4 border border-white-axis/20 text-white-axis hover:bg-white-axis/5 transition-colors duration-200"
          >
            View website →
          </a>
        </motion.div>

      </div>
    </section>
  )
}
