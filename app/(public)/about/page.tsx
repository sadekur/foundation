import type { Metadata } from "next";
import { AboutContent } from "./components/AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "As-Salsabil Foundation, established in 2021, follows the Qur'an and authentic Sunnah to spread Islamic education and dawah, support people in need, and run lasting sadaqah jariyah projects. Download our brochure.",
};

export default function AboutPage() {
  return <AboutContent />;
}
