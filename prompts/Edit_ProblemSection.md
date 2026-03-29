You are editing @components/sections/ProblemSection.tsx and components/ui/card-stack.tsx to edit the card content and add descriptive text below each card when the card is in view by the user


---

# 🧱 SECTION LAYOUT

## Structure (top → bottom)

1. Headline (centered)
2. CardStack (main visual)
3. Dynamic text block (changes with active card)
4. Closing statement

---

## 1. HEADLINE

Centered:

"Your studio has visibility - but no structure."

Subline (smaller, muted):

"And visibility doesn't scale."

---

## 2. CARD STACK

Use existing CardStack component and its animations. Maintain the layout. Do not change anything.

---

## 3. CARD CONTENT

Each card (except card 4) uses a **real screenshot (img_1.png → img_6.png)**. Images are saved in @public/problems_visual/

Style:

* full-bleed image
* no padding
* slight grain overlay (very subtle)
* rounded corners (keep consistent with site)

---

## 4. ACTIVE CARD LOGIC (VERY IMPORTANT)

You MUST track the active card index.

When card changes:
→ update the text block below

Use:

```ts
onChangeIndex={(index, item) => setActiveIndex(index)}
```

---

## 5. TEXT BLOCK (DYNAMIC — CORE PART)

### Behavior:

* Text updates based on active card
* Smooth fade transition (200–300ms)
* Always centered under stack
* Max width: ~500–600px

---

## 6. TEXT DESIGN

### Title (above paragraph)

* uppercase
* small size
* letter-spacing wide
* color: muted (gray)

Example:
DM OVERLOAD
NO STRUCTURE
LOST CLIENTS
etc.

---

### Paragraph structure

Each paragraph has TWO lines:

Line 1:

* grey (muted)
* normal weight

Line 2:

* white
* bold

Spacing:

* small gap between lines
* use `<br />`

---

## 7. EXACT CONTENT MAPPING

Map each card index → content:

---

### 0 → DM OVERLOAD

Title:
DM OVERLOAD

Text:
Clients constantly ask for schedules, prices, and availability in DMs.
You spend hours replying manually instead of running your studio.

---

### 1 → NO STRUCTURE

Title:
NO STRUCTURE

Text:
Visitors land on your Instagram but don’t know how to book a class.
Without a clear next step, most leave without taking action.

---

### 2 → LOST CLIENTS

Title:
LOST CLIENTS

Text:
Conversations start in DMs but rarely turn into confirmed bookings.
Each back-and-forth increases the chance the client disappears.

---

### 3 → NO GOOGLE PRESENCE

Title:
NO GOOGLE PRESENCE

Text:
People search for studios like yours on Google but can’t find you.
You miss high-intent clients who are ready to book.

Special styling:

* card background: #D8D8D8
* text: black

---

### 4 → BAD UX

Title:
BAD UX

Text:
Important information is buried in story highlights and scattered posts.
Clients waste time searching and often give up before booking.

---

### 5 → NO SYSTEM

Title:
NO SYSTEM

Text:
Bookings, payments, schedules, and messages are handled across different tools.
Without a system, everything depends on you and nothing scales.

---

## 8. ANIMATION

### Text:

* fade out → update → fade in
* duration: 200–300ms
* slight upward motion (translateY: 5px → 0)


---

## 10. CLOSING STATEMENT

Below text block:

"Your studio runs on attention — not a system."

Small subline:

"And attention doesn’t scale."

Centered. Minimal.

---

# 🎯 FINAL CHECK

User should feel:

"This is exactly my daily reality"

NOT:

"This is a nice UI component"

---

