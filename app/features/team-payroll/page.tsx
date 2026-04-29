// app/features/team-payroll/page.tsx
//
// Feature sub-page: Team & Payroll.

import type { Metadata } from "next"
import CTAProvider from "@/components/cta/CTAContext"
import HeaderSection from "@/components/sections/HeaderSection"
import FeaturePageShell from "@/components/sections/FeaturePageShell"
import TeamPayrollVisual from "@/components/features/TeamPayrollVisual"
import FinalCTA from "@/components/sections/FinalCTA"
import FooterSection from "@/components/sections/FooterSection"

export const metadata: Metadata = {
  title: "Team & Payroll — AXIS",
  description:
    "A simple, one-stop system for schedules, substitutions, and paying your instructor team. Classes covered, teachers paid — automatically.",
  openGraph: {
    title: "Team & Payroll — AXIS",
    description:
      "A simple, one-stop system for schedules, substitutions, and paying your instructor team. Classes covered, teachers paid — automatically.",
    url: "https://yourdomain.com/features/team-payroll",
    type: "website",
  },
}

const FEATURES = [
  {
    name: "Easy substitutions",
    description:
      "Handle last-minute swaps without disrupting schedules or losing track of who taught what. The system updates payroll automatically.",
  },
  {
    name: "Set schedules once",
    description:
      "Create your core recurring schedule once and manage one-off additions or updates in seconds — no weekly rebuilds.",
  },
  {
    name: "Visibility for everyone",
    description:
      "Instructors see their own schedules, substitutions, and pay details in a clear visual overview. Less admin, fewer messages.",
  },
  {
    name: "Payroll based on real data",
    description:
      "Every class, every change, every payout is tracked automatically — so instructor pay is always accurate and easy to review.",
  },
  {
    name: "No payroll panic",
    description:
      "Everything needed for the pay period is already sorted when the time comes. No scrambling through messages or spreadsheets.",
  },
  {
    name: "Retain your best instructors",
    description:
      "When your team has clarity on their schedule and pay, they stay. Happy instructors build loyal member communities.",
  },
]

export default function TeamPayrollPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      <FeaturePageShell
        category="Run Your Operations"
        headline="Classes covered. Teachers paid."
        subtitle="A simple, one-stop system for schedules, substitutions, and paying your team — so you can focus on building the studio, not managing the admin."
        features={FEATURES}
        quote="Our instructors love the system. It's clear, easy to use, and they always know exactly what they're getting paid."
        quoteAuthor="Shardelle, Founder — The Pole Lounge"
      >
        <TeamPayrollVisual />
      </FeaturePageShell>
      <FinalCTA />
      <FooterSection />
    </CTAProvider>
  )
}
