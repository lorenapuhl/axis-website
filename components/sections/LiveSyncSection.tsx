"use client"
// "use client" tells Next.js this component runs in the BROWSER.
// Required because useState, useEffect, useRef, and Framer Motion all need
// a live DOM — they cannot run during server-side rendering.

import { motion, useInView, AnimatePresence } from "framer-motion"
// motion        → Framer Motion's animated wrapper for any HTML element
// useInView     → returns true once an element enters the viewport
// AnimatePresence → lets elements animate OUT before leaving the DOM,
//                   and enables layoutId-based "shared element" transitions
//                   (an element flies from one position to another)

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
// next/image → Next.js optimised image component — always use this, never <img>

// ─── TYPES ────────────────────────────────────────────────────────────────────
// TypeScript interfaces let us describe the shape of our data objects.
// "interface" is like a Python dataclass — it defines what fields an object has.

interface BasePost {
  id: string
  text: string       // used for alt text on images
  timestamp: string  // e.g. "2 min ago"
  src: string        // image URL
  aspect: string     // kept for type compatibility — not used in rendering
  target: "schedule" | "promo" | "news" | "events" | "filler"
}

interface LoopPost {
  id: string
  text: string
  src: string
  targetSection: "schedule" | "promo" | "events"  // which row it flies into
}

// Community feedback items shown in the live feed panel
interface FeedbackItem {
  id: string
  handle: string   // Instagram-style @handle
  quote: string    // the comment text
  likes: number    // like count
  time: string     // e.g. "3 mins ago"
  avatar: string   // Tailwind background class for the avatar circle
}

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

// The 10 base Instagram strip posts.
// Cell 0 of the rendered strip is reserved for the loop slot (see below).
// These 10 fill cells 1–10.
// Posts whose target is NOT "filler" will fly to the website panel.
const BASE_POSTS: BasePost[] = [
  {
    id: "ls1",
    text: "Class canceled today",
    timestamp: "2 min ago",
    src: "/livesync_visual/img1.png",
    aspect: "aspect-square",
    target: "schedule",
  },
  {
    id: "ls2",
    text: "New: HIIT 07:00",
    timestamp: "5 min ago",
    src: "/livesync_visual/img2.png",
    aspect: "aspect-[4/5]",
    target: "schedule",
  },
  {
    id: "ls3",
    text: "Spring Sale -20%",
    timestamp: "1 hr ago",
    src: "/livesync_visual/img3.png",
    aspect: "aspect-square",
    target: "promo",
  },
  {
    id: "ls4",
    text: "Welcome Coach Alex",
    timestamp: "2 hr ago",
    src: "/livesync_visual/img4.png",
    aspect: "aspect-[4/5]",
    target: "news",
  },
  {
    id: "ls5",
    text: "Weekend vibes",
    timestamp: "3 hr ago",
    src: "/livesync_visual/img5.png",
    aspect: "aspect-square",
    target: "filler",
  },
  {
    id: "ls6",
    text: "Workshop Saturday",
    timestamp: "5 hr ago",
    src: "/livesync_visual/img6.png",
    aspect: "aspect-square",
    target: "events",
  },
  {
    id: "ls7",
    text: "",
    timestamp: "1 day ago",
    src: "/livesync_visual/img7.png",
    aspect: "aspect-square",
    target: "filler",
  },
  {
    id: "ls8",
    text: "",
    timestamp: "2 days ago",
    src: "/livesync_visual/img8.png",
    aspect: "aspect-square",
    target: "filler",
  },
  {
    id: "ls9",
    text: "",
    timestamp: "3 days ago",
    src: "/livesync_visual/img13.png",
    aspect: "aspect-square",
    target: "filler",
  },
  {
    id: "ls10",
    text: "",
    timestamp: "4 days ago",
    src: "/livesync_visual/img14.png",
    aspect: "aspect-square",
    target: "filler",
  },
]

// Only these IDs leave the strip during the main animation.
// ls5, ls7–ls10 are fillers and stay in place.
const ANIMATED_IDS = new Set(["ls1", "ls2", "ls3", "ls4", "ls6"])

// Posts that auto-appear in the Instagram strip after the initial animation.
// Each one slides in from the left, then flies to the corresponding row.
const LOOP_POSTS: LoopPost[] = [
  {
    id: "loop0",
    text: "New class added: Boxing 19:00",
    src: "/livesync_visual/img10.png",
    targetSection: "schedule",
  },
  {
    id: "loop1",
    text: "Sunday Bootcamp",
    src: "/livesync_visual/img11.png",
    targetSection: "events",
  },
  {
    id: "loop2",
    text: "Flash sale: 30% off today",
    src: "/livesync_visual/img12.png",
    targetSection: "promo",
  },
]

