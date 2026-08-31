"use client";

import Link from "next/link";
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
  { href: "/contact", key: "contact" as const },
];

export const Navbar = () => {
  const { language } = useLanguage();
  const dictionary = getDictionary(language);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg xs:text-xl sm:text-2xl font-bold text-indigo-800 truncate">
            {dictionary.nav.brand}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-indigo-700" : "text-gray-600 hover:text-indigo-700"
                  }`}
                >
                  {dictionary.nav[link.key]}
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
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-indigo-700 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"
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
