"use client"
// components/cta/Step2.tsx
//
// Step 2 of the CTA funnel — collects:
//   FIELD 6: Feature toggles (8 items — all active by default, user can deactivate)
//   FIELD 7: Image upload (drag-and-drop / click-to-browse, 0–3 images, 5MB each)
//   [OR divider]
//   FIELD 8: Vibe picker (4 mood tiles)
//   FIELD 9: "Build my preview" CTA button

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { FlowData, Vibe } from '@/lib/previewBuilder';

// ─── Props ────────────────────────────────────────────────────────────────────
interface Step2Props {
  initialData: Partial<FlowData>;
  onBack:  (data: Partial<FlowData>) => void;
  onBuild: (data: Partial<FlowData>) => void;
}

// ─── Vibe options ─────────────────────────────────────────────────────────────
// bgClass is used for most vibes. Earthy and energetic use inline styles:
//   earthy:    warm taupe #c4a882 — not in Tailwind tokens
//   energetic: dynamic — shows the currently selected energeticColor
// Both are documented runtime-color exceptions.
const VIBES: { key: Vibe; label: string; desc: string; bgClass?: string; bgStyle?: React.CSSProperties }[] = [
  { key: 'minimal',   label: 'Clean & Minimal',    desc: 'White, simple, editorial',       bgClass: 'bg-white' },
  { key: 'dark',      label: 'Bold & Dark',         desc: 'Black, dramatic, high-contrast', bgClass: 'bg-zinc-950' },
  { key: 'earthy',    label: 'Warm & Earthy',       desc: 'Stone, natural, calm',           bgStyle: { backgroundColor: '#c4a882' } },
  // energetic has no static bgClass — the swatch is rendered inline with the live energeticColor
  { key: 'energetic', label: 'Bright & Energetic',  desc: 'Orange, vivid, action' },
];

// ─── Energetic accent color options ──────────────────────────────────────────
// When the user selects "Bright & Energetic", they can pick one of these 5 colors.
const ENERGETIC_COLORS = [
  { hex: '#2563EB', label: 'Blue' },
  { hex: '#DC2626', label: 'Red' },
  { hex: '#F97316', label: 'Orange' },
  { hex: '#7C3AED', label: 'Purple' },
  { hex: '#16A34A', label: 'Green' },
];

// ─── Feature groups (8 items after removing "Sell packages" — indices 0–7) ───
const FEATURE_GROUPS: { group: string; items: { idx: number; label: string }[] }[] = [
  {
    group: 'Bookings & Payments',
    items: [
      { idx: 0, label: 'Let clients book classes online (24/7)' },
      { idx: 1, label: 'Accept payments (cards, Apple Pay, etc.)' },
    ],
  },
  {
    group: 'Schedule & Info',
    items: [
      { idx: 2, label: 'Show a structured class schedule' },
      { idx: 3, label: 'Display pricing clearly (no more DM questions)' },
    ],
  },
  {
    group: 'Marketing & Growth',
    items: [
      { idx: 4, label: 'Show a Gallery-section with latest Instagram content automatically' },
      { idx: 5, label: 'Promote offers, events or workshops from my Instagram' },
    ],
  },
  {
    group: 'Operations',
    items: [
      { idx: 6, label: 'Track bookings and client activity' },
      { idx: 7, label: 'Collect client details automatically' },
    ],
  },
];

