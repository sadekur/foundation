"use client";

import { useAdminUser } from "../components/AdminShell";
import GalleryScreen from "../components/GalleryScreen";

export default function GalleryPage() {
  return <GalleryScreen user={useAdminUser()} />;
}
