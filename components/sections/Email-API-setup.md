# Email API setup
---

## Goal

When a user clicks the "start onboarding" button in Step 3 of the CTAModal, open a final inline panel that collects their email and WhatsApp number, then sends a summary email to the site owner containing every answer the user gave across all three steps.

No new packages unless strictly necessary. No backend server. Use a free transactional email service that works via a simple HTTP POST with no SDK — **Resend** (resend.com) is preferred. It requires one API key stored in `.env.local` as `RESEND_API_KEY` and accepts a plain JSON POST to `https://api.resend.com/emails`. No npm install needed — use native `fetch`.

---

## 1. Contact fields — Step 3 UI change

In `Step3.tsx`, replace the `onBook` button with the following inline flow:

**Default state:** show the "Start onboarding" button as currently designed.

**On click:** the button disappears and a contact form slides in using `AnimatePresence` + `motion.div` (`initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`).

The form contains:
- A small heading: "Almost there — how should we reach you?"
- Field 1: Email address — `type="email"`, placeholder "your@email.com", label "Your email"
- Field 2: WhatsApp number — `type="tel"`, placeholder "+32 55 1234 5678", label "Your WhatsApp"
- Submit button: "Apply" — Axis Electric Blue (#0033FF), full width
- Below submit: "Free setup. No commitment." in small muted text

**Validation (inline, no library):**
- Email: must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- WhatsApp: must be at least 7 characters after stripping spaces
- Show a small red error message directly below the failing field on submit attempt
- Never show errors before the user first attempts to submit

**Loading state:** while the API call is in flight, disable the button and show a subtle spinner (a `motion.div` rotating ring, same pattern as the Step 2 loading animation) inside the button. Button text changes to "Sending…"

**Success state:** the form fades out, replaced by the remaining CTA flow already imlpemented:
- Large checkmark
- Text: Application received.

We review each studio personally to ensure we're a match.

You'll hear back from us within 24 hours with the next steps for onboarding.

**Error state:** if the API call fails, show a small red banner above the submit button: "Something went wrong — please try WhatsApp directly." with a fallback WhatsApp link (use a prop `ownerWhatsApp: string` passed down from CTAModal).

---

## 2. API Route — `app/api/send-lead/route.ts`

Create a Next.js App Router API route at `app/api/send-lead/route.ts`.

This is a **Server Component route** — no `"use client"`. It receives a POST request with a JSON body and sends one email via Resend.

**Request body shape** — define this interface in the route file:

```ts
interface LeadPayload {
  // Contact
  email: string;
  whatsapp: string;

  // Step 1
  handle: string;
  studioType: string;
  location: string;
  problems: string[];   // human-readable labels, not indices
  goals: string[];      // human-readable labels, not indices

  // Step 2
  vibe: string;
  activeFeatures: string[]; // human-readable feature labels, not indices
  uploadedImageCount: number; // just the count — do NOT send base64 images over email

  // Meta
  submittedAt: string; // ISO timestamp from client: new Date().toISOString()
}
```

**Route logic:**
1. Parse the JSON body with `await request.json()`
2. Validate that `email` and `whatsapp` are present — return `400` if missing
3. Build the email HTML (see below)
4. POST to `https://api.resend.com/emails` with `Authorization: Bearer ${process.env.RESEND_API_KEY}`
5. If Resend returns a non-2xx status, return `500` with `{ error: 'Email failed' }`
6. On success return `200` with `{ success: true }`
7. Wrap everything in try/catch — never let the route throw unhandled

**Email HTML template** — build as a template literal string, no JSX, no email library:

Subject line: `New lead: {handle} — {studioType} in {location}`

Body structure (clean, readable plain HTML — no external CSS, inline styles only since email clients strip `<style>` tags):

```
[Header bar — dark background #000, white text, padding 24px]
  "New studio lead via Axis"
  Timestamp: {submittedAt formatted as readable local date}

[Section: Contact]
  Email: {email}
  WhatsApp: {whatsapp}

[Section: Studio]
  Name / Handle: {handle}
  Type: {studioType}
  Location: {location}

[Section: Their problems]
  Bulleted list of {problems}

[Section: Their goals]
  Bulleted list of {goals}

[Section: Website preferences]
  Vibe: {vibe}
  Features requested: bulleted list of {activeFeatures}
  Photos uploaded: {uploadedImageCount}

[Footer — muted grey, small text]
  "Sent automatically by Axis CTA flow"
```

Use a max-width of 600px, `font-family: sans-serif`, and a clean card layout. Each section has a light grey background (`#f5f5f5`) with 16px padding and 8px border-radius. Section headings in bold with a 2px left border in Electric Blue (`#0033FF`).

**Environment variable:** Read the owner's recipient email from `process.env.OWNER_EMAIL`. Add both `RESEND_API_KEY` and `OWNER_EMAIL` to `.env.local`. Never hardcode either value. Add both keys to `.env.example` with placeholder values and a comment explaining each.

---

## 3. Client-side submission — inside Step3.tsx

When the user submits the contact form:

1. Resolve human-readable labels for problems, goals, and features — do NOT send raw index arrays. Map indices back to their label strings using the same label arrays defined in `previewConfig.ts` or a shared constants file. Never duplicate label strings.
2. Build the `LeadPayload` object
3. Call:
```ts
const res = await fetch('/api/send-lead', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```
4. Handle success and error states as described in section 1
5. Do NOT send the base64 image data — only `uploadedImageCount`

---

## 4. Verification checklist

Before finishing, confirm every item:

- [ ] `app/api/send-lead/route.ts` has NO `"use client"` — it is a server route
- [ ] `RESEND_API_KEY` and `OWNER_EMAIL` are read from `process.env` — never hardcoded
- [ ] `.env.example` exists with both keys as placeholders
- [ ] No base64 image data is sent in the POST body
- [ ] Index arrays are resolved to human-readable strings before sending
- [ ] Inline validation runs on submit only — no premature errors
- [ ] Loading, success, and error states are all handled
- [ ] The API route returns proper HTTP status codes (200, 400, 500)
- [ ] The entire route is wrapped in try/catch
- [ ] No new npm packages installed without asking