// Seed feedback items — shown on first paint before the live simulation starts.
// avatar uses opacity-variant classes: bg-[color]/20 = very faint tinted circle.
const FEEDBACK: FeedbackItem[] = [
  { id: "f1", handle: "@SarahMoves", quote: "That 9 AM class changed my day's energy! (Jiu-Jitsu)", likes: 12, time: "3 mins ago", avatar: "bg-blue-axis/20" },
  { id: "f2", handle: "@CoachMike", quote: "Best Saturday bootcamp yet. See you next week!", likes: 24, time: "15 mins ago", avatar: "bg-magenta-axis/20" },
  { id: "f3", handle: "@FitnessFan99", quote: "The spring promo got me — signed up for 3 months!", likes: 8, time: "1 hr ago", avatar: "bg-uv-axis/20" },
  { id: "f4", handle: "@YogaQueen", quote: "Open mat was incredible — instructor was top tier.", likes: 31, time: "2 hrs ago", avatar: "bg-soft-grey/20" },
]

// Fixed pool of incoming comments that prepend over time.
// Using a static pool (not runtime-generated) per the performance rules.
const INCOMING_COMMENTS: FeedbackItem[] = [
  { id: "inc1", handle: "@RunnerJay", quote: "Just booked my spot for open mat — cannot wait!", likes: 5, time: "just now", avatar: "bg-blue-axis/20" },
  { id: "inc2", handle: "@BoxingBella", quote: "The HIIT at 7AM is a different level. Highly recommend.", likes: 9, time: "just now", avatar: "bg-magenta-axis/20" },
  { id: "inc3", handle: "@StudioReg", quote: "Shoutout to the evening class — always packed with energy.", likes: 17, time: "just now", avatar: "bg-uv-axis/20" },
]

// ─────────────────────────────────────────────────────────────────────────────
// HOW THE ANIMATION WORKS (overview for future readers)
//
// MAIN ANIMATION (triggered once when section enters viewport):
//
//   Step 0  Initial state: Instagram strip fully visible, website panel
//           faded to 20% opacity. Row slots are empty.
//
//   Step 1  (0.5s) Highlight: posts ls1–ls4 and ls6 scale up and brighten,
//           drawing the viewer's eye to the posts that are about to move.
//
//   Step 2  (1.4s) Flight: the highlighted posts UNMOUNT from the strip.
//           AnimatePresence records each post's screen position at unmount.
//           Matching layoutId elements MOUNT in the website rows.
//           Framer Motion automatically animates each element from the strip
//           position to its destination — the "shared element transition."
//           Website panel simultaneously fades to full opacity.
//
//   Step 3  (2.7s) uiVisible = true → live simulation effects start.
//
// CONTINUOUS LOOP (starts 1.2s after Step 3):
//
//   Every ~8s, a new Instagram post slides into strip cell 0. After 1.5s
//   it "flies" to the website row. The row gains a new permanent thumbnail.
//   Repeats for LOOP_POSTS.length iterations, then stops.
//
// WHY layoutId WORKS:
//   When an element with layoutId="ls2" unmounts (wrapped in AnimatePresence),
//   Framer Motion records its last measured screen position.
//   When a DIFFERENT element with layoutId="ls2" mounts anywhere in the tree,
//   Framer Motion projects it back to the recorded position using CSS transforms,
//   then animates those transforms to zero — creating the illusion of the
//   element flying from one place to another.
//
// OVERFLOW CLIPPING RULE (critical):
//   overflow-hidden must be on the layoutId motion.div ITSELF — never on a
//   parent container. If the parent has overflow-hidden, the element gets
//   clipped during the flight while it is still outside the parent's bounds.
//   Putting it on the element clips only its own image content at all positions.
// ─────────────────────────────────────────────────────────────────────────────

