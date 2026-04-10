I need a thorough mobile UI audit of my website at smartphone viewport widths (375px–430px).

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

These fixes should ONLY be applied to mobile viewport. Leave the md viewport layout exactly as it is !

### 1. Problem section `ProblemSection.tsx`
- Place this section's header on top of/before the card stack. make sure the card stack does not overlap with the header

### 2. `LiveSyncSection.tsx`
- put the sections "schedule-updates", "news", "promotions", and "events" along with their respective content/images in rows one beneath each other. ask me to clarify.

### 3. `BenefitsSection.tsx`

- I have the following problem (solve it for mobile AND md viewport): due to the extra space created every time the content/bullet points of a specific section unfold, the viewport scrolls back and forth by itself. how would you solve this ? give me some ideas and possibilies and explain how this would influence the viual layout. 
- on mobile: how can i make sure that the subsection title + content/bullet points are visible with the according chart at the same time on the screen ? how would you change the design and layout of this section to ensure this ? give me some ideas and possibilities.


