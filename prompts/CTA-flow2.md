# CTA FLOW 

------------------------------------

## CONTEXT

This component is part of a SaaS landing page for a product that builds professional websites for fitness and boutique sports studios. The landing page targets studio owners who currently rely on Instagram for their entire online presence and have no proper website. The primary goal of the landing page is to convert cold visitors into booked discovery calls. To achieve this, the page uses a multi-step modal funnel — the CTA flow — which is triggered when a visitor clicks the main call-to-action button on the landing page. The funnel has three steps: Step 1 collects the visitor's Instagram handle, their studio type and biggest challenges, Step 2 is titled "Building your preview" and gives the user the possibility to upload up to three images/instagram posts, branding images etc, and Step 3 reveals a personalized mock website preview alongside a call-to-action to book a setup call.

-------------------------------------

## General rules
- Progress indicators — a simple 2-step bar at the top makes the process feel finite and professional
- Layout: centered card, full-screen overlay on mobile
- This is the main CTA-flow for most CTA-button on the website landing page. Make sure the connection of the CTA-flow to each button is easily implementable.
- Write as many comments as possible for someone who only knows python, CSS and HTML to understand the working structure and your script.

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

FIELD 3 - Location: 
- Label: Where is your studio located ? "
- User enters location

FIELD 4 - Problem
- Label: "Where are you losing clients right now?"
- Clickable tiles (any number of tiles can be selected at the same time)
1. "I spend too much time replying to booking DMs"
2. "People ask the same questions every day (price, schedule, location)"
3. "Clients drop off because booking is too complicated"
4. "I can't take payments or sell packages online"
5. "My schedule is hard to share or always outdated"
6. "I lose clients who search on Google"
7. "I have no clear system to manage clients/bookings"
8. "Other"

- Dynamic line UX:
- Placement:
Directly below the problem tiles
Appears only after 1+ selection
Smooth fade-in + slide-up (200–300ms)
- Structure:
Label (small, muted):
"We'll fix this by:"
Dynamic lines (strong, bold):
Show 2 lines max (never more) according to the first 2 selected problems
- Exact mapping:
1. DM chaos
→ "automating your bookings so clients can reserve instantly"
2. Repetitive questions
→ "putting your schedule, pricing and info in one clear place"
3. Drop-offs
→ "making booking fast and frictionless in just a few clicks"
4. No payments
→ "letting you sell packages and accept payments online"
5. Schedule issues
→ "showing a live, always up-to-date class schedule"
6. No Google visibility
→ "helping your studio appear on Google and get discovered"
7. No system
→ "organizing your bookings and clients in one simple system"
8. Other
→ "building a system tailored to your studio's needs"


FIELD 5 - Business goal selector —
- Label: "What's your main goal right now?"
- Clickable tiles : 
1. "Fill more classes consistently"
2. "Sell class packages or memberships automatically"
3. "Reduce time spent on DMs and admin"
4. "Make booking as easy as 2 clicks"
5. "Get discovered on Google"
6. "Have one clear place for schedule, pricing & info"
7. "Launch a proper website quickly without tech stress"
8. "Other"


## STEP 2 UI — Step2.tsx

- Headline: "Help us build your solution"

FIELD 6 - vibe picker: 
- Label: "How does your studio feel like ? "
- Small mood tiles: 
1. Clean & Minimal
2. Bold & Dark
3. Warm & Earthy
4. Bright & Energetic

FIELD 7 - Features:
- Label: “What should this system handle for you automatically?”
- Toggles: All toggles are activated at first. The user can deactivate them manually
* Bookings & Payments
1. "Let clients book classes online (24/7)"
2. "Accept payments (cards, Apple Pay, etc.)"
3. "Sell packages & memberships automatically"
* Schedule & Info
4. "Show a structured class schedule"
5. "Display pricing clearly (no more DM questions)"
* Marketing & Growth
6. "Show a Gallery-section with latest Instagram content automatically"
7. "Promote offers, events or workshops from my Instagram"
* Operations
8. "Track bookings and client activity"
9. "Collect client details automatically"

FIELD 8 — Image upload:
- Label: "Drop in some photos so we can match your style"
- Helper text: "Upload 1–3 photos from your Instagram, website, or phone that represent your studio. These will shape your website design (colors, layout, style)"
- Drag-and-drop zone OR click-to-browse
- Accepts: jpg, jpeg, png, webp
- Max file size per image: 5MB
- Min: 0 (upload is optional — fallback kicks in if empty)
- Max: 3 images
- Show thumbnail previews inline after selection with remove (×) button
- Upload zone styling: dashed border, rounded-xl, centered icon + text
  "Drag photos here or click to browse"
