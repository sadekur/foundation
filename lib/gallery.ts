// Reads gallery items from the "gallery" Firestore collection (public read, admin write —
// see the Firestore security rules in the console). Uses the client Firestore SDK directly,
// from both server and browser: unlike the Blogger/YouTube integrations, Firestore's client
// SDK has no CORS restriction and holds no secret, so no API route/proxy is needed to read it.
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type { GalleryItem } from "@/types";

export const GALLERY_PAGE_SIZE = 12;

interface GetGalleryItemsOptions {
  afterCreatedAt?: string;
  pageSize?: number;
}

export interface GalleryItemsResult {
  items: GalleryItem[];
  nextCursor: string | null;
}

// Cap on raw Firestore pages read per call while skipping hidden items, so a long run of
// hidden media can't turn one "Load More" into an unbounded read loop.
const MAX_PAGES_PER_CALL = 5;

// The sitewide gallery (every item not flagged hideFromMainGallery). Cursor is a serializable
// createdAt ISO string (not a DocumentSnapshot) so the same function works identically whether
// called from a server component or the browser.
//
// Hidden items are skipped here, not in the query: where("hideFromMainGallery", "!=", true)
// would also drop every doc that lacks the field (i.e. almost all of them — Firestore's != never
// matches missing fields), and a where + orderBy on different fields would need a composite
// index anyway. So it reads raw pages and keeps going until it has pageSize visible items, the
// collection runs out, or MAX_PAGES_PER_CALL is hit. The cursor tracks the last *raw* doc read,
// so hidden items are never re-read or double-counted by the next call.
export const getGalleryItems = async ({
  afterCreatedAt,
  pageSize = GALLERY_PAGE_SIZE,
}: GetGalleryItemsOptions = {}): Promise<GalleryItemsResult> => {
  try {
    const items: GalleryItem[] = [];
    let cursor = afterCreatedAt;
    let exhausted = false;

    for (let page = 0; page < MAX_PAGES_PER_CALL && items.length < pageSize && !exhausted; page++) {
      const constraints: QueryConstraint[] = [orderBy("createdAt", "desc"), limit(pageSize)];
      if (cursor) constraints.push(startAfter(cursor));

      const snapshot = await getDocs(query(collection(db, "gallery"), ...constraints));
      const raw = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as GalleryItem);
      exhausted = raw.length < pageSize;

      for (const item of raw) {
        cursor = item.createdAt;
        if (item.hideFromMainGallery) continue;
        items.push(item);
        // Stop mid-page once full, leaving the cursor on this item so the rest of the raw page
        // is picked up by the next call rather than skipped.
        if (items.length === pageSize) break;
      }
      if (items.length === pageSize) {
        const lastRaw = raw[raw.length - 1];
        if (lastRaw && cursor !== lastRaw.createdAt) exhausted = false;
      }
    }

    return { items, nextCursor: exhausted ? null : (cursor ?? null) };
  } catch (error) {
    console.error("Failed to load gallery items:", error);
    return { items: [], nextCursor: null };
  }
};

// An item's project tags, whichever shape it was saved in (new projectSlugs array, or the
// legacy single projectSlug string).
export const getGalleryItemProjectSlugs = (item: Pick<GalleryItem, "projectSlugs" | "projectSlug">): string[] =>
  item.projectSlugs ?? (item.projectSlug ? [item.projectSlug] : []);

// All of one project's media, newest first, unpaginated. Runs two queries — the current
// projectSlugs array and the legacy projectSlug string — and merges them, so items tagged
// before multi-project support still show up without a data migration. Sorts here rather than
// adding orderBy("createdAt") to the queries: where + orderBy on different fields requires a
// Firestore composite index, and a single project's media stays small enough that loading it
// in one go is fine.
export const getProjectGalleryItems = async (projectSlug: string): Promise<GalleryItem[]> => {
  try {
    const gallery = collection(db, "gallery");
    const [current, legacy] = await Promise.all([
      getDocs(query(gallery, where("projectSlugs", "array-contains", projectSlug))),
      getDocs(query(gallery, where("projectSlug", "==", projectSlug))),
    ]);
    const byId = new Map<string, GalleryItem>();
    for (const docSnap of [...current.docs, ...legacy.docs]) {
      byId.set(docSnap.id, { id: docSnap.id, ...docSnap.data() } as GalleryItem);
    }
    return Array.from(byId.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    console.error("Failed to load project gallery items:", error);
    return [];
  }
};
