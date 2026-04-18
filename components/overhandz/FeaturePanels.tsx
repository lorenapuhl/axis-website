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
// Matches the live Overhandz website content exactly (from classes.ts + pricing.ts).

// Full day names — exactly as used in the original Overhandz website data
const WEEK_DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const
type DayOfWeek = typeof WEEK_DAYS[number]

// Short day labels for mobile — slice(0,3) gives Mon, Tue, etc.
const DAY_SHORT: Record<DayOfWeek, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
  Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
}

// The three class disciplines available at the club
const CLASS_TYPES = ["Boxe Anglaise", "Muay-Thaï", "Muay-Thaï Féminin"] as const
type ClassType = typeof CLASS_TYPES[number]

interface DemoClass {
  id: string
  day: DayOfWeek
  time: string          // "HH:MM" 24-hour format
  name: string
  type: ClassType
  coach: string
  spotsLeft: number
  durationMinutes: number
  description: string   // English description shown on the schedule page
}

// All 7 classes across the week — sourced from classes.ts
const DEMO_CLASSES: DemoClass[] = [
  { id: "mon-1", day: "Monday",    time: "19:00", name: "Muay-Thaï",         type: "Muay-Thaï",         coach: "Coach Fabrice", spotsLeft: 8, durationMinutes: 60, description: "All-levels Muay Thai class. Striking techniques, pad work, and conditioning." },
  { id: "tue-1", day: "Tuesday",   time: "19:00", name: "Boxe Anglaise",     type: "Boxe Anglaise",     coach: "Coach Rudy",    spotsLeft: 6, durationMinutes: 60, description: "Boxing class. Technique, combinations, and bag work." },
  { id: "wed-1", day: "Wednesday", time: "18:45", name: "Muay-Thaï Féminin", type: "Muay-Thaï Féminin", coach: "Coach Morad",   spotsLeft: 8, durationMinutes: 60, description: "Women's Muay Thai class. Welcoming atmosphere, solid technique." },
  { id: "wed-2", day: "Wednesday", time: "20:00", name: "Muay-Thaï",         type: "Muay-Thaï",         coach: "Coach Morad",   spotsLeft: 7, durationMinutes: 60, description: "All-levels Muay Thai. Pads, technique, and light sparring." },
  { id: "thu-1", day: "Thursday",  time: "19:00", name: "Boxe Anglaise",     type: "Boxe Anglaise",     coach: "Coach Rudy",    spotsLeft: 5, durationMinutes: 60, description: "Boxing class. Advanced technique, footwork, and supervised sparring." },
  { id: "fri-1", day: "Friday",    time: "18:45", name: "Muay-Thaï Féminin", type: "Muay-Thaï Féminin", coach: "Coach Morad",   spotsLeft: 9, durationMinutes: 60, description: "Women's Muay Thai. Conditioning and technique." },
  { id: "fri-2", day: "Friday",    time: "20:00", name: "Muay-Thaï",         type: "Muay-Thaï",         coach: "Coach Morad",   spotsLeft: 8, durationMinutes: 60, description: "Muay Thai class. Active end-of-week session with intensive pad work." },
]

// Pricing plans — English content sourced from pricing.ts
interface PricingBenefit {
  text: string
  included: boolean
}

