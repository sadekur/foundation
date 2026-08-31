"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center gap-1 rounded-full border border-emerald-700 bg-emerald-900/60 px-3 py-1.5 text-sm font-medium
                 hover:border-amber-400/60 transition-colors
                 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-60"
      aria-label="Toggle site language"
    >
      <span className={language === "bn" ? "font-semibold text-amber-300" : "text-emerald-300"}>বাংলা</span>
      <span className="text-emerald-600">/</span>
      <span className={language === "en" ? "font-semibold text-amber-300" : "text-emerald-300"}>EN</span>
    </button>
  );
};
