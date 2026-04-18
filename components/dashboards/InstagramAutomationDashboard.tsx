"use client"
// InstagramAutomationDashboard — shows real Overhandz Instagram posts.
// Each card has the actual post image, real caption, a tag dropdown, and a publish button.
// "Sync feed" button triggers a loading spinner on the button and fades posts out,
// then replays the stagger entrance animation when the sync completes.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// TypeScript types — PostTag defines the allowed tag values for a post
type PostTag = "none" | "Event" | "Offer" | "Merch"

interface IGPost {
  id: string
  src: string   // path relative to /public — e.g. "/overhandz/instagram/post-1.png"
  alt: string   // descriptive alt text for accessibility and SEO
  caption: string
  likes: number
  date: string
  // suggestedTag — pre-selected tag based on the post content.
  // Posts we know are merch or events come pre-tagged. Others default to "none".
  suggestedTag: PostTag
}

// Real Overhandz Instagram posts.
// Images live in /public/overhandz/instagram/ and are served at /overhandz/instagram/*.
// Captions and metadata are sourced from prompts/overhandz/components/data/instagram.ts.
const POSTS: IGPost[] = [
  {
    id: "1",
    src: "/overhandz/instagram/post-1.png",
    alt: "Overhandz Boxing Club announcement — multidisciplinary combat sports gym opening in Ivry-sur-Seine",
    caption: "Une salle multidisciplinaire spécialisée dans les sports de combats la préparation physique et le bien-être ! Bientôt plus d'informations sur l'ouverture officiel en septembre...",
    likes: 62,
    date: "Sep 21",
    suggestedTag: "none",
  },
  {
    id: "2",
    src: "/overhandz/instagram/post-2.png",
    alt: "Overhandz Boxing Club opening in Ivry-sur-Seine — registration open via DM",
    caption: "un club de boxe à Ivry-sur-Seine qui ouvre courant Septembre. Inscriptions en DM. Shop, Website et Programme Comes Soon 🔜",
    likes: 42,
    date: "Oct 2",
    suggestedTag: "none",
  },
  {
    id: "3",
    src: "/overhandz/instagram/post-3.png",
    alt: "Overhandz official opening on September 15th announcement post",
    caption: "Ouverture Officielle le 15 Septembre 🎉 On est prêt ! et vous ? 🙃",
    likes: 89,
    date: "Sep 15",
    suggestedTag: "Event",
  },
  {
    id: "4",
    src: "/overhandz/instagram/post-4.png",
    alt: "Overhandz Classic Boxing Club T-shirt in black and white — merch drop with 20% off for 72 hours",
    caption: "We're dropping something new 🔥 The Classic Overhandz Boxing Club Tee is now available both in Black and White 🖤🤍. You can still Enjoy 20% off everything you order for the next 72H...",
    likes: 58,
    date: "Oct 7",
    suggestedTag: "Merch",
  },
  {
    id: "5",
    src: "/overhandz/instagram/post-5.png",
    alt: "Yamani Muay Thai guest training session at Overhandz Boxing Club",
    caption: "Venez vous entraîner avec @yamani_muay_thai au Overhandz Boxing Club 🥊",
    likes: 47,
    date: "Oct 25",
    suggestedTag: "Event",
  },
  {
    id: "6",
    src: "/overhandz/instagram/post-6.png",
    alt: "Overhandz Boxing Club end of second year celebration — thanking members, partners, and coaches",
    caption: "C'est avec beaucoup de gratitude et de fierté qu'on clôture cette 2ème année du @overhandzclub 🙏 Merci à tous nos adhérents, amis, partenaires et coachs pour cette énergie incroyable 🙏",
    likes: 71,
    date: "Jul 28",
    suggestedTag: "none",
  },
]

// Tag badge styles — each tag type has its own colour scheme
const TAG_STYLES: Record<Exclude<PostTag, "none">, string> = {
  Event: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Offer: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Merch: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
}

