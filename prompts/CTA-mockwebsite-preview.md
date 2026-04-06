Build a MockWebsitePreview component for a SaaS lead funnel and CTA flow.
This component simulates what a fitness studio's website would look like,
using real data images from the user's input plus intelligent placeholders.

## Tech Stack and Rules:
Read CLAUDE.md first. Then read:
- @skills/component.md
- @skills/animate-section.md
- @skills/seo.md

---

## CONTEXT

This component is part of a SaaS landing page for a product that builds professional websites for fitness and boutique sports studios. The landing page targets studio owners who currently rely on Instagram for their entire online presence and have no proper website. The primary goal of the landing page is to convert cold visitors into booked discovery calls. To achieve this, the page uses a multi-step modal funnel — the CTA flow — which is triggered when a visitor clicks the main call-to-action button on the landing page. The funnel has three steps: Step 1 collects the visitor's Instagram handle, their studio type and biggest challenges, Step 2 is titles "Building your preview" and gives the user the possibility to upload up to three images/instagram posts, branding images etc, and Step 3 reveals a personalized mock website preview alongside a call-to-action to book a setup call. The component you are building now — MockWebsitePreview — is the centerpiece of Step 3. It is the visual payoff of the entire funnel: the moment the visitor sees what their studio's website could look like, built from their real Instagram data. This component will be embedded inside the Step 3 panel of the modal, receiving previewData fetched from the Instagram handle and studioType collected in Step 1. The modal flow itself, the step transitions, the progress bar, and the lead capture logic will be built as a separate subsequent step. For now, this prompt focuses exclusively on building MockWebsitePreview as a standalone, self-contained component that can be developed and visually tested in isolation before being integrated into the full funnel.

## FILE STRUCTURE TO CREATE9

/app
  /api
    /preview
      route.ts              ← calls Instagram oEmbed, returns preview data
/components
  /mock-preview
    MockWebsitePreview.tsx  ← root component, receives previewData + studioType
    MockHeader.tsx          ← site header with profile photo + studio name + nav
    MockHero.tsx            ← hero banner from real post thumbnail
    MockGrid.tsx            ← categorized Instagram grid (News / Promotions / Events)
    MockSchedule.tsx        ← class schedule with book buttons
    MockMembership.tsx      ← 3 membership cards
    MockBrandProvider.tsx   ← context: holds extracted brand colors
    ColorThief.ts           ← utility: extracts dominant color from image via Canvas
/lib
  studioClasses.ts          ← maps studio type → class names array
  formatHandle.ts           ← "@flex_studio_mx" → "Flex Studio Mx"
  previewTypes.ts           ← TypeScript interfaces for all preview data

---

## TYPESCRIPT INTERFACES
Create /lib/previewTypes.ts with:

interface PreviewData {
  handle: string
  displayName: string
  profilePhotoUrl: string
  heroImageUrl: string | null    // first real post thumbnail from oEmbed
  bio: string | null
}

interface BrandColors {
  primary: string               // extracted dominant color (hex)
  primaryLight: string          // same color at 15% opacity for backgrounds
  primaryDark: string           // darkened version for text/contrast
  gradient: string              // CSS gradient string for tile placeholders
  textOnPrimary: string         // "white" or "black" depending on luminance
}

interface MockPreviewProps {
  previewData: PreviewData
  studioType: string            // must match keys in studioClasses.ts
  brandColors: BrandColors      // passed down after client-side extraction
}

---

## API ROUTE: /app/api/preview/route.ts

Method: POST
Input body: { handle: string }

Logic:
1. Sanitize: strip @, lowercase, trim whitespace
2. Call Instagram oEmbed:
   GET https://graph.facebook.com/v18.0/instagram_oembed
     ?url=https://www.instagram.com/{handle}/
     &access_token={process.env.INSTAGRAM_APP_ID}|{process.env.INSTAGRAM_APP_SECRET}
     &fields=author_name,thumbnail_url
   
3. get INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET from .env
   
4. FALLBACK: if oEmbed fails (private account, typo, rate limit)
- ask the user if there is a typo in the instagram handle
- If the handle still does not work, return mock data derived from handle string. Never return an error
   to the client — always return something renderable.

