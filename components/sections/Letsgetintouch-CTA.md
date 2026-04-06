# Letsgetintouch_CTA

## Feature: Contact CTA Flow in AboutSection

### Overview
In the About section @components/sections/AboutmeSection.tsx, there is a "Let's get in touch" CTA button. When the user clicks it, a contact form expands inline (within the section, not a modal) with three fields and a send button. On submit, the form animates out and a confirmation message fades in.

---

### 1. Frontend — `components/sections/AboutSection.tsx`

Add a contact form flow triggered by the existing "Let's get in touch" button.

**Form fields (expand in place when CTA is clicked):**
1. **Email** — text input, type="email", placeholder "your@email.com"
2. **WhatsApp** — text input, type="tel", placeholder "+1 234 567 8900"
3. **Message** — textarea, placeholder "Tell me about your studio…"
4. **Send** button — submits the form

**Behavior:**
- When the CTA is clicked, the button itself either hides, and the three fields animate in using Framer Motion (stagger each field with a slight delay, slide up + fade in).
- On submit: validate that all three fields are non-empty and email is valid. Show inline field errors if not.
- While submitting: disable the Send button and show a subtle loading state (animated dots).
- On success: animate the form fields OUT (stagger out, slide down + fade out using Framer Motion). Then animate IN a confirmation message: **"Thanks for contacting me! I'll come back to you in the next 24 hours."** — styled in Playfair Display, centered, with a subtle Electric Blue underline or accent.
- On error: show an error message below the Send button: "Something went wrong. Please try again."

**Component state to manage:**
- `formState`: "idle" | "open" | "submitting" | "success" | "error"
- Three controlled input values: email, whatsapp, message
- Field-level validation errors

**Framer Motion notes:**
- Use `AnimatePresence` to mount/unmount the form and confirmation message
- Stagger form fields in with `variants` + `staggerChildren` on the container
- Exit animation for fields: fade out + slide down
- Entry animation for confirmation: fade in + slight scale up from 0.97

---

### 2. API Route — `app/api/contact/route.ts`

Create a new API route that receives the form data and sends an email via Resend.

**Endpoint:** POST `/api/contact`

**Request body (JSON):**
```json
{
  "email": "string",
  "whatsapp": "string",
  "message": "string"
}
```

**Logic:**
- Import `Resend` from `"resend"` (already installed — do NOT install anything new without asking)
- Instantiate with `process.env.RESEND_API_KEY`
- Send an email to `process.env.OWNER_EMAIL`
- Email subject: `"New contact from AXIS website"`
- Email body (plain HTML is fine):
