"use client"
// OverhandzDashboardsSection — reveals the internal operating system of Overhandz Boxing Club.
//
// Layout:
//   Top: horizontal pill nav (desktop) / horizontal scroll chips (mobile)
//   Below: two-column grid on desktop (left: text, right: dashboard)
//          stacked on mobile (text first, dashboard below)
//
// All 10 dashboards are loaded via dynamic imports — only the active one renders.

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamic imports — Next.js loads each dashboard only when it becomes active.
// This keeps the initial page load fast.
const ClientDashboard = dynamic(() => import("@/components/dashboards/ClientDashboard"))
const ScheduleDashboard = dynamic(() => import("@/components/dashboards/ScheduleDashboard"))
const BookingsDashboard = dynamic(() => import("@/components/dashboards/BookingsDashboard"))
const RevenueDashboard = dynamic(() => import("@/components/dashboards/RevenueDashboard"))
const MembershipDashboard = dynamic(() => import("@/components/dashboards/MembershipDashboard"))
const PaymentsDashboard = dynamic(() => import("@/components/dashboards/PaymentsDashboard"))
const AttendanceDashboard = dynamic(() => import("@/components/dashboards/AttendanceDashboard"))
const CoachDashboard = dynamic(() => import("@/components/dashboards/CoachDashboard"))
const MessagingDashboard = dynamic(() => import("@/components/dashboards/MessagingDashboard"))
const InstagramAutomationDashboard = dynamic(() => import("@/components/dashboards/InstagramAutomationDashboard"))

// TypeScript interface — shape of each tab item
interface Tab {
  id: string
  label: string
  // label for display in pill/chip
  icon: string
  // small label shown above the headline
  sectionLabel: string
  headline: string
  text: string
  // Dashboard component to render when this tab is active
  Dashboard: React.ComponentType
}

// Tab definitions — content + which dashboard to show
const TABS: Tab[] = [
  {
    id: "clients",
    label: "Clients",
    icon: "👤",
    sectionLabel: "MEMBER MANAGEMENT",
    headline: "Every client. One place.",
    text: "Track memberships, attendance, and payment history for every member. Search, filter, and access full profiles in one click.",
    Dashboard: ClientDashboard,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: "📅",
    sectionLabel: "CLASS SCHEDULING",
    headline: "Your week, fully visible.",
    text: "View and manage every class across coaches, times, and capacity — all from one live calendar. No more back-and-forth.",
    Dashboard: ScheduleDashboard,
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: "✅",
    sectionLabel: "BOOKING MANAGEMENT",
    headline: "Control who shows up.",
    text: "See confirmed, waitlisted, and cancelled bookings for each class. Confirm, move, or remove spots in real time.",
    Dashboard: BookingsDashboard,
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: "💰",
    sectionLabel: "REVENUE TRACKING",
    headline: "Know what you're earning.",
    text: "Real-time revenue data across memberships, class packs, and merchandise. No spreadsheets. No guessing.",
    Dashboard: RevenueDashboard,
  },
  {
    id: "memberships",
    label: "Memberships",
    icon: "🏷️",
    sectionLabel: "MEMBERSHIP PLANS",
    headline: "Design your pricing.",
    text: "Create and manage membership tiers. Control pricing, limits, and availability. Turn pricing into recurring revenue.",
    Dashboard: MembershipDashboard,
  },
  {
    id: "payments",
    label: "Payments",
    icon: "💳",
    sectionLabel: "PAYMENT HISTORY",
    headline: "Every transaction, visible.",
    text: "Full payment log with status, amount, and member details. Issue refunds and track failed charges in one panel.",
    Dashboard: PaymentsDashboard,
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: "📋",
    sectionLabel: "ATTENDANCE",
    headline: "Mark who showed up.",
    text: "Take attendance for any class. Toggle presence per member or mark everyone at once. Know your no-show rate.",
    Dashboard: AttendanceDashboard,
  },
  {
    id: "coaches",
    label: "Coaches",
    icon: "🥊",
    sectionLabel: "COACH MANAGEMENT",
    headline: "Your team, organized.",
    text: "Track coach schedules, assigned classes, and weekly hours. Assign or reassign classes with a single click.",
    Dashboard: CoachDashboard,
  },
  {
    id: "messaging",
    label: "Messaging",
    icon: "💬",
    sectionLabel: "MESSAGING",
    headline: "Talk to your members.",
    text: "Message individuals or full class groups. Use templates to send reminders and updates — without leaving the dashboard.",
    Dashboard: MessagingDashboard,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: "📸",
    sectionLabel: "INSTAGRAM AUTOMATION",
    headline: "Your content becomes your system.",
    text: "Tag any Instagram post to instantly publish it as an event, offer, or merchandise on your website. Post once. Sell everywhere.",
    Dashboard: InstagramAutomationDashboard,
  },
]

