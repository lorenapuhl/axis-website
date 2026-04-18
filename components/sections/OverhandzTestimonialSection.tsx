"use client"
// "use client" is required: uses Framer Motion for scroll-triggered animation.

import { motion } from "framer-motion"
import Image from "next/image"

// ─── COMPONENT ────────────────────────────────────────────────────────────────
// A high-trust, minimal testimonial card — no stars, no avatar, no carousel.
// Inspired by Stripe / Linear testimonial sections: let the words and the client
// do the work. Everything is centred inside a SaaS-style dark card.
// ─────────────────────────────────────────────────────────────────────────────
export default function OverhandzTestimonialSection() {
  return (
    <section className="pt-20 pb-40 px-6 md:py-36 md:px-12 bg-black-axis">
      <div className="max-w-6xl mx-auto">

        {/* ── Centred container — max-w-720px as spec'd ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-[720px]"
        >

          {/* ── Quote ──────────────────────────────────────────────────── */}
          {/*
            No card — the quote sits directly on the black background.
            Opening quote mark in Playfair italic at low opacity frames the text
            without adding bulk. -mb-4 pulls it tight so it reads as part of
            the quote, not a separate element.
          */}
          <div className="text-center">

            {/* The quote itself — italic to match the quote mark's tone */}
            {/*
              relative + text-left on the blockquote so the quote mark can be
              pinned to the top-left corner of the text block, not the page edge.
              The span is absolute, positioned just above and to the left of the
              first line of text.
            */}
            <blockquote className="relative mx-auto max-w-[640px] text-left">
              {/* Opening quote mark — anchored to top-left of the text block */}
              <span
                aria-hidden
                className="absolute -top-10 -left-6 md:-left-10 font-playfair italic text-[80px] md:text-[100px] leading-none text-white-axis/20 select-none"
              >
                &ldquo;
              </span>
              <p className="font-instrument italic text-white-axis text-lg md:text-xl leading-relaxed text-center md:text-left pt-8 md:pt-10">
                We went from managing everything in DMs to having a complete system.
                Bookings, payments, and communication are now seamless — it changed how we run the gym.
              </p>
            </blockquote>

            {/* ── Signature ──────────────────────────────────────────────── */}
            {/*
              mt-8 — tighter gap between quote and attribution than before.
              Logo above the name visually anchors who said it.
            */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <Image
                src="/portfolio/overhandz/logo-transparent.png"
                alt="Overhandz Club logo"
                width={120}
                height={32}
                className="h-8 w-auto opacity-80 object-contain"
              />
              <p className="font-instrument text-sm uppercase tracking-widest text-gray-400">
                Overhandz Club
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
