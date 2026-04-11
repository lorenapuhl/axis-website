"use client"
// "use client" is required because this section renders a client component
// (HeroSection uses Framer Motion). In Next.js App Router, any component that
// imports a client component must itself be a client component.
// `use client` also allows motion.div to be used for the background glow.

// motion is used here to animate the decorative background glow element.
// The inner HeroSection handles all content animations independently.
import { motion } from "framer-motion"

// HeroSection is the adapted 21st.dev template that renders the two-column
// hero content (headline, CTA, stats card, brand marquee). This wrapper
// provides the structural shell and background treatment.
import HeroSection from "@/components/ui/glassmorphism-trust-hero"

export default function TrustHeroSection() {
  return (
    /*
      <section> is required as the root element for all AXIS section components.

      bg-black-axis: deep brand black (#000000) — the primary surface color
      min-h-screen: ensures the hero fills the full viewport height on load
      flex items-center: vertically centers the two-column content in the section
      py-20 px-6: mobile padding (375px baseline — mobile-first)
      md:py-32 md:px-12: desktop padding (1440px)
      relative overflow-hidden: contains the absolute-positioned background glow
        so it doesn't bleed into adjacent sections
    */
    <section className="bg-black-axis min-h-screen flex items-center py-2 px-6 md:py-32 md:px-12 relative overflow-hidden">

      {/*
        Decorative background glow — creates the subtle radial "mesh" effect
        behind the hero content.

        Positioned absolutely at the top-center of the section and pushed
        outside the visible area (-translate-y-1/2) so only the lower half
        of the glow is visible, radiating downward from the top edge.

        bg-white/[0.02]: white at 2% opacity — barely perceptible tint
        blur-[120px]: extreme blur radius spreads the glow softly across the top
        pointer-events-none: invisible to clicks — purely visual
        aria-hidden: tells screen readers to skip this decorative element
      */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" as const }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none"
      />

      {/*
        max-w-6xl mx-auto: centers content and constrains it to 72rem wide —
          the standard AXIS max content width
        relative z-10: ensures the content renders in front of the background glow
        w-full: fills available width before the max-w clamp kicks in
      */}
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <HeroSection />
      </div>
    </section>
  )
}
