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

Content: Read @prompts/portfolio2.md for exact instructions.


Rules:
- Follow exactly the rules stated in CLAUDE.md, component.md, animate-section.md, SEO.md. 
- Use the setup specified in @prompts/portfolio2.md . If there are contradictions between both guidelines, ask me first and let me specify what I need.
- If anything is unclear to you, ask me first and let me clarify things for you 
before building anything.
- Only apply the changes specified in @prompts/portfolio2.md . do not change anything else.

---

## PROMPT

Build a high-converting **Portfolio / Case Study page** for a SaaS startup that creates revenue-generating websites for fitness studios.

The page must wrap an existing interactive demo component:

`<OverhandzSection />`

This component already contains a guided, interactive walkthrough of the boxing studio website.

---

## GOAL

The page should:

* Frame the demo as a **business transformation**
* Emphasize **bookings, payments, and automation**
* Make visitors think:
  👉 “I want this exact system”

---

## PAGE STRUCTURE

---

### 1. CASE STUDY HERO

Keep it minimal and strong.

Headline:
**“From Instagram DMs to automated bookings”**

Subheadline:
**“This boxing studio now runs on a system — not messages”**

Optional microcopy:
“Bookings, payments, and content — all handled automatically”

CTA:

* Primary: “Get this system”
* Secondary: “See how it works” (scroll to demo)

---

### 2. BEFORE → AFTER TRANSFORMATION

Two-column layout (mobile stacked):

#### BEFORE

* Bookings handled in Instagram DMs
* No clear schedule
* No online payments
* Clients ask repetitive questions

#### AFTER

* Clients book instantly online
* Clear schedule available 24/7
* Payments handled automatically
* Professional, structured experience

Style:

* Minimal
* Strong contrast
* Use icons or subtle separators

---

### 3. INTERACTIVE DEMO (CORE)

Embed your existing component:

```tsx
<OverhandzSection />
```

Above it:

Title:
**“Try the system”**

Subtext:
“Click through the experience your clients will have”

---

### 4. INSTAGRAM → REVENUE SECTION

This is your key differentiator.

Title:
**“Post once. Sell automatically.”**

---

#### STRUCTURE

3-step horizontal (or vertical on mobile):

1. Instagram post
2. Website auto-update
3. Booking / purchase

---

#### CONTENT

Explain:

* Instagram content appears automatically on the website
* No manual updates required
* Each post can drive bookings or sales

---

### 5. OUTCOMES (VERY IMPORTANT)

Title:
**“What this changes for the studio”**

Bullet points:

* Clients book without messaging
* Payments happen automatically
* Classes fill faster
* Merch sells without extra effort
* Website stays updated via Instagram

Keep language simple and direct.

---

### 6. TESTIMONIAL

Place directly after outcomes.

Format:

Quote (2–3 lines max)

Example:

“Before, everything was in DMs. Now people just book and pay directly.”

Footer:
— Boxing Studio Owner

---

### 7. LIGHT EXPANSION (OPTIONAL)

Short section:

Title:
**“Works for any studio”**

Include 2–3 simple cards:

* Dance Studio
* Yoga Studio
* Fitness Studio

Each:

* Minimal visual
* 1-line description

---

### 8. FINAL CTA

Strong closing section:

Headline:
**“Get your own AXIS system”**

Subtext:
“Turn your Instagram into a revenue engine”

CTA button:
“Get started”
- Add the CTA-flow from components/cta/ to the button

---

## DESIGN RULES

* Keep everything **clean, minimal, SaaS-style**
* Use **lots of spacing**
* Let the demo be the visual centerpiece
* Avoid repeating homepage sections
* Focus on **outcomes, not features**

---

## COPY STYLE

* Short sentences
* No fluff
* Business-focused
* Use words like:

  * bookings
  * revenue
  * clients
  * automation

---

## POSITIONING

DO NOT describe this as:
❌ “a website”

ALWAYS position it as:
✅ “a system that runs the studio”

---

## FINAL NOTE

The `<OverhandzSection />` is the core.

Everything else exists to:

* Frame it
* Explain it
* Convert the visitor

---

# 💡 WHY THIS STRUCTURE WORKS

* Hero → hooks with transformation
* Before/After → creates tension
* Demo → proves it
* Instagram → differentiates you
* Outcomes → makes it tangible
* Testimonial → builds trust
* CTA → converts
