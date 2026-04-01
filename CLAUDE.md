# AXIS — Client Conversion Systems for Sports Studios

--------------------------

## Project Overview

React + Tailwind CSS landing page for **Axis**, a boutique agency turning
Instagram fitness studios into professional digital businesses.
Stack: Next.js (App Router), React, Tailwind CSS, Framer Motion.
Deployed on Vercel — pushing to `main` triggers an automatic deploy.

### Brand
- Palette: Black #000000, White #FFFFFF, Grey #121212, Electric Blue #0033FF, UV #3D0075, Magenta #FF0099
- Fonts: Playfair Display (headlines) + Instrument Sans (body/UI)
- Typography: All-caps serif headlines, tight tracking. Wide-tracked sans-serif body.
- Feel: Minimal, editorial, high-end. "A system assembling itself as you scroll."

### Architecture
app/                ← Next.js App Router pages
  layout.tsx        ← root layout (fonts, metadata)
  page.tsx          ← home page (assembles sections)
components/         ← one component per file
  sections/         ← HeroSection.tsx, AttentionSection.tsx, etc.
  ui/               ← reusable small components (Button.tsx, etc.) and raw 21st.dev files (never modified)
public/             ← static assets (images, icons)
hooks/              ← dependency hooks from 21st.dev, never modified
  
### Skills
Whenever building a new component, first read:
- @skills/animate-section.md
- @skills/component.md
In addition, when integrating a component from 21st.dev, first read:
- @skills/21st-dev.md.
When building or modifying any file in the app/ directory, first read:
- @skills/seo.md

### Current Status
[UPDATE THIS AS YOU BUILD]
- [x] Header
- [x] Hero
- [x] Intro
- [x] Problem
- [x] Features
- [x] System Visual
- [x] Product Visual
- [x] Live Sync Visual
- [x] Benefits
- [ ] About me
- [x] FAQ
- [x] Final CTA
- [x] Footer
- [ ] Pricing

--------------------------------------------

## Absolute Rules

### When You Are Unsure
If you are not sure what class, color, or spacing to use:
1. Stop
2. Re-read docs/skills/ui-design.md
3. If still unsure, ask the user — do not guess

### Error Recovery Protocol
If any rule is broken:
1. Stop immediately — do not continue writing code
2. State which rule was broken and in which file
3. Fix the violation
4. Re-run the verification checklist
5. Only then continue

### Do Not Modify
- app/layout.tsx — fonts and metadata configured, do not change
- app/globals.css — Tailwind tokens configured, do not change
- public/ — never move or rename files here

-----------------------------------------

## Coding Rules

### Next.js
- This Next.js version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
- This project uses the **App Router** (`app/` directory) — never use Pages Router conventions
- ALWAYS use `next/link` for internal navigation — never `<a href>` for internal links
- ALWAYS use `next/image` for images — never raw `<img>` tags
- ALWAYS add `"use client"` at the top of any component that uses useState, useEffect, event handlers, or browser APIs
- Server Components are the default — only add `"use client"` when actually needed
- NEVER use `getServerSideProps`, `getStaticProps`, or `getInitialProps` — those are Pages Router only

### Tailwind Version
This project uses Tailwind CSS v4.
- There is NO tailwind.config.ts — do not create one
- Tailwind is configured in app/globals.css using @theme blocks
- Custom tokens (fonts, colors, spacing) go in the @theme block in globals.css

### React
- This project uses TypeScript — always use proper types and interfaces
- Component files use .tsx extension, utility files use .ts
- NEVER use `any` as a type — always define proper types
- NEVER use `<div onClick>` — always use `<button>` for clickable elements
- NEVER install a new package without asking the user first

### Styling
- Use Tailwind CSS utility classes for all styling — no inline styles, no CSS modules unless necessary
- ALWAYS use Framer Motion for animations — never raw CSS keyframes or transitions

### File Structure
- Components go in `components/`
- One component per file
- Filename matches the component name (e.g. `HeroSection.tsx`)

### SEO
- Every page.tsx must export a metadata object — never use react-helmet-async
- Every page must have exactly one <h1> — the Hero headline
- Every next/image must have a descriptive alt prop
- Full rules in @skills/seo.md

### Comments
Every component must be commented as if the reader only knows Python, HTML, and CSS.
- Explain what React/Next.js-specific syntax does (hooks, JSX, props, etc.)
- Explain WHY, not just what
- Comment every useEffect, useState, and Framer Motion block
- Comment non-obvious Tailwind classes
- No such thing as too many comments on this project

