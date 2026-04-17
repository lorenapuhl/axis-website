"use client"
// FeaturePanels.tsx — Self-contained panel components for OverhandzFeaturesSection.
//
// Each panel renders a real section of the Overhandz website.
// These components intentionally use Overhandz styling (zinc palette + dark theme)
// because they ARE the Overhandz website — displayed inside the Axis demo.
//
// Panels do NOT follow Axis component conventions — they follow Overhandz conventions.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// ─── DATA ─────────────────────────────────────────────────────────────────────
// Matches the live Overhandz website content exactly.

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
  { id: "ig-1", src: "/overhandz/instagram/post-1.png", caption: "Club opening in September — Train. Fight. Belong.", likes: 62, link: "https://www.instagram.com/overhandzclub/" },
  { id: "ig-2", src: "/overhandz/instagram/post-2.png", caption: "Boxing club in Ivry-sur-Seine.", likes: 42, link: "https://www.instagram.com/overhandzclub/" },
  { id: "ig-3", src: "/overhandz/instagram/post-3.png", caption: "Official opening September 15 🎉", likes: 89, link: "https://www.instagram.com/overhandzclub/" },
  { id: "ig-4", src: "/overhandz/instagram/post-4.png", caption: "Classic Overhandz Tee — Black & White.", likes: 58, link: "https://www.instagram.com/overhandzclub/" },
  { id: "ig-5", src: "/overhandz/instagram/post-5.png", caption: "Train with @yamani_muay_thai 🥊", likes: 47, link: "https://www.instagram.com/overhandzclub/" },
  { id: "ig-6", src: "/overhandz/instagram/post-6.png", caption: "Closing our 2nd year — thank you.", likes: 71, link: "https://www.instagram.com/overhandzclub/" },
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
const SITE_URL = "https://overhandz-website.vercel.app/en"

// ─── TYPE ─────────────────────────────────────────────────────────────────────
interface DemoClass {
  id: string; day: string; time: string; name: string;
  coach: string; spotsLeft: number; durationMinutes: number;
}

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
// Slides up from the bottom of its parent panel.
// Uses absolute positioning so it stays contained within the preview frame —
// not a full-page fixed overlay like a typical modal.
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
        className="w-full rounded-t-2xl p-5 bg-zinc-900 border-t border-white/10"
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
            <div className="rounded-lg p-3 mb-4 bg-black border border-white/10">
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
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4"
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

