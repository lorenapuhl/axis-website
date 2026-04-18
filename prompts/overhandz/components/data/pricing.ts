// ---------------------------------------------------------------------------
// MOCK DATA — Pricing Plans
// ---------------------------------------------------------------------------
//
// FUTURE BACKEND:
// Replace with API route: /api/pricing
// Connect to Stripe Product/Price API for live pricing
// ---------------------------------------------------------------------------

import type { Lang } from "@/lib/getDictionary"

type Bilingual = Record<Lang, string>

export interface PricingBenefit {
  text: Bilingual;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;       // Discipline name — same in both languages
  price: number;
  period: Bilingual;
  highlight: boolean;
  badge: string | null;
  description: Bilingual;
  benefits: PricingBenefit[];
  cta: Bilingual;
  note?: Bilingual;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "boxe-anglaise-full",
    name: "Boxe Anglaise Full",
    price: 450,
    period: { fr: "par an", en: "per year" },
    highlight: false,
    badge: null,
    description: {
      fr: "Accès complet aux cours de boxe anglaise avec accès libre à la salle.",
      en: "Full access to boxing classes with open gym access.",
    },
    benefits: [
      { text: { fr: "Cours de boxe anglaise (Mardi & Jeudi)", en: "Boxing classes (Tue & Thu)" }, included: true },
      { text: { fr: "Accès lundi en dehors des cours", en: "Monday open access outside of classes" }, included: true },
      { text: { fr: "Accès libre à la salle", en: "Open gym access" }, included: true },
      { text: { fr: "1 Tee-shirt offert", en: "1 free T-shirt" }, included: true },
      { text: { fr: "Cours Muay-Thaï inclus", en: "Muay Thai classes included" }, included: false },
    ],
    cta: { fr: "S'inscrire", en: "Sign Up" },
    note: {
      fr: "* Prix réduit pour les étudiants et les élèves",
      en: "* Reduced price for students and pupils",
    },
  },
  {
    id: "muay-thai-full",
    name: "Muay-Thaï Full",
    price: 350,
    period: { fr: "par an", en: "per year" },
    highlight: false,
    badge: null,
    description: {
      fr: "Accès complet aux cours de muay-thaï trois fois par semaine.",
      en: "Full access to Muay Thai classes three times a week.",
    },
    benefits: [
      { text: { fr: "Cours de muay-thaï (Lundi, Mercredi, Vendredi)", en: "Muay Thai classes (Mon, Wed, Fri)" }, included: true },
      { text: { fr: "Accès libre à la salle", en: "Open gym access" }, included: true },
      { text: { fr: "1 Tee-shirt offert", en: "1 free T-shirt" }, included: true },
      { text: { fr: "Cours Boxe Anglaise inclus", en: "Boxing classes included" }, included: false },
    ],
    cta: { fr: "S'inscrire", en: "Sign Up" },
  },
  {
    id: "muay-thai",
    name: "Muay-Thaï",
    price: 280,
    period: { fr: "par an", en: "per year" },
    highlight: false,
    badge: null,
    description: {
      fr: "Cours de muay-thaï deux fois par semaine.",
      en: "Muay Thai classes twice a week.",
    },
    benefits: [
      { text: { fr: "Cours de muay-thaï (Mercredi & Vendredi)", en: "Muay Thai classes (Wed & Fri)" }, included: true },
      { text: { fr: "Accès libre à la salle", en: "Open gym access" }, included: false },
      { text: { fr: "Tee-shirt offert", en: "Free T-shirt" }, included: false },
      { text: { fr: "Cours Boxe Anglaise inclus", en: "Boxing classes included" }, included: false },
    ],
    cta: { fr: "S'inscrire", en: "Sign Up" },
  },
  {
    id: "muay-thai-feminin",
    name: "Muay-Thaï Féminin",
    price: 250,
    period: { fr: "par an", en: "per year" },
    highlight: false,
    badge: null,
    description: {
      fr: "Cours de muay-thaï féminin deux fois par semaine.",
      en: "Women's Muay Thai classes twice a week.",
    },
    benefits: [
      { text: { fr: "Cours Muay-Thaï Féminin (Mercredi & Vendredi)", en: "Women's Muay Thai (Wed & Fri)" }, included: true },
      { text: { fr: "Accès libre à la salle", en: "Open gym access" }, included: false },
      { text: { fr: "Tee-shirt offert", en: "Free T-shirt" }, included: false },
      { text: { fr: "Cours supplémentaires inclus", en: "Additional classes included" }, included: false },
    ],
    cta: { fr: "S'inscrire", en: "Sign Up" },
  },
];

export interface SimpleOption {
  label: Bilingual;
  price: number | null;
  unit: Bilingual;
}

export const simpleOptions: SimpleOption[] = [
  {
    label: { fr: "Cours à l'unité", en: "Drop-in class" },
    price: 15,
    unit: { fr: "par cours", en: "per class" },
  },
  {
    label: { fr: "Abonnement au mois", en: "Monthly membership" },
    price: 60,
    unit: { fr: "par mois", en: "per month" },
  },
  {
    label: { fr: "Cours particulier", en: "Private lesson" },
    price: null,
    unit: { fr: "nous contacter", en: "contact us" },
  },
];
