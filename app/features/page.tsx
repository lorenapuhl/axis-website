// app/features/page.tsx
//
// The /features hub page — entry point to all AXIS platform feature sub-pages.
// Server Component (no "use client") — metadata is exported for Next.js SEO injection.
// CTAProvider wraps the tree so the booking funnel modal is available in child components.

import type { Metadata } from "next"
import CTAProvider from "@/components/cta/CTAContext"
import HeaderSection from "@/components/sections/HeaderSection"
import FeaturesHubSection from "@/components/sections/FeaturesHubSection"
import FooterSection from "@/components/sections/FooterSection"

// metadata is read by Next.js at build time — it populates <title> and <meta> tags automatically.
// Never use react-helmet-async or manual <head> manipulation in App Router projects.
export const metadata: Metadata = {
  title: "Features — AXIS",
  description:
    "Explore the full AXIS platform: scheduling, payments, marketing, dashboards, and more — everything a sports studio needs in one system.",
  openGraph: {
    title: "Features — AXIS",
    description:
      "Explore the full AXIS platform: scheduling, payments, marketing, dashboards, and more — everything a sports studio needs in one system.",
    url: "https://yourdomain.com/features",
    type: "website",
  },
}

// CTAProvider makes the booking modal context available to all client components below.
export default function FeaturesPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      {/* FeaturesHubSection contains the page h1 and the 3-column feature grid. */}
      <FeaturesHubSection />
      <FooterSection />
    </CTAProvider>
  )
}
