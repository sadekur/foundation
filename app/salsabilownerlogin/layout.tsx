import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

// Auth-gated client page — never statically prerender it at build time
// (Firebase Auth requires real NEXT_PUBLIC_FIREBASE_* env vars to initialize).
export const dynamic = "force-dynamic";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
