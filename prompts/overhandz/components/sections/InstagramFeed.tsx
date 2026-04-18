"use client"
// "use client" needed: uses Framer Motion, useState for hover + mobile tap state.

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import SectionWrapper from "@/components/ui/SectionWrapper"
import { instagramPosts } from "@/components/data/instagram"
import type { Dict } from "@/lib/getDictionary"

interface InstagramFeedProps {
  dict: Dict["instagram"];
}

export default function InstagramFeed({ dict }: InstagramFeedProps) {
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null)
  const [activePostId, setActivePostId] = useState<string | null>(null)

  const handlePostClick = (postId: string, link: string) => {
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches

    if (isTouchDevice) {
      if (activePostId === postId) {
        window.open(link, "_blank", "noopener,noreferrer")
        setActivePostId(null)
      } else {
        setActivePostId(postId)
      }
    } else {
      window.open(link, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
      <SectionWrapper>

        {/* SECTION HEADER */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="text-dim text-sm font-medium tracking-widest uppercase mb-2">
            {dict.eyebrow}
          </p>
          <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
            {dict.heading}
          </h2>
        </motion.div>

        {/* INSTAGRAM GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {instagramPosts.map((post, index) => {
            const overlayVisible =
              hoveredPostId === post.id || activePostId === post.id

            return (
              <motion.div
                key={post.id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.06 }}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                onMouseEnter={() => setHoveredPostId(post.id)}
                onMouseLeave={() => setHoveredPostId(null)}
                onClick={() => handlePostClick(post.id, post.link)}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: overlayVisible ? 1.1 : 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Image
                    src={post.imageUrl}
                    alt={`Instagram post from Overhandz Boxing Club: ${post.caption}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </motion.div>

                <motion.div
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-3"
                  animate={{ opacity: overlayVisible ? 1 : 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-1.5 text-white text-sm font-semibold mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {post.likes.toLocaleString()}
                  </div>
                  <p className="text-white/80 text-xs text-center line-clamp-2 leading-snug">
                    {post.caption}
                  </p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* INSTAGRAM CTA */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 10 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          className="mt-8 text-center"
        >
          <motion.a
            href="https://www.instagram.com/overhandzclub/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ opacity: 1 }}
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.15 }}
            className="text-dim text-sm"
          >
            {dict.cta}
          </motion.a>
        </motion.div>
      </SectionWrapper>
    </section>
  )
}
