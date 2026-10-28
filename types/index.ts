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

// One run of a recurring project (e.g. the 2nd conference). Transactions aren't tagged with a
// round — each belongs to the latest round whose startDate is on or before its date (see
// lib/utils/projectRounds.ts), so a new round only needs a name and a start date.
export interface ProjectRound {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD, same format as Transaction.date
}

export interface ProjectData {
  income: Record<string, YearTransactions>;
  expenses: Record<string, YearTransactions>;
  createdAt?: string;
  createdYear?: number;
  // Optional — only projects that run in rounds (like the conference fund) have any.
  rounds?: ProjectRound[];
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
