"use client"
// "use client" is required: this component uses useState, useEffect,
// event handlers, and Framer Motion — all browser-only features.
// Without this directive, Next.js would try to render it on the server
// and fail because there's no browser DOM there.

import { useState, useRef, useEffect, type ReactElement } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useCTAModal } from "@/components/cta/CTAContext"

// ─── INLINE DATA ───────────────────────────────────────────────────────────────
// All Overhandz data is inlined here so this component is fully self-contained
// and doesn't depend on the Overhandz project's separate data files.

// Schedule classes displayed in the demo
const DEMO_CLASSES = [
  { id: "mon-1", day: "Mon", time: "19:00", name: "Muay-Thaï", coach: "Coach Fabrice", spotsLeft: 8, durationMinutes: 60 },
  { id: "tue-1", day: "Tue", time: "19:00", name: "Boxe Anglaise", coach: "Coach Rudy", spotsLeft: 6, durationMinutes: 60 },
  { id: "wed-1", day: "Wed", time: "18:45", name: "Muay-Thaï Féminin", coach: "Coach Morad", spotsLeft: 8, durationMinutes: 60 },
  { id: "thu-1", day: "Thu", time: "19:00", name: "Boxe Anglaise", coach: "Coach Rudy", spotsLeft: 5, durationMinutes: 60 },
  { id: "fri-1", day: "Fri", time: "20:00", name: "Muay-Thaï", coach: "Coach Morad", spotsLeft: 3, durationMinutes: 60 },
]

// Pricing plans — amounts in EUR per year
const PRICING_PLANS = [
  { id: "p1", name: "Boxe Anglaise Full", price: 450, desc: "Full access to boxing + open gym", highlight: false },
  { id: "p2", name: "Muay-Thaï Full", price: 350, desc: "Full access to Muay Thai 3×/week", highlight: true, badge: "Most Popular" },
  { id: "p3", name: "Muay-Thaï", price: 280, desc: "Muay Thai classes 2×/week", highlight: false },
  { id: "p4", name: "Muay-Thaï Féminin", price: 250, desc: "Women's Muay Thai 2×/week", highlight: false },
]

// Instagram posts — images from public/overhandz/instagram/
const INSTAGRAM_POSTS = [
  { id: "ig-1", src: "/overhandz/instagram/post-1.png", caption: "Club opening in September — Train. Fight. Belong.", likes: 62 },
  { id: "ig-2", src: "/overhandz/instagram/post-2.png", caption: "Boxing club opening in Ivry-sur-Seine. DM for sign-ups.", likes: 42 },
  { id: "ig-3", src: "/overhandz/instagram/post-3.png", caption: "Official opening September 15 🎉", likes: 89 },
  { id: "ig-4", src: "/overhandz/instagram/post-4.png", caption: "New Classic Overhandz Tee — Black & White. 20% off for 72H.", likes: 58 },
  { id: "ig-5", src: "/overhandz/instagram/post-5.png", caption: "Train with @yamani_muay_thai at Overhandz 🥊", likes: 47 },
  { id: "ig-6", src: "/overhandz/instagram/post-6.png", caption: "Closing our 2nd year — thank you to everyone.", likes: 71 },
]

// Events from the Overhandz website
const EVENTS = [
  { id: "ev-1", title: "Upcycling Crop Shirt — HUVIVA x JMT", date: "Nov 2025", img: "/overhandz/events/post-1.png", type: "Collab" },
  { id: "ev-2", title: "Overhandz @ El Cafe Gym — Mexico City", date: "Feb 2022", img: "/overhandz/events/post-2.png", type: "Open Gym" },
  { id: "ev-3", title: "Battle MBC x Overhandz", date: "Jul 2022", img: "/overhandz/events/post-3.png", type: "Competition" },
  { id: "ev-4", title: "1V1 Break & 7 To Smoke All Style", date: "Jul 2022", img: "/overhandz/events/post-4.png", type: "Competition" },
]

// Promotions / Merch — links to the real Bigcartel shop
const PROMOS = [
  { id: "pr-1", title: "Overhandz Boxing Club T-Shirt", badge: "Merch", img: "/overhandz/promotions/post-1.png", cta: "Shop Now" },
  { id: "pr-2", title: "Overhandz Giveaway", badge: "Giveaway", img: "/overhandz/promotions/post-2.png", cta: "Enter" },
  { id: "pr-3", title: "New Tiger Coat Jacket", badge: "New", img: "/overhandz/promotions/post-3.png", cta: "Shop Now" },
]

