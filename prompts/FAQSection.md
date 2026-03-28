Act as a Senior Frontend Engineer. Create a React component `FAQSection.tsx` using Tailwind CSS and Framer Motion. 

### Design Architecture:
- Style: Minimalist SaaS aesthetic. Clean lines, high-quality information density, and plenty of whitespace.
- Navigation: On Desktop, use a left-hand vertical sidebar to switch between categories. On Mobile, use a scrollable top bar or a vertical stack.
- Interaction: Use an Accordion pattern for the Q&As within each category. 
- Elements: Use `Lucide` icons for category indicators. Use a thin divider between questions.

### Content Data Structure:
Implement the following content in this exact category order:

1. "Why not just use Instagram? Why do I need Axis?"
   - Q: Why is a website better than DMs for getting new clients? 
     A: Modern clients value speed and privacy. Many potential members will choose a studio based purely on who allows them to book a spot without having to "start a conversation" first. Axis removes the social friction—your clients can see the schedule, pick a spot, and pay in under 60 seconds.
   - Q: People already find me on Instagram. Why do I need a website? 
     A: Because you’re missing the 40% of your local market that starts their search on Google, not Instagram. While Instagram is a "walled garden," an Axis site is an open door. We make sure you show up when someone searches "Best Pilates Studio near me" on Google Maps.
   - Q: Isn’t a "Link in Bio" tool enough? 
     A: A link-tree is just a list of buttons; Axis is a high-performance machine. Most "link" tools are slow and don't allow for integrated payments, membership management, or SEO. Axis provides a premium, branded experience that builds immediate trust and keeps clients on your platform.
   - Q: I post my schedule in my Stories. Why do I need a website schedule? 
     A: Stories disappear in 24 hours. Your website schedule is permanent, searchable, and interactive. Instead of clients scrolling through old Highlights, they can filter by instructor, style, or time of day and book in two clicks.
   - Q: Honestly, will this actually save me time, or is it just another tool to manage? 
     A: It’s a time-multiplier. Axis automates the cycle of answering "Is there space?" and sending payment links. Because your website stays updated via Instagram and bookings happen while you sleep, owners save an average of 1 hour per day previously wasted on admin back-and-forth.

2. "Social Proof and Trust Signals"
   - Q: Will a website really make my studio look more professional than Instagram? 
     A: Yes. A custom domain and a dedicated booking platform signal that you are an established, long-term business. It moves the perception of your brand from "talented freelancer" to "professional boutique studio," justifying premium pricing.
   - Q: What if I don't have many followers on Instagram yet? 
     A: A website actually solves this. Unlike Instagram, where low follower counts can look "new," a clean, high-performance website focuses entirely on your service and schedule, leveling the playing field with larger gyms.
   - Q: What kind of results do studios typically see after launching with Axis? 
     A: Most studios see an immediate shift in conversion and capacity. By removing the DM-to-book barrier, studios often report a 30-50% increase in first-time bookings within the first month, alongside massive "Admin Freedom."
   - Q: Is this actually used by studios like mine? 
     A: Yes. Axis is purpose-built for boutique environments like Pilates, yoga, boxing, and dance studios. If you rely on Instagram for community and Google for discovery, Axis is built specifically for your workflow.

3. "Transition and Seamless Integration"
   - Q: Will I lose my current clients or have to change my workflow? 
     A: Not at all. Axis is designed to wrap around your current business. You can keep using Instagram exactly as you do today; Axis simply adds a professional "conversion layer" to organize the interest you’re already generating.
   - Q: Can I still use WhatsApp or Instagram DMs to talk to clients? 
     A: Absolutely. Axis doesn't replace your personal touch; it upgrades your professional boundaries. You can still chat, but you can send a professional link where the "boring stuff" like payments and scheduling is handled automatically.
   - Q: Do I need to stop using "Link in Bio" tools like Linktree? 
     A: You won't need them. You simply replace that generic list of buttons with your own professional domain, sending potential clients to a high-converting booking machine instead of a third-party list.
   - Q: What if I’m in the middle of a class pack or membership cycle? 
     A: We make the transition seamless. You can manually import your existing active members into the Axis dashboard so they can begin booking their remaining sessions online immediately with zero downtime.

