// lib/previewConfig.ts
//
// This file is the "database" of studio type profiles and visual themes.
// It contains no React — just TypeScript types and plain data objects.
//
// WHY TOKEN REPLACEMENT instead of direct string interpolation?
// We store template strings like "Find your balance in {location}" rather
// than computing them at definition time. This means we can define all
// copy upfront (in a config file) and substitute real user data later,
// inside previewBuilder.ts. This keeps data separate from logic.
//
// WHY THE 'highlighted' BOOLEAN on PricingTier?
// The middle pricing tier is typically the "recommended" option.
// Rather than hard-coding which tier index to highlight, we mark it
// explicitly on each tier so the PreviewMock can render it differently
// (accent background, larger card, etc.) without knowing which index it is.

// ─── Studio type keys ────────────────────────────────────────────────────────
// These are the 8 studio type options the user picks in Step 1.
// We use string literal union types (not TypeScript enums) because enums
// can behave unexpectedly in some Next.js build configs.
export type StudioType =
  | 'yoga_pilates'
  | 'boxing'
  | 'dance'
  | 'fitness'
  | 'martial_arts'
  | 'recovery'
  | 'meditation'
  | 'other';

// ─── Vibe keys ───────────────────────────────────────────────────────────────
export type Vibe = 'minimal' | 'dark' | 'earthy' | 'energetic';

// ─── Types ───────────────────────────────────────────────────────────────────

// A single class card shown in the Schedule section of the mock
export interface ClassItem {
  name: string;     // e.g. "Vinyasa Flow"
  time: string;     // e.g. "Mon / Wed / Fri — 8:00 AM"
  spots: number;    // remaining spots, e.g. 8
  duration: string; // e.g. "60 min"
}

// A single pricing tier card shown in the Pricing section of the mock
export interface PricingTier {
  name: string;         // e.g. "Drop-in"
  price: string;        // e.g. "$25"
  description: string;  // short explanation of what's included
  highlighted: boolean; // true = this is the "recommended" tier — rendered with accent color
}

// Per-tile text overlays for the 3 Instagram gallery rows (NEWS / PROMOTIONS / EVENTS)
// Each row has 3 tiles — each tile gets its own badge text.
export interface InstagramOverlays {
  news:        [string, string, string]; // tile 0, 1, 2 in the NEWS row
  promotions:  [string, string, string]; // tile 0, 1, 2 in the PROMOTIONS row
  events:      [string, string, string]; // tile 0, 1, 2 in the EVENTS row
}

// A full studio type profile — one per StudioType key
export interface StudioProfile {
  label: string;                     // human-readable name, e.g. "Yoga & Pilates Studio"
  heroTagline: string;               // hero sub-heading with {name} and {location} tokens
  heroCTA: string;                   // hero button copy, e.g. "Book your first class"
  aboutSnippet: string;              // one-sentence About text — uses {name} token
  seoLine: string;                   // small muted SEO line — uses {location} token
  classSuggestions: ClassItem[];     // 4 example class cards for the Schedule section
  pricingTiers: PricingTier[];       // exactly 3 pricing tier cards
  defaultFallbackImages: string[];   // 3 placehold.co URLs used when user uploads nothing
  defaultVibe: Vibe;                 // vibe applied if user skips the vibe picker
  instagramOverlays: InstagramOverlays; // per-tile text overlays for the Instagram gallery
}

// Visual theme — controls all colors in the mock website
export interface VibeTheme {
  bg: string;           // Tailwind bg class for the page background
  surface: string;      // card / section background class
  text: string;         // primary text color class
  textMuted: string;    // secondary / muted text class
  accent: string;       // CTA button & highlight bg class
  accentText: string;   // text color used on top of the accent background
  border: string;       // border color class
  navBg: string;        // navbar background class (semi-transparent)
  heroOverlay: string;  // rgba string used as inline style over the hero image
  // Extra palette values used by the Instagram gallery section
  surfaceSoft: string;  // very light tint of the surface color
  accentSoft: string;   // muted/faded accent color for placeholder tiles
  highlight: string;    // strong accent-adjacent highlight for promotions row
}

// ─── Vibe Themes ─────────────────────────────────────────────────────────────
// NOTE: heroOverlay and inline color values in surfaceSoft/accentSoft/highlight
// are stored as plain strings here (not Tailwind classes) because they are used
// exclusively as inline styles. Tailwind cannot generate classes from arbitrary
// hex or rgba values at runtime — the documented exception in CLAUDE.md.

