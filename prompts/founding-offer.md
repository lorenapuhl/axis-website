You are editing an existing SaaS pricing page with a dark, minimal, high-end UI. Maintain the exact visual style, spacing system, typography scale, and component structure. Do NOT redesign — only enhance.

The goal is to introduce a **“Founding Studio Offer (5 spots)”** directly into the pricing section to increase conversions, without making the product feel unfinished.

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


Rules:
- Follow exactly the rules stated in CLAUDE.md, component.md, animate-section.md, SEO.md. 
- Use the setup specified in this file . If there are contradictions between both guidelines, ask me first and let me specify what I need.
- If anything is unclear to you, ask me first and let me clarify things for you 
before building anything.
- Only apply the changes specified in this file. do not change anything else.
- commit and push

## GLOBAL RULES

* Keep layout, colors, spacing, and typography consistent
* Do NOT change the 3-column pricing grid structure
* Do NOT remove any existing features or plans
* Add elements in a way that feels native to the design system
* Preserve the premium SaaS aesthetic

---

## 1. HEADER SECTION (ABOVE PRICING CARDS)

### KEEP:

* “TURN YOUR INSTAGRAM INTO A BOOKING MACHINE”
* Subheadline
* Trust indicators row (no setup fee, no hidden costs, etc.)

### ADD (directly below subheadline, above trust indicators):

Add a subtle announcement bar:

Text:
“Launching with 5 founding studios — limited early access”

Style:

* Small font size (same as trust indicators or slightly larger)
* Muted white/gray text
* Center aligned
* Add a small blue dot or subtle highlight before text
* No background box, keep it minimal

---

## 2. PRICING CARDS SECTION

### CURRENT STRUCTURE:

* Starter ($149)
* Growth ($249, highlighted)
* Pro ($399)

---

## MODIFY “GROWTH” PLAN (PRIMARY ACTION PLAN)

This becomes the **Founding Offer anchor**

### CHANGE:

#### 1. ADD BADGE ABOVE “MOST POPULAR”

Replace or stack:

Top badge:
“FOUNDING OFFER”

Below it (keep existing):
“MOST POPULAR”

Style:

* Founding badge uses subtle blue outline or filled pill
* Slight glow or emphasis
* Keep consistent with design language

---

#### 2. ADD PRICE CONTEXT (IMPORTANT)

Under $249/month, add:

Small text:
“Founding studio rate (limited)”

Then below:
“Regular price: $299/month”

Style:

* Regular price in muted gray + strikethrough
* Founding price stays dominant

---

#### 3. ADD VALUE BLOCK (inside card, above features)

Add a small highlighted box (same style as existing “This pays for itself” box):

Title:
“Early Access Benefits”

Content:

* Priority setup (faster launch)
* Direct input on new features
* Lifetime discounted rate

Keep it visually consistent with current blue highlight box

---

#### 4. ADD SCARCITY LINE (below features, above CTA)

Text:
“Only 5 studios — 2 spots remaining”

Style:

* Small text
* Slightly brighter than muted text
* Center aligned

IMPORTANT:
Make this dynamic-ready (can be changed later)

---

#### 5. MODIFY CTA BUTTON

Change:
“START ACCEPTING BOOKINGS”

To:
“CLAIM FOUNDING SPOT”

Keep button style identical

---

## 3. STARTER & PRO PLANS

### KEEP:

* Pricing
* Features
* Layout

### ADD (very subtle, do NOT overpower):

At bottom of each card (above CTA), add:

Starter:
“Upgrade to unlock bookings & payments”

Pro:
“For scaling studios with higher demand”

(Keep these minimal, just tightening messaging)

---

## 4. ADD NEW SECTION BELOW PRICING

Create a new section directly under pricing cards.

---

### SECTION TITLE:

“Why only 5 studios?”

Style:

* Same as other section headers
* Center aligned

---

### CONTENT (3 columns on desktop, stacked on mobile):

Each with icon + short text:

1.

Title: “Built with real studios”
Text: “We’re working closely with a small group to refine the system based on real workflows.”

2.

Title: “High-quality setup”
Text: “Each studio gets a fully customized setup, not a template.”

3.

Title: “Direct support”
Text: “You’ll have direct access during setup and launch.”

---

### BELOW THIS (IMPORTANT TRUST ELEMENT):

Add a simple guarantee line:

“Go live first. Pay after your system is ready.”

Style:

* Centered
* Slightly larger text
* High contrast

---

## 5. FINAL CTA SECTION (BOTTOM OF PAGE)

### ADD ABOVE CTA BUTTON:

“Founding spots are limited — once filled, pricing increases”

### CTA BUTTON:

“Apply for early access”

---

## 6. MOBILE ADAPTATION

### STACKING:

* Pricing cards become vertical stack
* Growth (founding offer) stays FIRST or SECOND (test both)

---

### MOBILE-SPECIFIC ADJUSTMENTS:

#### 1. Founding badge

* Slightly larger for visibility
* Keep above plan name

#### 2. Price section

* Ensure strikethrough price is clearly readable
* Add spacing between lines

#### 3. Early Access Benefits box

* Full width
* Slight padding increase for readability

#### 4. Scarcity line

* Add more vertical spacing so it doesn’t feel cramped

#### 5. CTA buttons

* Full width
* Increase height slightly for tap targets

---

## 7. MICROCOPY CONSISTENCY

Replace any passive phrasing with outcome-driven phrasing:

Examples:

* “Online booking” → “Accept bookings 24/7”
* “Class schedule” → “Clear schedule clients can book instantly”
* “Payments” → “Get paid online”

---

## FINAL GOAL

The page should feel like:

* A premium SaaS product
* With a **limited early-access opportunity**
* Not a beta, not unfinished
* But exclusive, controlled, and high-value

Do NOT mention:

* testing
* unfinished product
* early stage
* lack of features

Everything should feel intentional and curated.

