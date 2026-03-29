"use client"
// "use client" is required here because this component uses React state (useState).
// In Next.js App Router, components are "Server Components" by default (they run only
// on the server and produce plain HTML). Adding "use client" tells Next.js this
// component must also run in the browser, which is necessary whenever we need
// interactivity — like opening/closing an accordion or switching categories.

import { useState } from "react"
// useState: a React Hook (a special function) that lets us track a changing value
// inside a component. It returns [currentValue, setterFunction].
// When the setter is called, React re-renders the component with the new value.

import { motion, AnimatePresence } from "framer-motion"
// motion: Framer Motion's replacement for standard HTML/JSX elements (div, button, p…).
//         A <motion.div> is just like a <div>, but it can animate.
// AnimatePresence: a wrapper that detects when children are added or removed from the
//         DOM and plays their entrance/exit animations accordingly. Without it,
//         exit animations are skipped.

import {
  MessageCircle,
  Star,
  Layers,
  Rocket,
  LayoutGrid,
  RefreshCw,
  CreditCard,
  Code,
  ChevronDown,
} from "lucide-react"
// Lucide React: a library of SVG icons, each exported as a React component.
// Usage: <MessageCircle size={16} className="text-soft-grey" />
// The `size` prop controls width and height. `className` applies Tailwind classes.

import type { LucideIcon } from "lucide-react"
// LucideIcon: the TypeScript type that describes any Lucide icon component.
// Storing it here lets TypeScript know what shape our icon references have,
// so we don't have to use `any` (which CLAUDE.md forbids).

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// A "type" or "interface" in TypeScript is like a schema for a Python dictionary —
// it tells the system exactly what keys and value types an object must have.
// ─────────────────────────────────────────────────────────────────────────────

interface Question {
  q: string // The question text
  a: string // The answer text
}

