"use client"
// "use client" needed: uses event handlers, useEffect, and Framer Motion.

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ---------------------------------------------------------------------------
// Modal — base overlay + centered panel
//
// This is the generic modal shell. Specific modals (e.g. BookingModal)
// use this component for the overlay and panel structure.
//
// Props:
//   isOpen   — controls whether the modal is visible
//   onClose  — function to call when user clicks the backdrop or close button
//   children — the modal's content
//   title    — optional header title shown at the top of the panel
// ---------------------------------------------------------------------------

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // useEffect runs code AFTER the component renders in the browser.
  // Here we add/remove an event listener for the Escape key.
  // The cleanup function (returned from useEffect) removes the listener
  // when the component unmounts or when isOpen changes — prevents memory leaks.
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Prevent background scrolling while modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    // AnimatePresence from Framer Motion enables exit animations.
    // Without it, components would just disappear instantly when removed from the DOM.
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP — dark overlay behind the modal panel */}
          <motion.div
            // initial = starting state (invisible)
            initial={{ opacity: 0 }}
            // animate = target state (visible)
            animate={{ opacity: 1 }}
            // exit = state when the component is removed
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            // fixed = stays in place even when the page scrolls
            // inset-0 = covers the entire viewport (top/right/bottom/left = 0)
            // z-40 = stacks above all normal content
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* PANEL — the actual modal window */}
          <motion.div
            // Per animation spec: scale 0.95 → 1, opacity 0 → 1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            // fixed + centering trick: position at 50% from top/left,
            // then translateX/Y -50% to center it exactly (handled by -translate-x-1/2)
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="bg-surface border border-edge rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* HEADER — shown only when a title is provided */}
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-edge">
                  <h2 className="text-white font-semibold text-lg">{title}</h2>
                  {/* Close button — uses <button> not <div> per CLAUDE.md rules */}
                  <button
                    onClick={onClose}
                    className="text-dim hover:text-white transition-colors p-1"
                    aria-label="Close modal"
                  >
                    {/* Simple × character as close icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              {/* BODY — scrollable if content overflows */}
              <div className="overflow-y-auto flex-1">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