- After upload: show small thumbnail row with × remove buttons

FIELD 9 - CTA: "Build my preview"
- small text below: "No signup. No credit card. Just a preview."
- Always enabled once handle/name is filled
- Images are optional — fallback handles missing images gracefully

## After the user clicked the "Build preview" button:

- Short animation (2–4 seconds):
- Carousel showing the following statements and a symbol visualising the loading process: "Analyzing your Instagram…", "Understanding your studio...", “Designing a {studioType} website for {location}” "Processing your problems and needs...", "Understanding your studio's mood and style"..., "Designing your website…"

-----------------------------------

## STEP 3 — PREVIEW IMPLEMENTATION

### Overview

Step 3 is the emotional climax of the entire funnel. The user has invested 2–3 minutes filling in their studio details. They now see a rendered mock of their future website — personalized with their studio name, location, type, chosen vibe, and uploaded photos. The preview must feel genuinely built for them, not like a template demo. Immediately beside (desktop) or below (mobile) the preview is the conversion CTA to book a setup call.

---

### File Structure

Create the following files:

```
components/cta/
  CTAModal.tsx          ← orchestrates the 3-step flow, manages shared state
  Step1.tsx             ← fields 1–4
  Step2.tsx             ← fields 5–7 + build button
  Step3.tsx             ← loading animation + preview reveal
  PreviewMock.tsx       ← the rendered website mock (pure presentational)
  
lib/
  previewConfig.ts      ← all studio-type profiles, vibe themes, copy templates
  colorExtractor.ts     ← client-side dominant color extraction from uploaded images
  previewBuilder.ts     ← assembles final PreviewData object from all inputs
```

---

### Shared State Shape

Define this TypeScript interface in `lib/previewBuilder.ts`. It is passed across all steps via props from CTAModal.tsx.

```ts
// This is the single source of truth for everything the user has told us.
// CTAModal.tsx owns this state. Each step receives the relevant slice as props.

export interface FlowData {
  // Step 1
  handle: string;           // cleaned studio name (@ stripped)
  studioType: StudioType;   // enum key matching a profile in previewConfig.ts
  location: string;         // raw location string entered by user
  problems: number[];       // indices of selected problem tiles (0-based)
  goals: number[];          // indices of selected goal tiles (0-based)

  // Step 2
  vibe: Vibe;               // 'minimal' | 'dark' | 'earthy' | 'energetic'
  activeFeatures: number[]; // indices of toggled-on feature items
  uploadedImages: string[]; // base64 data URLs of uploaded photos (max 3)
  
  // Derived (computed in previewBuilder.ts before Step 3 renders)
  extractedColors: string[] | null; // top 2 hex colors from uploaded images, or null
}

export type StudioType =
  | 'yoga_pilates'
  | 'boxing'
  | 'dance'
  | 'fitness'
  | 'martial_arts'
  | 'recovery'
  | 'meditation'
  | 'other';

export type Vibe = 'minimal' | 'dark' | 'earthy' | 'energetic';
```

---

### Color Extraction — `lib/colorExtractor.ts`

Do NOT use any external API or library for color extraction. Use the browser's native Canvas API, which is available in all modern browsers and requires zero dependencies.

**How it works:**
1. Draw the uploaded image onto a hidden `<canvas>` element at a tiny resolution (e.g. 50×50px) to downsample it
2. Read all pixel data from the canvas using `ctx.getImageData()`
3. Cluster pixels by color proximity (simple bucket quantization — group R, G, B values into buckets of size 32)
4. Count frequency per bucket, sort descending, return the top 2 as hex strings
5. Filter out near-white (R,G,B all > 230) and near-black (R,G,B all < 25) buckets — these are almost never useful brand colors

**Implementation rules:**
- `"use client"` — this uses browser APIs
- Accept a `base64DataUrl: string` parameter
- Return `Promise<string[]>` — resolves to array of 1–2 hex color strings
- If no image is uploaded or extraction fails for any reason, return `[]` — the preview falls back to the vibe theme palette
- Use `new Image()` and `canvas.getContext('2d')` — no third-party imports
- This function is called in `previewBuilder.ts` after the user clicks "Build my preview", during the loading animation phase

