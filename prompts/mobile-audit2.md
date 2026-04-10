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

## MAIN PAGE

### 1. Problem section `ProblemSection.tsx`
- Place this section's header on top of/before the card stack. make sure the card stack does not overlap with the header

### 2. `LiveSyncSection.tsx`
- put the sections "schedule-updates", "news", "promotions", and "events" along with their respective content/images in rows one beneath each other. ask me to clarify.

### 3. `BenefitsSection.tsx`
- I have the following problem (solve it for mobile AND md viewport): due to the extra space created every time the content/bullet points of a specific section unfold, the viewport scrolls back and forth by itself. how would you solve this ? give me some ideas and possibilies and explain how this would influence the viual layout. 
- on mobile: how can i make sure that the subsection title + content/bullet points are visible with the according chart at the same time on the screen ? how would you change the design and layout of this section to ensure this ? give me some ideas and possibilities.

### 4. `FeatureSection.tsx`
- On mobile, create a swiping card carousel that swipes through all cards horizontally. ask me to clarify.

### 5. `SystemVisualSection.tsx`
- how would you create a horizontal layout ? could you create an effect that begins with the outer left nodes and dynamically lets come into view the right nodes one by one (like a swiping of flowing effect) ? after the effect, the user should be able to horizontally swipe to view each node again

### 6. Hamburger Menu in `HeaderSection.tsx`
- use the following ui style for the hamburger menu: 
```
      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden md:hidden border-t border-edge bg-canvas"
          >
            <nav className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-base py-2 border-b border-edge last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2">
                <LanguageSwitcher lang={lang} />
                <Button
                  href={`/${lang}/schedule`}
                  variant="primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {dict.cta}
                </Button>
              </div>
            </nav>
          </motion.div>
```
- ask me to clarify, if there are any contradictions with rules set in @CLAUDE.md nd @skills/

### 7. `FooterSection.tsx`
- change the visual layout on phones: copyright should be at the very bottom. privacy and terms of service top left. instagram on the right on the same level as privacy and terms of service. ask me to clarify.

## PRICING SECTION

### 8. `PricingSection.tsx`
Make the following changes for mobile view:
1. On mobile, add more space between the header and "Pricing"
2. Create a swiping cards effect for the three pricing cards to align them horizontally
3. all cards should be the same vertical length
4. how could i change the layout such that all cards have the same length like the first (left) card ? 
5. how could i add the "This pays for itself:
If 1 client = $80
Just 3 extra bookings / month → $240" bubble ? how can i add them to every single card (left card: "just 2 extra bookings" and right card "just 5 extra bookings"
6. how can i make the points "·
No setup fee
·
No hidden costs
·
No revenue cuts
·
3-month minimum
·
Cancel anytime after" valid for all cards ? how about replacing the bullet points "✓
Live in 7 days
✓
We set everything up
✓
No tech skills needed
✓
No hidden costs" with "✓
No setup fee
✓
No hidden costs
✓
3-month minimum
✓
Cancel anytime after
✓ Live in 7 days
" (delete the point no revenue cuts and replace it with live in 7 days). do this for both - computer screen and mobile. make sure that the bullet points are vertically stacked on mobile.
7. for both, computer and mobile, delete "Setup begins within 24h". add the subs "Takes less than 2 minutes to start

No credit card required" below the CTA button to all cards

8. For computer and mobile: Change the bullet points of the last (right) pricing card as follows: 
✓ All features from italic(Growth) 
✓ All-in-One Studio Command Dashboard
✓ Weekly Performance Reports (auto-generated)
✓ Revenue Dashboard (bookings, memberships, LTV)
✓ Offer Performance Tracking & Demand Insights (optimize schedule and offers for max bookings)
✓ Automated Client Segmentation (new, active, inactive clients)

9. For computer and mobile: Change the bullet points of the middle pricing card as follows: 
✓ Everything from italic(starter)
✓ Accept bookings 24/7
✓ Sell memberships & packages
✓ Manage class booking-status
✓ Client list and overview dashboard
✓ SEO Google Search optimization

10. For the first pricing card:

✓
Professional website
✓
Instagram auto-sync
✓
Class schedule
✓
Contact & location
×
Online booking
×

11. How would you animate the section "You don't have to figure this out" to make the train of thought flow visually ? (lead the mind and reader visually? )

12. How would you animate From Instagram to bookings in 3 simple steps ? to make the train of thought flow visually ? (lead the mind and reader visually? ) how would you include the diagram beneath (Day 1

Call

Days 2–7

Setup

Days 7-8

Launch) ? right now, it is underneath the three cards which does not make any sense logically, since each node belongs to one of the specific cards.

13. in the last section, We're not a mass product:
- delete the bullet points ✓
Free setup
✓
Direct contact with us
✓
Launch in 7 days
 and add them in small font size text-xs below the CTA button without the ticks.




