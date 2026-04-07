"use client"
// components/cta/Step3.tsx
//
// Step 3 — the emotional climax of the funnel.
// This component has two phases:
//   Phase A (isReady === false): Loading animation (pulsing ring + message carousel)
//   Phase B (isReady === true):  Full preview layout — mock on the right, CTA panel on the left
//
// The CTA panel inside Phase B has its own sub-flow:
//   'idle'       → "Start onboarding" button is shown
//   'collecting' → Contact form slides in (email + WhatsApp)
//   'sending'    → API call in flight; button shows spinner
//   'confirmed'  → Success state replaces the panel
//   'error'      → Error banner shown above the form with WhatsApp fallback
//
// WHY AnimatePresence FOR THE LOADING → PREVIEW TRANSITION?
// AnimatePresence tracks when components enter or leave the React component tree.
// Without it, removing the loading screen and mounting the preview would happen
// instantly — no animation. With AnimatePresence, the loading screen plays its
// exit animation before the preview fades in.
//
// WHAT IS mode="wait"?
// By default, AnimatePresence starts the enter animation of the new component
// at the same time the old one starts exiting. mode="wait" changes this:
// it waits for the exiting component to finish before mounting the entering one.
// This prevents two components from overlapping on screen at the same time.
//
// WHY THE MINIMUM 3-SECOND DELAY?
// The preview data builds almost instantly (it's all client-side).
// But showing a "loading" screen that lasts 300ms feels fake and cheap.
// A 3-second minimum makes the process feel considered and builds anticipation —
// the user thinks "this is actually being built for me, not just shown to me".
// This is a deliberate UX trust-building mechanism.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PreviewMock from './PreviewMock';
import {
  buildPreviewData,
  PROBLEM_OUTCOMES,
  PROBLEM_LABELS,
  GOAL_LABELS,
  FEATURE_LABELS,
  type FlowData,
  type PreviewData,
} from '@/lib/previewBuilder';

// ─── Props ────────────────────────────────────────────────────────────────────
interface Step3Props {
  flowData: FlowData;
  // Fallback WhatsApp number displayed if the email API call fails.
  // Read from NEXT_PUBLIC_OWNER_WHATSAPP and passed down by CTAModal.
  ownerWhatsApp: string;
}

// ─── Loading messages carousel ───────────────────────────────────────────────
const LOADING_MESSAGES = [
  'Analyzing your studio…',
  'Matching your vibe…',
  'Setting up your booking system…',
  'Adding your class schedule…',
  'Designing your website…',
];

// Minimum loading animation duration in ms
const MIN_LOADING_MS = 3000;

