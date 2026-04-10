I need a thorough mobile UI audit of my website at smartphone viewport widths (375px–430px). Analyze the codebase and cross-reference it with these specific visual deficiencies I've already identified from a screenshot:

### 0. Preliminary

Read CLAUDE.md first. Then read:
- @skills/component.md
- @skills/animate-section.md
- @skills/seo.md

Do not write any code yet.
Confirm you have read all four files and summarize:
1. Which rules apply to every component
2. What you must never do

Rules:
- Follow exactly the rules stated in CLAUDE.md, component.md
- Go through the tasks in this file. If there are contradictions between both guidelines, ask me first and let me specify what I need.
- If anything is unclear to you, ask me first and let me clarify things for you 
before building anything.
- Only apply the changes specified in this file. do not change anything else.
- Only read the files mentioned. Only read other files if necessary.

## KNOWN ISSUES TO FIX

### 1. Typography & Hierarchy
- Body copy throughout is too big. use `text-base` class for body sections.
- Section headlines lack consistent sizing scale — use `text-4xl` for all section headlines

### 2. Hero Section `TrustHeroSection.tsx`
- The hero CTA button area feels cramped — slightly increase the lower padding (space between CTA button and features section (containing auto sync , <7 setup days, etc)
- center the text (tile, subtitle, CTA button) 

### 3. Problem section `ProblemSection.tsx`
- Problem cards are too large for smartphone wievports. make them adapt to phone width. they also cover part of the section headline

### 4. Menu
- Add a hamburger style menu for the links in the header section.
- Ask me to clarify open questions

### 5. `LiveSyncSection.tsx`
- Not adapted at all to mobile viewport.
- look at the screenshot `mobile-fixes1.png` and propose solutions, before coding anything. make me approve your solutions