4. "Setup and Onboarding"
   - Q: How long does it take to get my website live? 
     A: We can have your professional booking site ready in under 7 days. Once you connect Instagram and provide your schedule, our team handles the technical architecture so you can start taking payments almost immediately.
   - Q: Do I need to buy hosting or a server? 
     A: No. Axis is an all-in-one platform. We handle hosting, security updates, and technical maintenance so you can focus entirely on your studio.
   - Q: What do I need to provide to get started? 
     A: Just three things: your Instagram handle, your current class schedule, and a list of your membership prices. We handle the design, booking integration, and payment setup.

5. "Features"
   - Q: How does the integrated booking system work? 
     A: Clients see real-time availability and book in seconds without leaving your site. You receive an instant notification, and the spot is automatically removed from your inventory across all devices.
   - Q: Can I sell memberships and recurring class packs? 
     A: Yes. Our system handles one-time drop-ins, bundles, and automated monthly memberships via Stripe. Funds are deposited directly into your studio's bank account.
   - Q: Does the website help me show up on Google Maps? 
     A: Absolutely. We optimize your Google Business Profile integration and site metadata so you show up when locals search for fitness services in your area.
   - Q: Can I see how many people are visiting my site? 
     A: Yes. Your Axis dashboard includes a simplified analytics view showing where traffic comes from and which classes are your most popular conversion points.
   - Q: Do my clients get their own login or profile? 
     A: Yes. Members get a dedicated portal to manage bookings and track credits, drastically reducing the number of administrative questions you receive.
   - Q: Do I need to be a data expert to understand my dashboard? 
     A: Not at all. We’ve stripped away the "fluff" to give you a clean view of revenue, new vs. returning clients, and popular class times.
   - Q: Does the dashboard help me track membership churn? 
     A: Yes. It highlights upcoming renewals and alerts you to "at-risk" clients who haven't booked in 14 days so you can reach out.
   - Q: Can I export my data for tax season? 
     A: Absolutely. You own your data. Export financial reports or client lists anytime with one click.

6. "Instagram Automation"
   - Q: Do I need to manually upload my Instagram posts? 
     A: No. Our system syncs in real-time. Every new Reel or photo automatically appears in your website’s gallery, keeping it fresh without you ever logging into an editor.
   - Q: What if I post something personal? 
     A: You have full control. You can set the automation to pull from specific hashtags or display your latest feed.
   - Q: Can I control which posts appear in different sections? 
     A: Yes. Using hashtags like #news, #events, or #promo in your captions automatically routes posts to the corresponding columns on your site.
   - Q: I’m not a "tech person." Is this hard to use? 
     A: If you can post on Instagram, you can use this. We handle the heavy lifting of the setup.
   - Q: Will this be more work? 
     A: It saves you work. Instead of updating a website separately, your existing Instagram content keeps your site visually alive.
   - Q: Does Instagram content help me on Google? 
     A: Yes. Google views "active" sites as higher quality. Pulling in fresh IG content helps you rank higher than studios with static websites.
   - Q: Why not just let people look at my Instagram directly? 
     A: Instagram is "noisy." Your website takes that same content and places it right next to a "Book Now" button, turning curiosity into revenue.

7. "Pricing, Plans & Risks"
   - Q: How much does Axis cost? 
     A: We offer straightforward monthly plans with no hidden fees. You get a premium website and automation for less than the cost of a single private session per month.
   - Q: Am I locked into a long-term contract? 
     A: No. Our plans are month-to-month. You can cancel at any time; we believe in earning your business every month.
   - Q: What happens if I want to cancel? 
     A: You can cancel with one click. Your site remains active until the end of the billing cycle, and we’ll help you export your client data.
   - Q: Are my payments and client data secure? 
     A: Security is our baseline. We use SSL encryption and Stripe (Tier-1 payment processing). We never store full credit card details on our servers.
   - Q: What if the website doesn't look the way I imagined? 
     A: We provide a dedicated "Design Review" phase. We don't launch until you are proud to share the link.

8. "Technical Questions"
   - Q: How does the "Hashtag Routing" work exactly? 
     A: It’s like a digital filing cabinet. Our system reads your hashtags and routes posts to the correct section (Events, Promos, etc.) automatically.
   - Q: Is the booking system synced with my personal calendar? 
     A: Yes. We integrate with major calendar tools to prevent double-booking. When a client books, your roster updates instantly.
   - Q: What happens if I change my prices or schedule? 
     A: You can update your core settings in seconds through the Axis dashboard, and the changes reflect across your entire site instantly.

### Implementation Requirements:
- Use `framer-motion` for smooth accordion transitions.
- Ensure the sidebar/category selector feels like a premium SaaS dashboard.
- Map through a clean data object to ensure the code is maintainable.
