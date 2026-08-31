import type { Metadata } from "next";
import { HomeContent } from "./home-content";

export const metadata: Metadata = {
  title: "Home",
  description:
    "As-Salsabil Foundation runs Zakat, sadaqah jariyah, and rehabilitation projects in Gobindaganj, Gaibandha, following the Sunnah of the Prophet (peace be upon him).",
};

export default function HomePage() {
  return <HomeContent />;
}
