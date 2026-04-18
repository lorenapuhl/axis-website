"use client"
// "use client" needed: uses useState for multi-step form flow,
// and Framer Motion for step transition animations.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import type { PricingPlan } from "@/components/data/pricing"
import type { Dict, Lang } from "@/lib/getDictionary"

// ---------------------------------------------------------------------------
// SubscriptionModal — 4-step subscription sign-up flow (frontend-only)
// ---------------------------------------------------------------------------

interface FormData {
  name: string;
  email: string;
  phone: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

const slideVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
  dict: Dict["subscription_modal"];
  lang: Lang;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  selectedPlan,
  dict,
  lang,
}: SubscriptionModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", phone: "", cardNumber: "", cardExpiry: "", cardCvc: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    setStep(1)
    setFormData({ name: "", email: "", phone: "", cardNumber: "", cardExpiry: "", cardCvc: "" })
    setIsProcessing(false)
    onClose()
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setStep(4)
    }, 1500)
  }

  const inputClass =
    "w-full bg-canvas border border-edge rounded-md px-4 py-3 text-white text-sm placeholder:text-dim focus:outline-none focus:border-white/40 transition-colors"

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step < 4 ? dict.title : undefined}
    >
      <div className="px-6 py-6">

        {/* PROGRESS DOTS */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  s <= step ? "bg-white" : "bg-edge"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 1 — Confirm plan */}
          {step === 1 && selectedPlan && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-dim text-sm mb-4">{dict.you_are_subscribing}</p>

              <div className="bg-canvas border border-edge rounded-lg p-4 mb-6 space-y-2">
                <p className="text-white font-semibold text-lg">{selectedPlan.name}</p>
                <p className="text-dim text-sm">{selectedPlan.description[lang]}</p>
                <p className="text-white font-bold text-2xl mt-2">
                  €{selectedPlan.price}
                  <span className="text-dim text-sm font-normal ml-2">
                    {selectedPlan.period[lang]}
                  </span>
                </p>
              </div>

              <Button variant="primary" className="w-full" onClick={() => setStep(2)}>
                {dict.continue}
              </Button>
            </motion.div>
          )}

          {/* STEP 2 — Personal details */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-4"
            >
              <p className="text-white font-medium mb-2">{dict.your_details}</p>

              <div>
                <label className="block text-dim text-xs mb-1">{dict.full_name}</label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-dim text-xs mb-1">{dict.email}</label>
                <input
                  type="email"
                  placeholder="jean@example.com"
                  className={inputClass}
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-dim text-xs mb-1">{dict.phone}</label>
                <input
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  className={inputClass}
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                  {dict.back}
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={!formData.name || !formData.email}
                >
                  {dict.continue}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Payment */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-4"
            >
              <p className="text-white font-medium mb-2">{dict.payment_heading}</p>

              <div className="bg-canvas border border-edge rounded-lg p-3 flex justify-between items-center">
                <span className="text-dim text-sm">{selectedPlan?.name}</span>
                <span className="text-white font-semibold">
                  €{selectedPlan?.price} {dict.per_year}
                </span>
              </div>

              <div>
                <label className="block text-dim text-xs mb-1">{dict.card_number}</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className={inputClass}
                  maxLength={19}
                  value={formData.cardNumber}
                  onChange={(e) => updateField("cardNumber", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-dim text-xs mb-1">{dict.expiry}</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className={inputClass}
                    maxLength={5}
                    value={formData.cardExpiry}
                    onChange={(e) => updateField("cardExpiry", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-dim text-xs mb-1">{dict.cvc}</label>
                  <input
                    type="text"
                    placeholder="123"
                    className={inputClass}
                    maxLength={3}
                    value={formData.cardCvc}
                    onChange={(e) => updateField("cardCvc", e.target.value)}
                  />
                </div>
              </div>

              <p className="text-dim text-xs">{dict.demo_notice}</p>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>
                  {dict.back}
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? dict.processing
                    : `${dict.title} · €${selectedPlan?.price}`}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>

              <h3 className="text-white text-xl font-semibold mb-2">
                {dict.success_heading}
              </h3>
              <p className="text-dim text-sm mb-1">
                {selectedPlan?.name} · {selectedPlan?.price}€ {dict.per_year}
              </p>
              <p className="text-dim text-sm mb-6">
                {dict.confirmation_sent} {formData.email}
              </p>

              <Button variant="primary" onClick={handleClose} className="w-full">
                {dict.done}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  )
}
