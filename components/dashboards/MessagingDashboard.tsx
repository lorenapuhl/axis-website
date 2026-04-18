"use client"
// MessagingDashboard — split-view messaging interface.
// Left: conversation list. Right: active chat.
// "Send to class" button opens a modal to pick a class and confirm the send.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript interfaces — define the shape of each data object
interface Message {
  id: string
  from: "gym" | "member"
  text: string
  time: string
}

interface Conversation {
  id: string
  name: string
  preview: string
  time: string
  unread: boolean
  messages: Message[]
}

// Message templates for quick sends
const TEMPLATES = [
  { id: "t0", label: "Select template…", text: "" },
  { id: "t1", label: "Class reminder",     text: "Hi! Just a reminder that your class is tomorrow. See you there 🥊" },
  { id: "t2", label: "Membership renewal", text: "Your membership renews in 3 days. Reply if you have any questions." },
  { id: "t3", label: "Class cancelled",    text: "Unfortunately, today's class has been cancelled. We apologize for the inconvenience." },
  { id: "t4", label: "Welcome",            text: "Welcome to Overhandz! We're excited to have you. Your first class is on us." },
]

// Classes available to send a broadcast message to
const BROADCAST_CLASSES = [
  "Boxing Fundamentals",
  "Cardio Boxing",
  "Advanced Sparring",
  "Bag Work",
  "Strength & Conditioning",
]

// Mock conversation data
const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Marcus Rivera",
    preview: "See you Wednesday!",
    time: "9:41 AM",
    unread: false,
    messages: [
      { id: "m1", from: "gym",    text: "Hey Marcus, reminder your class is tomorrow at 7AM.", time: "Yesterday" },
      { id: "m2", from: "member", text: "Got it, thanks!",      time: "Yesterday" },
      { id: "m3", from: "member", text: "See you Wednesday!",   time: "9:41 AM" },
    ],
  },
  {
    id: "2",
    name: "Sofia Chen",
    preview: "Can I book the Friday session?",
    time: "8:15 AM",
    unread: true,
    messages: [
      { id: "m4", from: "member", text: "Hi! Can I book the Friday session?", time: "8:15 AM" },
    ],
  },
  {
    id: "3",
    name: "Dante Moreau",
    preview: "Your membership renews in 3 days.",
    time: "Yesterday",
    unread: false,
    messages: [
      { id: "m5", from: "gym", text: "Your membership renews in 3 days. Reply if you have any questions.", time: "Yesterday" },
    ],
  },
  {
    id: "4",
    name: "Amara Diallo",
    preview: "Welcome to Overhandz!",
    time: "Mon",
    unread: false,
    messages: [
      { id: "m6", from: "gym",    text: "Welcome to Overhandz! We're excited to have you. Your first class is on us.", time: "Mon" },
      { id: "m7", from: "member", text: "Thank you so much! Really excited to start.", time: "Mon" },
    ],
  },
]

