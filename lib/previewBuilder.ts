"use client"
// lib/previewBuilder.ts
//
// This is the "assembly line" that runs during the loading animation in Step 3.
// It takes everything the user typed/selected across Steps 1 and 2, and returns
// a single PreviewData object that PreviewMock.tsx can render without any further logic.
//
// WHY Promise.all FOR THE DELAY + DATA FETCH?
// Promise.all([taskA, taskB]) runs both tasks at the same time and waits until
// BOTH are done. We use it with a minimum 3-second delay so the loading animation
// always plays for at least 3 seconds — even if color extraction finishes in 50ms.
// This is a deliberate UX choice: a too-fast "loading" screen feels fake and low-effort.
// The extra wait time builds trust and anticipation.
//
// FALLBACK HIERARCHY (why it's structured this way):
// Users often skip optional fields. The fallback hierarchy ensures the mock never
// renders empty or broken sections:
//   1. Uploaded image → user's own content (best personalization)
//   2. Profile's defaultFallbackImages → studio-type-appropriate placeholders
//   3. Hard-coded placeholder URL → last resort, never undefined

import { extractDominantColors } from './colorExtractor';
import {
  STUDIO_PROFILES,
  VIBE_THEMES,
  ENERGETIC_PALETTES,
  type StudioProfile,
  type VibeTheme,
  type StudioType,
  type Vibe,
} from './previewConfig';

// Re-export StudioType and Vibe so consumers can import everything they need
// from a single file (previewBuilder.ts) without also importing from previewConfig.ts
export type { StudioType, Vibe } from './previewConfig';

// ─── Shared types ─────────────────────────────────────────────────────────────
// These are imported by every step component and CTAModal

// Problem labels (index 0–6, matching the UI tiles in Step1.tsx)
export const PROBLEM_LABELS = [
  "People ask the same questions every day (price, schedule, location)",
  "Clients drop off because booking through DM's is too complicated",
  "I can't take payments or sell packages online",
  "My schedule is hard to share or always outdated",
  "I lose clients who search on Google",
  "I have no clear system to manage client- and booking-data",
  "Other",
] as const;

// Feature labels (index 0–7, matching the UI toggles in Step2.tsx)
// Exported so Step3.tsx can map activeFeatures indices to human-readable strings
// without duplicating the label strings.
export const FEATURE_LABELS = [
  'Let clients book classes online (24/7)',
  'Accept payments (cards, Apple Pay, etc.)',
  'Show a structured class schedule',
  'Display pricing clearly (no more DM questions)',
  'Show a Gallery-section with latest Instagram content automatically',
  'Promote offers, events or workshops from my Instagram',
  'Track bookings and client activity',
  'Collect client details automatically',
] as const;

// Goal labels (index 0–6, matching the UI tiles in Step1.tsx)
export const GOAL_LABELS = [
  "Automate booking- and client-data management",
  "Sell class packages or memberships automatically",
  "Make booking as easy as 2 clicks",
  "Get discovered on Google",
  "Have one clear place for schedule, pricing & info",
  "Launch a proper website quickly without tech stress",
  "Other",
] as const;

// Problem → outcome copy shown in the Step 3 personalization callout
export const PROBLEM_OUTCOMES: Record<number, string> = {
  0: "All your pricing, schedule, and info are clearly structured in one place",
  1: "Booking is now fast and frictionless — just a few clicks for your clients",
  2: "You can sell packages and accept payments automatically — even while you sleep",
  3: "Your schedule is always clear, structured, and automatically up-to-date",
  4: "Your studio can now be discovered on Google by new potential clients",
  5: "All your bookings and client details are organized in one simple system",
  6: "Your setup is tailored to your studio's specific needs and workflow",
};

// ─── FlowData — the single source of truth across all steps ──────────────────
// CTAModal.tsx owns this state. Each step receives a slice via props.
export interface FlowData {
  // Step 1 fields
  handle: string;             // cleaned studio name (@ stripped)
  studioType: StudioType;     // selected studio type key
  location: string;           // raw location string
  problems: number[];         // indices of selected problem tiles (0-based)
  goals: number[];            // indices of selected goal tiles (0-based)

  // Step 2 fields
  vibe: Vibe;                 // 'minimal' | 'dark' | 'earthy' | 'energetic'
  activeFeatures: number[];   // indices of enabled feature toggles
  uploadedImages: string[];   // base64 data URLs of uploaded photos (max 3)
  energeticColor?: string;    // selected color hex when vibe === 'energetic' (e.g. '#2563EB')

  // Derived (computed in buildPreviewData, not filled by the user)
  extractedColors: string[] | null; // top 2 hex colors from uploaded images, or null
}

