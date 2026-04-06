# CTA FLOW 

------------------------------------

## CONTEXT

This component is part of a SaaS landing page for a product that builds professional websites for fitness and boutique sports studios. The landing page targets studio owners who currently rely on Instagram for their entire online presence and have no proper website. The primary goal of the landing page is to convert cold visitors into booked discovery calls. To achieve this, the page uses a multi-step modal funnel — the CTA flow — which is triggered when a visitor clicks the main call-to-action button on the landing page. The funnel has three steps: Step 1 collects the visitor's Instagram handle, their studio type and biggest challenges, Step 2 is titles "Building your preview" and gives the user the possibility to upload up to three images/instagram posts, branding images etc, and Step 3 reveals a personalized mock website preview alongside a call-to-action to book a setup call.

-------------------------------------

## General rules
- Progress indicators — a simple 2-step bar at the top makes the process feel finite and professional
- Layout: centered card, full-screen overlay on mobile

## STEP 1 UI — Step1.tsx

Content:
- Headline: "Help us understand your studio"
- Sub: "Takes 60 seconds. No account needed."

FIELD 1 — Handle input:
- Label: "Your studio name or Instagram handle"
- Placeholder: "@yourstudio or Studio Name"
- Strip @ on submit, run through formatHandle()

FIELD 2 - Studio type:
- Label: "What type of studio do you run ?"
- Multiple choice selector:
1. Yoga/Pilates Studio
2. Boxing / Fight Gym
3. Dance Studio
4. Fitness studio
5. Martial arts studio
6. Recovery & Wellness Center
7. Meditation & Breathwork Center
8. Other

FELD 3 - Location: 
- Label: Where is your studio located ? "
- User enters location


FIELD 3 - Problem
- Label: "Where are you losing clients right now?"
- Clickable tiles (any number of tiles can be selected at the same time)
1. “I spend too much time replying to booking DMs”
2. “People ask the same questions every day (price, schedule, location)”
3. “Clients drop off because booking is too complicated”
4. “I can’t take payments or sell packages online”
5. “My schedule is hard to share or always outdated”
6. “I lose clients who search on Google”
7. “I have no clear system to manage clients/bookings”
8. “Other”

- Dynamic line UX:
- Placement:
Directly below the problem tiles
Appears only after 1+ selection
Smooth fade-in + slide-up (200–300ms)
- Structure:
Label (small, muted):
“We’ll fix this by:”
Dynamic lines (strong, bold):
Show 2 lines max (never more) according to the first 2 selected problems
- Exact mapping:
1. DM chaos
→ “automating your bookings so clients can reserve instantly”
2. Repetitive questions
→ “putting your schedule, pricing and info in one clear place”
3. Drop-offs
→ “making booking fast and frictionless in just a few clicks”
4. No payments
→ “letting you sell packages and accept payments online”
5. Schedule issues
→ “showing a live, always up-to-date class schedule”
6. No Google visibility
→ “helping your studio appear on Google and get discovered”
7. No system
→ “organizing your bookings and clients in one simple system”
8. Other
→ “building a system tailored to your studio’s needs”


FIELD 4 - Business goal selector —
- Label: "What's your main goal right now?"
- Clickable tiles : 
1. “Fill more classes consistently”
2. “Sell class packages or memberships automatically”
3. “Reduce time spent on DMs and admin”
4. “Make booking as easy as 2 clicks”
5. “Get discovered on Google”
6. “Have one clear place for schedule, pricing & info”
7. “Launch a proper website quickly without tech stress”
8. “Other”


## STEP 2 UI — Step2.tsx

- Headline: "Help us build your solution"

FIELD 5 - vibe picker: 
- Label: "How does your studio feel like ? "
- Small mood tiles: 
1. Clean & Minimal
2. Bold & Dark
3. Warm & Earthy
4. Bright & Energetic

FIELD 5 - Features:
- Label: "What should your website do for you?"
- Toggles: All toggles are activated at first. The user can deactivate them manually
* Bookings & Payments
1. “Let clients book classes online (24/7)”
2. “Accept payments (cards, Apple Pay, etc.)”
3. “Sell packages & memberships automatically”
* Schedule & Info
4. “Show a structured class schedule”
5. “Display pricing clearly (no more DM questions)”
* Marketing & Growth
6. “Show a Gallery-section with latest Instagram content automatically”
7. “Promote offers, events or workshops from my Instagram”
* Operations
8. “Track bookings and client activity”
9. “Collect client details automatically”

FIELD 6 — Image upload:
- Label: "Drop in some photos so we can match your style"
- Helper text: "Upload 1–3 photos from your Instagram, website, or phone that represent your studio"
- Drag-and-drop zone OR click-to-browse
- Accepts: jpg, jpeg, png, webp
- Max file size per image: 5MB
- Min: 0 (upload is optional — fallback kicks in if empty)
- Max: 3 images
- Show thumbnail previews inline after selection with remove (×) button
- Upload zone styling: dashed border, rounded-xl, centered icon + text
  "Drag photos here or click to browse"
- After upload: show small thumbnail row with × remove buttons

FIELD 7 - CTA: "Build my preview"
- small text below: "No signup. No credit card. Just a preview."
- Always enabled once handle/name is filled
- Images are optional — fallback handles missing images gracefully

## After the user clicked the "Build preview" button:

- Short animation (2–4 seconds):
- Carousel showing the following statements and a symbol visualising the loading process: “Analyzing your Instagram…”, “Understanding your studio...”, "Processing your problems and needs...", "Understanding your studio's mood and style"..., “Designing your website…”

-----------------------------------

## Preview

### 1. Overall Preview Structure

