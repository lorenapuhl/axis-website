// app/features/scheduling-booking/page.tsx
//
// Feature sub-page: Scheduling & Booking.

import type { Metadata } from "next"
import CTAProvider from "@/components/cta/CTAContext"
import HeaderSection from "@/components/sections/HeaderSection"
import FeaturePageShell from "@/components/sections/FeaturePageShell"
import SchedulingVisual from "@/components/features/SchedulingVisual"
import FinalCTA from "@/components/sections/FinalCTA"
import FooterSection from "@/components/sections/FooterSection"

export const metadata: Metadata = {
  title: "Scheduling & Booking — AXIS",
  description:
    "Run group classes, workshops, appointments, and livestreams in one system. Smart rules, flexible passes, and a waitlist that fills itself.",
  openGraph: {
    title: "Scheduling & Booking — AXIS",
    description:
      "Run group classes, workshops, appointments, and livestreams in one system. Smart rules, flexible passes, and a waitlist that fills itself.",
    url: "https://yourdomain.com/features/scheduling-booking",
    type: "website",
  },
}

const FEATURES = [
  {
    name: "Schedule classes your way",
    description:
      "Run group classes, workshops, appointments, 1:1 sessions, and livestreams in one system. Set recurring schedules that run automatically and adjust anytime.",
  },
  {
    name: "Smart rules for easy control",
    description:
      "Manage cancellations, capacity, booking windows, and access rules in one place. Auto-cancel underbooked classes to protect your time and revenue.",
  },
  {
    name: "Find it. Tap it. Booked.",
    description:
      "Members browse classes, choose their spot, and book in just a few taps — on web or in the member app. Fewer clicks equals fuller classes.",
  },
  {
    name: "Flexible plans and passes",
    description:
      "Offer pass bundles and class credits alongside recurring and unlimited memberships — without locking yourself into one rigid pricing model.",
  },
  {
    name: "Smart waitlist",
    description:
      "Waitlist reallocates cancellations instantly so popular classes stay full and accessible — no manual admin needed.",
  },
  {
    name: "One synced schedule",
    description:
      "Bookings stay perfectly in sync across your website and marketplaces, with real-time availability and no double bookings.",
  },
]

export default function SchedulingBookingPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      <FeaturePageShell
        category="Run Your Operations"
        headline="Booking and scheduling — easy every time."
        subtitle="Simple scheduling for you. Effortless booking for your members. One connected system that keeps every class full and every seat accounted for."
        features={FEATURES}
        quote="One of the things we're most proud of is how high our attendance rates are — and the AXIS scheduling system plays a huge role in that."
        quoteAuthor="Mona, Co-founder — MAD Lagree"
      >
        <SchedulingVisual />
      </FeaturePageShell>
      <FinalCTA />
      <FooterSection />
    </CTAProvider>
  )
}