3. Format response as PreviewData:
   {
     handle: sanitizedHandle,
     displayName: formatHandle(sanitizedHandle),    // from /lib/formatHandle.ts
     profilePhotoUrl: data.thumbnail_url ?? null,
     heroImageUrl: data.thumbnail_url ?? null,      // same image used as hero
     bio: null                                       // oEmbed doesn't provide bio
   }

4. Return PreviewData as JSON

FALLBACK mock generation when oEmbed fails:
   displayName: formatHandle(handle)
   profilePhotoUrl: null         (component will render initials avatar)
   heroImageUrl: null            (component will render gradient hero)
   bio: null

---

## UTILITY: /lib/formatHandle.ts

Function: formatHandle(handle: string): string
- Input: "flex_studio_mx" or "flexstudiomx" or "flex.studio"
- Split on _ and .
- Capitalize each word
- Join with spaces
- Output: "Flex Studio Mx"

---

## UTILITY: /lib/studioClasses.ts

Export a map: Record<string, string[]>
Keys (lowercase, match Step 2 pill button values exactly):
  "pilates" | "yoga" | "dance" | "boxing" | "personal training" |
  "boutique fitness" | "crossfit" | "martial arts" | "swimming" |
  "cycling" | "gymnastics" | "aerial" | "functional fitness" |
  "meditation" | "rehabilitation" | "rowing" | "triathlon" |
  "kids" | "other"

Each key maps to an array of 6 class name strings.
"other" maps to: ["Morning Session", "Evening Class", "Beginner Workshop",
                  "Advanced Training", "Open Session", "Private Booking"]

Also export: function getClasses(studioType: string): string[]
- Lowercase and trim input before lookup
- Return "other" array if no match found

---

## UTILITY: /components/mock-preview/ColorThief.ts

Function: extractBrandColors(imageUrl: string): Promise<BrandColors>

Logic:
1. Create an HTMLImageElement, set crossOrigin = "anonymous", set src = imageUrl
2. On load, draw to an offscreen HTMLCanvasElement (50x50px — small for performance)
3. Read pixel data via getImageData
4. Sample every 4th pixel (RGBA), collect all RGB values
5. Filter out near-white (R>240 && G>240 && B>240) and near-black (R<15 && G<15 && B<15)
6. For remaining pixels, convert RGB to HSL
7. Filter for saturation > 20% (discard greys)
8. Group by hue in 30-degree buckets, find the largest bucket
9. Take the average color of the largest bucket as the dominant color
10. Convert back to hex: primary

Derive palette from primary hex:
  primaryLight: primary at 15% opacity → "rgba(r,g,b,0.15)"
  primaryDark: reduce lightness by 30% in HSL space → hex
  gradient: "linear-gradient(135deg, {primary}, {hueShift30deg})"
  textOnPrimary: calculate relative luminance of primary
                 if luminance > 0.4 → "black", else → "white"

FALLBACK: if image fails to load or canvas throws (CORS):
  return default palette: primary "#6366f1" (indigo), derive rest from that

---

## COMPONENT: MockBrandProvider.tsx

React context provider.
Accepts: previewData.profilePhotoUrl
On mount, calls extractBrandColors(profilePhotoUrl) asynchronously.
While loading: provides default indigo palette.
After extraction: provides real extracted palette.
All child components consume brand colors from this context via useBrandColors() hook.

---

## COMPONENT: MockWebsitePreview.tsx (root)

This is the phone-frame wrapper. It:
- Renders a CSS phone mockup frame (375px wide, 812px tall, rounded-[40px] border,
  notch at top, home indicator bar at bottom — all pure CSS/Tailwind)
- Inside the frame, renders a scrollable content area (overflow-y-scroll,
  hide scrollbar with scrollbar-hide utility)
- Renders children in order:
  1. MockHeader
  2. MockHero
  3. MockGrid
  4. MockSchedule
  5. MockMembership
- Wraps everything in MockBrandProvider

The entire component should NOT have a visible scrollbar but should be
scrollable by the user to explore the mock site.

A small label sits ABOVE the phone frame (outside it):
  "↓ Scroll to explore your site preview"
in small grey text with a subtle bounce animation on the arrow.

---

## COMPONENT: MockHeader.tsx

Layout: sticky top-0, white background, z-10, subtle bottom border

