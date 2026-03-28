# Animation Specification: Rhythmic Diagnostic Build

This document outlines the animation logic for the **"Axis Diagnostic"** section. It is designed to be implemented using **React** and **Framer Motion**, focusing on a mechanical, rhythmic build-up that highlights business inefficiencies.

---

## Phase 1: The Soft Entrance
* **Phrase:** `"Your studio has visibility."`
* **Animation Style:** `Ease-Out` Fade.
* **Behavior:** This line drifts in slowly and smoothly. It represents the "status quo"—the part of the business the owner is proud of. It remains static as the "hammering" sequence begins below it.
* **Timing:** * **Start:** `delay: 0` (immediately upon entering viewport).
    * **Duration:** `0.8s`.

---

## Phase 2: The Staggered "No" Sequence
Each subsequent line is split into two parts (Part A and Part B) to create an internal "double-beat" effect.

| Phrase | Part A (The "Snap") | Part B (The "Suffix") |
| :--- | :--- | :--- |
| **Line 1** | `"But no"` | `"structure."` |
| **Line 2** | `"No"` | `"clear offer."` |
| **Line 3** | `"No"` | `"way to buy."` |
| **Line 4** | `"No"` | `"link that converts."` |

### The "Internal Offset" Rule:
* **Part A (The Prefix):** Snaps into place using a **high-stiffness spring** (`stiffness: 400`, `damping: 30`).
* **Part B (The Suffix):** Waits exactly **100ms** after Part A begins, then performs the exact same snap.
* **Visual Result:** The "No" hits the screen first, followed instantly by the reason, creating a rhythmic "hammering" sensation.

---

## Phase 3: The Staggered "Vertical" Build
To ensure the user processes each deficiency, the lines are staggered vertically. Each line waits for the "Double-Beat" of the previous line to complete.

* **Line 1 Build:** Starts at **0.8s** (immediately after Phase 1 finishes).
* **Line 2 Build:** Starts at **1.3s**.
* **Line 3 Build:** Starts at **1.8s**.
* **Line 4 Build:** Starts at **2.3s**.

---

## Implementation Notes for Claude Code
* **Physics:** Use `type: "spring"` with `y: 10` (initial) to `y: 0` (target) to ensure the "Snap" feels mechanical and grounded.
* **Viewport:** Use `whileInView` with a `0.5` amount threshold so the sequence triggers only when the user is focused on the section.
* **Structure:** Wrap each line in a `motion.div` that handles the vertical stagger, with two nested `motion.span` elements handling the 100ms internal offset.
