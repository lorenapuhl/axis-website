# Our-work page

## 0. Preliminary

Read CLAUDE.md first. Then read:
- @skills/component.md
- @skills/animate-section.md
- @skills/seo.md

Do not write any code yet.
Confirm you have read all four files and summarize:
1. Which rules apply to every component
2. What you must never do

Rules:
- Follow exactly the rules stated in CLAUDE.md, component.md, animate-section.md, SEO.md. 
- Use the setup specified in this file. If there are contradictions between both guidelines, ask me first and let me specify what I need.
- If anything is unclear to you, ask me first and let me clarify things for you 
before building anything.
- Only apply the changes specified in this file. do not change anything else.
- Only read files mentioned. Do not read any other files unless necessary.
- Before starting to code, ask me to clarify details to make sure you exactly build what i need.
- Commit every change you do and make your changes overseeable
- push at the end of the task.

## 1. File: components/sections/OverhandzSection.tsx

- delete it completely from `app/our-work/page.tsx`.

## 2. Create File: components/sections/OverhandzCasestudySection.tsx

- create this file and import it into `app/our-work/page.tsx`
- look at `prompts/overhandz/case-study/CaseStudyClient.tsx`. use this page as a template to design this file. copy and paste the following sections:
- title above "Overhandz Boxing Club · Case Study"
- header "From Ds to automated bookings"
- copy the content until "the solution // a conversion-focused booking system."
- replace the content from "the solution // a conversion-focused booking system." with the following content: 

## 3. Create File: components/sections/OverhandzFeaturesSection.tsx

## REFERENCES

- visualize the UI of the oberhandz-website and access its content with access the website's content in `prompts/overhandz/`.

## STRUCTURE

- think of an optimal way to structure this section. for example, save the overhandz website ui interfaces in a different file and import them when they come into view ? is this a good idea ? what other ideas do you have ? or is this unnecessary ? 
- create a separate file for this section `components/sections/OverhandzFeatures.tsx` and import this file into `app/our-work/page.tsx`

---

## DESKTOP LAYOUT

* Horizontal pill navigation (scrollable if needed)
* Active pill = subtle white border + slightly brighter background
* Below:

  * Left: text (headline + explanation)
  * Right: **real UI preview (exact Overhandz sections)**

---

## PILLS (FINAL)

* Instant Booking
* Class Schedule
* Memberships & Packages
* Online Payments
* Mobile Experience
* Live Instagram Feed
* Events (Auto from Instagram)
* Offers & Merch (Auto from Instagram)
* Trust & Branding

---

## GLOBAL INTERACTION

On click:

* Fade out previous content (150ms)
* Fade + slide in new content (200–250ms)
* UI preview slightly scales from 0.98 → 1

---

## PILL CONTENT (PIXEL-SPECIFIC)

---

### 1. Mobile Experience

**Headline:**
“Designed for how clients actually browse”

**Text:**
“Optimized for mobile-first users — where most bookings happen.”

**UI TO SHOW:**

* Full vertical flow:

  * Hero (“Train. Fight. Belong.”)

### 2. Instant Booking

**Headline:**
“Book a class in seconds”

**Text:**
“No DMs. No waiting. Capture users exactly when they’re ready.”

**UI TO SHOW:**

* Schedule section
* Visible CTA button (“Book”). add the CTA-flow from the overhandz website that allows the user to book instantly.

---

### 3. Class Schedule

**Headline:**
“Clear, filterable class schedule”

**Text:**
“Users instantly find the right class by day or training type.”

**UI TO SHOW:**

* Schedule filters (day pills + class types) from schedule section
* Multiple class rows visible

---

### 4. Memberships & Packages

**Headline:**
“Turn visitors into recurring revenue”

**Text:**
“Sell memberships and packages directly on your website.”

**UI TO SHOW:**

* Pricing cards from pricing section
  * €450
  * €350
  * €280
  * €250
* All cards visible in stacked layout
* CTA buttons clearly visible

---

### 5. Online Payments

**Headline:**
“Seamless purchase experience”

**Text:**
“From selecting a package to checkout in one smooth flow.”

**UI TO SHOW:**

* One pricing card in focus
* CTA emphasized. add the cta flow flow from the overhandz website
* Subtle visual hint of next step (checkout flow direction)

---

## INSTAGRAM (YOUR CORE EDGE)

---

### 6. Live Instagram Feed

**Headline:**
“Your website updates itself”

**Text:**
“Every post you publish instantly appears on your website.”

**UI TO SHOW:**

* “Overhandzclub” feed section
* Real IG-style grid/cards with the interaction from overhandz website (see post metadata when the user clicks)

---

### 7. Events (Auto from Instagram)

**Headline:**
“Events created automatically from Instagram”

**Text:**
“Promotions, workshops, and announcements become structured events.”

**UI TO SHOW:**

* Events section from overhandz website
* add all links and CTA buttons present in overhandz website

---

### 8. Offers & Merch (Auto from Instagram)

**Headline:**
“Turn posts into revenue”

**Text:**
“Merch and offers are automatically transformed into shoppable content.”

**UI TO SHOW:**

* Merch / Offers section from overhandz website. 
* add all links and CTA buttons present in overhandz website


---

### 9. Trust & Branding

**Headline:**
“Feels like a real, established brand”

**Text:**
“Your Instagram identity becomes a consistent, professional website.”

**UI TO SHOW:**

* About section and Coaches



---

## Mobile design **Horizontal scroll chips (with snap)**

* Large touch targets
* Partial overflow (next chip peeking → signals scroll)
* Keep same visual style
* highlight the active chip/pill

---

# 3. HOW TO KEEP IT “REAL” (VERY IMPORTANT)


### DO:

* Use **real components**
* Keep imperfections (don’t over-polish)
* Maintain real spacing + layout

### DON’T:

* Add fake gradients
* Add floating UI cards
* Over-animate

-----

## VIEW WEBSITE - BUTTON

under this secion, add a button with "view website" that links to https://overhandz-website.vercel.app/en
. 






