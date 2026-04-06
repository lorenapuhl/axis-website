## IMAGE HANDLING PIPELINE

### If user uploads images:

1. Client-side resize before upload:
   - Use browser Canvas API to resize each image to max 1200px
     on longest side before sending to server
   - Preserves aspect ratio, reduces payload size significantly
   - Convert to base64 or FormData blob for upload

2. POST to /api/preview as multipart/form-data:
   Fields: { handle: string, images: File[] }

3. Server (/api/preview/route.ts):
   - Receive files via formData()
   - Save temporarily to /tmp/{sessionId}/ 
     (Vercel: use /tmp, self-hosted: use /tmp or uploads dir)
   - OR: upload directly to Vercel Blob / Uploadthing and return
     public URLs — prefer this for production
   - Return array of accessible image URLs back to client

4. Client receives { imageUrls: string[], displayName: string }
   - First URL → heroImageUrl
   - Remaining URLs → gridImageUrls (max 2)
   - Pass all to MockBrandProvider for color extraction

### If user uploads NO images (fallback):

Use local placeholder images from /public/mock-website/{studioType}/
studioType is NOT yet known at Step 1 — it is collected in Step 2.

Resolution order:
- Step 1 completes → store handle, store uploadedImageUrls (may be empty)
- Step 2 completes → studioType is now known
- Step 3 renders → if uploadedImageUrls is empty, load fallback images
  based on studioType

Fallback image loading (client-side, no API call needed):
  const fallbackImages = [
    `/mock-website/${studioType}/image1.jpg`,
    `/mock-website/${studioType}/image2.jpg`,
    `/mock-website/${studioType}/image3.jpg`,
  ]
  heroImageUrl = fallbackImages[0]
  gridImageUrls = fallbackImages[1], fallbackImages[2]

---

## PUBLIC FOLDER STRUCTURE

Populate the following folders with 3–6 high-quality royalty-free
fitness photos each. Source from Unsplash or Pexels.
Name files consistently: image1.jpg through image6.jpg

/public/mock-website/
  /pilates/
    image1.jpg   ← reformer or mat class, clean studio
    image2.jpg   ← instructor adjusting student
    image3.jpg   ← close-up of movement or pose
    image4.jpg
    image5.jpg
    image6.jpg
  /yoga/
    image1.jpg through image6.jpg
  /boxing/
    image1.jpg through image6.jpg
  /dance/
    image1.jpg through image6.jpg
  /personal-training/
    image1.jpg through image6.jpg
  /boutique-fitness/
    image1.jpg through image6.jpg
  /crossfit/
    image1.jpg through image6.jpg
  /martial-arts/
    image1.jpg through image6.jpg
  /swimming/
    image1.jpg through image6.jpg
  /cycling/
    image1.jpg through image6.jpg
  /gymnastics/
    image1.jpg through image6.jpg
  /aerial/
    image1.jpg through image6.jpg
  /functional-fitness/
    image1.jpg through image6.jpg
  /meditation/
    image1.jpg through image6.jpg
  /rehabilitation/
    image1.jpg through image6.jpg
  /rowing/
    image1.jpg through image6.jpg
  /triathlon/
    image1.jpg through image6.jpg
  /kids/
    image1.jpg through image6.jpg
  /other/
    image1.jpg through image6.jpg   ← generic fitness/studio photos

Folder name must match the studioType key used in studioClasses.ts
exactly (lowercase, hyphenated).

---

## UPDATED API ROUTE: /app/api/preview/route.ts

Method: POST
Content-Type: multipart/form-data
Input fields:
  handle: string
  images: File[] (0–3 files, optional)

Logic:

1. Parse formData:
   const formData = await request.formData()
   const handle = formData.get('handle') as string
   const imageFiles = formData.getAll('images') as File[]

2. Sanitize handle → displayName via formatHandle()

3. If imageFiles.length > 0:
   For each file:
   - Validate type (image/jpeg, image/png, image/webp only)
   - Validate size (< 5MB)
   - Upload to Vercel Blob:
     import { put } from '@vercel/blob'
     const blob = await put(filename, file, { access: 'public' })
     return blob.url
   - Collect all blob URLs into imageUrls[]

4. If imageFiles.length === 0:
   - Return imageUrls: []
   - Client will use fallback images from /public/mock-website/

