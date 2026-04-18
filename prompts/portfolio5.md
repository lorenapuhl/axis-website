# 1. Start

Read CLAUDE.md first. Then read:
- @skills/component.md
- @skills/animate-section.md
- @skills/seo.md

Do not write any code yet.
Confirm you have read all four files and summarize:
1. Which rules apply to every component
2. What you must never do

# 2. Build

Build: Build the interactive component that showcases a client's website. you could call it `OverhandzSection.tsx` for example or choose another name if you dont find it suitable. it should be in the `/gallery`route and accessible when the user clicks the relevant link in the header section `components/sections/HeaderSection.tsx`. access the website's content in `prompts/overhandz/`.

Content: Read @prompts/portfolio.md for exact instructions.


Rules:
- Follow exactly the rules stated in CLAUDE.md, component.md, animate-section.md, SEO.md. 
- Use the setup specified in this file . If there are contradictions between both guidelines, ask me first and let me specify what I need.
- If anything is unclear to you, ask me first and let me clarify things for you 
before building anything.
- Only apply the changes specified in this file. do not change anything else.

Technical rules:
- create a `public/portfolio/overhandz` folder in which i will add the relevant instagram posts

---------------------------------


# 3. Create File: `components/sections/OverhandzMetrcisSection.tsx`

## Where to add

- This section belongs after `components/sections/OverhandzDashboards.tsx` imported into `app/our-work/page.tsx` 

## Content

- look at `prompts/overhandz/case-study/CaseStudyClient.tsx`. use this page as a template to design this file.
- Replicate exactly them metrics section of `prompts/overhandz/case-study/CaseStudyClient.tsx`
- add little numbers above each metric that explains how this metric was calulated
- when the user clicks on one of the metrics card, then in a very small font size and gray color, appears the comment accordingly to the clicked metrics card with the number. find a suitable and a realistic way to calculate each stat. make an internet search and add some relevant sources if you find any.
- Look at the `components/sections/TrustHero.tsx` file and use the same frames, lightings, colors, and designs as the stats part in this file. the stats should look modern and saas like.



# 4. Create File: `components/sections/OverhandzTestimonialSection.tsx`

## Where to add

- This section belongs after `components/sections/OverhandzMetricsSection.tsx` imported into `app/our-work/page.tsx` 

## GOAL

Create a **high-trust testimonial section** that feels:

→ premium
→ minimal
→ SaaS-like

This is NOT a generic testimonial block.
It should feel like a **product endorsement from a real client**.

---

## CONTENT

Use:

* **Logo:** Overhandz Club (extract from existing assets in `prompts/overhandz/public/images/ui/logo-transparent.png`)
* **Quote:**

> “We went from managing everything in DMs to having a complete system. Bookings, payments, and communication are now seamless — it changed how we run the gym.”

* **Signature:**
  Overhandz Club

---

## DESKTOP LAYOUT

Centered container:

* Max width: `720px`
* Margin top: `mt-32`
* Text aligned center

---

## STRUCTURE

Top → Logo
Middle → Quote
Bottom → Signature

---

## LOGO

* Small size (height ~32px)
* Slight opacity: `opacity-80`
* Margin bottom: `mb-20`

---

## QUOTE

* Font size: `text-xl`
* Line height: `leading-relaxed`
* Color: `text-white`
* Max width: `640px`
* Margin auto

### Style detail:

* Add subtle quotation marks:

  * Either inline OR faint oversized background quotes (very subtle, low opacity)

---

## SIGNATURE

* Margin top: `mt-16`
* Font: `text-sm`
* Color: `text-gray-400`
* Uppercase + slight tracking

---

## CARD DESIGN (IMPORTANT)

Wrap everything in a **SaaS-style card**

### Card styles:

* Background: `#0c0c0c`
* Border: `1px solid #1f1f1f`
* Radius: `rounded-2xl`
* Padding: `p-24`

---

## MICRO DETAILS (THIS MAKES IT FEEL REAL)

* Subtle inner glow or noise texture (very light)
* Slight hover state:

  * border brightens slightly
* Very soft shadow:

  * `shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`


---

## MOBILE

* Padding reduced: `p-16`
* Text slightly smaller: `text-lg`
* Keep centered layout

---

## DO

* Keep it clean
* Let whitespace breathe
* Make it feel like Stripe / Linear testimonial

---

## DON’T

* No avatars
* No stars
* No carousel
* No bright gradients

---

## FINAL FEEL

This should communicate:

→ “This is a serious product used by real businesses”

NOT:

→ “This is a marketing testimonial section”

---

# 4. Create File: `components/sections/PortfolioFinalCTASection.tsx`

## Where to add

- This section belongs after `components/sections/OverhandzTestimonialSection.tsx` imported into `app/our-work/page.tsx` 

## Content

- look at `prompts/overhandz/case-study/CaseStudyClient.tsx`. use this page as a template to design this file.
- Replicate exactly them Final CTA section of `prompts/overhandz/case-study/CaseStudyClient.tsx`
- CTA 1: See the live site --> leads the user to https://overhandz-website.vercel.app/en
- CTA 2: Get your AXIS --> Main CTA flow from `components/cta/`
- small subcomments under the CTA 2, one underneath the other "Get started in less than 2 minutes" and "No setup fees"



