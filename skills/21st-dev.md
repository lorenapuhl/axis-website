# Skill: 21st-dev.md

Integrating a component from 21st.dev into the AXIS project.

## How we work with 21st.dev templates

The user manually handles file placement — copying the raw template into ui/,
wiring it into sections/ and page.tsx themselves.

Your job is to adapt the template to AXIS brand standards.
You are free to edit any file — including files in components/ui/ — to apply these standards.

---

## Before making any changes, read:
- @skills/component.md — all color tokens, typography, spacing, and button rules apply
- @skills/animate-section.md — all animation rules apply
- @skills/seo.md — all SEO rules apply if the template touches any file in app/

Apply everything defined in those files. Do not guess or improvise styles.

---

## Additional rules specific to 21st.dev templates

### Images
- Replace all raw <img> tags with next/image
- Replace all Unsplash demo URLs with either real assets from public/ or:
  https://placehold.co/800x600/121212/FFFFFF (adjust dimensions to context)
- Always provide width, height, and alt props per @skills/seo.md

### Dependencies
- If the template requires npm packages not yet installed, state exactly what
  needs installing and wait for user approval before proceeding

---

## Verify before finishing

- [ ] No hardcoded hex values in any edited file
- [ ] No raw <img> tags
- [ ] No raw CSS transitions on interactive elements
- [ ] No Unsplash demo URLs
- [ ] No <a href> for internal navigation
- [ ] "use client" is the first line of any file that uses state, effects, or event handlers
- [ ] All AXIS token classes match exactly what is defined in globals.css
- [ ] If any file in app/ was touched: run the SEO checklist from @skills/seo.md