export const VIBE_THEMES: Record<Vibe, VibeTheme> = {
  minimal: {
    bg: 'bg-white',
    surface: 'bg-gray-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-gray-900',
    accentText: 'text-white',
    border: 'border-gray-200',
    navBg: 'bg-white/90',
    heroOverlay: 'rgba(255,255,255,0.15)',
    surfaceSoft: '#f9fafb',   // gray-50 equivalent
    accentSoft: '#e5e7eb',    // gray-200
    highlight: '#374151',     // gray-700
  },
  dark: {
    bg: 'bg-zinc-950',
    surface: 'bg-zinc-900',
    text: 'text-white',
    textMuted: 'text-zinc-400',
    accent: 'bg-white',
    accentText: 'text-black',
    border: 'border-zinc-800',
    navBg: 'bg-zinc-950/90',
    heroOverlay: 'rgba(0,0,0,0.55)',
    surfaceSoft: '#18181b',   // zinc-900
    accentSoft: '#3f3f46',    // zinc-700
    highlight: '#d4d4d8',     // zinc-300
  },
  earthy: {
    bg: 'bg-stone-50',
    surface: 'bg-stone-100',
    text: 'text-stone-900',
    textMuted: 'text-stone-500',
    accent: 'bg-stone-800',
    accentText: 'text-stone-50',
    border: 'border-stone-200',
    navBg: 'bg-stone-50/90',
    heroOverlay: 'rgba(120,80,40,0.25)',
    surfaceSoft: '#f5f5f4',   // stone-100
    accentSoft: '#d6d3d1',    // stone-300
    highlight: '#78716c',     // stone-500
  },
  energetic: {
    bg: 'bg-white',
    surface: 'bg-orange-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-orange-500',
    accentText: 'text-white',
    border: 'border-orange-100',
    navBg: 'bg-white/90',
    heroOverlay: 'rgba(255,120,0,0.15)',
    surfaceSoft: '#fff7ed',   // orange-50
    accentSoft: '#fed7aa',    // orange-200
    highlight: '#f97316',     // orange-500
  },
};

// ─── Energetic per-color palettes ─────────────────────────────────────────────
// When the user picks a specific accent color for the "Bright & Energetic" vibe,
// we swap the entire theme to a harmonious palette built around that color.
// This is a lookup from hex → full VibeTheme so the mock uses consistent,
// matching colors (surface, border, soft tints) — not just the accent button.
//
// Each palette uses:
//   bg:          always bg-white (clean, high-contrast base)
//   surface:     tinted card background (e.g. bg-blue-50)
//   accent:      the chosen color as a Tailwind bg class
//   border:      very light tinted border (e.g. border-blue-100)
//   surfaceSoft: ultra-light surface for Instagram tiles
//   accentSoft:  muted accent for placeholder tiles
//   highlight:   the raw hex used in inline-style contexts
export const ENERGETIC_PALETTES: Record<string, VibeTheme> = {
  '#2563EB': {
    bg: 'bg-white',
    surface: 'bg-blue-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-blue-600',
    accentText: 'text-white',
    border: 'border-blue-100',
    navBg: 'bg-white/90',
    heroOverlay: 'rgba(37,99,235,0.15)',
    surfaceSoft: '#eff6ff',   // blue-50
    accentSoft: '#bfdbfe',    // blue-200
    highlight: '#2563eb',     // blue-600
  },
  '#DC2626': {
    bg: 'bg-white',
    surface: 'bg-red-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-red-600',
    accentText: 'text-white',
    border: 'border-red-100',
    navBg: 'bg-white/90',
    heroOverlay: 'rgba(220,38,38,0.15)',
    surfaceSoft: '#fef2f2',   // red-50
    accentSoft: '#fecaca',    // red-200
    highlight: '#dc2626',     // red-600
  },
  '#F97316': {
    bg: 'bg-white',
    surface: 'bg-orange-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-orange-500',
    accentText: 'text-white',
    border: 'border-orange-100',
    navBg: 'bg-white/90',
    heroOverlay: 'rgba(255,120,0,0.15)',
    surfaceSoft: '#fff7ed',   // orange-50
    accentSoft: '#fed7aa',    // orange-200
    highlight: '#f97316',     // orange-500
  },
  '#7C3AED': {
    bg: 'bg-white',
    surface: 'bg-purple-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-purple-600',
    accentText: 'text-white',
    border: 'border-purple-100',
    navBg: 'bg-white/90',
    heroOverlay: 'rgba(124,58,237,0.15)',
    surfaceSoft: '#faf5ff',   // purple-50
    accentSoft: '#ddd6fe',    // purple-200
    highlight: '#7c3aed',     // purple-600
  },
  '#16A34A': {
    bg: 'bg-white',
    surface: 'bg-green-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-green-600',
    accentText: 'text-white',
    border: 'border-green-100',
    navBg: 'bg-white/90',
    heroOverlay: 'rgba(22,163,74,0.15)',
    surfaceSoft: '#f0fdf4',   // green-50
    accentSoft: '#bbf7d0',    // green-200
    highlight: '#16a34a',     // green-600
  },
};

