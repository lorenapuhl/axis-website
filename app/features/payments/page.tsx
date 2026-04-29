// app/features/payments/page.tsx
//
// Feature sub-page: Payments.

import type { Metadata } from "next"
import CTAProvider from "@/components/cta/CTAContext"
import HeaderSection from "@/components/sections/HeaderSection"
import FeaturePageShell from "@/components/sections/FeaturePageShell"
import PaymentsVisual from "@/components/features/PaymentsVisual"
import FinalCTA from "@/components/sections/FinalCTA"
import FooterSection from "@/components/sections/FooterSection"

export const metadata: Metadata = {
  title: "Payments — AXIS",
  description:
    "Secure, automatic payments from checkout to payout. Apple Pay, Google Pay, PayPal, and more — no chasing, no manual admin.",
  openGraph: {
    title: "Payments — AXIS",
    description:
      "Secure, automatic payments from checkout to payout. Apple Pay, Google Pay, PayPal, and more — no chasing, no manual admin.",
    url: "https://yourdomain.com/features/payments",
    type: "website",
  },
}

const FEATURES = [
  {
    name: "Fast, familiar checkout",
    description:
      "Take secure payments online, in-app, and in person with a smooth checkout experience your members already trust.",
  },
  {
    name: "All settled automatically",
    description:
      "From a member's first payment to your regular payout, everything runs securely and automatically. No chasing, no manual admin.",
  },
  {
    name: "Pay how they prefer",
    description:
      "Accept Apple Pay, Google Pay, PayPal, and leading card providers including American Express. Members pay the way they want.",
  },
  {
    name: "No awkward moments",
    description:
      "Automatic retries and reminders reduce failed payments and protect your recurring revenue — without you having to follow up.",
  },
  {
    name: "Flexible ways to pay",
    description:
      "Offer upfront payments or instalments for memberships, retreats, and bigger commitments — without complex setup on your end.",
  },
  {
    name: "Ready to scale globally",
    description:
      "Run multi-location, multi-currency payments with compliance built in for taxes, invoicing, and local requirements.",
  },
]

export default function PaymentsPage() {
  return (
    <CTAProvider>
      <HeaderSection />
      <FeaturePageShell
        category="Run Your Operations"
        headline="Simple and secure payments."
        subtitle="One less thing to think about. Secure, automatic payments from checkout to payout — so you can focus on running great classes."
        features={FEATURES}
        quote="AXIS handles all the client bookings and takes the payments so I don't need to think about it. It just works."
        quoteAuthor="Jodie, Founder — Reform & Glow"
      >
        <PaymentsVisual />
      </FeaturePageShell>
      <FinalCTA />
      <FooterSection />
    </CTAProvider>
  )
}
