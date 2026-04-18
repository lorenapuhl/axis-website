"use client"
// "use client" needed: uses Framer Motion which requires the browser environment.

import { motion } from "framer-motion"
import Image from "next/image"
import Button from "@/components/ui/Button"
import SectionWrapper from "@/components/ui/SectionWrapper"
import type { Dict, Lang } from "@/lib/getDictionary"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface HeroSectionProps {
  dict: Dict["hero"];
  lang: Lang;
}

export default function HeroSection({ dict, lang }: HeroSectionProps) {
  return (
    <section className="min-h-screen bg-canvas py-20 px-6 md:py-36 md:px-12 flex items-center">
      <SectionWrapper className="w-full">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* LEFT — copy + CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center md:text-left"
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-dim text-sm font-medium tracking-widest uppercase mb-4"
            >
              {dict.eyebrow}
            </motion.p>

            {/* H1 — exactly ONE h1 per page */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-white font-bold text-5xl md:text-7xl leading-tight tracking-tight mb-6"
            >
              {dict.h1_line1}
              <br />
              {dict.h1_line2}
              <br />
              {dict.h1_line3}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-dim text-base md:text-lg leading-relaxed max-w-md mb-8"
            >
              {dict.subtext}
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center md:items-start sm:flex-row gap-3"
            >
              <Button href={`/${lang}/schedule`} variant="primary">
                {dict.cta_primary}
              </Button>
              <Button href={`/${lang}/schedule`} variant="secondary">
                {dict.cta_secondary}
              </Button>
            </motion.div>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-6 text-dim text-xs"
            >
              {dict.social_proof}
            </motion.p>
          </motion.div>

          {/* RIGHT — hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="relative aspect-[4/5] md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/images/ui/hero-cropped.png"
              alt="Boxers sparring during training session at Overhandz Boxing Club in Paris"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas/40 to-transparent" />
          </motion.div>
        </div>
      </SectionWrapper>
    </section>
  )
}