// ── PostCard ─────────────────────────────────────────────────────────────────
// Renders a single Instagram post with tag selector and publish button.
// The suggestedTag from the post data pre-selects the dropdown where we know the type.
function PostCard({ post }: { post: IGPost }) {
  // tag — the currently selected classification for this post
  // initialised from suggestedTag so pre-tagged posts start ready to publish
  const [tag, setTag] = useState<PostTag>(post.suggestedTag)
  // published — true once the user has clicked "Publish to site"
  const [published, setPublished] = useState(false)

  const handlePublish = () => {
    if (tag === "none") return
    setPublished(true)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      {/* Post image — aspect-square keeps all cards the same height */}
      <div className="relative aspect-square bg-zinc-950">
        {/* next/image — optimises the image automatically (resizing, lazy loading, WebP conversion) */}
        <Image
          src={post.src}
          alt={post.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 200px"
        />
        {/* Published overlay — fades in over the image once the post is published */}
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
        {/* Caption — clamped to 2 lines to keep cards uniform */}
        <p className="text-zinc-400 text-xs font-instrument leading-snug line-clamp-2 flex-1">
          {post.caption}
        </p>

        {/* Likes + date */}
        <div className="flex justify-between items-center">
          <span className="text-zinc-600 text-xs font-instrument">♥ {post.likes}</span>
          <span className="text-zinc-700 text-xs font-instrument">{post.date}</span>
        </div>

        {/* Tag selector — resetting it clears the published state so the user can re-publish */}
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

        {/* Publish button — disabled if no tag is selected */}
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

// ── Main component ──────────────────────────────────────────────────────────
export default function InstagramAutomationDashboard() {
  // syncing — true while the 1.5s sync animation is running (fades posts out)
  const [syncing, setSyncing] = useState(false)
  // synced — true for 2s after sync completes (shows "Synced ✓" on the button)
  const [synced, setSynced] = useState(false)
  // syncKey — incrementing this number forces React to remount the post grid,
  // which replays the stagger entrance animation on all cards.
  const [syncKey, setSyncKey] = useState(0)

  const handleSync = () => {
    if (syncing) return
    setSyncing(true)
    setSynced(false)
    // After 1.5s: mark sync complete, bump the key (re-mounts the grid), show "Synced ✓"
    setTimeout(() => {
      setSyncing(false)
      setSynced(true)
      setSyncKey((k) => k + 1)
      // After another 2s: return button to its normal "Sync feed" state
      setTimeout(() => setSynced(false), 2000)
    }, 1500)
  }

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-900 h-96 flex flex-col overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 shrink-0">
        <div className="flex items-center gap-2">
          {/* Green dot — indicates the Instagram feed connection is active */}
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-zinc-400 text-xs font-instrument">@overhandzclub · Instagram</p>
        </div>

        {/* Sync feed button — shows spinner during sync, tick after */}
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-1.5 text-zinc-400 border border-zinc-800 text-xs font-instrument px-2.5 py-1 rounded-lg hover:border-zinc-600 transition-colors disabled:cursor-not-allowed"
        >
          {/* Spinner — only visible while syncing */}
          {syncing && (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
              className="inline-block w-3 h-3 border border-zinc-500 border-t-transparent rounded-full"
            />
          )}
          {/* Button label switches between three states */}
          {syncing ? "Syncing…" : synced ? "Synced ✓" : "Sync feed"}
        </button>
      </div>

      {/* ── POST GRID ──
          The outer motion.div fades the grid to near-invisible while syncing.
          The inner div uses key={syncKey} — when syncKey changes, React destroys and
          recreates this element, which replays all child entrance animations. */}
      <motion.div
        animate={{ opacity: syncing ? 0.12 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex-1 overflow-y-auto p-3"
      >
        <div key={syncKey} className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {POSTS.map((post, idx) => (
            // Each card animates in with a staggered delay based on its index
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
      </motion.div>
    </div>
  )
}
