"use client"
// IntegrationsVisual — coded UI mockup for the integrations feature page.
//
// Light-mode SaaS UI: white background, dark text, Instrument Sans throughout.
// Shows:
//   - Category filter tabs (interactive — Framer Motion animated active state)
//   - Filterable grid of integration cards

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Available filter categories — matches the integration taxonomy
const CATEGORIES = ["All", "Payments", "Marketing", "Content", "Access", "Aggregators"] as const
type Category = typeof CATEGORIES[number]

// TypeScript interface for an integration card
interface Integration {
  name:        string
  category:    Category
  description: string
}

// Integration data — realistic names and descriptions
const INTEGRATIONS: Integration[] = [
  { name: "ClassPass",       category: "Aggregators", description: "Reach thousands of new members"    },
  { name: "Urban Sports",    category: "Aggregators", description: "Europe's largest fitness network"  },
  { name: "Wellhub",         category: "Aggregators", description: "Global corporate wellness"         },
  { name: "PayPal",          category: "Payments",    description: "Trusted payment processing"        },
  { name: "Stripe",          category: "Payments",    description: "Smart card infrastructure"         },
  { name: "ActiveCampaign",  category: "Marketing",   description: "Email & CRM automation"            },
  { name: "Zoom",            category: "Content",     description: "Live virtual classes"              },
  { name: "YouTube",         category: "Content",     description: "On-demand class library"           },
  { name: "Vimeo",           category: "Content",     description: "Studio-quality video hosting"      },
  { name: "Kisi",            category: "Access",      description: "Keyless studio entry system"       },
]

// Stagger container for the integration card grid
const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const gridItem = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
}

export default function IntegrationsVisual() {
  // activeCategory: which filter tab is currently selected
  const [activeCategory, setActiveCategory] = useState<Category>("All")

  // Filter the integrations list based on the active category
  const filtered = activeCategory === "All"
    ? INTEGRATIONS
    : INTEGRATIONS.filter((i) => i.category === activeCategory)

  return (
    // White background, flat — no shadow, no border-radius
    <div className="bg-white border border-gray-100 p-4 md:p-6 w-full">

      {/* ── Category filter tabs ──
          Using Framer Motion `animate` for the active state visual change.
          Never use Tailwind's `transition-*` classes on interactive elements — always Framer Motion.
          CSS variables (var(--color-*)) are used because Framer Motion animates raw CSS values
          numerically — it can't animate between Tailwind class names. */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            animate={{
              borderColor: activeCategory === cat ? "var(--color-blue-axis)" : "rgb(229,231,235)",
              color:        activeCategory === cat ? "var(--color-blue-axis)" : "rgb(107,114,128)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-instrument uppercase tracking-widest text-[9px] px-3 py-1.5 border bg-white"
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* ── Integration cards grid ──
          AnimatePresence + key on the grid lets cards animate out when the filter changes.
          The `key` on the motion.div forces a remount when activeCategory changes, replaying the stagger. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={gridContainer}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="grid grid-cols-2 md:grid-cols-5 gap-2"
        >
          {filtered.map((integration) => (
            <motion.div
              key={integration.name}
              variants={gridItem}
              className="bg-gray-50 border border-gray-200 p-3"
            >
              {/* Integration name — dark, semibold */}
              <p className="font-instrument text-gray-900 text-[10px] uppercase tracking-widest font-medium">
                {integration.name}
              </p>
              {/* Description — muted grey */}
              <p className="font-instrument text-gray-500 text-[9px] mt-1.5 leading-relaxed">
                {integration.description}
              </p>
              {/* Category tag — very faint */}
              <p className="font-instrument text-gray-300 text-[8px] mt-2 uppercase tracking-widest">
                {integration.category}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
