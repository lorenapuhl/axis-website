"use client"
// ClientDashboard — displays a searchable, filterable table of gym members.
// Desktop: clicking a row slides in a right-side detail panel.
// Mobile: clicking a row opens a full-screen overlay instead.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript interface — defines the shape of a client object
interface Client {
  id: string
  name: string
  membership: string
  status: "active" | "inactive"
  lastVisit: string
  email: string
  attendance: string[]
  payments: { date: string; amount: string; type: string }[]
}

// Mock data — realistic boxing gym client records
const CLIENTS: Client[] = [
  {
    id: "1",
    name: "Marcus Rivera",
    membership: "Unlimited",
    status: "active",
    lastVisit: "Today",
    email: "m.rivera@email.com",
    attendance: ["Apr 16", "Apr 14", "Apr 12", "Apr 10", "Apr 7"],
    payments: [
      { date: "Apr 1", amount: "$120", type: "Monthly" },
      { date: "Mar 1", amount: "$120", type: "Monthly" },
    ],
  },
  {
    id: "2",
    name: "Sofia Chen",
    membership: "10-Class Pack",
    status: "active",
    lastVisit: "Yesterday",
    email: "sofia.c@email.com",
    attendance: ["Apr 15", "Apr 11", "Apr 8"],
    payments: [{ date: "Apr 3", amount: "$90", type: "Pack" }],
  },
  {
    id: "3",
    name: "Dante Moreau",
    membership: "Unlimited",
    status: "active",
    lastVisit: "Apr 14",
    email: "d.moreau@email.com",
    attendance: ["Apr 14", "Apr 12", "Apr 9", "Apr 6"],
    payments: [
      { date: "Apr 1", amount: "$120", type: "Monthly" },
      { date: "Mar 1", amount: "$120", type: "Monthly" },
    ],
  },
  {
    id: "4",
    name: "Amara Diallo",
    membership: "Drop-in",
    status: "inactive",
    lastVisit: "Mar 28",
    email: "amara.d@email.com",
    attendance: ["Mar 28", "Mar 20"],
    payments: [{ date: "Mar 28", amount: "$20", type: "Drop-in" }],
  },
  {
    id: "5",
    name: "Luca Ferretti",
    membership: "10-Class Pack",
    status: "active",
    lastVisit: "Apr 16",
    email: "luca.f@email.com",
    attendance: ["Apr 16", "Apr 13", "Apr 10", "Apr 7", "Apr 3"],
    payments: [{ date: "Mar 25", amount: "$90", type: "Pack" }],
  },
  {
    id: "6",
    name: "Yara Okonkwo",
    membership: "Unlimited",
    status: "inactive",
    lastVisit: "Mar 15",
    email: "y.okonkwo@email.com",
    attendance: ["Mar 15", "Mar 12"],
    payments: [{ date: "Mar 1", amount: "$120", type: "Monthly" }],
  },
]

