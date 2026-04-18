// app/our-work/page.tsx
//
// The "Our Work" page — maps to /our-work.
// Server Component (no "use client") for SEO and fast load.
// Assembles three sections:
//   1. OverhandzCasestudySection — hero + problem narrative
//   2. OverhandzFeaturesSection  — pill-based interactive feature showcase (the solution)

import type { Metadata } from "next"
import HeaderSection from "@/components/sections/HeaderSection"
import FooterSection from "@/components/sections/FooterSection"
import OverhandzCasestudySection from "@/components/sections/OverhandzCasestudySection"
import OverhandzFeaturesSection from "@/components/sections/OverhandzFeaturesSection"
import OverhandzDashboardsSection from "@/components/sections/OverhandzDashboardsSection"
import OverhandzMetricsSection from "@/components/sections/OverhandzMetricsSection"
import OverhandzTestimonialSection from "@/components/sections/OverhandzTestimonialSection"
import PortfolioFinalCTASection from "@/components/sections/PortfolioFinalCTASection"
import CTAProvider from "@/components/cta/CTAContext"

// Metadata is read by Next.js at build time to populate <head> tags.
// Following the format: "Page Name — AXIS"
export const metadata: Metadata = {
  title: "Our Work — AXIS",
  description:
    "See how AXIS transforms a boxing studio into a revenue-generating digital system. An interactive case study of Overhandz Boxing Club.",
  openGraph: {
    title: "Our Work — AXIS",
    description:
      "See how AXIS transforms a boxing studio into a revenue-generating digital system. An interactive case study of Overhandz Boxing Club.",
    url: "https://yourdomain.com/our-work",
    type: "website",
  },
}

// CTAProvider wraps everything so the CTA modal is accessible anywhere in the tree.
export default function OurWorkPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      {/* Case study hero + problem narrative */}
      <OverhandzCasestudySection />
      {/* Interactive pill feature showcase — "the solution" */}
      <OverhandzFeaturesSection />
      {/* Internal operating system dashboards — "the backend" */}
      <OverhandzDashboardsSection />
      {/* Projected impact metrics with click-to-reveal calculation footnotes */}
      <OverhandzMetricsSection />
      {/* Client testimonial — premium, minimal, no stars or avatar */}
      <OverhandzTestimonialSection />
      {/* Final CTA — live site link + AXIS booking funnel */}
      <PortfolioFinalCTASection />
      <FooterSection />
    </CTAProvider>
  )
}
