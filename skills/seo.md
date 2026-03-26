# Skill: SEO Implementation

## When to read this file
Read this before building or modifying any file in the app/ directory,
including page.tsx, layout.tsx, and any route folders.

---

## How metadata works in Next.js App Router

Never use react-helmet-async or any <head> manipulation component.
Next.js handles all metadata through the Metadata API.

Every page.tsx exports a metadata object or a generateMetadata function.
Next.js reads this at build time and injects the correct <head> tags automatically.

---

## Static metadata (most pages)

Add this export to every app/**/page.tsx:
```tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Name — AXIS",
  description: "Under 160 characters. Describes what this page offers.",
  openGraph: {
    title: "Page Name — AXIS",
    description: "Same as above or slightly adapted for social sharing.",
    url: "https://yourdomain.com/page-path",
    type: "website",
  },
}
```

## Page title format

Every page title follows this pattern: "Page Name — AXIS"

| Page           | Title                                                        |
|----------------|--------------------------------------------------------------|
| Home           | AXIS — Client Conversion Systems for Sports Studios          |
| Pricing        | Pricing — AXIS                                               |
| Our Work       | Our Work — AXIS                                              |
| About          | About — AXIS                                                 |
| 404            | Page Not Found — AXIS                                        |

---

## Root layout metadata (app/layout.tsx)

The root layout already has base metadata. Do not modify it.
Page-level metadata merges with and overrides the root layout metadata.
Never duplicate the root layout metadata inside a page.

---

## Heading hierarchy

Every page must have exactly one <h1>.
This is a hard SEO requirement — violating it harms search ranking.

```
Page
 └─ <h1>  One per page — the Hero headline only
     └─ <h2>  One per section — each section's headline
         └─ <h3>  Sub-items within a section only
```

Before marking any page complete, verify:
- Exactly 1 <h1> on the entire page
- All section headlines use <h2> — not a styled <p> or <div>
- No heading levels are skipped (never jump from <h1> to <h3>)

---

## Image alt text

Every next/image must have a descriptive alt prop.

Bad:  alt="image"
Bad:  alt="photo"
Bad:  alt=""  (only acceptable for purely decorative images)
Good: alt="Fitness studio owner reviewing her booking dashboard on mobile"
Good: alt="AXIS system diagram showing Instagram connecting to a booking platform"

Describe what is actually in the image as if the reader cannot see it.

---

## JSON-LD structured data

Add this once only — inside app/layout.tsx, in the <head> via Next.js Script or
directly as a dangerouslySetInnerHTML script tag in the root layout:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "AXIS",
      "url": "https://yourdomain.com",
      "description": "Client conversion systems for sports studios",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MX"
      }
    })
  }}
/>
```

Add this only once. Never duplicate it in individual page components.

---

## robots.txt and sitemap.xml

Create these two files in your public/ folder before deployment:

public/robots.txt:
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

public/sitemap.xml:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://yourdomain.com/</loc></url>
  <url><loc>https://yourdomain.com/pricing</loc></url>
  <url><loc>https://yourdomain.com/our-work</loc></url>
  <url><loc>https://yourdomain.com/about</loc></url>
</urlset>
```

Replace yourdomain.com with your actual Vercel domain once known.

---

## Pre-launch SEO checklist

Run these checks before deploying:

- [ ] Every page.tsx has a metadata export with title and description
- [ ] No title exceeds 60 characters
- [ ] No description exceeds 160 characters
- [ ] Exactly one <h1> per page
- [ ] No heading levels are skipped
- [ ] Every next/image has descriptive alt text
- [ ] public/robots.txt exists
- [ ] public/sitemap.xml exists with all page URLs
- [ ] JSON-LD block exists once in app/layout.tsx
- [ ] All og:url values match actual deployed page URLs