interface PricingPlan {
  id: string
  name: string
  price: number
  badge: string | null
  description: string
  benefits: PricingBenefit[]
  note?: string
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "boxe-anglaise-full",
    name: "Boxe Anglaise Full",
    price: 450,
    badge: null,
    description: "Full access to boxing classes with open gym access.",
    benefits: [
      { text: "Boxing classes (Tue & Thu)", included: true },
      { text: "Monday open access outside of classes", included: true },
      { text: "Open gym access", included: true },
      { text: "1 free T-shirt", included: true },
      { text: "Muay Thai classes included", included: false },
    ],
    note: "* Reduced price for students and pupils",
  },
  {
    id: "muay-thai-full",
    name: "Muay-Thaï Full",
    price: 350,
    badge: null,
    description: "Full access to Muay Thai classes three times a week.",
    benefits: [
      { text: "Muay Thai classes (Mon, Wed, Fri)", included: true },
      { text: "Open gym access", included: true },
      { text: "1 free T-shirt", included: true },
      { text: "Boxing classes included", included: false },
    ],
  },
  {
    id: "muay-thai",
    name: "Muay-Thaï",
    price: 280,
    badge: null,
    description: "Muay Thai classes twice a week.",
    benefits: [
      { text: "Muay Thai classes (Wed & Fri)", included: true },
      { text: "Open gym access", included: false },
      { text: "Free T-shirt", included: false },
      { text: "Boxing classes included", included: false },
    ],
  },
  {
    id: "muay-thai-feminin",
    name: "Muay-Thaï Féminin",
    price: 250,
    badge: null,
    description: "Women's Muay Thai classes twice a week.",
    benefits: [
      { text: "Women's Muay Thai (Wed & Fri)", included: true },
      { text: "Open gym access", included: false },
      { text: "Free T-shirt", included: false },
      { text: "Additional classes included", included: false },
    ],
  },
]

// Simple à-la-carte options shown below the pricing cards
const SIMPLE_OPTIONS = [
  { label: "Drop-in class",     price: 15,   unit: "per class" },
  { label: "Monthly membership", price: 60,  unit: "per month" },
  { label: "Private lesson",    price: null, unit: "contact us" },
]

// Instagram posts — sourced from the actual @overhandzclub feed
const INSTAGRAM_POSTS = [
  { id: "ig-1", src: "/overhandz/instagram/post-1.png", caption: "Club opening in September — Train. Fight. Belong.", likes: 62 },
  { id: "ig-2", src: "/overhandz/instagram/post-2.png", caption: "Boxing club in Ivry-sur-Seine.", likes: 42 },
  { id: "ig-3", src: "/overhandz/instagram/post-3.png", caption: "Official opening September 15 🎉", likes: 89 },
  { id: "ig-4", src: "/overhandz/instagram/post-4.png", caption: "Classic Overhandz Tee — Black & White.", likes: 58 },
  { id: "ig-5", src: "/overhandz/instagram/post-5.png", caption: "Train with @yamani_muay_thai 🥊", likes: 47 },
  { id: "ig-6", src: "/overhandz/instagram/post-6.png", caption: "Closing our 2nd year — thank you.", likes: 71 },
]

const EVENTS = [
  { id: "ev-1", title: "Upcycling Crop Shirt — HUVIVA x JMT",       date: "Nov 2025", img: "/overhandz/events/post-1.png", type: "Collab" },
  { id: "ev-2", title: "Overhandz @ El Cafe Gym — Mexico City",      date: "Feb 2022", img: "/overhandz/events/post-2.png", type: "Open Gym" },
  { id: "ev-3", title: "Battle MBC x Overhandz",                     date: "Jul 2022", img: "/overhandz/events/post-3.png", type: "Competition" },
  { id: "ev-4", title: "1V1 Break & 7 To Smoke All Style",           date: "Jul 2022", img: "/overhandz/events/post-4.png", type: "Competition" },
]

const PROMOS = [
  { id: "pr-1", title: "Overhandz Boxing Club T-Shirt", badge: "Merch",    img: "/overhandz/promotions/post-1.png", cta: "Shop Now",       highlight: false },
  { id: "pr-2", title: "Overhandz Giveaway",            badge: "Giveaway", img: "/overhandz/promotions/post-2.png", cta: "Enter Giveaway", highlight: true },
  { id: "pr-3", title: "New Tiger Coat Jacket",         badge: "New",      img: "/overhandz/promotions/post-3.png", cta: "Shop Now",       highlight: false },
]

const SHOP_URL = "https://overhandz.bigcartel.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
const SITE_URL = "https://overhandz-website.vercel.app/en"
const IG_URL   = "https://www.instagram.com/overhandzclub/"

