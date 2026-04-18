// Root layout — provides <html>, <body>, font variable, and global CSS.
// Navbar and Footer live in app/[lang]/layout.tsx so they can receive the
// locale-specific dictionary.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Overhandz Boxing Club",
  description: "Boxing and Muay Thai in Ivry-sur-Seine, Paris.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read locale set by proxy.ts so the <html lang=""> attribute is correct
  const hdrs = await headers();
  const lang = hdrs.get("x-locale") ?? "en";

  return (
    <html lang={lang} className={inter.variable}>
      <body className="bg-canvas text-white antialiased min-h-screen flex flex-col">

        {/* JSON-LD STRUCTURED DATA — local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              name: "Overhandz Boxing Club",
              description:
                "Boxing gym offering boxing and Muay Thai classes in Ivry-sur-Seine, Paris.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Ivry-sur-Seine",
                addressRegion: "Île-de-France",
                addressCountry: "FR",
              },
              url: "https://overhandz.com",
              telephone: "+33-1-00-00-00-00",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday", "Tuesday", "Wednesday", "Thursday",
                    "Friday", "Saturday", "Sunday",
                  ],
                  opens: "07:00",
                  closes: "22:00",
                },
              ],
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}