// Email validation regex — basic format check, no library needed
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Step3({ flowData, ownerWhatsApp }: Step3Props) {
  // ── Phase state ──────────────────────────────────────────────────────────
  // isReady flips to true when BOTH buildPreviewData AND the 3s delay resolve.
  const [isReady, setIsReady] = useState(false);

  // The assembled preview data — null until buildPreviewData resolves.
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  // Which loading message is currently shown (index into LOADING_MESSAGES)
  const [messageIndex, setMessageIndex] = useState(0);

  // ── CTA sub-flow state ───────────────────────────────────────────────────
  // idle       → show "Start onboarding" button
  // collecting → show contact form (email + WhatsApp)
  // sending    → API call in flight; form disabled, spinner shown
  // confirmed  → success confirmation replaces the whole panel
  // error      → API failed; error banner shown with WhatsApp fallback
  const [ctaState, setCtaState] = useState<'idle' | 'collecting' | 'sending' | 'confirmed' | 'error'>('idle');

  // ── Contact form state ───────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [emailError, setEmailError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  // Errors are only shown after the user first tries to submit (not before).
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // ── Build preview data + enforce minimum delay ────────────────────────
  // useEffect runs once on mount (empty dependency array []).
  // Promise.all runs buildPreviewData and a 3-second delay simultaneously,
  // then waits for BOTH to finish before marking isReady.
  useEffect(() => {
    const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    Promise.all([buildPreviewData(flowData), delay(MIN_LOADING_MS)])
      .then(([data]) => {
        setPreviewData(data);
        setIsReady(true);
      })
      .catch(() => {
        // Fallback: even if something errors, still stop loading after delay
        setIsReady(true);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading message carousel ────────────────────────────────────────────
  // setInterval fires a callback every 900ms. We cycle through the messages
  // by incrementing the index. The interval is cleared when the component
  // unmounts (the function returned from useEffect is a "cleanup" function).
  useEffect(() => {
    if (isReady) return; // stop cycling once the preview is ready

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 900);

    // Cleanup — clears the interval when this component is removed from the DOM
    return () => clearInterval(interval);
  }, [isReady]);

  // ── Personalization bullets ────────────────────────────────────────────
  // Map the first 3 selected problems to their outcome statements.
  const outcomeBullets = flowData.problems
    .slice(0, 3)
    .map((idx) => PROBLEM_OUTCOMES[idx])
    .filter(Boolean);

  // ── "Start onboarding" clicked → reveal contact form ─────────────────
  const handleCTAClick = () => {
    setCtaState('collecting');
  };

  // ── Contact form submit handler ───────────────────────────────────────
  const handleFormSubmit = async () => {
    // Mark that the user has attempted a submit — this enables error display
    setHasAttemptedSubmit(true);

    // Validate inline (no library)
    const emailValid = EMAIL_RE.test(email.trim());
    const whatsappValid = whatsapp.replace(/\s/g, '').length >= 7;

    setEmailError(emailValid ? '' : 'Please enter a valid email address');
    setWhatsappError(whatsappValid ? '' : 'Please enter at least 7 digits');

    if (!emailValid || !whatsappValid) return; // stop here — show errors

    setCtaState('sending');

    // Map index arrays to human-readable label strings.
    // This is required by the API spec — raw indices must never be sent.
    // FEATURE_LABELS is a readonly tuple so we cast to readonly string[] for indexing.
    const featureLabels = FEATURE_LABELS as readonly string[];
    const payload = {
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      handle: flowData.handle,
      studioType: flowData.studioType,
      location: flowData.location,
      problems: flowData.problems.map((idx) => PROBLEM_LABELS[idx] ?? 'Other'),
      goals: flowData.goals.map((idx) => GOAL_LABELS[idx] ?? 'Other'),
      vibe: flowData.vibe,
      activeFeatures: (flowData.activeFeatures ?? []).map(
        (idx) => featureLabels[idx] ?? `Feature ${idx}`
      ),
      // Only the count — base64 image data is never sent over email
      uploadedImageCount: (flowData.uploadedImages ?? []).length,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('API error');

      setCtaState('confirmed');
    } catch {
      // API failed — drop back to the form with an error banner
      setCtaState('error');
    }
  };

  return (
    // AnimatePresence is needed at the outer level to animate between
    // the loading phase and the preview phase.
    <AnimatePresence mode="wait">

      {/* ═══════════════════════════════════════════════════════════════
          PHASE A — LOADING ANIMATION
          Shown while buildPreviewData + 3s delay are running.
          ═══════════════════════════════════════════════════════════════ */}
      {!isReady && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center py-24 px-6 min-h-[400px]"
        >
          {/* Pulsing circular ring — rotates forever using Framer Motion */}
          <div className="relative w-16 h-16 mb-8">
            {/* Static background ring */}
            <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
            {/* Animated foreground arc */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-white"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            />
          </div>

          {/* Message carousel — AnimatePresence handles fade in/out per message */}
          <div className="h-6 relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="font-instrument text-sm text-zinc-400 absolute whitespace-nowrap"
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Subtle sub-text */}
          <p className="font-instrument text-xs text-zinc-600 mt-6">
            Building your personalized preview…
          </p>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PHASE B — PREVIEW REVEAL
          Shown once isReady === true and previewData is available.
          ═══════════════════════════════════════════════════════════════ */}
      {isReady && previewData && (
        <motion.div
          key="preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          // Mobile: column (mock top, panel below). Desktop: row (panel left, mock right)
          className="flex flex-col lg:flex-row"
        >

          {/* ── Left / bottom: Conversion panel ─────────────────────── */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="lg:w-[40%] p-6 lg:p-8 flex flex-col justify-center order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-zinc-800"
          >
            <AnimatePresence mode="wait">

              {/* ── Confirmation state ────────────────────────────── */}
              {ctaState === 'confirmed' && (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="py-8"
                >
                  {/* Tick icon */}
                  <div className="w-12 h-12 rounded-full border border-zinc-600 flex items-center justify-center mb-6">
                    <span className="text-white text-xl">✓</span>
                  </div>

                  <h2 className="font-playfair text-white text-2xl uppercase tracking-tight mb-3">
                    Application received.
                  </h2>
                  {/* Subheader */}
                  <p className="font-instrument text-sm text-zinc-400 leading-relaxed mb-4">
                    We review each studio personally to ensure we&apos;re a match.
                  </p>
                  <p className="font-instrument text-sm text-white mb-4">
                    You&apos;ll hear back from us within 24 hours with the next steps for onboarding.
                  </p>
                </motion.div>
              )}

              {/* ── Active CTA panel (idle / collecting / sending / error) ── */}
              {ctaState !== 'confirmed' && (
                <motion.div
                  key="cta-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Ownership trigger */}
                  <p className="font-instrument text-xs text-zinc-500 uppercase tracking-widest mb-2">
                    Preview for {previewData.studioName}
                  </p>

                  {/* Headline */}
                  <h2 className="font-playfair text-white text-2xl md:text-3xl uppercase tracking-tight mb-3">
                    Your website<br />is ready.
                  </h2>

                  {/* Sub-headline */}
                  <p className="font-instrument text-sm text-zinc-400 leading-relaxed mb-6">
                    Instead of managing bookings in DMs — this is what your clients will see. We'll customize your Axis-System to your specific needs and taste.
                  </p>

                  {/* Personalization callout box */}
                  {outcomeBullets.length > 0 && (
                    <div className="border border-zinc-800 rounded-xl p-4 mb-6">
                      <p className="font-instrument text-xs text-zinc-500 uppercase tracking-widest mb-3">
                        Built for your studio
                      </p>
                      <ul className="space-y-2">
                        {outcomeBullets.map((bullet, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                            className="font-instrument text-sm text-zinc-300 flex gap-2"
                          >
                            <span className="text-zinc-500 flex-shrink-0">✦</span>
                            <span>{bullet}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Scarcity line */}
                  <p className="font-instrument text-xs text-zinc-500 mb-4 leading-relaxed">
                    We&apos;re currently onboarding up to 5 studios this month to ensure full personal support.
                  </p>

                  {/* ── Button / Form area — animated swap with AnimatePresence ── */}
                  {/* AnimatePresence here controls the transition between the
                      "Start onboarding" button and the contact form. */}
                  <AnimatePresence mode="wait">

                    {/* Default: "Start onboarding" button */}
                    {ctaState === 'idle' && (
                      <motion.div
                        key="onboarding-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        {/* Electric Blue — always the brand color for primary CTA */}
                        <motion.button
                          onClick={handleCTAClick}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 rounded-lg font-instrument text-sm font-semibold uppercase tracking-[0.15em] text-white mb-4"
                          style={{ backgroundColor: '#0033FF' }}
                        >
                          Start onboarding
                        </motion.button>

                        {/* Social proof strip */}
                        <div className="flex gap-3 flex-wrap justify-center">
                          {[
                            'Personal assistance by our founder.',
                            'Live in 7 days',
                            'Free setup',
                          ].map((item, i) => (
                            <span key={i} className="font-instrument text-xs text-zinc-600">
                              {i > 0 && <span className="mr-3">·</span>}
                              {item}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Contact form (collecting / sending / error) */}
                    {(ctaState === 'collecting' || ctaState === 'sending' || ctaState === 'error') && (
                      <motion.div
                        key="contact-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        {/* Form heading */}
                        <p className="font-instrument text-sm text-zinc-300 font-semibold mb-4">
                          Almost there — how should we reach you?
                        </p>

                        {/* Error banner — only visible when the API call failed */}
                        {ctaState === 'error' && (
                          <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 mb-4">
                            <p className="font-instrument text-xs text-red-400">
                              Something went wrong — please try WhatsApp directly.{' '}
                              {ownerWhatsApp && (
                                <a
                                  href={`https://wa.me/${ownerWhatsApp.replace(/[^\d]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline text-red-300 hover:text-red-200"
                                >
                                  Message us on WhatsApp
                                </a>
                              )}
                            </p>
                          </div>
                        )}

                        {/* Email field */}
                        <div className="mb-4">
                          <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-1">
                            Your email
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              // Re-validate on each keystroke once submitted once
                              if (hasAttemptedSubmit) {
                                setEmailError(
                                  EMAIL_RE.test(e.target.value.trim())
                                    ? ''
                                    : 'Please enter a valid email address'
                                );
                              }
                            }}
                            placeholder="your@email.com"
                            disabled={ctaState === 'sending'}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 font-instrument text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
                          />
                          {/* Inline error — never shown before first submit attempt */}
                          {emailError && (
                            <p className="font-instrument text-xs text-red-400 mt-1">{emailError}</p>
                          )}
                        </div>

                        {/* WhatsApp field */}
                        <div className="mb-4">
                          <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-1">
                            Your WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={whatsapp}
                            onChange={(e) => {
                              setWhatsapp(e.target.value);
                              if (hasAttemptedSubmit) {
                                setWhatsappError(
                                  e.target.value.replace(/\s/g, '').length >= 7
                                    ? ''
                                    : 'Please enter at least 7 digits'
                                );
                              }
                            }}
                            placeholder="+32 55 1234 5678"
                            disabled={ctaState === 'sending'}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 font-instrument text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
                          />
                          {whatsappError && (
                            <p className="font-instrument text-xs text-red-400 mt-1">{whatsappError}</p>
                          )}
                        </div>

                        {/* Submit button — shows spinner while sending */}
                        <motion.button
                          onClick={handleFormSubmit}
                          disabled={ctaState === 'sending'}
                          whileHover={ctaState !== 'sending' ? { scale: 1.02 } : {}}
                          whileTap={ctaState !== 'sending' ? { scale: 0.98 } : {}}
                          className="w-full py-4 rounded-lg font-instrument text-sm font-semibold uppercase tracking-[0.15em] text-white mb-3 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#0033FF' }}
                        >
                          {ctaState === 'sending' ? (
                            <>
                              {/* Rotating spinner ring — same pattern as the loading animation above */}
                              <motion.div
                                className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white flex-shrink-0"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                              />
                              Sending…
                            </>
                          ) : (
                            'Apply'
                          )}
                        </motion.button>

                        {/* Reassurance line below submit */}
                        <p className="font-instrument text-xs text-zinc-600 text-center">
                          Free setup. No commitment.
                        </p>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

          {/* ── Right / top: Preview mock ─────────────────────────────── */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="lg:w-[60%] p-4 order-1 lg:order-2"
          >
            <PreviewMock data={previewData} />
          </motion.div>

        </motion.div>
      )}

    </AnimatePresence>
  );
}
