"use client"
// "use client" needed: manages booking modal state (useState).

import { useState } from "react"
import HeroSection from "@/components/sections/HeroSection"
import SocialProofStrip from "@/components/sections/SocialProofStrip"
import InstagramFeed from "@/components/sections/InstagramFeed"
import SchedulePreview from "@/components/sections/SchedulePreview"
import PricingSection from "@/components/sections/PricingSection"
import EventsSection from "@/components/sections/EventsSection"
import PromotionsSection from "@/components/sections/PromotionsSection"
import NewsSection from "@/components/sections/NewsSection"
import AboutSection from "@/components/sections/AboutSection"
import FinalCTA from "@/components/sections/FinalCTA"
import BookingModal from "@/components/BookingModal"
import type { ScheduleClass } from "@/components/data/classes"
import type { Dict, Lang } from "@/lib/getDictionary"

interface HomePageWrapperProps {
  dict: Dict;
  lang: Lang;
}

export default function HomePageWrapper({ dict, lang }: HomePageWrapperProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ScheduleClass | null>(null)

  const handleBook = (cls: ScheduleClass) => {
    setSelectedClass(cls)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  return (
    <main>
      <HeroSection dict={dict.hero} lang={lang} />
      <SocialProofStrip dict={dict.social_proof} />
      <InstagramFeed dict={dict.instagram} />
      <SchedulePreview dict={dict.schedule_preview} lang={lang} onBook={handleBook} />
      <PricingSection dict={dict} lang={lang} />
      <EventsSection dict={dict.events} lang={lang} />
      <PromotionsSection dict={dict.promotions} lang={lang} />
      <NewsSection dict={dict.news} lang={lang} />
      <AboutSection dict={dict.about_section} lang={lang} />
      <FinalCTA dict={dict.final_cta} lang={lang} />

      <BookingModal
        isOpen={modalOpen}
        onClose={handleClose}
        selectedClass={selectedClass}
        dict={dict.booking_modal}
        lang={lang}
      />

      {/* STICKY MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 md:hidden p-4 bg-canvas/95 backdrop-blur border-t border-edge">
        <a
          href={`/${lang}/schedule`}
          className="block w-full bg-white text-black text-center font-medium text-sm py-3 rounded-md"
        >
          {dict.navbar.cta}
        </a>
      </div>
    </main>
  )
}
