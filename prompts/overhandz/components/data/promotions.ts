// ---------------------------------------------------------------------------
// MOCK DATA — Promotions
// ---------------------------------------------------------------------------
//
// FUTURE BACKEND:
// Replace with API route: /api/promotions
// Add expiry dates, usage limits, and promo code generation via DB
// ---------------------------------------------------------------------------

import type { Lang } from "@/lib/getDictionary"

type Bilingual = Record<Lang, string>

export interface Promotion {
  id: string;
  title: Bilingual;
  description: Bilingual;
  badge: string;         // short label — same in both languages
  imageUrl: string;
  cta: Bilingual;
  highlight: boolean;
  expiresLabel: Bilingual | null;
  link: string;
}

export const promotions: Promotion[] = [
  {
    id: "promo-1",
    title: {
      en: "Overhandz Boxing Club T-Shirt",
      fr: "T-Shirt Overhandz Boxing Club",
    },
    description: {
      en: "Represent the gym with the official Overhandz Boxing Club t-shirt. Available online and at the gym. Come discover our disciplines: Boxing, Muay Thai, sparring and more in Ivry-sur-Seine.",
      fr: "Représente la salle avec le t-shirt officiel Overhandz Boxing Club. Disponible sur notre site et à la salle. Venez découvrir nos disciplines : Boxe anglaise, Muay Thai, sparring et plus à Ivry-sur-Seine.",
    },
    badge: "Merch",
    imageUrl: "/images/promotions/post-1.png",
    cta: { en: "Shop Now", fr: "Acheter" },
    highlight: false,
    expiresLabel: null,
    link: "https://www.instagram.com/p/CkYamcaNPJW/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "promo-2",
    title: {
      en: "Overhandz Giveaway",
      fr: "Giveaway Overhandz",
    },
    description: {
      en: "Follow us @overhandzclub, mention a friend in the comments, and share this post to double your chances of winning an Overhandz t-shirt. Winners announced next Friday.",
      fr: "Suivez-nous @overhandzclub, mentionnez un ami en commentaire, et partagez cette publication pour doubler vos chances de gagner un t-shirt Overhandz. Gagnants annoncés vendredi prochain.",
    },
    badge: "Giveaway",
    imageUrl: "/images/promotions/post-2.png",
    cta: { en: "Enter Giveaway", fr: "Participer" },
    highlight: true,
    expiresLabel: {
      en: "Winners announced next Friday",
      fr: "Gagnants annoncés vendredi prochain",
    },
    link: "https://www.instagram.com/p/C3x0Lw3sLF0/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "promo-3",
    title: {
      en: "New Tiger Coat Jacket",
      fr: "Nouvelle veste Tiger Coat",
    },
    description: {
      en: "Introducing the new Overhandz Tiger Coat Jacket. Designed by @boutiqueprez. Available online and at the gym. Training sessions run Monday to Friday at 7pm — come try a free session.",
      fr: "Découvrez la nouvelle veste Tiger Coat Overhandz. Designée par @boutiqueprez. Disponible en ligne et à la salle. Cours du lundi au vendredi à 19h — venez essayer une séance gratuite.",
    },
    badge: "New",
    imageUrl: "/images/promotions/post-3.png",
    cta: { en: "Shop Now", fr: "Acheter" },
    highlight: false,
    expiresLabel: null,
    link: "https://www.instagram.com/p/CyLiEW9tuPx/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
];
