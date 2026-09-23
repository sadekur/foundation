import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/gallery";
import { ProjectsContent } from "./components/ProjectsContent";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Zakat distribution, sadaqah jariyah programs, and rehabilitation projects run by As-Salsabil Foundation for the community in Gobindaganj, Gaibandha.",
};

// Gallery is read via the Firestore SDK (not fetch), so without this the first page of media
// would be frozen at build time — re-render at most every 5 minutes instead.
export const revalidate = 300;

export default async function ProjectsPage() {
  const { items, nextCursor } = await getGalleryItems();
  return <ProjectsContent initialGalleryItems={items} initialGalleryCursor={nextCursor} />;
}
