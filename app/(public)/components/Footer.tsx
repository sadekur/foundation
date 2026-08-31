"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/siteConfig";

export const Footer = () => {
  const { language } = useLanguage();
  const dictionary = getDictionary(language);

  return (
    <footer className="bg-emerald-950 pattern-lattice-light mt-16 text-emerald-100">
      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-amber-400/40">
              <Image src="/logo192.png" alt="As-Salsabil Foundation" fill sizes="40px" className="object-cover" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{dictionary.nav.brand}</p>
              <p className="text-xs text-emerald-300 mt-1 max-w-xs">{dictionary.footer.tagline}</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs xs:text-sm">
            <Link href="/" className="text-emerald-200 hover:text-amber-300 transition-colors">
              {dictionary.nav.home}
            </Link>
            <Link href="/about" className="text-emerald-200 hover:text-amber-300 transition-colors">
              {dictionary.nav.about}
            </Link>
            <Link href="/projects" className="text-emerald-200 hover:text-amber-300 transition-colors">
              {dictionary.nav.projects}
            </Link>
            <Link href="/contact" className="text-emerald-200 hover:text-amber-300 transition-colors">
              {dictionary.nav.contact}
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-emerald-800 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 text-xs text-emerald-300">
          <span>
            {siteConfig.email} &middot; {siteConfig.phones.join(" / ")}
          </span>
          <span className="text-emerald-400">
            &copy; {new Date().getFullYear()} {dictionary.nav.brand}. {dictionary.footer.rights}
          </span>
        </div>
      </div>
    </footer>
  );
};
