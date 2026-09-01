// Reads gallery items from the "gallery" Firestore collection (public read, admin write —
// see the Firestore security rules in the console). Uses the client Firestore SDK directly,
// from both server and browser: unlike the Blogger/YouTube integrations, Firestore's client
// SDK has no CORS restriction and holds no secret, so no API route/proxy is needed to read it.
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
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
    const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];
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

// Unused import guard note: `where` is imported for potential future filtering (e.g. by type)
// but not currently used — kept out to avoid an unused-import lint error.
void where;
