"use client"
// "use client" needed: uses Framer Motion for animations.

import { motion } from "framer-motion"
import Image from "next/image"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Button from "@/components/ui/Button"

// ---------------------------------------------------------------------------
// CaseStudyClient — portfolio case study page
//
// Demonstrates the business value of the Overhandz project to potential clients.
// Structure:
//   1. Hero — project summary
//   2. Problem — what the studio struggled with before
//   3. Solution — what was built
//   4. Transformation — before vs after comparison
//   5. Metrics — simulated business outcomes
//   6. CTA — call to action for new clients
// ---------------------------------------------------------------------------

// Simulated impact metrics — replace with real data after launch
const metrics = [
  { value: "+30%", label: "Booking conversion rate", sublabel: "vs Instagram DMs" },
  { value: "-10h", label: "Admin time saved", sublabel: "per week" },
  { value: "24/7", label: "Booking availability", sublabel: "no missed enquiries" },
  { value: "3×", label: "Faster booking flow", sublabel: "30 seconds vs 3 DMs" },
];

// Before/After comparison points
const comparison = [
  {
    before: "DMs on Instagram to book — hours of back-and-forth",
    after: "Online booking in 30 seconds, any time of day",
  },
  {
    before: "No payment upfront — high no-show rates",
    after: "Payment at booking — spots are committed",
  },
  {
    before: "Schedule posted as image — no real-time availability",
    after: "Live schedule with spot count — urgency built in",
  },
  {
    before: "No visibility into membership revenue",
    after: "Memberships and class packs sold automatically online",
  },
  {
    before: "New clients fell off — no follow-up system",
    after: "Email confirmation + future: automated follow-up sequences",
  },
];

export default function CaseStudyClient() {
  return (
    <main>

      {/* ─────────────────────────────────────────────────────────────
          1. HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-surface border-b border-edge">
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-4">
              Portfolio case study · SaaS
            </p>
            {/* h1 — exactly one per page */}
            <h1 className="text-white font-bold text-5xl md:text-7xl tracking-tight mb-6">
              From DMs to
              <br />
              automated bookings.
            </h1>
            <p className="text-dim text-lg leading-relaxed max-w-xl">
              Overhandz Boxing Club was running its entire booking operation through
              Instagram DMs. We replaced it with a conversion-focused website that
              books and charges clients automatically — 24 hours a day.
            </p>

            {/* Project tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript", "Stripe (planned)"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-white/10 text-dim px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </SectionWrapper>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PROBLEM
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
        <SectionWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <p className="text-dim text-sm font-medium tracking-widest uppercase mb-3">
                The problem
              </p>
              <h2 className="text-white font-semibold text-3xl md:text-4xl tracking-tight mb-6">
                The gym was losing bookings it didn&apos;t know about.
              </h2>
              <div className="space-y-4 text-dim text-base leading-relaxed">
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

            {/* Visual: "before" phone mockup */}
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.97 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="bg-surface border border-edge rounded-2xl p-6"
            >
              <p className="text-dim text-xs mb-4 uppercase tracking-widest">Before</p>
              {/* Simulated DM conversation */}
              <div className="space-y-3">
                {[
                  { from: "member", text: "Hi, can I book Saturday 9am sparring?" },
                  { from: "gym", text: "Let me check... yes 2 spots left. Name?" },
                  { from: "member", text: "Lucas Martin" },
                  { from: "gym", text: "Done! Pay at the door. €25." },
                  { from: "member", text: "Great thanks! See you Saturday" },
                  { from: "gym", text: "(Lucas didn't show up)" },
                ].map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === "member" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
                        msg.from === "member"
                          ? "bg-white/10 text-white"
                          : "bg-edge text-dim"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-dim text-xs mt-4 text-center">
                3 DMs · 12 minutes · no payment · no-show
              </p>
            </motion.div>
          </div>
        </SectionWrapper>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SOLUTION
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-surface">
        <SectionWrapper>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-12"
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-3">
              The solution
            </p>
            <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
              A conversion-focused booking system.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📅",
                title: "Live class schedule",
                desc: "Real-time availability with urgency signals (spots left). Always up to date.",
              },
              {
                icon: "⚡",
                title: "30-second booking",
                desc: "Select class → enter details → pay → done. No DMs, no waiting.",
              },
              {
                icon: "💳",
                title: "Online payments",
                desc: "Drop-in, class packs, and monthly memberships — all sold automatically.",
              },
              {
                icon: "📱",
                title: "Instagram integration",
                desc: "Website content syncs with the gym's Instagram feed. No double posting.",
              },
              {
                icon: "📊",
                title: "Booking visibility",
                desc: "Coaches see who booked what, when. No more manual tracking.",
              },
              {
                icon: "🎯",
                title: "Conversion-focused",
                desc: "Every section answers: does this get more bookings? If not, it doesn't ship.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
                className="bg-canvas border border-edge rounded-xl p-5"
              >
                <span className="text-2xl block mb-3">{feature.icon}</span>
                <p className="text-white font-semibold mb-2">{feature.title}</p>
                <p className="text-dim text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BEFORE vs AFTER
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
        <SectionWrapper>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-10"
          >
            <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
              Transformation
            </h2>
          </motion.div>

          {/* Before / After table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-edge rounded-xl overflow-hidden">

            {/* Before column header */}
            <div className="bg-surface p-4">
              <p className="text-dim text-sm font-medium uppercase tracking-widest">Before</p>
            </div>
            <div className="bg-surface p-4">
              <p className="text-white text-sm font-medium uppercase tracking-widest">After</p>
            </div>

            {/* Rows */}
            {comparison.map((row, index) => (
              <>
                <motion.div
                  key={`before-${index}`}
                  whileInView={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                  className="bg-canvas p-4 border-t border-edge"
                >
                  <p className="text-dim text-sm leading-relaxed">{row.before}</p>
                </motion.div>
                <motion.div
                  key={`after-${index}`}
                  whileInView={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.06 + 0.05 }}
                  className="bg-canvas p-4 border-t border-edge"
                >
                  <p className="text-white text-sm leading-relaxed">{row.after}</p>
                </motion.div>
              </>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. METRICS
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-surface">
        <SectionWrapper>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-12"
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-3">
              Projected outcomes
            </p>
            <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
              Metrics
            </h2>
            <p className="text-dim text-sm mt-3">
              Based on industry benchmarks for booking system implementations.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
                className="bg-canvas border border-edge rounded-xl p-5 text-center"
              >
                <p className="text-white font-bold text-3xl mb-1">{metric.value}</p>
                <p className="text-white text-sm font-medium">{metric.label}</p>
                <p className="text-dim text-xs mt-1">{metric.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. PORTFOLIO CTA
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas border-t border-edge">
        <SectionWrapper>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-white font-bold text-4xl md:text-5xl tracking-tight mb-4">
              Does your studio run on DMs?
            </h2>
            <p className="text-dim text-base leading-relaxed mb-8">
              We build this exact system for boxing gyms, Muay Thai clubs, CrossFit boxes,
              and boutique fitness studios. In 4 weeks, your clients book and pay online —
              automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary">
                Start a project
              </Button>
              <Button href="/" variant="secondary">
                See the live site
              </Button>
            </div>
          </motion.div>
        </SectionWrapper>
      </section>
    </main>
  );
}
