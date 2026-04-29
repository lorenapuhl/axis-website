"use client"
// AudienceVisual — coded UI mockup for the audience feature page.
//
// Light-mode SaaS UI: white background, dark text, Instrument Sans throughout.
// Shows two panels:
//   Left:  Automation flow diagram — connected nodes representing a triggered sequence
//   Right: Performance stats — open rate, conversions, active sequences

import { motion } from "framer-motion"

// Automation flow steps — each node is one step in a behavioural trigger sequence
const FLOW_NODES = [
  { label: "Trigger",    value: "First class completed",   type: "event"     },
  { label: "Wait",       value: "7 days",                  type: "delay"     },
  { label: "Condition",  value: "No pass purchased",       type: "condition" },
  { label: "Action",     value: "Send 20% discount",       type: "action"    },
]

// Performance stats for active automations
const STATS = [
  { label: "Active Sequences",     value: "12"    },
  { label: "Triggered This Week",  value: "847"   },
  { label: "Avg Conversion Rate",  value: "34%"   },
  { label: "Revenue Attributed",   value: "$4.2K" },
]

// Other active automations shown in a list
const OTHER_AUTOMATIONS = [
  { name: "Trial Expiry Nudge",      status: "active", triggered: "214" },
  { name: "High Engagement Reward",  status: "active", triggered: "89"  },
  { name: "Re-engagement (30 days)", status: "paused", triggered: "0"   },
  { name: "Post-class Follow-up",    status: "active", triggered: "432" },
]

export default function AudienceVisual() {
  return (
    // White background, flat — no shadow, no border-radius
    <div className="bg-white border border-gray-100 p-4 md:p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── LEFT: Automation flow diagram ── */}
        <div className="bg-gray-50 p-4">
          <p className="font-instrument text-gray-900 text-[9px] uppercase tracking-widest font-semibold mb-6">
            Automation Flow
          </p>

          {/* Vertical stack of connected node cards.
              Each node fades up with a staggered delay to suggest the sequence building. */}
          <div className="flex flex-col items-stretch gap-0">
            {FLOW_NODES.map((node, i) => (
              <motion.div
                key={node.value}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.14 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                {/* Node card — action nodes get a blue border to mark the output step */}
                <div className={`w-full p-3 border ${
                  node.type === "action"
                    ? "border-blue-axis bg-blue-axis/5"
                    : "border-gray-200 bg-white"
                }`}>
                  <p className="font-instrument uppercase tracking-widest text-gray-400 text-[8px] mb-1">
                    {node.label}
                  </p>
                  <p className={`font-instrument text-xs font-medium ${node.type === "action" ? "text-blue-axis" : "text-gray-900"}`}>
                    {node.value}
                  </p>
                </div>

                {/* Connector line between nodes — hidden after the last node */}
                {i < FLOW_NODES.length - 1 && (
                  <div className="w-px h-5 bg-gray-200" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Performance stats + automation list ── */}
        <div className="flex flex-col gap-4">

          {/* Stats grid — 2×2 */}
          <div className="grid grid-cols-2 gap-2">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.09 }}
                viewport={{ once: true }}
                className="bg-gray-50 border border-gray-100 p-3"
              >
                <p className="font-instrument text-gray-400 text-[8px] uppercase tracking-widest leading-tight">
                  {s.label}
                </p>
                <p className="font-instrument text-gray-900 text-xl font-semibold mt-2">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Other active automations list */}
          <div className="bg-gray-50 border border-gray-100 p-4 flex-1">
            <p className="font-instrument text-gray-400 text-[9px] uppercase tracking-widest mb-3">
              All Automations
            </p>
            <div className="flex flex-col">
              {OTHER_AUTOMATIONS.map((auto, i) => (
                <motion.div
                  key={auto.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between py-2.5 border-b border-gray-100"
                >
                  <div>
                    <p className="font-instrument text-gray-900 text-[10px] font-medium">{auto.name}</p>
                    {/* Status badge — active is blue-accented, paused is muted */}
                    <span className={`font-instrument text-[8px] uppercase tracking-widest ${
                      auto.status === "active" ? "text-blue-axis" : "text-gray-400"
                    }`}>
                      {auto.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-instrument text-gray-900 text-sm font-semibold">{auto.triggered}</p>
                    <p className="font-instrument text-gray-400 text-[8px]">triggered</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
