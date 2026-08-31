import type { Metadata } from "next";
import { ProjectsContent } from "./projects-content";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Zakat distribution, sadaqah jariyah programs, and rehabilitation projects run by As-Salsabil Foundation for the community in Gobindaganj, Gaibandha.",
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
