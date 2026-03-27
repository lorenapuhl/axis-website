Here is the complete rewritten Claude Code prompt with all dynamic effects added:

---

## Claude Code Prompt

**File to modify:** `LiveSyncSection.tsx`

---

### TASK OVERVIEW

Redesign the **bottom "Auto-updating website" panel** of `LiveSyncSection.tsx` into a rich, multi-panel dashboard UI with live-simulated dynamic state. Keep all existing animation logic, state, and `layoutId`-based flying image transitions **exactly as-is**. Only restructure the JSX inside the `<motion.div className="bg-white-axis rounded-2xl p-6">`. Also remove the Instagram strip scrollbar.

---

### PERFORMANCE RULES — READ FIRST

All dynamic effects must follow these constraints to keep the site fast:

- Use `requestAnimationFrame` (rAF) only for the wave graph — nowhere else.
- All other intervals use `setInterval` with **minimum 10-second gaps** between state updates.
- All intervals and rAF loops must be cancelled in their `useEffect` cleanup function.
- Never update more than one piece of state per interval tick.
- All animated SVG elements use CSS transitions (`transition` prop on Framer Motion) not spring physics.
- The community feedback generator must reuse a fixed pool of pre-written strings — no AI generation, no random string construction at runtime.
- Every `useEffect` that drives live simulation must have `if (!uiVisible) return` as its first line so nothing runs before the panel is in view.

---

### DESIGN TOKEN RULES — NO EXCEPTIONS

Only these tokens. Never Tailwind default palette (zinc, gray, red, green, etc.):

| Token | Use |
|---|---|
| `bg-black-axis` / `text-black-axis` | Primary dark, buttons, bold text |
| `bg-grey-axis` / `text-grey-axis` | Secondary dark surfaces |
| `bg-white-axis` / `text-white-axis` | Light surfaces, light text on dark |
| `text-soft-grey` | Muted labels, timestamps |
| `bg-blue-axis` / `text-blue-axis` | Accents, live indicators |
| `bg-magenta-axis` / `text-magenta-axis` | Urgency callouts |
| `bg-uv-axis` / `text-uv-axis` | Deep accent, energy graph |

All fonts: `font-instrument` only. Never `font-playfair`.

SVG colors: `stroke="var(--color-blue-axis)"` etc. `scrollbarColor` inline style: `var(--color-soft-grey)` only.

Avatar backgrounds: opacity variants only — `bg-blue-axis/20`, `bg-magenta-axis/20`, `bg-uv-axis/20`, `bg-soft-grey/20`.

---

### STEP 1 — Instagram strip scrollbar removal

On `<div className="flex gap-[6px] overflow-x-auto pb-2">`, change to:
```
className="flex gap-[6px] overflow-x-hidden"
```

---

### STEP 2 — New state variables

Add these `useState` declarations inside the component, after the existing state block. Each drives one live-simulated widget:

```ts
// Studio Capacity: starts at 75, increments to 82 over ~70s (one tick every 10s)
const [capacity, setCapacity] = useState(75)

// Countdown: starts at 14, decrements every 30s
const [minutesLeft, setMinutesLeft] = useState(14)

// Spots taken: starts at 28, increments to 30 over ~40s (one tick every 20s)
const [spotsTaken, setSpotsTaken] = useState(28)

// Community feedback: starts with seed comments, new ones prepended every 12s
const [feedItems, setFeedItems] = useState(FEEDBACK)  // FEEDBACK defined below

// Wave graph offset: animates slowly rightward to simulate time passing
const [waveOffset, setWaveOffset] = useState(0)
const waveRafRef = useRef<number>(0)
```

---

### STEP 3 — Static data (add near BASE\_POSTS, outside the component)