// ─── 1. MOBILE EXPERIENCE PANEL ───────────────────────────────────────────────
// Overhandz hero: full-width image → copy → two CTA buttons.
// Shows what a mobile visitor sees when they first land on the website.
export function MobileExperiencePanel() {
  return (
    <div className="bg-zinc-950">
      {/* Hero image — full width, 4:5 ratio like the real mobile hero */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src="/overhandz/ui/hero-cropped.png"
          alt="Boxers sparring during training session at Overhandz Boxing Club in Paris"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
        {/* Gradient fades the image into the dark copy section below */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
      </div>

      {/* Copy section — matches Overhandz mobile hero layout exactly */}
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
        {/* Two CTAs — primary (solid white) + secondary (outline) */}
        <div className="flex flex-col gap-3">
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3.5 rounded-xl text-sm font-semibold bg-white text-black text-center"
          >
            Book a free session
          </a>
          <a
            href={`${SITE_URL}/schedule`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3.5 rounded-xl text-sm font-semibold text-white text-center border border-white/20"
          >
            View schedule
          </a>
        </div>
        <p className="text-zinc-500 text-xs mt-6 text-center">150+ members · No commitment</p>
      </div>
    </div>
  )
}

// ─── 2 & 3. SCHEDULE PANEL ────────────────────────────────────────────────────
// Used for both "Instant Booking" and "Class Schedule" pills.
// Day tabs filter classes. "Book" button opens the inline booking modal.
export function SchedulePanel() {
  const [selectedDay, setSelectedDay] = useState("Mon")
  const [selectedClass, setSelectedClass] = useState<DemoClass | null>(null)

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const filtered = DEMO_CLASSES.filter((c) => c.day === selectedDay)

  return (
    // relative — needed so BookingModal's absolute inset-0 fills this panel
    <div className="relative bg-zinc-950">
      <div className="px-4 pt-4 pb-6">
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">
          Schedule
        </p>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-white font-semibold text-3xl tracking-tight">Book a class</h2>
          <a
            href={`${SITE_URL}/schedule`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-zinc-400 pb-1 border-b border-white/20"
          >
            Full schedule
          </a>
        </div>

        {/* Day filter pills — overflow-x-auto mirrors the real website behavior */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                selectedDay === day ? "bg-white text-black" : "text-zinc-400 bg-zinc-900"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Class rows */}
        <div className="rounded-xl overflow-hidden border border-white/[0.06]">
          {filtered.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8 bg-zinc-900">
              No classes on {selectedDay}.
            </p>
          ) : (
            filtered.map((cls) => (
              <div
                key={cls.id}
                className="bg-zinc-900 flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] last:border-b-0"
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
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium text-orange-400 bg-orange-400/10">
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
      </div>

      {/* Booking modal — slides up from inside the panel, not full-page */}
      <AnimatePresence>
        {selectedClass && (
          <BookingModal cls={selectedClass} onClose={() => setSelectedClass(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── 4. MEMBERSHIPS PANEL ─────────────────────────────────────────────────────
// All 4 pricing cards. Tap a card to reveal the "Sign up" CTA.
export function MembershipsPanel() {
  const [activePlan, setActivePlan] = useState<string | null>(null)

  return (
    <div className="px-4 pt-4 pb-6 bg-zinc-950">
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">Memberships</p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-2">Choose your plan</h2>
      <p className="text-zinc-400 text-base mb-6">Join Overhandz Boxing Club today.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRICING_PLANS.map((plan) => {
          const isActive = activePlan === plan.id
          return (
            <motion.button
              key={plan.id}
              onClick={() => setActivePlan(isActive ? null : plan.id)}
              animate={{ scale: isActive ? 1.02 : 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-left rounded-xl p-4 flex flex-col"
              style={{
                background: isActive ? "rgba(0,51,255,0.08)" : "#18181B",
                border: `1px solid ${isActive ? "rgba(0,51,255,0.5)" : plan.highlight ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {plan.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium mb-2 self-start text-blue-300 bg-blue-500/20">
                  {plan.badge}
                </span>
              )}
              <p className="text-white font-semibold text-base mb-1">{plan.name}</p>
              <div className="mb-2">
                <span className="text-white font-bold text-3xl">€{plan.price}</span>
                <span className="text-zinc-400 text-sm ml-1">/ year</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed mb-3 flex-1">{plan.desc}</p>
              {/* CTA expands when card is selected */}
              <AnimatePresence>
                {isActive && (
                  <motion.a
                    href={`${SITE_URL}/pricing`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block text-center text-sm font-semibold py-2.5 rounded-lg bg-white text-black"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Sign up →
                  </motion.a>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      <p className="text-zinc-600 text-xs text-center mt-3">Tap a plan to select it</p>
    </div>
  )
}

// ─── 5. ONLINE PAYMENTS PANEL ─────────────────────────────────────────────────
// One featured card pre-selected — clicking "Sign up" opens a 3-step
// checkout flow (name → card details → success) to show the payment UX.
export function OnlinePaymentsPanel() {
  const featured = PRICING_PLANS[1] // "Muay-Thaï Full" — Most Popular
  const [modalOpen, setModalOpen] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const handleClose = () => {
    setModalOpen(false)
    // Reset step after modal exit animation completes
    setTimeout(() => setStep(1), 350)
  }

  // Shared input class for the checkout form fields
  const inputClass =
    "w-full bg-black border border-white/10 rounded-md px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/30"

  return (
    // relative — so the checkout modal stays contained in the preview frame
    <div className="relative px-4 pt-4 pb-6 bg-zinc-950">
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">Online Payments</p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-6">Purchase in one flow</h2>

      {/* Featured card — pre-selected / highlighted state */}
      <div
        className="rounded-xl p-5 mb-4"
        style={{ background: "rgba(0,51,255,0.08)", border: "1px solid rgba(0,51,255,0.4)" }}
      >
        <span className="text-xs px-2 py-0.5 rounded-full font-medium mb-3 inline-block text-blue-300 bg-blue-500/20">
          {featured.badge}
        </span>
        <p className="text-white font-semibold text-lg mb-1">{featured.name}</p>
        <div className="mb-5">
          <span className="text-white font-bold text-4xl">€{featured.price}</span>
          <span className="text-zinc-400 text-sm ml-2">/ year</span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-3 rounded-lg text-sm font-semibold bg-white text-black"
        >
          Sign up — pay securely →
        </button>
      </div>

      <p className="text-zinc-500 text-xs text-center">Powered by Stripe · SSL encrypted</p>

      {/* Inline checkout modal — 3 steps: personal details → card → success */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="absolute inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{ background: "rgba(0,0,0,0.75)" }}
          >
            <motion.div
              className="w-full rounded-t-2xl p-5 bg-zinc-900 border-t border-white/10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress bar — 3 steps */}
              {step < 3 && (
                <div className="flex gap-2 mb-5">
                  {[1, 2].map((s) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        s <= step ? "bg-white" : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="pay-s1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                  >
                    <p className="text-white font-semibold text-sm mb-4">Your details</p>
                    <div className="bg-black border border-white/10 rounded-lg p-3 mb-4">
                      <p className="text-white font-semibold text-sm">{featured.name}</p>
                      <p className="text-zinc-400 text-xs">€{featured.price} / year</p>
                    </div>
                    <div className="space-y-3 mb-4">
                      <input type="text" placeholder="Full name" className={inputClass} />
                      <input type="email" placeholder="Email address" className={inputClass} />
                    </div>
                    <button onClick={() => setStep(2)} className="w-full py-3 rounded-lg text-sm font-semibold bg-white text-black">
                      Continue to payment →
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="pay-s2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                  >
                    <p className="text-white font-semibold text-sm mb-4">Payment</p>
                    <div className="space-y-3 mb-4">
                      <input type="text" placeholder="4242 4242 4242 4242" className={inputClass} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className={inputClass} />
                        <input type="text" placeholder="CVC" className={inputClass} />
                      </div>
                    </div>
                    <p className="text-zinc-600 text-xs mb-4">Demo only — no real charge</p>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg text-sm font-medium text-zinc-400 bg-zinc-800">
                        Back
                      </button>
                      <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg text-sm font-semibold bg-white text-black">
                        Pay €{featured.price} →
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="pay-s3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                    <p className="text-white font-semibold text-base mb-1">Membership activated!</p>
                    <p className="text-zinc-400 text-xs mb-4">{featured.name} · Confirmation sent to your email</p>
                    <button onClick={handleClose} className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white text-black">
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── 6. LIVE INSTAGRAM PANEL ──────────────────────────────────────────────────
// 3×2 post grid with hover overlay (desktop) or tap-to-reveal (mobile).
// Clicking a post opens it on Instagram — showing the live-sync feature.
export function LiveInstagramPanel() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const handlePostClick = (post: typeof INSTAGRAM_POSTS[0]) => {
    // On touch devices: first tap reveals overlay, second tap opens link.
    // On pointer devices: single click opens link directly.
    const isTouchDevice =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
    if (isTouchDevice) {
      if (activeId === post.id) {
        window.open(post.link, "_blank", "noopener,noreferrer")
        setActiveId(null)
      } else {
        setActiveId(post.id)
      }
    } else {
      window.open(post.link, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="px-4 pt-4 pb-6 bg-zinc-950">
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">
        @overhandzclub
      </p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-6">
        Follow our journey
      </h2>

      {/* 3×2 post grid — matches the live InstagramFeed layout */}
      <div className="grid grid-cols-3 gap-0.5">
        {INSTAGRAM_POSTS.map((post) => {
          const overlayVisible = hoveredId === post.id || activeId === post.id
          return (
            <button
              key={post.id}
              className="relative aspect-square overflow-hidden cursor-pointer text-left w-full"
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handlePostClick(post)}
            >
              {/* Post image — scales on hover */}
              <motion.div
                className="absolute inset-0"
                animate={{ scale: overlayVisible ? 1.08 : 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Image
                  src={post.src}
                  alt={`Instagram post from Overhandz Boxing Club: ${post.caption}`}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </motion.div>

              {/* Overlay — shows likes + caption */}
              <motion.div
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2"
                animate={{ opacity: overlayVisible ? 1 : 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-center gap-1 text-white text-xs font-semibold mb-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {post.likes}
                </div>
                <p className="text-white/80 text-[10px] text-center line-clamp-2 leading-snug">
                  {post.caption}
                </p>
              </motion.div>
            </button>
          )
        })}
      </div>

      <motion.a
        href="https://www.instagram.com/overhandzclub/"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-zinc-500 text-sm mt-4"
        whileHover={{ color: "#A1A1A1" }}
        transition={{ duration: 0.15 }}
      >
        @overhandzclub · Updated automatically
      </motion.a>
    </div>
  )
}

// ─── 7. EVENTS PANEL ──────────────────────────────────────────────────────────
// 2×2 event cards sourced from Instagram — each links to Instagram.
export function EventsAutoPanel() {
  return (
    <div className="px-4 pt-4 pb-6 bg-zinc-950">
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">Events</p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-6">
        What&apos;s happening
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EVENTS.map((ev) => (
          <a
            key={ev.id}
            href={ev.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden bg-zinc-900"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Event image */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={ev.img}
                alt={`${ev.title} — Overhandz Boxing Club event`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="text-xs px-2 py-0.5 rounded font-medium text-white bg-black/60">
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
    </div>
  )
}

// ─── 8. OFFERS & MERCH PANEL ──────────────────────────────────────────────────
// Promo/merch cards sourced from Instagram — link to the Overhandz shop.
export function OffersMerchPanel() {
  return (
    <div className="px-4 pt-4 pb-6 bg-zinc-950">
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">Shop</p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-6">
        Gear & promotions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROMOS.map((promo, i) => (
          <div
            key={promo.id}
            className={`rounded-xl overflow-hidden bg-zinc-900 flex flex-col cursor-pointer ${
              i === 1 ? "sm:col-span-2" : ""
            }`}
            style={{
              border: promo.highlight
                ? "1px solid rgba(255,255,255,0.25)"
                : "1px solid rgba(255,255,255,0.06)",
            }}
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
                <span className="text-xs px-2 py-0.5 rounded font-medium text-white bg-black/60">
                  {promo.badge}
                </span>
              </div>
            </div>

            {/* Details + shop CTA */}
            <div className="p-4 flex flex-col flex-1">
              <p className="text-white font-semibold text-base mb-3 flex-1">{promo.title}</p>
              <a
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                  promo.highlight
                    ? "bg-white text-black"
                    : "text-white border border-white/25"
                }`}
              >
                {promo.cta} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 9. TRUST & BRANDING PANEL ────────────────────────────────────────────────
// Stats strip + coach portraits + about image — shows the brand identity.
export function TrustBrandingPanel() {
  return (
    <div className="bg-zinc-950 pb-6">
      {/* Stats grid */}
      <div className="mx-4 mt-4 rounded-xl overflow-hidden border border-white/[0.06]">
        <div className="grid grid-cols-2">
          {[
            { value: "150+", label: "Active members" },
            { value: "3", label: "Expert coaches" },
            { value: "5×", label: "Classes per week" },
            { value: "4+", label: "Disciplines" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center py-6 px-4 bg-zinc-900 ${
                i % 2 === 0 ? "border-r border-white/[0.06]" : ""
              } ${i < 2 ? "border-b border-white/[0.06]" : ""}`}
            >
              <p className="text-white font-bold text-3xl tracking-tight">{stat.value}</p>
              <p className="text-zinc-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coach portraits */}
      <div className="px-4 pt-5 pb-4">
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

      {/* About image with caption overlay */}
      <div className="mx-4 rounded-xl overflow-hidden">
        <div className="relative aspect-[16/7]">
          <Image
            src="/overhandz/ui/about-cropped.png"
            alt="Coach training a student at Overhandz Boxing Club in Ivry-sur-Seine, Paris"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
            <div>
              <p className="text-white font-semibold text-base">Built for fighters</p>
              <p className="text-zinc-300 text-sm">A community in Ivry-sur-Seine since 2021</p>
            </div>
          </div>
        </div>
      </div>

      {/* About CTA */}
      <div className="px-4 pt-4">
        <a
          href={`${SITE_URL}/about`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 text-center rounded-xl text-sm font-semibold text-white border border-white/20"
        >
          About the club →
        </a>
      </div>
    </div>
  )
}
