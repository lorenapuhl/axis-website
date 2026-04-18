"use client"
// InstagramAutomationDashboard — shows a grid of Instagram post cards.
// Each card has an image, caption snippet, a tag dropdown (Event / Offer / Merch),
// and a "Publish to site" button that triggers a visual confirmation.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// TypeScript types
type PostTag = "none" | "Event" | "Offer" | "Merch"

interface IGPost {
  id: string
  // image path — points to public/portfolio/overhandz/ folder
  src: string
  alt: string
  caption: string
  likes: number
  date: string
}

// Mock Instagram posts — using placeholder images until real assets are dropped in
const POSTS: IGPost[] = [
  {
    id: "1",
    src: "https://placehold.co/400x400/111111/FFFFFF",
    alt: "Boxing class at Overhandz — members training on heavy bags",
    caption: "Every punch thrown is a step closer to the best version of you. 🥊 Drop-in classes now open.",
    likes: 312,
    date: "Apr 14",
  },
  {
    id: "2",
    src: "https://placehold.co/400x400/0f0f0f/FFFFFF",
    alt: "Overhandz merch drop — black hoodie on white background",
    caption: "The new Overhandz hoodie is here. Limited stock. Link in bio.",
    likes: 488,
    date: "Apr 12",
  },
  {
    id: "3",
    src: "https://placehold.co/400x400/161616/FFFFFF",
    alt: "Overhandz fight night event poster — red and black design",
    caption: "FIGHT NIGHT is coming April 26th. Sign-ups open now. Tag a teammate.",
    likes: 621,
    date: "Apr 10",
  },
  {
    id: "4",
    src: "https://placehold.co/400x400/121212/FFFFFF",
    alt: "Coach Miguel leading a sparring session at Overhandz",
    caption: "New 10-class packs available — perfect if you're not ready to commit monthly. No pressure.",
    likes: 274,
    date: "Apr 8",
  },
  {
    id: "5",
    src: "https://placehold.co/400x400/0d0d0d/FFFFFF",
    alt: "Overhandz gym interior — ring and heavy bags",
    caption: "Saturday open gym: 9AM – 12PM. All levels welcome. See you there.",
    likes: 198,
    date: "Apr 6",
  },
  {
    id: "6",
    src: "https://placehold.co/400x400/141414/FFFFFF",
    alt: "Overhandz summer camp announcement graphic",
    caption: "SUMMER CAMP 🥊 June 15–30 | Ages 12–18 | Limited spots. DM to register.",
    likes: 543,
    date: "Apr 4",
  },
]

// Published state label styles
const TAG_STYLES: Record<Exclude<PostTag, "none">, string> = {
  Event: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Offer: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Merch: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
}

// Single post card — shows image, caption, tag selector, and publish button
function PostCard({ post }: { post: IGPost }) {
  // tag — selected classification for this post
  const [tag, setTag] = useState<PostTag>("none")
  // published — has this post been published to the site in this session?
  const [published, setPublished] = useState(false)

  const handlePublish = () => {
    if (tag === "none") return
    setPublished(true)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      {/* Post image */}
      <div className="relative aspect-square bg-zinc-950">
        <Image
          src={post.src}
          alt={post.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 200px"
        />
        {/* Published overlay */}
        <AnimatePresence>
          {published && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-green-400 text-lg">✓</p>
                <p className="text-white text-xs font-instrument font-semibold mt-1">Published</p>
                {tag !== "none" && (
                  <span className={`text-xs font-instrument px-2 py-0.5 rounded-full mt-1 inline-block ${TAG_STYLES[tag]}`}>
                    {tag}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card body */}
      <div className="p-2.5 flex flex-col gap-2 flex-1">
        {/* Caption — truncated to 2 lines */}
        <p className="text-zinc-400 text-xs font-instrument leading-snug line-clamp-2 flex-1">
          {post.caption}
        </p>

        {/* Likes + date meta */}
        <div className="flex justify-between items-center">
          <span className="text-zinc-600 text-xs font-instrument">♥ {post.likes}</span>
          <span className="text-zinc-700 text-xs font-instrument">{post.date}</span>
        </div>

        {/* Tag selector */}
        <select
          value={tag}
          onChange={(e) => {
            setTag(e.target.value as PostTag)
            setPublished(false)
          }}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-400 text-xs font-instrument focus:outline-none"
        >
          <option value="none">Tag as…</option>
          <option value="Event">Event</option>
          <option value="Offer">Offer</option>
          <option value="Merch">Merch</option>
        </select>

        {/* Publish button — disabled if no tag selected */}
        <button
          onClick={handlePublish}
          disabled={tag === "none" || published}
          className={`w-full py-1.5 rounded-lg text-xs font-instrument font-semibold transition-colors
            ${published
              ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
              : tag === "none"
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              : "bg-white text-black hover:bg-zinc-100"
            }`}
        >
          {published ? "Published ✓" : "Publish to site"}
        </button>
      </div>
    </div>
  )
}

export default function InstagramAutomationDashboard() {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-900 h-96 flex flex-col overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-zinc-400 text-xs font-instrument">@overhandzclub · Instagram</p>
        </div>
        <button className="text-zinc-400 border border-zinc-800 text-xs font-instrument px-2.5 py-1 rounded-lg hover:border-zinc-600 transition-colors">
          Sync feed
        </button>
      </div>

      {/* ── POST GRID ── */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.06 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
