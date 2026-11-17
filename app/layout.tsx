import type { Metadata } from "next";
import { Amiri, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

// Absolute base for og:image and other metadata URLs. Vercel sets VERCEL_PROJECT_PRODUCTION_URL
// (host only, no protocol) at build time; the fallback is the current production domain.
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://salsabil-foundation.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Link previews (WhatsApp, Facebook, Messenger…). Pages that don't set their own openGraph
  // inherit this; og:title/og:description fall back to each page's <title>/description.
  openGraph: {
    type: "website",
    siteName: "As-Salsabil Foundation",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    images: [{ url: "/logo512.png", width: 512, height: 512, alt: "As-Salsabil Foundation" }],
  },
  twitter: {
    card: "summary",
    images: ["/logo512.png"],
  },
  title: {
    default: "As-Salsabil Foundation",
    template: "%s | As-Salsabil Foundation",
  },
  description:
    "As-Salsabil Foundation is a non-political charitable foundation established in 2021, running Zakat, sadaqah jariyah, and rehabilitation projects in Gobindaganj, Gaibandha.",
  icons: {
    icon: "/logo192.png",
    apple: "/logo192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${amiri.variable} ${notoBengali.variable}`}>
      <body>{children}</body>
    </html>
  );
}
