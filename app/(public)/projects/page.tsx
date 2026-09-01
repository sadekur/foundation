import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/gallery";
import { ProjectsContent } from "./components/ProjectsContent";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Zakat distribution, sadaqah jariyah programs, and rehabilitation projects run by As-Salsabil Foundation for the community in Gobindaganj, Gaibandha.",
};

export default async function ProjectsPage() {
  const { items, nextCursor } = await getGalleryItems();
  return <ProjectsContent initialGalleryItems={items} initialGalleryCursor={nextCursor} />;
}