// Max file size: 5MB in bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function Step2({ initialData, onBack, onBuild }: Step2Props) {
  // ── Local state ──────────────────────────────────────────────────────────
  const [vibe, setVibe] = useState<Vibe | undefined>(initialData.vibe);

  // When 'energetic' is selected, user can pick one of 5 accent colors.
  // Default is orange (#F97316). Stored as a hex string.
  const [energeticColor, setEnergeticColor] = useState<string>(
    initialData.energeticColor ?? '#F97316'
  );

  // All features active by default (indices 0–7 — 8 items after removing "Sell packages").
  // User can deactivate by clicking a toggle.
  const [activeFeatures, setActiveFeatures] = useState<number[]>(
    initialData.activeFeatures ?? [0, 1, 2, 3, 4, 5, 6, 7]
  );

  // base64 data URLs of uploaded images (max 3)
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    initialData.uploadedImages ?? []
  );

  // Drag-over state — highlights the drop zone when the user drags files over it
  const [isDragOver, setIsDragOver] = useState(false);

  // Error message shown if a file is rejected (wrong type or too large)
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Ref to the hidden <input type="file"> — clicking the visible zone triggers it
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Feature toggle ───────────────────────────────────────────────────────
  const toggleFeature = (idx: number) => {
    setActiveFeatures((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // ── File processing: read files and convert to base64 ──────────────────
  const processFiles = useCallback((files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files);

    // How many more images can be added?
    const slotsLeft = 3 - uploadedImages.length;
    if (slotsLeft <= 0) return;

    const toProcess = fileArray.slice(0, slotsLeft);

    toProcess.forEach((file) => {
      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError('Only JPG, PNG, and WebP images are accepted.');
        return;
      }
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadError('Each image must be under 5MB.');
        return;
      }

      // FileReader converts the file to a base64 data URL string.
      // This is a browser API — it reads the file bytes and encodes them
      // as a string starting with "data:image/jpeg;base64,..."
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setUploadedImages((prev) => {
            if (prev.length >= 3) return prev;
            return [...prev, result];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  }, [uploadedImages.length]);

  // ── Drag and drop handlers ────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    // Reset input value so the same file can be re-selected if removed
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Build: collect data and advance to Step 3 ────────────────────────────
  const handleBuild = () => {
    onBuild({ vibe: vibe ?? 'minimal', activeFeatures, uploadedImages, energeticColor });
  };

  return (
    <div className="px-6 pb-8">
      {/* ── Headline ───────────────────────────────────────────────────── */}
      <h2 className="font-playfair text-white text-2xl uppercase tracking-tight mb-1">
        Help us build your solution
      </h2>
      <p className="font-instrument text-zinc-400 text-sm tracking-wide mb-8">
        Customize how your website will look and what it should handle.
      </p>

      {/* ── FIELD 6: Feature toggles ─────────────────────────────────── */}
      {/* Moved to the top of Step 2 — users understand what they need before uploading photos */}
      <div className="mb-8">
        <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-3">
          What should this system handle for you automatically?
        </label>
        <div className="space-y-5">
          {FEATURE_GROUPS.map(({ group, items }) => (
            <div key={group}>
              {/* Group label */}
              <p className="font-instrument text-xs text-zinc-600 uppercase tracking-widest mb-2">
                {group}
              </p>
              <div className="space-y-2">
                {items.map(({ idx, label }) => {
                  const isActive = activeFeatures.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleFeature(idx)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-lg
                        border font-instrument text-sm transition-colors text-left
                        ${isActive
                          ? 'bg-zinc-900 border-zinc-600 text-white'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                        }
                      `}
                    >
                      <span>{label}</span>
                      {/* Toggle pill */}
                      <span className={`
                        ml-3 flex-shrink-0 w-10 h-5 rounded-full relative transition-colors
                        ${isActive ? 'bg-white' : 'bg-zinc-700'}
                      `}>
                        <span className={`
                          absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all
                          ${isActive ? 'left-5' : 'left-0.5'}
                        `} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FIELD 7: Image upload ────────────────────────────────────── */}
      <div className="mb-8">
        <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-2">
          Drop in some photos so we can match your style
        </label>
        <p className="font-instrument text-xs text-zinc-500 mb-3 leading-relaxed">
          Upload 1–3 photos from your Instagram, website, or phone that represent your studio.
          These will shape your website design (colors, layout, style).
        </p>

        {/* Drop zone — shown only if fewer than 3 images uploaded */}
        {uploadedImages.length < 3 && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-colors mb-4
              ${isDragOver
                ? 'border-white bg-zinc-800/50'
                : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/30'
              }
            `}
          >
            {/* Upload icon — simple SVG, no icon library needed */}
            <div className="flex justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17,8 12,3 7,8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="font-instrument text-sm text-zinc-400">
              Drag photos here or click to browse
            </p>
            <p className="font-instrument text-xs text-zinc-600 mt-1">
              JPG, PNG, WebP · Max 5MB each · {3 - uploadedImages.length} slot{3 - uploadedImages.length !== 1 ? 's' : ''} remaining
            </p>
          </div>
        )}

        {/* Hidden file input — triggered by clicking the drop zone */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          onChange={handleFileInput}
          className="sr-only"
          aria-label="Upload studio photos"
        />

        {/* Error message */}
        {uploadError && (
          <p className="font-instrument text-xs text-red-400 mb-3">{uploadError}</p>
        )}

        {/* Thumbnail previews */}
        {uploadedImages.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {uploadedImages.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-700 group">
                {/*
                  We use a regular <img> tag here because next/image does not support
                  dynamic base64 data URLs (it requires static paths or known domains).
                  This is the documented exception: user-uploaded files in memory only.
                */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Uploaded studio photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Remove button */}
                <button
                  onClick={() => removeImage(i)}
                  className="
                    absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80
                    text-white text-xs flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                  "
                  aria-label={`Remove photo ${i + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── OR divider ───────────────────────────────────────────────── */}
      {/* Visually separates the "upload photos" option from the "pick a vibe" option */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="font-instrument text-xs text-zinc-500 uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* ── FIELD 8: Vibe picker ─────────────────────────────────────── */}
      {/* Moved below images — user can either upload photos OR pick a vibe (or both) */}
      <div className="mb-8">
        <label className="font-instrument text-xs text-zinc-400 uppercase tracking-widest block mb-3">
          Tell us how your studio feels like
        </label>
        <div className="grid grid-cols-2 gap-3">
          {VIBES.map(({ key, label, desc, bgClass, bgStyle }) => {
            const isSelected = vibe === key;
            return (
              <button
                key={key}
                onClick={() => setVibe(key)}
                className={`
                  relative overflow-hidden rounded-xl border p-4 text-left transition-all
                  ${isSelected ? 'border-white ring-1 ring-white' : 'border-zinc-700 hover:border-zinc-500'}
                `}
              >
                {/* Color swatch:
                    - minimal/dark use a static bgClass
                    - earthy uses bgStyle (warm taupe — not in Tailwind tokens)
                    - energetic uses the live energeticColor state so it updates
                      immediately when the user picks a dot below the grid */}
                <div
                  className={`${bgClass ?? ''} h-10 w-full rounded-md mb-3`}
                  style={key === 'energetic'
                    ? { backgroundColor: energeticColor }
                    : bgStyle
                  }
                />
                <p className={`font-instrument text-sm font-semibold mb-0.5 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {label}
                </p>
                <p className="font-instrument text-xs text-zinc-500">{desc}</p>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-black text-xs">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Energetic color picker — rendered OUTSIDE the button grid to avoid
            nested <button> elements (invalid HTML). Appears below the tile grid
            only when the 'energetic' vibe is selected. */}
        {vibe === 'energetic' && (
          <div className="mt-3 px-1">
            <p className="font-instrument text-xs text-zinc-500 mb-2">Pick your accent color:</p>
            <div className="flex gap-2">
              {ENERGETIC_COLORS.map(({ hex, label: colorLabel }) => (
                <button
                  key={hex}
                  onClick={() => setEnergeticColor(hex)}
                  aria-label={`Select ${colorLabel} accent`}
                  className="w-6 h-6 rounded-full flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: hex,
                    // White ring on selected dot; transparent ring otherwise
                    outline: energeticColor === hex ? '2px solid white' : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation: Back + Build ──────────────────────────────────── */}
      <div className="flex gap-3">
        {/* Back button */}
        <button
          onClick={() => onBack({ vibe, activeFeatures, uploadedImages })}
          className="
            flex-shrink-0 px-6 py-4 rounded-lg border border-zinc-700
            font-instrument text-sm text-zinc-400 hover:text-white
            hover:border-zinc-500 transition-colors
          "
        >
          Back
        </button>

        {/* "Build my preview" — primary CTA */}
        <motion.button
          onClick={handleBuild}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="
            flex-1 py-4 rounded-lg bg-white text-black
            font-instrument text-sm font-semibold uppercase tracking-[0.15em]
          "
        >
          Build my preview
        </motion.button>
      </div>

      {/* Small reassurance text below the CTA */}
      <p className="font-instrument text-xs text-zinc-600 text-center mt-3">
        No signup. No credit card. Just a preview.
      </p>
    </div>
  );
}
