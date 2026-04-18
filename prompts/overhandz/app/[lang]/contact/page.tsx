// Contact page — /en/contact or /fr/contact
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/getDictionary";
import ContactPageClient from "@/components/pages/ContactPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.metadata.contact_title,
    description: dict.metadata.contact_desc,
    openGraph: {
      title: dict.metadata.contact_title,
      description: dict.metadata.contact_desc,
      url: `https://overhandz.com/${lang}/contact`,
      type: "website",
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <ContactPageClient dict={dict.contact_page} />;
}
