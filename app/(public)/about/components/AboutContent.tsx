"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  BookOpenText,
  Check,
  Droplets,
  Eye,
  FileDown,
  HandCoins,
  HeartHandshake,
  Landmark,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/siteConfig";
import { SectionDivider } from "../../components/SectionDivider";
import { FadeIn } from "../../components/FadeIn";

const VALUE_ICONS = [BookMarked, ShieldCheck, ScrollText];
// Same order as `about.projects`.
const PROJECT_ICONS = [HandCoins, BookOpenText, Landmark, Droplets, HeartHandshake];

const CONTAINER_CLASS =
  "w-full max-w-none xs:max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8";
const SECTION_TITLE_CLASS = "text-lg xs:text-xl sm:text-2xl font-bold text-emerald-950";

export const AboutContent = () => {
  const { language } = useLanguage();
  const { about } = getDictionary(language);
  const { brochure } = siteConfig;

  return (
    <div>
      <div className="bg-emerald-950 pattern-lattice-light">
        <div className={`${CONTAINER_CLASS} py-10 xs:py-14 text-center`}>
          <FadeIn>
            <h1 className="text-2xl xs:text-3xl font-bold text-white">{about.title}</h1>
            <SectionDivider className="mt-4" />
          </FadeIn>
        </div>
      </div>

      <div className={`${CONTAINER_CLASS} py-10 xs:py-14`}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-8 lg:gap-12 items-start">
          <div className="min-w-0">
            <FadeIn>
              <h2 className={`${SECTION_TITLE_CLASS} mb-4`}>{about.introTitle}</h2>
              <div className="space-y-4">
                {about.intro.map((paragraph, index) => (
                  <p key={index} className="text-sm xs:text-base text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </FadeIn>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
              <FadeIn delayMs={100}>
                <div className="h-full bg-emerald-50 border border-emerald-200 rounded-xl p-5 xs:p-6">
                  <h2 className="text-base xs:text-lg font-semibold text-emerald-900 mb-2">{about.missionTitle}</h2>
                  <p className="text-sm xs:text-base text-emerald-800 leading-relaxed">{about.missionBody}</p>
                </div>
              </FadeIn>
              <FadeIn delayMs={200}>
                <div className="h-full bg-amber-50 border border-amber-200 rounded-xl p-5 xs:p-6">
                  <h2 className="text-base xs:text-lg font-semibold text-emerald-900 mb-2">{about.nameTitle}</h2>
                  <p className="text-sm xs:text-base text-gray-700 leading-relaxed">{about.nameBody}</p>
                </div>
              </FadeIn>
            </div>
          </div>

          <FadeIn delayMs={150}>
            <aside className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 xs:p-5 max-w-sm mx-auto lg:max-w-none">
              <h2 className="text-base xs:text-lg font-semibold text-emerald-950">{about.brochureTitle}</h2>
              <p className="mt-1 mb-4 text-xs xs:text-sm text-gray-600 leading-relaxed">{about.brochureBody}</p>
              <a
                href={brochure.pdf}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={about.brochureView}
                className="block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <Image
                  src={brochure.preview}
                  alt={about.brochureTitle}
                  width={brochure.previewWidth}
                  height={brochure.previewHeight}
                  sizes="(min-width: 1024px) 18rem, 22rem"
                  className="w-full h-auto"
                />
              </a>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={brochure.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 border border-emerald-700 text-emerald-800 px-3 py-2 rounded-lg text-xs xs:text-sm font-medium hover:bg-emerald-50 transition-colors"
                >
                  <Eye size={16} />
                  {about.brochureView}
                </a>
                <a
                  href={brochure.pdf}
                  download="As-Salsabil-Foundation.pdf"
                  className="inline-flex items-center justify-center gap-1.5 bg-emerald-800 text-white px-3 py-2 rounded-lg text-xs xs:text-sm font-medium hover:bg-emerald-900 transition-colors"
                >
                  <FileDown size={16} />
                  {about.brochureDownload}
                </a>
              </div>
            </aside>
          </FadeIn>
        </div>

        <FadeIn>
          <h2 className={`${SECTION_TITLE_CLASS} mt-12 xs:mt-14 mb-5`}>{about.valuesTitle}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 xs:gap-6">
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

        <FadeIn>
          <h2 className={`${SECTION_TITLE_CLASS} mt-12 xs:mt-14 mb-5`}>{about.projectsTitle}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
          {about.projects.map((project, index) => {
            const Icon = PROJECT_ICONS[index] ?? HandCoins;
            const isLast = index === about.projects.length - 1;
            return (
              <FadeIn
                key={project.title}
                delayMs={(index % 3) * 100}
                className={isLast ? "sm:col-span-2 lg:col-span-2" : ""}
              >
                <div className="h-full bg-white rounded-xl shadow-sm border border-emerald-100 p-5 xs:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm xs:text-base font-semibold text-emerald-950">{project.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {project.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-xs xs:text-sm text-gray-600 leading-relaxed">
                        <Check size={15} className="shrink-0 mt-0.5 text-amber-500" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            );
          })}
        </div>
        <FadeIn>
          <p className="mt-5 text-xs xs:text-sm italic text-gray-600 leading-relaxed">{about.projectsNote}</p>
        </FadeIn>

        <FadeIn>
          <section className="mt-12 xs:mt-14 rounded-2xl bg-emerald-950 pattern-lattice-light px-5 xs:px-8 py-8 xs:py-10 text-center">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-white">{about.supportTitle}</h2>
            <SectionDivider className="my-4" />
            <div className="max-w-3xl mx-auto space-y-3">
              {about.supportBody.map((paragraph, index) => (
                <p key={index} className="text-sm xs:text-base text-emerald-100 leading-relaxed">
                  {paragraph}
                </p>
              ))}
              <p className="text-sm xs:text-base italic text-amber-200 leading-relaxed">{about.supportDua}</p>
            </div>
            <div className="mt-6 flex flex-col xs:flex-row justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 text-emerald-950 px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-300 transition-colors"
              >
                {about.ctaProjects}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-transparent text-emerald-100 border border-emerald-700 px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-900/60 transition-colors"
              >
                {about.ctaContact}
              </Link>
            </div>
            <p className="mt-6 text-xs xs:text-sm text-amber-300">{about.supportTagline}</p>
          </section>
        </FadeIn>
      </div>
    </div>
  );
};
