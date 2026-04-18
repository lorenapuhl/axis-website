// Home page — /en or /fr
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/getDictionary";
import HomePageWrapper from "@/components/HomePageWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.metadata.home_title,
    description: dict.metadata.home_desc,
    openGraph: {
      title: dict.metadata.home_title,
      description: dict.metadata.home_desc,
      url: `https://overhandz.com/${lang}`,
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <HomePageWrapper dict={dict} lang={lang} />;
}
