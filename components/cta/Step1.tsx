"use client"
// components/cta/Step1.tsx
//
// Step 1 of the CTA funnel — collects:
//   FIELD 1: Instagram handle / studio name
//   FIELD 2: Studio type (8 tiles, single-select)
//   FIELD 3: Location
//   FIELD 4: Problems (8 tiles, multi-select) + dynamic "We'll fix this by:" reveal
//   FIELD 5: Goals (8 tiles, single-select)
//
// This component is purely a form — it holds its own local state and calls
// onContinue(data) when the user is done. CTAModal.tsx owns the persisted state.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlowData, StudioType } from '@/lib/previewBuilder';
import { PROBLEM_LABELS, GOAL_LABELS } from '@/lib/previewBuilder';

// ─── Props ────────────────────────────────────────────────────────────────────
interface Step1Props {
  initialData: Partial<FlowData>;                 // pre-filled if user navigated back
  onContinue: (data: Partial<FlowData>) => void;  // called when "Continue" is clicked
}

// ─── Studio type options ──────────────────────────────────────────────────────
const STUDIO_TYPES: { key: StudioType; label: string }[] = [
  { key: 'yoga_pilates',  label: 'Yoga / Pilates Studio' },
  { key: 'boxing',        label: 'Boxing / Fight Gym' },
  { key: 'dance',         label: 'Dance Studio' },
  { key: 'fitness',       label: 'Fitness Studio' },
  { key: 'martial_arts',  label: 'Martial Arts Studio' },
  { key: 'recovery',      label: 'Recovery & Wellness' },
  { key: 'meditation',    label: 'Meditation & Breathwork' },
  { key: 'other',         label: 'Other' },
];

// ─── Problem → "We'll fix this by:" copy ─────────────────────────────────────
// Indices match the new 7-item PROBLEM_LABELS (old index 0 removed).
const PROBLEM_FIX: Record<number, string> = {
  0: 'putting your schedule, pricing and info in one clear place',
  1: 'making booking fast and frictionless in just a few clicks',
  2: 'letting you sell packages and accept payments online',
  3: 'showing a live, always up-to-date class schedule',
  4: 'helping your studio appear on Google and get discovered',
  5: 'organizing your bookings and clients in one simple system',
  6: "building a system tailored to your studio's needs",
};

