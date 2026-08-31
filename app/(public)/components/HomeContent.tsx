"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const HomeContent = () => {
  const { language } = useLanguage();
  const dictionary = getDictionary(language);
  const { home } = dictionary;

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-12 xs:py-16 sm:py-20 text-center">
          <span className="inline-block text-xs xs:text-sm font-semibold tracking-wide text-indigo-700 bg-indigo-100 rounded-full px-3 py-1 mb-4">
            {home.heroEyebrow}
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-900 leading-tight">
            {home.heroTitle}
          </h1>
          <p className="mt-4 text-sm xs:text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
            {home.heroSubtitle}
          </p>

          <blockquote className="mt-8 max-w-2xl mx-auto border-l-4 border-indigo-400 pl-4 text-left">
            <p className="text-sm xs:text-base italic text-gray-700">{home.heroQuote}</p>
            <cite className="block mt-2 text-xs xs:text-sm text-indigo-700 not-italic">
              — {home.heroQuoteSource}
            </cite>
          </blockquote>

          <div className="mt-8 flex flex-col xs:flex-row justify-center gap-3">
            <Link
              href="/about"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {home.ctaAbout}
            </Link>
            <Link
              href="/projects"
              className="bg-white text-indigo-700 border border-indigo-300 px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              {home.ctaProjects}
            </Link>
            <Link
              href="/contact"
              className="bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {home.ctaContact}
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-12 xs:py-16">
        <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-3">{home.introTitle}</h2>
        <p className="text-sm xs:text-base text-gray-700 leading-relaxed max-w-3xl">{home.introBody}</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 xs:gap-6">
          {home.pillars.map((pillar) => (
            <div key={pillar.title} className="bg-white rounded-lg shadow-sm p-4 xs:p-6 border-t-4 border-indigo-500">
              <h3 className="text-sm xs:text-base font-semibold text-gray-900 mb-2">{pillar.title}</h3>
              <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
