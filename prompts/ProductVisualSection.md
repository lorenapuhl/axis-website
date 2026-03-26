Build a React component called `ProductVisualSection` that visually demonstrates how an Instagram feed transforms into a structured website for a fitness studio.

---

## SECTION GOAL

The section must clearly communicate:

"Your Instagram content is automatically transformed into a structured website with bookings, schedule, and payments."

This should feel like a SaaS product demo, not a decorative animation.

---

## LAYOUT

* Full width section
* Max width: 1440px
* Centered
* Height: 100vh (or min 900px)
* Background: black (#000)
* Padding: 80px horizontal, 80px vertical

Inside:

* Title centered at top
* Below: 2-column grid

GRID:

* grid-cols-2
* gap: 160px

LEFT: Instagram feed
RIGHT: Website preview

---

## HEADER (TOP CENTER)

Text centered, max-width 600px

Headline:
"Your content already exists.
We turn it into a system that converts"

Font:

* text-3xl
* Tight line height
* Medium weight

---

## LEFT SIDE — INSTAGRAM FEED

Container:

* Width: 420–480px
* Background: very dark gray (#0a0a0a)
* Border: 1px solid #1a1a1a
* Border radius: 16px
* Padding: 16px

Top label (absolute, small text):
"Your Instagram"

---

## INSTAGRAM HEADER

* Avatar (32px circle)
* Studio name: "Sports Studio"
* Subtext: "@sports.studio"

---

## INSTAGRAM GRID

* 3 columns
* Gap: 6px
* 9 images total

Use realistic fitness images
Assign each image an ID so we can animate them individually.

IMAGE SET (IMPORTANT MAPPING):

img1: wide pilates/yoga studio (HERO IMAGE)
img2: yoga class (SCHEDULE)
img3: boxing training (SCHEDULE)
img4: pilates reformer (SCHEDULE)
img5: promo post (PRICING)
img6–img9: filler aesthetic images

Make grid slightly imperfect:

* Some images taller (aspect 4:5)
* Some square (1:1)

---

## RIGHT SIDE — WEBSITE PREVIEW

Container:

* Width: 480–520px
* Background: white
* Border radius: 16px
* Padding: 24px
* Initially opacity: 0.2 (faded before animation)

Top label:
"Your website"

---

## WEBSITE STRUCTURE

A. HERO BLOCK

* Height: 160px
* Border radius: 12px
* Overflow hidden

Inside:

* Background image (initially empty placeholder)
* Overlay bottom-left:
  Title: "Train smarter. Book instantly."
  CTA button: "Book a class"

CTA style:

* Black background
* White text
* Rounded (8px)
* Height: 36px
* Small font

---

B. SCHEDULE LIST

Below hero, margin-top: 20px

3 schedule items:

Each item:

* Left: thumbnail (48x48, rounded 8px)
* Middle:
  Class name
  Time + instructor
* Right: button "Book"

Example data:

* "Morning Flow" — 08:00 — Maria L.
* "Boxing Basics" — 12:00 — Alex R.
* "Pilates Core" — 18:00 — Sofia M.

---

C. PRICING CARDS

Below schedule, margin-top: 20px

3 cards in a row:

Card 1:
Drop-in
$25
Button: "Book"

Card 2:
10 Classes
$199
Button: "Buy pack"

Card 3:
Unlimited
$149/mo
Button: "Start"

---

D. SECONDARY CTA

Below:
"View full schedule" (small text, underline)

---

## ANIMATION (CRITICAL PART)

Use Framer Motion + useInView.

Trigger when section enters viewport (30%).

---

## ANIMATION SEQUENCE

STEP 0 (INITIAL STATE)

* Instagram visible
* Website opacity: 0.2
* Website images empty placeholders

---

STEP 1 (0.3s)
Highlight specific Instagram images:

img1, img2, img3, img4, img5

Effect:

* scale: 1.05
* slight brightness increase

---

STEP 2 (0.6s — MAIN TRANSFORMATION)

Animate ONLY these images:

img1 (hero image):

* Moves from grid position → hero block position
* translateX: from left panel to right panel (~+300px to +400px)
* translateY: align to top of hero
* scale: adjust to fill hero container

img2:

* Moves → Schedule item 1 thumbnail

img3:

* Moves → Schedule item 2 thumbnail

img4:

* Moves → Schedule item 3 thumbnail

img5 (promo):

* Moves → Pricing card 2 (center card background or top area)

All movements:

* duration: 0.6–0.8s
* easing: easeInOut
* no bounce

---

STEP 3 (1.0s — SNAP INTO PLACE)

Images snap perfectly into their containers:

* img1 fills hero background
* img2–4 become schedule thumbnails (48x48)
* img5 fits inside pricing card

At the same time:

* Website opacity: 1
* translateY: slight upward motion (10px → 0)

---

STEP 4 (1.2s — UI BUILDS)

Fade/slide in UI elements:

* Hero text appears
* "Book a class" button appears
* Schedule text fades in
* Pricing text fades in

Use stagger (0.05–0.1s delay)

---

STEP 5 (1.6s — FINAL STATE)

* Instagram returns to normal (un-highlighted)
* Website fully built
* Buttons interactive (hover effects)

---

## INTERACTION DETAILS

* Hover on Instagram images: slight zoom
* Hover on buttons: subtle scale (1.02)
* No aggressive animations

---

## IMPORTANT DESIGN RULES

* Keep everything minimal and clean

* No bright colors

* Strong contrast between:
  messy Instagram (left)
  structured system (right)

* This must feel like a real product demo

---

## FINAL EXPECTATION

The user should instantly understand:

"My Instagram content becomes a structured website where people can book classes and pay."

Do NOT simplify the animation.
Do NOT remove the mapping between images and UI components.
This mapping is the core of the concept.