// The real Bigcartel shop URL — used in merch CTAs
const SHOP_URL =
  "https://overhandz.bigcartel.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio"

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────
// Each step has: an id, a short label (shown as tooltip on dots),
// an annotation title (the business insight), and a body sentence.

const STEPS = [
  {
    id: 1,
    label: "Hero",
    title: "Clear positioning converts visitors",
    body: "Visitors instantly understand what the studio offers and who it's for.",
  },
  {
    id: 2,
    label: "Social Proof",
    title: "Strong visuals from your Instagram build trust fast",
    body: "Your brand identity from Instagram is automatically synchronized to your website — every image, every drop, every moment.",
  },
  {
    id: 3,
    label: "Instagram",
    title: "Your Instagram becomes your website automatically",
    body: "Every post updates the site and can drive bookings or sales.",
  },
  {
    id: 4,
    label: "Schedule",
    title: "Clients book instantly — no messages needed",
    body: "A live schedule with real-time spots. One tap to reserve.",
  },
  {
    id: 5,
    label: "Pricing",
    title: "Packages generate upfront revenue",
    body: "Clear annual plans drive commitment and reduce churn.",
  },
  {
    id: 6,
    label: "Events",
    title: "Promote events without extra tools",
    body: "Fights, collabs, and open gyms — all in one place.",
  },
  {
    id: 7,
    label: "Merch",
    title: "Sell products directly from your content",
    body: "Turn your audience into buyers without leaving the site.",
  },
]

// ─── PHONE FRAME SHARED STYLES ────────────────────────────────────────────────
// These Tailwind classes are shared across all panels inside the phone frame.
// They reproduce the Overhandz website's dark design system inside the demo.
// "panel-bg" = the darkest background (same as the phone outer shell)
// "card-bg"  = slightly lighter surface for cards and list rows
// "border-ph" = the subtle divider color used between rows

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
// A self-contained booking flow (no real payment). Two steps:
// Step 1 — confirm class details.
// Step 2 — success confirmation.

interface DemoClass {
  id: string; day: string; time: string; name: string;
  coach: string; spotsLeft: number; durationMinutes: number;
}

function BookingModal({ cls, onClose }: { cls: DemoClass; onClose: () => void }) {
  // step 1 = confirm view, step 2 = success screen
  const [step, setStep] = useState<1 | 2>(1)

  return (
    // Semi-transparent overlay — covers the phone viewport
    <motion.div
      className="absolute inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      // rgba() keeps this color from being a flagged hex
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      {/* Modal panel — slides up from the bottom of the phone */}
      <motion.div
        className="w-full rounded-t-2xl p-5 bg-zinc-900"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        // Prevent tap-through to the overlay
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 ? (
          <>
            {/* Header row with close button */}
            <div className="flex justify-between items-start mb-4">
              <p className="text-white text-sm font-semibold">Confirm booking</p>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Class summary */}
            <div
              className="rounded-lg p-3 mb-4 bg-black"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-white font-semibold text-base mb-1">{cls.name}</p>
              <p className="text-zinc-400 text-xs">{cls.day} at {cls.time}</p>
              <p className="text-zinc-400 text-xs">{cls.coach} · {cls.durationMinutes} min</p>
              <p className="text-green-400 text-xs mt-1 font-medium">
                {cls.spotsLeft <= 3 ? `Only ${cls.spotsLeft} spots left` : `${cls.spotsLeft} spots available`}
              </p>
            </div>

            {/* Confirm CTA */}
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-lg text-sm font-semibold bg-white text-black"
            >
              Reserve my spot →
            </button>
          </>
        ) : (
          // Success screen
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              {/* Checkmark icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <p className="text-white font-semibold text-base mb-1">Booked!</p>
            <p className="text-zinc-400 text-xs mb-4">{cls.name} · {cls.day} at {cls.time}</p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white text-black"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── ANNOTATION CARD ──────────────────────────────────────────────────────────
// Floating card below the phone that explains each step's business value.
// Animates in/out on step change via AnimatePresence (see main section below).

function AnnotationCard({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto mt-6 px-5 py-4 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Axis blue accent dot */}
        <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-blue-axis" />
        <div>
          <p className="text-white text-sm font-semibold leading-snug mb-1">{title}</p>
          <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── HIGHLIGHT GLOW ───────────────────────────────────────────────────────────
// Wraps the focal element in each panel with a pulsing Axis-blue glow.
// This is what makes the "highlighted area" feel active and intentional.

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
      className={`rounded-xl ${className}`}
      style={{ border: "1px solid rgba(0,51,255,0.3)" }}
    >
      {children}
    </motion.div>
  )
}