5. Return PreviewData:
   {
     handle: sanitizedHandle,
     displayName: string,
     imageUrls: string[],    // empty array if no uploads
     hasUploads: boolean
   }

ENV VARIABLES REQUIRED:
  BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

NOTE: If not using Vercel Blob, replace with Uploadthing or simply
save to /tmp and return a local path. For development, /tmp works fine.

---

## UPDATED COLOR EXTRACTION — ColorThief.ts + MockBrandProvider.tsx

Color extraction now sources from uploaded images OR fallback images.
The logic is identical in both cases — you always have an image URL to
analyze. The only difference is the source of that URL.

MockBrandProvider receives: heroImageUrl (either uploaded or fallback)

Extraction pipeline (unchanged from original spec):
1. Load heroImageUrl into HTMLImageElement, crossOrigin = "anonymous"
2. Draw to 50×50 offscreen Canvas
3. Sample every 4th pixel, collect RGB values
4. Filter near-white (R>240 && G>240 && B>240) → discard
5. Filter near-black (R<15 && G<15 && B<15) → discard
6. Convert to HSL, filter saturation < 20% → discard
7. Bucket by hue in 30° increments, find largest bucket
8. Average the bucket → dominant color → primary hex
9. Derive full palette:
   primaryLight:   rgba(r,g,b,0.15)
   primaryDark:    lightness −30% in HSL
   gradient:       linear-gradient(135deg, primary, hue+30°)
   textOnPrimary:  luminance > 0.4 → "black", else → "white"

FALLBACK palette (if image fails to load or Canvas throws):
  Use a neutral palette seeded from the studioType string:
  - pilates → slate blue  #6B7FD4
  - yoga    → sage green  #7DAF8F
  - boxing  → deep red    #C44B3A
  - dance   → warm rose   #D4748A
  - cycling → electric blue #4A90D9
  - other   → indigo      #6366F1
  Define a STUDIO_DEFAULT_COLORS map in ColorThief.ts for this.

---

## UPDATED MOCK GRID — MockGrid.tsx

Grid structure: NEWS · PROMOTIONS · EVENTS (3 rows × 3 tiles each)

Image source priority per tile:
  NEWS row:
    Tile 1 → imageUrls[0] (hero — uploaded or fallback)
    Tile 2 → imageUrls[1] if exists, else gradient placeholder
    Tile 3 → imageUrls[2] if exists, else gradient placeholder

  PROMOTIONS row:
    All 3 tiles → gradient placeholders
    Use brand primary gradient at 85% opacity
    Subtle label: "Promotions · Coming soon"

  EVENTS row:
    All 3 tiles → gradient placeholders
    Use brand primaryDark gradient
    Subtle label: "Events · Coming soon"

Gradient placeholder generation for remaining tiles:
  Instead of a flat gradient, generate VARIED placeholders by
  slightly shifting the hue for each tile position:
  Tile position 0: primary hue
  Tile position 1: primary hue + 15°
  Tile position 2: primary hue + 30°
  Tile position 3: primary hue − 15°
  etc.
  This makes the grid look like a thoughtfully branded color palette
  rather than identical repeated tiles.

Real image tiles (uploaded or fallback):
  - background-image: url(imageUrl), object-cover
  - No attribution link needed (user owns their own uploaded images,
    fallback images are royalty-free from /public/)
  - Small camera icon badge bottom-right: opacity-40, white

---

## UPDATED HERO SECTION — MockHero.tsx

Source: imageUrls[0] (uploaded or fallback — always available)

If imageUrls[0] exists:
  - Full-width background image, aspect 16/9, object-cover
  - Overlay: bg-gradient-to-t from-black/70 to-transparent
  - Text overlay (bottom-aligned):
    Headline: "Book your first class today."
    Sub: "Online booking · Memberships · Flexible schedules"
    CTA pill: "See classes ↓" — brand primary background

If imageUrls[0] is null (should rarely occur given fallback):
  - Brand gradient background
  - Same text overlay

---

## UPDATED PREVIEWDATA INTERFACE — /lib/previewTypes.ts

interface PreviewData {
  handle: string
  displayName: string
  imageUrls: string[]        // uploaded image URLs or empty array
  hasUploads: boolean        // true if user uploaded, false if using fallback
}

interface MockPreviewProps {
  previewData: PreviewData
  studioType: string         // collected in Step 2
  brandColors: BrandColors   // derived after heroImageUrl resolved
}

