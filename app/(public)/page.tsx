import type { Metadata } from "next";
import { HomeContent } from "./components/HomeContent";

export const metadata: Metadata = {
  title: "Home",
  description:
    "As-Salsabil Foundation runs Zakat, sadaqah jariyah, and rehabilitation projects in Gobindaganj, Gaibandha, following the Sunnah of the Prophet (peace be upon him).",
};

export default function HomePage() {
  return <HomeContent />;
}
