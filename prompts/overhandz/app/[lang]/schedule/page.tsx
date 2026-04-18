// Schedule page — /en/schedule or /fr/schedule
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/getDictionary";
import SchedulePageClient from "@/components/pages/SchedulePageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.metadata.schedule_title,
    description: dict.metadata.schedule_desc,
    openGraph: {
      title: dict.metadata.schedule_title,
      description: dict.metadata.schedule_desc,
      url: `https://overhandz.com/${lang}/schedule`,
      type: "website",
    },
  };
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <SchedulePageClient dict={dict} lang={lang} />;
}
