// app/features/integrations/page.tsx
//
// Feature sub-page: Integrations.

import type { Metadata } from "next"
import CTAProvider from "@/components/cta/CTAContext"
import HeaderSection from "@/components/sections/HeaderSection"
import FeaturePageShell from "@/components/sections/FeaturePageShell"
import IntegrationsVisual from "@/components/features/IntegrationsVisual"
import FinalCTA from "@/components/sections/FinalCTA"
import FooterSection from "@/components/sections/FooterSection"

export const metadata: Metadata = {
  title: "Integrations — AXIS",
  description:
    "AXIS integrates with ClassPass, Urban Sports, Zoom, ActiveCampaign, and more — so every tool in your stack stays connected and in sync.",
  openGraph: {
    title: "Integrations — AXIS",
    description:
      "AXIS integrates with ClassPass, Urban Sports, Zoom, ActiveCampaign, and more — so every tool in your stack stays connected and in sync.",
    url: "https://yourdomain.com/features/integrations",
    type: "website",
  },
}

const FEATURES = [
  {
    name: "Aggregator reach",
    description:
      "Connect with ClassPass, Urban Sports Club, and Wellhub to gain exposure to thousands of new potential members without extra marketing spend.",
  },
  {
    name: "Trusted payments",
    description:
      "Native integrations with PayPal and Stripe mean members pay how they prefer, and you get paid on time — every time.",
  },
  {
    name: "Marketing stack sync",
    description:
      "Connect with ActiveCampaign and your existing CRM tools. Member data flows automatically — no CSV exports, no manual imports.",
  },
  {
    name: "Digital content delivery",
    description:
      "Run live classes via Zoom, publish on-demand content to YouTube, or host studio-quality recordings on Vimeo — all from one system.",
  },
  {
    name: "Keyless studio access",
    description:
      "Integrate with Kisi to grant members secure, app-based entry to your studio — so check-in is frictionless and fully tracked.",
  },
  {
    name: "Everything in sync",
    description:
      "Your member data, bookings, and payments flow between tools automatically. One source of truth, zero double-entry.",
  },
]

export default function IntegrationsPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      <FeaturePageShell
        category="Reach Your Members"
        headline="Keep everything in sync."
        subtitle="AXIS integrates with the best tools in fitness — so your entire stack works together without manual workarounds or data silos."
        features={FEATURES}
        quote="The integrations saved us hours every week. Everything just talks to each other now — it's exactly how software should work."
        quoteAuthor="Studio operator, London"
      >
        <IntegrationsVisual />
      </FeaturePageShell>
      <FinalCTA />
      <FooterSection />
    </CTAProvider>
  )
}
