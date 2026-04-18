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

          {/* ── SaaS-style card ──────────────────────────────────────────── */}
          {/*
            Background:  #0c0c0c — slightly lighter than pure black, creates depth
            Border:      1px solid #1f1f1f — barely visible edge, defines the card
            rounded-2xl  — softer than sharp corners; feels modern
            p-16 md:p-24 — generous padding; whitespace does the visual work
            shadow-[…]   — very soft white shadow at 2% opacity — almost invisible
                           but adds that last 1% of premium feel
            hover:border-white/10 — border brightens slightly on hover (spec'd micro-detail)
            transition-colors     — smooth border transition
          */}
          <div
            className="
              rounded-2xl border p-16 md:p-24 text-center
              transition-colors duration-500
              shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
              hover:border-white/10
            "
            style={{
              background: "#0c0c0c",
              borderColor: "#1f1f1f",
            }}
          >
            {/* ── Quote ──────────────────────────────────────────────────── */}
            {/*
              Large opening quote mark — visible typographic element that frames
              the testimonial. font-playfair gives it a classical feel.
              text-white-axis/20 = 20% white opacity, visible but not dominant.
              leading-none + -mb-2 pulls it tight against the quote text below.
            */}
            <div className="relative">
              <span
                aria-hidden
                className="font-playfair text-[96px] md:text-[120px] leading-none text-white-axis/20 block text-left -mb-4 select-none"
              >
                &ldquo;
              </span>

              {/* The quote itself */}
              <blockquote className="mx-auto max-w-[640px]">
                <p className="font-instrument text-white-axis text-lg md:text-xl leading-relaxed">
                  We went from managing everything in DMs to having a complete system.
                  Bookings, payments, and communication are now seamless — it changed how we run the gym.
                </p>
              </blockquote>

              {/* Large closing quote mark — mirrors the opening, right-aligned */}
              <span
                aria-hidden
                className="font-playfair text-[96px] md:text-[120px] leading-none text-white-axis/20 block text-right -mt-4 select-none"
              >
                &rdquo;
              </span>
            </div>

            {/* ── Signature ──────────────────────────────────────────────── */}
            {/*
              Logo sits just above the name — visually anchors the attribution.
              mt-16 separates the quote block from the signature area.
              Logo at opacity-80 = subtle, not competing with the quote.
              Name in small uppercase tracking-widest = feels like a proper stamp.
            */}
            <div className="mt-16 flex flex-col items-center gap-4">
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
