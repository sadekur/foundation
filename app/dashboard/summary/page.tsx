"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Loader } from "lucide-react";
import { db } from "@/lib/firebase";
import type { Projects } from "@/types";
import YearlySummaryScreen from "../components/YearlySummaryScreen";

export default function SummaryPage() {
  const [projects, setProjects] = useState<Projects | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    return onSnapshot(
      doc(db, "foundations", "as-salsabil"),
      (docSnap) => {
        if (!docSnap.exists() && docSnap.metadata.fromCache) return;
        setProjects(docSnap.data()?.projects ?? {});
      },
      () => setLoadFailed(true)
    );
  }, []);

  if (loadFailed) {
    return <p className="py-16 text-center text-sm text-red-600">Couldn&apos;t load the data. Please refresh the page.</p>;
  }
  if (!projects) {
    return <Loader className="animate-spin h-8 w-8 text-emerald-600 mx-auto my-16" />;
  }
  return <YearlySummaryScreen projects={projects} />;
}