```ts
// Full function signature (implement in colorExtractor.ts):
export async function extractDominantColors(base64DataUrl: string): Promise<string[]>
```

---

### Studio Type Profiles — `lib/previewConfig.ts`

Each `StudioType` maps to a `StudioProfile`. This is the master customization engine — a single selection by the user at Step 1 triggers an entire cascade of visual and copy decisions.

Define the following TypeScript types and then export a `STUDIO_PROFILES` record:

```ts
export interface StudioProfile {
  label: string;              // display name, e.g. "Yoga & Pilates Studio"
  heroTagline: string;        // hero subheading template — use {name} and {location} as tokens
  heroCTA: string;            // CTA button copy in the hero, e.g. "Book your first class"
  aboutSnippet: string;       // one sentence for the About section, uses {name}
  seoLine: string;            // small muted line, e.g. "Found on Google. Loved by clients in {location}."
  classSuggestions: ClassItem[]; // 4 example class cards
  pricingTiers: PricingTier[];   // 3 pricing tier placeholders
  defaultFallbackImages: string[]; // 3 public/ image paths for when user uploads nothing
  defaultVibe: Vibe;          // vibe applied if user skips vibe picker
}

export interface ClassItem {
  name: string;     // e.g. "Vinyasa Flow"
  time: string;     // e.g. "Mon / Wed / Fri — 8:00 AM"
  spots: number;    // e.g. 8
  duration: string; // e.g. "60 min"
}

export interface PricingTier {
  name: string;      // e.g. "Drop-in"
  price: string;     // e.g. "$25"
  description: string;
  highlighted: boolean; // true for the middle/recommended tier
}
```

Implement all 8 studio type profiles. Key differences between profiles:

- **yoga_pilates**: soft heroTagline ("Find your balance in {location}"), gentle class names (Vinyasa, Yin, Reformer), minimal vibe default, 3-tier pricing (Drop-in / 10-class pack / Monthly unlimited)
- **boxing**: aggressive copy ("Train like a fighter in {location}"), class names (Bag Work, Sparring, HIIT Boxing), dark vibe default, pricing (Single / Monthly / Coaching)
- **dance**: expressive copy ("Move with intention"), class names (Ballet, Contemporary, Salsa, Hip-Hop), energetic vibe default
- **fitness**: performance copy ("Reach your peak in {location}"), HIIT / Strength / Cardio classes, energetic default
- **martial_arts**: disciplined copy ("Discipline. Strength. Focus."), Krav Maga / BJJ / Muay Thai, dark default
- **recovery**: calm copy ("Recover smarter"), Stretch / Massage / Cold Plunge / Red Light, earthy default
- **meditation**: introspective copy ("Breathe in. Build clarity."), Breathwork / Sound Bath / Guided, minimal default
- **other**: generic but professional copy, generic fitness classes, minimal default

---

### Vibe Themes — `lib/previewConfig.ts` (continued)

Each `Vibe` maps to a `VibeTheme` that controls all visual variables of the mock.

```ts
export interface VibeTheme {
  bg: string;           // Tailwind bg class for the page background, e.g. "bg-white"
  surface: string;      // card/section background, e.g. "bg-gray-50"
  text: string;         // primary text color class
  textMuted: string;    // secondary/muted text class
  accent: string;       // CTA button, highlights — Tailwind bg class
  accentText: string;   // text on top of accent color
  border: string;       // border color class
  navBg: string;        // navbar background class
  heroOverlay: string;  // rgba overlay on hero image if present, as inline style string
}

export const VIBE_THEMES: Record<Vibe, VibeTheme> = {
  minimal: {
    bg: 'bg-white',
    surface: 'bg-gray-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-gray-900',
    accentText: 'text-white',
    border: 'border-gray-200',
    navBg: 'bg-white/90',
    heroOverlay: 'rgba(255,255,255,0.15)',
  },
  dark: {
    bg: 'bg-zinc-950',
    surface: 'bg-zinc-900',
    text: 'text-white',
    textMuted: 'text-zinc-400',
    accent: 'bg-white',
    accentText: 'text-black',
    border: 'border-zinc-800',
    navBg: 'bg-zinc-950/90',
    heroOverlay: 'rgba(0,0,0,0.55)',
  },
  earthy: {
    bg: 'bg-stone-50',
    surface: 'bg-stone-100',
    text: 'text-stone-900',
    textMuted: 'text-stone-500',
    accent: 'bg-stone-800',
    accentText: 'text-stone-50',
    border: 'border-stone-200',
    navBg: 'bg-stone-50/90',
    heroOverlay: 'rgba(120,80,40,0.25)',
  },
  energetic: {
    bg: 'bg-white',
    surface: 'bg-orange-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-orange-500',
    accentText: 'text-white',
    border: 'border-orange-100',
    navBg: 'bg-white/90',
    heroOverlay: 'rgba(255,120,0,0.15)',
  },
};
```

