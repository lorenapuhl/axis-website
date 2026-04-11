"use client"
// components/cta/PreviewMock.tsx
//
// This is the rendered mock website — a scaled-down, scrollable preview of what
// the studio's real website would look like. It is purely presentational:
// it receives PreviewData and renders it. No state, no user input.
//
// WHY "use client" even though this is "presentational"?
// Framer Motion's whileHover requires the component to be a client component.
// The Instagram gallery section uses hover interactions, so this file needs
// "use client" at the top.
//
// WHY INLINE STYLES for extracted colors and hero background?
// Tailwind generates CSS class names at build time from a fixed list.
// It cannot generate a class like `bg-[#3a1c71]` for an arbitrary hex value
// that only exists at runtime (from the user's uploaded photo).
// Inline styles are the standard exception for runtime-dynamic values.
// This is the ONLY place in the entire codebase where inline styles are used
// on intentional color values — all other colors use Tailwind tokens.
//
// WHY bg-cover bg-center?
// `bg-cover` makes a CSS background image expand to fill the container,
// cropping if necessary (similar to `object-fit: cover` for <img>).
// `bg-center` anchors the image at the center of the container so the
// most visually important part of the photo stays visible.
//
// WHY h2 in the hero, not h1?
// Every page is allowed exactly ONE <h1> for SEO — this is a hard rule.
// The <h1> lives in TrustHeroSection.tsx (the real page hero).
// This mock is rendered inside a modal card on the same page, so using
// h1 here would create a duplicate, harming search ranking.

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { PreviewData } from '@/lib/previewBuilder';
import type { VibeTheme } from '@/lib/previewConfig';

