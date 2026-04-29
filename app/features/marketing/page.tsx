// app/features/marketing/page.tsx
//
// Feature sub-page: Marketing Essentials.

import type { Metadata } from "next"
import CTAProvider from "@/components/cta/CTAContext"
import HeaderSection from "@/components/sections/HeaderSection"
import FeaturePageShell from "@/components/sections/FeaturePageShell"
import MarketingVisual from "@/components/features/MarketingVisual"
import FinalCTA from "@/components/sections/FinalCTA"
import FooterSection from "@/components/sections/FooterSection"

export const metadata: Metadata = {
  title: "Marketing Essentials — AXIS",
  description:
    "Built-in marketing tools to keep your members coming back. Email templates, segmentation, referrals, and multi-channel messaging — no extra platforms needed.",
  openGraph: {
    title: "Marketing Essentials — AXIS",
    description:
      "Built-in marketing tools to keep your members coming back. Email templates, segmentation, referrals, and multi-channel messaging — no extra platforms needed.",
    url: "https://yourdomain.com/features/marketing",
    type: "website",
  },
}

const FEATURES = [
  {
    name: "Emails that look great, fast",
    description:
      "Pre-designed templates built for fitness studios. Customise with AI in seconds — no design expertise or third-party tools required.",
  },
  {
    name: "Segment in seconds",
    description:
      "Automatically categorise members by behaviour and activity patterns. Send the right message to the right group, every time.",
  },
  {
    name: "Reach out on the right channel",
    description:
      "Email, SMS, and push notifications from one unified platform. Stop juggling multiple tools to reach your community.",
  },
  {
    name: "Make it personal",
    description:
      "Built-in personalisation strengthens member connection and increases loyalty. Members feel seen — not marketed to.",
  },
  {
    name: "Grow effortlessly",
    description:
      "Let members invite friends via simple referral links. Set custom reward structures and watch your community grow organically.",
  },
  {
    name: "Stay consistent as you scale",
    description:
      "Share brand-approved templates across locations while allowing individual studios to run their own campaigns.",
  },
]

export default function MarketingPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      <FeaturePageShell
        category="Reach Your Members"
        headline="The perfect tools for a winning marketing strategy."
        subtitle="Easy, built-in marketing tools to keep your members coming back. No overthinking, guesswork, or extra platforms."
        features={FEATURES}
        quote="Marketing at AXIS is greatly improved compared to anything else we tried. We finally feel in control."
        quoteAuthor="Amy, Director — Everybody Pilates"
      >
        <MarketingVisual />
      </FeaturePageShell>
      <FinalCTA />
      <FooterSection />
    </CTAProvider>
  )
}
