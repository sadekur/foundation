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

// Website analytics — one bucket per Bangladesh-time day (`analytics_daily/{YYYY-MM-DD}`) and one
// per month (`analytics_monthly/{YYYY-MM}`), written by lib/analyticsStore.ts. Counts only, no
// per-visitor records: nothing personal (IP, user agent, cookies) is ever stored.
export type AnalyticsBreakdown = "pages" | "sources" | "referrers" | "countries" | "cities" | "devices" | "browsers";

export interface AnalyticsPeriod {
  key: string; // "2026-11-15" or "2026-11"
  views: number; // every page view
  visits: number; // browser-tab sessions — the breakdowns below except `pages` count these
  visitors: number; // unique browsers within this one day / month
  // pages: page path -> views. sources: "Facebook", "Google", "Direct"... -> visits.
  // referrers: linking website host -> visits. countries: ISO code ("BD") -> visits.
  // cities: "Dhaka, BD" -> visits. devices: mobile/tablet/desktop -> visits. browsers -> visits.
  breakdowns: Record<AnalyticsBreakdown, Record<string, number>>;
}

export interface AnalyticsResponse {
  days: AnalyticsPeriod[]; // only days that had traffic, oldest first
  months: AnalyticsPeriod[]; // only months that had traffic, oldest first
}