export default function LiveSyncSection() {

  // Attach to the <section> so useInView can watch when it enters the viewport.
  const sectionRef = useRef<HTMLElement>(null)

  // isInView becomes true once 30% of the section is visible.
  // { once: true } means it fires only on the first intersection — never resets.
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  // ── MAIN ANIMATION STEP ───────────────────────────────────────────────────
  // A number (0–3) that drives which phase of the animation is active.
  const [step, setStep] = useState(0)

  // ── LOOP STATE ────────────────────────────────────────────────────────────
  // Which LOOP_POSTS entry is currently active. -1 = no loop post is active.
  const [loopIndex, setLoopIndex] = useState(-1)

  // loopPhase describes where the active loop post currently is:
  //   "none"   → not visible anywhere
  //   "ingrid" → visible in strip cell 0 (just slid in from the left)
  //   "flying" → source has unmounted, layoutId transition is in progress
  const [loopPhase, setLoopPhase] = useState<"none" | "ingrid" | "flying">("none")

  // Loop posts that have fully settled into their row.
  // Each settled post renders as a permanent square thumbnail.
  // This array grows over time as each loop iteration completes.
  const [settledLoopPosts, setSettledLoopPosts] = useState<LoopPost[]>([])

  // ── DASHBOARD LIVE STATE ──────────────────────────────────────────────────
  // Studio Capacity: starts at 75%, increments every 10s, caps at 82
  const [capacity, setCapacity] = useState(75)

  // Countdown: starts at 14 minutes to next class, decrements every 30s
  const [minutesLeft, setMinutesLeft] = useState(14)

  // Spots taken: starts at 28/30, increments every 20s, caps at 30
  const [spotsTaken, setSpotsTaken] = useState(28)

  // Community feedback: seed items on load, new ones prepend every 12s
  const [feedItems, setFeedItems] = useState<FeedbackItem[]>(FEEDBACK)

  // Wave graph drift offset — updated by rAF for smooth visual scroll
  const [waveOffset, setWaveOffset] = useState(0)
  // useRef holds the rAF ID between renders so we can cancel it on cleanup
  const waveRafRef = useRef<number>(0)

  // ── MAIN ANIMATION SEQUENCE ───────────────────────────────────────────────
  // useEffect runs AFTER React renders. [isInView] means: re-run when it changes.
  // We set up a chain of timers that advance `step` over time.
  useEffect(() => {
    if (!isInView) return
    const t1 = setTimeout(() => setStep(1), 500)   // highlight posts
    const t2 = setTimeout(() => setStep(2), 1400)  // start flight
    const t3 = setTimeout(() => setStep(3), 2700)  // panel fully visible
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [isInView])

  // ── CONTINUOUS LOOP ───────────────────────────────────────────────────────
  // Starts once the main animation is done (step >= 3).
  useEffect(() => {
    if (step < 3) return

    const timers: ReturnType<typeof setTimeout>[] = []
    let iteration = 0

    function runIteration() {
      if (iteration >= LOOP_POSTS.length) return

      setLoopIndex(iteration)
      setLoopPhase("ingrid")

      const flyTimer = setTimeout(() => {
        setLoopPhase("flying")

        const settleTimer = setTimeout(() => {
          const post = LOOP_POSTS[iteration]
          setSettledLoopPosts(prev => [...prev, post])
          iteration++
          const nextTimer = setTimeout(runIteration, 5000)
          timers.push(nextTimer)
        }, 1200)
        timers.push(settleTimer)
      }, 1500)
      timers.push(flyTimer)
    }

    const startTimer = setTimeout(runIteration, 1200)
    timers.push(startTimer)

    return () => { timers.forEach(clearTimeout) }
  }, [step])

  // ── DERIVED STATE ─────────────────────────────────────────────────────────
  const uiVisible = step >= 3
  const websiteOpacity = step >= 2 ? 1 : 0.2

  // Returns the Framer Motion `animate` target for an animated strip post.
  // At step 1 they scale up and brighten; at step 2 they unmount entirely.
  function getGridAnimate(id: string): Record<string, unknown> {
    if (!ANIMATED_IDS.has(id) || step >= 2) return {}
    if (step === 1) return { scale: 1.05, filter: "brightness(1.3)" }
    return {}
  }

  const activeLoop = loopIndex >= 0 ? LOOP_POSTS[loopIndex] : null
  const loopInGrid = loopPhase === "ingrid" && activeLoop !== null
  const loopFlying = loopPhase === "flying" && activeLoop !== null

  // ── DASHBOARD DERIVED VALUES ──────────────────────────────────────────────
  // Full circumference for r=26: 2π×26 ≈ 163.4
  // strokeDashoffset controls how much of the ring is "drawn".
  // 163.4 = empty ring, 0 = full ring.
  const capacityOffset = 163.4 * (1 - capacity / 100)
  const countdownOffset = 163.4 * (minutesLeft / 60)
  const spotsLeft = 30 - spotsTaken
  const urgencyLabel = spotsLeft <= 0
    ? "CLASS FULL"
    : spotsLeft === 1
    ? "ONLY 1 SPOT LEFT"
    : `ONLY ${spotsLeft} SPOTS LEFT`

  // ── LIVE SIMULATION EFFECTS ───────────────────────────────────────────────
  // Every effect guards with `if (!uiVisible) return` so nothing runs before
  // the website panel is visible. [uiVisible] in deps fires the effect exactly
  // once when uiVisible flips from false to true.

  // Effect A — Studio capacity creep (every 10s, caps at 82)
  useEffect(() => {
    if (!uiVisible) return
    const id = setInterval(() => {
      setCapacity(prev => prev < 82 ? prev + 1 : prev)
    }, 10000)
    return () => clearInterval(id)
  }, [uiVisible])

  // Effect B — Countdown timer (every 30s, floors at 0)
  useEffect(() => {
    if (!uiVisible) return
    const id = setInterval(() => {
      setMinutesLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 30000)
    return () => clearInterval(id)
  }, [uiVisible])

  // Effect C — Spots taken (every 20s, caps at 30)
  useEffect(() => {
    if (!uiVisible) return
    const id = setInterval(() => {
      setSpotsTaken(prev => prev < 30 ? prev + 1 : prev)
    }, 20000)
    return () => clearInterval(id)
  }, [uiVisible])

  // Effect D — Incoming comments (every 12s, cycles through INCOMING_COMMENTS pool)
  // Capped at 8 items so the array never grows unbounded.
  useEffect(() => {
    if (!uiVisible) return
    let index = 0
    const id = setInterval(() => {
      const next = { ...INCOMING_COMMENTS[index % INCOMING_COMMENTS.length], id: `inc-live-${index}` }
      setFeedItems(prev => [next, ...prev].slice(0, 8))
      index++
    }, 12000)
    return () => clearInterval(id)
  }, [uiVisible])

  // Effect E — Wave graph rAF drift (0.004px per frame ≈ imperceptibly slow scroll)
  // rAF is used only here — all other intervals use setInterval per performance rules.
  useEffect(() => {
    if (!uiVisible) return
    let offset = 0
    function tick() {
      offset += 0.004
      setWaveOffset(offset)
      waveRafRef.current = requestAnimationFrame(tick)
    }
    waveRafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(waveRafRef.current)
  }, [uiVisible])

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      // Mobile-first padding: py-20 px-6 at all sizes, overridden at md (768px+).
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ───────────────────────────────────────────── */}
        {/* whileInView fires once on scroll entry. viewport={{ once: true }}
            prevents it from re-animating if the user scrolls back up. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mx-auto mb-20 md:mb-28 max-w-[600px]"
        >
          {/* h2 because this section has its own headline — h1 is in HeroSection only */}
          <h2 className="font-instrument tracking-tight text-white-axis text-3xl leading-tight">
            Your studio changes daily.<br />
            Your website updates automatically.
          </h2>
          <p className="font-instrument text-soft-grey text-base mt-4 leading-relaxed">
            Schedule changes, announcements, promotions — always in sync.
          </p>
        </motion.div>

        {/* ── VERTICAL STACK LAYOUT ────────────────────────────────────── */}
        {/* Instagram feed on top, website panel below. */}
        <div className="flex flex-col gap-12">

          {/* ══════════════════════════════════════════════════════════════
              TOP — INSTAGRAM FEED (horizontal strip, scrollbar removed)
          ══════════════════════════════════════════════════════════════ */}
          <div>
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-4">
              Live Instagram
            </p>

            {/* Instagram container — dark surface with subtle border */}
            <div className="bg-grey-axis border border-white-axis/10 rounded-2xl p-4">

              {/* Profile header: avatar + studio name + handle */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="/livesync_visual/img9.png"
                    alt="Sports Studio Instagram profile avatar"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-instrument text-white-axis text-xs font-semibold leading-tight">
                    Sports Studio
                  </p>
                  <p className="font-instrument text-soft-grey text-xs">
                    @sports.studio
                  </p>
                </div>
              </div>

              {/* ── HORIZONTAL STRIP ─────────────────────────────────────
                  overflow-x-hidden removes the scrollbar entirely.
                  Posts beyond the container width are clipped — intentional. */}
              <div className="flex gap-[6px] overflow-x-hidden">

                {/* ── CELL 0: LOOP SLOT ───────────────────────────────────
                    The outer div always occupies this strip position.
                    AnimatePresence manages the loop post inside it.
                    When loopPhase transitions "ingrid" → "flying", the
                    motion.div unmounts and flies to the website row. */}
                <div className="w-24 h-24 relative shrink-0">
                  <AnimatePresence>
                    {loopInGrid && activeLoop && (
                      <motion.div
                        key={activeLoop.id}
                        layoutId={activeLoop.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        // overflow-hidden on THIS element (OVERFLOW CLIPPING RULE)
                        className="absolute inset-0 rounded-sm overflow-hidden"
                      >
                        <Image
                          src={activeLoop.src}
                          alt={`New Instagram post: ${activeLoop.text}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Empty placeholder shown when the loop slot is unoccupied */}
                  {!loopInGrid && (
                    <div className="absolute inset-0 rounded-sm bg-white-axis/5" />
                  )}
                </div>

                {/* ── CELLS 1–10: BASE POSTS ───────────────────────────── */}
                {BASE_POSTS.map((post) => {
                  const isFiller = !ANIMATED_IDS.has(post.id)

                  // ── FILLER POSTS ────────────────────────────────────────
                  // These never leave the strip. Safe to use overflow-hidden
                  // on the wrapper because they never use layoutId.
                  if (isFiller) {
                    return (
                      <motion.div
                        key={post.id}
                        className="w-24 h-24 shrink-0 overflow-hidden rounded-sm relative"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <Image
                          src={post.src}
                          alt="Fitness studio Instagram content"
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    )
                  }

                  // ── ANIMATED POSTS (ls1–ls4, ls6) ──────────────────────
                  // outer div → always in the strip, holds the cell's space
                  // inner motion.div (layoutId) → unmounts at step 2, triggering flight
                  // placeholder div → appears after the post has flown away
                  return (
                    <div key={post.id} className="w-24 h-24 relative shrink-0">
                      <AnimatePresence>
                        {step < 2 && (
                          <motion.div
                            key="active"
                            layoutId={post.id}
                            animate={getGridAnimate(post.id)}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            whileHover={{ scale: 1.03 }}
                            // overflow-hidden on THIS element, not on the parent.
                            // (see OVERFLOW CLIPPING RULE at the top of this file)
                            className="absolute inset-0 overflow-hidden rounded-sm"
                          >
                            <Image
                              src={post.src}
                              alt={post.text || "Fitness studio Instagram post"}
                              fill
                              className="object-cover"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Ghost placeholder once the post has flown away */}
                      {step >= 2 && (
                        <div className="absolute inset-0 rounded-sm bg-white-axis/5" />
                      )}
                    </div>
                  )
                })}

              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              BOTTOM — AUTO-UPDATING WEBSITE (rich dashboard panel)
              Animates from opacity 0.2 → 1 as posts arrive.
          ══════════════════════════════════════════════════════════════ */}
          <div>
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-4">
              Auto-updating website
            </p>

            {/* Website panel wrapper.
                `animate` prop responds to state changes and re-animates smoothly.
                `relative` added so the live indicator can be positioned absolutely. */}
            <motion.div
              initial={{ opacity: 0.2, y: 10 }}
              animate={{ opacity: websiteOpacity, y: step >= 2 ? 0 : 10 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-white-axis rounded-2xl p-6 relative"
            >

              {/* ── LIVE INDICATOR (absolute top-right) ──────────────────
                  Pulsing blue dot replaces the previous green one —
                  blue-axis is the brand accent for system status. */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <motion.div
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full bg-blue-axis"
                />
                <p className="font-instrument text-black-axis text-xs font-semibold">Live</p>
              </div>

              {/* ── MAIN 2-COLUMN GRID ───────────────────────────────────
                  Left (30%): update feed rows A–D.
                  Right (1fr): NEXT UP spotlight card.
                  grid-cols-[30%_1fr] is a Tailwind arbitrary value — no inline style needed. */}
              <div className="grid gap-6 grid-cols-[30%_1fr]">

                {/* ── LEFT COLUMN: UPDATE FEED (rows A–D) ──────────────── */}
                <div className="flex flex-col gap-6">

                  {/* ── ROW A: SCHEDULE UPDATES ──────────────────────────
                      Receives: ls1 (main anim) + ls2 (main anim) + loop0 */}
                  <div>
                    {/* Row header — title on left, timestamp on right */}
                    <div className="flex items-baseline justify-between mb-1">
                      <p className="font-instrument text-[11px] font-bold text-black-axis uppercase tracking-wider">
                        SCHEDULE UPDATES
                      </p>
                      <p className="font-instrument text-[9px] text-soft-grey">Updated Today, 8:00 AM</p>
                    </div>

                    {/* Thumbnail strip — horizontal flex row.
                        Each thumbnail is wrapped in a hover motion.div for scale+z-index lift.
                        The inner div is the fixed-size slot; the motion.div with layoutId flies in.
                        No overflow-hidden on either wrapper (OVERFLOW CLIPPING RULE). */}
                    <div className="flex gap-2 mt-2 flex-wrap">

                      {/* ls1 thumbnail */}
                      <motion.div
                        className="relative z-[1]"
                        whileHover={{ scale: 1.25, zIndex: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-16 h-16 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div
                                layoutId="ls1"
                                className="absolute inset-0 rounded-lg overflow-hidden"
                                transition={{ duration: 1.0, ease: "easeInOut" }}
                              >
                                <Image
                                  src="/livesync_visual/img1.png"
                                  alt="Instagram post about class update — schedule row thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* ls2 thumbnail — slight delay so it arrives staggered after ls1 */}
                      <motion.div
                        className="relative z-[1]"
                        whileHover={{ scale: 1.25, zIndex: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-16 h-16 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div
                                layoutId="ls2"
                                className="absolute inset-0 rounded-lg overflow-hidden"
                                transition={{ duration: 1.0, ease: "easeInOut", delay: 0.1 }}
                              >
                                <Image
                                  src="/livesync_visual/img2.png"
                                  alt="New HIIT class Instagram post — schedule row thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Permanent settled cards for loop posts that landed here */}
                      {settledLoopPosts
                        .filter(p => p.targetSection === "schedule")
                        .map(p => (
                          <motion.div
                            key={p.id}
                            className="relative z-[1]"
                            whileHover={{ scale: 1.25, zIndex: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="w-16 h-16 relative shrink-0">
                              <motion.div
                                className="absolute inset-0 rounded-lg overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              >
                                <Image
                                  src={p.src}
                                  alt={`New schedule post: ${p.text}`}
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            </div>
                          </motion.div>
                        ))
                      }

                      {/* Flying destination for loop → schedule.
                          Mounts mid-flight, fades to near-invisible as settled card appears. */}
                      {loopFlying && activeLoop?.targetSection === "schedule" && (
                        <motion.div
                          className="relative z-[1]"
                          whileHover={{ scale: 1.25, zIndex: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-16 h-16 relative shrink-0">
                            <motion.div
                              layoutId={activeLoop.id}
                              className="absolute inset-0 rounded-lg overflow-hidden"
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 0.12 }}
                              transition={{ duration: 0.7, ease: "easeInOut" }}
                            >
                              <Image
                                src={activeLoop.src}
                                alt={`New Instagram post landing in schedule: ${activeLoop.text}`}
                                fill
                                className="object-cover"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </div>

                  {/* ── ROW B: NEWS ──────────────────────────────────────
                      Receives: ls4 (main anim) */}
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <p className="font-instrument text-[11px] font-bold text-black-axis uppercase tracking-wider">
                        NEWS
                      </p>
                      <p className="font-instrument text-[9px] text-soft-grey">Updated: 2 mins ago</p>
                    </div>

                    <div className="flex gap-2 mt-2 flex-wrap">

                      {/* ls4 thumbnail */}
                      <motion.div
                        className="relative z-[1]"
                        whileHover={{ scale: 1.25, zIndex: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-16 h-16 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div
                                layoutId="ls4"
                                className="absolute inset-0 rounded-lg overflow-hidden"
                                transition={{ duration: 1.0, ease: "easeInOut", delay: 0.2 }}
                              >
                                <Image
                                  src="/livesync_visual/img4.png"
                                  alt="Welcome Coach Alex Instagram post — news row thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                    </div>
                  </div>

                  {/* ── ROW C: PROMOTIONS ────────────────────────────────
                      Receives: ls3 (main anim) + loop2 */}
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <p className="font-instrument text-[11px] font-bold text-black-axis uppercase tracking-wider">
                        PROMOTIONS
                      </p>
                      <p className="font-instrument text-[9px] text-soft-grey">Updated Today, 11:30 AM</p>
                    </div>

                    <div className="flex gap-2 mt-2 flex-wrap">

                      {/* ls3 thumbnail */}
                      <motion.div
                        className="relative z-[1]"
                        whileHover={{ scale: 1.25, zIndex: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-16 h-16 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div
                                layoutId="ls3"
                                className="absolute inset-0 rounded-lg overflow-hidden"
                                transition={{ duration: 1.0, ease: "easeInOut", delay: 0.2 }}
                              >
                                <Image
                                  src="/livesync_visual/img3.png"
                                  alt="Spring Sale Instagram promotion post — promotions row thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Permanent settled cards for loop posts that landed here */}
                      {settledLoopPosts
                        .filter(p => p.targetSection === "promo")
                        .map(p => (
                          <motion.div
                            key={p.id}
                            className="relative z-[1]"
                            whileHover={{ scale: 1.25, zIndex: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="w-16 h-16 relative shrink-0">
                              <motion.div
                                className="absolute inset-0 rounded-lg overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              >
                                <Image
                                  src={p.src}
                                  alt={`New promotion: ${p.text}`}
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            </div>
                          </motion.div>
                        ))
                      }

                      {/* Flying destination for loop → promo */}
                      {loopFlying && activeLoop?.targetSection === "promo" && (
                        <motion.div
                          className="relative z-[1]"
                          whileHover={{ scale: 1.25, zIndex: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-16 h-16 relative shrink-0">
                            <motion.div
                              layoutId={activeLoop.id}
                              className="absolute inset-0 rounded-lg overflow-hidden"
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 0.12 }}
                              transition={{ duration: 0.7, ease: "easeInOut" }}
                            >
                              <Image
                                src={activeLoop.src}
                                alt={`New Instagram post landing in promotions: ${activeLoop.text}`}
                                fill
                                className="object-cover"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </div>

                  {/* ── ROW D: EVENTS ────────────────────────────────────
                      Receives: ls6 (main anim) + loop1 */}
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <p className="font-instrument text-[11px] font-bold text-black-axis uppercase tracking-wider">
                        EVENTS
                      </p>
                      <p className="font-instrument text-[9px] text-soft-grey">New: Summer Slam Info added</p>
                    </div>

                    <div className="flex gap-2 mt-2 flex-wrap">

                      {/* ls6 thumbnail */}
                      <motion.div
                        className="relative z-[1]"
                        whileHover={{ scale: 1.25, zIndex: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-16 h-16 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div
                                layoutId="ls6"
                                className="absolute inset-0 rounded-lg overflow-hidden"
                                transition={{ duration: 1.0, ease: "easeInOut", delay: 0.3 }}
                              >
                                <Image
                                  src="/livesync_visual/img6.png"
                                  alt="Workshop Saturday Instagram post — events row thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Permanent settled cards for loop posts that landed here */}
                      {settledLoopPosts
                        .filter(p => p.targetSection === "events")
                        .map(p => (
                          <motion.div
                            key={p.id}
                            className="relative z-[1]"
                            whileHover={{ scale: 1.25, zIndex: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="w-16 h-16 relative shrink-0">
                              <motion.div
                                className="absolute inset-0 rounded-lg overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              >
                                <Image
                                  src={p.src}
                                  alt={`New event post: ${p.text}`}
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            </div>
                          </motion.div>
                        ))
                      }

                      {/* Flying destination for loop → events */}
                      {loopFlying && activeLoop?.targetSection === "events" && (
                        <motion.div
                          className="relative z-[1]"
                          whileHover={{ scale: 1.25, zIndex: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-16 h-16 relative shrink-0">
                            <motion.div
                              layoutId={activeLoop.id}
                              className="absolute inset-0 rounded-lg overflow-hidden"
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 0.12 }}
                              transition={{ duration: 0.7, ease: "easeInOut" }}
                            >
                              <Image
                                src={activeLoop.src}
                                alt={`New Instagram post landing in events: ${activeLoop.text}`}
                                fill
                                className="object-cover"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </div>

                </div>

                {/* ── RIGHT COLUMN: NEXT UP SPOTLIGHT ──────────────────── */}
                <div className="p-4 bg-black-axis rounded-xl flex flex-col gap-3">

                  <p className="font-instrument text-[10px] font-bold text-soft-grey uppercase tracking-widest">
                    NEXT UP: JIU-JITSU OPEN MAT (8:00 AM)
                  </p>

                  {/* Class preview image — hover scales slightly */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full h-32 rounded-xl overflow-hidden"
                  >
                    <Image
                      src="/livesync_visual/img10.png"
                      alt="Jiu-Jitsu Open Mat class preview"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="flex flex-col gap-1.5">

                    {/* Countdown — key={minutesLeft} re-triggers enter animation each decrement */}
                    <p className="font-instrument text-sm font-bold text-white-axis">
                      Starts in:{" "}
                      <motion.span
                        key={minutesLeft}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-magenta-axis"
                      >
                        {minutesLeft} MIN
                      </motion.span>
                    </p>

                    {/* Progress bar — 30 segments, filled segments reflect spotsTaken.
                        transition-colors duration-1000 gives a slow smooth fill. */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-1000 ${
                              i < spotsTaken ? "bg-white-axis" : "bg-soft-grey/20"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="font-instrument text-[9px] text-soft-grey">{spotsTaken}/30 Spots Taken</p>
                    </div>

                    {/* Urgency callout — key re-triggers fade when label changes */}
                    <motion.p
                      key={urgencyLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="font-instrument text-xs font-bold text-magenta-axis bg-magenta-axis/10 rounded-lg px-2 py-1 text-center uppercase tracking-wider"
                    >
                      {urgencyLabel}
                    </motion.p>

                    {/* Book Now button — hover animates bg to blue-axis, text to white-axis.
                        backgroundColor and color use CSS var() because Framer Motion animate
                        values are inline styles and cannot use Tailwind class names. */}
                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: "var(--color-blue-axis)", color: "var(--color-white-axis)" }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      className="w-full bg-white-axis text-black-axis font-instrument font-bold text-xs py-2 rounded-lg tracking-wider uppercase mt-1"
                    >
                      BOOK NOW
                    </motion.button>

                  </div>
                </div>

              </div>

              {/* ── BOTTOM ROW: STUDIO VITALS + COMMUNITY FEEDBACK ───────
                  Two equal columns side by side below the main grid. */}
              <div className="grid grid-cols-2 gap-4 mt-6">

                {/* ── STUDIO VITALS ──────────────────────────────────────── */}
                <div className="p-4 bg-grey-axis rounded-xl flex flex-col gap-3">

                  <h3 className="font-instrument text-[10px] font-bold uppercase tracking-widest text-white-axis">
                    LIVE STUDIO VITALS
                  </h3>

                  <div className="grid grid-cols-2 gap-3">

                    {/* Capacity gauge — SVG donut ring, fills as capacity% increases.
                        strokeDashoffset controls how much of the ring is drawn.
                        163.4 = full circumference (empty ring). 0 = full ring. */}
                    <div className="flex flex-col items-center gap-1">
                      <p className="font-instrument text-[9px] text-soft-grey uppercase tracking-wider">Capacity</p>
                      <svg viewBox="0 0 64 64" width="56" height="56">
                        {/* Background ring — always full circle, muted */}
                        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--color-soft-grey)" strokeWidth="5" opacity="0.2" />
                        {/* Foreground ring — animated, reflects capacity state */}
                        <motion.circle
                          cx="32" cy="32" r="26"
                          fill="none"
                          stroke="var(--color-blue-axis)"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray="163.4"
                          animate={{ strokeDashoffset: uiVisible ? capacityOffset : 163.4 }}
                          transition={{ duration: 8, ease: "linear" }}
                          transform="rotate(-90 32 32)"
                        />
                        {/* SVG <text> uses attributes not class names.
                            fontFamily references the CSS variable set by next/font. */}
                        <text x="32" y="36" textAnchor="middle" fontSize="8" fontWeight="bold"
                          fill="var(--color-white-axis)" fontFamily="var(--font-instrument)">
                          {capacity}% FULL
                        </text>
                      </svg>
                    </div>

                    {/* Countdown ring — shows minutes until next class */}
                    <div className="flex flex-col items-center gap-1">
                      <p className="font-instrument text-[9px] text-soft-grey uppercase tracking-wider">Next Class</p>
                      <svg viewBox="0 0 64 64" width="56" height="56">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--color-soft-grey)" strokeWidth="5" opacity="0.2" />
                        <motion.circle
                          cx="32" cy="32" r="26"
                          fill="none"
                          stroke="var(--color-magenta-axis)"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray="163.4"
                          animate={{ strokeDashoffset: uiVisible ? countdownOffset : 163.4 }}
                          transition={{ duration: 8, ease: "linear" }}
                          transform="rotate(-90 32 32)"
                        />
                        <text x="32" y="36" textAnchor="middle" fontSize="8" fontWeight="bold"
                          fill="var(--color-white-axis)" fontFamily="var(--font-instrument)">
                          {minutesLeft} MIN
                        </text>
                      </svg>
                    </div>

                    {/* Wave graph — col-span-2. Drifts slowly rightward via waveOffset (rAF).
                        Two copies of the wave path side by side prevent gap when it wraps.
                        clipPath clips them to the SVG viewport bounds. */}
                    <div className="col-span-2 flex flex-col gap-1">
                      <p className="font-instrument text-[9px] text-soft-grey uppercase tracking-wider">Studio Energy Flow</p>
                      {/* overflow: hidden on SVG — no Tailwind equivalent for SVG overflow attribute */}
                      <svg viewBox="0 0 120 40" width="100%" height="40" style={{ overflow: "hidden" }}>
                        <defs>
                          <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-uv-axis)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="var(--color-uv-axis)" stopOpacity="0" />
                          </linearGradient>
                          <clipPath id="waveClip">
                            <rect x="0" y="0" width="120" height="40" />
                          </clipPath>
                        </defs>
                        <g clipPath="url(#waveClip)" transform={`translate(${-(waveOffset % 120)}, 0)`}>
                          {[0, 120].map(xShift => (
                            <g key={xShift} transform={`translate(${xShift}, 0)`}>
                              <path
                                d="M0,35 C10,20 20,8 30,10 C40,12 50,22 60,20 C70,18 80,12 90,8 C100,5 110,8 120,15 L120,40 L0,40 Z"
                                fill="url(#energyGrad)"
                              />
                              <motion.path
                                d="M0,35 C10,20 20,8 30,10 C40,12 50,22 60,20 C70,18 80,12 90,8 C100,5 110,8 120,15"
                                fill="none"
                                stroke="var(--color-blue-axis)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: uiVisible ? 1 : 0 }}
                                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                              />
                            </g>
                          ))}
                        </g>
                        {/* Time labels along the bottom of the graph */}
                        {[["2", "7AM"], ["40", "12PM"], ["78", "5PM"], ["108", "10PM"]].map(([x, label]) => (
                          <text key={label} x={x} y="39" fontSize="5"
                            fill="var(--color-soft-grey)" fontFamily="var(--font-instrument)">{label}</text>
                        ))}
                      </svg>
                    </div>

                    {/* Members in studio — pulsing dot indicator */}
                    <div className="col-span-2 flex items-center gap-2">
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-2 h-2 rounded-full bg-blue-axis shrink-0"
                      />
                      <p className="font-instrument text-[10px] font-bold text-white-axis">12 MEMBERS IN STUDIO</p>
                    </div>

                  </div>
                </div>

                {/* ── COMMUNITY FEEDBACK ──────────────────────────────────── */}
                <div className="p-4 bg-grey-axis rounded-xl flex flex-col gap-2">

                  {/* Panel header with live indicator */}
                  <div className="flex items-center gap-2">
                    <h3 className="font-instrument text-[10px] font-bold uppercase tracking-widest text-white-axis">
                      Community
                    </h3>
                    <div className="flex items-center gap-1 ml-auto">
                      <motion.div
                        animate={{ opacity: [1, 0.25, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-axis"
                      />
                      <p className="font-instrument text-[9px] text-blue-axis font-semibold">LIVE</p>
                    </div>
                  </div>

                  {/* Fixed-height scroll container — new comments prepend at top.
                      scrollbarWidth and scrollbarColor are CSS properties with no Tailwind
                      equivalent, so they use inline styles. h-[160px] is Tailwind arbitrary value. */}
                  <div
                    className="flex flex-col gap-2 overflow-y-scroll h-[160px]"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "var(--color-soft-grey) transparent" }}
                  >
                    {/* AnimatePresence initial={false} prevents seed cards from animating on
                        first render — only newly prepended items get the slide-in animation.
                        `layout` on each card tells Framer Motion to animate existing cards
                        downward smoothly when a new card prepends above them. */}
                    <AnimatePresence initial={false}>
                      {feedItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: -12, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-start gap-2 p-2 bg-white-axis/5 rounded-lg shrink-0"
                        >
                          {/* Avatar — tinted with brand color at low opacity */}
                          <div className={`w-6 h-6 rounded-full shrink-0 ${item.avatar}`} />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="font-instrument text-[9px] font-bold text-soft-grey">{item.handle}</p>
                            <p className="font-instrument text-[10px] font-semibold text-white-axis leading-tight">&ldquo;{item.quote}&rdquo;</p>
                            <p className="font-instrument text-[9px] text-soft-grey">❤️ {item.likes} · {item.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                </div>

              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
