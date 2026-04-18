// ---------------------------------------------------------------------------
// MOCK DATA — Events
// ---------------------------------------------------------------------------
//
// FUTURE BACKEND:
// Replace with API route: /api/events
// Connect to calendar/event management DB
// Send automatic reminders to registered members
// ---------------------------------------------------------------------------

import type { Lang } from "@/lib/getDictionary"

type Bilingual = Record<Lang, string>

export type EventType = "fight-night" | "seminar" | "open-gym" | "competition";

export interface GymEvent {
  id: string;
  title: Bilingual;
  date: string;         // ISO date string "YYYY-MM-DD"
  time: string;         // "HH:MM"
  location: string;
  imageUrl: string;
  description: Bilingual;
  type: EventType;
  spotsLeft: number | null; // null = unlimited / no registration
  link: string;
}

export const events: GymEvent[] = [
  {
    id: "ev-1",
    title: {
      en: "Upcycling Crop Shirt — HUVIVA x JMT Paris",
      fr: "Crop Shirt Upcyclé — HUVIVA x JMT Paris",
    },
    date: "2025-11-13",
    time: "",
    location: "",
    imageUrl: "/images/events/post-1.png",
    description: {
      en: "Upcycling crop shirt from HUVIVA, available at @jmt_paris. A limited boxing-fashion collab.",
      fr: "Crop shirt upcyclé de HUVIVA, disponible chez @jmt_paris. Une collab boxe-mode en édition limitée.",
    },
    type: "open-gym",
    spotsLeft: null,
    link: "https://www.instagram.com/p/DRAGNxRjFGm/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "ev-2",
    title: {
      en: "Overhandz at El Cafe Gym — Mexico City",
      fr: "Overhandz à El Cafe Gym — Mexico City",
    },
    date: "2021-02-01",
    time: "",
    location: "El Cafe, CDLX, Mexico",
    imageUrl: "/images/events/post-2.png",
    description: {
      en: "Overhandz visits El Cafe gym in Mexico City — one of the best boxing gyms around. International connections.",
      fr: "Overhandz rend visite à la salle El Cafe à Mexico City — l'une des meilleures salles de boxe. Connexions internationales.",
    },
    type: "open-gym",
    spotsLeft: null,
    link: "https://www.instagram.com/p/CoIGHQKLl4Z/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "ev-3",
    title: {
      en: "Battle MBC x Overhandz",
      fr: "Battle MBC x Overhandz",
    },
    date: "2022-07-17",
    time: "",
    location: "Ivry-sur-Seine, France",
    imageUrl: "/images/events/post-3.png",
    description: {
      en: "Photos from the Battle Montmartre Breaking Club x Overhandz. Full photo album on the Montmartre Breaking Club Facebook page.",
      fr: "Photos du Battle Montmartre Breaking Club x Overhandz. Album photo complet sur la page Facebook du Montmartre Breaking Club.",
    },
    type: "competition",
    spotsLeft: null,
    link: "https://www.instagram.com/p/CgH4qJCrAmN/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "ev-4",
    title: {
      en: "1V1 Break & 7 To Smoke All Style — Overhandz x Montmartre Breaking Club",
      fr: "1V1 Break & 7 To Smoke All Style — Overhandz x Montmartre Breaking Club",
    },
    date: "2022-07-09",
    time: "17:00",
    location: "15 Rue Molière, Paris",
    imageUrl: "/images/events/post-4.png",
    description: {
      en: "Pre-selection 13H30. Entry 5€ + 1 drink, free for participants. Break Open Qualif & 7ToSmoke All Style. DJ Locky.",
      fr: "Pré-sélection 13h30. Entrée 5€ + 1 conso, gratuit pour les participants. Break Open Qualif & 7ToSmoke All Style. DJ Locky.",
    },
    type: "competition",
    spotsLeft: null,
    link: "https://www.instagram.com/p/CewM_EkLKMy/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
];
