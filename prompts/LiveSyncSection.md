# LiveSyncSection

Build a React component called `LiveSyncSection` that visually demonstrates how Instagram posts automatically update a structured website in real time.

---

## SECTION GOAL

Communicate clearly:

**"Your Instagram updates your website automatically — instantly and continuously."**

This is not decorative.
It must feel like a **live SaaS system demo**.

---

## LAYOUT

* Full width section
* Max width: 1440px
* Centered
* Height: 100vh (min 900px)
* Background: #000
* Padding: 80px

---

## HEADER (TOP CENTER)

Centered, max-width 600px

Headline:
"Your studio changes daily
Your website updates automatically"
- className="font-instrument tracking-tight text-white-axis text-3xl leading-tight"

Subtext:
"Schedule changes, announcements, promotions — always in sync."
- className="font-instrument tracking-tight text-white-axis text-2xl leading-tight"

---

## GRID

* grid-cols-2
* gap: 160px

LEFT: Instagram feed
RIGHT: Website system

---

# 📱 LEFT SIDE — INSTAGRAM FEED

Container:

* Width: 440px
* Background: #0a0a0a
* Border: 1px solid #1a1a1a
* Border radius: 16px
* Padding: 16px

Top label (absolute):
"Live Instagram"

---

## INSTAGRAM HEADER

* Avatar (32px)
* Name: Sports Studio
* Handle: @sports.studio

---

## INSTAGRAM GRID

* 3 columns
* gap: 6px
* 9–12 posts

Each post:

* Rounded: 8px
* Overflow hidden
* Hover: scale 1.03

---

## POST CONTENT (IMPORTANT)

Images will be provided later in @public/livesync_visual
Each post must include overlay text (simulate real IG graphics):

img1 → "Class canceled today"
img2 → "New: HIIT 07:00"
img3 → "Spring Sale -20%"
img4 → "Welcome Coach Alex"
img5 → "Weekend schedule change"
img6 → "Workshop Saturday"

Each post also shows:

SMALL TIMESTAMP (bottom-left overlay):

* "Posted 2 min ago"
* "Posted 5 min ago"
* etc.

Use muted white text (text-xs, opacity 70%)

---

# RIGHT SIDE — WEBSITE (AUTO-STRUCTURED)

Container:

* Width: 500px
* Background: white
* Border radius: 16px
* Padding: 24px
* Initial opacity: 0.2

Top label:
"Auto-updating website"

Top-right corner:

* Small green dot + "Live"
* Dot should pulse subtly

---

## WEBSITE STRUCTURE

---

### A. NOTICE BAR

Small strip at top:

"⚠️ Today: Morning Flow canceled"

---

### B. SECTIONS (STACKED)

Spacing: mt-20px

---

#### 1. SCHEDULE UPDATES

Card:

* "New: HIIT 07:00 added"
* "Weekend schedule adjusted"

---

#### 2. PROMOTIONS

Card:

* "Spring Sale — 20% off memberships"

---

#### 3. NEWS

* "Welcome our new coach: Alex"

---

#### 4. EVENTS

* "Breathwork Workshop — Saturday"

---

Each section:

* Soft border (#eee)
* Rounded 12px
* Padding 12–16px

---

## ANIMATION SEQUENCE

Use `useInView` (trigger at 30%)

---

## STEP 0 — INITIAL

* Instagram fully visible
* Website opacity: 0.2
* Website empty placeholders

---

## STEP 1 — HIGHLIGHT POSTS (0.3s)

Highlight img1–img6:

* scale: 1.05
* brightness: slight increase

---

## STEP 2 — TRANSFORMATION FLOW (0.6s–1.0s)

Posts move individually into website:

img1 → Notice bar
img2 → Schedule
img3 → Promotions
img4 → News
img5 → Notice (secondary)
img6 → Events

Animation:

* Smooth translate from left → right
* Duration: 0.7s
* easeInOut
* No bounce

---

## STEP 3 — SNAP INTO STRUCTURE (1.0s)

* Content locks into clean layout
* Website opacity → 1
* translateY: 10px → 0

---

## STEP 4 — AUTO-REFRESH EFFECT (CRITICAL)

After initial animation completes:

Simulate a NEW Instagram post appearing (img10)

---

### NEW POST BEHAVIOR

* New post slides into top-left of Instagram grid (img11), (img12)
* Existing posts shift slightly

New post content:
"New class added: Boxing 19:00"

Timestamp:
"Posted just now"

---

### AUTO-SYNC ANIMATION

Immediately after appearing:

* That new post animates to website
* Moves into "Schedule Updates"

Replace or prepend content:

"New: Martial Arts 19:00 added"

---

### TIMING

* Delay: ~1.2s after initial animation
* Movement duration: 0.6s

---

## STEP 5 — CONTINUOUS LOOP (IMPORTANT)

Implement a lightweight loop (only if performant):

Every 5–7 seconds:

1. Add new IG post (top-left)
2. Animate it into website
3. Update corresponding section

Limit:

* Max 2–3 loop iterations
* Then stop (avoid infinite heavy rendering)

---

## PERFORMANCE RULES

* Use `useState` + `setTimeout` or `setInterval`
* Clean up intervals on unmount
* Avoid re-rendering entire grid
* Animate only affected elements

---

# MICRO INTERACTIONS

* IG hover → scale 1.03
* Cards hover → subtle shadow
* Buttons (if any) → scale 1.02
* "Live" dot → pulse (opacity animation)

---

# DESIGN RULES

* Minimal, clean
* No bright colors
* Strong contrast:
  chaotic IG vs structured system

---

# FINAL UX MESSAGE

User must instantly understand:

"My website stays updated automatically whenever I post on Instagram."

---

# OPTIONAL IMPROVEMENTS (IF EASY)

* Subtle blur → sharpen effect when content lands

---

# DO NOT

* Do not simplify animation
* Do not remove mapping between posts and sections
* Do not over-animate

---

# EXPECTED RESULT

A clean, high-end SaaS-style product demo section that:

* Shows real-time syncing
* Feels alive
* Reinforces zero maintenance
* Visually explains the system without needing text

