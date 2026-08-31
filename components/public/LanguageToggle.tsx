"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700
                 hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 transition-colors
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      aria-label="Toggle site language"
    >
      <span className={language === "bn" ? "font-semibold text-indigo-700" : "text-gray-400"}>বাংলা</span>
      <span className="text-gray-300">/</span>
      <span className={language === "en" ? "font-semibold text-indigo-700" : "text-gray-400"}>EN</span>
    </button>
  );
};