The component resolves final image URLs internally:
  const heroImageUrl = previewData.imageUrls[0]
    ?? `/mock-website/${studioType}/image1.jpg`

  const gridImageUrls = [
    previewData.imageUrls[1] ?? `/mock-website/${studioType}/image2.jpg`,
    previewData.imageUrls[2] ?? `/mock-website/${studioType}/image3.jpg`,
  ]

This resolution logic lives in MockWebsitePreview.tsx so all child
components receive already-resolved URLs — they never need to know
whether the source was an upload or a fallback.

---

## INTEGRATION WITH CTA FLOW

Step 1:
  - User enters handle + optionally uploads 0–3 images
  - On CTA click: POST to /api/preview with formData
  - Store returned previewData in modal state
  - Advance to Step 2

Step 2:
  - User selects studioType (used for class names AND fallback images)
  - Store studioType in modal state
  - Advance to Step 3

Step 3:
  - MockWebsitePreview receives previewData + studioType
  - Resolves final image URLs (uploads or fallback by studioType)
  - MockBrandProvider extracts colors from heroImageUrl
  - Full mock renders with correct images and brand palette

---

## FILE STRUCTURE ADDITIONS

/app
  /api
    /preview
      route.ts              ← handles multipart upload + Vercel Blob
/public
  /mock-website/
    /pilates/               ← 6 royalty-free pilates images
    /yoga/                  ← 6 royalty-free yoga images
    /boxing/                ← 6 royalty-free boxing images
    /dance/                 ← 6 royalty-free dance images
    /personal-training/     ← 6 images
    /boutique-fitness/      ← 6 images
    /crossfit/              ← 6 images
    /martial-arts/          ← 6 images
    /swimming/              ← 6 images
    /cycling/               ← 6 images
    /gymnastics/            ← 6 images
    /aerial/                ← 6 images
    /functional-fitness/    ← 6 images
    /meditation/            ← 6 images
    /rehabilitation/        ← 6 images
    /rowing/                ← 6 images
    /triathlon/             ← 6 images
    /kids/                  ← 6 images
    /other/                 ← 6 generic fitness studio images
/components
  /mock-preview/
    MockWebsitePreview.tsx  ← resolves final imageUrls before passing down
    MockHeader.tsx
    MockHero.tsx
    MockGrid.tsx
    MockSchedule.tsx
    MockMembership.tsx
    MockBrandProvider.tsx
    ColorThief.ts           ← includes STUDIO_DEFAULT_COLORS fallback map
    SkeletonPreview.tsx
/lib
  previewTypes.ts
  studioClasses.ts
  formatHandle.ts

---

## ENV VARIABLES REQUIRED

BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

For local development without Vercel Blob:
  Save uploaded files to /tmp using Node fs
  Return a /api/image?file=filename route that serves them
  This avoids needing Blob credentials during development

---

## QUALITY AND SECURITY REQUIREMENTS

- Validate file type server-side (check magic bytes, not just extension)
- Validate file size server-side (max 5MB per file)
- Strip EXIF metadata from uploaded images before storing
  (use sharp or jimp: sharp(buffer).rotate().toBuffer())
- Never store uploaded files permanently — Vercel Blob TTL or
  manual cleanup after session ends
- Never expose raw /tmp paths to client
- All image URLs returned to client must be served over HTTPS
- Canvas color extraction must handle CORS: if image URL is from
  Vercel Blob it will be same-origin safe; fallback /public/ images
  are also same-origin safe — no crossOrigin issues expected

---

## TESTING WITHOUT UPLOADS

To test the fallback system during development:
1. Run the funnel without uploading any images
2. Select a studio type in Step 2 (e.g. "pilates")
3. Step 3 should render using /public/mock-website/pilates/image1.jpg
   as hero and image2.jpg/image3.jpg as grid tiles
4. Color extraction should run on image1.jpg and derive brand palette
5. Confirm all 19 studio type folders resolve correctly

To test with uploads:
1. Upload 1 image → hero is real, grid tiles 2+3 use fallback
2. Upload 2 images → hero + 1 grid tile are real, tile 3 uses fallback
3. Upload 3 images → all real images, no fallbacks needed
4. Confirm Color Thief extracts visually correct dominant color
   from each test image
