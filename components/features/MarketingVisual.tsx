"use client"
// MarketingVisual — coded UI mockup for the marketing feature page.
//
// Shows two panels side by side:
//   Left:  Email template preview — illustrates AI-assisted email design
//   Right: Audience segment cards — illustrates member segmentation

import { motion } from "framer-motion"

// Stagger container for the two panels
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

// Email template data — placeholder content mimicking a real automated email
const EMAIL = {
  from:    "hello@yourstudio.com",
  subject: "Your pass expires in 3 days, Sofia",
  preview: "Don't lose your remaining classes — book before it runs out.",
  body:    "We noticed you still have 2 classes left on your pack. Your pass expires on Friday. Book your next session now and make the most of it.",
  cta:     "Book Now",
}

// Audience segments — illustrates the segmentation UI
const SEGMENTS = [
  { label: "Active Members",  count: 284, tag: "active",   borderClass: "border-blue-axis",  textClass: "text-blue-axis"  },
  { label: "Trial Users",     count:  47, tag: "trial",    borderClass: "border-soft-grey",  textClass: "text-soft-grey"  },
  { label: "At Risk",         count:  31, tag: "inactive", borderClass: "border-white/20",   textClass: "text-soft-grey"  },
]

// Email stats bar — open rate, sent, clicks
const STATS = [
  { label: "Sent",      value: "1,204" },
  { label: "Open Rate", value: "64.2%" },
  { label: "Clicks",    value: "18.7%" },
]

export default function MarketingVisual() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-grey-axis p-4 md:p-6 w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── LEFT: Email template preview ── */}
        <motion.div variants={item} className="bg-black-axis p-4">
          <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest mb-4">
            Email Preview
          </p>

          {/* Simulated email "frame" */}
          <div className="border border-white/10 p-4">

            {/* Email metadata */}
            <p className="font-instrument text-soft-grey text-[9px]">From: {EMAIL.from}</p>
            <p className="font-instrument text-white-axis text-xs mt-1">{EMAIL.subject}</p>
            <p className="font-instrument text-soft-grey text-[9px] mt-0.5">{EMAIL.preview}</p>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 my-4" />

            {/* Email body */}
            <p className="font-instrument text-soft-grey text-[10px] leading-relaxed mb-5">
              {EMAIL.body}
            </p>

            {/* CTA button inside the email */}
            <div className="inline-block bg-blue-axis px-4 py-2">
              <p className="font-instrument uppercase tracking-widest text-white-axis text-[9px]">
                {EMAIL.cta}
              </p>
            </div>
          </div>

          {/* Stats row below the email preview */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {STATS.map((s) => (
              <div key={s.label} className="bg-grey-axis p-2">
                <p className="font-instrument text-soft-grey text-[8px] uppercase tracking-widest">{s.label}</p>
                <p className="font-playfair text-white-axis text-base mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Audience segments ── */}
        <motion.div variants={item} className="bg-black-axis p-4">
          <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest mb-4">
            Audience Segments
          </p>

          {/* Segment cards */}
          <div className="flex flex-col gap-3">
            {SEGMENTS.map((seg) => (
              <div
                key={seg.label}
                className={`border p-3 ${seg.borderClass}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-instrument uppercase tracking-widest text-[9px] ${seg.textClass}`}>
                      {seg.tag}
                    </p>
                    <p className="font-instrument text-white-axis text-xs mt-0.5">{seg.label}</p>
                  </div>
                  {/* Member count — large playfair number */}
                  <p className="font-playfair text-white-axis text-2xl">{seg.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Referral module below segments */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest">Referral Campaign</p>
            <p className="font-playfair text-white-axis text-lg mt-1">+23 this month</p>
            <p className="font-instrument text-soft-grey text-[9px] mt-1">via member invite links</p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
