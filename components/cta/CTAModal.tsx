"use client"
// components/cta/CTAModal.tsx
//
// This is the orchestrator — it manages the 3-step flow, owns the shared
// FlowData state, and decides which step to render.
//
// Think of CTAModal as the "controller" in MVC:
//   - State (model): flowData, step
//   - View: Step1 / Step2 / Step3 components
//   - Transitions: handleStep1Continue, handleStep2Build, etc.
//
// It does NOT render any form fields itself — those live in Step1.tsx / Step2.tsx.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import type { FlowData, StudioType, Vibe } from '@/lib/previewBuilder';

// ─── Props ────────────────────────────────────────────────────────────────────
interface CTAModalProps {
  onClose: () => void; // callback to close the modal (provided by CTAContext)
}

// ─── Default active features: all 8 on (after removal of "Sell packages" item) ──
const ALL_FEATURES = [0, 1, 2, 3, 4, 5, 6, 7];

// ─── Initial (empty) flow data ────────────────────────────────────────────────
// We use Partial<FlowData> while the user is filling in fields.
// The full FlowData is only assembled when "Build my preview" is clicked.
const INITIAL_FLOW: Partial<FlowData> = {
  handle: '',
  studioType: undefined,
  location: '',
  problems: [],
  goals: [],
  vibe: undefined,
  activeFeatures: ALL_FEATURES,
  uploadedImages: [],
  energeticColor: '#F97316',
  extractedColors: null,
};

export default function CTAModal({ onClose }: CTAModalProps) {
  // ── Step state ──────────────────────────────────────────────────────────
  // Which step (1, 2, or 3) is currently visible.
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ── Flow data ───────────────────────────────────────────────────────────
  // A partial FlowData object — grows as the user fills in fields.
  // Passed to each step as props; steps call updater callbacks to modify it.
  const [flowData, setFlowData] = useState<Partial<FlowData>>(INITIAL_FLOW);

  // ── Close and reset ─────────────────────────────────────────────────────
  // Resets all state before closing — so the next open starts fresh.
  const handleClose = () => {
    setStep(1);
    setFlowData(INITIAL_FLOW);
    onClose();
  };

  // ── Step transitions ────────────────────────────────────────────────────
  const handleStep1Continue = (data: Partial<FlowData>) => {
    setFlowData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2Back = (data: Partial<FlowData>) => {
    setFlowData((prev) => ({ ...prev, ...data }));
    setStep(1);
  };

  const handleStep2Build = (data: Partial<FlowData>) => {
    setFlowData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  // ── Build the complete FlowData for Step 3 ───────────────────────────────
  // Cast Partial<FlowData> to a full FlowData, filling in all required defaults.
  // This is safe here because we only reach Step 3 after the user has filled
  // the required fields (handle + studioType validated in Step 1).
  const completeFlow: FlowData = {
    handle:         flowData.handle        ?? '',
    studioType:     (flowData.studioType   ?? 'fitness') as StudioType,
    location:       flowData.location      ?? '',
    problems:       flowData.problems      ?? [],
    goals:          flowData.goals         ?? [],
    vibe:           (flowData.vibe         ?? 'minimal') as Vibe,
    activeFeatures: flowData.activeFeatures ?? ALL_FEATURES,
    uploadedImages: flowData.uploadedImages ?? [],
    energeticColor: flowData.energeticColor ?? '#F97316',
    extractedColors: flowData.extractedColors ?? null,
  };

  // ── Show progress bar only on steps 1 and 2 ─────────────────────────────
  const showProgress = step === 1 || step === 2;

  return (
    // ── Backdrop ──────────────────────────────────────────────────────────
    // Fixed overlay covering the entire screen. z-50 keeps it above all content.
    // bg-black/70 = semi-transparent black scrim.
    // backdrop-blur-sm = blurs the page behind the modal.
    // Click on the backdrop (not the card) to close.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      {/* ── Modal card ──────────────────────────────────────────────────── */}
      {/* stopPropagation prevents clicks inside the card from bubbling up
          to the backdrop and closing the modal. */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`
          relative bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl
          w-full overflow-hidden
          ${step === 3
            ? 'max-w-6xl max-h-[92vh]'  // Step 3 is wide — full preview layout
            : 'max-w-lg max-h-[90vh]'   // Steps 1–2 are narrower form cards
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Top bar: progress + close button ────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">

          {/* Progress bar (steps 1 and 2 only) */}
          {showProgress && (
            <div className="flex-1 mr-4">
              {/* Track (grey background bar) */}
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                {/* Fill (animated width: 50% at step 1, 100% at step 2) */}
                <motion.div
                  className="h-full bg-white rounded-full"
                  animate={{ width: step === 1 ? '50%' : '100%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              {/* Step label */}
              <p className="font-instrument text-xs text-zinc-500 mt-1 uppercase tracking-widest">
                Step {step} of 2
              </p>
            </div>
          )}

          {/* On step 3, push the close button to the right */}
          {!showProgress && <div className="flex-1" />}

          {/* Close button — always visible */}
          <button
            onClick={handleClose}
            className="text-zinc-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800"
            aria-label="Close modal"
          >
            {/* × character — simpler and lighter than importing an icon library */}
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* ── Step content area ─────────────────────────────────────────── */}
        {/* AnimatePresence lets Framer Motion animate a component OUT before
            the next one animates IN. mode="wait" means only one step is
            mounted at a time — the exiting step plays its exit animation
            fully before the entering step appears. */}
        <AnimatePresence mode="wait">

          {step === 1 && (
            // Each step is wrapped in a motion.div for the slide transition.
            // key= must be unique per step — AnimatePresence uses this to know
            // when to trigger enter/exit animations.
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-y-auto max-h-[75vh]"
            >
              <Step1
                initialData={flowData}
                onContinue={handleStep1Continue}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-y-auto max-h-[75vh]"
            >
              <Step2
                initialData={flowData}
                onBack={handleStep2Back}
                onBuild={handleStep2Build}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-y-auto max-h-[82vh]"
            >
              <Step3
                flowData={completeFlow}
                ownerWhatsApp={process.env.NEXT_PUBLIC_OWNER_WHATSAPP ?? ''}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
