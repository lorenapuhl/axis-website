"use client"
// "use client" needed: uses useState for contact form, Framer Motion.

import { useState } from "react"
import { motion } from "framer-motion"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Button from "@/components/ui/Button"
import type { Dict } from "@/lib/getDictionary"

// ---------------------------------------------------------------------------
// ContactPageClient — contact form, WhatsApp button, map placeholder
//
// No backend: form submission shows a success state.
//
// // FUTURE BACKEND:
// // POST to /api/contact → send email via Resend or SendGrid
// // Store contact submissions in DB for follow-up tracking
// ---------------------------------------------------------------------------

// Form field type — all fields are strings
interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface ContactPageClientProps {
  dict: Dict["contact_page"];
}

export default function ContactPageClient({ dict }: ContactPageClientProps) {
  // Form data state
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  // submitted = true shows the success message instead of the form
  const [submitted, setSubmitted] = useState(false);
  // isSubmitting = true shows loading state on the button
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    // preventDefault stops the browser from reloading the page on form submit
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate a brief server delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const inputClass =
    "w-full bg-canvas border border-edge rounded-md px-4 py-3 text-white text-sm placeholder:text-dim focus:outline-none focus:border-white/40 transition-colors";

  return (
    <main>
      {/* PAGE HEADER */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-surface border-b border-edge">
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-dim text-sm font-medium tracking-widest uppercase mb-2">
              {dict.eyebrow}
            </p>
            {/* h1 — exactly one per page */}
            <h1 className="text-white font-bold text-5xl md:text-7xl tracking-tight">
              {dict.heading}
            </h1>
          </motion.div>
        </SectionWrapper>
      </section>

      {/* CONTACT CONTENT — form left, info right */}
      <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
        <SectionWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            {/* LEFT — contact form */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h2 className="text-white font-semibold text-2xl mb-6">{dict.form_heading}</h2>

              {/* SUCCESS STATE — shown after form is submitted */}
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface border border-edge rounded-xl p-8 text-center"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold mb-1">{dict.success_heading}</p>
                  <p className="text-dim text-sm">{dict.success_subtext}</p>
                </motion.div>
              ) : (
                /* FORM */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-dim text-xs mb-1">{dict.name}</label>
                    <input
                      type="text"
                      required
                      placeholder="Jean Dupont"
                      className={inputClass}
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-dim text-xs mb-1">{dict.email}</label>
                    <input
                      type="email"
                      required
                      placeholder="jean@example.com"
                      className={inputClass}
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-dim text-xs mb-1">{dict.message}</label>
                    {/* textarea for multi-line input */}
                    <textarea
                      required
                      rows={5}
                      placeholder={dict.placeholder_message}
                      className={`${inputClass} resize-none`}
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? dict.sending : dict.send}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* RIGHT — contact info + WhatsApp + map placeholder */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-white font-semibold text-2xl mb-6">{dict.find_us_heading}</h2>

                {/* ADDRESS */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-dim mt-0.5 shrink-0">
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      <p className="text-white text-sm font-medium">{dict.address_label}</p>
                      <p className="text-dim text-sm mt-0.5">12 Rue Molière<br />94200 Ivry-sur-Seine</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-dim mt-0.5 shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                    <div>
                      <p className="text-white text-sm font-medium">{dict.instagram_label}</p>
                      <a href="https://www.instagram.com/overhandzclub/" target="_blank" rel="noopener noreferrer" className="text-dim hover:text-white text-sm transition-colors">
                        @overhandzclub
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-dim mt-0.5 shrink-0">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                    <div>
                      <p className="text-white text-sm font-medium">{dict.hours_label}</p>
                      <p className="text-dim text-sm mt-0.5" style={{ whiteSpace: "pre-line" }}>{dict.hours_value}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WHATSAPP BUTTON */}
              <a
                href="https://wa.me/33695500023"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-surface border border-edge rounded-xl p-4 hover:border-white/20 transition-colors"
              >
                {/* WhatsApp icon */}
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{dict.whatsapp_heading}</p>
                  <p className="text-dim text-xs">{dict.whatsapp_sub}</p>
                </div>
              </a>

              {/* MAP */}
              <div className="relative aspect-video border border-edge rounded-xl overflow-hidden">
                <iframe
                  title="Overhandz Boxing Club map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=2.3747%2C48.8092%2C2.3947%2C48.8192&layer=mapnik&marker=48.8142%2C2.3847"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </SectionWrapper>
      </section>
    </main>
  );
}