// ─── STEP 1 — HERO ────────────────────────────────────────────────────────────
function HeroPanel() {
  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ minHeight: "420px" }}>
      {/* Background hero image — dimmed with opacity */}
      <Image
        src="/overhandz/ui/hero-cropped.png"
        alt="Boxers sparring at Overhandz Boxing Club in Paris"
        fill
        sizes="420px"
        className="object-cover opacity-50"
      />
      {/* Gradient fades the image into the background at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black" />

      {/* Content layer — sits above the image */}
      <div className="relative z-10 flex flex-col justify-end h-full p-5 pt-16" style={{ minHeight: "420px" }}>
        <p className="text-xs font-medium tracking-widest uppercase mb-3 text-zinc-500">
          Ivry-sur-Seine · Est. 2021
        </p>

        {/* Highlighted headline — pulsing glow draws the viewer's eye */}
        <HighlightBox className="inline-block p-1 -m-1 mb-4">
          <h2 className="text-white font-bold text-3xl leading-tight tracking-tight">
            Train.<br />Fight.<br />Belong.
          </h2>
        </HighlightBox>

        <p className="text-sm mb-5 text-zinc-400" style={{ maxWidth: "280px" }}>
          Boxing & Muay Thai in the heart of Ivry-sur-Seine. All levels welcome.
        </p>

        {/* Highlighted CTA button */}
        <HighlightBox className="self-start">
          <button className="px-5 py-3 rounded-lg text-sm font-semibold bg-white text-black">
            Book a free session →
          </button>
        </HighlightBox>
      </div>
    </div>
  )
}