// ─── Props ────────────────────────────────────────────────────────────────────
interface PreviewMockProps {
  data: PreviewData;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converts a studio name to a URL slug, e.g. "Reforma Pilates" → "reforma-pilates" */
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Accent button style — uses override hex if available, otherwise Tailwind class */
function accentButtonStyle(
  theme: VibeTheme,
  override: string | null
): React.CSSProperties {
  if (override) return { backgroundColor: override };
  return {}; // falls back to the Tailwind class in className
}

/**
 * Returns '#ffffff' (white) or '#000000' (black) depending on the perceived
 * brightness of a hex background color.
 * Used for badge text on placeholder tiles: text stays legible on any palette.
 * Defaults to white if the color string can't be parsed.
 */
function getTextColorForBg(bgColor: string | null): string {
  if (!bgColor) return '#ffffff';
  const hex = bgColor.replace('#', '').trim();
  // Expand 3-digit shorthand: #RGB → #RRGGBB
  const full = hex.length === 3
    ? hex.split('').map(c => c + c).join('')
    : hex;
  if (full.length !== 6) return '#ffffff';
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#ffffff';
  // W3C perceived-luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? '#ffffff' : '#000000';
}

export default function PreviewMock({ data }: PreviewMockProps) {
  const { theme, accentColorOverride, surfaceColorOverride } = data;
  const slug = toSlug(data.studioName || 'your-studio');

  return (
    // ── Device frame ──────────────────────────────────────────────────────
    // Styled to look like a laptop browser chrome.
    <div className="rounded-xl border border-zinc-700 shadow-2xl overflow-hidden bg-white">

      {/* ── Browser chrome bar ─────────────────────────────────────────── */}
      <div className="bg-zinc-800 px-4 py-2.5 flex items-center gap-3">
        {/* Traffic light dots */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        {/* Fake URL bar */}
        <div className="flex-1 bg-zinc-700 rounded px-3 py-1 text-center">
          <span className="font-instrument text-xs text-zinc-400">
            www.{slug}.com
          </span>
        </div>
      </div>

      {/* ── Mock website content — scrollable ─────────────────────────── */}
      <div className={`${theme.bg} overflow-y-auto max-h-[520px]`}>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — NAVBAR
            ═══════════════════════════════════════════════════════════════ */}
        <nav className={`${theme.navBg} backdrop-blur-sm sticky top-0 z-10 px-6 py-3 flex items-center justify-between border-b ${theme.border}`}>
          <span className={`font-semibold text-sm ${theme.text}`}>
            {data.studioName}
          </span>
          {/* Hover effect on navbar CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`${theme.accent} ${theme.accentText} text-xs font-semibold px-4 py-1.5 rounded-lg`}
            style={
              // Inline style only used here — color extracted from uploaded photo.
              // This overrides the Tailwind accent class with a runtime hex value.
              accentColorOverride
                ? { backgroundColor: accentColorOverride, color: '#fff' }
                : {}
            }
          >
            Book Now
          </motion.button>
        </nav>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — HERO
            ═══════════════════════════════════════════════════════════════ */}
        {(() => {
          // heroImageUrl is always set (placehold.co fallback ensures it's never null).
          // We distinguish between a real user upload (base64, starts with "data:") and
          // a placehold.co placeholder. Only a real photo warrants white-on-dark text;
          // a placeholder is a flat light color so we use the theme's dark text instead.
          const hasRealPhoto = data.heroImageUrl?.startsWith('data:') ?? false;

          return (
        <div
          className="relative min-h-[280px] flex items-center justify-center bg-cover bg-center"
          style={{
            // Inline style — base64 image from user upload cannot be expressed
            // as a Tailwind class. This is one of two documented inline style exceptions.
            backgroundImage: data.heroImageUrl ? `url(${data.heroImageUrl})` : undefined,
            backgroundColor: data.heroImageUrl ? undefined : '#1a1a1a',
          }}
        >
          {/* Overlay — only applied over real photos to darken them for readability */}
          {hasRealPhoto && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: theme.heroOverlay }}
            />
          )}
          {/* Hero content — positioned above the overlay via relative + z-10 */}
          <div className="relative z-10 text-center px-6 py-12">
            <p className={`text-xs uppercase tracking-widest mb-3 ${hasRealPhoto ? 'text-white/70' : theme.textMuted}`}>
              {data.resolvedSeoLine}
            </p>
            {/*
              h2 here (NOT h1) — the SEO rule requires exactly one h1 per page.
              The real page h1 is in TrustHeroSection. This mock renders inside
              a modal on the same page, so we use h2 to avoid creating a duplicate.
            */}
            <h2
              className={`font-playfair text-3xl uppercase tracking-tight mb-3 ${
                hasRealPhoto ? 'text-white' : theme.text
              }`}
            >
              {data.studioName}
            </h2>
            <p className={`text-sm mb-6 max-w-xs mx-auto leading-relaxed ${hasRealPhoto ? 'text-white/80' : theme.textMuted}`}>
              {data.resolvedTagline}
            </p>
            {/* Hover effect on hero CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`${theme.accent} ${theme.accentText} text-xs font-semibold px-6 py-2.5 rounded-lg`}
              style={accentColorOverride ? { backgroundColor: accentColorOverride, color: '#fff' } : {}}
            >
              {data.resolvedHeroCTA}
            </motion.button>
          </div>
        </div>
          );
        })()}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — CLASS SCHEDULE
            Conditional: only render if feature index 2 is active
            (Index shifted after removing "Sell packages" at old index 2)
            ═══════════════════════════════════════════════════════════════ */}
        {data.activeFeatures.includes(2) && (
          <div className={`px-6 py-8 ${theme.bg}`}>
            <h3 className={`font-playfair text-xl uppercase tracking-tight mb-6 ${theme.text}`}>
              Classes & Schedule
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {data.profile.classSuggestions.map((cls, i) => (
                // Hover effect: card scales up slightly on hover
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className={`${theme.surface} rounded-xl p-4 border ${theme.border}`}
                  style={surfaceColorOverride ? { backgroundColor: surfaceColorOverride } : {}}
                >
                  <p className={`font-semibold text-xs mb-1 ${theme.text}`}>{cls.name}</p>
                  <p className={`text-xs mb-2 leading-snug ${theme.textMuted}`}>{cls.time}</p>
                  <div className="flex gap-2 flex-wrap">
                    {/* Duration badge */}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${theme.border} ${theme.textMuted}`}>
                      {cls.duration}
                    </span>
                    {/* Spots remaining badge — uses accent color */}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${theme.accent} ${theme.accentText}`}
                      style={accentColorOverride ? { backgroundColor: accentColorOverride, color: '#fff' } : {}}
                    >
                      {cls.spots} spots
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — PRICING
            Conditional: render if feature index 1 is active
            (index 2 "Sell packages" was removed — pricing now tied to index 1 only)
            ═══════════════════════════════════════════════════════════════ */}
        {data.activeFeatures.includes(1) && (
          <PricingSection data={data} />
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — ABOUT
            Always rendered
            ═══════════════════════════════════════════════════════════════ */}
        <div className={`px-6 py-8 ${theme.bg}`}>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <h3 className={`font-playfair text-xl uppercase tracking-tight mb-3 ${theme.text}`}>
                About the studio
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${theme.textMuted}`}>
                {data.resolvedAbout}
              </p>
              {/* Editable note */}
              <p className={`text-xs italic ${theme.textMuted} opacity-60`}>
                ✦ Your story, in your words — this section is fully editable.
              </p>
            </div>
            {/* About image — always present (either user upload or palette-tinted placeholder).
                We check if the src is a base64 data URL (user upload) or a placehold.co URL.
                For placeholders we render a themed div so the color updates when the user
                picks a different energetic palette — a static <img> would stay orange. */}
            {data.galleryImages[0] && (
              <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                {data.galleryImages[0].startsWith('data:') ? (
                  // User-uploaded image — show as-is
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.galleryImages[0]}
                    alt="Studio interior"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Fallback placeholder — use the theme's surface color so it
                  // responds to palette changes (e.g. blue-50, purple-50, etc.)
                  <div
                    className={`w-full h-full ${theme.surface}`}
                    style={surfaceColorOverride ? { backgroundColor: surfaceColorOverride } : {}}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6 — INSTAGRAM GALLERY
            Conditional: render if feature index 4 is active
            (Index shifted after removing "Sell packages" at old index 2)
            ═══════════════════════════════════════════════════════════════ */}
        {data.activeFeatures.includes(4) && (
          <InstagramGallerySection data={data} />
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 7 — CONTACT & LOCATION
            Always rendered
            ═══════════════════════════════════════════════════════════════ */}
        <div className={`px-6 py-8 ${theme.surface}`}>
          <h3 className={`font-playfair text-xl uppercase tracking-tight mb-4 ${theme.text}`}>
            Find us
          </h3>
          <p className={`font-semibold text-sm mb-1 ${theme.text}`}>{data.studioName}</p>
          <p className={`text-sm mb-5 ${theme.textMuted}`}>{data.location}</p>

          {/* Contact rows */}
          <div className="space-y-3 mb-5">
            {[
              { icon: '📅', label: 'Book online', value: 'Click to reserve a spot' },
              { icon: '💬', label: 'WhatsApp',    value: '+1 (000) 000-0000' },
              { icon: '✉️', label: 'Email',       value: `hello@${slug}.com` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-base">{icon}</span>
                <div>
                  <p className={`text-xs uppercase tracking-widest ${theme.textMuted}`}>{label}</p>
                  <p className={`text-sm ${theme.text}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map image — static /map.png, shown at 50% opacity as a pale decorative map */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="relative rounded-xl h-24 w-full overflow-hidden">
            <img
              src="/map.png"
              alt="Studio location map"
              className="w-full h-full object-cover opacity-50"
            />
            {/* White tint overlay to keep it pale and unobtrusive */}
            <div className="absolute inset-0 bg-white/20" />
            {/* Location name centered on top of the map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-700 text-xs font-instrument font-medium">
                {data.location}
              </span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 8 — FOOTER
            Always dark regardless of vibe
            ═══════════════════════════════════════════════════════════════ */}
        <footer className="bg-zinc-900 text-white px-6 py-8">
          <p className="font-semibold text-sm mb-1">{data.studioName}</p>
          <p className="text-xs text-zinc-400 mb-2 truncate">{data.resolvedTagline}</p>
          <p className="text-xs text-zinc-500 mb-6">@{data.studioName.toLowerCase().replace(/\s+/g, '')}</p>
          <p className="text-xs text-zinc-700">Powered by Axis</p>
        </footer>

      </div>
    </div>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────────
// Extracted so it can own carousel state without cluttering PreviewMock.
//
// MOBILE  — horizontal swipe carousel with peek + pagination dots.
//   - Cards are 80% of the container width so the next card peeks through.
//   - Framer Motion drag="x" handles the swipe gesture.
//   - activeIndex state drives both the x animation and the active dot.
//
// DESKTOP — unchanged 3-column grid.

interface PricingSectionProps {
  data: PreviewData;
}

function PricingSection({ data }: PricingSectionProps) {
  const { theme, accentColorOverride, surfaceColorOverride } = data;
  const tiers = data.profile.pricingTiers;

  // ── Carousel state ──────────────────────────────────────────────────────
  // activeIndex: which card is currently centred in the mobile carousel.
  const [activeIndex, setActiveIndex] = useState(0);

  // cardWidth: pixel width of one card. We start with 256px (a safe default
  // for any mobile screen) and update it once the DOM has rendered.
  const [cardWidth, setCardWidth] = useState(256);
  const containerRef = useRef<HTMLDivElement>(null);

  // After mount, measure the carousel container and derive the card width.
  // Cards occupy 80% of the container; the remaining 20% reveals the peek.
  // ResizeObserver re-runs the measurement if the container ever resizes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setCardWidth(el.offsetWidth * 0.8);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // gap-3 in Tailwind = 12px. One "step" is the distance the strip moves per card.
  const step = cardWidth + 12;

  // Called when the user lifts their finger after a drag.
  // If the drag exceeded 50px we advance or retreat one card.
  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    const threshold = 50;
    if (info.offset.x < -threshold && activeIndex < tiers.length - 1) {
      setActiveIndex(i => i + 1);
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex(i => i - 1);
    }
  }

  return (
    <div className={`py-8 ${theme.surface}`}>
      {/* Section heading — px-6 matches the body padding */}
      <h3 className={`font-playfair text-xl uppercase tracking-tight mb-6 px-6 ${theme.text}`}>
        Memberships & Packages
      </h3>

      {/* ── Mobile carousel ─────────────────────────────────────────────── */}
      {/* md:hidden — only shown below the md (768px) breakpoint.           */}
      <div className="md:hidden" ref={containerRef}>
        {/* overflow-hidden clips the strip; pl-6 aligns the first card     */}
        {/* with the page margin while still allowing peek on the right.    */}
        <div className="overflow-hidden pl-6">
          {/*
            Draggable strip — all cards sit side-by-side in this div.
            `drag="x"` lets Framer Motion handle the swipe gesture.
            `animate` snaps the strip to the active card position.
            `dragConstraints` prevents dragging past the first / last card.
            `dragDirectionLock` commits to horizontal once direction is clear.
          */}
          <motion.div
            className="flex gap-3"
            drag="x"
            dragConstraints={{ right: 0, left: -(tiers.length - 1) * step }}
            animate={{ x: -activeIndex * step }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onDragEnd={handleDragEnd}
            dragDirectionLock
          >
            {tiers.map((tier, i) => {
              const isHighlighted = tier.highlighted;
              return (
                // flex-shrink-0 prevents the card from collapsing inside the flex strip.
                // Width is set in pixels (from the measured container) so the strip
                // translates by exact amounts when navigating between cards.
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{ width: cardWidth }}
                >
                  <div
                    className={`rounded-xl p-4 border flex flex-col h-full ${
                      isHighlighted
                        ? `${theme.accent} ${theme.accentText} border-transparent`
                        : `${theme.surface} ${theme.text} ${theme.border}`
                    }`}
                    style={
                      isHighlighted && accentColorOverride
                        ? { backgroundColor: accentColorOverride, color: '#fff', borderColor: 'transparent' }
                        : !isHighlighted && surfaceColorOverride
                        ? { backgroundColor: surfaceColorOverride }
                        : {}
                    }
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-70">
                      {tier.name}
                    </p>
                    <p className="text-2xl font-bold mb-2">{tier.price}</p>
                    <p className="text-xs leading-relaxed opacity-70 flex-1 mb-4">
                      {tier.description}
                    </p>
                    <button
                      className={`text-xs font-semibold py-2 rounded-lg border ${
                        isHighlighted
                          ? 'border-current opacity-90'
                          : `${theme.accent} ${theme.accentText} border-transparent`
                      }`}
                      style={
                        !isHighlighted && accentColorOverride
                          ? { backgroundColor: accentColorOverride, color: '#fff' }
                          : {}
                      }
                    >
                      Get started
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Pagination dots ──────────────────────────────────────────── */}
        {/* One dot per card. Active dot is a wider pill; tapping jumps to that card. */}
        <div className="flex justify-center gap-2 mt-5">
          {tiers.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to card ${i + 1}`}
              // Active: wide pill in the accent color. Inactive: small circle with a border.
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? `w-5 ${theme.accent}`
                  : `w-2 ${theme.border} border`
              }`}
              style={
                i === activeIndex && accentColorOverride
                  ? { backgroundColor: accentColorOverride }
                  : {}
              }
            />
          ))}
        </div>
      </div>

      {/* ── Desktop grid ─────────────────────────────────────────────────── */}
      {/* hidden md:grid — only shown at md breakpoint and above.            */}
      {/* This is the original 3-column layout, unchanged.                   */}
      <div className="hidden md:grid grid-cols-3 gap-3 px-6">
        {tiers.map((tier, i) => {
          const isHighlighted = tier.highlighted;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`rounded-xl p-4 border flex flex-col ${
                isHighlighted
                  ? `${theme.accent} ${theme.accentText} border-transparent`
                  : `${theme.surface} ${theme.text} ${theme.border}`
              }`}
              style={
                isHighlighted && accentColorOverride
                  ? { backgroundColor: accentColorOverride, color: '#fff', borderColor: 'transparent' }
                  : !isHighlighted && surfaceColorOverride
                  ? { backgroundColor: surfaceColorOverride }
                  : {}
              }
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-70">
                {tier.name}
              </p>
              <p className="text-2xl font-bold mb-2">{tier.price}</p>
              <p className="text-xs leading-relaxed opacity-70 flex-1 mb-4">
                {tier.description}
              </p>
              <button
                className={`text-xs font-semibold py-2 rounded-lg border ${
                  isHighlighted
                    ? 'border-current opacity-90'
                    : `${theme.accent} ${theme.accentText} border-transparent`
                }`}
                style={
                  !isHighlighted && accentColorOverride
                    ? { backgroundColor: accentColorOverride, color: '#fff' }
                    : {}
                }
              >
                Get started
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Instagram Gallery Section ────────────────────────────────────────────────
// Extracted as a sub-component to keep PreviewMock readable.
// Uses uploaded images + placeholder tiles to simulate a live Instagram feed.

interface InstagramGallerySectionProps {
  data: PreviewData;
}

function InstagramGallerySection({ data }: InstagramGallerySectionProps) {
  const { theme, accentColorOverride, surfaceColorOverride, uploadedImages } = data;

  // Build the color palette for placeholder tiles.
  // If the user uploaded images and we extracted colors, use those.
  // Otherwise fall back to the vibe theme's extended palette.
  const tileColors = [
    accentColorOverride  ?? theme.accentSoft,   // warmest tone
    surfaceColorOverride ?? theme.surfaceSoft,   // lighter fill
    theme.highlight,                             // accent-adjacent highlight
  ];

  // Per-studio overlay text — pulled from the profile's instagramOverlays field.
  // Each row has 3 tiles, each tile gets its own badge from the matching array.
  const overlays = data.profile.instagramOverlays;

  // Each row has 3 tiles. We cycle through available colors for placeholder tiles.
  // Uploaded images fill the first columns; the rest get color placeholders.
  const rows: {
    label: string;
    badges: [string, string, string]; // one badge per tile (0, 1, 2)
    tiles: { src: string | null; color: string | null }[];
  }[] = [
    {
      label: 'NEWS',
      badges: overlays.news,
      tiles: [
        { src: uploadedImages[0] ?? null, color: uploadedImages[0] ? null : tileColors[0] },
        { src: null, color: tileColors[1] },
        { src: null, color: tileColors[2] },
      ],
    },
    {
      label: 'PROMOTIONS',
      badges: overlays.promotions,
      tiles: [
        { src: null, color: tileColors[1] },
        { src: uploadedImages[1] ?? null, color: uploadedImages[1] ? null : tileColors[0] },
        { src: null, color: tileColors[2] },
      ],
    },
    {
      label: 'EVENTS',
      badges: overlays.events,
      tiles: [
        { src: null, color: tileColors[2] },
        { src: null, color: tileColors[0] },
        { src: uploadedImages[2] ?? null, color: uploadedImages[2] ? null : tileColors[1] },
      ],
    },
  ];

  return (
    <div className={`px-6 py-8 ${theme.bg}`}>
      <h3 className={`font-playfair text-xl uppercase tracking-tight mb-1 ${theme.text}`}>
        Latest from Instagram
      </h3>
      <p className={`text-xs mb-6 ${theme.textMuted}`}>
        Your Instagram — automatically turned into website content.
      </p>

      <div className="space-y-6">
        {rows.map((row, rowIdx) => (
          <div key={row.label}>
            {/* Row label */}
            <p className={`text-xs uppercase tracking-widest mb-2 ${theme.textMuted}`}>
              {row.label}
            </p>

            {/* 3-column tile grid */}
            <div className={`
              grid grid-cols-3 gap-2 rounded-xl overflow-hidden
              ${rowIdx === 1 ? `border ${theme.border} p-1` : ''}
            `}>
              {row.tiles.map((tile, tileIdx) => (
                // Hover interaction — tile scales up slightly on hover
                // "Auto-updated from your Instagram" tooltip via title attribute
                <motion.div
                  key={tileIdx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  title="Auto-updated from your Instagram"
                >
                  {tile.src ? (
                    // User-uploaded image as background
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tile.src}
                      alt={`${row.label} post ${tileIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Placeholder tile — styled with extracted or vibe colors
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: tile.color ?? theme.accentSoft }}
                    />
                  )}

                  {/* Per-tile badge overlay — text adapts to the tile content */}
                  <div className="absolute bottom-2 left-2 right-2">
                    {tile.src ? (
                      // Real photo: always show the dark stripe so text is readable over any photo
                      <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md font-instrument">
                        {row.badges[tileIdx]}
                      </span>
                    ) : (
                      <>
                        {/*
                          Placeholder tile on mobile: no stripe background.
                          Text color is calculated from the tile's background color
                          so it remains legible on both light and dark palettes.
                        */}
                        <span
                          className="md:hidden text-xs px-2 py-1 rounded-md font-instrument font-medium"
                          style={{ color: getTextColorForBg(tile.color) }}
                        >
                          {row.badges[tileIdx]}
                        </span>
                        {/* Placeholder tile on desktop: keep the dark stripe */}
                        <span className="hidden md:inline bg-black/70 text-white text-xs px-2 py-1 rounded-md font-instrument">
                          {row.badges[tileIdx]}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Hover tooltip overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs text-center font-instrument px-2">
                      Auto-updated from your Instagram
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Automation reinforcement line */}
      <p className={`text-xs mt-5 ${theme.textMuted} opacity-70`}>
        Auto-updated from your Instagram. No manual editing.
      </p>
    </div>
  );
}