// Stagger animation variants — children animate in sequence
// Typed as Variants to satisfy Framer Motion's strict TypeScript types
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

export default function OverhandzDashboardsSection() {
  // activeId — which tab/pill is currently selected
  const [activeId, setActiveId] = useState(TABS[0].id)
  // chipNavRef — ref to the mobile chip scroll container so we can auto-scroll the active chip into view
  const chipNavRef = useRef<HTMLDivElement>(null)

  const activeTab = TABS.find((t) => t.id === activeId)!
  const ActiveDashboard = activeTab.Dashboard

  // When the active tab changes, scroll the active chip into view on mobile
  useEffect(() => {
    const nav = chipNavRef.current
    if (!nav) return
    const idx = TABS.findIndex((t) => t.id === activeId)
    const chip = nav.children[idx] as HTMLElement | undefined
    chip?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }, [activeId])

  const handleSelect = (id: string) => {
    setActiveId(id)
  }

  return (
    // bg-black-axis keeps this section visually distinct from the grey OverhandzFeaturesSection above
    <section className="py-20 px-6 md:py-36 md:px-12 bg-black-axis">
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-12"
        >
          <motion.p variants={item} className="font-instrument text-blue-axis text-xs uppercase tracking-widest mb-4">
            The operating system
          </motion.p>
          <motion.h2 variants={item} className="font-playfair text-white-axis uppercase tracking-tight text-4xl md:text-5xl">
            Everything that runs the gym.
          </motion.h2>
          <motion.p variants={item} className="font-instrument text-soft-grey text-base mt-4 max-w-xl">
            Bookings, revenue, members, content — all connected in one minimalist, aesthetic, and user-friendly system.
          </motion.p>
        </motion.div>

        {/* ── PILL NAVIGATION (DESKTOP) ── */}
        {/* hidden on mobile, shown on md+ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="hidden md:flex gap-2 mb-10 overflow-x-auto scrollbar-none"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`
                shrink-0 h-11 px-3.5 py-1.5 rounded-full text-sm font-instrument font-medium
                border transition-colors duration-200
                ${activeId === tab.id
                  ? "bg-zinc-900 border-white/30 text-white-axis"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900/60"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* ── CHIP NAVIGATION (MOBILE) ── */}
        {/* Horizontal scroll, snap, visible partial next chip to signal scrollability */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative md:hidden mb-6"
        >
          {/* Fade mask on right edge — signals to the user that there's more content to scroll */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black-axis to-transparent pointer-events-none z-10" />
          <div
            ref={chipNavRef}
            className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory pr-8"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSelect(tab.id)}
                className={`
                  snap-start shrink-0 px-3 py-1.5 rounded-full text-xs font-instrument font-medium
                  border transition-colors duration-200
                  ${activeId === tab.id
                    ? "bg-zinc-900 border-white/30 text-white-axis"
                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pagination dots — one dot per tab, active dot stretches into a pill.
              Lets the user see which tab is active and how many tabs exist in total.
              Each dot is also tappable to navigate directly to that tab. */}
          <div className="flex justify-center gap-1.5 mt-3 pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSelect(tab.id)}
                aria-label={`Go to ${tab.label}`}
                className={`rounded-full transition-all duration-300 ${
                  activeId === tab.id
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* ── CONTENT AREA ── */}
        {/* Desktop: text above dashboard, full width. Mobile: same stacked layout. */}
        <div className="flex flex-col gap-6">

          {/* ── TEXT CONTENT ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId + "-text"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
            >
              {/* Small uppercase label */}
              <p className="font-instrument text-soft-grey text-xs uppercase tracking-widest mb-3">
                {activeTab.sectionLabel}
              </p>
              {/* Section headline */}
              <h3 className="font-playfair text-white-axis text-3xl md:text-4xl uppercase tracking-tight leading-tight mb-4">
                {activeTab.headline}
              </h3>
              {/* Body paragraph */}
              <p className="font-instrument text-soft-grey text-base leading-relaxed max-w-xl">
                {activeTab.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ── DASHBOARD — full width ── */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId + "-dashboard"}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: "easeOut" } }}
              >
                <ActiveDashboard />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  )
}
