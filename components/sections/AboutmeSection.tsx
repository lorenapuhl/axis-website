"use client"
// "use client" must be the absolute first line.
// This component uses Framer Motion browser APIs — requires a Client Component
// in Next.js App Router. Server Components cannot run browser-side JS.

import Image from "next/image"
// motion — wraps standard HTML/SVG elements to make them animatable via Framer Motion
import { motion, AnimatePresence } from "framer-motion"
// Variants: TypeScript type for named animation state objects (e.g. "hidden" / "show").
// Without it, TypeScript widens literal strings like "easeOut" to `string`,
// which breaks Framer Motion's Easing union type.
import type { Variants } from "framer-motion"
// ReactNode: TypeScript type for anything renderable in JSX —
// strings, elements, arrays, fragments, etc.
import type { ReactNode } from "react"
import { useState } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

// Stat: one cell in the 2-column stats grid beneath the portrait.
// desc uses ReactNode so we can embed <strong> highlights inline.
type Stat = {
  num: string     // large credential or number, e.g. "M.Sc." or "5+"
  desc: ReactNode // description — may contain <strong> for keyword emphasis
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: stats + pills
// ─────────────────────────────────────────────────────────────────────────────

// Stats displayed in the 2-column grid beneath the portrait.
// The original HTML used a bold() notation — translated here to <strong>.
// text-white-axis: lifts highlighted keywords off the soft-grey body text.
const stats: Stat[] = [
  {
    num: "M.Sc.",
    desc: (
      <>
        <strong className="text-white-axis font-medium">Statistical Physics</strong>, Heidelberg (DE)
      </>
    ),
  },
  {
    num: "5+",
    desc: (
      <>
        Years of engineering{" "}
        <strong className="text-white-axis font-medium">data systems</strong>
      </>
    ),
  },
  {
    num: "5",
    desc: (
      <>
        <strong className="text-white-axis font-medium">Languages</strong> (DE, FR, EN, ES, NL)
      </>
    ),
  },
  {
    num: "6",
    desc: (
      <>
        <strong className="text-white-axis font-medium">Countries</strong> (DE, BEL, FR, HK, ES, MX)
      </>
    ),
  },
  {
    num: "6",
    desc: (
      <>
        <strong className="text-white-axis font-medium">Sports</strong> (Karate, Tennis, Swimming,
        Yoga, Dancing, Boxing)
      </>
    ),
  },
  {
    num: "100%",
    desc: (
      <strong className="text-white-axis font-medium">Automation-oriented</strong>
    ),
  },
]

// Skill/context pills shown in a flex-wrap row at the bottom of the right column.
const pills: string[] = [
  "Next.js Development",
  "Machine Learning Architecture",
  "Data Science and Statistics",
  "Business Automation",
  "UI/UX for SaaS",
  "Brussels / Mexico City",
]

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// Per animate-section.md: 0.7s default, ease "easeOut", stagger 0.12s.
// ─────────────────────────────────────────────────────────────────────────────

// containerVariants: applied to the parent wrapper.
// No visual change on the parent — its only job is to stagger its children.
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

// itemVariants: each staggered child fades in, rises 20px, AND grows from 95% scale.
// The scale-up reinforces that elements are "assembling" into place.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" as const } },
}

// formContainer: stagger the three form fields in on entry, then stagger them
// back out in reverse order on exit (staggerDirection: -1 reverses the sequence).
const formContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.07, staggerDirection: -1 } },
}

