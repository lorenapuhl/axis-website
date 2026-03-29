You are redesigning an existing CardStack component @sections/ui/card-stack.tsx to represent **operational chaos and lost bookings** for fitness studios.

This is NOT a clean product showcase.
This section must feel like: **real, messy, slightly stressful day-to-day operations inside a studio**.

Rule: Adapt @sections/ui/card-stack.tsx to the guidelines below and make sure to respect the descriptions in @skills/21st-dev.md

---

## 🎯 GOAL

Visually communicate:

"Studios get attention on Instagram, but lose bookings due to chaos, manual work, and lack of structure."

The component should feel:

* slightly overwhelming
* imperfect
* real
* dynamic
* not polished like a product demo

---

## 🧱 LAYOUT

Keep the existing CardStack structure, BUT modify:

* Increase overlap slightly → `overlap: 0.6–0.7`
* Increase spread → `spreadDeg: 60–70`
* Add slight randomness to positioning:

  * small rotation offsets per card (±2–4 degrees)
  * slight Y jitter (±5–10px)

Cards should NOT feel perfectly aligned.

---

## 🎨 VISUAL STYLE (CRITICAL)

Replace clean SaaS visuals with **real UI fragments**:
Use the design in @components/sections/FeatureSection.tsx as a template for the ui designs to ensure visual coherence over the entire landing page.

Each card must look like a **screenshot moment**, not a designed card.

Use:

* Instagram DM UI
* chat bubbles
* iPhone UI
* Google search results
* notification badges

Add realism:

* timestamps (e.g. “2:14 PM”)
* typing indicators (“…”)
* “Seen” labels
* message stacking
* slight blur / grain overlay
* imperfect cropping

DO NOT use:

* stock photos
* generic illustrations
* perfect gradients

---

## 🎴 CARD CONTENT (EXACT SPEC)

Replace the existing `items` array with:

```ts
const items = [
  {
    id: 1,
    title: "+47 DMs today",
    description: "Clients asking for schedule, prices, availability",
    tag: "DM overload",
    imageSrc: "/images/dm-overload.png",
  },
  {
    id: 2,
    title: "Where do I book?",
    description: "Visitors don’t find a clear next step",
    tag: "No structure",
    imageSrc: "/images/ig-confusion.png",
  },
  {
    id: 3,
    title: "Seen • no reply",
    description: "Conversations drop off before booking",
    tag: "Lost clients",
    imageSrc: "/images/dm-dropoff.png",
  },
  {
    id: 4,
    title: "Pilates near me",
    description: "Your studio doesn’t show up",
    tag: "No Google presence",
    imageSrc: "/images/google-missing.png",
  },
  
    {
    id: 5,
    title: "“Check our Story highlights”",
    description: "Making clients hunt through 40 highlights just to find a price list.",
    tag: "Bad UX",
    imageSrc: "/images/info-hunting.png",
  },

  {
    id: 6,
    title: "Everything is manual",
    description: "DMs, notes, calendar, payments",
    tag: "No system",
    imageSrc: "/images/system-chaos.png",
  },

];
```

---

## 🖼 IMAGE DESIGN (VERY IMPORTANT)

Each image should be designed like this:

### 1. DM OVERLOAD

* Instagram DM screen
* Multiple unread messages
* Messages like:

  * “hey what time is class?”
  * “price?”
  * “is there space tomorrow?”
* Show typing indicator
* Slight blur on edges

---

### 2. INSTAGRAM CONFUSION

* Instagram profile page
* Cursor hovering bio/highlights
* No clear CTA
* Small overlay text: “Where do I book?”

---

### 3. DROP-OFF

* Chat conversation
* Last message:

  * user: “ok thanks”
* Label: “Seen”
* Then empty space

---

### 4. GOOGLE MISSING

* Google search: “pilates near me”
* Competitors listed
* Your studio absent OR “No results”

---

### 5. INFO HUNTING (NEW — VERY IMPORTANT)

This should feel frustrating.

Instagram profile open
highlight circles visible (many: 15–40)
labels like:
“prices”
“info”
“more”
“schedule??”
user tapping multiple highlights (simulate with sequence or layered frames)
no clear answer

Optional overlay text:

“Check our Story highlights”

Make it feel:
→ disorganized
→ time-consuming
→ unclear

### 6. SYSTEM CHAOS

* Collage:

  * WhatsApp
  * Notes app
  * Calendar
  * DMs
* Slight overlap
* Messy layout

---

## 🎬 ANIMATION CHANGES

Keep framer-motion, BUT adjust behavior:

### 1. Add subtle “instability”

* Cards should slightly drift (very slow random motion)
* Use small oscillating transforms:

  * rotateZ: ±1deg over time
  * y: ±3px floating

---

### 2. Auto-advance behavior

Keep:

```ts
autoAdvance: true
intervalMs: 2200–2600
```

But:

* add slight variation (random delay ±300ms)

Goal:
→ feels organic, not robotic

---

### 3. Active card emphasis

When active:

* slightly stronger scale: `1.06`
* slightly darker background overlay behind stack
* subtle pulse (opacity or scale)

---

### 4. Background chaos layer

Add behind cards:

* floating blurred elements:

  * notification badges
  * message bubbles
* very low opacity (5–10%)
* slow movement

---

## 🧠 TEXT OVERLAY ON CARDS

Modify DefaultFanCard:

* Add small top-left tag (e.g. “DM overload”)
* Add slight glitch/opacity flicker on description (very subtle)

---

## 🧩 FINAL SECTION STRUCTURE


Below component:

Centered text:
"Your studio has visibility — but no structure."

Small subline:
"And visibility doesn’t scale."

---

## 🚨 IMPORTANT DESIGN PRINCIPLE

This must feel like:

* reality
* friction
* inefficiency

NOT:

* a product showcase
* a clean UI demo

If it looks too perfect → it is wrong.

---

## 🎯 FINAL CHECK

The user should feel:
"this is exactly my current situation"

—not—

"this is a cool animation"

---

