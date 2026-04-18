// Case Study page — /en/case-study or /fr/case-study
// This is English-only portfolio content. Served unchanged under both locales.
import type { Metadata } from "next";
import CaseStudyClient from "@/components/pages/CaseStudyClient";

export const metadata: Metadata = {
  title: "Case Study — Overhandz Boxing Club",
  description:
    "How Overhandz transformed Instagram-based booking chaos into an automated booking system. A SaaS case study for boxing gyms and fitness studios.",
  openGraph: {
    title: "Case Study — Overhandz Boxing Club",
    description:
      "SaaS case study: how we transformed boxing studio bookings from DMs to automated online checkout.",
    url: "https://overhandz.com/case-study",
    type: "website",
  },
};

export default function CaseStudyPage() {
  return <CaseStudyClient />;
}
