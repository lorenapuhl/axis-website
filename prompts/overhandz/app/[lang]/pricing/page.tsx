// Pricing page — /en/pricing or /fr/pricing
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/getDictionary";
import PricingPageExtras from "@/components/pages/PricingPageExtras";
import PricingSection from "@/components/sections/PricingSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.metadata.pricing_title,
    description: dict.metadata.pricing_desc,
    openGraph: {
      title: dict.metadata.pricing_title,
      description: dict.metadata.pricing_desc,
      url: `https://overhandz.com/${lang}/pricing`,
      type: "website",
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <main>
      <PricingPageExtras dict={dict.pricing_page} />
      <PricingSection dict={dict} lang={lang} />
    </main>
  );
}
