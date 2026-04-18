// Case Study page — route: /case-study
//
// Portfolio-mode page demonstrating the business impact of this project.
// Target audience: potential SaaS clients (gyms, studios) considering the product.

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