interface FAQCategory {
  id: number          // Numeric index used as a React key and to track the active tab
  category: string    // Category name shown in the sidebar/tab bar
  icon: LucideIcon    // The Lucide icon component reference (not JSX — the function itself)
  questions: Question[]
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ DATA
// All content lives here as a plain data structure, separate from the markup.
// To add, remove, or edit a question, change it here — the UI updates automatically.
// This pattern (data + .map()) is the React equivalent of a Jinja2 template loop.
// ─────────────────────────────────────────────────────────────────────────────

const faqData: FAQCategory[] = [
  {
    id: 0,
    category: "Why Not Just Use Instagram?",
    icon: MessageCircle,
    questions: [
      {
        q: "Why is a website better than DMs for getting new clients?",
        a: "Modern clients value speed and privacy. Many potential members will choose a studio based purely on who allows them to book a spot without having to \"start a conversation\" first. Axis removes the social friction—your clients can see the schedule, pick a spot, and pay in under 60 seconds.",
      },
      {
        q: "People already find me on Instagram. Why do I need a website?",
        a: "Because you're missing the 40% of your local market that starts their search on Google, not Instagram. While Instagram is a \"walled garden,\" an Axis site is an open door. We make sure you show up when someone searches \"Best Pilates Studio near me\" on Google Maps.",
      },
      {
        q: "Isn't a \"Link in Bio\" tool enough?",
        a: "A link-tree is just a list of buttons; Axis is a high-performance machine. Most \"link\" tools are slow and don't allow for integrated payments, membership management, or SEO. Axis provides a premium, branded experience that builds immediate trust and keeps clients on your platform.",
      },
      {
        q: "I post my schedule in my Stories. Why do I need a website schedule?",
        a: "Stories disappear in 24 hours. Your website schedule is permanent, searchable, and interactive. Instead of clients scrolling through old Highlights, they can filter by instructor, style, or time of day and book in two clicks.",
      },
      {
        q: "Honestly, will this actually save me time, or is it just another tool to manage?",
        a: "It's a time-multiplier. Axis automates the cycle of answering \"Is there space?\" and sending payment links. Because your website stays updated via Instagram and bookings happen while you sleep, owners save an average of 1 hour per day previously wasted on admin back-and-forth.",
      },
    ],
  },
  {
    id: 1,
    category: "Social Proof & Trust",
    icon: Star,
    questions: [
      {
        q: "Will a website really make my studio look more professional than Instagram?",
        a: "Yes. A custom domain and a dedicated booking platform signal that you are an established, long-term business. It moves the perception of your brand from \"talented freelancer\" to \"professional boutique studio,\" justifying premium pricing.",
      },
      {
        q: "What if I don't have many followers on Instagram yet?",
        a: "A website actually solves this. Unlike Instagram, where low follower counts can look \"new,\" a clean, high-performance website focuses entirely on your service and schedule, leveling the playing field with larger gyms.",
      },
      {
        q: "What kind of results do studios typically see after launching with Axis?",
        a: "Most studios see an immediate shift in conversion and capacity. By removing the DM-to-book barrier, studios often report a 30–50% increase in first-time bookings within the first month, alongside massive \"Admin Freedom.\"",
      },
      {
        q: "Is this actually used by studios like mine?",
        a: "Yes. Axis is purpose-built for boutique environments like Pilates, yoga, boxing, and dance studios. If you rely on Instagram for community and Google for discovery, Axis is built specifically for your workflow.",
      },
    ],
  },
  {
    id: 2,
    category: "Transition & Integration",
    icon: Layers,
    questions: [
      {
        q: "Will I lose my current clients or have to change my workflow?",
        a: "Not at all. Axis is designed to wrap around your current business. You can keep using Instagram exactly as you do today; Axis simply adds a professional \"conversion layer\" to organize the interest you're already generating.",
      },
      {
        q: "Can I still use WhatsApp or Instagram DMs to talk to clients?",
        a: "Absolutely. Axis doesn't replace your personal touch; it upgrades your professional boundaries. You can still chat, but you can send a professional link where the \"boring stuff\" like payments and scheduling is handled automatically.",
      },
      {
        q: "Do I need to stop using \"Link in Bio\" tools like Linktree?",
        a: "You won't need them. You simply replace that generic list of buttons with your own professional domain, sending potential clients to a high-converting booking machine instead of a third-party list.",
      },
      {
        q: "What if I'm in the middle of a class pack or membership cycle?",
        a: "We make the transition seamless. You can manually import your existing active members into the Axis dashboard so they can begin booking their remaining sessions online immediately with zero downtime.",
      },
    ],
  },
  {
    id: 3,
    category: "Setup & Onboarding",
    icon: Rocket,
    questions: [
      {
        q: "How long does it take to get my website live?",
        a: "We can have your professional booking site ready in under 7 days. Once you connect Instagram and provide your schedule, our team handles the technical architecture so you can start taking payments almost immediately.",
      },
      {
        q: "Do I need to buy hosting or a server?",
        a: "No. Axis is an all-in-one platform. We handle hosting, security updates, and technical maintenance so you can focus entirely on your studio.",
      },
      {
        q: "What do I need to provide to get started?",
        a: "Just three things: your Instagram handle, your current class schedule, and a list of your membership prices. We handle the design, booking integration, and payment setup.",
      },
    ],
  },
  {
    id: 4,
    category: "Features",
    icon: LayoutGrid,
    questions: [
      {
        q: "How does the integrated booking system work?",
        a: "Clients see real-time availability and book in seconds without leaving your site. You receive an instant notification, and the spot is automatically removed from your inventory across all devices.",
      },
      {
        q: "Can I sell memberships and recurring class packs?",
        a: "Yes. Our system handles one-time drop-ins, bundles, and automated monthly memberships via Stripe. Funds are deposited directly into your studio's bank account.",
      },
      {
        q: "Does the website help me show up on Google Maps?",
        a: "Absolutely. We optimize your Google Business Profile integration and site metadata so you show up when locals search for fitness services in your area.",
      },
      {
        q: "Can I see how many people are visiting my site?",
        a: "Yes. Your Axis dashboard includes a simplified analytics view showing where traffic comes from and which classes are your most popular conversion points.",
      },
      {
        q: "Do my clients get their own login or profile?",
        a: "Yes. Members get a dedicated portal to manage bookings and track credits, drastically reducing the number of administrative questions you receive.",
      },
      {
        q: "Do I need to be a data expert to understand my dashboard?",
        a: "Not at all. We've stripped away the \"fluff\" to give you a clean view of revenue, new vs. returning clients, and popular class times.",
      },
      {
        q: "Does the dashboard help me track membership churn?",
        a: "Yes. It highlights upcoming renewals and alerts you to \"at-risk\" clients who haven't booked in 14 days so you can reach out.",
      },
      {
        q: "Can I export my data for tax season?",
        a: "Absolutely. You own your data. Export financial reports or client lists anytime with one click.",
      },
    ],
  },
  {
    id: 5,
    category: "Instagram Automation",
    icon: RefreshCw,
    questions: [
      {
        q: "Do I need to manually upload my Instagram posts?",
        a: "No. Our system syncs in real-time. Every new Reel or photo automatically appears in your website's gallery, keeping it fresh without you ever logging into an editor.",
      },
      {
        q: "What if I post something personal?",
        a: "You have full control. You can set the automation to pull from specific hashtags or display your latest feed.",
      },
      {
        q: "Can I control which posts appear in different sections?",
        a: "Yes. Using hashtags like #news, #events, or #promo in your captions automatically routes posts to the corresponding columns on your site.",
      },
      {
        q: "I'm not a \"tech person.\" Is this hard to use?",
        a: "If you can post on Instagram, you can use this. We handle the heavy lifting of the setup.",
      },
      {
        q: "Will this be more work?",
        a: "It saves you work. Instead of updating a website separately, your existing Instagram content keeps your site visually alive.",
      },
      {
        q: "Does Instagram content help me on Google?",
        a: "Yes. Google views \"active\" sites as higher quality. Pulling in fresh IG content helps you rank higher than studios with static websites.",
      },
      {
        q: "Why not just let people look at my Instagram directly?",
        a: "Instagram is \"noisy.\" Your website takes that same content and places it right next to a \"Book Now\" button, turning curiosity into revenue.",
      },
    ],
  },
  {
    id: 6,
    category: "Pricing & Risks",
    icon: CreditCard,
    questions: [
      {
        q: "How much does Axis cost?",
        a: "We offer straightforward monthly plans with no hidden fees. You get a premium website and automation for less than the cost of a single private session per month.",
      },
      {
        q: "Am I locked into a long-term contract?",
        a: "No. Our plans are month-to-month. You can cancel at any time; we believe in earning your business every month.",
      },
      {
        q: "What happens if I want to cancel?",
        a: "You can cancel with one click. Your site remains active until the end of the billing cycle, and we'll help you export your client data.",
      },
      {
        q: "Are my payments and client data secure?",
        a: "Security is our baseline. We use SSL encryption and Stripe (Tier-1 payment processing). We never store full credit card details on our servers.",
      },
      {
        q: "What if the website doesn't look the way I imagined?",
        a: "We provide a dedicated \"Design Review\" phase. We don't launch until you are proud to share the link.",
      },
    ],
  },
  {
    id: 7,
    category: "Technical Questions",
    icon: Code,
    questions: [
      {
        q: "How does the \"Hashtag Routing\" work exactly?",
        a: "It's like a digital filing cabinet. Our system reads your hashtags and routes posts to the correct section (Events, Promos, etc.) automatically.",
      },
      {
        q: "Is the booking system synced with my personal calendar?",
        a: "Yes. We integrate with major calendar tools to prevent double-booking. When a client books, your roster updates instantly.",
      },
      {
        q: "What happens if I change my prices or schedule?",
        a: "You can update your core settings in seconds through the Axis dashboard, and the changes reflect across your entire site instantly.",
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function FAQSection() {

  // activeCategory: tracks which category tab is selected.
  // Initialized to 0 → the first category ("Why Not Just Use Instagram?").
  const [activeCategory, setActiveCategory] = useState<number>(0)

  // openQuestion: tracks the index of the currently expanded accordion item.
  // null means every accordion item is collapsed (nothing is open).
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)

  // handleCategoryChange: selects a new category AND resets the open accordion.
  // This prevents a question from a previous category staying visually expanded
  // when the user switches to a different category tab.
  const handleCategoryChange = (id: number) => {
    setActiveCategory(id)
    setOpenQuestion(null)
  }

  // handleToggleQuestion: opens the clicked question if it was closed, or closes
  // it if it was already open (a toggle pattern).
  // i === openQuestion → already open → set to null (close it)
  // i !== openQuestion → closed → set to i (open it)
  const handleToggleQuestion = (i: number) => {
    setOpenQuestion(openQuestion === i ? null : i)
  }

  // Shortcut to the currently selected category object, for cleaner JSX below.
  const currentCategory = faqData[activeCategory]

  return (
    <section
      id="faq"
      // bg-grey-axis: near-black (#121212) — differentiates this section from
      // bg-black-axis (#000000) neighbors, creating a subtle surface shift.
      className="bg-grey-axis py-20 px-6 md:py-36 md:px-12"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ──────────────────────────────────────────────── */}
        {/*
          Fades and rises up as the section enters the viewport.
          duration 0.7s — the standard from animate-section.md.
          viewport={{ once: true }} — fires only the first time the section
          becomes visible. Prevents the animation from replaying on scroll-back.
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 text-center"
        >
          {/* Section label — uppercase tracking acts as a visual anchor above the headline */}
          <p className="font-instrument text-xs uppercase tracking-[0.2em] text-blue-axis mb-4">
            FAQ
          </p>

          {/* Section headline — <h2> because the page's single <h1> lives in HeroSection */}
          <h2 className="font-playfair text-4xl md:text-5xl uppercase tracking-tight text-white-axis">
            Questions &amp; Answers
          </h2>
        </motion.div>

        {/* ── MAIN LAYOUT: CENTERED COLUMN ────────────────────────────────── */}
        {/*
          Single-column centered layout on all screen sizes.
          flex-col stacks the category tab bar above the questions panel.
          items-center centers both children horizontally.
        */}
        <div className="flex flex-col items-center gap-10 w-full">

          {/* ── CATEGORY NAVIGATION ───────────────────────────────────────── */}
          {/*
            A centered, wrapping row of tab buttons on all screen sizes.
              flex-row         → lays buttons out horizontally
              flex-wrap        → allows buttons to wrap onto the next line
                                 instead of overflowing (important on mobile)
              justify-center   → centers the row of buttons
              gap-2            → comfortable spacing between tabs
              w-full           → fills the container width so centering works
          */}
          <nav
            aria-label="FAQ categories"
            className="flex flex-row flex-wrap justify-center gap-2 w-full"
          >
            {/*
              .map(): loops over the faqData array.
              In Python this is equivalent to:
                for cat in faqData: render_button(cat)
              React requires each item in a list to have a unique `key` prop so
              it can track which element is which across re-renders.
            */}
            {faqData.map((cat) => {
              // Icon: the Lucide icon component stored in each category object.
              // We assign it to a capitalized variable (Icon) so JSX treats it as
              // a component (<Icon />) rather than an HTML tag (<icon />).
              const Icon = cat.icon
              const isActive = cat.id === activeCategory

              return (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  // whileHover: on mouse-over, slide the inactive item 4px to the right.
                  // This gives a tactile "pointer" feel without being decorative.
                  // Active items don't move — they're already selected.
                  whileHover={isActive ? {} : { x: 4 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={[
                    // Layout: icon and text side-by-side
                    "flex items-center gap-3 text-left",
                    // Padding: generous enough to be an easy tap target on mobile
                    "py-3 px-3",
                    // Prevent buttons from shrinking inside the flex row
                    "flex-shrink-0",
                    // Typography
                    "font-instrument text-xs uppercase tracking-[0.15em]",
                    // State-driven color: white if active, muted grey if not
                    isActive ? "text-white-axis" : "text-soft-grey",
                  ].join(" ")}
                  // aria-current: tells screen readers which tab is active.
                  // This is the accessible equivalent of a visual highlight.
                  aria-current={isActive ? "true" : undefined}
                >
                  {/* Category icon — small (14px) to stay subordinate to the text */}
                  <Icon size={14} className="flex-shrink-0" />

                  {/* Category name */}
                  <span>{cat.category}</span>
                </motion.button>
              )
            })}
          </nav>

          {/* ── QUESTIONS PANEL ─────────────────────────────────────────────── */}
          {/*
            key={activeCategory}: when the user switches categories, this `key`
            changes. React unmounts the old panel and mounts a new one, which
            re-triggers the entrance animation. This is the React pattern for
            "restart this animation when the content changes."

            w-full: fills the available width inside the centered flex container.
            max-w-3xl: caps the accordion at ~768px on large screens so that
                       long answer text stays at a comfortable reading line length.
          */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            // `animate` (not `whileInView`) because this re-animation is triggered
            // by user interaction (clicking a tab), not by scrolling into view.
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-3xl"
          >

            {/* Loop over each question in the active category */}
            {currentCategory.questions.map((question, index) => (
              <div key={index}>

                {/* ── QUESTION BUTTON ─────────────────────────────────────── */}
                {/*
                  Per CLAUDE.md: "NEVER use <div onClick> — always use <button>
                  for clickable elements." A <button> is semantically correct here
                  because clicking it performs an action (toggling the answer).

                  group: a Tailwind convention. Child elements can use `group-hover:`
                  classes to react when the parent button is hovered. This avoids
                  duplicating hover logic on every child element.

                  w-full: makes the button fill the full width of the panel.
                  text-left: overrides the browser's default centered button text.
                  aria-expanded: tells screen readers if the answer is currently open.
                */}
                <motion.button
                  onClick={() => handleToggleQuestion(index)}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  aria-expanded={openQuestion === index}
                >
                  {/* Question text */}
                  <span
                    className={[
                      "font-instrument text-sm md:text-base leading-relaxed",
                      // Show white text for the open question; muted grey for all others.
                      // group-hover:text-white-axis: lightens the text when the user
                      // hovers the button, giving a clear tap-target signal.
                      // Note: no `transition-colors` class — the color change is instant,
                      // not a CSS animation, which complies with the Framer Motion rule.
                      openQuestion === index
                        ? "text-white-axis"
                        : "text-soft-grey group-hover:text-white-axis",
                    ].join(" ")}
                  >
                    {question.q}
                  </span>

                  {/* ── CHEVRON ICON ──────────────────────────────────────── */}
                  {/*
                    Rotates 180° when the answer is open, acting as a visual
                    indicator of state (open = pointing up, closed = pointing down).

                    This uses `animate` (not `whileInView`) because it responds to
                    a state change, not a scroll event. `duration: 0.4` — a small
                    element, per animate-section.md timing guidance.

                    flex-shrink-0: prevents the icon from squishing on small screens.
                    mt-1: aligns the icon's top edge with the first line of text.
                  */}
                  <motion.div
                    animate={{ rotate: openQuestion === index ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-shrink-0 mt-1"
                  >
                    <ChevronDown
                      size={16}
                      className={
                        openQuestion === index
                          ? "text-white-axis"
                          : "text-soft-grey"
                      }
                    />
                  </motion.div>
                </motion.button>

                {/* ── ANSWER (ACCORDION BODY) ──────────────────────────────── */}
                {/*
                  AnimatePresence wraps this block so the exit animation plays
                  when `openQuestion !== index` and the <motion.div> is removed
                  from the DOM. Without AnimatePresence, it would vanish instantly.

                  initial={false}: suppresses the entrance animation on first render.
                  All answers start closed; we don't want a "collapse" animation to
                  fire before the user has done anything.
                */}
                <AnimatePresence initial={false}>
                  {openQuestion === index && (
                    <motion.div
                      key="answer"
                      // height 0 → auto: reveals the answer by growing its height.
                      // opacity 0 → 1: simultaneously fades the text in.
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      // On exit: shrinks back to 0 height while fading out.
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      // overflow-hidden: clips the answer text as the container
                      // grows and shrinks. Without this, text would be visible
                      // outside the animated height boundary during the transition.
                      className="overflow-hidden"
                    >
                      <p className="font-instrument text-sm md:text-base text-soft-grey leading-relaxed pb-6">
                        {question.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── DIVIDER ──────────────────────────────────────────────── */}
                {/*
                  A thin horizontal rule between each question.
                  opacity-10: very faint — keeps the visual weight minimal.
                  Using a <div> instead of <hr> to avoid browser default styles
                  (margin, border) that would need to be reset.
                */}
                <div className="h-px bg-white-axis opacity-10" />

              </div>
            ))}

          </motion.div>
        </div>
      </div>
    </section>
  )
}
