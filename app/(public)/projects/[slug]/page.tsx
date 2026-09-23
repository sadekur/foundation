import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECT_CATEGORY_SLUGS } from "@/lib/siteConfig";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { ProjectDetailContent } from "./components/ProjectDetailContent";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECT_CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = dictionaries.en.projects.categories.find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: category.title,
    description: category.blurb,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const isKnownSlug = (PROJECT_CATEGORY_SLUGS as readonly string[]).includes(slug);
  if (!isKnownSlug) notFound();

  const { items, nextCursor } = await getGalleryItems({ projectSlug: slug });
  return <ProjectDetailContent slug={slug} initialGalleryItems={items} initialGalleryCursor={nextCursor} />;
}
