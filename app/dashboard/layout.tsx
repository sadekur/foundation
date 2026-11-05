import type { Metadata } from "next";
import { AdminShell } from "./components/AdminShell";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

// Auth-gated client pages — never statically prerender them at build time
// (Firebase Auth requires real NEXT_PUBLIC_FIREBASE_* env vars to initialize).
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
