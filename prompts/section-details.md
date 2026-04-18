# main page section details

## 0. Preliminary

Read CLAUDE.md first. Then read:
- @skills/component.md
- @skills/animate-section.md
- @skills/seo.md

Do not write any code yet.
Confirm you have read all four files and summarize:
1. Which rules apply to every component
2. What you must never do

Rules:
- Follow exactly the rules stated in CLAUDE.md, component.md, animate-section.md, SEO.md. 
- Use the setup specified in this file. If there are contradictions between both guidelines, ask me first and let me specify what I need.
- If anything is unclear to you, ask me first and let me clarify things for you 
before building anything.
- Only apply the changes specified in this file. do not change anything else.
- Only read files mentioned. Do not read any other files unless necessary.
- Before starting to code, ask me to clarify details to make sure you exactly build what i need.
- Commit every change you do and make your changes overseeable
- push at the end of the task.

## 1. File: components/sections/IntroSection.tsx

make sure that they don't book flashes like it already does that does not disappear. ask me if anything is unclear.

 
## 2. File: components/sections/ProblemSection.tsx

 this section is especially confusing for mobile because the cards change very fast and the user does not have any time to read the content. instead of the automatic swipe from one card to another make sure that this section includes dots under the cards that show is currently active. set off the automatic switch from one card to another make.  let the user swipe from one card to another and every time the user swipes the dots underneath show which card is active.  would it be possible to change the background color of the cards to White how would you do this assumed you would have to do this in terminal.  is this possible ?
 
## 3. File: components/sections/ProductVisualSection.tsx

 the section is visually very well done the only problem is that sometimes the user Scrolls such that part of this section comes into view and the animation starts without the use of being aware of it.  then the animation is already finished and there are missing cards in the Instagram feed is the user didn't see the visual gliding of the cards from the Instagram feed to the website they ask themselves why there are some holes. how would you solve this problem ? 
 
## 4. File: components/sections/LiveSyncSection.tsx

  this section has the same problem, however not that badly because the animation is continuously drawing images from the Instagram feed.  still, is the user does not see the animation drawing the images to the website this animation might still seem a little confusing.  again how would you solve this problem. give me some possibilities and make me choose between one of them
  
## 5. File: components/sections/BenefitsSection.tsx

 this section has the same problem.  there is an automatic roll between the cards delete this automatic scroll and make it manual only search that the user has time to read the card and deliberately swipe from one card to another
 
## 6. File: components/sections/PricingSection.tsx

 the Center pricing card "Growth" is not oriented in the middle but slightly  oriented to the left align it to the center of the viewport when it is in view