export default function Step1({ initialData, onContinue }: Step1Props) {
  // ── Local form state (pre-filled from initialData if the user went back) ──
  const [handle,     setHandle]     = useState(initialData.handle ?? '');
  const [studioType, setStudioType] = useState<StudioType | undefined>(initialData.studioType);
  const [location,   setLocation]   = useState(initialData.location ?? '');
  const [problems,   setProblems]   = useState<number[]>(initialData.problems ?? []);
  const [goals,      setGoals]      = useState<number[]>(initialData.goals ?? []);

  // ── Handle input: store the value as typed (including @) ─────────────────
  // We strip the @ prefix only on submit, so the user can freely type "@yourstudio"
  // and see it reflected in the input. Stripping on every keystroke prevented typing @.
  const handleHandleChange = (val: string) => setHandle(val);

  // ── Problem tile toggle (multi-select) ────────────────────────────────────
  const toggleProblem = (idx: number) => {
    setProblems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // ── Goal tile toggle (multi-select, same logic as problems) ──────────────
  const toggleGoal = (idx: number) => {
    setGoals((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // ── Continue button: enabled only when handle + studioType are filled ─────
  // Strip @ prefix for the length check — "@" alone should not count as valid.
  const canContinue = handle.replace(/^@/, '').trim().length > 0 && studioType !== undefined;

  const handleContinue = () => {
    if (!canContinue) return;
    // Strip @ prefix on submit so the stored handle is always clean (e.g. "yourstudio").
    onContinue({ handle: handle.replace(/^@/, '').trim(), studioType, location, problems, goals });
  };

  // ── Dynamic "We'll fix this by:" lines ────────────────────────────────────
  // Show up to 2 fix lines, matching the first 2 selected problems in order.
  const fixLines = problems.slice(0, 2).map((idx) => PROBLEM_FIX[idx]).filter(Boolean);

  return (
    <div className="px-6 pb-8">
      {/* ── Section headline ──────────────────────────────────────────────── */}
      <h2 className="font-playfair text-white text-2xl uppercase tracking-tight mb-1">
        Help us understand your studio
      </h2>
      <p className="font-instrument text-zinc-400 text-sm tracking-wide mb-8">
        Takes 60 seconds. No account needed.
      </p>

      {/* ── FIELD 1: Handle ──────────────────────────────────────────────── */}
      <div className="mb-6">
        {/* * marks this as a mandatory field */}
        <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-2">
          Your studio name or Instagram handle *
        </label>
        <input
          type="text"
          value={handle}
          onChange={(e) => handleHandleChange(e.target.value)}
          placeholder="@yourstudio or Studio Name"
          className="
            w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
            font-instrument text-white placeholder:text-zinc-600 text-sm
            focus:outline-none focus:border-zinc-500 transition-colors
          "
        />
      </div>

      {/* ── FIELD 2: Studio type ─────────────────────────────────────────── */}
      <div className="mb-6">
        {/* * marks this as a mandatory field */}
        <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-3">
          What type of studio do you run? *
        </label>
        {/* 2-column grid of clickable tiles */}
        <div className="grid grid-cols-2 gap-2">
          {STUDIO_TYPES.map(({ key, label }) => {
            const isSelected = studioType === key;
            return (
              <button
                key={key}
                onClick={() => setStudioType(key)}
                className={`
                  text-left px-4 py-3 rounded-lg border text-sm font-instrument
                  transition-colors
                  ${isSelected
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FIELD 3: Location ────────────────────────────────────────────── */}
      <div className="mb-6">
        {/* * marks this as a mandatory field */}
        <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-2">
          Where is your studio located? *
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, neighborhood, or address"
          className="
            w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
            font-instrument text-white placeholder:text-zinc-600 text-sm
            focus:outline-none focus:border-zinc-500 transition-colors
          "
        />
      </div>

      {/* ── FIELD 4: Problems ─────────────────────────────────────────────── */}
      <div className="mb-2">
        <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-3">
          Where are you losing clients right now?
        </label>
        <div className="grid grid-cols-1 gap-2">
          {PROBLEM_LABELS.map((label, idx) => {
            const isSelected = problems.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleProblem(idx)}
                className={`
                  text-left px-4 py-3 rounded-lg border text-sm font-instrument
                  transition-colors
                  ${isSelected
                    ? 'bg-zinc-800 text-white border-zinc-500'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                  }
                `}
              >
                {/* Filled circle when selected, open circle when not */}
                <span className={`mr-2 ${isSelected ? 'text-white' : 'text-zinc-700'}`}>
                  {isSelected ? '●' : '○'}
                </span>
                {label}
              </button>
            );
          })}
        </div>

        {/* Dynamic "We'll fix this by:" reveal — hidden on mobile, visible md+ */}
        <AnimatePresence>
          {fixLines.length > 0 && (
            <motion.div
              key="fix-lines"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="hidden md:block mt-4 px-4 py-3 bg-zinc-900/60 border border-zinc-700 rounded-lg"
            >
              {/* Small muted label */}
              <p className="font-instrument text-xs text-zinc-500 uppercase tracking-widest mb-2">
                We&apos;ll fix this by:
              </p>
              {/* Dynamic outcome lines — max 2 */}
              {fixLines.map((line, i) => (
                <p key={i} className="font-instrument text-sm text-white font-medium leading-snug mb-1">
                  ✓ {line}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FIELD 5: Goals ───────────────────────────────────────────────── */}
      {/* Multi-select: same tile design as problems — filled circle ● when selected */}
      <div className="mt-6 mb-8">
        <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-3">
          What&apos;s your main goal right now?
        </label>
        <div className="grid grid-cols-1 gap-2">
          {GOAL_LABELS.map((label, idx) => {
            const isSelected = goals.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleGoal(idx)}
                className={`
                  text-left px-4 py-3 rounded-lg border text-sm font-instrument
                  transition-colors
                  ${isSelected
                    ? 'bg-zinc-800 text-white border-zinc-500'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                  }
                `}
              >
                {/* Filled circle when selected, open circle when not */}
                <span className={`mr-2 ${isSelected ? 'text-white' : 'text-zinc-700'}`}>
                  {isSelected ? '●' : '○'}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Continue button ───────────────────────────────────────────────── */}
      {/* Disabled until handle + studioType are filled */}
      <motion.button
        onClick={handleContinue}
        disabled={!canContinue}
        whileHover={canContinue ? { scale: 1.02 } : {}}
        whileTap={canContinue ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`
          w-full py-4 rounded-lg font-instrument text-sm font-semibold
          uppercase tracking-[0.15em] transition-colors
          ${canContinue
            ? 'bg-white text-black cursor-pointer'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }
        `}
      >
        Continue →
      </motion.button>

      {/* Hint text — only shown when fields are incomplete */}
      {!canContinue && (
        <p className="font-instrument text-xs text-zinc-600 text-center mt-2">
          Enter your studio name and type to continue
        </p>
      )}
    </div>
  );
}
