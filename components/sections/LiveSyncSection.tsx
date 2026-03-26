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
  targetSection: "schedule" | "promo" | "events"  // which kanban column it flies into
}

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

// The 8 base Instagram strip posts.
// Cell 0 of the rendered strip is reserved for the loop slot (see below).
// These 8 fill cells 1–8.
// Posts whose target is NOT "filler" will fly to the website panel.
const BASE_POSTS: BasePost[] = [
  {
    id: "ls1",
    text: "Class canceled today",
    timestamp: "2 min ago",
    src: "/livesync_visual/img1.png",
    aspect: "aspect-square",
    target: "schedule",  // changed from "notice" — now flies into Schedule column
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

// Only these IDs leave the strip during the main animation.
// ls5, ls7, ls8 are fillers and stay in place.
const ANIMATED_IDS = new Set(["ls1", "ls2", "ls3", "ls4", "ls6"])

// Posts that auto-appear in the Instagram strip after the initial animation.
// Each one slides in from the left, then flies to the corresponding column.
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
    targetSection: "events",  // changed from "schedule"
  },
  {
    id: "loop2",
    text: "Flash sale: 30% off today",
    src: "/livesync_visual/img12.png",
    targetSection: "promo",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HOW THE ANIMATION WORKS (overview for future readers)
//
// MAIN ANIMATION (triggered once when section enters viewport):
//
//   Step 0  Initial state: Instagram strip fully visible, website panel
//           faded to 20% opacity. Kanban column slots are empty.
//
//   Step 1  (0.5s) Highlight: posts ls1–ls4 and ls6 scale up and brighten,
//           drawing the viewer's eye to the posts that are about to move.
//
//   Step 2  (1.4s) Flight: the highlighted posts UNMOUNT from the strip.
//           AnimatePresence records each post's screen position at unmount.
//           Matching layoutId elements MOUNT in the kanban columns.
//           Framer Motion automatically animates each element from the strip
//           position to its destination — the "shared element transition."
//           Website panel simultaneously fades to full opacity.
//
//   Step 3  (2.7s) Column headers fade in via staggered opacity animations.
//
// CONTINUOUS LOOP (starts 1.2s after Step 3):
//
//   Every ~8s (1.5s in-strip + 1.2s flight + 5s gap), a new Instagram post
//   slides into strip cell 0. After 1.5s it "flies" to the website column.
//   The column gains a new permanent square thumbnail card.
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
  //   "ingrid" → visible in strip cell 0 (just slid in from the left)
  //   "flying" → source has unmounted, layoutId transition is in progress
  const [loopPhase, setLoopPhase] = useState<"none" | "ingrid" | "flying">("none")

  // Loop posts that have fully settled into their kanban column.
  // Each settled post renders as a permanent square thumbnail card.
  // This array grows over time as each loop iteration completes.
  const [settledLoopPosts, setSettledLoopPosts] = useState<LoopPost[]>([])

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
    const t3 = setTimeout(() => setStep(3), 2700)  // column headers build in
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

      // Phase 1: slide the new post into the Instagram strip (cell 0)
      setLoopIndex(iteration)
      setLoopPhase("ingrid")

      // Phase 2: after 1.5s, trigger the flight
      const flyTimer = setTimeout(() => {
        // Setting "flying" causes:
        //   - The source (in the loop slot) to unmount via AnimatePresence
        //   - The destination (in the website column) to mount
        //   - Framer Motion's layoutId to fly the element between the two
        setLoopPhase("flying")

        // Phase 3: after 1.2s, the flight has landed — add settled thumbnail
        const settleTimer = setTimeout(() => {
          const post = LOOP_POSTS[iteration]
          // Add the landed post to settledLoopPosts so it renders as a
          // permanent thumbnail card in its target column.
          setSettledLoopPosts(prev => [...prev, post])

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

  // Should website column headers be visible?
  const uiVisible = step >= 3

  // Website panel opacity: faded before images arrive, full once they land
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

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      // ref connects the DOM node to sectionRef so useInView can observe it.
      // Mobile-first padding: py-20 px-6 at all sizes, overridden to py-36 px-12
      // at md (768px+). Always use this pattern for section padding.
      className="bg-black-axis py-20 px-6 md:py-36 md:px-12"
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

        {/* ── VERTICAL STACK LAYOUT ────────────────────────────────────── */}
        {/* Instagram feed on top, website panel below.
            flex-col stacks both panels vertically on all screen sizes. */}
        <div className="flex flex-col gap-12">

          {/* ══════════════════════════════════════════════════════════════
              TOP — INSTAGRAM FEED (horizontal scrolling strip)
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

              {/* ── HORIZONTAL SCROLLING STRIP ─────────────────────────────
                  flex + overflow-x-auto creates a horizontally scrollable row.
                  shrink-0 on each post prevents them from compressing.
                  pb-2 gives breathing room below the scrollbar.
                  Cell 0 = LOOP SLOT (reserved for auto-appearing posts).
                  Cells 1–8 = BASE_POSTS[0..7].

                  gap-[6px] uses an arbitrary Tailwind value because 6px is
                  the exact gap Instagram uses — no standard spacing token. */}
              <div className="flex gap-[6px] overflow-x-auto pb-2">

                {/* ── CELL 0: LOOP SLOT ───────────────────────────────────
                    The outer div always occupies this strip position.
                    AnimatePresence manages the loop post inside it.
                    When loopPhase transitions "ingrid" → "flying", the
                    motion.div unmounts, Framer Motion records its screen
                    position, and flies it to the website column destination. */}
                <div className="w-24 h-24 relative shrink-0">
                  <AnimatePresence>
                    {loopInGrid && activeLoop && (
                      <motion.div
                        key={activeLoop.id}
                        layoutId={activeLoop.id}
                        // Slides in from the left — matches the horizontal direction
                        // of the strip layout (previously was y: -16 for a grid).
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
                        {/* No text overlay — images are self-explanatory */}
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
                  // These never leave the strip. Simple motion.div with hover zoom.
                  if (isFiller) {
                    return (
                      <motion.div
                        key={post.id}
                        // overflow-hidden here is safe because this element never
                        // uses layoutId — it stays put and just scales on hover.
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
                        {/* No text overlay — images are self-explanatory */}
                      </motion.div>
                    )
                  }

                  // ── ANIMATED POSTS (ls1–ls4, ls6) ─────────────────────
                  // Structure:
                  //   outer div  → always in the strip, holds the cell's space
                  //                even after the image has flown away
                  //   inner motion.div (layoutId) → present at step < 2,
                  //                unmounts at step 2 triggering the flight
                  //   placeholder div → appears after the post has flown away
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
                            {/* No text overlay — images are self-explanatory */}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Ghost placeholder once the post has flown away.
                          Very faint so the strip still reads as "posts extracted." */}
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
              BOTTOM — AUTO-UPDATING WEBSITE (4-column kanban)
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
              <div className="flex justify-end mb-4">
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

              {/* ── KANBAN COLUMNS ─────────────────────────────────────
                  4 equal-width columns side by side.
                  grid-cols-2 on mobile (two pairs stacked for readability),
                  grid-cols-4 on md+ (all four columns side by side as designed).
                  Each column holds a header label + stacked square thumbnails
                  that grow as images fly in from the Instagram strip. */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                {/* ── A. SCHEDULE UPDATES COLUMN ─────────────────────────
                    Receives: ls1 (main anim) + ls2 (main anim) + loop0 */}
                <div className="flex flex-col gap-2">

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: uiVisible ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="font-instrument text-black-axis text-[10px] font-semibold uppercase tracking-wider"
                  >
                    Schedule Updates
                  </motion.p>

                  {/* ls1 thumbnail — flies in from strip at step 2.
                      No overflow-hidden on the outer div (OVERFLOW CLIPPING RULE).
                      aspect-square sizes the slot as a square via CSS aspect-ratio.
                      The inner absolute inset-0 fills this square exactly. */}
                  <div className="aspect-square relative">
                    <AnimatePresence>
                      {step >= 2 && (
                        <motion.div
                          layoutId="ls1"
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          transition={{ duration: 1.0, ease: "easeInOut" }}
                        >
                          <Image
                            src="/livesync_visual/img1.png"
                            alt="Instagram post about class update — schedule column thumbnail"
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ls2 thumbnail — slight delay so it arrives staggered after ls1.
                      No overflow-hidden on the outer div (OVERFLOW CLIPPING RULE). */}
                  <div className="aspect-square relative">
                    <AnimatePresence>
                      {step >= 2 && (
                        <motion.div
                          layoutId="ls2"
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.1 }}
                        >
                          <Image
                            src="/livesync_visual/img2.png"
                            alt="New HIIT class Instagram post — schedule column thumbnail"
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Permanent settled cards for loop posts that landed here.
                      These appear after each loop post's flight completes (settleTimer).
                      They fade in gently — no layoutId needed since the flight
                      has already completed by the time these mount. */}
                  {settledLoopPosts
                    .filter(p => p.targetSection === "schedule")
                    .map(p => (
                      <div key={p.id} className="aspect-square relative">
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
                    ))
                  }

                  {/* Flying destination for loop → schedule.
                      Mounts when a loop post is mid-flight to this column.
                      Receives the layoutId element flying from the strip.
                      Fades to near-invisible once it arrives — the permanent
                      settled card (above) appears at the same time. */}
                  {loopFlying && activeLoop?.targetSection === "schedule" && (
                    <div className="aspect-square relative">
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
                  )}

                </div>

                {/* ── B. NEWS COLUMN ─────────────────────────────────────
                    Receives: ls4 (main anim) */}
                <div className="flex flex-col gap-2">

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: uiVisible ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                    className="font-instrument text-black-axis text-[10px] font-semibold uppercase tracking-wider"
                  >
                    News
                  </motion.p>

                  {/* ls4 thumbnail — flies in from strip at step 2.
                      No overflow-hidden on the outer div (OVERFLOW CLIPPING RULE). */}
                  <div className="aspect-square relative">
                    <AnimatePresence>
                      {step >= 2 && (
                        <motion.div
                          layoutId="ls4"
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.2 }}
                        >
                          <Image
                            src="/livesync_visual/img4.png"
                            alt="Welcome Coach Alex Instagram post — news column thumbnail"
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                {/* ── C. PROMOTIONS COLUMN ───────────────────────────────
                    Receives: ls3 (main anim) + loop2 */}
                <div className="flex flex-col gap-2">

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: uiVisible ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                    className="font-instrument text-black-axis text-[10px] font-semibold uppercase tracking-wider"
                  >
                    Promotions
                  </motion.p>

                  {/* ls3 thumbnail — flies in from strip at step 2.
                      No overflow-hidden on the outer div (OVERFLOW CLIPPING RULE). */}
                  <div className="aspect-square relative">
                    <AnimatePresence>
                      {step >= 2 && (
                        <motion.div
                          layoutId="ls3"
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.2 }}
                        >
                          <Image
                            src="/livesync_visual/img3.png"
                            alt="Spring Sale Instagram promotion post — promotions column thumbnail"
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Permanent settled cards for loop posts that landed here */}
                  {settledLoopPosts
                    .filter(p => p.targetSection === "promo")
                    .map(p => (
                      <div key={p.id} className="aspect-square relative">
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
                    ))
                  }

                  {/* Flying destination for loop → promo */}
                  {loopFlying && activeLoop?.targetSection === "promo" && (
                    <div className="aspect-square relative">
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
                  )}

                </div>

                {/* ── D. EVENTS COLUMN ───────────────────────────────────
                    Receives: ls6 (main anim) + loop1 */}
                <div className="flex flex-col gap-2">

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: uiVisible ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
                    className="font-instrument text-black-axis text-[10px] font-semibold uppercase tracking-wider"
                  >
                    Events
                  </motion.p>

                  {/* ls6 thumbnail — flies in from strip at step 2.
                      No overflow-hidden on the outer div (OVERFLOW CLIPPING RULE). */}
                  <div className="aspect-square relative">
                    <AnimatePresence>
                      {step >= 2 && (
                        <motion.div
                          layoutId="ls6"
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.3 }}
                        >
                          <Image
                            src="/livesync_visual/img6.png"
                            alt="Workshop Saturday Instagram post — events column thumbnail"
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Permanent settled cards for loop posts that landed here */}
                  {settledLoopPosts
                    .filter(p => p.targetSection === "events")
                    .map(p => (
                      <div key={p.id} className="aspect-square relative">
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
                    ))
                  }

                  {/* Flying destination for loop → events */}
                  {loopFlying && activeLoop?.targetSection === "events" && (
                    <div className="aspect-square relative">
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
                  )}

                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
