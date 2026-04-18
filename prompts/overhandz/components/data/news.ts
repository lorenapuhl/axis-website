// ---------------------------------------------------------------------------
// MOCK DATA — News / Updates
// ---------------------------------------------------------------------------
//
// FUTURE BACKEND:
// Replace with API route: /api/news
// Connect to a CMS (e.g. Sanity, Contentful) or DB table
// Allow coaches to post updates from a dashboard
// ---------------------------------------------------------------------------

import type { Lang } from "@/lib/getDictionary"

type Bilingual = Record<Lang, string>

export type NewsCategory = "fight-result" | "update" | "announcement";

export interface NewsItem {
  id: string;
  title: Bilingual;
  excerpt: Bilingual;
  date: string;         // ISO date "YYYY-MM-DD"
  imageUrl: string;
  category: NewsCategory;
  author: string;
  link: string;
}

export const newsItems: NewsItem[] = [
  {
    id: "news-1",
    title: {
      fr: "La saison a déjà commencé",
      en: "The season has already started",
    },
    excerpt: {
      fr: "La saison a déjà commencé, on vous attend à la salle et sur le ring. Club de boxe anglaise, Muay Thai, Cross training. Inscription au mois ou à l'année au 13 rue Molière, Ivry-sur-Seine 94200.",
      en: "The season has already started — we're waiting for you at the gym and in the ring. Boxing, Muay Thai, cross training. Monthly or annual memberships at 13 rue Molière, Ivry-sur-Seine.",
    },
    date: "2023-01-05",
    imageUrl: "/images/news/post-1.png",
    category: "announcement",
    author: "Overhandz Team",
    link: "https://www.instagram.com/p/CnNE2T9L-xW/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "news-2",
    title: {
      fr: "La collection est toujours disponible",
      en: "The collection is still available",
    },
    excerpt: {
      fr: "Overhandz boxing club. La collection est toujours disponible. Le lien est en bio !",
      en: "Overhandz boxing club. The collection is still available. Link in bio!",
    },
    date: "2022-11-14",
    imageUrl: "/images/news/post-2.png",
    category: "update",
    author: "Overhandz Team",
    link: "https://www.instagram.com/p/ClCSuzkrHxj/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "news-3",
    title: {
      en: "Get yourself prepared",
      fr: "Préparez-vous",
    },
    excerpt: {
      en: "We've got everyday classes of various martial arts and trainings available on our planning. We had 100 spots available for this session and there's a bit less than 50 left this week — be quick!",
      fr: "Nous proposons des cours quotidiens de différents arts martiaux. Il restait 100 places pour cette session et il en reste moins de 50 cette semaine — faites vite !",
    },
    date: "2021-09-16",
    imageUrl: "/images/news/post-3.png",
    category: "announcement",
    author: "Overhandz Team",
    link: "https://www.instagram.com/p/CUApqWusQ0c/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "news-4",
    title: {
      fr: "On va bientôt poster",
      en: "We'll post soon",
    },
    excerpt: {
      fr: "On a eu une belle semaine 🥊 On va bientôt poster le lendemain. #overhandz #boxing #club #boxingmotivation",
      en: "We had a great week 🥊 We'll be posting soon. #overhandz #boxing #club #boxingmotivation",
    },
    date: "2021-12-31",
    imageUrl: "/images/news/post-4.png",
    category: "update",
    author: "Overhandz Team",
    link: "https://www.instagram.com/p/CTrcl1asR0t/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
];
