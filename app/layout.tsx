import type { Metadata } from "next"
import { Playfair_Display, Instrument_Sans } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400","500", "700", "900"],
})

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: "AXIS — Client Conversion Systems for Sports Studios",
  description: "Turn your studio's Instagram into a booking system.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${instrument.variable}`}>
        {children}
      </body>
    </html>
  )
}
