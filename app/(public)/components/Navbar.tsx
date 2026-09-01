"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LanguageToggle } from "./LanguageToggle";

const NAV_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/projects", key: "projects" as const },
  { href: "/activities", key: "activities" as const },
  { href: "/contact", key: "contact" as const },
];

export const Navbar = () => {
  const { language } = useLanguage();
  const dictionary = getDictionary(language);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-emerald-950 sticky top-0 z-50 border-b border-amber-500/20 shadow-md">
      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 xs:h-18">
          <Link href="/" className="flex items-center gap-2 group min-w-0">
            <span className="flex-shrink-0 relative w-8 h-8 xs:w-10 xs:h-10 rounded-full overflow-hidden ring-1 ring-amber-400/40">
              <Image src="/logo192.png" alt="As-Salsabil Foundation" fill sizes="40px" className="object-cover" priority />
            </span>
            <span className="text-base xs:text-lg sm:text-xl font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
              {dictionary.nav.brand}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors ${
                    isActive ? "text-amber-300" : "text-emerald-100 hover:text-amber-300"
                  }`}
                >
                  {dictionary.nav[link.key]}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </Link>
              );
            })}
            <LanguageToggle />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-md text-emerald-100 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden border-t border-emerald-800 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-amber-300 bg-emerald-900" : "text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  {dictionary.nav[link.key]}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
