// About page — /en/about or /fr/about
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/getDictionary";
import AboutPageClient from "@/components/pages/AboutPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.metadata.about_title,
    description: dict.metadata.about_desc,
    openGraph: {
      title: dict.metadata.about_title,
      description: dict.metadata.about_desc,
      url: `https://overhandz.com/${lang}/about`,
      type: "website",
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <AboutPageClient dict={dict} lang={lang} />;
}
