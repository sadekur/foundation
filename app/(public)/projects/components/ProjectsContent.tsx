"use client";

import { HandCoins, BookOpenText, HeartHandshake, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SectionDivider } from "../../components/SectionDivider";
import { FadeIn } from "../../components/FadeIn";

const CATEGORY_ICONS = [HandCoins, BookOpenText, HeartHandshake];

export const ProjectsContent = () => {
  const { language } = useLanguage();
  const { projects } = getDictionary(language);

  return (
    <div>
      <div className="bg-emerald-950 pattern-lattice-light">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14 text-center">
          <FadeIn>
            <h1 className="text-2xl xs:text-3xl font-bold text-white">{projects.title}</h1>
            <SectionDivider className="mt-4 mb-5" />
            <p className="text-sm xs:text-base text-emerald-100 leading-relaxed max-w-3xl mx-auto">
              {projects.intro}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14">
        <div className="space-y-6">
          {projects.categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[index] ?? HandCoins;
            return (
              <FadeIn key={category.title} delayMs={index * 120}>
                <div className="bg-white rounded-xl shadow-sm p-5 xs:p-6 border-l-4 border-amber-400 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-base xs:text-lg font-semibold text-emerald-900">{category.title}</h2>
                  </div>
                  {category.intro && (
                    <p className="text-sm xs:text-base text-gray-700 leading-relaxed mb-3">{category.intro}</p>
                  )}
                  {category.items.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                      {category.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs xs:text-sm text-gray-600 leading-relaxed">
                          <Check size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn>
          <p className="mt-8 text-xs xs:text-sm text-gray-500 italic max-w-3xl">{projects.closingNote}</p>
        </FadeIn>
      </div>
    </div>
  );
};
