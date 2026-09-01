"use client";

import Image from "next/image";
import Link from "next/link";
import { HandCoins, BookOpenText, HeartHandshake, Check, ImageIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectMedia } from "@/lib/siteConfig";
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
        <div className="space-y-8 xs:space-y-10">
          {projects.categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[index] ?? HandCoins;
            const media = projectMedia[index] ?? { image: null, video: null };
            const reversed = index % 2 === 1;

            return (
              <FadeIn key={category.title} delayMs={index * 100}>
                <div
                  className={`flex flex-col ${
                    reversed ? "lg:flex-row-reverse" : "lg:flex-row"
                  } items-stretch bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-emerald-100`}
                >
                  <div className="relative w-full lg:w-1/2 aspect-[4/3] sm:aspect-video lg:aspect-auto min-h-[220px] bg-gradient-to-br from-emerald-900 to-emerald-950">
                    {media.video ? (
                      <video
                        src={media.video}
                        poster={media.image ?? undefined}
                        controls
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : media.image ? (
                      <Image
                        src={media.image}
                        alt={category.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pattern-lattice-light">
                        <Icon size={48} className="text-emerald-100/30" />
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-100/70">
                          <ImageIcon size={12} />
                          {language === "bn" ? "শীঘ্রই ছবি/ভিডিও যুক্ত হবে" : "Photos/video coming soon"}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
                      <Icon size={16} className="text-emerald-700" />
                      <span className="text-xs font-bold text-emerald-900">0{index + 1}</span>
                    </div>
                  </div>

                  <div className="flex-1 p-5 xs:p-6 lg:p-8 flex flex-col justify-center">
                    <span className="block w-12 h-1 bg-amber-400 rounded-full mb-4" />
                    <h2 className="text-lg xs:text-xl lg:text-2xl font-bold text-emerald-950 mb-3">
                      {category.title}
                    </h2>
                    {category.intro && (
                      <p className="text-sm xs:text-base text-gray-700 leading-relaxed mb-4">{category.intro}</p>
                    )}
                    {category.items.length > 0 && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
                        {category.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs xs:text-sm text-gray-600 leading-relaxed"
                          >
                            <Check size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-full bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      {projects.supportCta}
                      <HeartHandshake size={16} />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn>
          <p className="mt-8 text-xs xs:text-sm text-gray-500 italic max-w-3xl">{projects.closingNote}</p>
        </FadeIn>

        <FadeIn delayMs={100}>
          <div className="mt-10 xs:mt-12 rounded-2xl bg-emerald-950 pattern-lattice-light text-center px-5 xs:px-8 py-10 xs:py-14">
            <h2 className="text-xl xs:text-2xl font-bold text-white">{projects.ctaTitle}</h2>
            <p className="mt-3 text-sm xs:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              {projects.ctaBody}
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-emerald-950 text-sm xs:text-base font-bold hover:bg-amber-400 transition-colors"
            >
              {projects.ctaButton}
              <HandCoins size={18} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
