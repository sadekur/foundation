"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Projects } from "@/types";

// Read-only live view of the foundation's projects. `projects` stays null until real data arrives.
export const useFoundationProjects = () => {
  const [projects, setProjects] = useState<Projects | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    return onSnapshot(
      doc(db, "foundations", "as-salsabil"),
      (docSnap) => {
        // Offline, a missing doc only means "not in the cache", not that it doesn't exist.
        if (!docSnap.exists() && docSnap.metadata.fromCache) return;
        setProjects(docSnap.data()?.projects ?? {});
      },
      () => setLoadFailed(true)
    );
  }, []);

  return { projects, loadFailed };
};
