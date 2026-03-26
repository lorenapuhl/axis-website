# Task: Edit LiveSyncSection.tsx

## File location
`/components/LiveSyncSection.tsx`

## Context
This is a Next.js + Framer Motion component showing two panels side by side:
- LEFT: a mock Instagram feed (3-column photo grid, 9 cells)
- RIGHT: a mock website with 4 horizontal section cards:
  Schedule Updates / News / Promotions / Events

The images (img1–img12.png at /public/livesync_visual/) already contain
baked-in text like "30% off", "New Teacher", etc. — the text is part of
the image file.

## Animation overview (do not break)
1. On scroll-in, 5 posts highlight, then fly via Framer Motion layoutId 
   transitions into their matching website card.
2. After that, 3 loop posts slide into grid cell 0 one by one, then fly
   to their destination card.
The layoutId system is load-bearing — do not rename IDs or restructure
AnimatePresence wrappers.

## What I want changed

### 1. Overall layout — vertical stack
Change the two-panel layout from side-by-side (current grid-cols-2) to
vertically stacked: Instagram feed on top, website panel below.
On all screen sizes.

### 2. Instagram feed — horizontal scrolling strip
Replace the 3-column photo grid with a horizontal scrolling strip of posts.
Keep the account avatar + name + handle header above it (as it currently is).
The loop slot (cell 0) should remain — new posts still slide in from the left.

### 3. Website panel — 4 columns side by side (kanban layout)
Replace the stacked card rows with 4 equal-width vertical columns, side by side:
  Schedule Updates | News | Promotions | Events

Column headers: font-instrument, uppercase, same style as current card labels.
No other text inside the columns — remove all descriptive text lines such as
"Spring Sale — 20% off memberships", "Welcome our new coach: Alex", etc.
Keep only the column header labels.

### 4. Image destinations — square thumbnail cards stacking in columns
When images fly from the feed into their column, they should appear as square
thumbnail cards. Large enough that baked-in image text remains readable.
Cards stack vertically inside the column, one by one, as the animation runs.

### 5. Reassign ls1 target
Change ls1's target from "notice" to "schedule" so it flies into Schedule Updates.

### 6. Reassign loop1 target
Change loop1 (img11.png, "Sunday Bootcamp") targetSection from "schedule" to
"events" so it flies into the Events column instead of Schedule Updates.
// Note: img11.png contains the text "Sunday Bootcamp" baked into the image.

### 7. Remove text overlays from feed posts
Remove the bg-black-axis/50 overlay divs that render post.text and timestamp
on top of grid images — both in BASE_POSTS cells and the loop slot.
Images are self-explanatory; the overlays are not needed.

## Do NOT change
- The layoutId values (ls1–ls8, loop0–loop2)
- The step/loopPhase timing logic
- The overflow-hidden placement rules (documented in comments)
- Image src paths
- The AnimatePresence wrappers
