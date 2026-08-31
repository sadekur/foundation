import type { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "As-Salsabil Foundation is a non-political charitable foundation established in 2021, following the Sunnah of the Prophet (peace be upon him) to run lasting sadaqah jariyah projects.",
};

export default function AboutPage() {
  return <AboutContent />;
}
