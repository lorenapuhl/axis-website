// Footer — site-wide footer with links, location, and Instagram icon.
// Server Component — receives dict and lang from [lang]/layout.tsx.

import Link from "next/link"
import Image from "next/image"
import type { Dict, Lang } from "@/lib/getDictionary"

interface FooterProps {
  dict: Dict["footer"];
  navDict: Dict["navbar"];
  lang: Lang;
}

export default function Footer({ dict, navDict, lang }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const FOOTER_LINKS = {
    [dict.train]: [
      { href: `/${lang}/schedule`, label: navDict.schedule },
      { href: `/${lang}/pricing`,  label: navDict.pricing  },
      { href: `/${lang}/about`,    label: navDict.about    },
    ],
    [dict.info]: [
      { href: `/${lang}/contact`, label: navDict.contact },
    ],
  }

  return (
    <footer className="bg-canvas border-t border-edge">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* BRAND COLUMN */}
          <div className="col-span-2 md:col-span-2">
            <Link href={`/${lang}`} className="hover:opacity-80 transition-opacity inline-block">
              <Image
                src="/images/ui/logo-transparent.png"
                alt="Overhandz Boxing Club"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-3 text-dim text-sm leading-relaxed max-w-xs">
              {dict.tagline}
            </p>

            {/* LOCATION */}
            <div className="mt-4 flex items-start gap-2 text-dim text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{dict.location}</span>
            </div>

            {/* INSTAGRAM LINK */}
            <a
              href="https://www.instagram.com/overhandzclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-dim hover:text-white transition-colors text-sm"
              aria-label="Follow Overhandz on Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
              @overhandzclub
            </a>
          </div>

          {/* NAV COLUMNS */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-white text-sm font-semibold mb-4">{group}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-dim hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM ROW */}
        <div className="pt-8 border-t border-edge flex flex-col md:flex-row items-center justify-between gap-4 text-dim text-xs">
          <p>© {currentYear} Overhandz Boxing Club. {dict.copyright}</p>
          <p>Ivry-sur-Seine · Paris · France</p>
        </div>
      </div>
    </footer>
  )
}
