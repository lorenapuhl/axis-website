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

## GLOBAL RULES

* Keep layout, colors, spacing, and typography consistent
* Do NOT change the 3-column pricing grid structure
* Do NOT remove any existing features or plans
* Add elements in a way that feels native to the design system
* Preserve the premium SaaS aesthetic


## Content
Add a **visually distinct promotional strip** directly below the 3 pricing cards and replace the section "Why only 5 studios?" and its content with this strip



This should NOT look like a paragraph — it should feel like a compact “offer banner” integrated into the page.

---

## LAYOUT

* Full width within the same max-width container as pricing cards
* Horizontal layout on desktop
* Slightly rounded container (same radius as cards)
* Height: compact (~120–140px max)
* Padding: ~20–24px horizontal, ~16–20px vertical

---

## BACKGROUND STYLE

* Subtle dark gradient (dark blue / accent tint)
* 1px low-opacity border
* Optional soft glow for emphasis
* Must stand out slightly from background, not overpower cards

---

## CONTENT STRUCTURE (DESKTOP)

Split into 3 horizontal zones:

### Primary message

Heading:
“Founding Offer”

Below (use EXACT paragraph, max 2 lines):

“We’re onboarding a small group of studios as we launch this system. You’ll get priority setup for a faster go-live, features tailored to your exact needs, and a locked-in discounted rate as an early partner.”

---

### BELOW (Benefits as inline chips)

Replace bullet points with **3 inline chips**:

[ Priority setup ]   [ Features tailored to your studio ]   [ Discounted lifetime rate ]

Style:

* Pill-shaped
* Subtle border or soft fill
* Small text
* Even spacing
* Wrap if needed but keep tight


---

## MOBILE VERSION

Stack vertically:

1. Heading
2. Paragraph (max 2 lines)
3. Chips (wrap to 2 lines max)
4. “2 spots left”

Spacing:

* Tight (~12–16px gaps)
* Keep compact height

---

## VISUAL BEHAVIOR

* Feels like a **promotion banner**, not text content
* No long paragraphs
* Optimized for quick scanning
* Chips replace traditional bullet lists

---

## FINAL EFFECT

* Immediately communicates a limited launch offer
* Feels premium and intentional
* Adds urgency without clutter
* Integrates seamlessly with pricing section

Do NOT:

* Add CTA buttons
* Expand into large text blocks
* Make it look like a paragraph section


## FURTHERMORE
1. 

delete the content

"Early Access Benefits

✓
Priority setup (faster launch)
✓
Direct input on new features
✓
Lifetime discounted rate"

From the growth pricing card. adapt the sizes of the pricing card to the edited content. make sure they are all the same size (size determined by the card with most conent)

2. Also make sure that the points "✓
Free setup
✓
Direct contact with us
✓
Launch in 7 days" are centered on desktop. right now they are displaced to the left
