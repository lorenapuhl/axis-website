// app/our-work/page.tsx
//
// This is the "Our Work" page — it maps to the /our-work URL.
// It is a Server Component (no "use client") for better SEO and fast load.
// The actual interactive demo lives in OverhandzSection.tsx (a Client Component).

import type { Metadata } from "next"
import HeaderSection from "@/components/sections/HeaderSection"
import FooterSection from "@/components/sections/FooterSection"
import OverhandzSection from "@/components/sections/OverhandzSection"
import CTAProvider from "@/components/cta/CTAContext"

// Metadata is read by Next.js at build time to populate <head> tags.
// Following the format: "Page Name — AXIS"
export const metadata: Metadata = {
  title: "Our Work — AXIS",
  description:
    "See how AXIS transforms a boxing studio into a revenue-generating digital system. An interactive demo of Overhandz Boxing Club.",
  openGraph: {
    title: "Our Work — AXIS",
    description:
      "See how AXIS transforms a boxing studio into a revenue-generating digital system. An interactive demo of Overhandz Boxing Club.",
    url: "https://yourdomain.com/our-work",
    type: "website",
  },
}

// The page assembles layout from top to bottom.
// CTAProvider wraps everything so the CTA modal is accessible anywhere in the tree.
export default function OurWorkPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      {/* OverhandzSection is the full interactive guided demo */}
      <OverhandzSection />
      <FooterSection />
    </CTAProvider>
  )
}
