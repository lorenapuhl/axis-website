"use client"
// OverhandzFeaturesSection — pill-based feature showcase for the Overhandz case study.
//
// Layout:
//   Desktop: horizontal pill nav → two-column (left: text, right: floating search bar + full-width panel)
//   Mobile:  horizontal scrolling chips → stacked (text above, panel below)
//
// The browser frame box is intentionally removed — only a floating rounded search bar
// sits above the panel. The panel itself renders full-width with no constraining box.

import { useState, useRef, type ComponentType } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MobileExperiencePanel,
  SchedulePanel,
  ClassSchedulePanel,
  MembershipsPanel,
  OnlinePaymentsPanel,
  LiveInstagramPanel,
  EventsAutoPanel,
  OffersMerchPanel,
  TrustBrandingPanel,
} from "@/components/overhandz/FeaturePanels"

interface Pill {
  id: string
  label: string
  headline: string
  text: string
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
    Panel: ClassSchedulePanel,
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
  const [activeId, setActiveId] = useState(PILLS[0].id)
  const activePill = PILLS.find((p) => p.id === activeId)!
  const ActivePanel = activePill.Panel

  // Ref for the pill scroll container — used to scroll the active pill into view
  // when a dot is clicked without the user needing to manually scroll.
  const pillNavRef = useRef<HTMLDivElement>(null)

  // Select a pill by id: update state + scroll the pill button into view.
  const handleSelect = (id: string) => {
    setActiveId(id)
    const nav = pillNavRef.current
    if (!nav) return
    const idx = PILLS.findIndex((p) => p.id === id)
    const btn = nav.children[idx] as HTMLElement | undefined
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }

  return (
    // bg-grey-axis (#121212) provides a visible contrast against the pure-black panels
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
          <p className="font-instrument text-blue-axis text-xs uppercase tracking-widest mb-4">
            The solution
          </p>
          <h2 className="font-playfair text-white-axis uppercase tracking-tight text-4xl md:text-5xl">
            A conversion-focused booking system.
          </h2>
        </motion.div>

        {/* ── PILL NAVIGATION ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="mb-4"
        >
          {/* Scrollable pill row — scrollbar-none hides the native scrollbar */}
          <div
            ref={pillNavRef}
            className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory"
          >
            {PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => handleSelect(pill.id)}
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
          </div>

          {/* Dots — one per pill, active dot widens into a pill shape.
              Clicking a dot also scrolls the matching pill button into view. */}
          <div className="flex justify-center gap-1.5 mt-4 mb-8">
            {PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => handleSelect(pill.id)}
                aria-label={`Show ${pill.label}`}
                className={`rounded-full transition-all duration-300 ${
                  activeId === pill.id
                    ? "w-4 h-1.5 bg-white-axis"
                    : "w-1.5 h-1.5 bg-white-axis/25 hover:bg-white-axis/50"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* ── CONTENT AREA — stacked: text below pills, panel full-width below ── */}
        <div>
          {/* Headline + description — below the pills/dots, constrained width */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId + "-text"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
              className="max-w-xl mb-8"
            >
              <h3 className="font-instrument text-white-axis font-semibold text-xl md:text-2xl mb-3 leading-snug">
                {activePill.headline}
              </h3>
              <p className="font-instrument text-soft-grey text-base leading-relaxed">
                {activePill.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Browser bar + full-width panel */}
          <div>
            {/* Floating search bar — pill shaped, sits above the panel like a browser tab */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-900 border border-white/[0.06] mb-4 shadow-2xl">
              {/* macOS window dots — desktop only */}
              <div className="hidden md:flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              {/* Mobile: green live dot */}
              <span className="md:hidden w-2 h-2 rounded-full shrink-0 bg-green-500" />
              {/* URL */}
              <span className="text-xs text-zinc-400 flex-1 text-center">overhandz-boxing.com</span>
              {/* Live link */}
              <a
                href="https://overhandz-website.vercel.app/en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 text-green-400 bg-green-500/10"
              >
                Live
              </a>
            </div>

            {/* Panel — full width, rounded corners, overflow-hidden contains the booking modal */}
            <div className="relative overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
                >
                  <ActivePanel />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── VIEW WEBSITE BUTTON (no arrow) ── */}
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
            View website
          </a>
        </motion.div>

      </div>
    </section>
  )
}
