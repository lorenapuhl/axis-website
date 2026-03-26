"use client"
import { motion } from "framer-motion"

// Stagger container: each child animates in sequence, 0.12s apart
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 }
  }
}

// Each text line fades up individually
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
}

// The button fades in slightly after the text block
const buttonVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
}

export default function FinalCTA() {
  return (
    // Black background, generous vertical padding, full-bleed section
    // py-20 px-6 = mobile-first; md: overrides kick in at medium breakpoint
    <section id="cta" className="bg-black-axis py-20 px-6 md:py-36 md:px-12">

      {/* Center everything horizontally and vertically */}
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">

        {/*
          Stagger container — triggers when this section scrolls into view.
          once: true means it plays once and stays, never re-triggers on scroll up.
        */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          {/*
            Each line is an h2 because this is the section headline.
            SEO rule: only one h1 per page (that lives in HeroSection).
            All section headlines use h2.
            font-playfair = Playfair Display (serif, editorial)
            uppercase tracking-tight = brand headline style
            text-white-axis = primary headline color token
            Large text size steps down gracefully on mobile via responsive classes
          */}
          <motion.h2
            variants={item}
            className="font-instrument tracking-tight text-white-axis text-4xl md:text-2xl lg:text-2xl"
          >
            Start simple.
            <br />
          </motion.h2>

          <motion.p
            variants={item}
            className="font-instrument tracking-tight text-white-axis text-4xl md:text-2xl lg:text-2xl"
          >
            Free prototype.
          </motion.p>

          <motion.p
            variants={item}
            className="font-instrument tracking-tight text-white-axis text-2xl md:text-2xl lg:text-2xl"
          >
            Free walkthrough.
          </motion.p>

          <motion.p
            variants={item}
            className="font-instrument tracking-tight text-white-axis text-2xl md:text-2xl lg:text-2xl"
          >
            If it fits, we build.
          </motion.p>
        </motion.div>

        {/*
          Button fades in after the text block, with extra top margin for breathing room.
          whileInView triggers independently from the text stagger above.
          whileHover scales the button up slightly (1.03) — slow and confident, not bouncy.
          transition duration 0.35 = slightly snappier for hover response, still within rules.
        */}
        <motion.div
          variants={buttonVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 md:mt-24"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white-axis text-black-axis text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
          >
            Get your AXIS
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}
