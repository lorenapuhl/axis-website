"use client"
// "use client" tells Next.js this component runs in the BROWSER.
// Required because useState, useEffect, useRef, and Framer Motion all need
// a live DOM — they cannot run during server-side rendering.

import { motion, useInView, AnimatePresence, type TargetAndTransition } from "framer-motion"
// motion        → Framer Motion's animated wrapper for any HTML element
// useInView     → returns true once an element enters the viewport
// AnimatePresence → lets elements animate OUT before leaving the DOM,
//                   and enables layoutId-based "shared element" transitions
//                   (an element flies from one position to another)

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
// next/image → Next.js optimised image component — always use this, never <img>

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface BasePost {
  id: string
  text: string
  timestamp: string
  src: string
  aspect: string
  target: "schedule" | "promo" | "news" | "events" | "filler"
}

interface LoopPost {
  id: string
  text: string
  src: string
  targetSection: "schedule" | "promo" | "events"
}

interface FeedbackItem {
  id: string
  handle: string
  quote: string
  likes: number
  time: string
  avatar: string
}

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

const BASE_POSTS: BasePost[] = [
  { id: "ls1", text: "Class canceled today",  timestamp: "2 min ago",  src: "/livesync_visual/img1.png",  aspect: "aspect-square",  target: "schedule" },
  { id: "ls2", text: "New: HIIT 07:00",       timestamp: "5 min ago",  src: "/livesync_visual/img2.png",  aspect: "aspect-[4/5]",   target: "schedule" },
  { id: "ls3", text: "Spring Sale -20%",      timestamp: "1 hr ago",   src: "/livesync_visual/img3.png",  aspect: "aspect-square",  target: "promo"    },
  { id: "ls4", text: "Welcome Coach Alex",    timestamp: "2 hr ago",   src: "/livesync_visual/img4.png",  aspect: "aspect-[4/5]",   target: "news"     },
  { id: "ls5", text: "Weekend vibes",         timestamp: "3 hr ago",   src: "/livesync_visual/img5.png",  aspect: "aspect-square",  target: "filler"   },
  { id: "ls6", text: "Workshop Saturday",     timestamp: "5 hr ago",   src: "/livesync_visual/img6.png",  aspect: "aspect-square",  target: "events"   },
  { id: "ls7", text: "",                      timestamp: "1 day ago",  src: "/livesync_visual/img7.png",  aspect: "aspect-square",  target: "filler"   },
  { id: "ls8", text: "",                      timestamp: "2 days ago", src: "/livesync_visual/img8.png",  aspect: "aspect-square",  target: "filler"   },
  { id: "ls9", text: "",                      timestamp: "3 days ago", src: "/livesync_visual/img13.png", aspect: "aspect-square",  target: "filler"   },
  { id: "ls10",text: "",                      timestamp: "4 days ago", src: "/livesync_visual/img14.png", aspect: "aspect-square",  target: "filler"   },
]

// Only these IDs leave the strip during the main animation.
const ANIMATED_IDS = new Set(["ls1", "ls2", "ls3", "ls4", "ls6"])

const LOOP_POSTS: LoopPost[] = [
  { id: "loop0", text: "New class added: Boxing 19:00",  src: "/livesync_visual/img10.png", targetSection: "schedule" },
  { id: "loop1", text: "Sunday Bootcamp",                src: "/livesync_visual/img11.png", targetSection: "events"   },
  { id: "loop2", text: "Flash sale: 30% off today",      src: "/livesync_visual/img12.png", targetSection: "promo"    },
]

// Seed feedback items shown on first paint.
const FEEDBACK: FeedbackItem[] = [
  { id: "f1", handle: "@SarahMoves",    quote: "That 9 AM class changed my day's energy! (Jiu-Jitsu)", likes: 12, time: "3 mins ago",  avatar: "bg-blue-axis/20"    },
  { id: "f2", handle: "@CoachMike",     quote: "Best Saturday bootcamp yet. See you next week!",        likes: 24, time: "15 mins ago", avatar: "bg-magenta-axis/20" },
  { id: "f3", handle: "@FitnessFan99", quote: "The spring promo got me — signed up for 3 months!",    likes: 8,  time: "1 hr ago",    avatar: "bg-uv-axis/20"      },
  { id: "f4", handle: "@YogaQueen",    quote: "Open mat was incredible — instructor was top tier.",    likes: 31, time: "2 hrs ago",   avatar: "bg-soft-grey/20"    },
]

