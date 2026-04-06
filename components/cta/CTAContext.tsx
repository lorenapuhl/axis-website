"use client"
// components/cta/CTAContext.tsx
//
// This file creates a "React Context" — think of it as a global variable that
// any component in the tree can read or update without passing props through
// every intermediate layer (prop drilling).
//
// WHY A CONTEXT instead of just passing props?
// The CTA button appears in multiple sections (FinalCTA, Hero, etc.).
// If we stored isOpen in page.tsx and passed it down, every intermediate
// component would need to forward a prop it doesn't care about.
// Context lets any component call openModal() directly.
//
// WHY NOT make page.tsx a client component?
// page.tsx is a Server Component — it renders on the server, which gives us
// better SEO and faster initial page load. If we added "use client" to page.tsx,
// the entire page tree would become client-side JavaScript. Instead, this
// CTAProvider wraps the sections as a client boundary — only the provider
// and components that use the context become client-side code.

import React, { createContext, useContext, useState } from 'react';
import CTAModal from './CTAModal';

// ─── Context shape ────────────────────────────────────────────────────────────
// This defines what data lives in the context and can be accessed by any
// component that calls useCTAModal().
interface CTAContextValue {
  openModal: () => void; // call this from any CTA button to open the modal
}

// createContext creates the "channel" — like a pub/sub event system.
// The null default is replaced by the real value provided by CTAProvider below.
const CTAContext = createContext<CTAContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
// This component wraps the entire page (in app/page.tsx).
// It owns the isOpen state and renders the modal when isOpen === true.
//
// Props: { children } — everything wrapped inside <CTAProvider>...</CTAProvider>
// is passed through and rendered normally. The provider is invisible in the DOM.
export default function CTAProvider({ children }: { children: React.ReactNode }) {
  // useState is React's way of storing a value that, when changed, causes a
  // re-render. Here we track whether the modal is open or closed.
  const [isOpen, setIsOpen] = useState(false);

  // These handlers are stable — they don't change on every render.
  const openModal  = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    // CTAContext.Provider makes openModal available to every component inside it.
    // value={{ openModal }} is the "broadcast" — any child can receive it.
    <CTAContext.Provider value={{ openModal }}>
      {/* Render all page sections unchanged */}
      {children}

      {/* The modal lives here, outside the normal section flow.
          It uses position:fixed so it sits above everything else.
          Only mounts when isOpen is true — avoids rendering a hidden modal on load. */}
      {isOpen && <CTAModal onClose={closeModal} />}
    </CTAContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// A custom hook that any component can call to get access to openModal().
// Usage: const { openModal } = useCTAModal();
//        <button onClick={openModal}>Get your AXIS</button>
//
// The error is a safety net — if someone forgets to wrap their component in
// CTAProvider, they get a clear message instead of a confusing undefined error.
export function useCTAModal(): CTAContextValue {
  const ctx = useContext(CTAContext);
  if (!ctx) {
    throw new Error('useCTAModal must be used inside a <CTAProvider>');
  }
  return ctx;
}