// ─── SHARED: SPOTS BADGE ───────────────────────────────────────────────────────
// Mirrors the Badge component from the original Overhandz website.
// "urgent" variant (≤ 3 spots) → orange. Default → dim text.
function SpotsBadge({ spotsLeft }: { spotsLeft: number }) {
  if (spotsLeft <= 3) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-orange-400 bg-orange-400/10">
        Only {spotsLeft} left
      </span>
    )
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium text-zinc-400 bg-zinc-800">
      {spotsLeft} spots
    </span>
  )
}

// ─── SHARED: BOOKING MODAL ────────────────────────────────────────────────────
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
              Reserve my spot
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

// ─── SHARED: CHECKOUT MODAL ────────────────────────────────────────────────────
// 3-step checkout: personal details → card payment → success.
// Absolute-positioned so it stays inside the preview panel.
function CheckoutModal({ plan, onClose }: { plan: PricingPlan; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const handleClose = () => {
    onClose()
    // Reset step after exit animation completes
    setTimeout(() => setStep(1), 350)
  }

  const inputClass =
    "w-full bg-black border border-white/10 rounded-md px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/30"

  return (
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
        {/* Progress bar — 2 steps before success */}
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
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
            >
              <p className="text-white font-semibold text-sm mb-4">Your details</p>
              <div className="bg-black border border-white/10 rounded-lg p-3 mb-4">
                <p className="text-white font-semibold text-sm">{plan.name}</p>
                <p className="text-zinc-400 text-xs">€{plan.price} / year</p>
              </div>
              <div className="space-y-3 mb-4">
                <input type="text"  placeholder="Full name"      className={inputClass} />
                <input type="email" placeholder="Email address"  className={inputClass} />
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3 rounded-lg text-sm font-semibold bg-white text-black">
                Continue to payment
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
            >
              <p className="text-white font-semibold text-sm mb-4">Payment</p>
              <div className="space-y-3 mb-4">
                <input type="text" placeholder="4242 4242 4242 4242" className={inputClass} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" className={inputClass} />
                  <input type="text" placeholder="CVC"   className={inputClass} />
                </div>
              </div>
              <p className="text-zinc-600 text-xs mb-4">Demo only — no real charge</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg text-sm font-medium text-zinc-400 bg-zinc-800">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg text-sm font-semibold bg-white text-black">
                  Pay €{plan.price}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
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
              <p className="text-zinc-400 text-xs mb-4">{plan.name} · Confirmation sent to your email</p>
              <button onClick={handleClose} className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white text-black">Done</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── 1. MOBILE EXPERIENCE PANEL ───────────────────────────────────────────────
// Mobile: stacked (image top, copy below). Desktop: 2-column like the real hero.
export function MobileExperiencePanel() {
  return (
    <div className="bg-black py-10 px-6 md:py-20 md:px-12 min-h-[480px] md:min-h-screen flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full">

        {/* LEFT — copy + CTAs (on desktop) / shown below image on mobile */}
        <div className="order-2 md:order-1">
          <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-4">
            Ivry-sur-Seine · Paris
          </p>
          <h2 className="text-white font-bold text-5xl md:text-7xl leading-tight tracking-tight mb-6">
            Train.<br />Fight.<br />Belong.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-md mb-8">
            Parisian boxing club. Real fighters, real training.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-xl text-sm font-semibold bg-white text-black text-center"
            >
              Book a Class
            </a>
            <a
              href={`${SITE_URL}/schedule`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white text-center border border-white/30"
            >
              View Schedule
            </a>
          </div>
          <p className="text-zinc-500 text-xs mt-6">1,600+ fighters trained · Ivry-sur-Seine, Paris</p>
        </div>

        {/* RIGHT — hero image */}
        <div className="order-1 md:order-2 relative aspect-[4/5] md:h-[600px] md:aspect-auto rounded-2xl overflow-hidden">
          <Image
            src="/overhandz/ui/hero-cropped.png"
            alt="Boxers sparring during training session at Overhandz Boxing Club in Paris"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

      </div>
    </div>
  )
}

// ─── 2. SCHEDULE PANEL (Instant Booking) ──────────────────────────────────────
// Matches SchedulePreview.tsx exactly:
// - Eyebrow + h2 + "Full schedule" link in a flex header
// - Day filter pills: short name on mobile (Mon), full on desktop (Monday)
// - Class rows separated by divide-y (not rounded cards)
// - SpotsBadge + Book button on the right
export function SchedulePanel() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday")
  const [selectedClass, setSelectedClass] = useState<DemoClass | null>(null)

  // Filter to only classes on the selected day
  const filtered = DEMO_CLASSES.filter((c) => c.day === selectedDay)

  return (
    // relative — needed so BookingModal's absolute inset-0 fills this panel
    <div className="relative bg-black py-10 px-6">

      {/* SECTION HEADER — flex row: text left, link right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">
            Schedule
          </p>
          <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
            Book a class
          </h2>
        </div>
        <a
          href={`${SITE_URL}/schedule`}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start md:self-auto text-xs font-medium text-zinc-400 pb-1 border-b border-white/20"
        >
          Full schedule
        </a>
      </div>

      {/* DAY FILTER — horizontal scroll on mobile, scrollbar-none hides the scrollbar */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
        {WEEK_DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`
              shrink-0 px-4 py-2 rounded-full text-sm font-medium
              ${selectedDay === day ? "bg-white text-black" : "bg-zinc-900 text-zinc-400"}
            `}
          >
            {/* Mobile: 3-char abbreviation. Desktop: full name */}
            <span className="md:hidden">{DAY_SHORT[day]}</span>
            <span className="hidden md:inline">{day}</span>
          </button>
        ))}
      </div>

      {/* CLASS ROWS — divide-y mirrors the real website (no card borders) */}
      <div className="divide-y divide-white/[0.06]">
        {filtered.length === 0 ? (
          <p className="text-zinc-500 text-sm py-8 text-center">
            No classes on {selectedDay}.
          </p>
        ) : (
          filtered.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3"
            >
              {/* LEFT — time + class info */}
              <div className="flex items-start sm:items-center gap-4">
                <span className="text-white font-medium text-sm w-12 shrink-0 font-mono">
                  {cls.time}
                </span>
                <div>
                  <p className="text-white font-medium text-sm">{cls.name}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {cls.coach} · {cls.durationMinutes}min
                  </p>
                </div>
              </div>

              {/* RIGHT — badge + book button */}
              <div className="flex items-center gap-3 sm:ml-auto">
                <SpotsBadge spotsLeft={cls.spotsLeft} />
                <button
                  onClick={() => setSelectedClass(cls)}
                  className="bg-white text-black text-xs font-medium px-3 py-1.5 rounded-md"
                >
                  Book
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Booking modal — slides up from inside the panel */}
      <AnimatePresence>
        {selectedClass && (
          <BookingModal cls={selectedClass} onClose={() => setSelectedClass(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── 3. CLASS SCHEDULE PANEL ──────────────────────────────────────────────────
// Matches the /schedule page layout from SchedulePageClient.tsx:
// - Page header (eyebrow + big h2 + subtext)
// - Two filter rows: day pills + class type pills (both with "All" option)
// - Results count
// - Class rows with description shown on desktop
// - BookingModal slides up from inside the panel
export function ClassSchedulePanel() {
  const [selectedDay,  setSelectedDay]  = useState<DayOfWeek | "All">("All")
  const [selectedType, setSelectedType] = useState<ClassType  | "All">("All")
  const [selectedClass, setSelectedClass] = useState<DemoClass | null>(null)

  // Apply both filters — "All" means no filter applied
  const filtered = DEMO_CLASSES.filter((cls) => {
    const dayMatch  = selectedDay  === "All" || cls.day  === selectedDay
    const typeMatch = selectedType === "All" || cls.type === selectedType
    return dayMatch && typeMatch
  })

  return (
    // relative — needed so BookingModal's absolute inset-0 fills this panel
    <div className="relative bg-black">

      {/* PAGE HEADER — darker surface, border-bottom */}
      <div className="py-10 px-6 bg-zinc-950 border-b border-white/[0.06]">
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">
          Class schedule
        </p>
        <h2 className="text-white font-bold text-4xl md:text-5xl tracking-tight">
          Find your class
        </h2>
        <p className="text-zinc-400 text-base mt-3 max-w-md">
          Filter by day or discipline and book in one tap.
        </p>
      </div>

      {/* FILTERS + CLASS LIST */}
      <div className="py-8 px-6">

        {/* FILTER ROWS */}
        <div className="flex flex-wrap gap-3 mb-8">

          {/* Day filter — scrollable row, scrollbar-none hides the scrollbar */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 w-full">
            <FilterPill label="All days"  active={selectedDay === "All"} onClick={() => setSelectedDay("All")} />
            {WEEK_DAYS.map((day) => (
              <FilterPill
                key={day}
                label={DAY_SHORT[day]}
                active={selectedDay === day}
                onClick={() => setSelectedDay(day)}
              />
            ))}
          </div>

          {/* Class type filter */}
          <div className="flex gap-2 flex-wrap">
            <FilterPill label="All types"  active={selectedType === "All"} onClick={() => setSelectedType("All")} />
            {CLASS_TYPES.map((type) => (
              <FilterPill
                key={type}
                label={type}
                active={selectedType === type}
                onClick={() => setSelectedType(type)}
              />
            ))}
          </div>
        </div>

        {/* RESULTS COUNT */}
        <p className="text-zinc-400 text-sm mb-6">
          {filtered.length} {filtered.length !== 1 ? "classes found" : "class found"}
        </p>

        {/* CLASS TABLE — divide-y like the original schedule page */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">No classes match your filters.</div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {filtered.map((cls, index) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.04 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-4"
              >
                {/* LEFT — time + name + description (desktop only) */}
                <div className="flex items-start sm:items-center gap-5">
                  <div className="w-14 shrink-0">
                    <p className="text-white font-medium text-sm font-mono">{cls.time}</p>
                    <p className="text-zinc-400 text-xs">{cls.durationMinutes}min</p>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{cls.name}</p>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      {cls.day} · {cls.coach} · {cls.type}
                    </p>
                    {/* Description hidden on mobile to keep rows compact */}
                    <p className="text-zinc-400 text-xs mt-1 max-w-sm hidden md:block">
                      {cls.description}
                    </p>
                  </div>
                </div>

                {/* RIGHT — badge + book */}
                <div className="flex items-center gap-3 sm:ml-auto">
                  <SpotsBadge spotsLeft={cls.spotsLeft} />
                  <button
                    onClick={() => setSelectedClass(cls)}
                    className="bg-white text-black text-xs font-medium px-4 py-2 rounded-md"
                  >
                    Book
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking modal */}
      <AnimatePresence>
        {selectedClass && (
          <BookingModal cls={selectedClass} onClose={() => setSelectedClass(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// FilterPill — shared between ClassSchedulePanel filter rows.
// Active: white bg + black text. Inactive: dark bg + dim text.
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
        ${active ? "bg-white text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"}
      `}
    >
      {label}
    </button>
  )
}

// ─── 4. MEMBERSHIPS PANEL ─────────────────────────────────────────────────────
// Matches PricingSection.tsx exactly:
// - 4 pricing cards in a 2-column grid (or 4-col on wide screens)
// - Each card: name + description + price + benefits checklist (✓ / –)
// - "Sign Up" button opens the shared CheckoutModal
// - Simple options row below (drop-in, monthly, private)
export function MembershipsPanel() {
  const [modalPlan, setModalPlan] = useState<PricingPlan | null>(null)

  return (
    // relative — needed so CheckoutModal's absolute inset-0 fills this panel
    <div className="relative bg-black py-10 px-6">

      {/* SECTION HEADER — centred, matches original PricingSection */}
      <div className="text-center mb-10">
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">
          Memberships
        </p>
        <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
          Choose your plan
        </h2>
        <p className="text-zinc-400 text-base mt-4 max-w-md mx-auto">
          Join Overhandz Boxing Club today.
        </p>
      </div>

      {/* PRICING CARDS — 1 col mobile, 2 col sm, 4 col xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className="bg-zinc-950 rounded-xl p-6 flex flex-col border border-white/[0.06]"
          >
            {/* Card header */}
            <div className="mb-6">
              {plan.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium mb-2 inline-block text-white bg-zinc-700">
                  {plan.badge}
                </span>
              )}
              <p className="text-white font-semibold text-lg">{plan.name}</p>
              <p className="text-zinc-400 text-sm mt-1">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-white font-bold text-4xl">€{plan.price}</span>
              <span className="text-zinc-400 text-sm ml-2">per year</span>
            </div>

            {/* Benefits checklist — checkmark for included, dash for not */}
            <ul className="space-y-3 mb-6 flex-1">
              {plan.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className={`mt-0.5 shrink-0 ${benefit.included ? "text-white" : "text-zinc-700"}`}>
                    {benefit.included ? (
                      // Checkmark icon — included benefit
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      // Dash icon — not included
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </span>
                  <span className={benefit.included ? "text-zinc-400" : "text-zinc-700"}>
                    {benefit.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Student discount note */}
            {plan.note && (
              <p className="text-zinc-500 text-xs mb-4">{plan.note}</p>
            )}

            {/* CTA — opens checkout modal */}
            <button
              onClick={() => setModalPlan(plan)}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white text-black"
            >
              Sign Up
            </button>
          </div>
        ))}
      </div>

      {/* SIMPLE OPTIONS ROW — drop-in, monthly, private */}
      <div className="border border-white/[0.06] rounded-xl divide-y divide-white/[0.06]">
        {SIMPLE_OPTIONS.map((opt) => (
          <div key={opt.label} className="flex items-center justify-between px-6 py-4">
            <p className="text-white font-medium text-sm">{opt.label}</p>
            <div className="text-right">
              {opt.price !== null ? (
                <>
                  <span className="text-white font-semibold">€{opt.price}</span>
                  <span className="text-zinc-400 text-xs ml-1">{opt.unit}</span>
                </>
              ) : (
                <span className="text-zinc-400 text-sm">{opt.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Checkout modal */}
      <AnimatePresence>
        {modalPlan && (
          <CheckoutModal plan={modalPlan} onClose={() => setModalPlan(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── 5. ONLINE PAYMENTS PANEL ─────────────────────────────────────────────────
// Shows the "Boxe Anglaise Full" plan card (first plan, €450/yr) with its full
// benefits list. "Sign up — pay securely" opens the shared 3-step checkout modal.
export function OnlinePaymentsPanel() {
  // Use the first plan — Boxe Anglaise Full — as the featured card
  const featured = PRICING_PLANS[0]
  const [modalOpen, setModalOpen] = useState(false)

  return (
    // relative — so CheckoutModal stays contained in the preview frame
    <div className="relative bg-black py-10 px-6">
      <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">
        Online Payments
      </p>
      <h2 className="text-white font-semibold text-3xl tracking-tight mb-6">
        Purchase in one flow
      </h2>

      {/* Featured plan card — constrained width on desktop so it doesn't stretch */}
      <div className="rounded-xl p-5 mb-4 bg-zinc-950 border border-white/20 md:max-w-sm">
        <p className="text-white font-semibold text-lg mb-1">{featured.name}</p>
        <p className="text-zinc-400 text-sm mb-4">{featured.description}</p>

        {/* Price */}
        <div className="mb-5">
          <span className="text-white font-bold text-4xl">€{featured.price}</span>
          <span className="text-zinc-400 text-sm ml-2">per year</span>
        </div>

        {/* Benefits list */}
        <ul className="space-y-2 mb-6">
          {featured.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className={`mt-0.5 shrink-0 ${benefit.included ? "text-white" : "text-zinc-700"}`}>
                {benefit.included ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </span>
              <span className={benefit.included ? "text-zinc-400" : "text-zinc-700"}>
                {benefit.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA — opens 3-step checkout */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-3 rounded-lg text-sm font-semibold bg-white text-black"
        >
          Pay securely
        </button>
      </div>

      <p className="text-zinc-500 text-xs text-center">Powered by Stripe · SSL encrypted</p>

      {/* 3-step checkout modal */}
      <AnimatePresence>
        {modalOpen && (
          <CheckoutModal plan={featured} onClose={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── 6. LIVE INSTAGRAM PANEL ──────────────────────────────────────────────────
// 3×2 post grid with hover overlay (desktop) or tap-to-reveal (mobile).
// Spacing matches InstagramFeed.tsx: px-6 py-10, mb-10 header, gap-2 grid.
export function LiveInstagramPanel() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeId,  setActiveId]  = useState<string | null>(null)

  const handlePostClick = (post: typeof INSTAGRAM_POSTS[0]) => {
    const isTouchDevice =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
    if (isTouchDevice) {
      if (activeId === post.id) {
        window.open(IG_URL, "_blank", "noopener,noreferrer")
        setActiveId(null)
      } else {
        setActiveId(post.id)
      }
    } else {
      window.open(IG_URL, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="px-6 py-10 bg-black">
      {/* Header — mb-10 matches InstagramFeed.tsx */}
      <div className="mb-10">
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">
          @overhandzclub
        </p>
        <h2 className="text-white font-semibold text-3xl tracking-tight">
          Follow our journey
        </h2>
      </div>

      {/* Grid: 2 cols mobile, 3 cols desktop — 6 posts = 2 rows × 3 cols on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {INSTAGRAM_POSTS.map((post, index) => {
          const overlayVisible = hoveredId === post.id || activeId === post.id
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.06 }}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handlePostClick(post)}
            >
              {/* Post image — scales on hover */}
              <motion.div
                className="absolute inset-0"
                animate={{ scale: overlayVisible ? 1.1 : 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Image
                  src={post.src}
                  alt={`Instagram post from Overhandz Boxing Club: ${post.caption}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </motion.div>

              {/* Overlay — shows likes + caption on hover/tap */}
              <motion.div
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-3"
                animate={{ opacity: overlayVisible ? 1 : 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-center gap-1.5 text-white text-sm font-semibold mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {post.likes}
                </div>
                <p className="text-white/80 text-xs text-center line-clamp-2 leading-snug">
                  {post.caption}
                </p>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA — mt-8 matches InstagramFeed.tsx */}
      <motion.a
        href={IG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-zinc-500 text-sm mt-8"
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
    <div className="px-6 py-10 bg-black">
      <div className="mb-10">
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">Events</p>
        <h2 className="text-white font-semibold text-3xl tracking-tight">
          What&apos;s happening
        </h2>
      </div>

      {/* 1 col mobile, 2 col desktop — matches original EventsSection.tsx */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EVENTS.map((ev, index) => (
          <motion.a
            key={ev.id}
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
            whileHover="hovered"
            className="block rounded-xl overflow-hidden bg-zinc-950 border border-white/[0.06]"
          >
            {/* Event image — 16/9 matches original */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <motion.div
                className="absolute inset-0"
                variants={{ hovered: { scale: 1.05 } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Image
                  src={ev.img}
                  alt={`${ev.title} — Overhandz Boxing Club event`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute top-3 left-3">
                <span className="text-xs px-2 py-0.5 rounded font-medium text-white bg-black/60">
                  {ev.type}
                </span>
              </div>
            </div>

            {/* Event details */}
            <div className="p-5">
              <p className="text-zinc-400 text-xs mb-1">{ev.date}</p>
              <p className="text-white font-semibold text-lg mb-3 leading-snug">{ev.title}</p>
              <div className="self-start">
                <span className="inline-block px-3 py-1.5 rounded-md text-xs font-semibold text-white border border-white/20">Join event</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}

// ─── 8. OFFERS & MERCH PANEL ──────────────────────────────────────────────────
// Promo/merch cards sourced from Instagram — link to the Overhandz shop.
// CTA button: no arrow, wrapped in self-start div so it does not stretch full-width.
export function OffersMerchPanel() {
  return (
    <div className="px-6 py-10 bg-black">
      <div className="mb-10">
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-2">Shop</p>
        <h2 className="text-white font-semibold text-3xl tracking-tight">
          Gear &amp; promotions
        </h2>
      </div>

      {/* 1 col mobile, 3 col desktop — highlight item spans 2 cols, matches PromotionsSection.tsx */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROMOS.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
            whileHover="hovered"
            onClick={() => window.open(SHOP_URL, "_blank", "noopener,noreferrer")}
            className={`bg-zinc-950 rounded-xl overflow-hidden flex flex-col cursor-pointer ${
              promo.highlight ? "border border-white/30 md:col-span-2" : "border border-white/[0.06]"
            }`}
          >
            {/* Product image */}
            <div className={`relative overflow-hidden ${promo.highlight ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
              <motion.div
                className="absolute inset-0"
                variants={{ hovered: { scale: 1.05 } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Image
                  src={promo.img}
                  alt={`${promo.title} — Overhandz Boxing Club`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 33vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute top-3 left-3">
                <span className="text-xs px-2 py-0.5 rounded font-medium text-white bg-black/60">
                  {promo.badge}
                </span>
              </div>
            </div>

            {/* Details + CTA */}
            <div className="p-5 flex flex-col flex-1">
              <p className="text-white font-semibold text-xl mb-2">{promo.title}</p>
              <div className="mt-auto self-start" onClick={(e) => e.stopPropagation()}>
                <a
                  href={SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                    promo.highlight ? "bg-white text-black" : "text-white border border-white/25"
                  }`}
                >
                  {promo.cta}
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── 9. TRUST & BRANDING PANEL ────────────────────────────────────────────────
// Stats strip + coach portraits + about image — shows the brand identity.
// Desktop: 4-col stats row + 3-col coach cards (matches original about page).
export function TrustBrandingPanel() {
  return (
    <div className="bg-black pb-6">
      {/* Stats strip — 2 cols mobile, 4 cols desktop with dividers between */}
      <div className="px-6 md:px-12 pt-10 pb-6 border-b border-white/[0.06]">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {[
            { value: "1,600+", label: "Fighters trained" },
            { value: "Weekly", label: "Sparring sessions" },
            { value: "All levels", label: "Beginner friendly" },
            { value: "Active", label: "Fight team" },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-6 px-4">
              <p className="text-white font-bold text-2xl md:text-3xl tracking-tight">{stat.value}</p>
              <p className="text-zinc-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coach cards — 1 col mobile, 3 col desktop. Matches AboutPageClient.tsx layout. */}
      <div className="px-6 md:px-12 pt-10 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              src: "/overhandz/coaches/rudy.png",
              name: "Coach Rudy",
              role: "Boxing Coach",
              bio: "Specialist in English boxing, Rudy leads Tuesday and Thursday classes. Rigorous technique, accessible teaching — whether you are a beginner or preparing for a fight.",
            },
            {
              src: "/overhandz/coaches/fabrice.png",
              name: "Coach Fabrice",
              role: "Muay Thai Coach",
              bio: "Passionate about Muay Thai, Fabrice leads Monday classes. His approach combines striking technique, pad work, and physical conditioning for all levels.",
            },
            {
              src: "/overhandz/coaches/morad.png",
              name: "Coach Morad",
              role: "Muay Thai & Women's Muay Thai Coach",
              bio: "Morad leads Muay Thai and women's classes on Wednesdays and Fridays. A demanding and supportive environment, with particular attention to technique and individual progress.",
            },
          ].map((coach, index) => (
            <motion.div
              key={coach.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
            >
              {/* aspect-[4/5] matches the original about page coach images */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-5">
                <Image
                  src={coach.src}
                  alt={`${coach.name} — ${coach.role} at Overhandz Boxing Club`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <p className="text-white font-semibold text-lg">{coach.name}</p>
              <p className="text-zinc-400 text-sm mb-3">{coach.role}</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{coach.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* About image with caption overlay */}
      <div className="mx-6 rounded-xl overflow-hidden">
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
      <div className="px-6 pt-4">
        <a
          href={`${SITE_URL}/about`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 text-center rounded-xl text-sm font-semibold text-white border border-white/20"
        >
          About the club
        </a>
      </div>
    </div>
  )
}
