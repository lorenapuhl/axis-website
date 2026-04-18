// ---------------------------------------------------------------------------
// MOCK DATA — Testimonials
// ---------------------------------------------------------------------------
//
// FUTURE BACKEND:
// Replace with API route: /api/testimonials
// Connect to a review platform (Google Reviews, Trustpilot) or DB table
// ---------------------------------------------------------------------------

import type { Lang } from "@/lib/getDictionary"

type Bilingual = Record<Lang, string>

export interface Testimonial {
  id: string;
  name: string;
  role: Bilingual;
  quote: Bilingual;
  rating: number;    // 1–5
}

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Lucas M.",
    role: {
      en: "Member since 2022",
      fr: "Membre depuis 2022",
    },
    quote: {
      en: "I came in knowing nothing about boxing. Coach Yasmine made me feel welcome from day one. Two years later, I've done my first amateur fight. This gym changed my life.",
      fr: "Je suis arrivé sans rien connaître à la boxe. Le coach m'a mis à l'aise dès le premier jour. Deux ans plus tard, j'ai fait mon premier combat amateur. Cette salle a changé ma vie.",
    },
    rating: 5,
  },
  {
    id: "t-2",
    name: "Amira K.",
    role: {
      en: "Fight team",
      fr: "Équipe de combat",
    },
    quote: {
      en: "The level of coaching here is serious. Karim pushes you to improve every single session. The sparring is controlled, technical, and fun. Best gym in Paris.",
      fr: "Le niveau de coaching ici est sérieux. On vous pousse à progresser à chaque séance. Le sparring est encadré, technique et fun. Meilleure salle de Paris.",
    },
    rating: 5,
  },
  {
    id: "t-3",
    name: "Thomas B.",
    role: {
      en: "Member since 2023",
      fr: "Membre depuis 2023",
    },
    quote: {
      en: "I travel a lot for work. Being able to book classes online without sending DMs saves me so much hassle. I always know my spot is secured when I land.",
      fr: "Je voyage beaucoup pour le travail. Pouvoir réserver des cours en ligne sans envoyer de messages me fait gagner un temps fou. Je sais toujours que ma place est sécurisée à l'atterrissage.",
    },
    rating: 5,
  },
  {
    id: "t-4",
    name: "Fatima D.",
    role: {
      en: "Muay Thai student",
      fr: "Élève Muay Thai",
    },
    quote: {
      en: "Started with Muay Thai here after years of doing nothing. The morning sessions with Samir are brutal in the best way. I've lost 8kg and feel incredible.",
      fr: "J'ai commencé le Muay Thai ici après des années d'inactivité. Les séances du matin sont intenses dans le bon sens du terme. J'ai perdu 8kg et je me sens incroyable.",
    },
    rating: 5,
  },
];