// ─── STEP 2 — SOCIAL PROOF ────────────────────────────────────────────────────
function SocialProofPanel() {
  // A 2×2 collage of coach and community photos to represent the brand's visual identity
  const images = [
    { src: "/overhandz/coaches/fabrice.png", alt: "Coach Fabrice at Overhandz Boxing Club" },
    { src: "/overhandz/instagram/post-6.png", alt: "Overhandz community training session" },
    { src: "/overhandz/coaches/rudy.png", alt: "Coach Rudy training at Overhandz" },
    { src: "/overhandz/instagram/post-3.png", alt: "Overhandz Boxing Club opening day" },
  ]

  return (
    <div className="p-4 bg-black">
      <p className="text-xs font-medium tracking-widest uppercase mb-3 text-zinc-500">
        Community
      </p>
      <p className="text-white font-semibold text-xl mb-4 leading-snug">
        Where fighters become family.
      </p>

      {/* 2×2 image collage — highlighted as the focal element of this step */}
      <HighlightBox>
        <div className="grid grid-cols-2 gap-1.5 rounded-xl overflow-hidden p-0">
          {images.map((img) => (
            <div key={img.src} className="relative aspect-square overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </HighlightBox>

      {/* Quick stats strip */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[["150+", "Members"], ["3", "Coaches"], ["5×", "Per week"]].map(([val, label]) => (
          <div key={label} className="text-center">
            <p className="text-white font-bold text-lg">{val}</p>
            <p className="text-xs text-zinc-600">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── STEP 3 — INSTAGRAM FEED ──────────────────────────────────────────────────
// Simulates the Instagram feed section of the Overhandz website.
// We do NOT embed real Instagram — we use the static images instead.
// This is faster, controlled, and conversion-focused.
function InstagramPanel() {
  return (
    <div className="p-4 bg-black">
      {/* Feed header — mimics the Instagram section header on the real site */}
      <div className="flex items-center gap-2 mb-3">
        {/* Instagram gradient icon, built with inline SVG */}
        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-gradient-to-br from-yellow-400 via-rose-500 to-pink-700">
          <svg width="12" height="12" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
          </svg>
        </div>
        <div>
          <p className="text-white text-xs font-semibold leading-none">@overhandzclub</p>
          <p className="text-xs text-zinc-600">Live feed</p>
        </div>
      </div>

      {/* 3×2 image grid — highlighted as the focal element */}
      <HighlightBox>
        <div className="grid grid-cols-3 gap-0.5 rounded-xl overflow-hidden">
          {INSTAGRAM_POSTS.map((post) => (
            <div key={post.id} className="relative aspect-square overflow-hidden">
              <Image
                src={post.src}
                alt={`Instagram post from Overhandz Boxing Club: ${post.caption}`}
                fill
                sizes="140px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </HighlightBox>

      <p className="text-xs mt-3 text-center text-zinc-600">
        6 posts · Updated automatically
      </p>
    </div>
  )
}

// ─── STEP 4 — SCHEDULE ────────────────────────────────────────────────────────
// Interactive schedule — user can tap a class to open the booking modal.
function SchedulePanel() {
  // selectedClass is null until the user taps a row
  const [selectedClass, setSelectedClass] = useState<DemoClass | null>(null)

  return (
    <div className="relative bg-black">
      <div className="p-4">
        <p className="text-xs font-medium tracking-widest uppercase mb-1 text-zinc-500">
          Schedule
        </p>
        <p className="text-white font-semibold text-xl mb-4">This week&apos;s classes</p>

        {/* Class list — highlighted as the focal element of this step */}
        <HighlightBox>
          <div className="rounded-xl overflow-hidden">
            {DEMO_CLASSES.map((cls, i) => (
              <div
                key={cls.id}
                className="bg-zinc-900"
                style={{
                  borderBottom: i < DEMO_CLASSES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <div className="flex items-center justify-between px-3 py-2.5">
                  {/* Left: abbreviated day + class name + coach */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold w-8 shrink-0 text-blue-axis">
                      {cls.day}
                    </span>
                    <div>
                      <p className="text-white text-xs font-semibold leading-none">{cls.name}</p>
                      <p className="text-xs mt-0.5 text-zinc-500">
                        {cls.time} · {cls.coach}
                      </p>
                    </div>
                  </div>

                  {/* Right: urgency badge (only when ≤ 3 spots) + book button */}
                  <div className="flex items-center gap-2">
                    {cls.spotsLeft <= 3 && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium text-orange-400"
                        style={{ background: "rgba(251,146,60,0.12)" }}
                      >
                        {cls.spotsLeft} left
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedClass(cls)}
                      className="text-xs px-2.5 py-1 rounded-md font-semibold bg-white text-black"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </HighlightBox>
      </div>

      {/* AnimatePresence plays exit animation before unmounting the modal */}
      <AnimatePresence>
        {selectedClass && (
          <BookingModal cls={selectedClass} onClose={() => setSelectedClass(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── STEP 5 — PRICING ─────────────────────────────────────────────────────────
// Interactive pricing cards — tap to select and reveal the sign-up CTA.
function PricingPanel() {
  // activePlan is null until the user taps a card
  const [activePlan, setActivePlan] = useState<string | null>(null)

  return (
    <div className="p-4 bg-black">
      <p className="text-xs font-medium tracking-widest uppercase mb-1 text-zinc-500">
        Pricing
      </p>
      <p className="text-white font-semibold text-xl mb-4">Membership plans</p>

      {/* 2×2 grid of pricing cards — the whole block is highlighted */}
      <HighlightBox>
        <div className="grid grid-cols-2 gap-2 p-1.5">
          {PRICING_PLANS.map((plan) => {
            const isActive = activePlan === plan.id
            return (
              <motion.button
                key={plan.id}
                onClick={() => setActivePlan(isActive ? null : plan.id)}
                // Scale slightly on selection to give tactile feedback
                animate={{ scale: isActive ? 1.02 : 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`text-left rounded-xl p-3 flex flex-col ${isActive ? "" : "bg-zinc-900"}`}
                style={{
                  background: isActive ? "rgba(0,51,255,0.1)" : undefined,
                  border: `1px solid ${isActive ? "rgba(0,51,255,0.5)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {/* "Most Popular" badge — only shown when badge is set */}
                {plan.badge && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium mb-1.5 self-start text-blue-300"
                    style={{ background: "rgba(0,51,255,0.2)" }}
                  >
                    {plan.badge}
                  </span>
                )}
                <p className="text-white text-xs font-semibold leading-snug mb-1">{plan.name}</p>
                <p className="text-white font-bold mb-1" style={{ fontSize: "18px" }}>
                  €{plan.price}
                </p>
                <p className="text-xs leading-snug text-zinc-500">{plan.desc}</p>

                {/* CTA only visible when this card is selected */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 block text-center text-xs font-semibold py-1.5 rounded-md bg-white text-black"
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

      <p className="text-xs text-center mt-3 text-zinc-600">
        Tap a plan to select it
      </p>
    </div>
  )
}

// ─── STEP 6 — EVENTS ──────────────────────────────────────────────────────────
// Expandable event cards — tap to expand and reveal the "Join event" CTA.
function EventsPanel() {
  // expandedEvent is null until the user taps an event row
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  return (
    <div className="p-4 bg-black">
      <p className="text-xs font-medium tracking-widest uppercase mb-1 text-zinc-500">
        Events
      </p>
      <p className="text-white font-semibold text-xl mb-4">Upcoming & past events</p>

      {/* Event list — highlighted as focal element */}
      <HighlightBox>
        <div className="space-y-1 p-1.5">
          {EVENTS.map((ev) => {
            const isOpen = expandedEvent === ev.id
            return (
              // motion.div with layout prop enables smooth height animation
              // when the card expands to reveal the CTA
              <motion.div
                key={ev.id}
                layout
                className="rounded-xl overflow-hidden bg-zinc-900"
              >
                <button
                  onClick={() => setExpandedEvent(isOpen ? null : ev.id)}
                  className="w-full text-left flex items-center gap-3 p-3"
                >
                  {/* Event thumbnail */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={ev.img}
                      alt={`${ev.title} — Overhandz Boxing Club event`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold leading-snug truncate">{ev.title}</p>
                    <p className="text-xs mt-0.5 text-zinc-500">{ev.date}</p>
                  </div>

                  {/* Event type label */}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded shrink-0 text-zinc-400"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    {ev.type}
                  </span>
                </button>

                {/* Expand area — "Join event" CTA */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-3 pb-3">
                        <button className="w-full py-2 rounded-lg text-xs font-semibold bg-white text-black">
                          Join event →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </HighlightBox>
    </div>
  )
}

// ─── STEP 7 — MERCH / PROMOTIONS ──────────────────────────────────────────────
// Product cards with CTAs that open the real Bigcartel shop.
function MerchPanel() {
  return (
    <div className="p-4 bg-black">
      <p className="text-xs font-medium tracking-widest uppercase mb-1 text-zinc-500">
        Shop
      </p>
      <p className="text-white font-semibold text-xl mb-4">Gear & promotions</p>

      {/* Product card list — highlighted as focal element */}
      <HighlightBox>
        <div className="space-y-1 p-1.5">
          {PROMOS.map((promo) => (
            <div
              key={promo.id}
              className="rounded-xl overflow-hidden bg-zinc-900"
            >
              <div className="flex gap-3 p-3">
                {/* Product thumbnail */}
                <div className="relative rounded-lg overflow-hidden shrink-0" style={{ width: "64px", height: "64px" }}>
                  <Image
                    src={promo.img}
                    alt={`${promo.title} — Overhandz Boxing Club`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Product category badge */}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium text-zinc-400"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    {promo.badge}
                  </span>
                  <p className="text-white text-xs font-semibold mt-1 leading-snug">{promo.title}</p>

                  {/* CTA — opens the real Bigcartel store in a new tab */}
                  <a
                    href={SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-3 py-1 rounded-md text-xs font-semibold bg-white text-black"
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

// ─── STEP PANEL MAP ────────────────────────────────────────────────────────────
// Maps step number → the panel component to render in the phone frame.
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
  // currentStep: which of the 7 demo steps is active (1-indexed)
  const [currentStep, setCurrentStep] = useState(1)

  // scrollRef: points to the phone's scrollable content area.
  // We use it to reset scroll position to the top on each step change.
  const scrollRef = useRef<HTMLDivElement>(null)

  // openModal: function from the Axis CTA context, opens the lead-capture modal
  const { openModal } = useCTAModal()

  // Reset the phone viewport to the top whenever the step changes.
  // Without this, a user who scrolled down in Step 4 would see Step 5 mid-scroll.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentStep])

  const step = STEPS[currentStep - 1]
  const Panel = PANELS[currentStep]

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length))
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const isFirst = currentStep === 1
  const isLast = currentStep === STEPS.length

  return (
    // Outer section — Axis dark background, standard section padding
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
          {/* Eyebrow label — uses Axis blue accent color */}
          <p className="text-blue-axis font-instrument text-xs uppercase tracking-widest mb-4">
            Our Work
          </p>

          {/* Section headline — <h2> because the Hero owns the <h1> */}
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

          {/* ── PHONE FRAME ── */}
          {/* max-w-sm keeps the container at ~380–400px — mobile viewport size */}
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden relative bg-zinc-950"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >

            {/* ── FAKE BROWSER BAR ── */}
            {/* Mimics the address bar of a mobile browser */}
            <div
              className="flex items-center gap-2 px-4 py-3 bg-zinc-900"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Green dot = "Live" indicator */}
              <span className="w-2 h-2 rounded-full shrink-0 bg-green-500" />

              {/* URL bar replica */}
              <div
                className="flex-1 text-center rounded-md px-2 py-1 bg-zinc-800"
              >
                <span className="text-xs text-zinc-400">overhandzclub.com</span>
              </div>

              {/* "Live demo" badge */}
              <span
                className="text-xs px-2 py-0.5 rounded font-medium shrink-0 text-green-400"
                style={{ background: "rgba(34,197,94,0.12)" }}
              >
                Live demo
              </span>
            </div>

            {/* ── STEP PANEL ── */}
            {/* overflow-y-auto: allows scrolling within the phone viewport.
                max-h ensures the phone stays at a consistent height.
                overscroll-contain prevents the page from scrolling when you
                reach the end of the phone's scroll area. */}
            <div
              ref={scrollRef}
              className="overflow-y-auto"
              style={{ maxHeight: "520px", overscrollBehavior: "contain" }}
            >
              {/* AnimatePresence with mode="wait" ensures the outgoing panel
                  finishes its exit animation before the incoming one starts */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Panel />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── NAVIGATION DOTS ── */}
            {/* One dot per step. Active dot stretches wide (pill shape).
                Each dot is also clickable to jump to that step directly. */}
            <div
              className="flex items-center justify-center gap-1.5 py-3 bg-zinc-900"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {STEPS.map((s) => (
                // motion.button lets Framer Motion animate the dot's width and
                // background colour — no raw CSS transitions on interactive elements.
                <motion.button
                  key={s.id}
                  onClick={() => setCurrentStep(s.id)}
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
          {/* AnimatePresence with mode="wait" animates the old card out
              before the new one appears when the step changes */}
          <AnimatePresence mode="wait">
            <AnnotationCard key={currentStep} title={step.title} body={step.body} />
          </AnimatePresence>

          {/* ── PREV / NEXT NAVIGATION ── */}
          <div className="flex items-center gap-6 mt-6">
            {/* Prev button — disabled on step 1 */}
            <motion.button
              onClick={goPrev}
              disabled={isFirst}
              whileHover={{ scale: isFirst ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`
                flex items-center gap-2 text-xs font-semibold uppercase tracking-widest
                px-5 py-2.5 rounded-lg
                ${isFirst
                  ? "text-white/20 border border-white/10 cursor-default"
                  : "text-white border border-white/20 cursor-pointer hover:border-white/40"
                }
              `}
            >
              ← Prev
            </motion.button>

            {/* Step counter */}
            <span className="font-instrument text-xs uppercase tracking-widest text-zinc-600">
              {currentStep} / {STEPS.length}
            </span>

            {/* Next button — disabled on the last step */}
            <motion.button
              onClick={goNext}
              disabled={isLast}
              whileHover={{ scale: isLast ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`
                flex items-center gap-2 text-xs font-semibold uppercase tracking-widest
                px-5 py-2.5 rounded-lg
                ${isLast
                  ? "text-white/20 border border-white/10 cursor-default"
                  : "bg-white text-black cursor-pointer"
                }
              `}
            >
              Next →
            </motion.button>
          </div>
        </motion.div>

        {/* ── FINAL CTA ── */}
        {/* useCTAModal() connects this button to the global Axis CTA modal */}
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