// ── SendToClassModal ─────────────────────────────────────────────────────────
// Lets the user pick a class and confirm a broadcast send.
// Shows a preview of the message they're about to send.
function SendToClassModal({
  message,
  onClose,
  onConfirm,
}: {
  message: string
  onClose: () => void
  onConfirm: (className: string) => void
}) {
  // selectedClass — which class the user chose to send to
  const [selectedClass, setSelectedClass] = useState(BROADCAST_CLASSES[0])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm mx-4"
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-white text-sm font-semibold font-instrument">Send to Class</h3>
            <p className="text-zinc-500 text-xs font-instrument mt-0.5">All members will receive this message</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        <div className="space-y-3">
          {/* Class selector */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-sm font-instrument focus:outline-none"
            >
              {BROADCAST_CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Message preview — read-only */}
          <div>
            <label className="text-zinc-600 text-xs uppercase tracking-wider font-instrument block mb-1">Message</label>
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 min-h-[60px]">
              {message
                ? <p className="text-zinc-300 text-xs font-instrument leading-relaxed">{message}</p>
                : <p className="text-zinc-700 text-xs font-instrument">No message typed — compose one first.</p>
              }
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-zinc-800 text-zinc-400 text-xs font-instrument hover:border-zinc-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedClass)}
            disabled={!message.trim()}
            className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-instrument font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send to all
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function MessagingDashboard() {
  // activeId — which conversation is open on the right panel
  const [activeId, setActiveId] = useState<string>(CONVERSATIONS[0].id)
  // message — what's currently typed in the input
  const [message, setMessage] = useState("")
  // templateId — currently selected template
  const [templateId, setTemplateId] = useState("t0")
  // localMessages — messages added in this session (no backend needed for the demo)
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({})
  // showSendToClass — whether the send-to-class modal is open
  const [showSendToClass, setShowSendToClass] = useState(false)
  // sentClass — name of the class a broadcast was just sent to (drives the toast)
  const [sentClass, setSentClass] = useState<string | null>(null)

  const active = CONVERSATIONS.find((c) => c.id === activeId)!
  const allMessages = [...active.messages, ...(localMessages[activeId] ?? [])]

  // Apply template text to the message input
  const handleTemplateChange = (id: string) => {
    setTemplateId(id)
    const template = TEMPLATES.find((t) => t.id === id)
    if (template?.text) setMessage(template.text)
  }

  // Send the current message to the active conversation
  const handleSend = () => {
    if (!message.trim()) return
    const newMsg: Message = {
      id: `local-${Date.now()}`,
      from: "gym",
      text: message.trim(),
      time: "Now",
    }
    setLocalMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }))
    setMessage("")
    setTemplateId("t0")
  }

  // Called when the user confirms a broadcast send from the modal.
  // Shows a toast for 2.5 seconds then clears it.
  const handleSendToClassConfirm = (className: string) => {
    setShowSendToClass(false)
    setSentClass(className)
    setTimeout(() => setSentClass(null), 2500)
  }

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-900 h-96 flex overflow-hidden">

      {/* ── LEFT: CONVERSATION LIST ── */}
      <div className="w-36 shrink-0 border-r border-zinc-900 flex flex-col">
        <div className="px-3 py-2.5 border-b border-zinc-900 shrink-0">
          <p className="text-zinc-600 text-xs font-instrument uppercase tracking-wider">Messages</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`w-full text-left px-3 py-2.5 border-b border-zinc-900/50 hover:bg-zinc-900/50 transition-colors
                ${activeId === conv.id ? "bg-zinc-900/60" : ""}
              `}
            >
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-xs font-instrument font-medium truncate ${conv.unread ? "text-white" : "text-zinc-400"}`}>
                  {conv.name.split(" ")[0]}
                </p>
                {/* Blue dot indicator for unread conversations */}
                {conv.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-axis shrink-0" />}
              </div>
              <p className="text-zinc-600 text-xs font-instrument truncate">{conv.preview}</p>
              <p className="text-zinc-700 text-xs font-instrument mt-0.5">{conv.time}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT: CHAT VIEW ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-900 shrink-0">
          <p className="text-white text-xs font-semibold font-instrument">{active.name}</p>
          {/* "Send to class" — opens the broadcast modal */}
          <button
            onClick={() => setShowSendToClass(true)}
            className="text-zinc-400 border border-zinc-800 text-xs font-instrument px-2.5 py-1 rounded-lg hover:border-zinc-600 hover:text-zinc-300 transition-colors whitespace-nowrap"
          >
            Send to class
          </button>
        </div>

        {/* ── SENT TOAST ──
            AnimatePresence watches for sentClass changing to/from null.
            When sentClass is set, the toast animates in. When cleared, it animates out. */}
        <AnimatePresence>
          {sentClass && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mx-3 mt-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 shrink-0"
            >
              <span className="text-green-400 text-xs">✓</span>
              <p className="text-green-400 text-xs font-instrument">
                Sent to <span className="font-semibold">{sentClass}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Template selector */}
        <div className="px-3 py-2 border-b border-zinc-900 shrink-0">
          <select
            value={templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-400 text-xs font-instrument focus:outline-none"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Message thread */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {allMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`flex ${msg.from === "gym" ? "justify-end" : "justify-start"}`}
              >
                {/* Gym messages are white bubbles on the right; member messages are grey on the left */}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-xs font-instrument
                    ${msg.from === "gym"
                      ? "bg-white text-black rounded-br-sm"
                      : "bg-zinc-800 text-zinc-300 rounded-bl-sm"
                    }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === "gym" ? "text-zinc-500" : "text-zinc-600"}`}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Message compose input */}
        <div className="flex gap-2 p-3 border-t border-zinc-900 shrink-0">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message…"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-300 text-xs font-instrument placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 min-w-0"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-white text-black text-xs font-instrument font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            Send
          </button>
        </div>
      </div>

      {/* ── SEND TO CLASS MODAL ── */}
      <AnimatePresence>
        {showSendToClass && (
          <SendToClassModal
            message={message}
            onClose={() => setShowSendToClass(false)}
            onConfirm={handleSendToClassConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
