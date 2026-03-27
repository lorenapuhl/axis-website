2. Layout Structure
Canvas: Dark/gritty background covering the whole viewport.


Main Container:

A centered, large white card with generous padding (e.g., p-12), occupying ~75% width.

Rounded Corners.

Subtle Shadow: To lift it from the gritty background.

Grid Layout: The white card is divided using a grid or flexbox:

Left Column (Update Feed): Fixed width, occupying ~30%.

Right Columns (Interactive Panels): Occupying the remaining ~70%, split internally.

3. Left Column (Already present in the current code LiveSyncSection.tsx): Categorized Update Feed. This column lists main sections. All category titles should include a dynamic, muted update timestamp (e.g., in grey, smaller font).

Category Components: A title, a timestamp, and a row of images

Row 1: "SCHEDULE UPDATES (Updated Today, 8:00 AM)"

Images drawn dynamically from the instagram feed above. hover effect: images become bigger when mouse is on top to make its content clearly readable.

Row 2: "NEWS (Updated: 2 mins ago)"

Images drawn dynamically from the instagram feed above. hover effect: images become bigger when mouse is on top to make its content clearly readable.

Row 3: "PROMOTIONS (Updated Today, 11:30 AM)"

Images drawn dynamically from the instagram feed above. hover effect: images become bigger when mouse is on top to make its content clearly readable.

Row 4: "EVENTS (New: Summer Slam Info added)"

Images drawn dynamically from the instagram feed above. hover effect: images become bigger when mouse is on top to make its content clearly readable.


4. Top-Right Panel: "NEXT UP Spotlight" (flex-col)
This panel is designed for immediate conversion and urgency.

Sub-Header: "NEXT UP: JIU-JITSU OPEN MAT (8:00 AM)" (Bold, grey text).

Spotlight Image: A large-format, wide-angle image (rounded-xl) of the Jiu-Jitsu class. the image is dynamically drawn from the instagram feed on top using the same effect as the other images.

Real-time Urgency Data Block (Stacked flex items):

Item 1: "Starts in: 14 MIN" (Bold text).

Item 2: Visual progress bar [█████████▒] (e.g., 9 segments filled, 1 empty, rendered with grey/white divs). Next to it: "28/30 Spots Taken".

Item 3: A special, high-urgency callout (bold, highlighted red/orange with fire emojis): "🔥 ONLY 2 SPOTS LEFT! 🔥".

Item 4: A prominent action button: BOOK NOW. (Button color: Dark, text white, rounded-lg).

5. Center-Bottom Right Panel: "Studio Vitals" (Grid)
A 2-column, 2-row grid for live metrics.

H3 Header: "LIVE STUDIO VITALS"

Item 1 (Top Left): StudioCapacity component:

Title: "STUDIO CAPACITY"

Visual: A large, circular progress gauge (SVG path), rendered in #34A853 (green). Center text: "75% FULL".

Item 2 (Top Right): NextClassStarts component:

Title: "NEXT CLASS STARTS"

Visual: A large, circular countdown ring. Center text: "14 MIN".

Item 3 (Bottom Left): EnergyFlow component:

Title: "STUDIO ENERGY FLOW"

Visual: A smooth, animated linear wave graph (#FFFFFF fill gradient under path), showing active but stable energy levels. the x-axis shows today's time, eg 7AM, 8AM etx until 10 PM and the graph shows the energy evolution over time especially high in the morning, then dropping a little at noon and then increasing from afternoon to night.

6. Bottom-Right Panel: "Community Feedback" (Feed)
A live, vertically scrolling feed of curated member comments.

H3 Header: "WHAT OUR COMMUNITY IS SAYING (LIVE)"

Scroll Container: A fixed-height container (overflow-y: scroll) for the feedback cards. Includes a visible, minimalist scrollbar.

Feedback Card Component (FeedbackCard.jsx):

A generic user avatar (circle with light color).

User Handle (@SarahMoves).

The Quote (bolded): "That 9 AM class changed my day's energy ! (Jiu-Jitsu)".

Metadata: A faint red heart icon (❤️ 12) and a dynamic timestamp (3 mins ago).

7. Container Overlays & Floating Text
Container Header (Inside card, Top-Right): A subtle 'Live' status indicator: A faint green dot (●) and text "Live".