// Fixed pool of incoming comments — no runtime generation per performance rules.
const INCOMING_COMMENTS: FeedbackItem[] = [
  { id: "inc1", handle: "@RunnerJay",   quote: "Just booked my spot for open mat — cannot wait!",             likes: 5,  time: "just now", avatar: "bg-blue-axis/20"    },
  { id: "inc2", handle: "@BoxingBella", quote: "The HIIT at 7AM is a different level. Highly recommend.",     likes: 9,  time: "just now", avatar: "bg-magenta-axis/20" },
  { id: "inc3", handle: "@StudioReg",   quote: "Shoutout to the evening class — always packed with energy.", likes: 17, time: "just now", avatar: "bg-uv-axis/20"      },
]

// ─────────────────────────────────────────────────────────────────────────────
// HOW THE ANIMATION WORKS
//
//   Step 0  Strip visible, website panel at 20% opacity, row slots empty.
//   Step 1  (0.5s)  ls1–ls4, ls6 scale up — "highlight" phase.
//   Step 2  (1.4s)  Highlighted posts unmount from strip, layoutId flies them
//           to their destination rows. Panel fades to full opacity.
//   Step 3  (2.7s)  uiVisible = true → live simulation effects start.
//
//   LOOP: every ~8s a new post slides into cell 0, then flies to a row,
//   repeating for all LOOP_POSTS entries.
//
// OVERFLOW CLIPPING RULE:
//   overflow-hidden must sit on the layoutId motion.div ITSELF — never on a
//   parent. A parent with overflow-hidden clips the element mid-flight.
// ─────────────────────────────────────────────────────────────────────────────

