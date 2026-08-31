"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/siteConfig";

export const Footer = () => {
  const { language } = useLanguage();
  const dictionary = getDictionary(language);

  return (
    <footer className="bg-white shadow-inner border-t mt-8">
      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">{dictionary.nav.brand}</p>
            <p className="text-xs text-gray-500 mt-1">{dictionary.footer.tagline}</p>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs xs:text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-700">
              {dictionary.nav.home}
            </Link>
            <Link href="/about" className="hover:text-indigo-700">
              {dictionary.nav.about}
            </Link>
            <Link href="/projects" className="hover:text-indigo-700">
              {dictionary.nav.projects}
            </Link>
            <Link href="/contact" className="hover:text-indigo-700">
              {dictionary.nav.contact}
            </Link>
          </nav>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
          {siteConfig.email} &middot; {siteConfig.phones.join(" / ")}
        </div>

        <div className="mt-2 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} {dictionary.nav.brand}. {dictionary.footer.rights}
        </div>
      </div>
    </footer>
  );
};
