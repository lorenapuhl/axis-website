// app/features/performance-dashboard/page.tsx
//
// Feature sub-page: Performance Dashboard.
// Assembles the shared FeaturePageShell with performance-specific content,
// and passes the PerformanceDashboardVisual as the coded UI child.

import type { Metadata } from "next"
import CTAProvider from "@/components/cta/CTAContext"
import HeaderSection from "@/components/sections/HeaderSection"
import FeaturePageShell from "@/components/sections/FeaturePageShell"
import PerformanceDashboardVisual from "@/components/features/PerformanceDashboardVisual"
import FinalCTA from "@/components/sections/FinalCTA"
import FooterSection from "@/components/sections/FooterSection"

export const metadata: Metadata = {
  title: "Performance Dashboard — AXIS",
  description:
    "Simple, visual dashboards that turn raw studio data into actionable insights. Track revenue, retention, and churn risk in one place.",
  openGraph: {
    title: "Performance Dashboard — AXIS",
    description:
      "Simple, visual dashboards that turn raw studio data into actionable insights. Track revenue, retention, and churn risk in one place.",
    url: "https://yourdomain.com/features/performance-dashboard",
    type: "website",
  },
}

// Feature blocks — six capabilities shown in the 2-column grid
const FEATURES = [
  {
    name: "Everything in view",
    description:
      "See your revenue, bookings, retention, and member activity together in one clear dashboard — without exporting data or building spreadsheets.",
  },
  {
    name: "See where revenue is lost",
    description:
      "Track subscriptions, churn, attendance, and booking sources in one place. Know exactly where revenue is growing and which changes will have the biggest impact.",
  },
  {
    name: "Understand your community",
    description:
      "Track the journey from trial to loyal member. See what converts, what drives repeat visits, and who might not return — before they drift away.",
  },
  {
    name: "AI churn prediction",
    description:
      "An AI-powered churn risk score flags at-risk members automatically, so you can act before someone disappears.",
  },
  {
    name: "Fast decisions",
    description:
      "Pre-built dashboards load fast and are easy to read. Clear answers without spreadsheets — so you make faster, more confident choices.",
  },
  {
    name: "Go deeper when you need to",
    description:
      "Beyond at-a-glance dashboards, access your full datasets to run advanced analysis, connect BI tools, and explore revenue patterns across locations.",
  },
]

export default function PerformanceDashboardPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      <FeaturePageShell
        category="Grow & Expand"
        headline="See what's really happening."
        subtitle="Simple, visual dashboards that turn raw performance data into actionable insights — so you make fast decisions without manual reports or number crunching."
        features={FEATURES}
        quote="The reports allowed us to maximise our efficiency from day one. We knew exactly where to focus."
        quoteAuthor="Lina, Co-founder — Kore Studios"
      >
        {/* PerformanceDashboardVisual is the coded UI mockup unique to this page */}
        <PerformanceDashboardVisual />
      </FeaturePageShell>
      <FinalCTA />
      <FooterSection />
    </CTAProvider>
  )
}
