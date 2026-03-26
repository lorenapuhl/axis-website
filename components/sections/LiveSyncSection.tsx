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
  text: string       // overlay copy that simulates a real Instagram graphic
  timestamp: string  // e.g. "2 min ago"
  src: string        // image URL
  aspect: string     // Tailwind aspect-ratio class
  target: "notice" | "schedule" | "promo" | "news" | "events" | "filler"
}

interface LoopPost {
  id: string
  text: string
  src: string
  targetSection: "schedule" | "promo"  // which website card it flies into
}

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

// The 8 base Instagram grid posts.
// Cell 0 of the rendered grid is reserved for the loop slot (see below).
// These 8 fill cells 1–8.
// Posts whose target is NOT "filler" will fly to the website panel.
const BASE_POSTS: BasePost[] = [
  {
    id: "ls1",
    text: "Class canceled today",
    timestamp: "2 min ago",
    src: "/livesync_visual/img1.png",
    aspect: "aspect-square",
    target: "notice",
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
]

// Only these four IDs leave the grid during the main animation.
// ls5 and ls7–ls8 are fillers and stay in place.
const ANIMATED_IDS = new Set(["ls1", "ls2", "ls3", "ls4", "ls6"])

// Posts that auto-appear in the Instagram grid after the initial animation.
// Each one slides in, then flies to the corresponding website section.
const LOOP_POSTS: LoopPost[] = [
  {
    id: "loop0",
    text: "New class added: Boxing 19:00",
    src: "/livesync_visual/img10.png",
    targetSection: "schedule",
  },
  {
    id: "loop1",
    text: "Yoga Flow added: 20:30",
    src: "/livesync_visual/img11.png",
    targetSection: "schedule",
  },
  {
    id: "loop2",
    text: "Flash sale: 30% off today",
    src: "/livesync_visual/img12.png",
    targetSection: "promo",
  },
]

// Static text content that populates the website panel
const WEBSITE_SCHEDULE = ["New: HIIT 07:00 added", "Weekend schedule adjusted"]
const WEBSITE_PROMO    = "Spring Sale — 20% off memberships"
const WEBSITE_NEWS     = "Welcome our new coach: Alex"
const WEBSITE_EVENTS   = "Breathwork Workshop — Saturday"

// ─────────────────────────────────────────────────────────────────────────────
// HOW THE ANIMATION WORKS (overview for future readers)
//
// MAIN ANIMATION (triggered once when section enters viewport):
//
//   Step 0  Initial state: Instagram grid fully visible, website panel
//           faded to 20% opacity. Website image slots show empty placeholders.
//
//   Step 1  (0.5s) Highlight: posts ls1–ls4 and ls6 scale up and brighten,
//           drawing the viewer's eye to the posts that are about to move.
//
//   Step 2  (1.4s) Flight: the highlighted posts UNMOUNT from the grid.
//           AnimatePresence records each post's screen position at unmount.
//           Matching layoutId elements MOUNT on the right side (website panel).
//           Framer Motion automatically animates each element from the grid
//           position to its destination — the "shared element transition."
//           Website panel simultaneously fades to full opacity.
//
//   Step 3  (2.7s) UI builds: text labels, card headings, and content lines
//           fade in on the website panel via staggered opacity animations.
//
// CONTINUOUS LOOP (starts 1.2s after Step 3):
//
//   Every ~8s (1.5s in-grid + 1.2s flight + 5s gap), a new Instagram post
//   slides into grid cell 0. After 1.5s it "flies" to the website.
//   The website card updates with the new content line.
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
  // useRef creates a persistent reference to the DOM node without causing re-renders.
  const sectionRef = useRef<HTMLElement>(null)

  // isInView becomes true once 30% of the section is visible.
  // { once: true } means it fires only on the first intersection — never resets.
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  // ── MAIN ANIMATION STEP ───────────────────────────────────────────────────
  // A number (0–3) that drives which phase of the animation is active.
  // useState is React's way to store values that, when changed, cause a re-render.
  const [step, setStep] = useState(0)

  // ── LOOP STATE ────────────────────────────────────────────────────────────
  // Which LOOP_POSTS entry is currently active. -1 = no loop post is active.
  const [loopIndex, setLoopIndex] = useState(-1)

  // loopPhase describes where the active loop post currently is:
  //   "none"   → not visible anywhere
  //   "ingrid" → visible in Instagram grid cell 0 (just slid in)
  //   "flying" → source has unmounted, layoutId transition is in progress
  const [loopPhase, setLoopPhase] = useState<"none" | "ingrid" | "flying">("none")

  // Extra lines added to website cards when loop posts land.
  // These grow over time as each loop iteration settles.
  const [scheduleExtra, setScheduleExtra] = useState<string[]>([])
  const [promoExtra, setPromoExtra]       = useState<string | null>(null)

  // ── MAIN ANIMATION SEQUENCE ───────────────────────────────────────────────
  // useEffect runs AFTER React renders the component.
  // The dependency array [isInView] means: re-run whenever isInView changes.
  // We set up a chain of timers that advance `step` over time.
  // The returned function is the "cleanup" — React calls it when the component
  // unmounts (leaves the page), cancelling any pending timers to prevent errors.
  useEffect(() => {
    if (!isInView) return
    const t1 = setTimeout(() => setStep(1), 500)   // highlight posts
    const t2 = setTimeout(() => setStep(2), 1400)  // start flight
    const t3 = setTimeout(() => setStep(3), 2700)  // UI text builds in
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [isInView])

  // ── CONTINUOUS LOOP ───────────────────────────────────────────────────────
  // Starts once the main animation is done (step >= 3).
  // Uses a recursive setTimeout pattern instead of setInterval so that each
  // cycle can have variable timing and we can limit the total iterations.
  useEffect(() => {
    if (step < 3) return

    // We collect all timer IDs so we can cancel them on cleanup.
    const timers: ReturnType<typeof setTimeout>[] = []

    // `iteration` tracks which loop post we are currently showing.
    // This is a plain variable (not state) because it only needs to be read
    // within this effect, not across renders.
    let iteration = 0

    function runIteration() {
      if (iteration >= LOOP_POSTS.length) return  // stop after all loop posts

      // Phase 1: slide the new post into the Instagram grid
      setLoopIndex(iteration)
      setLoopPhase("ingrid")

      // Phase 2: after 1.5s, trigger the flight
      const flyTimer = setTimeout(() => {
        // Setting "flying" causes:
        //   - The source (in the loop slot) to unmount via AnimatePresence
        //   - The destination (in the website card) to mount
        //   - Framer Motion's layoutId to fly the element between the two
        setLoopPhase("flying")

        // Phase 3: after 1.2s, the flight has landed — update website content
        const settleTimer = setTimeout(() => {
          const post = LOOP_POSTS[iteration]
          if (post.targetSection === "schedule") {
            // Prepend the new line so it appears at the top of the card
            setScheduleExtra(prev => [post.text, ...prev])
          } else {
            setPromoExtra(post.text)
          }

          iteration++

          // Wait 5s before the next iteration
          const nextTimer = setTimeout(runIteration, 5000)
          timers.push(nextTimer)
        }, 1200)
        timers.push(settleTimer)
      }, 1500)
      timers.push(flyTimer)
    }

    // Delay before the first loop post appears
    const startTimer = setTimeout(runIteration, 1200)
    timers.push(startTimer)

    // Cleanup: cancel every timer if the component unmounts mid-loop
    return () => { timers.forEach(clearTimeout) }
  }, [step])

  // ── DERIVED STATE ─────────────────────────────────────────────────────────
  // These values are computed from state on every render — no extra setState needed.

  // Should website text content (labels, schedule lines, etc.) be visible?
  const uiVisible = step >= 3

  // Website panel opacity: faded before images arrive, full once they land
  const websiteOpacity = step >= 2 ? 1 : 0.2

  // Returns the Framer Motion `animate` target for an animated grid post.
  // At step 1 they scale up and brighten; at step 2 they unmount entirely.
  function getGridAnimate(id: string): Record<string, unknown> {
    if (!ANIMATED_IDS.has(id) || step >= 2) return {}
    if (step === 1) return { scale: 1.05, filter: "brightness(1.3)" }
    return {}
  }

  const activeLoop  = loopIndex >= 0 ? LOOP_POSTS[loopIndex] : null
  const loopInGrid  = loopPhase === "ingrid"  && activeLoop !== null
  const loopFlying  = loopPhase === "flying"  && activeLoop !== null

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      // ref connects the DOM node to sectionRef so useInView can observe it.
      // Mobile-first padding: py-20 px-6 at all sizes, overridden to py-36 px-12
      // at md (768px+). Always use this pattern for section padding.
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ───────────────────────────────────────────── */}
        {/* whileInView is a shorthand for useInView + animate.
            viewport={{ once: true }} means the animation fires only on first scroll. */}
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

        {/* ── TWO-COLUMN LAYOUT ────────────────────────────────────────── */}
        {/* grid-cols-1 on mobile (stacked), grid-cols-2 on md+ (side by side).
            gap-16 on mobile, gap-40 (160px) on desktop. items-start means
            both columns are top-aligned, not stretched to equal height. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-40 items-start">

          {/* ══════════════════════════════════════════════════════════════
              LEFT — INSTAGRAM FEED
          ══════════════════════════════════════════════════════════════ */}
          <div>
            {/* Section label — uppercase tracking-widest is the brand subheading style */}
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-4">
              Live Instagram
            </p>

            {/* Instagram container — dark surface with a subtle border */}
            <div className="bg-grey-axis border border-white-axis/10 rounded-2xl p-4">

              {/* Profile header: avatar + studio name + handle */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  {/* shrink-0 prevents the avatar from squishing in flex layouts */}
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

              {/* ── PHOTO GRID ─────────────────────────────────────────────
                  3 columns, 9 cells total.
                  Cell 0 = LOOP SLOT (reserved for auto-appearing posts).
                  Cells 1–8 = BASE_POSTS[0..7].

                  gap-[6px] uses an arbitrary Tailwind value because 6px is
                  the exact gap Instagram uses — no standard spacing token. */}
              <div className="grid grid-cols-3 gap-[6px]">

                {/* ── CELL 0: LOOP SLOT ───────────────────────────────────
                    The outer div always occupies this grid position.
                    AnimatePresence manages the loop post inside it.
                    When loopPhase transitions "ingrid" → "flying", the
                    motion.div unmounts, Framer Motion records its screen
                    position, and flies it to the website card destination. */}
                <div className="aspect-square relative">
                  <AnimatePresence>
                    {loopInGrid && activeLoop && (
                      <motion.div
                        key={activeLoop.id}
                        layoutId={activeLoop.id}
                        // Slides down from above when it first appears
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
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
                        {/* Overlay: simulates text-on-image IG graphic + timestamp */}
                        <div className="absolute inset-0 bg-black-axis/50 flex flex-col justify-between p-1.5">
                          <p className="font-instrument text-white-axis text-[9px] font-semibold leading-tight">
                            {activeLoop.text}
                          </p>
                          <p className="font-instrument text-white-axis/70 text-[8px]">
                            Posted just now
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Empty placeholder shown when the loop slot is unoccupied */}
                  {!loopInGrid && (
                    <div className="absolute inset-0 rounded-sm bg-white-axis/5" />
                  )}
                </div>

                {/* ── CELLS 1–8: BASE POSTS ───────────────────────────── */}
                {BASE_POSTS.map((post) => {
                  const isFiller = !ANIMATED_IDS.has(post.id)

                  // ── FILLER POSTS (ls5, ls7, ls8) ──────────────────────
                  // These never leave the grid. Simple motion.div with hover zoom.
                  if (isFiller) {
                    return (
                      <motion.div
                        key={post.id}
                        // overflow-hidden here is safe because this element never
                        // uses layoutId — it stays put and just scales on hover.
                        className={`${post.aspect} overflow-hidden rounded-sm relative`}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <Image
                          src={post.src}
                          alt="Fitness studio Instagram content"
                          fill
                          className="object-cover"
                        />
                        {post.text && (
                          <div className="absolute inset-0 bg-black-axis/40 flex flex-col justify-between p-1.5">
                            <p className="font-instrument text-white-axis text-[9px] font-semibold leading-tight">
                              {post.text}
                            </p>
                            <p className="font-instrument text-white-axis/70 text-[8px]">
                              Posted {post.timestamp}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )
                  }

                  // ── ANIMATED POSTS (ls1–ls4, ls6) ─────────────────────
                  // Structure:
                  //   outer div  → always in the grid, holds the cell's space
                  //                even after the image has flown away
                  //   inner motion.div (layoutId) → present at step < 2,
                  //                unmounts at step 2 triggering the flight
                  //   placeholder div → appears after the post has flown away
                  return (
                    <div key={post.id} className={`${post.aspect} relative`}>
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
                            {/* Overlay text + timestamp — simulates real IG graphic */}
                            <div className="absolute inset-0 bg-black-axis/40 flex flex-col justify-between p-1.5">
                              <p className="font-instrument text-white-axis text-[9px] font-semibold leading-tight">
                                {post.text}
                              </p>
                              <p className="font-instrument text-white-axis/70 text-[8px]">
                                Posted {post.timestamp}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Ghost placeholder once the post has flown away.
                          Very faint so the grid still reads as "posts extracted." */}
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
              RIGHT — AUTO-UPDATING WEBSITE
              Animates from opacity 0.2 → 1 as the posts arrive.
          ══════════════════════════════════════════════════════════════ */}
          <div>
            <p className="font-instrument uppercase tracking-widest text-soft-grey text-xs mb-4">
              Auto-updating website
            </p>

            {/* The website panel.
                `animate` prop responds to state changes and re-animates smoothly.
                This is different from `whileInView` — it runs whenever the
                animated value changes, not just on scroll entry. */}
            <motion.div
              initial={{ opacity: 0.2, y: 10 }}
              animate={{ opacity: websiteOpacity, y: step >= 2 ? 0 : 10 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-white-axis rounded-2xl p-6"
            >

              {/* ── LIVE INDICATOR ─────────────────────────────────────
                  Green pulsing dot + "Live" label in the top-right corner.
                  bg-green-500 is a standard Tailwind default colour.
                  No brand token exists for "system online" status —
                  green is the universal UI convention here. */}
              <div className="flex justify-end mb-3">
                <div className="flex items-center gap-1.5">
                  {/* Repeating opacity animation = heartbeat pulse effect.
                      `repeat: Infinity` makes it loop forever. */}
                  <motion.div
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2 h-2 rounded-full bg-green-500"
                  />
                  <p className="font-instrument text-black-axis text-xs font-semibold">
                    Live
                  </p>
                </div>
              </div>

              {/* ── A. NOTICE BAR ──────────────────────────────────────
                  ls1 flies in as a very faint background image.
                  IMPORTANT: no overflow-hidden on the outer div.
                  The layoutId motion.div carries its own overflow-hidden. */}
              <div className="relative h-9 rounded-lg bg-black-axis/5 flex items-center px-3 mb-5">
                <AnimatePresence>
                  {step >= 2 && (
                    <motion.div
                      layoutId="ls1"
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      // Starts fully opaque (during flight the image is clearly visible),
                      // then fades to near-invisible once it has settled into position.
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0.12 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <Image
                        src="/livesync_visual/img1.png"
                        alt="Instagram post about class cancellation — notice bar background"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: uiVisible ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="font-instrument text-black-axis text-xs relative z-10"
                  // z-10 ensures the text renders above the background image
                >
                  ⚠️ Today: Morning Flow canceled
                </motion.p>
              </div>

              {/* ── B. SCHEDULE CARD ───────────────────────────────────
                  ls2 flies in as a 40×40 thumbnail on the left.
                  Loop posts may later prepend extra lines to this card. */}
              <div className="rounded-xl border border-black-axis/10 p-3 mb-3">

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: uiVisible ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="font-instrument text-black-axis text-[10px] font-semibold uppercase tracking-wider mb-2"
                >
                  Schedule Updates
                </motion.p>

                <div className="flex items-start gap-2">

                  {/* Thumbnail destination for ls2.
                      No overflow-hidden on this outer div (OVERFLOW CLIPPING RULE). */}
                  <div className="w-10 h-10 relative bg-black-axis/5 rounded-lg shrink-0">
                    <AnimatePresence>
                      {step >= 2 && (
                        <motion.div
                          layoutId="ls2"
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.1 }}
                        >
                          <Image
                            src="/livesync_visual/img2.png"
                            alt="HIIT class Instagram post — schedule card thumbnail"
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Schedule text lines.
                      scheduleExtra lines are prepended when loop posts land here.
                      Each new line slides in from slightly above. */}
                  <motion.div
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: uiVisible ? 1 : 0, x: uiVisible ? 0 : 6 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex-1"
                  >
                    {/* Dynamically added lines from loop posts */}
                    {scheduleExtra.map((line, i) => (
                      <motion.p
                        key={`${line}-${i}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="font-instrument text-black-axis text-xs font-semibold leading-tight mb-0.5"
                      >
                        {line}
                      </motion.p>
                    ))}
                    {/* Static base lines */}
                    {WEBSITE_SCHEDULE.map((line) => (
                      <p key={line} className="font-instrument text-black-axis/60 text-xs leading-snug">
                        {line}
                      </p>
                    ))}
                  </motion.div>
                </div>

                {/* Loop post destination for schedule.
                    When loopPhase === "flying" and the target is "schedule",
                    this mounts with the same layoutId as the loop slot source.
                    Framer Motion flies the image from the grid to here.
                    It fades to near-invisible once it arrives. */}
                {loopFlying && activeLoop?.targetSection === "schedule" && (
                  <motion.div
                    layoutId={activeLoop.id}
                    className="mt-2 h-8 rounded-lg overflow-hidden"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0.15 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    <Image
                      src={activeLoop.src}
                      alt={`New Instagram post landing in schedule: ${activeLoop.text}`}
                      width={300}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                )}

              </div>

              {/* ── C. PROMOTIONS CARD ─────────────────────────────────
                  ls3 flies in as a faint background.
                  promoExtra replaces the default text when a loop post lands here. */}
              <div className="rounded-xl border border-black-axis/10 p-3 mb-3 relative">

                {/* ls3 background — no overflow-hidden on the outer div */}
                <AnimatePresence>
                  {step >= 2 && (
                    <motion.div
                      layoutId="ls3"
                      className="absolute inset-0 rounded-xl overflow-hidden"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0.1 }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                    >
                      <Image
                        src="/livesync_visual/img3.png"
                        alt="Spring sale Instagram promotion post — promotions card background"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: uiVisible ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                  className="font-instrument text-black-axis text-[10px] font-semibold uppercase tracking-wider mb-1 relative z-10"
                >
                  Promotions
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: uiVisible ? 1 : 0, x: uiVisible ? 0 : 6 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                  className="font-instrument text-black-axis text-xs leading-snug relative z-10"
                >
                  {/* promoExtra replaces the default text once a loop post lands */}
                  {promoExtra ?? WEBSITE_PROMO}
                </motion.p>

                {/* Loop post destination for promo — same pattern as schedule */}
                {loopFlying && activeLoop?.targetSection === "promo" && (
                  <motion.div
                    layoutId={activeLoop.id}
                    className="mt-2 h-6 rounded overflow-hidden"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0.12 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    <Image
                      src={activeLoop.src}
                      alt={`New Instagram post landing in promotions: ${activeLoop.text}`}
                      width={300}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                )}

              </div>

              {/* ── D. NEWS CARD ───────────────────────────────────────
                  ls4 flies in as a 40×40 thumbnail. */}
              <div className="rounded-xl border border-black-axis/10 p-3 mb-3">

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: uiVisible ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                  className="font-instrument text-black-axis text-[10px] font-semibold uppercase tracking-wider mb-2"
                >
                  News
                </motion.p>

                <div className="flex items-center gap-2">
                  {/* Thumbnail destination for ls4 */}
                  <div className="w-10 h-10 relative bg-black-axis/5 rounded-lg shrink-0">
                    <AnimatePresence>
                      {step >= 2 && (
                        <motion.div
                          layoutId="ls4"
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.2 }}
                        >
                          <Image
                            src="/livesync_visual/img4.png"
                            alt="Welcome Coach Alex Instagram post — news card thumbnail"
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.p
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: uiVisible ? 1 : 0, x: uiVisible ? 0 : 6 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="font-instrument text-black-axis text-xs leading-snug"
                  >
                    {WEBSITE_NEWS}
                  </motion.p>
                </div>

              </div>

              {/* ── E. EVENTS CARD ─────────────────────────────────────
                  ls6 flies in as a 40×40 thumbnail. */}
              <div className="rounded-xl border border-black-axis/10 p-3">

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: uiVisible ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
                  className="font-instrument text-black-axis text-[10px] font-semibold uppercase tracking-wider mb-2"
                >
                  Events
                </motion.p>

                <div className="flex items-center gap-2">
                  {/* Thumbnail destination for ls6 */}
                  <div className="w-10 h-10 relative bg-black-axis/5 rounded-lg shrink-0">
                    <AnimatePresence>
                      {step >= 2 && (
                        <motion.div
                          layoutId="ls6"
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.3 }}
                        >
                          <Image
                            src="/livesync_visual/img6.png"
                            alt="Workshop Saturday Instagram post — events card thumbnail"
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.p
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: uiVisible ? 1 : 0, x: uiVisible ? 0 : 6 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                    className="font-instrument text-black-axis text-xs leading-snug"
                  >
                    {WEBSITE_EVENTS}
                  </motion.p>
                </div>

              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
