Build a **Guided Interactive Demo section** for a portfolio page using an existing boxing studio website.

The goal is to transform a real website into a **step-by-step product demo that highlights revenue-generating features**.

This is NOT a static showcase. It must feel like:
👉 “I am experiencing the product”

---

# 1. Start

Read CLAUDE.md first. Then read:
- @skills/component.md
- @skills/animate-section.md
- @skills/seo.md

Do not write any code yet.
Confirm you have read all four files and summarize:
1. Which rules apply to every component
2. What you must never do

# 2. Build

Build: Build the interactive component that showcases a client's website. you could call it `OverhandzSection.tsx` for example or choose another name if you dont find it suitable. it should be in the `/gallery`route and accessible when the user clicks the relevant link in the header section `components/sections/HeaderSection.tsx`. access the website's content in `prompts/overhandz/`.

Content: Read @prompts/portfolio.md for exact instructions.


Rules:
- Follow exactly the rules stated in CLAUDE.md, component.md, animate-section.md, SEO.md. 
- Use the setup specified in this file . If there are contradictions between both guidelines, ask me first and let me specify what I need.
- If anything is unclear to you, ask me first and let me clarify things for you 
before building anything.
- Only apply the changes specified in this file. do not change anything else.

Technical rules:
- create a `public/portfolio/overhandz` folder in which i will add the relevant instagram posts

---

# 3. Create File: `components/sections/OverhandzDashboardsSection.tsx`

## GOAL

Build a section that reveals the **internal operating system of the boxing club**.

This must feel like:
→ **real software the gym actually uses daily**

NOT a concept. NOT a design shot.

## Where to add

- This section belings after `components/sections/OverhandzFeatures.tsx` imported into `app/our-work/page.tsx` 

---

## FILE STRUCTURE

Create:

```
components/sections/OverhandzDashboardsSection.tsx
components/dashboards/
```

Inside dashboards:

```
ClientDashboard.tsx
ScheduleDashboard.tsx
BookingsDashboard.tsx
RevenueDashboard.tsx
MembershipDashboard.tsx
PaymentsDashboard.tsx
AttendanceDashboard.tsx
CoachDashboard.tsx
MessagingDashboard.tsx
InstagramAutomationDashboard.tsx
```

---

## IMPORT STRATEGY (IMPORTANT)

* Use **dynamic imports**
* Only render active dashboard

Example pattern:

```ts
const ClientDashboard = dynamic(() => import('@/components/dashboards/ClientDashboard'))
```

* No preloading all dashboards

---

## SECTION LAYOUT (PIXEL SPECIFIC)


## DESKTOP NAVIGATION (KEEP PILLS)

TOP NAV (PILLS)
Height: 44px
Padding: px-16
Gap: gap-8
Horizontal scroll enabled
Snap scroll
PILL STYLE
Background: #111
Border: 1px solid #222
Text: text-gray-400
Font: text-sm
Radius: rounded-full px-14 py-6

ACTIVE PILL:

Border: #fff
Text: #fff
Background: #1a1a1a

HOVER:

