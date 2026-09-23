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
  // Slug from siteConfig's PROJECT_CATEGORY_SLUGS — also shows the item on that project's
  // detail page. The sitewide /projects gallery shows every item regardless; absent = general
  // media that appears on no project page.
  projectSlug?: string;
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
