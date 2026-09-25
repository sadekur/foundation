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

// Cursor is a serializable createdAt ISO string (not a DocumentSnapshot) so the same function
// works identically whether called from a server component or the browser.
export const getGalleryItems = async ({
  afterCreatedAt,
  pageSize = GALLERY_PAGE_SIZE,
}: GetGalleryItemsOptions = {}): Promise<GalleryItemsResult> => {
  try {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc"), limit(pageSize)];
    if (afterCreatedAt) {
      constraints.push(startAfter(afterCreatedAt));
    }

    const snapshot = await getDocs(query(collection(db, "gallery"), ...constraints));
    const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as GalleryItem);
    const nextCursor = items.length === pageSize ? items[items.length - 1].createdAt : null;

    return { items, nextCursor };
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
