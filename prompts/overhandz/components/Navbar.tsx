"use client"
// "use client" needed: uses useState for mobile menu toggle + usePathname for lang switcher.

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/ui/Button"
import type { Dict, Lang } from "@/lib/getDictionary"

// ---------------------------------------------------------------------------
// Navbar — sticky top navigation bar with locale switcher
// ---------------------------------------------------------------------------

interface NavbarProps {
  dict: Dict["navbar"];
  lang: Lang;
}

// LanguageSwitcher — reads current pathname and links to the same path in
// the other locale. e.g. /en/pricing → /fr/pricing
function LanguageSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname()
  // Strip the leading /en or /fr prefix to get the bare path
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "") || "/"

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      <Link
        href={`/en${pathWithoutLocale}`}
        className={
          lang === "en"
            ? "text-white font-semibold"
            : "text-dim hover:text-white transition-colors"
        }
      >
        EN
      </Link>
      <span className="text-dim">|</span>
      <Link
        href={`/fr${pathWithoutLocale}`}
        className={
          lang === "fr"
            ? "text-white font-semibold"
            : "text-dim hover:text-white transition-colors"
        }
      >
        FR
      </Link>
    </div>
  )
}

export default function Navbar({ dict, lang }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const NAV_LINKS = [
    { href: `/${lang}/schedule`, label: dict.schedule },
    { href: `/${lang}/pricing`,  label: dict.pricing  },
    { href: `/${lang}/about`,    label: dict.about    },
    { href: `/${lang}/contact`,  label: dict.contact  },
  ]

  return (
    <header className="sticky top-0 z-30 bg-canvas/90 backdrop-blur-md border-b border-edge">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href={`/${lang}`} className="hover:opacity-80 transition-opacity">
          <Image
            src="/images/ui/logo-transparent.png"
            alt="Overhandz Boxing Club"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-dim hover:text-white text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP RIGHT — CTA + lang switcher */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher lang={lang} />
          <Button href={`/${lang}/schedule`} variant="primary">
            {dict.cta}
          </Button>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <motion.div
            animate={{ rotate: mobileOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </motion.div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden md:hidden border-t border-edge bg-canvas"
          >
            <nav className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-base py-2 border-b border-edge last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2">
                <LanguageSwitcher lang={lang} />
                <Button
                  href={`/${lang}/schedule`}
                  variant="primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {dict.cta}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
