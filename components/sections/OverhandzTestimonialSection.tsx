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
    <section className="py-20 px-6 md:py-36 md:px-12 bg-black-axis">
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
            <span
              aria-hidden
              className="font-playfair italic text-[96px] md:text-[120px] leading-none text-white-axis/20 block -mb-4 select-none"
            >
              &ldquo;
            </span>

            {/* The quote itself — italic to match the quote mark's tone */}
            <blockquote className="mx-auto max-w-[640px]">
              <p className="font-instrument italic text-white-axis text-lg md:text-xl leading-relaxed">
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