Left side:
- Circular profile photo (40px diameter) with 2px border in brand primary color
- If profilePhotoUrl is null: render initials circle (first 2 chars of displayName,
  background = brand primary, text = textOnPrimary)

Right side of photo:
- Studio display name in font-semibold text-sm
- Tagline below in text-xs text-gray-400: "Book · Train · Grow"

Navigation row below (full width, flex, justify-around):
- Three text links: "Classes" · "Pricing" · "Book"
- "Book" link has background = brand primary, text = textOnPrimary,
  rounded-full, px-3 py-0.5 — visually distinct as CTA

---

## COMPONENT: MockHero.tsx

Full-width section, aspect-ratio 16/9, relative positioned.

If heroImageUrl exists:
- Background: img tag with object-cover, full width/height
- Overlay: absolute inset-0 bg-gradient-to-t from-black/70 to-transparent

If heroImageUrl is null:
- Background: brand gradient (CSS linear-gradient from brandColors.gradient)
- Same overlay

Over the image/gradient, bottom-aligned text:
- Headline: "Book your first class today." in white, text-xl font-bold
- Sub: "Online booking · Memberships · Flexible schedules" in white/70, text-xs
- Small CTA pill: "See classes ↓" — background brand primary,
  text textOnPrimary, rounded-full text-xs px-3 py-1

---

## COMPONENT: MockGrid.tsx

Three labeled rows. Each row:
- Row label: uppercase text-[10px] font-semibold tracking-widest
  color = brand primary, with a 1px bottom border in primaryLight
- Horizontal scroll strip of 3 tiles, each tile:
  - Aspect ratio 1:1, width ~28% of container, flex-shrink-0
  - rounded-lg overflow-hidden
  - Background: brand gradient (all tiles same gradient, different opacity)
    NEWS tiles: 100% opacity
    PROMOTIONS tiles: 80% opacity + slightly warmer hue shift (add 15deg to hue)
    EVENTS tiles: dark overlay treatment (add semi-transparent black layer)
  - If heroImageUrl exists: use it as background for NEWS tile 1 only
    (object-cover, grayscale-0). All others remain gradient.
  - Each tile has a subtle inner label at the bottom:
    NEWS: small white text "Latest update"
    PROMOTIONS: small white text "Special offer"
    EVENTS: small white text "Upcoming"
  - Tiles should NOT have scrollbars — the row itself scrolls horizontally

Spacing: gap between rows = py-3. Section title above first row: "Studio Feed"
in text-sm font-semibold text-gray-700.

---

## COMPONENT: MockSchedule.tsx

Section title: "This Week's Classes" in text-sm font-semibold text-gray-700

Receive studioType prop. Call getClasses(studioType) to get 6 class names.
Display first 4 classes (to fit in mock without excessive scroll).

Each class card (full width, flex row, items-center, justify-between):
- Left:
  - Color dot (8px circle, background = brand primary)
  - Class name in text-xs font-medium
  - Below: day + time placeholder in text-[10px] text-gray-400
    (use realistic fake times: "Mon 7:00am", "Tue 9:00am", "Wed 6:30pm", "Fri 8:00am"
     — derived deterministically from class index so always consistent)
