"use client";

import Link from "next/link";
import { HandCoins, BookOpenText, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/siteConfig";
import { SectionDivider } from "./SectionDivider";
import { FadeIn } from "./FadeIn";

const PILLAR_ICONS = [HandCoins, BookOpenText, HeartHandshake];

export const HomeContent = () => {
  const { language } = useLanguage();
  const dictionary = getDictionary(language);
  const { home } = dictionary;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 pattern-lattice-light">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-14 xs:py-20 sm:py-28 text-center">
          <FadeIn>
            <span className="inline-block text-xs xs:text-sm font-semibold tracking-wide text-emerald-950 bg-amber-400 rounded-full px-3 py-1 mb-6">
              {home.heroEyebrow}
            </span>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {home.heroTitle}
            </h1>
            <p className="mt-4 text-sm xs:text-base sm:text-lg text-emerald-100 max-w-3xl mx-auto">
              {home.heroSubtitle}
            </p>
          </FadeIn>

          <FadeIn delayMs={150}>
            <div className="mt-10 max-w-2xl mx-auto rounded-2xl bg-emerald-950/40 border border-amber-400/20 p-6 xs:p-8 backdrop-blur-sm">
              <p dir="rtl" className="font-amiri text-lg xs:text-xl sm:text-2xl text-amber-200 leading-loose">
                {siteConfig.quranVerseArabic}
              </p>
              <SectionDivider className="my-4" />
              <p className="text-sm xs:text-base italic text-emerald-100">{home.heroQuote}</p>
              <cite className="block mt-2 text-xs xs:text-sm text-amber-300 not-italic">
                — {home.heroQuoteSource}
              </cite>
            </div>
          </FadeIn>

          <FadeIn delayMs={250}>
            <div className="mt-10 flex flex-col xs:flex-row justify-center gap-3">
              <Link
                href="/about"
                className="bg-amber-400 text-emerald-950 px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20"
              >
                {home.ctaAbout}
              </Link>
              <Link
                href="/projects"
                className="bg-emerald-900/60 text-white border border-emerald-700 px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-900 transition-colors"
              >
                {home.ctaProjects}
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-emerald-100 border border-emerald-700 px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-900/60 transition-colors"
              >
                {home.ctaContact}
              </Link>
            </div>
          </FadeIn>
        </div>

        <svg
          className="block w-full text-stone-50"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M0,32 C240,0 480,48 720,32 C960,16 1200,48 1440,16 L1440,48 L0,48 Z" />
        </svg>
      </section>

      <section className="bg-stone-50">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-12 xs:py-16">
          <FadeIn>
            <h2 className="text-xl xs:text-2xl font-bold text-emerald-950 mb-3">{home.introTitle}</h2>
            <p className="text-sm xs:text-base text-gray-700 leading-relaxed max-w-3xl">{home.introBody}</p>
          </FadeIn>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 xs:gap-6">
            {home.pillars.map((pillar, index) => {
              const Icon = PILLAR_ICONS[index] ?? HandCoins;
              return (
                <FadeIn key={pillar.title} delayMs={index * 120}>
                  <div className="h-full bg-white rounded-xl shadow-sm p-5 xs:p-6 border-t-4 border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-sm xs:text-base font-semibold text-emerald-950 mb-2">{pillar.title}</h3>
                    <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">{pillar.body}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
