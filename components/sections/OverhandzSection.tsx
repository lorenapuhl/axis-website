"use client"
// "use client" is required: uses useState, useRef, useEffect, event handlers,
// and Framer Motion — all of which are browser-only.

import { useState, useRef, useEffect, type ReactElement } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useCTAModal } from "@/components/cta/CTAContext"

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DEMO_CLASSES = [
  { id: "mon-1", day: "Mon", time: "19:00", name: "Muay-Thaï", coach: "Coach Fabrice", spotsLeft: 8, durationMinutes: 60 },
  { id: "tue-1", day: "Tue", time: "19:00", name: "Boxe Anglaise", coach: "Coach Rudy", spotsLeft: 6, durationMinutes: 60 },
  { id: "wed-1", day: "Wed", time: "18:45", name: "Muay-Thaï Féminin", coach: "Coach Morad", spotsLeft: 8, durationMinutes: 60 },
  { id: "thu-1", day: "Thu", time: "19:00", name: "Boxe Anglaise", coach: "Coach Rudy", spotsLeft: 5, durationMinutes: 60 },
  { id: "fri-1", day: "Fri", time: "20:00", name: "Muay-Thaï", coach: "Coach Morad", spotsLeft: 3, durationMinutes: 60 },
]

const PRICING_PLANS = [
  { id: "p1", name: "Boxe Anglaise Full", price: 450, desc: "Full access to boxing + open gym", highlight: false, badge: null as string | null },
  { id: "p2", name: "Muay-Thaï Full", price: 350, desc: "Full access to Muay Thai 3×/week", highlight: true, badge: "Most Popular" },
  { id: "p3", name: "Muay-Thaï", price: 280, desc: "Muay Thai classes 2×/week", highlight: false, badge: null },
  { id: "p4", name: "Muay-Thaï Féminin", price: 250, desc: "Women's Muay Thai 2×/week", highlight: false, badge: null },
]

const INSTAGRAM_POSTS = [
  { id: "ig-1", src: "/overhandz/instagram/post-1.png", caption: "Club opening in September — Train. Fight. Belong.", likes: 62 },
  { id: "ig-2", src: "/overhandz/instagram/post-2.png", caption: "Boxing club in Ivry-sur-Seine.", likes: 42 },
  { id: "ig-3", src: "/overhandz/instagram/post-3.png", caption: "Official opening September 15 🎉", likes: 89 },
  { id: "ig-4", src: "/overhandz/instagram/post-4.png", caption: "Classic Overhandz Tee — Black & White.", likes: 58 },
  { id: "ig-5", src: "/overhandz/instagram/post-5.png", caption: "Train with @yamani_muay_thai 🥊", likes: 47 },
  { id: "ig-6", src: "/overhandz/instagram/post-6.png", caption: "Closing our 2nd year — thank you.", likes: 71 },
]

const EVENTS = [
  { id: "ev-1", title: "Upcycling Crop Shirt — HUVIVA x JMT", date: "Nov 2025", img: "/overhandz/events/post-1.png", type: "Collab", link: "https://www.instagram.com/overhandzclub/" },
  { id: "ev-2", title: "Overhandz @ El Cafe Gym — Mexico City", date: "Feb 2022", img: "/overhandz/events/post-2.png", type: "Open Gym", link: "https://www.instagram.com/overhandzclub/" },
  { id: "ev-3", title: "Battle MBC x Overhandz", date: "Jul 2022", img: "/overhandz/events/post-3.png", type: "Competition", link: "https://www.instagram.com/overhandzclub/" },
  { id: "ev-4", title: "1V1 Break & 7 To Smoke All Style", date: "Jul 2022", img: "/overhandz/events/post-4.png", type: "Competition", link: "https://www.instagram.com/overhandzclub/" },
]

const PROMOS = [
  { id: "pr-1", title: "Overhandz Boxing Club T-Shirt", badge: "Merch", img: "/overhandz/promotions/post-1.png", cta: "Shop Now", highlight: false },
  { id: "pr-2", title: "Overhandz Giveaway", badge: "Giveaway", img: "/overhandz/promotions/post-2.png", cta: "Enter Giveaway", highlight: true },
  { id: "pr-3", title: "New Tiger Coat Jacket", badge: "New", img: "/overhandz/promotions/post-3.png", cta: "Shop Now", highlight: false },
]

