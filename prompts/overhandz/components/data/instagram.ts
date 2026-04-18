// ---------------------------------------------------------------------------
// Instagram Feed — real posts (screenshots cropped to post image only)
// ---------------------------------------------------------------------------
//
// FUTURE BACKEND:
// Replace with API route: /api/instagram
// Connect to Instagram Basic Display API or a third-party service (e.g. Behold)
// Auto-refresh content daily via a cron job
// ---------------------------------------------------------------------------

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  type: "photo" | "reel";
  link: string;
}

export const instagramPosts: InstagramPost[] = [
  {
    id: "ig-1",
    imageUrl: "/images/instagram/post-1.png",
    caption:
      "Une salle multidisciplinaire spécialisée dans les sports de combats la préparation physique et le bien-être ! Bientôt plus d'informations sur l'ouverture officiel en septembre...",
    likes: 62,
    type: "photo",
    link: "https://www.instagram.com/p/CPTYyXZhVTR/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "ig-2",
    imageUrl: "/images/instagram/post-2.png",
    caption:
      "un club de boxe à Ivry-sur-Seine qui ouvre courant Septembre. Inscriptions en DM. Shop, Website et Programme Comes Soon 🔜",
    likes: 42,
    type: "photo",
    link: "https://www.instagram.com/p/CTZ9udkMJVD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: "ig-3",
    imageUrl: "/images/instagram/post-3.png",
    caption: "Ouverture Officielle le 15 Septembre 🎉 On est prêt ! et vous ? 🙃",
    likes: 89,
    type: "photo",
    link: "https://www.instagram.com/p/CTpYbLPsAnw/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: "ig-4",
    imageUrl: "/images/instagram/post-4.png",
    caption:
      "We're dropping something new 🔥 The Classic Overhandz Boxing Club Tee is now available both in Black and White 🖤🤍. You can still Enjoy 20% off everything you order for the next 72H...",
    likes: 58,
    type: "photo",
    link: "https://www.instagram.com/p/CT7D1Uds0w4/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "ig-5",
    imageUrl: "/images/instagram/post-5.png",
    caption: "Venez vous entraîner avec @yamani_muay_thai au Overhandz Boxing Club 🥊",
    likes: 47,
    type: "photo",
    link: "https://www.instagram.com/p/CUW7dDNgG9z/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "ig-6",
    imageUrl: "/images/instagram/post-6.png",
    caption:
      "C'est avec beaucoup de gratitude et de fierté qu'on clôture cette 2ème année du @overhandzclub 🙏 Merci à tous nos adhérents, amis, partenaires et coachs pour cette énergie incroyable 🙏",
    likes: 71,
    type: "photo",
    link: "https://www.instagram.com/p/CvNSCAUtntZ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
];
