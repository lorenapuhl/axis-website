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
- Use the setup specified in @prompts/portfolio.md . If there are contradictions between both guidelines, ask me first and let me specify what I need.
- If anything is unclear to you, ask me first and let me clarify things for you 
before building anything.
- Only apply the changes specified in @prompts/portfolio.md . do not change anything else.

Technical rules:
- create a `public/portfolio/overhandz` folder in which i will add the relevant instagram posts

---

## CORE CONCEPT

We are turning the website into a:

**Guided Demo System**

* The user scrolls or clicks
* Key sections are highlighted
* Short, sharp annotations explain business impact
* Each step focuses on **conversion or revenue**

---

## LAYOUT STRUCTURE

### CONTAINER

* Centered
* Max-width ~420px (mobile-first)
* Styled like a phone or app viewport
* Rounded corners, shadow
* Dark UI (match existing design)

---

### TOP BAR

Fake browser/app chrome:

* “overhandzclub.com”
* Green dot: “Live demo”
* Optional: “Interactive walkthrough”

---

## DEMO FLOW (STEP-BY-STEP)

Each step:

* Scrolls to a real section OR swaps component
* Highlights area
* Shows annotation card

---

### STEP 1 — HERO (FIRST IMPRESSION)

Scroll to hero section (“Train. Fight. Belong.”)

Highlight:

* Headline
* CTA button

Annotation:

Title:
**“Clear positioning converts visitors”**

Text:
“Visitors instantly understand what the studio offers and who it’s for.”

---

### STEP 2 — SOCIAL PROOF / COMMUNITY

Scroll to image section (group photo)

Highlight:

* Image block

Annotation:

**“Strong visuals from your Instagram build trust fast”**

---

### STEP 3 — INSTAGRAM FEED (CRITICAL FEATURE)

Scroll to:
**Overhandzclub / Instagram section**

Highlight:

* Post grid

---

#### Annotation:

Title:
**“Your Instagram becomes your website automatically”**

Text:
“Every post updates the site and can drive bookings or sales.”

---

### STEP 4 — SCHEDULE (CORE CONVERSION)

Scroll to schedule section

Highlight:

* Time slots
* Day filters

---

#### INTERACTION:

User clicks a class:

* Show booking modal

---

#### Annotation:

**“Clients book instantly — no messages needed”**

---

### STEP 5 — PRICING (REVENUE DRIVER)

Scroll to pricing cards (€450 / €350 / €280 / €250)

Highlight:

* Entire pricing block

---

#### INTERACTION:

Hover or click:

* Emphasize selected plan
* Show CTA

---

#### Annotation:

**“Packages generate upfront revenue”**

---

### STEP 6 — EVENTS (ENGAGEMENT)

Scroll to events section

Highlight:

* Event cards

---

#### INTERACTION:

Click event:

* Expand details
* CTA: “Join event”

---

#### Annotation:

**“Promote events without extra tools”**

---

### STEP 7 — MERCH (MONETIZATION)

Scroll to merch section

Highlight:

* Product cards with their according CTA's

---

#### INTERACTION:

Click product:

* Open mini product view from the linked shop when the user clicks the CTA

---

#### Annotation:

**“Sell products directly from your content”**

---

## ANNOTATION SYSTEM (IMPORTANT)

Each annotation should be:

* Floating card
* Positioned near highlighted element
* Small, clean, high-contrast

Structure:

* Title (bold)
* 1 short sentence
* Optional arrow pointing to UI

---

## INTERACTION LOGIC

Provide two modes:

### 1. AUTO PLAY

* Smooth scroll between sections
* dots below to show which section the viewer is currently viewing
---

## VISUAL HIGHLIGHTING

When a section is active:

* Dim background slightly
* Add glow or border around focus area
* Smooth transitions

---

## INSTAGRAM SIMULATION (IMPORTANT)

Do NOT embed real Instagram.

Instead:

* Use same content like in the website from `prompts/overhandz/public`
* Recreate feed UI
* Add CTA overlays

Purpose:

* Faster
* Controlled
* Conversion-focused

---

## TECH IMPLEMENTATION (NEXT.JS)

* Reuse real components:

  * Schedule
  * Pricing
  * Merch
  * Events
  * Instagram feed

* Wrap them in a Demo system:

Create:

`<DemoStep>`
`<DemoOverlay>`
`<HighlightBox>`

---

## UX GOAL

User should feel:

* “This is exactly what my studio needs”
* “This replaces everything I currently do manually”
* “This will make me more money”

---

## FINAL CTA BELOW DEMO

“Get this system for your studio”
-> connect the CTA to the general CTA-flow from `components/cta`
---


