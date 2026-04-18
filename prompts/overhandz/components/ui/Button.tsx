"use client"
// "use client" is needed because this component uses event handlers (onClick)
// and Framer Motion, which requires the browser environment.

import { motion } from "framer-motion"
import Link from "next/link"

// ---------------------------------------------------------------------------
// Button — Reusable button component
//
// Props (think of these like Python function parameters):
//   variant  — "primary" (white bg, black text) or "secondary" (outline)
//   children — the button label (anything you put inside the component tag)
//   href     — if provided, renders as a Next.js Link (internal navigation)
//   onClick  — if provided, renders as a <button> with a click handler
//   className — optional extra Tailwind classes to merge in
//   disabled  — disables interaction
// ---------------------------------------------------------------------------

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  href?: string;        // provide this to make the button a navigation link
  onClick?: () => void; // provide this for action buttons (e.g. open modal)
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  target?: string;      // e.g. "_blank" for external links
  rel?: string;         // e.g. "noopener noreferrer" for external links
}

export default function Button({
  variant = "primary",
  children,
  href,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  target,
  rel,
}: ButtonProps) {
  // Base styles shared by both variants
  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-md font-medium text-sm tracking-wide transition-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  // Primary: white background, black text (high contrast CTA)
  const primary = "bg-white text-black";

  // Secondary: transparent with white border (ghost button)
  const secondary = "border border-white text-white";

  const classes = `${base} ${variant === "primary" ? primary : secondary} ${className}`;

  // Framer Motion props for micro-interactions:
  // whileHover — animates when the user hovers over the element
  // whileTap   — animates while the user is clicking/pressing
  const motionProps = {
    whileHover: { opacity: 0.85 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.15 },
  };

  // If an href is provided → render as a navigation link
  if (href) {
    return (
      <motion.div {...motionProps} className="inline-flex">
        {/* next/link handles client-side navigation without a full page reload */}
        <Link href={href} className={classes} target={target} rel={rel}>
          {children}
        </Link>
      </motion.div>
    );
  }

  // Otherwise → render as a plain button element
  return (
    <motion.button
      {...motionProps}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
