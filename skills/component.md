# Component Skill

## Conventions
- Mobile-first. Test at 375px before 1440px.
- If real images are not provided, always use:
  https://placehold.co/800x600/121212/FFFFFF
  Adjust dimensions to match context. Never leave a broken image path.

## Structure
Every section component follows this pattern:
```tsx
"use client" // must be the first line — nothing above this, not even blank lines
import { motion } from "framer-motion"

export default function SectionName() {
  return (
    <section className="bg-black-axis px-12 py-36">
      {/* content */}
    </section>
  )
}
```

## Animation
See @skills/animate-section.md for all animation patterns.

## Primary Button
```tsx
<motion.button
  whileHover={{ scale: 1.03 }}
  transition={{ duration: 0.35, ease: "easeOut" }}
  className="bg-white-axis text-black-axis text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
>
  Get your AXIS
</motion.button>
```
Always use `<button>` — never `<a>` styled as a button unless navigating to an external URL.

## Colors
All brand colors are registered as tokens in globals.css.
Use these classes — never hardcode hex values directly in components:

- bg-black-axis / text-white-axis — primary surfaces and headlines
- bg-grey-axis — secondary section backgrounds
- text-soft-grey — body text, subheadings, muted labels
- text-blue-axis — accent labels, active states, system diagram
- text-uv-axis — use sparingly for gradient accents
- text-magenta-axis — use sparingly for single highlight moments only

Never use more than one accent color in the same section.

## Typography
- Headlines: font-playfair uppercase tracking-tight text-white-axis
- Subheadings: font-instrument uppercase tracking-widest text-soft-grey
- Body: font-instrument text-soft-grey
- Playfair Display and Instrument Sans loaded in app/layout.tsx via next/font/google.
Tailwind classes: font-playfair (headlines), font-instrument (body/UI).

## Spacing
- Section padding: py-36 px-12
- Mobile: py-20 px-6
- Max content width: max-w-6xl mx-auto

## Feel
Every section should feel like part of one continuous system assembling itself.
- Lots of whitespace — never crowd elements
- Typography does the visual work — avoid decorative flourishes
- Animations are slow and confident — nothing snappy or bouncy

# Component Compliance Checklist

Run this after building every component in components/sections/

Review the file you just wrote. Answer YES or NO for every item.
If any answer is NO: stop, fix it, then re-run this checklist from the top.

- [ ] "use client" is the FIRST line of the file — no blank lines, no comments above it
- [ ] `import { motion } from "framer-motion"` is present
- [ ] The component is a default export: `export default function [Name]()`
- [ ] The root element is a `<section>`, not a `<div>`
- [ ] No hardcoded hex values anywhere in the file (search for #)
- [ ] No hardcoded rgb() or hsl() values
- [ ] No more than ONE accent color in this section
      (accent = text-blue-axis, text-uv-axis, or text-magenta-axis)
- [ ] Section has desktop padding: py-36 px-12
- [ ] Section has mobile padding override: py-20 px-6
      (written as: `py-20 px-6 md:py-36 md:px-12` or equivalent)
- [ ] Content is wrapped in: max-w-6xl mx-auto
- [ ] Zero raw <img> tags — every image uses next/image
- [ ] No Unsplash URLs or other demo image URLs
- [ ] Every placeholder uses: https://placehold.co/[W]x[H]/121212/FFFFFF
- [ ] Every next/image has width, height, and a descriptive alt prop
      (alt="image" or alt="" is a failure unless purely decorative)
- [ ] No <a href="..."> for internal links — uses next/link instead
- [ ] No <a> tags styled to look like buttons
- [ ] Every clickable element that isn't a link uses <button>
- [ ] All animations use Framer Motion — zero raw CSS transitions on interactive elements
- [ ] All scroll animations use whileInView with viewport={{ once: true }}
- [ ] No decorative flourishes (borders, dividers, icons) added without a clear purpose
- [ ] Elements are not crowded — whitespace is generous