Show it inside a **device frame (iPhone or browser)** with slight auto-scroll.

### 2. Layout:

* TOP BAR (tiny but powerful)

- `www.[studioname].studio`
- Small badge: **“Custom-built for you”**

* ABOVE THE FOLD (most important section)

- Headline:
“Welcome to **[Studio Name]**”

- Subheadline (dynamic):

Based on goal:

* Bookings → “Book your next class in seconds”
* Memberships → “Join and train with us”

(Pick “Join and train with us” if both were selected)

- HERO SECTION
Background:

* If images uploaded → use **best image as hero**
* If not → AI/stock based on studio type + vibe

### Overlay:

* Subtle gradient (based on extracted brand color)

---

## CTA Button:

👉 “Book a class”

Style:

* Color = **primary extracted color**
* Shape depends on vibe:

  * Minimal → rounded, thin
  * Bold → solid, sharp
  * Warm → soft shadows
  * Energetic → brighter accent

---

# 📅 3. SCHEDULE SECTION (personalized)

## Title:

“Today’s Classes at [Studio Name]”

## Content:

Generate realistic schedule:

**Based on studio type:**

Yoga:

* 08:00 — Morning Flow
* 18:00 — Vinyasa

Boxing:

* 17:00 — Beginner Boxing
* 19:00 — HIIT Fight

---

## Personalization:

If user selected:

* “Schedule is hard to share”

👉 Add label:
“Always up-to-date — no more confusion”

---

# 💳 4. MEMBERSHIP / PACKAGES

## Title:

“Train with us”

## Cards:

* Single Class — $20
* 5-Class Pack — $90
* Unlimited Monthly — $120

---

## Personalization:

If they selected payments issue:

👉 Highlight section (slight glow or badge):
“Clients can pay instantly online”

---

# 📸 5. INSTAGRAM / CONTENT SECTION

## Title:

“Latest from @theirhandle”

### If user uploaded images:

* Use them as **first posts in grid**
* Fill remaining with placeholders

### If no images:

* Generate grid based on:

  * Studio type
  * Vibe

---

## Extra sections (based on features):

If selected:

* Promotions → show “Spring Offer -20%”
* Events → “Workshop this Saturday”
* News → “New class added”

---

# ⭐ 6. TESTIMONIALS

Make them feel local + real:

> “Best yoga studio I’ve found in the area”

> “Super easy booking and amazing classes”

---

# 📍 7. LOCATION / TRUST BLOCK

* Map placeholder
* “Located in your area”
* Contact buttons:

  * WhatsApp
  * Call
  * Email

---

# 🔥 8. DYNAMIC PERSONALIZATION LOGIC (IMPORTANT)

## Based on PROBLEMS:

Inject micro-copy:

* DM issue → “No more back-and-forth messages”
* Payments → “Pay in seconds online”
* Google → “Get found by new clients”

---

## Based on GOALS:

Reorder sections:

* Bookings → CTA + schedule first
* Memberships → pricing first
* Visibility → hero + testimonials emphasized

---

# 🎨 9. IMAGE SYSTEM (CRITICAL)

## If user uploads images:

### Step 1: Image selection

* Image 1 → Hero
* Image 2 → Section background / cards
* Image 3 → Instagram grid

---

### Step 2: Color extraction

Automatically extract:

* **Primary color** → buttons, highlights
* **Secondary color** → backgrounds
* **Neutral tone** → text balance

---

### Step 3: Style detection

From images detect:

* Bright → energetic UI
* Dark → premium UI
* Warm tones → earthy palette

---

### Step 4: Apply globally

* Buttons
* Section accents
* Gradients
* Hover states

👉 This is what makes it feel **custom-built**

---

## If NO images uploaded:

Use:

### 1. Studio type → base visuals

Yoga → calm poses
Boxing → action shots

### 2. Vibe picker → styling

| Vibe      | Colors        | UI                   |
| --------- | ------------- | -------------------- |
| Minimal   | white/black   | clean, lots of space |
| Bold      | black/neon    | strong contrast      |
| Warm      | beige/brown   | soft, cozy           |
| Energetic | bright colors | high contrast        |

---

👉 Combine both → generate consistent design

---

# 🎬 10. ANIMATION (adds realism)

* Page fades in
* Auto-scroll 30–40%
* Button hover pulse
* Subtle “live” feel

---

# 💡 11. FINAL CONVERSION LAYER (overlay on preview)

After scroll:

## Show overlay:

“Your website is ready”

Then:

* “No technical work needed”
* “We import your Instagram”
* “Ready in 48h”

CTA:
👉 **“Launch my website”**

---

# ⚠️ 12. Biggest mistakes to avoid

* ❌ Same layout for everyone
* ❌ Stock images that don’t match vibe
* ❌ No color adaptation
* ❌ Generic text

---

# 🚀 Final Insight

The preview should answer this silently:

👉 “Can I imagine my clients using this tomorrow?”

If yes → they convert
If no → they hesitate

---

If you want next, I can:

* turn this into **exact component structure (React-level)**
* or design **color extraction + personalization logic step-by-step**





---------------------------------------

## Final Conversion Step (AFTER preview)

“No technical work needed”
“We’ll import your Instagram automatically”
“No setup fee”
“Cancel anytime”

CTA button: “Launch my website”

## After clicking the final CTA button 

Show a short confirmation screen (not a redirect yet)

Headline:
“We’ve already started building your site based on your answers.”

FIELD INPUTS:
1. Name
2. Email
3. WhatsApp

“We’ll get in touch and set this up for you in 48h”

(I - the website owner - should get a notification with the submitted answers, data and a screenshot of the built website preview.)