- Right:
  - "Book" button: text-[10px], border border-brand-primary,
    text brand-primary, rounded-full px-2 py-0.5, hover not needed (it's a mock)

Cards separated by a 1px divider in gray-100.

---

## COMPONENT: MockMembership.tsx

Section title: "Memberships" in text-sm font-semibold text-gray-700

Three cards in a horizontal scroll row (same pattern as grid tiles but taller):

CARD A — "Drop-In"
- Label: "Drop-In"
- Price: "$25"
- Sub: "Single class"
- Feature list (text-[10px] text-gray-500):
  · 1 class of your choice
  · Book up to 24h in advance
  · No commitment
- CTA button: outlined, brand primary border + text, "Book class"

CARD B — "Class Pack" (visually highlighted — this is the recommended card)
- Label: "10 Class Pack"
- Badge top-right: "Popular" — background brand primary, text textOnPrimary,
  text-[9px] rounded-full px-1.5
- Price: "$199"
- Sub: "Valid 30 days"
- Feature list:
  · 10 classes of your choice
  · Book anytime online
  · Share with a friend
- CTA button: filled brand primary background, textOnPrimary text, "Get pack"

CARD C — "Unlimited"
- Label: "Unlimited"
- Price: "$149/mo"
- Sub: "Monthly membership"
- Feature list:
  · Unlimited classes
  · Priority booking
  · Member discounts
- CTA button: outlined, "Subscribe"

Card styling: rounded-xl, shadow-sm, p-3, min-w-[140px], flex-shrink-0
All cards same height via items-stretch on the parent flex row.

---

## INTEGRATION NOTE (for CTA flow — next build step)

MockWebsitePreview receives these props:
  previewData: PreviewData       (from /api/preview response)
  studioType: string             (from Step 2 pill selection)

It does NOT need problems or clientCount — those are used elsewhere in the funnel.

The parent CTA modal (to be built separately) will:
1. Call /api/preview after Step 1 handle submission
2. Store previewData in modal state
3. Collect studioType in Step 2
4. Pass both into <MockWebsitePreview> in Step 3

MockWebsitePreview is fully self-contained and can be developed and tested
independently by passing mock previewData props directly.

For isolated testing, create /app/preview-test/page.tsx that renders
MockWebsitePreview with hardcoded test data so the component can be
visually QA'd without running the full funnel flow.

---

## ANIMATION REQUIREMENTS (Framer Motion)

MockWebsitePreview entrance:
- Whole phone frame: initial opacity-0 scale-95, animate to opacity-1 scale-100
- Duration 400ms, ease "easeOut"
- Delay 200ms (after skeleton disappears)

Section stagger inside the mock:
- Each section (Header, Hero, Grid, Schedule, Membership) fades in
  sequentially with 100ms stagger between them
- Use Framer Motion variants with staggerChildren

Skeleton state:
- Before previewData arrives: render SkeletonPreview (separate component)
- SkeletonPreview mirrors the exact layout but all content areas are
  grey rounded rectangles with CSS shimmer animation
- Shimmer: background linear-gradient animating from left to right
  using @keyframes, no Framer Motion needed for shimmer itself
- Transition from skeleton to real: AnimatePresence with fade

---

## ENV VARIABLES REQUIRED
INSTAGRAM_APP_ID=your_facebook_app_id
INSTAGRAM_CLIENT_TOKEN=your_client_token

---

## QUALITY REQUIREMENTS
- All text inside the mock should be tiny (text-xs or smaller) because
  it lives inside a phone frame — this makes it look realistic
- No Tailwind classes that don't exist in base Tailwind (no arbitrary
  brand color classes — use inline styles for dynamic brand colors)
- The mock must be fully static after render — no interactive click
  handlers inside the mock (it is a preview, not a real site)
- Mobile-first: the phone frame itself should scale down on small screens
  using transform: scale() so it always fits without overflow
- All components must be individually importable and testable in isolation

---

## TESTING IN DEVELOPMENT

To test without a live approved app:
1. Create a Facebook Developer account at developers.facebook.com
2. Create a new app → select "None" as app type → name it anything
3. Add the oEmbed product from the App Dashboard
4. Go to Settings → Advanced → copy the Client Token
5. Combine as: APP_ID|CLIENT_TOKEN in your .env.local
6. The oEmbed endpoint for specific post URLs works immediately 
   in development mode — no app review needed for this use case
7. Test with any public Instagram post URL

The app does NOT need to be switched to Live mode for this specific 
oEmbed use case during development and early production testing.
Verify this with a test curl before building:

curl "https://graph.facebook.com/v19.0/instagram_oembed
  ?url=https://www.instagram.com/p/YOUR_TEST_POST_ID/
  &fields=thumbnail_url,author_name
  &access_token=YOUR_APP_ID|YOUR_CLIENT_TOKEN"

If this returns thumbnail_url and author_name, your setup is complete.

curl "https://graph.facebook.com/v19.0/instagram_oembed
  ?url=https://www.instagram.com/p/DJ3V4het2iDjth0iZXI63s0MCqgJ1cIzemmFHA0/
  &fields=thumbnail_url,author_name
  &access_token=1549321752832101|d4912c1a6e0f9f564e3f06f034cefe23"
  
  https://www.instagram.com/p//?img_index=1

