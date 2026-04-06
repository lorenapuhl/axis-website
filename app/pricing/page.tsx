// This file is the /pricing page in Next.js App Router.
// Every folder under app/ that contains a page.tsx becomes its own URL route.
// This one lives at app/pricing/page.tsx so it maps to the "/pricing" URL.
//
// No "use client" here — this page has no browser-only logic at the page level.
// Client-side behaviour (animations, state) lives inside the child components.

// Metadata is Next.js's way of injecting <title>, <meta description>, and
// Open Graph tags into the page's <head> automatically at build time.
// Never use react-helmet-async — Next.js handles this natively.
import type { Metadata } from "next"

// HeaderSection and FooterSection are shared across all pages for consistent navigation.
import HeaderSection from "@/components/sections/HeaderSection"
import PricingSection from "@/components/sections/PricingSection"
import FooterSection from "@/components/sections/FooterSection"

// CTAProvider is a client-side context that makes openModal() available to any
// component in the tree. The page itself stays a Server Component — only the
// Provider and components that use the context become client-side code.
import CTAProvider from "@/components/cta/CTAContext"

// `export const metadata` is a special Next.js convention recognised by the framework.
// It must be exported from a page.tsx or layout.tsx file — it won't work inside
// a regular component. Page-level metadata merges with and overrides root layout metadata.
export const metadata: Metadata = {
  // Title format: "Page Name — AXIS" — see skills/seo.md for the full title table.
  title: "Pricing — AXIS",

  // Description shown in Google results and social previews. Keep under 160 characters.
  description:
    "Simple, transparent pricing for sports studios. Get your booking system live in 7 days — we set everything up for you.",

  // Open Graph controls how this page looks when shared on social media
  // (Facebook, LinkedIn, iMessage link previews, etc.).
  openGraph: {
    title: "Pricing — AXIS",
    description:
      "Simple, transparent pricing for sports studios. Get your booking system live in 7 days — we set everything up for you.",
    url: "https://yourdomain.com/pricing",
    type: "website",
  },
}

// The default export is the React component Next.js calls to render this page.
export default function PricingPage() {
  return (
    // CTAProvider wraps everything on this page so that PricingSection's CTA buttons
    // can call openModal() via useCTAModal(). The Provider is the client boundary —
    // the page.tsx file itself remains a Server Component.
    <CTAProvider>
      {/* bg-black-axis: brand black page background.
          min-h-screen: ensures the page fills at least the full viewport height
                        so no white flash appears below short content. */}
      <div className="bg-black-axis min-h-screen">

        {/* HeaderSection: fixed navigation bar shared across all pages.
            It handles its own scroll-detection and backdrop blur internally. */}
        <HeaderSection />

        {/* <main> is the semantic HTML landmark for primary page content.
            Screen readers and search engines use it to identify the key content
            of the page, distinct from the header and footer. */}
        <main>
          {/* PricingSection contains all 6 pricing-page blocks:
              hero header, pricing grid, trust layer, process, CTA, exclusivity. */}
          <PricingSection />
        </main>

        {/* FooterSection: shared site footer with links and brand info. */}
        <FooterSection />

      </div>
    </CTAProvider>
  )
}
