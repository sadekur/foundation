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

export const metadata: Metadata = {
  title: {
    default: "As-Salsabil Foundation",
    template: "%s | As-Salsabil Foundation",
  },
  description:
    "As-Salsabil Foundation is a non-political charitable foundation established in 2021, running Zakat, sadaqah jariyah, and rehabilitation projects in Gobindaganj, Gaibandha.",
  icons: {
    icon: "/favicon.ico",
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
