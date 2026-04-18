// app/[lang]/layout.tsx — locale-aware layout with Navbar and Footer.
//
// All user-facing pages live under /en/... or /fr/... and go through
// this layout. generateStaticParams tells Next.js to pre-render both
// locales at build time.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDictionary, hasLocale } from "@/lib/getDictionary";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export const metadata: Metadata = {
  title: "Overhandz Boxing Club",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="flex-1">{children}</div>
      <Footer dict={dict.footer} navDict={dict.navbar} lang={lang} />
    </>
  );
}
