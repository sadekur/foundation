"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";

// How far down the page (px) the visitor must scroll before the button appears.
const SHOW_AFTER_PX = 400;

const scrollToTop = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
};

export const ScrollToTopButton = () => {
  const { language } = useLanguage();
  const label = getDictionary(language).footer.backToTop;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-400 text-emerald-950 shadow-lg shadow-emerald-950/30 ring-2 ring-emerald-950/10 hover:bg-amber-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
};