// ─── PreviewData — what PreviewMock.tsx consumes ──────────────────────────────
export interface PreviewData {
  studioName: string;                 // formatted handle / studio name
  location: string;                   // location string (with fallback)
  profile: StudioProfile;             // resolved from studioType
  theme: VibeTheme;                   // resolved from vibe
  accentColorOverride: string | null; // first extracted color, or null
  surfaceColorOverride: string | null;// second extracted color, or null
  heroImageUrl: string | null;        // first uploaded image (base64) or fallback URL
  galleryImages: string[];            // remaining uploaded + fallbacks, max 3 total
  activeFeatures: number[];           // passed through for conditional section rendering
  uploadedImages: string[];           // original uploaded images (used in Instagram grid)
  resolvedTagline: string;            // heroTagline with {name} and {location} replaced
  resolvedSeoLine: string;            // seoLine with {location} replaced
  resolvedAbout: string;              // aboutSnippet with {name} replaced
  resolvedHeroCTA: string;            // heroCTA from profile
  selectedProblems: string[];         // human-readable problem labels
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Replaces {name} and {location} tokens in a template string.
 * e.g. "Find your balance in {location}" → "Find your balance in Polanco"
 */
function resolveTokens(template: string, name: string, location: string): string {
  return template
    .replace(/\{name\}/g, name)
    .replace(/\{location\}/g, location);
}

/**
 * Returns a Promise that resolves after `ms` milliseconds.
 * Used with Promise.all to enforce a minimum loading animation duration.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main assembly function ───────────────────────────────────────────────────

/**
 * Assembles a PreviewData object from the user's full FlowData.
 * Called once, during the loading animation in Step3.tsx.
 *
 * This function never throws — all errors are caught internally and
 * fall back to safe default values.
 */
export async function buildPreviewData(flow: FlowData): Promise<PreviewData> {
  // ── Step 1: Extract dominant colors from the first uploaded image ───────
  // We run color extraction and a minimum delay in parallel using Promise.all.
  // Promise.all waits for BOTH to complete — so if extraction is fast,
  // we still wait for the delay before returning.
  // (The 3-second minimum is enforced in Step3.tsx, not here — this call
  //  is just for the color extraction itself, with no added delay.)
  let extractedColors: string[] = [];
  if (flow.uploadedImages && flow.uploadedImages.length > 0) {
    try {
      extractedColors = await extractDominantColors(flow.uploadedImages[0]);
    } catch {
      // Color extraction failure is always silent — fall back to vibe theme
      extractedColors = [];
    }
  }

  // ── Step 2: Resolve studio profile ──────────────────────────────────────
  // Look up the profile for the selected studio type.
  // Fall back to 'fitness' (most generic) if somehow studioType is missing.
  const profileKey: StudioType = flow.studioType ?? 'fitness';
  const profile: StudioProfile = STUDIO_PROFILES[profileKey] ?? STUDIO_PROFILES['fitness'];

  // ── Step 3: Resolve vibe theme ───────────────────────────────────────────
  // Use the user's selected vibe, or fall back to the profile's default.
  // For 'energetic', look up the full per-color palette so the entire mock
  // (surface, border, soft tints, etc.) is harmoniously themed — not just the
  // accent button. Falls back to the orange energetic palette if color is unknown.
  const vibeKey: Vibe = flow.vibe ?? profile.defaultVibe;
  let theme: VibeTheme;
  if (vibeKey === 'energetic') {
    const energeticHex = flow.energeticColor ?? '#F97316';
    theme = ENERGETIC_PALETTES[energeticHex] ?? ENERGETIC_PALETTES['#F97316'];
  } else {
    theme = VIBE_THEMES[vibeKey] ?? VIBE_THEMES['minimal'];
  }

  // ── Step 4: Clean up name and location with fallbacks ───────────────────
  const studioName = flow.handle?.trim() || 'Your Studio';
  const location   = flow.location?.trim() || 'your city';

  // ── Step 5: Replace tokens in all template strings ──────────────────────
  const resolvedTagline = resolveTokens(profile.heroTagline, studioName, location);
  const resolvedSeoLine = resolveTokens(profile.seoLine,     studioName, location);
  const resolvedAbout   = resolveTokens(profile.aboutSnippet, studioName, location);

  // ── Step 6: Determine hero image ────────────────────────────────────────
  // Fallback hierarchy:
  //   1. First uploaded image (base64 data URL — highest personalization)
  //   2. First default fallback image from the studio profile
  //   3. Generic placeholder (should never reach this, but never undefined)
  const uploaded = flow.uploadedImages ?? [];
  const heroImageUrl: string =
    uploaded[0] ??
    profile.defaultFallbackImages[0] ??
    'https://placehold.co/800x600/121212/FFFFFF';

  // ── Step 7: Build gallery images (max 3) ────────────────────────────────
  // Gallery = all uploaded images + fallback images to fill up to 3 total.
  // uploaded[1] and uploaded[2] come first; then we pad with fallbacks.
  const galleryImages: string[] = [];
  for (let i = 1; i < 3; i++) {
    if (uploaded[i]) {
      galleryImages.push(uploaded[i]);
    } else {
      // Use fallback images starting from index 1 (index 0 is used as hero)
      const fallbackIdx = i; // fallbacks[1] and fallbacks[2]
      const fallback = profile.defaultFallbackImages[fallbackIdx]
        ?? profile.defaultFallbackImages[0]
        ?? 'https://placehold.co/800x600/121212/FFFFFF';
      galleryImages.push(fallback);
    }
  }

  // ── Step 8: Map color overrides ─────────────────────────────────────────
  // If the user uploaded images and we extracted colors, use them as overrides.
  // For the 'energetic' vibe we now use full per-color palettes (ENERGETIC_PALETTES),
  // so we never need the energeticColor as a runtime override — the palette's
  // Tailwind classes handle accent, surface, border, etc. consistently.
  // Otherwise null — the mock uses the Tailwind theme classes unchanged.
  const accentColorOverride  = extractedColors[0] ?? null;
  const surfaceColorOverride = extractedColors[1] ?? null;

  // ── Step 9: Map selected problem labels ─────────────────────────────────
  const selectedProblems = (flow.problems ?? []).map(
    (idx) => PROBLEM_LABELS[idx] ?? 'Other'
  );

  // ── Step 10: Default active features (all 8 on if not set) ──────────────
  const activeFeatures = flow.activeFeatures ?? [0, 1, 2, 3, 4, 5, 6, 7];

  return {
    studioName,
    location,
    profile,
    theme,
    accentColorOverride,
    surfaceColorOverride,
    heroImageUrl,
    galleryImages,
    activeFeatures,
    uploadedImages: uploaded,
    resolvedTagline,
    resolvedSeoLine,
    resolvedAbout,
    resolvedHeroCTA: profile.heroCTA,
    selectedProblems,
  };
}
