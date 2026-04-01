// This is a Next.js App Router page — it maps to the /about URL.
// No "use client" needed here because this page has no interactivity at the page level.
// Child components (like HeaderSection, AboutmeSection) handle their own client directives.

import type { Metadata } from "next"
import HeaderSection from "@/components/sections/HeaderSection"
import AboutmeSection from "@/components/sections/AboutmeSection"
import FooterSection from "@/components/sections/FooterSection"

// metadata is a Next.js App Router convention — it's read at build time to inject
// <title>, <meta description>, and Open Graph tags into the page's <head>.
// Never use react-helmet-async or manual <head> tags in this project.
export const metadata: Metadata = {
  title: "About — AXIS",
  description:
    "Meet Lorena Puhl — physicist, data scientist, and founder of AXIS, the client conversion system built for sports studios.",
  openGraph: {
    title: "About — AXIS",
    description:
      "Meet Lorena Puhl — physicist, data scientist, and founder of AXIS, the client conversion system built for sports studios.",
    url: "https://yourdomain.com/about",
    type: "website",
  },
}

// Default export is required by Next.js App Router — this function renders the page.
export default function AboutPage() {
  return (
    // Fragment (<>) avoids adding an extra wrapper element to the DOM.
    <>
      {/* Header provides navigation so users can move to other routes from /about */}
      <HeaderSection />

      {/* <main> is a semantic HTML landmark — screen readers and search engines use it
          to identify the primary content of the page, distinct from nav/footer. */}
      <main>
        <AboutmeSection />
      </main>

      {/* Footer closes the page consistently with the rest of the site */}
      <FooterSection />
    </>
  )
}