**Color override rule:** If `extractedColors` contains 1 or 2 valid hex values, override the `accent` and `surface` Tailwind classes with inline style equivalents using those hex values. This is the only case where inline styles are used in the mock — document it clearly with a comment.

---

### Preview Builder — `lib/previewBuilder.ts`

This is the assembly function that runs during the loading animation, before Step 3 renders the mock. It is called with the full `FlowData` object and returns a `PreviewData` object that `PreviewMock.tsx` consumes.

```ts
export interface PreviewData {
  studioName: string;           // formatted handle/name
  location: string;
  profile: StudioProfile;       // resolved from studioType
  theme: VibeTheme;             // resolved from vibe
  accentColorOverride: string | null; // first extracted color, or null
  surfaceColorOverride: string | null; // second extracted color, or null
  heroImageUrl: string | null;  // first uploaded image (base64), or fallback
  galleryImages: string[];      // remaining uploaded images + fallbacks, max 3 total
  activeFeatures: number[];     // passed through for conditional section rendering
  resolvedTagline: string;      // heroTagline with {name} and {location} tokens replaced
  resolvedSeoLine: string;      // seoLine with {location} token replaced
  resolvedAbout: string;        // aboutSnippet with {name} token replaced
  resolvedHeroCTA: string;      // heroCTA from profile
  selectedProblems: string[];   // human-readable problem labels (for personalised About micro-copy)
}

// Token replacement helper — replaces {name} and {location} in template strings
function resolveTokens(template: string, name: string, location: string): string

// Main assembly function — call this once, async, during the loading phase
export async function buildPreviewData(flow: FlowData): Promise<PreviewData>
```

Inside `buildPreviewData`:
1. Call `extractDominantColors` on `flow.uploadedImages[0]` if present — await the result
2. Resolve the studio profile from `STUDIO_PROFILES[flow.studioType]`
3. Resolve the vibe theme from `VIBE_THEMES[flow.vibe]`
4. Replace tokens in all template strings
5. Determine hero image: `flow.uploadedImages[0]` → fallback to `profile.defaultFallbackImages[0]`
6. Determine gallery images: remaining uploaded + fallbacks to fill up to 3
7. Map `accentColorOverride` and `surfaceColorOverride` from extracted colors (index 0 and 1)
8. Return the assembled `PreviewData`

---

### Loading Animation — inside `Step3.tsx`

The loading animation runs **before** `buildPreviewData` resolves. The two happen in parallel — the animation plays for a minimum of 3 seconds regardless of how fast the data resolves. Use `Promise.all([buildPreviewData(flow), delay(3000)])` where `delay` is `new Promise(resolve => setTimeout(resolve, ms))`.

**Animation design:**
- Full-screen dark overlay with centered content
- A pulsing circular ring using Framer Motion `animate={{ rotate: 360 }}` with `repeat: Infinity, duration: 2, ease: 'linear'`
- Below the ring: a staggered carousel of status messages using `AnimatePresence` + `motion.p`
  - Each message appears with `opacity: 0 → 1`, `y: 10 → 0`, duration 300ms
  - Each message stays for 600ms then exits with `opacity: 1 → 0`
  - Messages in order:
    1. "Analyzing your studio…"
    2. "Matching your vibe…"
    3. "Setting up your booking system…"
    4. "Adding your class schedule…"
    5. "Designing your website…"
  - Cycle through messages on a 900ms interval using `useEffect` + `setInterval`
- When `buildPreviewData` resolves, set `previewReady: true` state
- When `previewReady` is true AND minimum delay has elapsed, transition to preview reveal using `AnimatePresence`

**State inside Step3.tsx:**
```ts
const [previewData, setPreviewData] = useState<PreviewData | null>(null);
const [isReady, setIsReady] = useState(false);
const [messageIndex, setMessageIndex] = useState(0);
```

---

### PreviewMock.tsx — The Rendered Website Mock

