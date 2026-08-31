"use client";

import { BookMarked, ShieldCheck, ScrollText } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SectionDivider } from "../../components/SectionDivider";
import { FadeIn } from "../../components/FadeIn";

const VALUE_ICONS = [BookMarked, ShieldCheck, ScrollText];

export const AboutContent = () => {
  const { language } = useLanguage();
  const { about } = getDictionary(language);

  return (
    <div>
      <div className="bg-emerald-950 pattern-lattice-light">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14 text-center">
          <FadeIn>
            <h1 className="text-2xl xs:text-3xl font-bold text-white">{about.title}</h1>
            <SectionDivider className="mt-4" />
          </FadeIn>
        </div>
      </div>

      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14">
        <FadeIn>
          <div className="space-y-4 max-w-3xl">
            {about.intro.map((paragraph, index) => (
              <p key={index} className="text-sm xs:text-base text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>

        <FadeIn delayMs={100}>
          <div className="mt-10 bg-emerald-50 border border-emerald-200 rounded-xl p-5 xs:p-6 max-w-3xl relative overflow-hidden">
            <span className="absolute -top-2 -right-1 text-6xl text-emerald-200 font-amiri select-none" aria-hidden="true">
              &rdquo;
            </span>
            <h2 className="text-lg xs:text-xl font-semibold text-emerald-900 mb-2">{about.missionTitle}</h2>
            <p className="text-sm xs:text-base text-emerald-800 leading-relaxed">{about.missionBody}</p>
          </div>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 xs:gap-6">
          {about.values.map((value, index) => {
            const Icon = VALUE_ICONS[index] ?? BookMarked;
            return (
              <FadeIn key={value.title} delayMs={index * 120}>
                <div className="h-full bg-white rounded-xl shadow-sm p-5 xs:p-6 border-t-4 border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-sm xs:text-base font-semibold text-emerald-950 mb-2">{value.title}</h3>
                  <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">{value.body}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
};
