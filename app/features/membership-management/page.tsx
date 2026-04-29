// app/features/membership-management/page.tsx
//
// Feature sub-page: Membership Management.

import type { Metadata } from "next"
import CTAProvider from "@/components/cta/CTAContext"
import HeaderSection from "@/components/sections/HeaderSection"
import FeaturePageShell from "@/components/sections/FeaturePageShell"
import MembershipVisual from "@/components/features/MembershipVisual"
import FinalCTA from "@/components/sections/FinalCTA"
import FooterSection from "@/components/sections/FooterSection"

export const metadata: Metadata = {
  title: "Membership Management — AXIS",
  description:
    "Build memberships your way — weekly, monthly, or annual, with unlimited or credit-based passes. Retention starts with the right plan structure.",
  openGraph: {
    title: "Membership Management — AXIS",
    description:
      "Build memberships your way — weekly, monthly, or annual, with unlimited or credit-based passes. Retention starts with the right plan structure.",
    url: "https://yourdomain.com/features/membership-management",
    type: "website",
  },
}

const FEATURES = [
  {
    name: "Your plans, your rules",
    description:
      "Create weekly, monthly, or annual subscriptions with limited, unlimited, or credit-based class passes. No forced compromises.",
  },
  {
    name: "Super easy sign-up",
    description:
      "Members join, renew, upgrade, or switch plans online or in-app. No paperwork, no friction, no phone calls.",
  },
  {
    name: "Clear insights for faster decisions",
    description:
      "Track trial conversion, pass performance, and renewal rates in one view — so you know exactly what's driving retention and what isn't.",
  },
  {
    name: "Built-in member messaging",
    description:
      "Send renewal reminders, expiry nudges, and upgrade offers via email, SMS, and push — all from one place.",
  },
  {
    name: "Stay in control",
    description:
      "Manage commitment terms, cancellation policies, and access rules systematically. No special exceptions eating your time.",
  },
  {
    name: "One system, any studio",
    description:
      "Templates let you maintain consistency across multiple locations while keeping data and reporting separate where needed.",
  },
]

export default function MembershipManagementPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      <FeaturePageShell
        category="Run Your Operations"
        headline="Retention starts here."
        subtitle="Build memberships your way, without fixed models or forced compromises. The right plan structure is the foundation of every loyal member relationship."
        features={FEATURES}
        quote="A lot of my clients are regulars now. It's really important that they have something simple — a plan that just works for them."
        quoteAuthor="Jodie, Founder — Reform & Glow"
      >
        <MembershipVisual />
      </FeaturePageShell>
      <FinalCTA />
      <FooterSection />
    </CTAProvider>
  )
}