This is a pure presentational component. It accepts `PreviewData` as its only prop. It renders a scaled-down, scrollable mock of a real website inside a device frame.

**Component signature:**
```ts
interface PreviewMockProps {
  data: PreviewData;
}
export default function PreviewMock({ data }: PreviewMockProps)
```

**Outer wrapper — Device Frame:**
- A `div` styled to look like a laptop/browser chrome: rounded-xl, border, shadow-2xl
- A thin "browser bar" at the top: 3 colored dots (red/yellow/green) + a fake URL bar showing `www.{slug}.com` where `slug` is the studio name lowercased and hyphenated (e.g. "reforma-pilates")
- Below the browser bar: the mock website content, `overflow-y-auto`, `max-h-[520px]` on desktop

**Scaling:** The mock is designed at full width internally but the outer card is contained. Do not scale with CSS `transform: scale()` — this creates blur and layout issues. Instead design the mock content to be responsive and naturally fit within the card.

**Mock website sections — render all of the following in order:**

---

#### SECTION 1 — Navbar
- `data.theme.navBg` + `backdrop-blur-sm` background
- Left: studio name in font-semibold
- Right: "Book Now" button using `data.theme.accent` + `data.theme.accentText`
- If `data.accentColorOverride` is set: apply as inline `style={{ backgroundColor: data.accentColorOverride }}` on the button — **this is the only permitted inline style usage**
- Comment clearly: `{/* Inline style only used here — color extracted from uploaded photo */}`

#### SECTION 2 — Hero
- Full-width, `min-h-[280px]`, relative
- Background: if `data.heroImageUrl` is a base64 string, use it as `style={{ backgroundImage: 'url(...)' }}` with `bg-cover bg-center`
- Overlay: a `div` with `absolute inset-0` and `style={{ backgroundColor: data.theme.heroOverlay }}`
- On top of overlay: center-aligned content
  - Small muted line: `data.resolvedSeoLine` (e.g. "Found on Google. Loved by clients in Polanco.")
  - H2 (NOT h1 — the page.tsx already owns the h1): studio name, large, bold, the headline font (Playfair Display via `font-playfair` class)
  - Paragraph: `data.resolvedTagline`
  - CTA button: `data.resolvedHeroCTA` — styled with accent color + override if present

#### SECTION 3 — Class Schedule (render only if feature index 3 is in `data.activeFeatures`)
- Section heading: "Classes & Schedule"
- Grid of `data.profile.classSuggestions` (4 items) — 2-column grid on mobile, 4-column on wider layouts within the mock
- Each card: class name, time string, duration badge, spots badge
- Card background: `data.theme.surface`
- Accent badge (spots remaining): accent color

#### SECTION 4 — Pricing (render only if feature index 1 or 2 is in `data.activeFeatures`)
- Section heading: "Memberships & Packages"
- 3-column grid of `data.profile.pricingTiers`
- Highlighted tier (middle): uses accent color background + accentText
- Non-highlighted: theme.surface background
- Each card: tier name, price (large), description, "Get started" button

#### SECTION 5 — About
- Section heading: "About the studio"
- `data.resolvedAbout` text
- If `data.galleryImages[1]` exists: show it as a rounded image on the right (2-column layout)
- Small callout box: "✦ Your story, in your words — this section is fully editable." (muted, italic)


#### SECTION 6 — Instagram Gallery (render only if feature index 5 is in `data.activeFeatures`)

**Purpose:**
This section is not just a visual gallery — it demonstrates how the studio’s Instagram content automatically becomes a structured, conversion-focused part of their website. It should feel alive, personalized, and already useful for the studio’s business.

---

**Structure & Content Layout**

* Section heading: **"Latest from Instagram"**

* Small subtitle (muted, directly below heading):
  → *"Your Instagram — automatically turned into website content."*

* Render a **3-row grid layout**, each row representing a content type:

  1. **NEWS**
  2. **PROMOTIONS**
  3. **EVENTS**

* Each row:

  * Starts with a **small uppercase label** (muted, letter-spaced)
  * Followed by a **3-column grid of square tiles**

---

**Image & Placeholder Logic**

* If `data.uploadedImages.length > 0`:

  * Use uploaded images as the **primary visual anchors**

  * Fill the **first column of each row** with uploaded images (cycle through images if fewer than 3)

  * Remaining grid cells are filled with **color-based placeholders**

  * Placeholder colors:

    * Use `data.accentColorOverride` and `data.surfaceColorOverride` if available
    * Otherwise fallback to `data.theme` values from `VIBE_THEMES`

  * Placeholders must visually match the uploaded images:

    * Soft gradients or flat fills using extracted colors
    * No random colors — everything must feel cohesive and branded