Slight brighten (bg-[#1a1a1a])

### Layout

* Horizontal row
* Centered or left-aligned
* No wrap (single line)

### Style

* Height: `44px`
* `px-14 py-6`
* `rounded-full`
* Background: `#111`
* Border: `#222`

### Active

* Border: `#fff`
* Text: white
* Background: `#1a1a1a`

### Behavior

* Click → switch dashboard
* Smooth animated transition (already defined)

---

# MOBILE NAVIGATION (DO NOT USE FULL PILLS)

Instead use:

## **Horizontal Scroll Chips (with snap)**

This is critical for usability.

---

## MOBILE LAYOUT

* Container: full width
* Overflow-x: auto
* Snap: `snap-x snap-mandatory`
* Gap: `gap-8`
* Padding: `px-12`

---

## CHIP STYLE (MOBILE)

* Smaller than desktop pills
* `px-12 py-5`
* `rounded-full`
* Font: `text-xs`

### Default

* Background: `#111`
* Text: `#888`
* Border: `#222`

### Active

* Background: `#1a1a1a`
* Text: `#fff`
* Border: `#fff`

---

## SNAP BEHAVIOR

Each chip:

* `snap-start`

### Important detail:

* Show **partial next chip** on the right

→ This visually tells the user: “you can scroll”

---

## INTERACTION

* Swipe horizontally
* Tap to switch dashboard
* Auto-scroll active chip into view

---

## CONTENT BELOW (MOBILE)

Switch from 2-column → stacked:

### Order:

1. Text
2. Dashboard UI

---

## DASHBOARD ADAPTATION (CRITICAL)

Desktop side panels → mobile full-screen modal

Example:

* Client click:

  * Desktop → right panel
  * Mobile → full screen overlay

---

## ANIMATION (MOBILE)

* Slightly faster than desktop

Content:

* Fade: 120ms
* Slide up: 10px → 0

---

## OPTIONAL (HIGH-END DETAIL)

Add subtle gradient fade on edges of scroll:

* Left/right fade mask
  → improves perceived smoothness

---

# WHY THIS WORKS

Desktop:
→ precision + clarity → pills are perfect

Mobile:
→ thumb-driven + limited space
→ chips with scroll feel natural


---

## CONTENT LAYOUT

Grid:

```
grid-cols-2 gap-32
```

Left:

* max-width: 420px

Right:

* dashboard container

---

## ANIMATION

On pill click:

* Content fade out: 150ms
* New content:

  * opacity 0 → 1
  * translateY: 10px → 0
  * duration: 220ms
* Dashboard scale: `0.98 → 1`

---

## DASHBOARD CONTAINER

* Background: `#0c0c0c`
* Border: `1px solid #1f1f1f`
* Radius: `rounded-2xl`
* Padding: `p-16`
* Inner grid spacing: `gap-12`

---

# DASHBOARDS (PIXEL PERFECT)

---

## 1. ClientDashboard.tsx

### LAYOUT

Top bar:

* Search input (left)
* Filter dropdown (right: Active / Inactive)

Table:

Columns:

* Name
* Membership
* Status (green/red dot)
* Last Visit
* Actions (•••)

Row height: 48px
Divider: `border-b border-[#1a1a1a]`

---

### INTERACTION

Click row:
→ Right side panel slides in (width 320px)

Panel content:

* Name + avatar
* Membership
* Attendance history (list)
* Payments list

---

### CTA

Top right:

* “+ Add Client” button

Click:
→ Modal opens (name, email, plan)

---

## 2. ScheduleDashboard.tsx

### LAYOUT

Top:

* Week switcher (← →)
* Filters: Coach / Class Type

Main:

* 7-column grid (Mon–Sun)
* Time rows (6:00 → 22:00)

Class blocks:

* Background: `#1a1a1a`
* Small text
* Rounded

---

### INTERACTION

Click class:
→ Edit modal:

* Time
* Coach
* Capacity

Drag NOT needed (keep simple)

---

### CTA

Top right:

* “+ Create Class”

---

---

## 3. BookingsDashboard.tsx

### LAYOUT

Left:

* Class list

Right:

* Selected class bookings

Booking row:

* Name
* Status badge:

  * Confirmed → green
  * Waitlist → yellow
  * Cancelled → red

---

### INTERACTION

Buttons per row:

* Confirm
* Move to waitlist
* Remove

---

---

## 4. RevenueDashboard.tsx

### LAYOUT

Top cards (3):

* Revenue (big number)
* Active Members
* Fill Rate %

Below:

Chart (simple line or bars)

Bottom:

* Revenue breakdown list

---

### INTERACTION

Top filter:

* Last 7 days / 30 days / 90 days

---

---

## 5. MembershipDashboard.tsx

### LAYOUT

Cards:

* Unlimited
* 10-Class Pack
* Drop-in

Each card:

* Price
* Members count
* Status

---

### INTERACTION

Click card:
→ Edit panel

Top CTA:

* “+ New Plan”

---

---

## 6. PaymentsDashboard.tsx

### LAYOUT

Table:

Columns:

* User
* Amount
* Type
* Status
* Date

---

### INTERACTION

Click row:
→ Payment details panel

Button:

* Refund

---

---

## 7. AttendanceDashboard.tsx

### LAYOUT

Class selector (top)

List:

* Attendees

Each row:

* Name
* Toggle (present / absent)

---

### INTERACTION

* Toggle switches
* “Mark all present” button

---

---

## 8. CoachDashboard.tsx

### LAYOUT

Grid of coach cards

Each card:

* Name
* Classes assigned
* Weekly hours

---

### INTERACTION

Click:
→ Assign classes modal

---

---

## 9. MessagingDashboard.tsx

### LAYOUT

Left:

* Conversations

Right:

* Chat view

Top:

* Templates dropdown

---

### INTERACTION

* Send message
* Select template → auto-fill
* “Send to class” button

---

---

## 10. InstagramAutomationDashboard.tsx

### LAYOUT

Grid:

* IG posts (cards) (use `prompts/overhandz/public` to find the according posts)

Each card:

* Image
* Caption snippet
* Tag dropdown:

  * Event
  * Offer
  * Merch

---

### INTERACTION

* Select tag
* “Publish to site” button

---

---

# LEFT TEXT CONTENT (FOR EACH PILL)

Use same style as previous section:

* Small label (uppercase, gray)
* Headline (white)
* Paragraph (gray)

---

# MOBILE

* Pills scroll horizontally
* Dashboard becomes stacked
* No side panels → use full screen modal instead

---

# DESIGN RULES (STRICT)

DO:

* Dense UI
* Small text
* Functional spacing
* Real buttons everywhere

DON’T:

* No fake gradients
* No floating cards
* No “startup landing page” style

---

# FINAL FEEL

This must communicate:

→ This boxing club runs on a **complete internal system**
→ Bookings, revenue, clients, content — all connected

---

# IMPORTANT

Do NOT simplify.

This should feel like:

* Stripe dashboard
* Notion backend
* Mindbody-style system

But visually aligned with **Overhandz dark, raw, minimal aesthetic**

---

