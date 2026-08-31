"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const ProjectsContent = () => {
  const { language } = useLanguage();
  const { projects } = getDictionary(language);

  return (
    <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14">
      <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-3">{projects.title}</h1>
      <p className="text-sm xs:text-base text-gray-700 leading-relaxed max-w-3xl mb-8">{projects.intro}</p>

      <div className="space-y-6">
        {projects.categories.map((category) => (
          <div key={category.title} className="bg-white rounded-lg shadow-sm p-5 xs:p-6">
            <h2 className="text-lg xs:text-xl font-semibold text-indigo-800 mb-2">{category.title}</h2>
            {category.intro && (
              <p className="text-sm xs:text-base text-gray-700 leading-relaxed mb-3">{category.intro}</p>
            )}
            {category.items.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 list-disc list-inside">
                {category.items.map((item) => (
                  <li key={item} className="text-xs xs:text-sm text-gray-600 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs xs:text-sm text-gray-500 italic max-w-3xl">{projects.closingNote}</p>
    </div>
  );
};
