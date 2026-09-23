import { dictionaries } from "@/lib/i18n/dictionaries";

// Choices for tagging a gallery item with a public project page. The dashboard is English-only,
// so titles come from the English dictionary; slugs are language-independent.
export const GALLERY_PROJECT_OPTIONS = dictionaries.en.projects.categories.map(({ slug, title }) => ({
  slug,
  title,
}));

export const getGalleryProjectTitle = (slug: string | undefined) =>
  GALLERY_PROJECT_OPTIONS.find((option) => option.slug === slug)?.title;