// formField: each individual form field slides up + fades in on entry,
// slides down + fades out on exit — matching the AXIS 0.4–0.8s timing range.
const formField: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.35, ease: "easeOut" as const } },
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutmeSection() {

  // ─── Contact form state ────────────────────────────────────────────────────
  // formState drives which UI block is rendered:
  //   idle       → CTA button visible, form hidden
  //   open       → form visible, button hidden
  //   submitting → form visible, Send button disabled + loading dots
  //   success    → confirmation message visible, form hidden
  //   error      → form visible, error message below Send button
  const [formState, setFormState] = useState<"idle" | "open" | "submitting" | "success" | "error">("idle")

  // Controlled input values — one per field
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [message, setMessage] = useState("")

  // Field-level validation error messages (undefined = no error for that field)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    whatsapp?: string
    message?: string
  }>({})

  // ─── Submit handler ────────────────────────────────────────────────────────
  // Validates all fields, then POSTs to /api/contact.
  // Updates formState to reflect loading, success, or error.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Client-side validation — check all fields are non-empty and email is valid
    const errs: typeof fieldErrors = {}
    if (!email) {
      errs.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address"
    }
    if (!whatsapp) errs.whatsapp = "WhatsApp number is required"
    if (!message) errs.message = "Message is required"

    // If any validation failed, show errors and stop — do not submit
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }

    // All valid — clear errors and begin submission
    setFieldErrors({})
    setFormState("submitting")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, whatsapp, message }),
      })

      // success: show confirmation. error: show error message.
      setFormState(res.ok ? "success" : "error")
    } catch {
      // Network failure or unexpected error
      setFormState("error")
    }
  }

  return (
    // bg-black-axis: primary surface (#000000)
    // Mobile-first: pt-28 gives generous space beneath the fixed header.
    // pb-20 keeps bottom breathing room. Desktop overrides both via md:py-36.
    <section className="bg-black-axis pt-28 pb-20 px-6 md:py-36 md:px-12">
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION LABEL ──────────────────────────────────────────────────── */}
        {/* Wraps the label in a fade-up so it enters before the grid below. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          viewport={{ once: true }}
          // mb-10: breathing room between the label and the two-column grid
          className="mb-10"
        >
          {/* Label row: text + decorative short line.
              The <span> replicates the ::after pseudo-element from the HTML template —
              a short horizontal stroke that visually anchors the label. */}
          <div className="flex items-center gap-3">
            {/* font-instrument uppercase tracking-[0.14em]: AXIS subheading style */}
            <span className="font-instrument text-[11px] uppercase tracking-[0.14em] text-blue-axis font-medium">
              Founding Story
            </span>
            {/* Decorative line — animates its width from 0 to w-8 on scroll entry.
                This gives the label a "drawing itself" reveal.
                aria-hidden: invisible to screen readers, purely decorative. */}
            <motion.span
              className="block h-px bg-blue-axis opacity-50"
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              transition={{ duration: 0.6, ease: "easeOut" as const, delay: 0.3 }}
              viewport={{ once: true }}
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* ── MOBILE-ONLY HEADLINE ───────────────────────────────────────────── */}
        {/* On mobile the grid stacks portrait first, so the headline would appear
            below the photo. Instead we render it here — between the label and the
            grid — and hide it at md: breakpoint where the right column owns it. */}
        <motion.h2
          className="md:hidden font-playfair uppercase tracking-tight text-white-axis text-3xl leading-tight mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Built by a scientist,{" "}<br />
          <em className="text-blue-axis">designed for the studio floor.</em>
        </motion.h2>

        {/* ── TWO-COLUMN GRID ────────────────────────────────────────────────── */}
        {/* Mobile: single column stacked | Desktop: left 1fr, right 1.4fr
            The fractional columns match the HTML template's grid proportions.
            items-start: columns align to their top edges, not stretched. */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 md:gap-14 items-start">

          {/* ── LEFT COLUMN: PORTRAIT + STATS ────────────────────────────────── */}
          {/* Left column fades in slightly after the label (delay 0.1s). */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.1 }}
            viewport={{ once: true }}
          >

            {/* PORTRAIT WRAPPER
                [perspective:1000px]: establishes a 3D perspective context so that
                rotateX/rotateY on the frame create a true depth illusion.
                relative: required so the glow div can use absolute positioning outside
                the overflow-hidden frame. */}
            <div className="relative [perspective:1000px] w-[80%] max-w-[300px] md:w-full md:max-w-none mb-5 mx-auto">

              {/* White glow beneath the frame — sits outside overflow-hidden so it bleeds
                  below the portrait edge and lifts it off the black background.
                  bg-white-axis/[0.10] + blur-xl: soft diffused glow using only brand tokens.
                  aria-hidden: purely decorative, invisible to screen readers. */}
              <div
                className="absolute -top-4 -right-4 w-20 h-20 bg-white-axis/[0.30] blur-xl rounded-full"
                aria-hidden="true"
              />

              {/* PORTRAIT FRAME — converted to motion.div for 3D tilt on hover.
                  [transform-style:preserve-3d]: renders children in 3D space,
                  required for the tilt to look volumetric rather than flat.
                  whileHover rotateY/rotateX: fixed-angle lean — confident, not gimmicky.
                  overflow-hidden: clips the image and overlay tag to the frame boundary. */}
              <motion.div
                className="relative aspect-square overflow-hidden border border-white-axis/[0.08] rounded-xl [transform-style:preserve-3d]"
                whileHover={{ rotateY: 6, rotateX: -3, scale: 1.02 }}
                transition={{ duration: 0.5, ease: "easeOut" as const }}
              >

                {/* Zoom-out entrance + grayscale filter.
                    grayscale: Tailwind CSS filter class — converts photo to black & white.
                    scale 1.06 → 1.0 while fading in gives a cinematic "settling" feel. */}
                <motion.div
                  className="absolute inset-0 grayscale"
                  initial={{ scale: 1.06, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" as const }}
                  viewport={{ once: true }}
                >
                  <Image
                    src="/profile.png"
                    alt="Lorena Puhl, Physicist and Tech Founder, creator of AXIS"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </motion.div>

                {/* PORTRAIT OVERLAY TAG
                    Pinned to the bottom-left corner of the portrait frame.
                    bg-grey-axis/90: semi-transparent dark surface at 90% opacity
                    so the name stays readable against any photo background. */}
                <div className="absolute bottom-4 left-4 bg-grey-axis/90 backdrop-blur-sm border border-white-axis/[0.08] rounded-sm px-3 py-2">
                  <p className="font-instrument text-[13px] font-medium text-white-axis mb-[3px] leading-none">
                    Lorena Puhl
                  </p>
                  <p className="font-instrument text-[11px] text-soft-grey leading-none">
                    Physicist &amp; Tech Founder
                  </p>
                </div>

              </motion.div>

            </div>
            {/* END PORTRAIT FRAME */}

            {/* STATS GRID
                Stagger animation: each stat card enters 0.12s after the previous one.
                containerVariants + itemVariants — see variants defined above.
                whileInView: animation triggers when the grid scrolls into view.
                viewport once: true — plays only once, not on every scroll pass. */}
            <motion.div
              className="grid grid-cols-2 gap-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                // Each stat is a stagger child via itemVariants.
                // bg-white-axis/[0.04]: near-invisible white tint lifts the card off black.
                // border border-white-axis/[0.08]: structural border, not decorative —
                // defines the card boundary against the dark background.
                // whileHover y: -2px + scale 1.02: subtle lift on hover, slow and confident.
                // The element-level transition governs whileHover; the stagger enter
                // animation uses itemVariants' own transition (duration: 0.7) instead.
                <motion.div
                  key={index}
                  variants={itemVariants}
                  // On hover: gentle scale + border brightens from 8% → 20% white opacity.
                  // The border animation uses a Framer Motion style prop since Tailwind
                  // opacity modifiers can't be transitioned directly at runtime.
                  whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.20)" }}
                  transition={{ duration: 0.35, ease: "easeOut" as const }}
                  className="bg-white-axis/[0.04] border border-white-axis/[0.08] rounded-sm px-4 py-3 cursor-default"
                >
                  {/* Stat number — Playfair Display, blue accent */}
                  <div className="font-playfair text-xl text-blue-axis leading-none mb-1">
                    {stat.num}
                  </div>
                  {/* Stat description — soft-grey base, bold keywords in white */}
                  <div className="font-instrument text-[11px] text-soft-grey leading-snug">
                    {stat.desc}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {/* END STATS GRID */}

          </motion.div>
          {/* END LEFT COLUMN */}

          {/* ── RIGHT COLUMN: COPY + CTA ──────────────────────────────────────── */}
          {/* Enters 0.1s after the left column (delay 0.2s total) for a wave effect. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.2 }}
            viewport={{ once: true }}
          >

            {/* SECTION HEADLINE
                h2: one per section, per SEO rules (the h1 lives in the Hero).
                font-playfair uppercase tracking-tight: AXIS headline convention.
                <em>: the italicised phrase uses UV accent to mark the key message.
                Playfair italic + uppercase creates a deliberate typographic contrast. */}
            {/* hidden on mobile — the headline is rendered above the grid instead.
                Shown again at md: where it belongs inside the right column. */}
            <h2 className="hidden md:block font-playfair uppercase tracking-tight text-white-axis text-3xl md:text-4xl leading-tight mb-7">
              Built by a scientist,{" "} <br />
              <em className="text-blue-axis">designed for the studio floor.</em>
            </h2>

            {/* BODY PARAGRAPHS
                font-instrument text-soft-grey: AXIS body text convention.
                leading-relaxed: generous line-height keeps long paragraphs readable.
                <strong>: white highlight lifts key phrases — used sparingly. */}
            <p className="font-instrument text-soft-grey text-[15px] leading-relaxed mb-5">
              I spent years as a Data Scientist and Physicist, building complex Machine Learning
              (ML) models, conducting research, and working for private businesses and embassies.
              But I noticed a pattern in my own neighborhood: my favorite dancing, boxing, and
              karate studios were being held back by their own success.
            </p>

            <p className="font-instrument text-soft-grey text-[15px] leading-relaxed mb-5">
              <strong className="text-white-axis font-medium">
                They were crushing it on Instagram, but drowning in DMs. They had incredible
                classes, but no presence on Google.
              </strong>{" "}
              I realized that the tech used for big startups was too complex for local studios, and
              the simple tools were too clunky. So, I built <em>Axis</em>.
            </p>

            {/* QUOTE BLOCK
                border-l-2 border-blue-axis: 2px left border in UV — structural accent
                that anchors the quote visually and signals its importance.
                pl-5 py-1: padding so the text doesn't touch the border.
                my-8: generous vertical spacing separates this from surrounding text. */}
            <blockquote className="border-l-2 border-blue-axis pl-5 py-1 my-8">
              <p className="font-playfair italic text-white-axis text-lg leading-relaxed">
                "I take the same rigor used in ML research and apply it to one goal: making your
                studio grow while you sleep."
              </p>
            </blockquote>

            <p className="font-instrument text-soft-grey text-[15px] leading-relaxed mb-5">
              <em>Axis</em> isn't just another website builder. It's an automated growth engine.
              It takes the content you're already creating on Instagram and transforms it into a
              high-converting, professional booking platform. No manual updates. No coding. No
              technical debt.
            </p>

            <p className="font-instrument text-soft-grey text-[15px] leading-relaxed">
              I've spent my career engineering systems that work; now, I'm building them so you
              can stop managing your DMs and start scaling your community.
            </p>

            {/* DIVIDER
                A thin horizontal line separating the body copy from the skills pills below.
                bg-white-axis/[0.08]: matches the subtle border tone used on cards.
                aria-hidden: decorative, not meaningful to screen readers. */}
            <div className="w-10 h-px bg-white-axis/[0.08] my-8" aria-hidden="true" />

            {/* SKILLS PILLS
                Stagger: each pill enters 0.12s after the previous — same pattern as stats.
                flex-wrap: pills reflow onto multiple rows on narrow screens. */}
            <motion.div
              className="flex flex-wrap gap-2 mb-9"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {pills.map((pill, index) => (
                // motion.span as a stagger child — each pill is a small text label.
                // border border-white-axis/10: 10% white border gives the pill shape.
                // rounded-full: pill silhouette matching the HTML template.
                // whileHover scale 1.05: gentle grow on hover, slow and confident.
                <motion.span
                  key={index}
                  variants={itemVariants}
                  // On hover: scale + border brightens + faint background fills in.
                  // backgroundColor uses a rgba string that Framer Motion can interpolate.
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(255,255,255,0.28)",
                    backgroundColor: "rgba(255,255,255,0.06)",
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" as const }}
                  className="font-instrument text-[12px] text-white-axis border border-white-axis/10 rounded-full px-[14px] py-[6px] tracking-[0.02em] cursor-default"
                >
                  {pill}
                </motion.span>
              ))}
            </motion.div>
            {/* END SKILLS PILLS */}

            {/* ── CTA AREA ──────────────────────────────────────────────────────── */}
            {/* Contains three mutually exclusive states managed by formState:
                idle       → CTA button + LinkedIn link
                open/submitting/error → inline contact form
                success    → confirmation message
                AnimatePresence enables exit animations before unmounting. */}
            <div>

              {/* BUTTON ROW
                  The CTA button exits with a fade-down when the form opens.
                  The LinkedIn link stays visible regardless of form state. */}
              <div className="flex items-center gap-5">

                {/* AnimatePresence: allows the button to animate OUT before React
                    removes it from the DOM when formState leaves "idle". */}
                <AnimatePresence>
                  {formState === "idle" && (
                    <motion.button
                      key="cta-button"
                      // Exit: fades out and drops 8px before unmounting
                      exit={{ opacity: 0, y: 8, transition: { duration: 0.4, ease: "easeOut" as const } }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.35, ease: "easeOut" as const }}
                      onClick={() => setFormState("open")}
                      className="bg-blue-axis text-white-axis font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
                    >
                      Let&apos;s get in touch
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* LINKEDIN LINK — external URL, <a> is allowed per component.md */}
                <a
                  href="https://linkedin.com/in/lorena-puhl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-instrument text-[13px] text-soft-grey border-b border-soft-grey/40 pb-px"
                >
                  LinkedIn ↗
                </a>

              </div>
              {/* END BUTTON ROW */}

              {/* CONTACT FORM
                  Mounts when formState is open, submitting, or error.
                  Unmounts (with stagger exit) when formState becomes success.
                  motion.form uses formContainer variants to stagger its children. */}
              <AnimatePresence>
                {(formState === "open" || formState === "submitting" || formState === "error") && (
                  <motion.form
                    key="contact-form"
                    variants={formContainer}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    onSubmit={handleSubmit}
                    // noValidate: we handle validation ourselves — disable browser defaults
                    noValidate
                    className="mt-6 space-y-4"
                  >

                    {/* EMAIL FIELD */}
                    <motion.div variants={formField}>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          // Clear the field error as the user types — live feedback
                          setFieldErrors(prev => ({ ...prev, email: undefined }))
                        }}
                        className="w-full bg-white-axis/[0.04] border border-white-axis/[0.08] text-white-axis font-instrument text-sm px-4 py-3 placeholder:text-soft-grey/50 focus:outline-none focus:border-blue-axis/40"
                      />
                      {/* Inline error — only rendered when validation has failed this field */}
                      {fieldErrors.email && (
                        <p className="font-instrument text-xs text-soft-grey italic mt-1">
                          {fieldErrors.email}
                        </p>
                      )}
                    </motion.div>

                    {/* WHATSAPP FIELD */}
                    <motion.div variants={formField}>
                      <input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={whatsapp}
                        onChange={(e) => {
                          setWhatsapp(e.target.value)
                          setFieldErrors(prev => ({ ...prev, whatsapp: undefined }))
                        }}
                        className="w-full bg-white-axis/[0.04] border border-white-axis/[0.08] text-white-axis font-instrument text-sm px-4 py-3 placeholder:text-soft-grey/50 focus:outline-none focus:border-blue-axis/40"
                      />
                      {fieldErrors.whatsapp && (
                        <p className="font-instrument text-xs text-soft-grey italic mt-1">
                          {fieldErrors.whatsapp}
                        </p>
                      )}
                    </motion.div>

                    {/* MESSAGE FIELD */}
                    <motion.div variants={formField}>
                      <textarea
                        placeholder="Tell me about your studio…"
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value)
                          setFieldErrors(prev => ({ ...prev, message: undefined }))
                        }}
                        rows={4}
                        // resize-none: prevents the user from manually resizing the textarea,
                        // which would break the layout's vertical rhythm.
                        className="w-full bg-white-axis/[0.04] border border-white-axis/[0.08] text-white-axis font-instrument text-sm px-4 py-3 placeholder:text-soft-grey/50 focus:outline-none focus:border-blue-axis/40 resize-none"
                      />
                      {fieldErrors.message && (
                        <p className="font-instrument text-xs text-soft-grey italic mt-1">
                          {fieldErrors.message}
                        </p>
                      )}
                    </motion.div>

                    {/* SEND BUTTON + GLOBAL ERROR */}
                    <motion.div variants={formField} className="flex flex-col gap-3">

                      {/* Submit button — disabled during submission to prevent double-sends.
                          Shows animated loading dots while submitting (Framer Motion only). */}
                      <motion.button
                        type="submit"
                        disabled={formState === "submitting"}
                        whileHover={formState !== "submitting" ? { scale: 1.03 } : {}}
                        transition={{ duration: 0.35, ease: "easeOut" as const }}
                        className="self-start bg-blue-axis text-white-axis font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4 disabled:opacity-50 flex items-center gap-2"
                      >
                        {formState === "submitting" ? (
                          <>
                            Sending
                            {/* Animated dots — three circles cycling opacity via Framer Motion.
                                Each dot is delayed by 0.25s to create a wave effect. */}
                            <span className="flex gap-1 items-center ml-1">
                              {[0, 1, 2].map((i) => (
                                <motion.span
                                  key={i}
                                  className="w-1 h-1 rounded-full bg-white-axis inline-block"
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.25,
                                    ease: "easeInOut",
                                  }}
                                />
                              ))}
                            </span>
                          </>
                        ) : (
                          "Send"
                        )}
                      </motion.button>

                      {/* Global error message — shown when the API call fails */}
                      {formState === "error" && (
                        <p className="font-instrument text-xs text-soft-grey italic">
                          Something went wrong. Please try again.
                        </p>
                      )}

                    </motion.div>

                  </motion.form>
                )}
              </AnimatePresence>
              {/* END CONTACT FORM */}

              {/* SUCCESS MESSAGE
                  Fades in + scales up from 0.97 when formState === "success".
                  Playfair Display italic, centred, with a blue horizontal accent below. */}
              <AnimatePresence>
                {formState === "success" && (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" as const }}
                    className="mt-6 text-center"
                  >
                    <p className="font-instrument text-white-axis text-sm leading-relaxed">
                      Thanks for contacting me!
                    </p>
                    <p className="font-instrument text-white-axis text-sm leading-relaxed">
                      I&apos;ll come back to you in the next 24 hours.
                    </p>
                    {/* Subtle Electric Blue underline accent below the confirmation */}
                    <div className="w-12 h-px bg-blue-axis mx-auto mt-5" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* END SUCCESS MESSAGE */}

            </div>
            {/* END CTA AREA */}

          </motion.div>
          {/* END RIGHT COLUMN */}

        </div>
        {/* END TWO-COLUMN GRID */}

      </div>
    </section>
  )
}
