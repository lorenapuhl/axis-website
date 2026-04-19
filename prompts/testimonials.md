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


Rules:
- Follow exactly the rules stated in CLAUDE.md, component.md, animate-section.md, SEO.md. 
- Use the setup specified in this file . If there are contradictions between both guidelines, ask me first and let me specify what I need.
- If anything is unclear to you, ask me first and let me clarify things for you 
before building anything.
- Only apply the changes specified in this file. do not change anything else.
- commit and push

---

**PROMPT — Testimonial Section (SaaS, High-Trust, Fitness Focus)**

Create a **testimonial section** for a modern SaaS-style landing page targeted at fitness studios (boxing, pilates, yoga, etc.).

Include the testimonial-section (`components/sections/TestimonialSection.tsx`) and import it to `app/page.tsx` between the Questions and Answers and Final CTA. 

### Overall Layout

* Section background: very light gray (#FAFAFA) or subtle off-white
* Max width: 1100px
* Centered content
* Generous vertical padding (100px top / 100px bottom)
* Mobile friendly
---

### Section Header

* Small label (uppercase, muted):
  “TESTIMONIALS”

* Main headline (bold, clean SaaS style):
  “Studios and companies trust the system”

---

### Testimonials Layout

* Use **2 large cards stacked vertically (desktop)**
* On mobile: horizontal swipe (snap scroll)
* Gap between cards: 32px
* Cards should feel **premium, not crowded**

---

### Testimonial Card Design

* Background: white
* Border: 1px solid #EAEAEA
* Border radius: 16px
* Padding: 32px
* Subtle shadow (very soft SaaS feel)

---

### Card Structure

**Top Row: Identity**

* Left: circular avatar (placeholder or subtle gradient)
* Right of avatar:

  * Name (bold)
  * Role + company (muted, smaller)

---

### Testimonial Text

* Large readable paragraph
* Slightly bigger than body text
* Line height: ~1.6
* Max width inside card: ~600px

---

### Footer Row (optional subtle detail)

* Could include:

  * small “Verified client” tag OR
  * small icon OR
  * nothing (keep minimal)

---

### Testimonial Content

**Testimonial 1 — Freelancer Client**

Name: Luis Soriano
Role: Founder (Grupo Soriano)

Text:
“I’ve worked with many Software companies, but working with this was different. Communication was clear, deadlines were always respected, and the attention to detail really stood out. The final result felt polished, professional, and exactly what I needed. It made the whole process easy.”

---

**Testimonial 2 — Boxing Studio (Overhands)**

Name: Overhands Club
Role: Boxing Studio

Text:
“The preview already showed how powerful this could be for our gym. The design looks professional, the structure is clear, and it actually feels like something that could bring in more clients. It’s a big step up from relying only on Instagram.”

---

### Visual Style

* Clean SaaS aesthetic (inspired by Stripe / Linear)
* No heavy colors — mostly white, gray, black
* Focus on **readability + trust**
* Plenty of whitespace
* Avoid clutter

---

### Interaction

* Subtle hover effect on cards:

  * Slight shadow increase
  * Very light lift (translateY -2px)

* Mobile:

  * horizontal scroll
  * snap behavior
  * partial next card visible (tease interaction)

---

### Key Goal

Make the section feel:

* trustworthy
* calm and professional
* minimal but intentional
* like an early-stage startup with strong taste

---

If you want next step: I can turn this into a **more conversion-heavy version** (with metrics, logos, or mini case studies) once you get more clients.

