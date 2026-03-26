// This file is the home page of the site — it maps to the "/" URL.
// In Next.js App Router, every folder under app/ that contains a page.tsx
// becomes a route. This one lives at app/page.tsx so it IS the root route.
//
// Unlike HeaderSection.tsx, this file has NO "use client" directive.
// That means Next.js renders it on the server and sends plain HTML to the
// browser — faster initial load, better SEO. We only add "use client" to
// components that actually need browser APIs or interactivity.

// Metadata is Next.js's way of controlling what goes in the <head> of the page
// (title, description, Open Graph tags for social sharing, etc.).
// This replaces react-helmet or manually writing <head> tags — Next.js reads
// this object at build time and injects the correct HTML automatically.
import type { Metadata } from "next"

// Components are imported like Python modules. The "@/" alias maps to the
// project root, so "@/components/sections/HeaderSection" resolves to
// components/sections/HeaderSection.tsx — no relative path gymnastics needed.
import HeaderSection from "@/components/sections/HeaderSection"
//import ShuffleHeroSection from "@/components/sections/ShuffleHeroSection"
import TrustHeroSection from "@/components/sections/TrustHeroSection"
import IntroSection from "@/components/sections/IntroSection"
import SystemVisualSection from "@/components/sections/SystemVisualSection"
import ProductVisualSection from "@/components/sections/ProductVisualSection"
import LiveSyncSection from "@/components/sections/LiveSyncSection"
//import InstaGallerySection from "@/components/sections/InstaGallerySection"
import FeatureSection from "@/components/sections/FeatureSection"
import OutcomeSection from "@/components/sections/OutcomeSection"
import FinalCTA from "@/components/sections/FinalCTA"
import FooterSection from "@/components/sections/FooterSection"

// `export const metadata` is a special Next.js convention — this exact variable
// name is recognised by the framework. It must be exported from a page.tsx or
// layout.tsx file; it won't work inside a regular component.
export const metadata: Metadata = {
  // Title shown in the browser tab and in Google search results.
  // Format: "Page Name — AXIS" (see skills/seo.md for the full title table).
  title: "AXIS — Client Conversion Systems for Sports Studios",

  // Description shown under the link in Google results and in social previews.
  // Keep under 160 characters.
  description: "AXIS builds professional digital systems for Instagram fitness studios — turning followers into booked clients.",

  // Open Graph tags control how this page looks when shared on social media
  // (Facebook, LinkedIn, iMessage link previews, etc.).
  openGraph: {
    title: "AXIS — Client Conversion Systems for Sports Studios",
    description: "AXIS builds professional digital systems for Instagram fitness studios — turning followers into booked clients.",
    // Replace with the real Vercel URL once the project is deployed.
    url: "https://yourdomain.com",
    type: "website",
  },
}

// The default export from a page.tsx is the React component that renders the page.
// Next.js calls this function and uses its return value as the page's HTML.
export default function Home() {
  // <main> is the semantic HTML landmark for the primary page content.
  // bg-black-axis: sets the page background to our brand black (#000000).
  // min-h-screen: ensures the page fills at least the full viewport height,
  //               preventing a white flash below short content.
  return (
    <main className="bg-black-axis min-h-screen">

      {/* Components are used like custom HTML tags. <HeaderSection /> calls the
          HeaderSection function and renders whatever JSX it returns.
          Self-closing syntax (<HeaderSection />) is used when there are no
          child elements to pass in. */}
      <HeaderSection />

      {/* Future sections go here — HeroSection, AttentionSection, etc.
          Each will be imported at the top and dropped in as a tag below. */}
      {/*<ShuffleHeroSection />*/}
      <TrustHeroSection />
      <IntroSection />
      <FeatureSection /> 
      <SystemVisualSection />
      <ProductVisualSection />
      <LiveSyncSection />
      {/*<InstaGallerySection /> */}
      <OutcomeSection />
      <FinalCTA />
      <FooterSection />

    </main>
  )
}