export default function LiveSyncSection() {

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  // ── MAIN ANIMATION STEP ───────────────────────────────────────────────────
  const [step, setStep] = useState(0)

  // ── LOOP STATE ────────────────────────────────────────────────────────────
  const [loopIndex, setLoopIndex] = useState(-1)
  const [loopPhase, setLoopPhase] = useState<"none" | "ingrid" | "flying">("none")
  const [settledLoopPosts, setSettledLoopPosts] = useState<LoopPost[]>([])

  // ── DASHBOARD LIVE STATE ──────────────────────────────────────────────────
  const [capacity, setCapacity] = useState(75)
  const [minutesLeft, setMinutesLeft] = useState(14)
  // Starts at 25/30 and slowly climbs to 30
  const [spotsTaken, setSpotsTaken] = useState(25)
  const [feedItems, setFeedItems] = useState<FeedbackItem[]>(FEEDBACK)
  const [waveOffset, setWaveOffset] = useState(0)
  const waveRafRef = useRef<number>(0)

  // ── MAIN ANIMATION SEQUENCE ───────────────────────────────────────────────
  useEffect(() => {
    if (!isInView) return
    const t1 = setTimeout(() => setStep(1), 500)
    const t2 = setTimeout(() => setStep(2), 1400)
    const t3 = setTimeout(() => setStep(3), 2700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [isInView])

  // ── CONTINUOUS LOOP ───────────────────────────────────────────────────────
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
          // Capture post BEFORE the state update — the functional updater is
          // called by React asynchronously, so reading `iteration` inside it
          // could see the already-incremented value and push undefined.
          const post = LOOP_POSTS[iteration]
          setSettledLoopPosts(prev => [...prev, post])
          iteration++
          timers.push(setTimeout(runIteration, 5000))
        }, 1200)
        timers.push(settleTimer)
      }, 1500)
      timers.push(flyTimer)
    }

    timers.push(setTimeout(runIteration, 1200))
    return () => { timers.forEach(clearTimeout) }
  }, [step])

  // ── DERIVED STATE ─────────────────────────────────────────────────────────
  const uiVisible = step >= 3
  const websiteOpacity = step >= 2 ? 1 : 0.2

  function getGridAnimate(id: string): TargetAndTransition {
    if (!ANIMATED_IDS.has(id) || step >= 2) return {}
    if (step === 1) return { scale: 1.05, filter: "brightness(1.3)" }
    return {}
  }

  const activeLoop  = loopIndex >= 0 ? LOOP_POSTS[loopIndex] : null
  const loopInGrid  = loopPhase === "ingrid" && activeLoop !== null
  const loopFlying  = loopPhase === "flying" && activeLoop !== null

  // ── DASHBOARD DERIVED VALUES ──────────────────────────────────────────────
  // Circumference for r=26: 2π×26 ≈ 163.4. dashoffset 163.4=empty, 0=full.
  const capacityOffset  = 163.4 * (1 - capacity / 100)
  const countdownOffset = 163.4 * (minutesLeft / 60)
  const spotsLeft       = 30 - spotsTaken
  const classFull       = spotsLeft <= 0
  const urgencyLabel    = classFull
    ? "CLASS FULL"
    : spotsLeft === 1
    ? "ONLY 1 SPOT LEFT"
    : `ONLY ${spotsLeft} SPOTS LEFT`

  // ── LIVE SIMULATION EFFECTS ───────────────────────────────────────────────
  // All guard with `if (!uiVisible) return` — nothing runs before panel is visible.

  useEffect(() => {
    if (!uiVisible) return
    const id = setInterval(() => setCapacity(prev => prev < 82 ? prev + 1 : prev), 10000)
    return () => clearInterval(id)
  }, [uiVisible])

  useEffect(() => {
    if (!uiVisible) return
    const id = setInterval(() => setMinutesLeft(prev => prev > 0 ? prev - 1 : 0), 30000)
    return () => clearInterval(id)
  }, [uiVisible])

  useEffect(() => {
    if (!uiVisible) return
    const id = setInterval(() => setSpotsTaken(prev => prev < 30 ? prev + 1 : prev), 20000)
    return () => clearInterval(id)
  }, [uiVisible])

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

  // rAF only for the wave graph — all other timed effects use setInterval.
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
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          viewport={{ once: true }}
          className="text-center mx-auto mb-20 md:mb-28 max-w-[600px]"
        >
          <h2 className="font-instrument tracking-tight text-white-axis text-4xl leading-tight">
            Your studio changes daily.<br />
            Your website updates automatically.
          </h2>
          <p className="font-instrument text-soft-grey text-base mt-4 leading-relaxed">
            Schedule changes, announcements, promotions — always in sync.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12">

          {/* ══════════════════════════════════════════════════════════════
              TOP — INSTAGRAM FEED
              overflow-hidden on the outer container + overflow-x-hidden on
              the flex strip both ensure zero scrollbar on all browsers.
              [&::-webkit-scrollbar]:hidden hides the webkit scrollbar handle.
          ══════════════════════════════════════════════════════════════ */}
          <div>
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-4">
              Live Instagram
            </p>

            <div className="bg-grey-axis border border-white-axis/10 rounded-2xl p-4 overflow-hidden">

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
                  <p className="font-instrument text-white-axis text-xs font-semibold leading-tight">Sports Studio</p>
                  <p className="font-instrument text-soft-grey text-xs">@sports.studio</p>
                </div>
              </div>

              {/* overflow-x-hidden clips posts that extend beyond the container.
                  [&::-webkit-scrollbar]:hidden removes the Chrome/Safari scrollbar handle.
                  scrollbarWidth none (inline) removes it in Firefox. */}
              <div
                className="flex gap-[6px] overflow-x-hidden [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
              >

                {/* ── CELL 0: LOOP SLOT ───────────────────────────────── */}
                <div className="w-24 h-24 relative shrink-0">
                  <AnimatePresence>
                    {loopInGrid && activeLoop && (
                      <motion.div
                        key={activeLoop.id}
                        layoutId={activeLoop.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" as const }}
                        // overflow-hidden on THIS element — OVERFLOW CLIPPING RULE
                        className="absolute inset-0 rounded-sm overflow-hidden"
                      >
                        <Image src={activeLoop.src} alt={`New Instagram post: ${activeLoop.text}`} fill className="object-cover" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!loopInGrid && <div className="absolute inset-0 rounded-sm bg-white-axis/5" />}
                </div>

                {/* ── CELLS 1–10: BASE POSTS ──────────────────────────── */}
                {BASE_POSTS.map((post) => {
                  const isFiller = !ANIMATED_IDS.has(post.id)

                  if (isFiller) {
                    return (
                      <motion.div
                        key={post.id}
                        className="w-24 h-24 shrink-0 overflow-hidden rounded-sm relative"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.35, ease: "easeOut" as const }}
                      >
                        <Image src={post.src} alt="Fitness studio Instagram content" fill className="object-cover" />
                      </motion.div>
                    )
                  }

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
                            className="absolute inset-0 overflow-hidden rounded-sm"
                          >
                            <Image src={post.src} alt={post.text || "Fitness studio Instagram post"} fill className="object-cover" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {step >= 2 && <div className="absolute inset-0 rounded-sm bg-white-axis/5" />}
                    </div>
                  )
                })}

              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              BOTTOM — AUTO-UPDATING WEBSITE PANEL
          ══════════════════════════════════════════════════════════════ */}
          <div>

            {/* Label + live indicator on the same line, outside the white panel.
                Green pulsing dot is the universal "system online" convention. */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs">
                Auto-updating website
              </p>
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <p className="font-instrument text-soft-grey text-xs font-semibold">Live</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0.2, y: 10 }}
              animate={{ opacity: websiteOpacity, y: step >= 2 ? 0 : 10 }}
              transition={{ duration: 0.7, ease: "easeOut" as const }}
              className="bg-white-axis rounded-2xl p-6"
            >

              {/* ── MAIN 2-COLUMN GRID ───────────────────────────────────
                  Left (70%): 2×2 grid of the four update rows.
                  Right (30%): NEXT UP spotlight card. */}
              {/* grid-cols-1: stacks sections vertically on mobile.
                  md:grid-cols-[65%_35%]: side-by-side 65/35 split on desktop. */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-[65%_35%]">

                {/* ── LEFT: SECTION ROWS ────────────────────────────────
                    On mobile: grid-cols-1 stacks all four sections vertically
                    (schedule → news → promotions → events).
                    On desktop (md+): grid-cols-[60%_40%] restores the 2×2 layout
                    with a weighted split. */}
                <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6">

                  {/* ── CELL A: SCHEDULE UPDATES (top-left) ────────────── */}
                  <div className="mb-1">
                    <div className="">
                      <p className="font-instrument text-[11px] font-bold text-black-axis uppercase tracking-wider">SCHEDULE UPDATES</p>
                      <p className="font-instrument text-[9px] text-soft-grey">Today, 8:00 AM</p>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">

                      {/* ls1 — hover scale: 2.5 zooms the thumbnail 2.5× its natural size */}
                      <motion.div className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                        <div className="w-16 h-16 md:w-30 md:h-30 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div layoutId="ls1" className="absolute inset-0 rounded-lg overflow-hidden" transition={{ duration: 1.0, ease: "easeInOut" }}>
                                <Image src="/livesync_visual/img1.png" alt="Instagram post about class update — schedule row thumbnail" fill className="object-cover" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* ls2 */}
                      <motion.div className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                        <div className="w-16 h-16 md:w-30 md:h-30 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div layoutId="ls2" className="absolute inset-0 rounded-lg overflow-hidden" transition={{ duration: 1.0, ease: "easeInOut", delay: 0.1 }}>
                                <Image src="/livesync_visual/img2.png" alt="New HIIT class Instagram post — schedule row thumbnail" fill className="object-cover" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Settled loop posts for schedule */}
                      {settledLoopPosts.filter(p => p.targetSection === "schedule").map(p => (
                        <motion.div key={p.id} className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                          <div className="w-16 h-16 md:w-30 md:h-30 relative shrink-0">
                            <motion.div className="absolute inset-0 rounded-lg overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" as const }}>
                              <Image src={p.src} alt={`New schedule post: ${p.text}`} fill className="object-cover" />
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Flying destination for loop → schedule */}
                      {loopFlying && activeLoop?.targetSection === "schedule" && (
                        <motion.div className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                          <div className="w-16 h-16 relative shrink-0">
                            <motion.div layoutId={activeLoop.id} className="absolute inset-0 rounded-lg overflow-hidden" initial={{ opacity: 1 }} animate={{ opacity: 0.12 }} transition={{ duration: 0.7, ease: "easeInOut" }}>
                              <Image src={activeLoop.src} alt={`New Instagram post landing in schedule: ${activeLoop.text}`} fill className="object-cover" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </div>

                  {/* ── CELL B: NEWS (top-right) ────────────────────────── */}
                  <div>
                    <div className="mb-1">
                      <p className="font-instrument text-[11px] font-bold text-black-axis uppercase tracking-wider">NEWS</p>
                      <p className="font-instrument text-[9px] text-soft-grey">2 mins ago</p>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">

                      {/* ls4 */}
                      <motion.div className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                        <div className="w-16 h-16 md:w-30 md:h-30 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div layoutId="ls4" className="absolute inset-0 rounded-lg overflow-hidden" transition={{ duration: 1.0, ease: "easeInOut", delay: 0.2 }}>
                                <Image src="/livesync_visual/img4.png" alt="Welcome Coach Alex Instagram post — news row thumbnail" fill className="object-cover" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                    </div>
                  </div>

                  {/* ── CELL C: PROMOTIONS (bottom-left) ─────────────────── */}
                  <div>
                    <div className="mb-1">
                      <p className="font-instrument text-[11px] font-bold text-black-axis uppercase tracking-wider">PROMOTIONS</p>
                      <p className="font-instrument text-[9px] text-soft-grey">Today, 11:30 AM</p>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">

                      {/* ls3 */}
                      <motion.div className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                        <div className="w-16 h-16 md:w-30 md:h-30 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div layoutId="ls3" className="absolute inset-0 rounded-lg overflow-hidden" transition={{ duration: 1.0, ease: "easeInOut", delay: 0.2 }}>
                                <Image src="/livesync_visual/img3.png" alt="Spring Sale Instagram promotion post — promotions row thumbnail" fill className="object-cover" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {settledLoopPosts.filter(p => p.targetSection === "promo").map(p => (
                        <motion.div key={p.id} className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                          <div className="w-16 h-16 md:w-30 md:h-30 relative shrink-0">
                            <motion.div className="absolute inset-0 rounded-lg overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" as const }}>
                              <Image src={p.src} alt={`New promotion: ${p.text}`} fill className="object-cover" />
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}

                      {loopFlying && activeLoop?.targetSection === "promo" && (
                        <motion.div className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                          <div className="w-16 h-16 md:w-30 md:h-30 relative shrink-0">
                            <motion.div layoutId={activeLoop.id} className="absolute inset-0 rounded-lg overflow-hidden" initial={{ opacity: 1 }} animate={{ opacity: 0.12 }} transition={{ duration: 0.7, ease: "easeInOut" }}>
                              <Image src={activeLoop.src} alt={`New Instagram post landing in promotions: ${activeLoop.text}`} fill className="object-cover" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </div>

                  {/* ── CELL D: EVENTS (bottom-right) ───────────────────── */}
                  <div>
                    <div className="mb-1">
                      <p className="font-instrument text-[11px] font-bold text-black-axis uppercase tracking-wider">EVENTS</p>
                      <p className="font-instrument text-[9px] text-soft-grey">Summer Slam added</p>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">

                      {/* ls6 */}
                      <motion.div className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                        <div className="w-16 h-16 md:w-30 md:h-30 relative shrink-0">
                          <AnimatePresence>
                            {step >= 2 && (
                              <motion.div layoutId="ls6" className="absolute inset-0 rounded-lg overflow-hidden" transition={{ duration: 1.0, ease: "easeInOut", delay: 0.3 }}>
                                <Image src="/livesync_visual/img6.png" alt="Workshop Saturday Instagram post — events row thumbnail" fill className="object-cover" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {settledLoopPosts.filter(p => p.targetSection === "events").map(p => (
                        <motion.div key={p.id} className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                          <div className="w-16 h-16 md:w-30 md:h-30 relative shrink-0">
                            <motion.div className="absolute inset-0 rounded-lg overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" as const }}>
                              <Image src={p.src} alt={`New event post: ${p.text}`} fill className="object-cover" />
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}

                      {loopFlying && activeLoop?.targetSection === "events" && (
                        <motion.div className="relative z-[1]" whileHover={{ scale: 2.5, zIndex: 10 }} transition={{ duration: 0.2 }}>
                          <div className="w-16 h-16 relative shrink-0">
                            <motion.div layoutId={activeLoop.id} className="absolute inset-0 rounded-lg overflow-hidden" initial={{ opacity: 1 }} animate={{ opacity: 0.12 }} transition={{ duration: 0.7, ease: "easeInOut" }}>
                              <Image src={activeLoop.src} alt={`New Instagram post landing in events: ${activeLoop.text}`} fill className="object-cover" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </div>

                </div>

                {/* ── RIGHT (30%): NEXT UP SPOTLIGHT ───────────────────────
                    bg-neutral-100 replaces the previous black background.
                    All text inside uses dark tokens for contrast on the light surface. */}
                {/* md:mr-7: right margin only on desktop where the card sits in the right column.
                    On mobile the card takes full width below the 4-cell grid. */}
                <div className="md:mr-7 p-4 bg-neutral-100 rounded-xl flex flex-col gap-3">

                  <p className="font-instrument text-[10px] font-bold text-black-axis/60 uppercase tracking-widest">
                    NEXT UP: JIU-JITSU OPEN MAT (8:00 AM)
                  </p>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full h-32 rounded-xl overflow-hidden"
                  >
                    <Image src="/livesync_visual/img10.png" alt="Jiu-Jitsu Open Mat class preview" fill className="object-cover" />
                  </motion.div>

                  <div className="flex flex-col gap-1.5">

                    {/* Countdown — key re-triggers enter animation each decrement */}
                    <p className="font-instrument text-sm font-bold text-black-axis">
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

                    {/* Progress bar — 30 segments, filled count = spotsTaken */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-1000 ${
                              i < spotsTaken ? "bg-black-axis" : "bg-black-axis/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="font-instrument text-[9px] text-soft-grey">{spotsTaken}/30 Spots Taken</p>
                    </div>

                    {/* Urgency callout */}
                    <motion.p
                      key={urgencyLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="font-instrument text-xs font-bold text-magenta-axis bg-magenta-axis/10 rounded-lg px-2 py-1 text-center uppercase tracking-wider"
                    >
                      {urgencyLabel}
                    </motion.p>

                    {/* BOOK NOW — disabled and greyed when class is full.
                        When classFull: no whileHover, no whileTap, muted colours.
                        When open: hover animates bg to blue-axis with white text. */}
                    {classFull ? (
                      <button
                        disabled
                        className="w-full bg-black-axis/10 text-black-axis/30 font-instrument font-bold text-xs py-2 rounded-lg tracking-wider uppercase mt-1 cursor-not-allowed"
                      >
                        CLASS FULL
                      </button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: "var(--color-blue-axis)", color: "var(--color-white-axis)" }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="w-full bg-black-axis text-white-axis font-instrument font-bold text-xs py-2 rounded-lg tracking-wider uppercase mt-1"
                      >
                        BOOK NOW
                      </motion.button>
                    )}

                  </div>
                </div>

              </div>

              {/* ── BOTTOM ROW: STUDIO VITALS + COMMUNITY ────────────────
                  Spans the full panel width below the main 2-col grid.
                  Both panels use bg-neutral-100 — dark text throughout. */}
              {/* grid-cols-1 on mobile: stacks Vitals above Community.
                  md:grid-cols-2: side-by-side on desktop. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                {/* ── STUDIO VITALS ──────────────────────────────────────── */}
                <div className="p-5 bg-neutral-100 rounded-xl flex flex-col gap-4">

                  <h3 className="font-instrument text-[10px] font-bold uppercase tracking-widest text-black-axis">
                    LIVE STUDIO VITALS
                  </h3>

                  {/* flex row: wave + members on the left, two circles stacked on the right */}
                  <div className="flex gap-6 items-stretch">

                    {/* LEFT — label top, wave graph fills space, members at bottom */}
                    <div className="flex-1 flex flex-col border-r border-black-axis/10 pr-6">

                      {/* Wave graph — drifts rightward via rAF waveOffset */}
                      <motion.div
                        className="flex flex-col gap-1 flex-1 min-h-0"
                        animate={{ opacity: [0.65, 1, 0.65] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
                      >
                        <p className="font-instrument text-[9px] text-soft-grey uppercase tracking-wider">Studio Energy Flow</p>
                        {/* Wrapper div lets the SVG size itself against a flex-grown parent */}
                        <div className="h-45">
                        <svg viewBox="0 55 120 85" width="100%" height="100%" style={{ overflow: "hidden", display: "block" }}>
                          <defs>
                            <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--color-uv-axis)" stopOpacity="0.5" />
                              <stop offset="100%" stopColor="var(--color-uv-axis)" stopOpacity="0" />
                            </linearGradient>
                            <clipPath id="waveClip">
                              <rect x="0" y="0" width="120" height="118" />
                            </clipPath>
                          </defs>
                          <g clipPath="url(#waveClip)" transform={`translate(${-(waveOffset % 10)}, 60)`}>
                            {[0, 120].map(xShift => (
                              <g key={xShift} transform={`translate(${xShift}, 0)`}>
                                <path
                                  d="M0,40 C10,25 20,10 30,12 C40,14 50,26 60,24 C70,22 80,14 90,10 C100,6 110,10 120,18 L120,48 L0,48 Z"
                                  fill="url(#energyGrad)"
                                />
                                <motion.path
                                  d="M0,40 C10,25 20,10 30,12 C40,14 50,26 60,24 C70,22 80,14 90,10 C100,6 110,10 120,18"
                                  fill="none"
                                  stroke="var(--color-blue-axis)"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: uiVisible ? 1 : 0 }}
                                  transition={{ duration: 2, ease: "easeOut" as const, delay: 0.3 }}
                                />
                              </g>
                            ))}
                          </g>
                          {[ ["2", "10AM"], ["40", "12PM"], ["78", "5PM"], ["110", "9PM"]].map(([x, label]) => (
                            <text key={label} x={x} y="120" fontSize="5"
                              fill="var(--color-soft-grey)" fontFamily="var(--font-instrument)">{label}</text>
                          ))}
                        </svg>
                        </div>
                      </motion.div>

                      {/* Members in studio — pulsing dot, pinned to bottom of left column */}
                      <div className="flex items-center gap-2 mt-auto">
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="w-2 h-2 rounded-full bg-blue-axis shrink-0"
                        />
                        <p className="font-instrument text-[10px] font-bold text-black-axis">12 MEMBERS IN STUDIO</p>
                      </div>

                    </div>

                    {/* RIGHT — two circles stacked, spaced top and bottom */}
                    <div className="w-1/3 flex flex-col justify-between items-center py-2">

                      {/* Capacity gauge */}
                      <div className="flex flex-col items-center gap-1">
                        <p className="font-instrument text-[9px] text-soft-grey uppercase tracking-wider">Capacity</p>
                        <motion.div
                          animate={{ opacity: [0.65, 1, 0.65] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <svg viewBox="0 0 64 64" width="80" height="80">
                            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--color-soft-grey)" strokeWidth="5" opacity="0.2" />
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
                            <text x="32" y="36" textAnchor="middle" fontSize="8" fontWeight="bold"
                              fill="var(--color-black-axis)" fontFamily="var(--font-instrument)">
                              {capacity}% FULL
                            </text>
                          </svg>
                        </motion.div>
                      </div>

                      {/* Countdown ring — offset by 0.8s so it pulses out of sync with capacity */}
                      <div className="flex flex-col items-center gap-1">
                        <p className="font-instrument text-[9px] text-soft-grey uppercase tracking-wider">Next Class</p>
                        <motion.div
                          animate={{ opacity: [0.65, 1, 0.65] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                        >
                          <svg viewBox="0 0 64 64" width="80" height="80">
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
                              fill="var(--color-black-axis)" fontFamily="var(--font-instrument)">
                              {minutesLeft} MIN
                            </text>
                          </svg>
                        </motion.div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* ── COMMUNITY FEEDBACK ──────────────────────────────────── */}
                <div className="p-5 bg-neutral-100 rounded-xl flex flex-col gap-2">

                  <div className="flex items-center gap-2">
                    <h3 className="font-instrument text-[10px] font-bold uppercase tracking-widest text-black-axis">
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

                  {/* Scrollable feed — scrollbars hidden on all browsers.
                      overflow-x-hidden prevents any horizontal scroll from long text.
                      [&::-webkit-scrollbar]:hidden removes Chrome/Safari scrollbar.
                      scrollbarWidth: none (inline) removes Firefox scrollbar.
                      h-[200px] gives the community panel more vertical presence. */}
                  <div
                    className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-[200px] [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {/* AnimatePresence initial={false} — seed cards don't animate on mount.
                        Only newly prepended items get the slide-in animation.
                        `layout` on each card animates existing cards downward as new ones arrive. */}
                    <AnimatePresence initial={false}>
                      {feedItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: -12, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.35, ease: "easeOut" as const }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-start gap-2 p-2 bg-black-axis/5 rounded-lg shrink-0"
                        >
                          {/* Avatar tinted circle */}
                          <div className={`w-6 h-6 rounded-full shrink-0 ${item.avatar}`} />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="font-instrument text-[9px] font-bold text-soft-grey">{item.handle}</p>
                            <p className="font-instrument text-[10px] font-semibold text-black-axis leading-tight">&ldquo;{item.quote}&rdquo;</p>
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