// AddClientModal — a simple overlay form for adding a new client
function AddClientModal({ onClose }: { onClose: () => void }) {
  return (
    // Fixed overlay covers the full viewport
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm mx-4"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white text-sm font-semibold font-instrument">Add Client</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-lg leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form fields — visual only in this demo */}
        <div className="space-y-3">
          {["Full name", "Email address", "Membership plan"].map((label) => (
            <div key={label}>
              <label className="text-zinc-500 text-xs font-instrument uppercase tracking-wider block mb-1">
                {label}
              </label>
              {/* Using select for membership plan, input for others */}
              {label === "Membership plan" ? (
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none">
                  <option>Unlimited</option>
                  <option>10-Class Pack</option>
                  <option>Drop-in</option>
                </select>
              ) : (
                <input
                  type={label === "Email address" ? "email" : "text"}
                  placeholder={label}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-zinc-800 text-zinc-400 text-xs font-instrument font-medium hover:border-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-instrument font-semibold hover:bg-zinc-100 transition-colors"
          >
            Add Client
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ClientDetailPanel — shown on desktop as a right-side slide-in panel
function ClientDetailPanel({ client, onClose }: { client: Client; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      // w-80 = 320px as specified
      className="absolute right-0 top-0 bottom-0 w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col z-10"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          {/* Avatar with initials */}
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-300 font-semibold font-instrument">
            {client.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-white text-xs font-semibold font-instrument">{client.name}</p>
            <p className="text-zinc-500 text-xs font-instrument">{client.membership}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors text-base leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Contact info */}
        <div>
          <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-2">Contact</p>
          <p className="text-zinc-400 text-xs font-instrument">{client.email}</p>
        </div>

        {/* Attendance history */}
        <div>
          <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-2">Attendance</p>
          <div className="space-y-1">
            {client.attendance.map((date) => (
              <div key={date} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-zinc-400 text-xs font-instrument">{date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment history */}
        <div>
          <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-2">Payments</p>
          <div className="space-y-2">
            {client.payments.map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-zinc-400 text-xs font-instrument">{p.date} · {p.type}</span>
                <span className="text-white text-xs font-semibold font-instrument">{p.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ClientDashboard() {
  // activeClient — which row is selected (null = none selected)
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  // filter — "all", "active", or "inactive"
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")
  // search — text to filter by name
  const [search, setSearch] = useState("")
  // showAddModal — whether the Add Client modal is open
  const [showAddModal, setShowAddModal] = useState(false)
  // showMobileDetail — whether the full-screen mobile detail is open
  const [showMobileDetail, setShowMobileDetail] = useState(false)

  // Filter and search the client list
  const filtered = CLIENTS.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || c.status === filter
    return matchesSearch && matchesFilter
  })

  // Open detail: on mobile shows full-screen overlay, on desktop shows side panel
  const handleRowClick = (client: Client) => {
    setActiveClient(client)
    setShowMobileDetail(true)
  }

  return (
    // relative so the desktop side panel can be positioned absolutely
    <div className="relative overflow-hidden bg-zinc-950 rounded-2xl border border-zinc-900 h-96 flex flex-col">

      {/* ── TOP BAR ── */}
      <div className="flex items-center gap-2 p-3 border-b border-zinc-900 shrink-0">
        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-300 text-xs font-instrument placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 min-w-0"
        />
        {/* Filter dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "active" | "inactive")}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-400 text-xs font-instrument focus:outline-none shrink-0"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {/* Add client button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-black text-xs font-instrument font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors shrink-0 whitespace-nowrap"
        >
          + Add
        </button>
      </div>

      {/* ── TABLE ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Table header */}
        <div className="grid grid-cols-4 px-3 py-2 border-b border-zinc-900 sticky top-0 bg-zinc-950 z-10">
          {["Name", "Plan", "Status", "Last Visit"].map((col) => (
            <span key={col} className="text-zinc-600 text-xs font-instrument uppercase tracking-wider">
              {col}
            </span>
          ))}
        </div>

        {/* Table rows — each is h-12 (48px as specified) */}
        {filtered.map((client) => (
          <button
            key={client.id}
            onClick={() => handleRowClick(client)}
            className={`w-full grid grid-cols-4 px-3 items-center h-12 border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors text-left
              ${activeClient?.id === client.id ? "bg-zinc-900/60" : ""}
            `}
          >
            <span className="text-white text-xs font-instrument font-medium truncate pr-2">
              {client.name}
            </span>
            <span className="text-zinc-400 text-xs font-instrument truncate pr-2">
              {client.membership}
            </span>
            {/* Status dot */}
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  client.status === "active" ? "bg-green-500" : "bg-zinc-600"
                }`}
              />
              <span className={`text-xs font-instrument ${client.status === "active" ? "text-green-400" : "text-zinc-600"}`}>
                {client.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <span className="text-zinc-500 text-xs font-instrument">{client.lastVisit}</span>
          </button>
        ))}
      </div>

      {/* ── DESKTOP SIDE PANEL (hidden on mobile) ── */}
      <div className="hidden md:block">
        <AnimatePresence>
          {activeClient && (
            <ClientDetailPanel
              client={activeClient}
              onClose={() => setActiveClient(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE FULL-SCREEN DETAIL OVERLAY ── */}
      <AnimatePresence>
        {showMobileDetail && activeClient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="md:hidden absolute inset-0 z-20 bg-zinc-950 overflow-y-auto"
          >
            {/* Mobile detail header */}
            <div className="flex items-center gap-3 p-4 border-b border-zinc-900">
              <button
                onClick={() => setShowMobileDetail(false)}
                className="text-zinc-400 hover:text-white text-sm font-instrument transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-300 font-semibold">
                  {activeClient.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="text-white text-xs font-semibold font-instrument">{activeClient.name}</span>
              </div>
            </div>
            <div className="p-4 space-y-5">
              <div>
                <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-2">Membership</p>
                <p className="text-zinc-300 text-sm font-instrument">{activeClient.membership}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-2">Contact</p>
                <p className="text-zinc-400 text-xs font-instrument">{activeClient.email}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-2">Attendance</p>
                <div className="space-y-1">
                  {activeClient.attendance.map((d) => (
                    <div key={d} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-zinc-400 text-xs font-instrument">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-zinc-600 text-xs uppercase tracking-wider font-instrument mb-2">Payments</p>
                <div className="space-y-2">
                  {activeClient.payments.map((p, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-zinc-400 text-xs font-instrument">{p.date} · {p.type}</span>
                      <span className="text-white text-xs font-semibold font-instrument">{p.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ADD CLIENT MODAL ── */}
      <AnimatePresence>
        {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </div>
  )
}