```ts
// Seed feedback — rendered on first paint, then new items prepend over time
const FEEDBACK: FeedbackItem[] = [
  { id: "f1", handle: "@SarahMoves", quote: "That 9 AM class changed my day's energy! (Jiu-Jitsu)", likes: 12, time: "3 mins ago", avatar: "bg-blue-axis/20" },
  { id: "f2", handle: "@CoachMike", quote: "Best Saturday bootcamp yet. See you next week!", likes: 24, time: "15 mins ago", avatar: "bg-magenta-axis/20" },
  { id: "f3", handle: "@FitnessFan99", quote: "The spring promo got me — signed up for 3 months!", likes: 8, time: "1 hr ago", avatar: "bg-uv-axis/20" },
  { id: "f4", handle: "@YogaQueen", quote: "Open mat was incredible — instructor was top tier.", likes: 31, time: "2 hrs ago", avatar: "bg-soft-grey/20" },
]

// Pool of incoming comments that get prepended over time — fixed array, no runtime generation
const INCOMING_COMMENTS: FeedbackItem[] = [
  { id: "inc1", handle: "@RunnerJay", quote: "Just booked my spot for open mat — cannot wait!", likes: 5, time: "just now", avatar: "bg-blue-axis/20" },
  { id: "inc2", handle: "@BoxingBella", quote: "The HIIT at 7AM is a different level. Highly recommend.", likes: 9, time: "just now", avatar: "bg-magenta-axis/20" },
  { id: "inc3", handle: "@StudioReg", quote: "Shoutout to the evening class — always packed with energy.", likes: 17, time: "just now", avatar: "bg-uv-axis/20" },
]

// TypeScript interface for feedback items
interface FeedbackItem {
  id: string
  handle: string
  quote: string
  likes: number
  time: string
  avatar: string
}
```

---

### STEP 4 — Live simulation `useEffect` hooks

Add these four effects inside the component, after the existing loop effect. Each must guard with `if (!uiVisible) return` at the top.

#### Effect A — Studio capacity creep (every 10s, caps at 82)
```ts
useEffect(() => {
  if (!uiVisible) return
  const id = setInterval(() => {
    setCapacity(prev => prev < 82 ? prev + 1 : prev)
  }, 10000)
  return () => clearInterval(id)
}, [uiVisible])
```

#### Effect B — Countdown timer (every 30s, floors at 0)
```ts
useEffect(() => {
  if (!uiVisible) return
  const id = setInterval(() => {
    setMinutesLeft(prev => prev > 0 ? prev - 1 : 0)
  }, 30000)
  return () => clearInterval(id)
}, [uiVisible])
```

#### Effect C — Spots taken (every 20s, caps at 30)
```ts
useEffect(() => {
  if (!uiVisible) return
  const id = setInterval(() => {
    setSpotsTaken(prev => prev < 30 ? prev + 1 : prev)
  }, 20000)
  return () => clearInterval(id)
}, [uiVisible])
```

#### Effect D — Incoming comments (every 12s, cycles through INCOMING\_COMMENTS pool)
```ts
useEffect(() => {
  if (!uiVisible) return
  let index = 0
  const id = setInterval(() => {
    const next = { ...INCOMING_COMMENTS[index % INCOMING_COMMENTS.length], id: `inc-live-${index}` }
    setFeedItems(prev => [next, ...prev].slice(0, 8))  // cap at 8 to prevent memory growth
    index++
  }, 12000)
  return () => clearInterval(id)
}, [uiVisible])
```

#### Effect E — Wave graph rAF drift (very slow — 0.004px per frame ≈ imperceptibly slow scroll)
```ts
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
```

---

### STEP 5 — Derived values (add after the existing derived state block)

```ts
// Capacity: convert % to SVG stroke-dashoffset
// Full circumference for r=26: 2π×26 ≈ 163.4
// dashoffset = circumference × (1 - capacity/100)
const capacityOffset = 163.4 * (1 - capacity / 100)

// Countdown ring: dashoffset = circumference × (minutesLeft / 60)
const countdownOffset = 163.4 * (minutesLeft / 60)

// Spots left derived from spotsTaken
const spotsLeft = 30 - spotsTaken

// Urgency label derived from spotsLeft
const urgencyLabel = spotsLeft <= 0
  ? "CLASS FULL"
  : spotsLeft === 1
  ? "ONLY 1 SPOT LEFT"
  : `ONLY ${spotsLeft} SPOTS LEFT`
```

---

### STEP 6 — Replace the website panel content