// ─── Studio Profiles ─────────────────────────────────────────────────────────

export const STUDIO_PROFILES: Record<StudioType, StudioProfile> = {

  yoga_pilates: {
    label: 'Yoga & Pilates Studio',
    heroTagline: 'Find your balance in {location}. Classes for all levels, every day.',
    heroCTA: 'Book your first class',
    aboutSnippet: '{name} is a dedicated yoga and pilates studio offering a space to slow down, breathe, and move with intention.',
    seoLine: 'Found on Google. Loved by clients in {location}.',
    classSuggestions: [
      { name: 'Vinyasa Flow',    time: 'Mon / Wed / Fri — 8:00 AM',  spots: 6,  duration: '60 min' },
      { name: 'Yin Yoga',        time: 'Tue / Thu — 7:00 PM',         spots: 8,  duration: '75 min' },
      { name: 'Reformer Pilates',time: 'Mon–Fri — 10:00 AM',          spots: 4,  duration: '50 min' },
      { name: 'Sunrise Flow',    time: 'Sat / Sun — 7:30 AM',         spots: 10, duration: '60 min' },
    ],
    pricingTiers: [
      { name: 'Drop-in',         price: '$25',  description: 'Single class, any style. No commitment.',          highlighted: false },
      { name: '10-Class Pack',   price: '$195', description: 'Best value. Use across all class formats.',        highlighted: true  },
      { name: 'Monthly Unlimited', price: '$149/mo', description: 'Unlimited classes. Cancel any time.',         highlighted: false },
    ],
    defaultFallbackImages: [
      'https://placehold.co/800x600/d6d3d1/d6d3d1?text=',
      'https://placehold.co/800x600/f5f5f4/f5f5f4?text=',
      'https://placehold.co/800x600/e7e5e4/e7e5e4?text=',
    ],
    defaultVibe: 'minimal',
    instagramOverlays: {
      news:       ['New: Yin Yoga Deep Dive', 'Meet Sarah, our new teacher', 'Extended hours this weekend'],
      promotions: ['First class free this month', '10% off 10-class packs', 'Summer offer — $99/mo'],
      events:     ['Sunset Rooftop Flow — Sat', 'Pilates & Brunch Workshop', 'Extended Yin — this Friday'],
    },
  },

  boxing: {
    label: 'Boxing & Fight Gym',
    heroTagline: 'Train like a fighter in {location}. Build strength, discipline, and confidence.',
    heroCTA: 'Start training today',
    aboutSnippet: '{name} is a serious boxing and combat gym where athletes of every level come to train hard and improve fast.',
    seoLine: 'The top fight gym in {location}. Discover us on Google.',
    classSuggestions: [
      { name: 'Bag Work Fundamentals', time: 'Mon / Wed / Fri — 7:00 AM', spots: 10, duration: '60 min' },
      { name: 'Sparring Sessions',     time: 'Tue / Thu — 6:30 PM',       spots: 6,  duration: '90 min' },
      { name: 'HIIT Boxing',           time: 'Mon–Sat — 12:00 PM',        spots: 15, duration: '45 min' },
      { name: 'Private Coaching',      time: 'By appointment',            spots: 1,  duration: '60 min' },
    ],
    pricingTiers: [
      { name: 'Single Session', price: '$30',    description: 'Drop in for any group class.',                   highlighted: false },
      { name: 'Monthly Access',  price: '$120/mo', description: 'Unlimited group classes. Most popular option.',  highlighted: true  },
      { name: '1-on-1 Coaching', price: '$80/hr', description: 'Private sessions with a certified coach.',        highlighted: false },
    ],
    defaultFallbackImages: [
      'https://placehold.co/800x600/18181b/18181b?text=',
      'https://placehold.co/800x600/27272a/27272a?text=',
      'https://placehold.co/800x600/09090b/09090b?text=',
    ],
    defaultVibe: 'dark',
    instagramOverlays: {
      news:       ['New bag class Tuesdays', 'Coach Miguel joins the team', 'Open gym hours extended'],
      promotions: ['Free trial week — this month', 'Monthly pass — $99 only', 'Bring a friend free'],
      events:     ['Amateur night — Saturday', 'Sparring clinic this Sunday', 'HIIT challenge — next week'],
    },
  },

  dance: {
    label: 'Dance Studio',
    heroTagline: 'Move with intention in {location}. Express yourself through dance.',
    heroCTA: 'Join a class',
    aboutSnippet: '{name} offers a vibrant space to learn, perform, and celebrate the art of movement across all dance styles.',
    seoLine: 'The dance studio {location} loves. Find us online.',
    classSuggestions: [
      { name: 'Ballet Foundations', time: 'Mon / Wed — 5:00 PM',  spots: 12, duration: '60 min' },
      { name: 'Contemporary Flow',  time: 'Tue / Thu — 7:00 PM',  spots: 10, duration: '75 min' },
      { name: 'Salsa & Bachata',    time: 'Fri — 8:00 PM',         spots: 16, duration: '60 min' },
      { name: 'Hip-Hop Open Level', time: 'Sat — 11:00 AM',        spots: 20, duration: '60 min' },
    ],
    pricingTiers: [
      { name: 'Drop-in',       price: '$20',    description: 'Single class, any style, any time.',              highlighted: false },
      { name: 'Monthly Class', price: '$130/mo', description: 'One weekly class of your choice, all month.',     highlighted: true  },
      { name: 'Full Access',   price: '$199/mo', description: 'Unlimited classes across all styles.',             highlighted: false },
    ],
    defaultFallbackImages: [
      'https://placehold.co/800x600/fff7ed/fff7ed?text=',
      'https://placehold.co/800x600/ffedd5/ffedd5?text=',
      'https://placehold.co/800x600/fed7aa/fed7aa?text=',
    ],
    defaultVibe: 'energetic',
    instagramOverlays: {
      news:       ['New Salsa class Fridays', 'New hip-hop coach', 'Extended beginner schedule'],
      promotions: ['First class free this month', 'Monthly unlimited — $130', 'Kids classes — 20% off'],
      events:     ['End-of-term show !', 'Salsa social this Friday', 'Contemporary workshop Sat'],
    },
  },

  fitness: {
    label: 'Fitness Studio',
    heroTagline: 'Reach your peak in {location}. Science-backed training that actually works.',
    heroCTA: 'Book a free trial',
    aboutSnippet: '{name} is a performance-focused fitness studio delivering results through structured programming and expert coaching.',
    seoLine: 'Trusted by athletes in {location}. Found on Google.',
    classSuggestions: [
      { name: 'HIIT Circuit',      time: 'Mon / Wed / Fri — 6:30 AM', spots: 12, duration: '45 min' },
      { name: 'Strength & Power',  time: 'Tue / Thu — 7:00 PM',       spots: 8,  duration: '60 min' },
      { name: 'Cardio Burn',       time: 'Mon–Sat — 12:00 PM',        spots: 20, duration: '30 min' },
      { name: 'Mobility & Core',   time: 'Sat / Sun — 9:00 AM',       spots: 15, duration: '45 min' },
    ],
    pricingTiers: [
      { name: 'Drop-in',         price: '$28',    description: 'Any single class, any day.',                    highlighted: false },
      { name: 'Monthly Unlimited', price: '$149/mo', description: 'Unlimited classes. Most popular plan.',       highlighted: true  },
      { name: 'Starter Pack',    price: '$99',    description: '5 classes to get started — no commitment.',      highlighted: false },
    ],
    defaultFallbackImages: [
      'https://placehold.co/800x600/fff7ed/fff7ed?text=',
      'https://placehold.co/800x600/ffedd5/ffedd5?text=',
      'https://placehold.co/800x600/fed7aa/fed7aa?text=',
    ],
    defaultVibe: 'energetic',
    instagramOverlays: {
      news:       ['New 6am HIIT — Mondays', 'Coach Alex joins the team', 'New equipment just arrived'],
      promotions: ['Free trial class this week', 'Monthly unlimited — $149', 'Summer shred 3-class pack'],
      events:     ['Partner HIIT challenge — Sat', 'Nutrition workshop this Fri', '6-week challenge starts soon'],
    },
  },

  martial_arts: {
    label: 'Martial Arts Studio',
    heroTagline: 'Discipline. Strength. Focus. Train at {name} in {location}.',
    heroCTA: 'Start your journey',
    aboutSnippet: '{name} is a martial arts academy dedicated to developing discipline, technique, and mental strength through expert-led training.',
    seoLine: 'The top martial arts school in {location}. Find us on Google.',
    classSuggestions: [
      { name: 'Krav Maga Basics',  time: 'Mon / Wed — 7:00 PM',   spots: 12, duration: '60 min' },
      { name: 'BJJ Open Mat',      time: 'Tue / Thu — 6:30 PM',   spots: 8,  duration: '90 min' },
      { name: 'Muay Thai Striking',time: 'Mon / Wed / Fri — 6:00 AM', spots: 10, duration: '60 min' },
      { name: 'Kids Self-Defence', time: 'Sat — 10:00 AM',         spots: 15, duration: '45 min' },
    ],
    pricingTiers: [
      { name: 'Trial Week',   price: '$39',    description: 'Unlimited classes for 7 days.',                   highlighted: false },
      { name: 'Monthly',      price: '$139/mo', description: 'Unlimited group classes. Best value.',            highlighted: true  },
      { name: 'Private',      price: '$90/hr', description: '1-on-1 instruction with a black belt instructor.', highlighted: false },
    ],
    defaultFallbackImages: [
      'https://placehold.co/800x600/09090b/09090b?text=',
      'https://placehold.co/800x600/18181b/18181b?text=',
      'https://placehold.co/800x600/27272a/27272a?text=',
    ],
    defaultVibe: 'dark',
    instagramOverlays: {
      news:       ['New Muay Thai class added', 'Sifu Rodriguez joins the dojo', 'Open mat — Sundays'],
      promotions: ['Trial week — $39 this month', 'Monthly membership — $139', 'Refer a friend — 1 month free'],
      events:     ['Belt grading — this Saturday', 'Sparring session this Sunday', 'Self-defense seminar Fri'],
    },
  },

  recovery: {
    label: 'Recovery & Wellness Center',
    heroTagline: 'Recover smarter in {location}. Restore your body, renew your mind.',
    heroCTA: 'Book a session',
    aboutSnippet: '{name} is a dedicated recovery center offering evidence-based therapies to help athletes and everyday movers perform at their best.',
    seoLine: 'Your recovery studio in {location}. Discover us online.',
    classSuggestions: [
      { name: 'Stretch & Release', time: 'Mon–Fri — 7:30 AM',   spots: 8,  duration: '45 min' },
      { name: 'Sports Massage',    time: 'By appointment',       spots: 1,  duration: '60 min' },
      { name: 'Cold Plunge + Sauna', time: 'Daily — open access', spots: 6,  duration: '30 min' },
      { name: 'Red Light Therapy', time: 'Daily — by slot',      spots: 2,  duration: '20 min' },
    ],
    pricingTiers: [
      { name: 'Single Visit',  price: '$40',    description: 'Access to one modality per session.',             highlighted: false },
      { name: 'Recovery Pack', price: '$180',   description: '5 sessions — mix and match modalities.',           highlighted: true  },
      { name: 'Monthly Member',price: '$249/mo', description: 'Unlimited access to all recovery services.',      highlighted: false },
    ],
    defaultFallbackImages: [
      'https://placehold.co/800x600/f5f5f4/f5f5f4?text=',
      'https://placehold.co/800x600/e7e5e4/e7e5e4?text=',
      'https://placehold.co/800x600/d6d3d1/d6d3d1?text=',
    ],
    defaultVibe: 'earthy',
    instagramOverlays: {
      news:       ['Cold plunge open Sundays', 'New therapist — book now', 'Red light hours extended'],
      promotions: ['Intro pack — 3 sessions $79', 'Today — save 20%', 'Bring a friend free'],
      events:     ['Recovery & yoga Sunday', 'Ice bath challenge — Sat', 'Mobility masterclass this Fri'],
    },
  },

  meditation: {
    label: 'Meditation & Breathwork Center',
    heroTagline: 'Breathe in. Build clarity. Find stillness at {name} in {location}.',
    heroCTA: 'Reserve your spot',
    aboutSnippet: '{name} is a sanctuary for mindfulness, offering guided meditation, breathwork, and sound healing sessions for every level.',
    seoLine: 'Meditation and breathwork in {location}. Find us on Google.',
    classSuggestions: [
      { name: 'Morning Breathwork', time: 'Mon / Wed / Fri — 7:00 AM', spots: 12, duration: '45 min' },
      { name: 'Sound Meditation',         time: 'Thu — 7:30 PM',              spots: 15, duration: '75 min' },
      { name: 'Guided Meditation',  time: 'Tue / Sat — 8:00 AM',        spots: 20, duration: '30 min' },
      { name: 'Deep Relaxation',     time: 'Sun — 9:00 AM',              spots: 10, duration: '90 min' },
    ],
    pricingTiers: [
      { name: 'Single Session', price: '$22',    description: 'Drop into any class, any day.',                  highlighted: false },
      { name: '8-Class Bundle',  price: '$149',   description: 'Explore different modalities at your pace.',     highlighted: true  },
      { name: 'Monthly Seeker',  price: '$99/mo', description: 'Unlimited classes. Quiet your mind daily.',      highlighted: false },
    ],
    defaultFallbackImages: [
      'https://placehold.co/800x600/f9fafb/f9fafb?text=',
      'https://placehold.co/800x600/f3f4f6/f3f4f6?text=',
      'https://placehold.co/800x600/e5e7eb/e5e7eb?text=',
    ],
    defaultVibe: 'minimal',
    instagramOverlays: {
      news:       ['Let go — Fri night', 'Teacher Luna joins us', 'Morning session now daily'],
      promotions: ['First session free this month', '8-class bundle — $149', 'Monthly seeker — $99/mo'],
      events:     ['Full Meditation — this Fri', 'Breath workshop Saturday', 'Sound Experience — Fri'],
    },
  },

  other: {
    label: 'Fitness Studio',
    heroTagline: 'A better fitness experience in {location}. Built around your goals.',
    heroCTA: 'Book your first class',
    aboutSnippet: '{name} is a professional fitness studio offering expert coaching and a welcoming community for athletes of all levels.',
    seoLine: 'A top fitness studio in {location}. Find us on Google.',
    classSuggestions: [
      { name: 'HIIT Circuit',      time: 'Mon / Wed / Fri — 6:30 AM', spots: 12, duration: '45 min' },
      { name: 'Strength Training', time: 'Tue / Thu — 7:00 PM',       spots: 8,  duration: '60 min' },
      { name: 'Cardio Blast',      time: 'Mon–Sat — 12:00 PM',        spots: 20, duration: '30 min' },
      { name: 'Core & Mobility',   time: 'Sat / Sun — 9:00 AM',       spots: 15, duration: '45 min' },
    ],
    pricingTiers: [
      { name: 'Drop-in',           price: '$28',    description: 'Any single class, any day.',                  highlighted: false },
      { name: 'Monthly Unlimited', price: '$149/mo', description: 'Unlimited classes. Most popular plan.',       highlighted: true  },
      { name: 'Starter Pack',      price: '$99',    description: '5 classes to get started — no commitment.',    highlighted: false },
    ],
    defaultFallbackImages: [
      'https://placehold.co/800x600/fff7ed/fff7ed?text=',
      'https://placehold.co/800x600/ffedd5/ffedd5?text=',
      'https://placehold.co/800x600/fed7aa/fed7aa?text=',
    ],
    defaultVibe: 'minimal',
    instagramOverlays: {
      news:       ['New class added this week', 'New coach joins the team', 'Updated schedule — see now'],
      promotions: ['Free trial class available', 'Monthly unlimited — $149', 'Refer a friend discount'],
      events:     ['Partner workout — Saturday', 'Fitness challenge starts soon', 'Workshop this Friday'],
    },
  },

};
