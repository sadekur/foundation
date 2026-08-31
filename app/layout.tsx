import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