---

* If `data.uploadedImages.length === 0`:

  * Fill **all grid cells** with color-based placeholders
  * Use only values from `VIBE_THEMES`:

    * `surface`, `accent`, `border`, `textMuted`
  * If needed, extend `VIBE_THEMES` with additional variables:

    * `surfaceSoft`
    * `accentSoft`
    * `highlight`
  * Goal: create a visually rich, harmonious layout — never empty or generic

---

**Ownership Layer (Psychological Hook)**

* Add **lightweight content overlays** on 1–2 tiles per row:

  * Small text badges or captions (positioned bottom-left or centered)

* Examples (contextual, not random):

  * NEWS → “New class this week”
  * PROMOTIONS → “10 spots left” / “Limited offer”
  * EVENTS → “Workshop this Saturday”

* These overlays should:

  * Feel realistic and studio-specific
  * Be subtle (not dominant)
  * Create the impression:
    → *“This already looks like my studio’s content”*

---

**Progressive Engagement (Low Effort Interaction)**

* Add **very subtle interactivity** to make the preview feel alive without requiring user input:

  * On hover (desktop):

    * Tile scales slightly: `scale(1.02)`
    * Optional: slight brightness increase or overlay fade
  * Tooltip or micro-feedback on hover (one consistent message across tiles):
    → *"Auto-updated from your Instagram"*

* Do NOT introduce clicks, editing, or controls

* The goal is passive engagement — not interaction friction

---

**Visual Behavior & Styling**

* Grid:

  * 3 rows × 3 columns
  * Square tiles (`aspect-square`)
  * `rounded-lg`, consistent spacing

* Images:

  * `object-cover`
  * Always fill container cleanly

* Placeholders:

  * Use gradients or soft fills (no harsh contrast)
  * Must match overall theme or extracted colors

---

**Hierarchy & Emphasis**

* The **PROMOTIONS row should have slightly higher visual importance**:

  * Slightly stronger border OR subtle accent tint background
  * This aligns with the core business goal: driving revenue

---

**Automation Reinforcement**

* Below the grid, add small muted text:
  → *"Auto-updated from your Instagram. No manual editing."*

* This line reinforces the automation value without adding friction

---

#### SECTION 7 — Contact & Location
- Section heading: "Find us"
- Studio name, location string
- 3 icon+label rows: "Book online", "WhatsApp", "Email" — all placeholder links
- Muted rectangle styled to look like a map placeholder: `bg-gray-200 rounded-xl h-24 w-full` with centered text "Map — {location}"

#### SECTION 8 — Footer
- Dark background (`bg-zinc-900 text-white` regardless of vibe — footers are always dark)
- Studio name, tagline (resolvedTagline, truncated to 1 line), Instagram handle (@{handle})
- "Powered by Axis" in very small muted text — brand attribution

---

### Step 3 Layout — `Step3.tsx`

After the loading animation ends and the preview is ready, reveal the full Step 3 layout using `AnimatePresence` with `motion.div` fade-in.

**Desktop layout (lg:flex-row):**
- Left column (40% width): conversion panel
- Right column (60% width): `<PreviewMock data={previewData} />`

**Mobile layout (flex-col):**
- Preview mock first (top)
- Conversion panel below

**Conversion panel content:**

Ownership trigger (small line above headline):
“Preview for {studioName}”

Headline (Playfair Display, large):
"Your website is ready."

Subheadline (Instrument Sans, muted):
“Instead of managing bookings in DMs — this is what your clients will see.”

Personalization callout box (subtle border, rounded-xl):
- Title: "Built for your studio"
- Bullet list (dynamic, max 3 items) — generated from selected problems and goals:
  - Map each selected problem index to:
  Problem → Outcome Mapping (for Step 3 Personalization)

Convert each selected problem into a clear, benefit-driven outcome statement:

DM chaos (too much time replying to booking DMs)
→ “Clients can now book instantly — no back-and-forth in DMs”
Repetitive questions (price, schedule, location)
→ “All your pricing, schedule, and info are clearly structured in one place”
Clients drop off due to complicated booking
→ “Booking is now fast and frictionless — just a few clicks for your clients”
No payments / can’t sell packages
→ “You can sell packages and accept payments automatically — even while you sleep”
Schedule is hard to share or outdated
→ “Your schedule is always clear, structured, and automatically up-to-date”
Losing clients from Google
→ “Your studio can now be discovered on Google by new potential clients”
No system to manage clients/bookings
→ “All your bookings and client details are organized in one simple system”
Other
→ “Your setup is tailored to your studio’s specific needs and workflow”
  - Show up to 3 items with a ✦ or → prefix
  - These make the panel feel personally written

CTA button (primary, full-width):
"Start onboarding"
- Uses Axis brand Electric Blue (#0033FF) background — this is the primary conversion action, always override vibe theming here with the Axis brand color
- Small, muted but clearly visible:

“We’re currently onboarding up to 5 studios this month to ensure full personal support.”

Social proof strip (3 items, horizontal):
"Personal assistance by our founder." · "Live in 7 days" · "Free setup call"

#### CTA-button functionality

CTA Click Behavior — Application Flow

On click, trigger the following sequence:

1. Capture & Prepare Data

Collect all relevant data from previewData and flowData:

studioName
location
studioType
selectedProblems
goals
vibe
activeFeatures
uploadedImages (if any)
Generated preview state
2. Generate Preview Screenshot
Programmatically capture a screenshot of <PreviewMock />
Use a client-side approach (e.g. html2canvas)
Output format: PNG (compressed but readable)
Ensure:
Full preview is visible (not cut off)
Good resolution (important for review quality)
3. Send Application Email

Trigger a backend API route (e.g. /api/submit-application) that:

Sends an email to the owner containing:

Studio name + location
Studio type
Selected problems & goals
Selected features
Vibe
Timestamp
The studio's contact details

Attach:

Preview screenshot image

Optional (recommended):

Include uploaded user images (if available)

(We will build the backend application route later !)

4. Immediate UI Feedback (Post-Click State)

After click, replace the entire conversion panel with a confirmation state:

Confirmation Screen

Headline (Playfair Display):

“Application received.”

Subheadline (Instrument Sans):

“We’re reviewing your studio and preparing your onboarding.”

Main message:

“You’ll hear back from us within 24 hours with the next steps.”

Supporting line (optional, muted):

“We review each studio personally to ensure we're a match.”

UX Rules
Disable CTA button immediately after click (prevent double submission)

Show short loading state (300–800ms):

“Submitting your application…”

Then transition to confirmation screen (fade/slide with Framer Motion)
Positioning Strategy (Important)

This flow intentionally:

Reframes the CTA from “booking a call” → “applying for onboarding”
Creates scarcity and exclusivity
Increases perceived value of the service
Filters for more committed, higher-quality leads
Key Implementation Notes
Do NOT redirect to external tools (e.g. Calendly) in this flow
Keep everything inside the modal for a smooth, controlled experience
Email sending must be handled server-side (never expose credentials client-side)
Screenshot generation happens client-side before submission

---

### Handling Missing/Optional Data — Fallback Rules

These rules must be implemented in `previewBuilder.ts` and respected throughout `PreviewMock.tsx`. The mock must never break or render empty sections.

| Data | Fallback |
|---|---|
| No images uploaded | Use `profile.defaultFallbackImages` from `previewConfig.ts` — always provide at least 3 stock-like public/ image paths per studio type |
| No location entered | Use "your city" as placeholder token value — resolves to "your studio in your city" etc. |
| No handle/name | Use "Your Studio" as the display name |
| Color extraction fails | Return `[]` — theme colors apply unchanged |
| Feature deactivated | Corresponding mock section is hidden (conditional rendering via `data.activeFeatures`) |
| No vibe selected | Use `profile.defaultVibe` from the studio profile |
| Single uploaded image | Use it as hero; fill gallery with fallback images |
| Studio type = 'other' | Use the 'fitness' profile as the base — it is the most generic |

---

### Animation Rules for Step 3

Follow all CLAUDE.md animation rules — always use Framer Motion, never raw CSS transitions.

**Preview reveal sequence (staggered, runs once on mount):**
1. `motion.div` for the whole Step 3 layout: `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` duration 0.4s
2. Conversion panel: slides in from left — `initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}` delay 0.2s
3. Preview mock: slides in from right — `initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}` delay 0.3s
4. Each bullet in the personalization callout: staggered `opacity: 0 → 1` with 0.1s increments, starting at delay 0.5s
5. CTA button: `initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}` delay 0.6s

**Hover on CTA button:**
`whileHover={{ scale: 1.02 }}` + `whileTap={{ scale: 0.98 }}`

**Do not animate the mock content sections individually** — the mock is a static render inside a scrollable frame. Animating its internals would feel noisy and slow.

---

### CTAModal.tsx — Orchestration

CTAModal owns the `FlowData` state and passes slices to each step as props. It also controls step transitions.

```ts
// State shape inside CTAModal
const [step, setStep] = useState<1 | 2 | 3>(1);
const [flowData, setFlowData] = useState<Partial<FlowData>>({});
```

Step transitions:
- Step 1 → Step 2: triggered by "Continue" button, validate that handle + studioType are filled
- Step 2 → Step 3: triggered by "Build my preview" button click — pass full flowData to Step3
- Back navigation (Step 2 → Step 1): always allowed without data loss — flowData persists in CTAModal state
- No back navigation from Step 3 — the preview is the terminal state of the funnel

Progress bar (2-step, shown on steps 1 and 2, hidden on step 3):
- Two segments, `rounded-full`, 4px tall
- Step 1 active: first segment accent color, second grey
- Step 2 active: both segments accent color
- Use `motion.div` width transition: `animate={{ width: step === 1 ? '50%' : '100%' }}`

Modal close button:
- Always visible (top-right × button)
- On close: reset `step` to 1 and `flowData` to `{}`

Step transitions inside the modal:
- Use `AnimatePresence mode="wait"` wrapping the active step
- Each step: `initial={{ opacity: 0, x: 20 }} animate={{ opacity: 0, x: 0 }} exit={{ opacity: 0, x: -20 }}` duration 0.25s

---

### TypeScript Strictness Requirements

These are required by CLAUDE.md:
- No `any` types — use proper interfaces throughout
- All props interfaces explicitly typed
- `FlowData` fields that are optional before Step 2 use `Partial<FlowData>` in CTAModal state — cast to full `FlowData` before passing to `buildPreviewData`
- `StudioType` and `Vibe` are string literal union types — not enums (enums compile oddly in some Next.js configs)
- All Framer Motion `variants` objects typed with `Variants` from `"framer-motion"`

---

### Comments Requirement (from CLAUDE.md)

Every file must be commented as if the reader only knows Python, HTML, and CSS. Required comment locations:

In `colorExtractor.ts`:
- Why Canvas API is used instead of an external service
- What getImageData() returns and how the pixel array is structured (RGBA format)
- Why near-white and near-black buckets are filtered out

In `previewConfig.ts`:
- Why token replacement is used instead of direct string interpolation
- What the `highlighted` boolean on PricingTier controls

In `previewBuilder.ts`:
- Why `Promise.all` is used for the delay + data fetch
- What the fallback hierarchy is and why it's structured this way

In `PreviewMock.tsx`:
- Why inline styles are only used for extracted colors (Tailwind can't handle dynamic hex values)
- What `bg-cover bg-center` does
- Why the h2 is used instead of h1 in the hero section

In `Step3.tsx`:
- Why `AnimatePresence` is needed for the loading → preview transition
- What `mode="wait"` does
- Why the minimum 3-second delay exists (UX trust, not just load time)

---

### Verification Checklist

Before considering the implementation complete, verify each item:

- [ ] `"use client"` present on all components using hooks or browser APIs
- [ ] No `any` types used anywhere
- [ ] No `<div onClick>` — only `<button>` for interactive elements
- [ ] No raw `<img>` tags — `next/image` used OR inline base64 background styles (allowed for dynamic user-uploaded images that Next.js Image cannot handle)
- [ ] No raw CSS transitions — all animations via Framer Motion
- [ ] No inline styles except the two documented exceptions: extracted color overrides and hero background image URL
- [ ] `PreviewMock.tsx` never uses h1
- [ ] All mock sections conditionally rendered based on `data.activeFeatures`
- [ ] `buildPreviewData` always returns a valid `PreviewData` — no section can receive `undefined`
- [ ] Loading animation minimum 3 seconds enforced via `Promise.all`
- [ ] Color extraction failure is silently caught — never throws to the UI
- [ ] Fallback images exist in `public/` for all 8 studio types (3 images each)
- [ ] Modal close resets all state
- [ ] CTA button in Step 3 uses Axis Electric Blue (#0033FF), not vibe theme accent