Replace **everything inside** the `<motion.div className="bg-white-axis rounded-2xl p-6">` with the JSX below. Keep the `motion.div` wrapper unchanged except add `relative` to its className.

---

#### Live indicator (absolute top-right):
```jsx
<div className="absolute top-4 right-4 flex items-center gap-1.5">
  <motion.div
    animate={{ opacity: [1, 0.25, 1] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className="w-2 h-2 rounded-full bg-blue-axis"
  />
  <p className="font-instrument text-black-axis text-xs font-semibold">Live</p>
</div>
```

---

#### Main 2-column grid:
```jsx
<div className="grid gap-6" style={{ gridTemplateColumns: "30% 1fr" }}>
```

---

#### LEFT COLUMN — Update Feed

Keep all existing rows A–D JSX. For each row, add title + timestamp above the thumbnail strip, and wrap each thumbnail slot with a hover scale:

```jsx
{/* Row header pattern — repeat for each row with its own title + timestamp string */}
<div className="flex items-baseline justify-between mb-1">
  <p className="font-instrument text-[11px] font-bold text-black-axis uppercase tracking-wider">
    SCHEDULE UPDATES
  </p>
  <p className="font-instrument text-[9px] text-soft-grey">Updated Today, 8:00 AM</p>
</div>

{/* Wrap each existing <div className="w-16 h-16 relative shrink-0"> like this: */}
<motion.div
  style={{ position: "relative", zIndex: 1 }}
  whileHover={{ scale: 1.25, zIndex: 10 }}
  transition={{ duration: 0.2 }}
>
  <div className="w-16 h-16 relative shrink-0">
    {/* existing AnimatePresence / layoutId content unchanged */}
  </div>
</motion.div>
```

Titles and timestamps for each row:
- Row A: `SCHEDULE UPDATES` / `"Updated Today, 8:00 AM"`
- Row B: `NEWS` / `"Updated: 2 mins ago"`
- Row C: `PROMOTIONS` / `"Updated Today, 11:30 AM"`
- Row D: `EVENTS` / `"New: Summer Slam Info added"`

---

#### RIGHT COLUMN — NEXT UP Spotlight

```jsx
<div className="p-4 bg-black-axis rounded-xl flex flex-col gap-3">
  <p className="font-instrument text-[10px] font-bold text-soft-grey uppercase tracking-widest">
    NEXT UP: JIU-JITSU OPEN MAT (8:00 AM)
  </p>

  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.2 }}
    className="relative w-full h-32 rounded-xl overflow-hidden"
  >
    <Image src="/livesync_visual/img10.png" alt="Jiu-Jitsu Open Mat" fill className="object-cover" />
  </motion.div>

  <div className="flex flex-col gap-1.5">

    {/* Countdown — reads from minutesLeft state */}
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

    {/* Progress bar — reads from spotsTaken state */}
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

    {/* Urgency callout — derived from spotsLeft */}
    <motion.p
      key={urgencyLabel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="font-instrument text-xs font-bold text-magenta-axis bg-magenta-axis/10 rounded-lg px-2 py-1 text-center uppercase tracking-wider"
    >
      {urgencyLabel}
    </motion.p>

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
```

---

#### BOTTOM ROW — grid-cols-2

```jsx
<div className="grid grid-cols-2 gap-4">
```

---

#### Studio Vitals panel:

```jsx
<div className="p-4 bg-grey-axis rounded-xl flex flex-col gap-3">
  <h3 className="font-instrument text-[10px] font-bold uppercase tracking-widest text-white-axis">
    LIVE STUDIO VITALS
  </h3>

  <div className="grid grid-cols-2 gap-3">

    {/* Capacity gauge — reads capacityOffset */}
    <div className="flex flex-col items-center gap-1">
      <p className="font-instrument text-[9px] text-soft-grey uppercase tracking-wider">Capacity</p>
      <svg viewBox="0 0 64 64" width="56" height="56">
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
          fill="var(--color-white-axis)" fontFamily="var(--font-instrument)">
          {capacity}% FULL
        </text>
      </svg>
    </div>

    {/* Countdown ring — reads countdownOffset */}
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

    {/* Wave graph — col-span-2, reads waveOffset */}
    <div className="col-span-2 flex flex-col gap-1">
      <p className="font-instrument text-[9px] text-soft-grey uppercase tracking-wider">Studio Energy Flow</p>
      <svg viewBox="0 0 120 40" width="100%" height="40" style={{ overflow: "hidden" }}>
        <defs>
          <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-uv-axis)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-uv-axis)" stopOpacity="0" />
          </linearGradient>
          {/* clipPath prevents the drifting wave from overflowing the SVG bounds */}
          <clipPath id="waveClip">
            <rect x="0" y="0" width="120" height="40" />
          </clipPath>
        </defs>
        <g clipPath="url(#waveClip)" transform={`translate(${-waveOffset % 120}, 0)`}>
          {/* Render the wave path twice side-by-side so the clip never shows a gap */}
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
        {[["2", "7AM"], ["40", "12PM"], ["78", "5PM"], ["108", "10PM"]].map(([x, label]) => (
          <text key={label} x={x} y="39" fontSize="5"
            fill="var(--color-soft-grey)" fontFamily="var(--font-instrument)">{label}</text>
        ))}
      </svg>
    </div>

    {/* Members in studio */}
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
```

---

#### Community Feedback panel:

```jsx
<div className="p-4 bg-grey-axis rounded-xl flex flex-col gap-2">

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

  {/* Fixed-height scroll container — new comments prepend at top, pushing old ones down */}
  <div
    className="flex flex-col gap-2 overflow-y-scroll"
    style={{ height: "160px", scrollbarWidth: "thin", scrollbarColor: "var(--color-soft-grey) transparent" }}
  >
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
          <div className={`w-6 h-6 rounded-full shrink-0 ${item.avatar}`} />
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="font-instrument text-[9px] font-bold text-soft-grey">{item.handle}</p>
            <p className="font-instrument text-[10px] font-semibold text-white-axis leading-tight">"{item.quote}"</p>
            <p className="font-instrument text-[9px] text-soft-grey">❤️ {item.likes} · {item.time}</p>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>

</div>
```

Note: `layout` on each card tells Framer Motion to animate the position shift smoothly when a new card prepends and pushes existing cards down. `AnimatePresence initial={false}` prevents the seed cards from animating in on first render (only new arrivals animate).

---

### STEP 7 — Constraints summary

- Every `useEffect` that drives live simulation: first line must be `if (!uiVisible) return`.
- Cleanup: every `setInterval` has `clearInterval`, the rAF loop has `cancelAnimationFrame(waveRafRef.current)`.
- Feed array: capped at 8 items with `.slice(0, 8)` so it never grows unbounded.
- SVG text elements: `fontFamily="var(--font-instrument)"` directly on the `<text>` attribute.
- No new npm packages. No external libraries. Uses only Framer Motion (already imported) and React hooks already in use.
- All existing `layoutId`, `AnimatePresence`, `settledLoopPosts`, loop animation code: **zero modifications**.


---------------------------------


This is almost perfect. just make the following changes: change the black backgrounds to light-grey ones. the four lines schedule updates, news , promotions, events (currently 4x1) should become a 2x2 square. it should take 70 % of the upper half of the website the ui. also, when hovering with the mouse over one of the pictures, its hover size increase effect should at least be doubled. thus, when hovering, the images become double as big as the current hover effect. the left and remaining 30 % should be use by the jiu jitsu open mat class section. this, this section becomes narrower. this leaves more vertical space for the live studio details. make this section bigger. give the two circle measure-bars and the graph below a pulsating effect to show that they are dynamic do scroll bars should be visible: the instagram feed still has a horizontal scrollbar and the community section on the website ui also as horizontal and vertical scrollbars. hide all of them. also, when the jiu-jitsu section says class full, make sure that the book button is greyed out and does not have any hover effects anymore. make sure the timer starts at 25/30 spots taken and slowly increases until 30. also, use green for the live button pulsatin light. make sure that the upper right live button sits on top of theh website ui on the same line as "auto-updating" website on the right side. is anything unclear ? if so, ask me first to specify anything before starting to code.
