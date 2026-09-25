export type TransactionType = "income" | "expenses";

export interface Transaction {
  id: string;
  date: string;
  donor: string;
  amount: number;
  year: number;
  createdAt: string;
}

export type YearTransactions = Record<string, Transaction>;

export interface ProjectData {
  income: Record<string, YearTransactions>;
  expenses: Record<string, YearTransactions>;
  createdAt?: string;
  createdYear?: number;
}

export type Projects = Record<string, ProjectData>;

export interface TransactionFormData {
  date: string;
  donor: string;
  amount: string;
}

export type GalleryItemType = "image" | "video";

export interface GalleryItem {
  id: string;
  type: GalleryItemType;
  url: string;
  publicId: string;
  caption?: string;
  // Slugs from siteConfig's PROJECT_CATEGORY_SLUGS — also shows the item on each of those
  // projects' detail pages. The sitewide /projects gallery shows every item regardless;
  // absent/empty = general media that appears on no project page.
  projectSlugs?: string[];
  // Legacy single-project tag from before items could belong to several projects. Still read
  // (see lib/gallery.ts's getGalleryItemProjectSlugs) but never written — any admin re-tag
  // rewrites the item into projectSlugs and deletes this field.
  projectSlug?: string;
  // true = left out of the sitewide /projects gallery (still shown on any tagged project pages).
  // Only ever stored as true — absent means shown — so items saved before this flag existed stay
  // visible without a migration.
  hideFromMainGallery?: boolean;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
  format: string;
  createdAt: string;
  createdBy: string;
}

export interface GalleryItemFormData {
  caption: string;
}