const SHOP_URL = "https://overhandz.bigcartel.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio"

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Hero", title: "Clear positioning converts visitors", body: "Visitors instantly understand what the studio offers and who it's for." },
  { id: 2, label: "Social Proof", title: "Strong visuals from your Instagram build trust fast", body: "Your brand identity is automatically synchronized to your website — every image, every drop, every moment." },
  { id: 3, label: "Instagram", title: "Your Instagram becomes your website automatically", body: "Every post updates the site and can drive bookings or sales." },
  { id: 4, label: "Schedule", title: "Clients book instantly — no messages needed", body: "A live schedule with real-time spots. One tap to reserve." },
  { id: 5, label: "Pricing", title: "Packages generate upfront revenue", body: "Clear annual plans drive commitment and reduce churn." },
  { id: 6, label: "Events", title: "Promote events without extra tools", body: "Fights, collabs, and open gyms — all in one place." },
  { id: 7, label: "Merch", title: "Sell products directly from your content", body: "Turn your audience into buyers without leaving the site." },
]

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
// 2-step inline booking flow: confirm → success.

interface DemoClass {
  id: string; day: string; time: string; name: string;
  coach: string; spotsLeft: number; durationMinutes: number;
}

function BookingModal({ cls, onClose }: { cls: DemoClass; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <motion.div
        className="w-full rounded-t-2xl p-5 bg-zinc-900"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <p className="text-white text-sm font-semibold">Confirm booking</p>
              <button onClick={onClose} className="text-zinc-500 hover:text-white text-lg leading-none">✕</button>
            </div>
            <div className="rounded-lg p-3 mb-4 bg-black" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-white font-semibold text-base mb-1">{cls.name}</p>
              <p className="text-zinc-400 text-xs">{cls.day} at {cls.time}</p>
              <p className="text-zinc-400 text-xs">{cls.coach} · {cls.durationMinutes} min</p>
              <p className="text-green-400 text-xs mt-1 font-medium">
                {cls.spotsLeft <= 3 ? `Only ${cls.spotsLeft} spots left` : `${cls.spotsLeft} spots available`}
              </p>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3 rounded-lg text-sm font-semibold bg-white text-black">
              Reserve my spot →
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <p className="text-white font-semibold text-base mb-1">Booked!</p>
            <p className="text-zinc-400 text-xs mb-4">{cls.name} · {cls.day} at {cls.time}</p>
            <button onClick={onClose} className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white text-black">Done</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── ANNOTATION CARD ──────────────────────────────────────────────────────────
// Floating business-insight card below the phone frame.

function AnnotationCard({ title, body }: { title: string; body: string }) {
  return (
    // Card fades in as a whole — clean, no movement, no bounce
    <motion.div
      key={title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto mt-6 px-5 py-4 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-blue-axis" />
        <div>
          {/* Title fades in first */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="text-white text-sm font-semibold leading-snug mb-1"
          >
            {title}
          </motion.p>
          {/* Body follows with a small delay — reads like it's being revealed */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            className="text-zinc-500 text-sm leading-relaxed"
          >
            {body}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── HIGHLIGHT BOX ────────────────────────────────────────────────────────────
// Wraps the focal UI element in each step with a pulsing Axis-blue glow.

function HighlightBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0px rgba(0,51,255,0)",
          "0 0 20px rgba(0,51,255,0.3)",
          "0 0 0px rgba(0,51,255,0)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ border: "1px solid rgba(0,51,255,0.3)" }}
    >
      {children}
    </motion.div>
  )
}

// ─── STEP 1 — HERO ────────────────────────────────────────────────────────────
// Matches Overhandz mobile hero: image on top, copy + CTAs below.
// No HighlightBox — the user requested the blue square removed on this step.
function HeroPanel() {
  return (
    <div className="bg-zinc-950">
      {/* Hero image — full width, aspect ratio matching Overhandz mobile */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src="/overhandz/ui/hero-cropped.png"
          alt="Boxers sparring during training session at Overhandz Boxing Club in Paris"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
      </div>

      {/* Copy section — matches Overhandz HeroSection mobile layout */}
      <div className="px-6 pt-4 pb-8">
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-4">
          Ivry-sur-Seine · Est. 2021
        </p>

        <h2 className="text-white font-bold text-5xl leading-tight tracking-tight mb-6">
          Train.<br />Fight.<br />Belong.
        </h2>

        <p className="text-zinc-400 text-base leading-relaxed mb-8">
          Boxing & Muay Thai for all levels in the heart of Ivry-sur-Seine.
        </p>

        {/* Two CTAs — matching Overhandz primary + secondary button pattern */}
        <div className="flex flex-col gap-3">
          <button className="w-full py-3.5 rounded-xl text-sm font-semibold bg-white text-black">
            Book a free session
          </button>
          <button
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          >
            View schedule
          </button>
        </div>

        <p className="text-zinc-500 text-xs mt-6 text-center">
          150+ members · No commitment
        </p>
      </div>
    </div>
  )
}

// ─── STEP 2 — SOCIAL PROOF ────────────────────────────────────────────────────
// Matches Overhandz SocialProofStrip: stats grid with border separator.
// The highlighted group photo below connects to the Instagram branding narrative.
function SocialProofPanel() {
  const stats = [
    { value: "150+", label: "Active members" },
    { value: "3", label: "Expert coaches" },
    { value: "5×", label: "Classes per week" },
    { value: "4+", label: "Disciplines" },
  ]

  return (
    <div className="bg-zinc-950">
      {/* Stats strip — matches SocialProofStrip layout exactly */}
      <HighlightBox className="mx-4 mt-4 rounded-xl">
        <div
          className="grid grid-cols-2 gap-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center py-6 px-4"
              style={{
                borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <p className="text-white font-bold text-3xl tracking-tight">{stat.value}</p>
              <p className="text-zinc-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </HighlightBox>

      {/* Coach portraits — the visual brand identity */}
      <div className="px-4 pt-5 pb-6">
        <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-3">
          Your coaches
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { src: "/overhandz/coaches/fabrice.png", name: "Fabrice", discipline: "Muay-Thaï" },
            { src: "/overhandz/coaches/rudy.png", name: "Rudy", discipline: "Boxe Anglaise" },
            { src: "/overhandz/coaches/morad.png", name: "Morad", discipline: "Muay-Thaï" },
          ].map((coach) => (
            <div key={coach.name} className="text-center">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                <Image
                  src={coach.src}
                  alt={`Coach ${coach.name} at Overhandz Boxing Club`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
              <p className="text-white text-xs font-semibold">{coach.name}</p>
              <p className="text-zinc-500 text-xs">{coach.discipline}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── STEP 3 — INSTAGRAM FEED ──────────────────────────────────────────────────
// Matches Overhandz InstagramFeed section: header + 3×2 grid.
function InstagramPanel() {
  return (
    <div className="px-4 pt-4 pb-6 bg-zinc-950">
      {/* Section header — matching InstagramFeed eyebrow + heading */}
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">
        @overhandzclub
      </p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-6">
        Follow our journey
      </h2>

      {/* 3×2 post grid */}
      <HighlightBox>
        <div className="grid grid-cols-3 gap-0.5">
          {INSTAGRAM_POSTS.map((post) => (
            <div key={post.id} className="relative aspect-square overflow-hidden">
              <Image
                src={post.src}
                alt={`Instagram post from Overhandz Boxing Club: ${post.caption}`}
                fill
                sizes="(max-width: 768px) 33vw, 200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </HighlightBox>

      {/* CTA link — matching the Instagram section footer */}
      <p className="text-zinc-500 text-sm mt-4 text-center">
        @overhandzclub · 6 posts · Updated automatically
      </p>
    </div>
  )
}

// ─── STEP 4 — SCHEDULE ────────────────────────────────────────────────────────
// Matches Overhandz SchedulePreview: day tabs + class rows + book button.
function SchedulePanel() {
  const [selectedDay, setSelectedDay] = useState("Mon")
  const [selectedClass, setSelectedClass] = useState<DemoClass | null>(null)

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const filtered = DEMO_CLASSES.filter((c) => c.day === selectedDay)

  return (
    <div className="relative bg-zinc-950">
      <div className="px-4 pt-4 pb-6">
        {/* Section header */}
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">
          Schedule
        </p>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-white font-semibold text-3xl tracking-tight">
            Book a class
          </h2>
          <button
            className="text-xs font-medium text-zinc-400 pb-1"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
          >
            Full schedule
          </button>
        </div>

        {/* Day filter tabs — overflow-x-auto matches the Overhandz day selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                selectedDay === day
                  ? "bg-white text-black"
                  : "text-zinc-400 bg-zinc-900"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Class rows — highlighted as the focal element */}
        <HighlightBox>
          <div className="rounded-xl overflow-hidden">
            {filtered.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-8 bg-zinc-900">
                No classes on {selectedDay}.
              </p>
            ) : (
              filtered.map((cls, i) => (
                <div
                  key={cls.id}
                  className="bg-zinc-900 flex items-center justify-between px-4 py-3.5"
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-mono font-bold text-white w-12 shrink-0">{cls.time}</span>
                    <div>
                      <p className="text-white font-medium text-sm">{cls.name}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{cls.coach} · {cls.durationMinutes}min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    {cls.spotsLeft <= 3 && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium text-orange-400"
                        style={{ background: "rgba(251,146,60,0.12)" }}
                      >
                        {cls.spotsLeft} left
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedClass(cls)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium bg-white text-black"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </HighlightBox>
      </div>

      <AnimatePresence>
        {selectedClass && (
          <BookingModal cls={selectedClass} onClose={() => setSelectedClass(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── STEP 5 — PRICING ─────────────────────────────────────────────────────────
// Matches Overhandz PricingSection: 4 cards with price, benefits, CTA.
function PricingPanel() {
  const [activePlan, setActivePlan] = useState<string | null>(null)

  return (
    <div className="px-4 pt-4 pb-6 bg-zinc-950">
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">Pricing</p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-2">
        Choose your plan
      </h2>
      <p className="text-zinc-400 text-base mb-6">Join Overhandz Boxing Club today.</p>

      {/* 4-card grid — highlighted as focal element */}
      <HighlightBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
          {PRICING_PLANS.map((plan) => {
            const isActive = activePlan === plan.id
            return (
              <motion.button
                key={plan.id}
                onClick={() => setActivePlan(isActive ? null : plan.id)}
                animate={{ scale: isActive ? 1.02 : 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`text-left rounded-xl p-4 flex flex-col ${isActive ? "" : "bg-zinc-900"}`}
                style={{
                  background: isActive ? "rgba(0,51,255,0.1)" : undefined,
                  border: `1px solid ${isActive ? "rgba(0,51,255,0.5)" : plan.highlight ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium mb-2 self-start text-blue-300"
                    style={{ background: "rgba(0,51,255,0.2)" }}
                  >
                    {plan.badge}
                  </span>
                )}

                {/* Plan name */}
                <p className="text-white font-semibold text-base mb-1">{plan.name}</p>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-white font-bold text-3xl">€{plan.price}</span>
                  <span className="text-zinc-400 text-sm ml-1">/ year</span>
                </div>

                <p className="text-zinc-500 text-xs leading-relaxed mb-3 flex-1">{plan.desc}</p>

                {/* CTA — expands when card is selected */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="block text-center text-sm font-semibold py-2.5 rounded-lg bg-white text-black"
                    >
                      Sign up →
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </HighlightBox>

      <p className="text-zinc-600 text-xs text-center mt-3">Tap a plan to select it</p>
    </div>
  )
}

// ─── STEP 6 — EVENTS ──────────────────────────────────────────────────────────
// Matches Overhandz EventsSection: 2-column card grid with image + details.
function EventsPanel() {
  return (
    <div className="px-4 pt-4 pb-6 bg-zinc-950">
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">Events</p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-6">
        What&apos;s happening
      </h2>

      {/* 2-col card grid — matches EventsSection layout */}
      <HighlightBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
          {EVENTS.map((ev) => (
            <a
              key={ev.id}
              href={ev.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden bg-zinc-900"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Event image — 16/9 aspect ratio matching EventsSection */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={ev.img}
                  alt={`${ev.title} — Overhandz Boxing Club event`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Event type badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium text-white"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                  >
                    {ev.type}
                  </span>
                </div>
              </div>

              {/* Event details */}
              <div className="p-3">
                <p className="text-zinc-400 text-xs mb-1">{ev.date}</p>
                <p className="text-white font-semibold text-sm leading-snug mb-3">{ev.title}</p>
                <span className="text-xs font-semibold text-white">Join event →</span>
              </div>
            </a>
          ))}
        </div>
      </HighlightBox>
    </div>
  )
}

// ─── STEP 7 — MERCH / PROMOTIONS ──────────────────────────────────────────────
// Matches Overhandz PromotionsSection: image-forward cards with shop CTAs.
function MerchPanel() {
  return (
    <div className="px-4 pt-4 pb-6 bg-zinc-950">
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">Shop</p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-6">
        Gear & promotions
      </h2>

      {/* Card grid — matches PromotionsSection (first card spans 2 cols on wider screens) */}
      <HighlightBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
          {PROMOS.map((promo, i) => (
            <div
              key={promo.id}
              className={`rounded-xl overflow-hidden bg-zinc-900 flex flex-col cursor-pointer ${
                i === 1 ? "sm:col-span-2" : ""
              }`}
              style={{ border: promo.highlight ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => window.open(SHOP_URL, "_blank", "noopener,noreferrer")}
            >
              {/* Product image */}
              <div className={`relative overflow-hidden ${i === 1 ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
                <Image
                  src={promo.img}
                  alt={`${promo.title} — Overhandz Boxing Club`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium text-white"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                  >
                    {promo.badge}
                  </span>
                </div>
              </div>

              {/* Product details + shop CTA */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-white font-semibold text-base mb-3 flex-1">{promo.title}</p>
                <div onClick={(e) => e.stopPropagation()}>
                  <a
                    href={SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                      promo.highlight ? "bg-white text-black" : "text-white"
                    }`}
                    style={promo.highlight ? {} : { border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    {promo.cta} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </HighlightBox>
    </div>
  )
}

// ─── PANEL MAP ────────────────────────────────────────────────────────────────
const PANELS: Record<number, () => ReactElement> = {
  1: HeroPanel,
  2: SocialProofPanel,
  3: InstagramPanel,
  4: SchedulePanel,
  5: PricingPanel,
  6: EventsPanel,
  7: MerchPanel,
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function OverhandzSection() {
  const [currentStep, setCurrentStep] = useState(1)
  // slideDir: 1 = going forward (new panel slides in from right),
  //          -1 = going back (new panel slides in from left)
  const [slideDir, setSlideDir] = useState<1 | -1>(1)

  const scrollRef = useRef<HTMLDivElement>(null)
  const swipeStartX = useRef<number | null>(null)
  const swipeStartY = useRef<number | null>(null)

  const { openModal } = useCTAModal()

  // Scroll phone viewport back to top whenever the step changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentStep])

  const goNext = () => {
    if (currentStep >= STEPS.length) return
    setSlideDir(1)
    setCurrentStep((s) => s + 1)
  }
  const goPrev = () => {
    if (currentStep <= 1) return
    setSlideDir(-1)
    setCurrentStep((s) => s - 1)
  }

  // Swipe detection — pointer events on the phone frame.
  // Only fires as a step change if horizontal movement clearly exceeds vertical
  // (so vertical scroll inside the phone still works normally).
  const handlePointerDown = (e: React.PointerEvent) => {
    swipeStartX.current = e.clientX
    swipeStartY.current = e.clientY
  }
  const handlePointerUp = (e: React.PointerEvent) => {
    if (swipeStartX.current === null || swipeStartY.current === null) return
    const dx = e.clientX - swipeStartX.current
    const dy = e.clientY - swipeStartY.current
    // Only trigger as a swipe if motion is mostly horizontal
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext()
      else goPrev()
    }
    swipeStartX.current = null
    swipeStartY.current = null
  }

  const step = STEPS[currentStep - 1]
  const Panel = PANELS[currentStep]

  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-black-axis">
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-blue-axis font-instrument text-xs uppercase tracking-widest mb-4">
            Our Work
          </p>
          <h2 className="font-playfair text-white-axis uppercase tracking-tight text-4xl md:text-6xl leading-tight mb-4">
            Overhandz Boxing Club
          </h2>
          <p className="font-instrument text-soft-grey text-base max-w-md mx-auto">
            A live interactive demo — explore the system we built for this Paris boxing studio.
          </p>
        </motion.div>

        {/* ── DEMO CONTAINER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col items-center"
        >

          {/* ── PHONE / BROWSER FRAME ──
              Mobile: max-w-sm — looks like a phone.
              Desktop: full width of the container — looks like a browser window. */}
          <div
            className="w-full max-w-sm md:max-w-full rounded-3xl md:rounded-2xl overflow-hidden relative bg-zinc-950"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >

            {/* ── BROWSER BAR ── */}
            <div
              className="flex items-center gap-2 px-4 py-3 bg-zinc-900"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Window control dots — decorative, mimics macOS browser */}
              <div className="hidden md:flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>

              {/* Mobile: green live dot only */}
              <span className="md:hidden w-2 h-2 rounded-full shrink-0 bg-green-500" />

              {/* URL bar */}
              <div className="flex-1 text-center rounded-md px-2 py-1 bg-zinc-800">
                <span className="text-xs text-zinc-400">overhandzclub.com</span>
              </div>

              {/* Live badge */}
              <span
                className="text-xs px-2 py-0.5 rounded font-medium shrink-0 text-green-400"
                style={{ background: "rgba(34,197,94,0.12)" }}
              >
                Live demo
              </span>
            </div>

            {/* ── STEP PANEL ──
                overflow-y-auto: vertical scroll works inside the phone as normal.
                The horizontal swipe is captured on the outer frame via pointer events. */}
            <div
              ref={scrollRef}
              className="overflow-y-auto"
              style={{ maxHeight: "520px", overscrollBehavior: "contain" }}
            >
              <AnimatePresence mode="wait" custom={slideDir}>
                <motion.div
                  key={currentStep}
                  custom={slideDir}
                  // Slide in from the direction of travel, exit the other way
                  initial={{ x: slideDir * 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: slideDir * -60, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Panel />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── NAVIGATION DOTS ──
                Active dot is wider (pill shape). All dots are clickable. */}
            <div
              className="flex items-center justify-center gap-1.5 py-3 bg-zinc-900"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {STEPS.map((s) => (
                <motion.button
                  key={s.id}
                  onClick={() => {
                    setSlideDir(s.id > currentStep ? 1 : -1)
                    setCurrentStep(s.id)
                  }}
                  aria-label={`Go to step ${s.id}: ${s.label}`}
                  className="rounded-full"
                  animate={{
                    width: currentStep === s.id ? 20 : 6,
                    backgroundColor: currentStep === s.id
                      ? "rgba(255,255,255,1)"
                      : "rgba(255,255,255,0.2)",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ height: "6px" }}
                />
              ))}
            </div>
          </div>

          {/* ── ANNOTATION CARD ── */}
          <AnimatePresence mode="wait">
            <AnnotationCard key={currentStep} title={step.title} body={step.body} />
          </AnimatePresence>

        </motion.div>

        {/* ── FINAL CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mt-20"
        >
          <p className="font-instrument text-soft-grey text-sm uppercase tracking-widest mb-4">
            Ready to grow?
          </p>
          <h3 className="font-playfair text-white-axis uppercase tracking-tight text-3xl md:text-4xl mb-6">
            Get this system for your studio
          </h3>
          <motion.button
            onClick={openModal}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white-axis text-black-axis text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
          >
            Get your AXIS
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}
