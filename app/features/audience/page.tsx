// app/features/audience/page.tsx
//
// Feature sub-page: Audience — advanced behaviour-based marketing automation.

import type { Metadata } from "next"
import CTAProvider from "@/components/cta/CTAContext"
import HeaderSection from "@/components/sections/HeaderSection"
import FeaturePageShell from "@/components/sections/FeaturePageShell"
import AudienceVisual from "@/components/features/AudienceVisual"
import FinalCTA from "@/components/sections/FinalCTA"
import FooterSection from "@/components/sections/FooterSection"

export const metadata: Metadata = {
  title: "Audience — AXIS",
  description:
    "Advanced, behaviour-based messaging that runs automatically across every stage of the member journey. No manual admin or complex setups.",
  openGraph: {
    title: "Audience — AXIS",
    description:
      "Advanced, behaviour-based messaging that runs automatically across every stage of the member journey. No manual admin or complex setups.",
    url: "https://yourdomain.com/features/audience",
    type: "website",
  },
}

const FEATURES = [
  {
    name: "Personalised offers, perfectly timed",
    description:
      "Tailor incentives based on member actions so promotions feel relevant and lead to real results — not just opens.",
  },
  {
    name: "Joined-up messaging",
    description:
      "Start with an email, follow up with a notification, then nudge by SMS — all in one automated sequence, zero manual work.",
  },
  {
    name: "Triggered by real behaviour",
    description:
      "Create connected sequences that activate at key moments — when a trial ends, a first booking is made, or following high engagement.",
  },
  {
    name: "Know what's working",
    description:
      "Track opens, clicks, and conversions at a glance. Fine-tune your messaging with confidence using real data, not guesswork.",
  },
  {
    name: "Marketing that runs itself",
    description:
      "Once built, your automations run 24/7. No daily management, no manual follow-ups — the system does the heavy lifting.",
  },
  {
    name: "Re-engage before it's too late",
    description:
      "Automatically detect members who haven't booked in 30+ days and send targeted re-engagement offers before they cancel.",
  },
]

export default function AudiencePage() {
  return (
    <CTAProvider>
      <HeaderSection />
      <FeaturePageShell
        category="Reach Your Members"
        headline="Reach the right members, at the right moment."
        subtitle="Advanced, behaviour-based messaging that runs automatically across every stage of the member journey. No manual admin. No complex setups."
        features={FEATURES}
        quote="We set up our first automation in one afternoon. By the end of the month it had recovered 14 members we thought we'd lost."
        quoteAuthor="Studio owner, Madrid"
      >
        <AudienceVisual />
      </FeaturePageShell>
      <FinalCTA />
      <FooterSection />
    </CTAProvider>
  )
}
