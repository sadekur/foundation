"use client";

import { Loader } from "lucide-react";
import OverviewScreen from "./components/OverviewScreen";
import { useFoundationProjects } from "./components/useFoundationProjects";

export default function OverviewPage() {
  const { projects, loadFailed } = useFoundationProjects();

  if (loadFailed) {
    return <p className="py-16 text-center text-sm text-red-600">Couldn&apos;t load the data. Please refresh the page.</p>;
  }
  if (!projects) {
    return <Loader className="animate-spin h-8 w-8 text-emerald-600 mx-auto my-16" />;
  }
  return <OverviewScreen projects={projects} />;
}
