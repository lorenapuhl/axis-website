"use client"
// "use client" is needed because Card uses Framer Motion (whileHover animation)
// which requires the browser environment.

import { motion } from "framer-motion"

// ---------------------------------------------------------------------------
// Card — reusable dark surface card
//
// Props:
//   children  — any JSX content inside the card
//   className — optional extra Tailwind classes (e.g. for grid sizing)
//   hover     — if true, applies scale animation on hover (default: true)
//   onClick   — optional click handler
// ---------------------------------------------------------------------------

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  hover = true,
  onClick,
}: CardProps) {
  // bg-surface  = #111111 (slightly lighter than page background)
  // border-edge = #1F1F1F (very subtle border)
  // rounded-xl  = large border radius for modern feel
  // p-4         = 16px inner padding
  const base = "bg-surface border border-edge rounded-xl p-4";

  return (
    <motion.div
      // whileHover animates on mouse hover — only applies if hover=true
      whileHover={hover ? { scale: 1.03 } : undefined}
      // Fast, subtle transition — 200ms ease-out per animation system spec
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      // cursor-pointer signals to the user the card is clickable (when onClick is set)
      className={`${base} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
