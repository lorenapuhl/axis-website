"use client"
// MembershipVisual — coded UI mockup for the membership-management feature page.
//
// Shows:
//   - Three membership tier cards (Drop-in, 10-Class Pack, Annual)
//   - Active member count + retention rate
//   - Stacked distribution bar showing plan popularity

import { motion } from "framer-motion"

// TypeScript interface for a membership tier card
interface Tier {
  name:      string
  price:     string
  per:       string
  includes:  string[]
  highlight: boolean  // true = this is the featured/recommended plan
}

// Membership tiers data
const TIERS: Tier[] = [
  {
    name:      "Drop-in",
    price:     "$22",
    per:       "per class",
    includes:  ["Single class access", "Flexible booking", "Cancel anytime"],
    highlight: false,
  },
  {
    name:      "10-Class Pack",
    price:     "$149",
    per:       "per pack",
    includes:  ["10 credits, valid 60 days", "Priority waitlist", "Pause option"],
    highlight: false,
  },
  {
    name:      "Annual",
    price:     "$79",
    per:       "per month",
    includes:  ["Unlimited classes", "Guest passes (4/yr)", "Loyalty rewards"],
    highlight: true,
  },
]

// Stats shown below the tier cards
const STATS = [
  { label: "Active Members",  value: "342"  },
  { label: "Retention Rate",  value: "87%"  },
  { label: "Trial → Paid",    value: "71%"  },
]

// Distribution bar — widths as Tailwind arbitrary values (no inline styles)
const DISTRIBUTION = [
  { label: "Drop-in 10%",   barClass: "w-[10%] bg-white-axis/10", textClass: "text-soft-grey"  },
  { label: "Pack 40%",      barClass: "w-[40%] bg-soft-grey/40",  textClass: "text-soft-grey"  },
  { label: "Annual 50%",    barClass: "w-1/2   bg-blue-axis",     textClass: "text-blue-axis"  },
]

export default function MembershipVisual() {
  return (
    <div className="bg-grey-axis p-4 md:p-6 w-full">

      {/* ── Tier cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            viewport={{ once: true }}
            // Highlighted (Annual) plan gets a blue accent border and subtle bg tint
            className={`p-4 border ${
              tier.highlight
                ? "border-blue-axis bg-blue-axis/5"
                : "border-white/10 bg-black-axis"
            }`}
          >
            {/* Plan name — blue if highlighted, muted grey if not */}
            <p className={`font-instrument uppercase tracking-widest text-[10px] ${
              tier.highlight ? "text-blue-axis" : "text-soft-grey"
            }`}>
              {tier.name}
            </p>

            {/* Price — large playfair number */}
            <p className="font-playfair text-white-axis text-3xl mt-3">{tier.price}</p>
            <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest">{tier.per}</p>

            {/* Feature list */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
              {tier.includes.map((item) => (
                <p key={item} className="font-instrument text-soft-grey text-[9px]">
                  — {item}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-black-axis p-3">
            <p className="font-instrument text-soft-grey text-[8px] uppercase tracking-widest">{s.label}</p>
            <p className="font-playfair text-white-axis text-xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Distribution bar ── */}
      <div className="bg-black-axis p-4">
        <p className="font-instrument text-soft-grey text-[9px] uppercase tracking-widest mb-3">
          Plan Distribution
        </p>
        {/* Stacked bar — widths via Tailwind classes, never inline styles */}
        <div className="flex h-2 mb-3">
          {DISTRIBUTION.map((d) => (
            <div key={d.label} className={`h-full ${d.barClass}`} />
          ))}
        </div>
        {/* Labels below the bar */}
        <div className="flex justify-between">
          {DISTRIBUTION.map((d) => (
            <p key={d.label} className={`font-instrument text-[8px] uppercase tracking-widest ${d.textClass}`}>
              {d.label}
            </p>
          ))}
        </div>
      </div>

    </div>
  )
}
