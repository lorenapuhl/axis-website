"use client"
// OverhandzCasestudySection — the Hero + Problem narrative for the Overhandz case study.
// Rendered at the top of /our-work. Adapts content from CaseStudyClient.tsx
// to the Axis design system (Playfair headlines, Instrument Sans body, axis tokens).
//
// h1 lives here — "From DMs to automated bookings." is the one-and-only
// page headline for /our-work, per SEO rules.

import { motion } from "framer-motion"
import Image from "next/image"

export default function OverhandzCasestudySection() {
  return (
    <section className="bg-black-axis">

      {/* ──────────────────────────────────────────────────────────────
          1. HERO
          Label above, h1, description, tech tags.
          Uses grey-axis as the surface (elevated from the black page bg).
          ────────────────────────────────────────────────────────────── */}
      <div className="pt-36 pb-20 px-6 md:pt-52 md:pb-36 md:px-12 bg-grey-axis border-b border-white-axis/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {/* Label above — changed from "Portfolio case study · SaaS" */}
            <p className="font-instrument text-soft-grey text-sm font-medium tracking-widest uppercase mb-4">
              Overhandz Boxing Club · Case Study
            </p>

            {/* Overhandz logo — sits between the label and the h1 */}
            <div className="mb-6">
              <Image
                src="/overhandz/ui/logo-transparent.png"
                alt="Overhandz Boxing Club logo"
                width={160}
                height={80}
                className="object-contain invert opacity-70"
              />
            </div>

            {/* h1 — exactly one per the /our-work page.
                text-4xl on mobile (prevents overflow), text-7xl on desktop. */}
            <h1 className="font-playfair text-white-axis uppercase tracking-tight text-4xl md:text-7xl leading-tight mb-6">
              From DMs to<br />automated bookings.
            </h1>

            <p className="font-instrument text-soft-grey text-lg leading-relaxed max-w-xl">
              Overhandz Boxing Club was running its entire booking operation through
              Instagram DMs. We replaced it with a conversion-focused website that
              books and charges clients automatically — 24 hours a day.
            </p>

            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-2 mt-8">
              {["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript", "Stripe (planned)"].map((tag) => (
                <span
                  key={tag}
                  className="font-instrument text-xs bg-white-axis/10 text-soft-grey px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────
          2. PROBLEM
          Two-column: text on left, "before" DM chat simulation on right.
          The chat shows exactly why the old system failed.
          ────────────────────────────────────────────────────────────── */}
      <div className="py-20 px-6 md:py-36 md:px-12 bg-black-axis">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* LEFT — problem text */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="font-instrument text-soft-grey text-sm font-medium tracking-widest uppercase mb-3">
                The problem
              </p>
              <h2 className="font-playfair text-white-axis uppercase tracking-tight text-3xl md:text-4xl mb-6">
                The gym was losing bookings it didn&apos;t know about.
              </h2>
              <div className="space-y-4 font-instrument text-soft-grey text-base leading-relaxed">
                <p>
                  Like many boutique gyms in Paris, Overhandz relied on Instagram
                  to run its entire business. Members would DM to book. Coaches
                  would reply manually. Payments were handled in cash or bank transfer.
                </p>
                <p>
                  The result: a slow, unreliable booking process that caused missed
                  enquiries, high no-show rates, and hours of manual admin every week.
                </p>
                <p>
                  The schedule was posted as a static image. There was no way for
                  new clients to know if spots were available — they had to ask.
                </p>
              </div>
            </motion.div>

            {/* RIGHT — simulated DM conversation */}
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.97 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="bg-grey-axis border border-white-axis/10 rounded-2xl p-6"
            >
              <p className="font-instrument text-soft-grey text-xs mb-4 uppercase tracking-widest">
                Before
              </p>

              {/* DM chat bubbles — member on right, gym on left */}
              <div className="space-y-3">
                {[
                  { from: "member", text: "Hi, can I book Saturday 9am sparring?" },
                  { from: "gym",    text: "Let me check... yes 2 spots left. Name?" },
                  { from: "member", text: "Lucas Martin" },
                  { from: "gym",    text: "Done! Pay at the door. €25." },
                  { from: "member", text: "Great thanks! See you Saturday" },
                  { from: "gym",    text: "(Lucas didn't show up)" },
                ].map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === "member" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-xs font-instrument ${
                        msg.from === "member"
                          ? "bg-white-axis/10 text-white-axis"
                          : "bg-white-axis/5 text-soft-grey"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-instrument text-soft-grey text-xs mt-4 text-center opacity-60">
                3 DMs · 12 minutes · no payment · no-show
              </p>
            </motion.div>

          </div>
        </div>
      </div>

    </section>
  )
}
