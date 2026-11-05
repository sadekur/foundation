"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { BarChart3, ExternalLink, Images, LogOut, Menu, Wallet, X, type LucideIcon } from "lucide-react";
import { auth } from "@/lib/firebase";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "./Footer";

interface NavGroup {
  label: string;
  items: { href: string; label: string; icon: LucideIcon }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Finance",
    items: [
      { href: "/dashboard/finance", label: "Income & Expenses", icon: Wallet },
      { href: "/dashboard/summary", label: "Yearly Summary", icon: BarChart3 },
    ],
  },
  {
    label: "Website",
    items: [{ href: "/dashboard/gallery", label: "Gallery", icon: Images }],
  },
];

const AdminUserContext = createContext<User | null>(null);

export const useAdminUser = () => {
  const user = useContext(AdminUserContext);
  if (!user) throw new Error("useAdminUser must be used inside AdminShell");
  return user;
};

const Brand = () => (
  <span className="flex items-center gap-2.5 min-w-0">
    <Image src="/logo192.png" alt="" width={36} height={36} className="rounded-full shrink-0" />
    <span className="min-w-0">
      <span className="block text-sm font-bold text-white truncate">As-Salsabil Foundation</span>
      <span className="block text-xs text-emerald-300">Admin Panel</span>
    </span>
  </span>
);

// The admin chrome for every /dashboard route: gates on auth, then renders a fixed sidebar on
// large screens and a slide-in menu behind the top bar on smaller ones.
export const AdminShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!checkingAuth && !user) {
      router.replace("/salsabilownerlogin");
    }
  }, [checkingAuth, user, router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert("Logout failed: " + (error as Error).message);
    }
  };

  if (checkingAuth || !user) {
    return <LoadingScreen />;
  }

  return (
    <AdminUserContext.Provider value={user}>
      <div className="min-h-screen bg-gray-50">
        <header className="lg:hidden sticky top-0 z-30 h-14 flex items-center justify-between gap-3 bg-emerald-950 px-3 xs:px-4">
          <Brand />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg text-emerald-100 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={22} />
          </button>
        </header>

        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMenuOpen(false)} aria-hidden="true" />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 max-w-[85vw] flex flex-col bg-emerald-950 transition-[transform,visibility] duration-200 lg:visible lg:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full invisible"
          }`}
        >
          <div className="h-14 lg:h-16 flex items-center justify-between gap-2 px-4 border-b border-emerald-900">
            <Brand />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-emerald-100 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Admin">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">{group.label}</p>
                <ul className="space-y-1">
                  {group.items.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                            active ? "bg-amber-400 text-emerald-950" : "text-emerald-100 hover:bg-emerald-900"
                          }`}
                        >
                          <Icon size={18} className="shrink-0" />
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-emerald-900 space-y-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <ExternalLink size={18} className="shrink-0" />
              View Website
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <LogOut size={18} className="shrink-0" />
              Logout
            </button>
            <p className="px-3 pt-1 text-xs text-emerald-400 truncate" title={user.email ?? undefined}>
              {user.email}
            </p>
          </div>
        </aside>

        <div className="lg:pl-64 min-h-screen flex flex-col">
          <main className="flex-1 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </AdminUserContext.Provider>
  );
};
