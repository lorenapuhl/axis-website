Create a "Benefits" section sections/BenefitsSection.tsx to visualize the benefits of AXIS products.

### Structure
- Two-column layout: Left (40% width) for text content, Right (60% width) for the visualizer.

### Left Side: Content Blocks
- Iterate through 4 blocks: "More Revenue", "Less Admin", "More Clients", "Better Experience".
- Headlines: High-contrast Sans Instrument
- Bullet points: Instrument Sans with dim grey text.
- Content:
"
1. More Revenue
- Accept bookings 24/7
- Sell memberships & packages online
- Capture clients you currently lose

2. Less Admin
- No more back-and-forth in DMs
- Automatic scheduling
- Centralized system

3. More Clients
- Show up on Google
- Share a professional link
- Convert visitors into bookings

4. Better Experience
- Clean, simple interface
- Clients find everything instantly
- Use your Instagram branding
"

### Right Side: Interactive Visualizer
- A "Midnight Performance" dashboard card
- Visuals: A dark container with a subtle border. Inside, a large central stat and a sidebar of smaller metrics.
- In the background, a trendline to visualise the stats
- Accent Colors: Use Electric Blue (#0033FF) for the graph line and Vivid Magenta (#FF0099) or Deep Ultraviolet (#3D0075) for subtle glow effects.
- Dynamic Updates: When the active block on the left changes, the stats and the "growth line" on the right should animate to new values using Framer Motion's `animate` prop for a smooth counter effect.

### Content to include (Primary stat - side-bar)
1. More Revenue: [+24% Revenue Growth*] (Sidebar: 0 Lost DM's, 0 Manual Payments)**
2. Less Admin: [12h Saved Weekly*] (Sidebar: 0 Inbox Chaos, 0 Spreadsheet Tracking)**
3. More Clients: [3.5x Conv. Rate*] (Sidebar: 0 Checkout Friction, 0 Manual Confirmations)**
4. Better Experience: [< 2s Booking*] (Sidebar: 0 Outdated Information, 0 Confusion)**

Update the "Benefits" section component with the following details:

#### Disclaimer and Source Visual Additions 
- Primary Stat: Add a small superscript asterisk (*) to the top right of the main centered number (e.g., 24%*). 
- Secondars Stat:  Add a small double superscript asterisk (**) to the top right of the secondary stats cars. 
- Disclaimer: In the bottom right corner of the dashboard card, add a "Source" note in 10px Instrument Sans, Dim Grey)
- When the stats change, the disclaimer text should perform a "Weightless Dissolve" (fade + 2px Y-offset) alongside the numbers.

#### Disclaimer and source content

- Primary stats disclaimers:
* +24% Revenue Growth: "This is the "Hybrid Effect." Mindbody’s 2025 State of the Industry Report and WellnessLiving show that adding automated digital touchpoints and 24/7 booking availability typically increases Average Revenue Per User (ARPU) by 20–40% by capturing late-night bookings that would otherwise be lost in a DM inbox."
* 12h Saved Weekly: "Derived from PushPress and Wodify 2026 case studies. The average boutique owner spends 8–11 hours on manual billing, "ghosted" lead follow-ups, and schedule coordination. Your system centralizes this, reclaiming roughly 1.5 days of work per week."
* 3.5x More Bookings: "Based on conversion audits comparing "Link-in-bio" aggregators (like Linktree) to dedicated, branded landing pages. Pete Bowen’s research shows that reducing friction and increasing brand "Focus" can double or triple conversion rates (99.8%+ increase)."
* < 2s Booking Time: "This is the Google/Deloitte 2025 Standard. Research shows that mobile users abandon sites after 3 seconds. By using a modern stack (Next.js), you ensure a load-to-checkout time that is 8% more likely to convert for every 0.1s saved."
- Secondary stats disclaimers: for all secondary stats, the disclaimer is the same:
“‘0’ represents processes handled automatically by the system rather than manually. In practice, this removes most operational friction points.”

### Trendline & Data Logic
The right side must react to the active benefit block with a specific data trend:
1. **More Revenue:** Data: [20, 45, 30, 80, 95, 110] (Steep Growth).
2. **Less Admin:** Data: [10, 20, 35, 55, 75, 90] (Steady Growth).
3. **More Clients:** Data: [5, 10, 40, 60, 90, 150] (Exponential Growth).
4. **Better Experience (<2s Booking):** Data: [250, 180, 120, 80, 40, 20] (Inverted/Decreasing Trend).
   - NOTE: For this specific block, the trendline MUST decrease to visually represent "reducing friction/time."

### Interaction
- Use Framer Motion 'AnimatePresence' to ensure that when the source text changes, it doesn't "snap" but slides smoothly into place.

### Animations
- Use a "Weightless Dissolve" effect when switching stats (fade in/out with a slight Y-axis slide).
- The blue trend line should "draw" itself using `pathLength` when the section enters view.

### Interaction

* Auto-Cycle with Hover Override

- The 4 benefit blocks should automatically cycle every 3 seconds.
- The "Active" block is 100% white with a subtle Electric Blue left-border glow; inactive blocks dim to 30% opacity.
- Manual Hover: If a user hovers over a specific block, the auto-cycle pauses, and that block immediately becomes "Active," updating the right-side visualizer.

* Animations: The "Axis" Transition
- When the active block changes (either automatically or via hover), the right-side stats should use a Staggered Number Counter.
- The trend line on the graph should "re-draw" or morph smoothly to the new data points using layout and transition={{ type: "spring", stiffness: 100 }} from Framer Motion.
- The Source Disclaimer text should perform a quick "Weightless Dissolve" (fade out, 2px shift, fade back in) to match the new stat's context.
