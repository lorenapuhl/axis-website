# Changes to CTA-flow.md

* STEP 1:

1. in "Your studio name or Instagram handle" i cannot enter the @ symbol
2. in "Where are you losing clients right now?", delete the option "I spend too much time replying to DM's
3. in "Where are you losing clients right now?" use a white circle/fill in the bullet point circle when the option is activated
4. in "Where are you losing clients right now?", change the "clients drop off because booking is too complicated" answer to "clients drop off because booking through DM's is too complicated"
5. in "Where are you losing clients right now?", change the "i have no clear system to manage clients/bookings" answer to "I have no clear system to manage client- and booking-data"t now?" 
6. in WE'LL FIX THIS BY: use a tick/check mark instead of the arrow
7. in "What's your main goal right now?", make sure the user can activate several options. use the same design than in the "Where are you losing clients right now?"
8. in "What's your main goal right now?" replace the option "Fill more classes consistently" with "Automate booking- and client-data management"
9. in "What's your main goal right now?", delete the option "reduce time spent on DM's"
10. add a little star after the mandatory section titles "Your studio name or Instagram handle", "What type of studio do you run?" and "Where is your studio located?" to make clear that these sections have to be filled in 

* STEP 2:

1. put the section "What should this system handle for you automatically?" first. 
2. in "What should this system handle for you automatically?", delete the option "sell packages and memberships automatically"
3. put the "Drop in some photos so we can match your style" next.
4. put the section "How does your studio feel?" last. 
5. between the sections "Drop in some photos so we can match your style" and "How does your studio feel?" put an "OR" to make clear that the the user can either upload images or manually choose a colour palette. 
6. in "How does your studio feel?", change the title to "TELL US HOW YOUR STUDIO FEELS LIKE". 
7. in "How does your studio feel?" change the colour palette of "warm and earthy" to warmer brown and taupe colours. use a warm taupe colour for the colour preview on top of the "warm and earthy" description in this section.
8. in "How does your studio feel?", for the "bright and energetic", let the user choose the energetic colour from a proposed colour palette. right now, the only colour to be chosen from is orange. visualise the different possible energetic colours to choose from as round colour samples aligned horiontally, where right now, there is just an orange field. let the user choose from five different colours: blue, red, orange, purple, green. use energetic colour tones, i give you the responsibility to choose the right colours. 
* MOCK WEBSITE PREVIEW
1. when the user does not upload any pictures, the placeholder images contain comments like "800x600". delete the numbers. 
2. for the last section, that contains a map, use @prompts/map.png to fill the placeholder image. change the text on top "Map — city" to only "city" the chosen city by the user. add a filter on top of @prompts/map.png to make it look more pale (for lack of another word - ask me if you dont understand what i mean), such that the text "city" stands out. you can move the location of the file map.png.
3. add hover effects to the classes, prices, cards, the "book now", and "join a class" buttons
4. the news, promototions, events sections, only have a single images with text overlay right now. add text overlay to every image. use examples like "30% off this week!" (promotions), "3-day bootcamp" (events), "welcome Mathew - our new teacher" (news). find more examples of this kind to have a text overlay for every picture. customize the text overlays. for example, if the user chose yoga-studio, write "welcome Mathew - our new Pilates teacher" and so on. first chose me the text overlays you generates and let my change them if i dont like them before implementing. 
5. in the "Application received." section, change the text subheader from "We're reviewing your studio and preparing your onboarding." to "We review each studio personally to ensure we're a match." Change "You'll hear back from us within 24 hours with the next steps." to "You'll hear back from us within 24 hours with the next steps for onboarding.". delete the third and last sentence completely.
6. in "Your website is ready." change the "Personal assistance by our founder.·Live in 7 days·Free setup call" text to "Personal assistance by our founder.·Live in 7 days·Free setup" 

* CTA - CONNECTION

- Connect this CTA flow to the CTA-button in the hero section in @/components/sections/TrustHeroSection.tsx
- Connect this CTA flow to all CTA-buttons in @app/pricing/ section.


