"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const AboutContent = () => {
  const { language } = useLanguage();
  const { about } = getDictionary(language);

  return (
    <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14">
      <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-6">{about.title}</h1>

      <div className="space-y-4 max-w-3xl">
        {about.intro.map((paragraph, index) => (
          <p key={index} className="text-sm xs:text-base text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-5 xs:p-6 max-w-3xl">
        <h2 className="text-lg xs:text-xl font-semibold text-blue-900 mb-2">{about.missionTitle}</h2>
        <p className="text-sm xs:text-base text-blue-800 leading-relaxed">{about.missionBody}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 xs:gap-6">
        {about.values.map((value) => (
          <div key={value.title} className="bg-white rounded-lg shadow-sm p-4 xs:p-6 border-t-4 border-indigo-500">
            <h3 className="text-sm xs:text-base font-semibold text-gray-900 mb-2">{value.title}</h3>
            <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">{value.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
