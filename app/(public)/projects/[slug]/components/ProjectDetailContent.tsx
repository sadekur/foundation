"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Users,
  Wallet,
  MapPin,
  Clock,
  ImageIcon,
  BarChart3,
  HandCoins,
  GraduationCap,
  BookOpenText,
  Library,
  Droplet,
  Sprout,
  HeartPulse,
  Landmark,
  Home,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectMedia, projectBanners, PROJECT_CATEGORY_SLUGS } from "@/lib/siteConfig";
import { SectionDivider } from "../../../components/SectionDivider";
import { FadeIn } from "../../../components/FadeIn";

// Same order as dictionaries.ts's `projects.categories` / siteConfig's `projectMedia`.
const CATEGORY_ICONS = [
  GraduationCap,
  BookOpenText,
  Library,
  HandCoins,
  Users,
  Droplet,
  Sprout,
  HeartPulse,
  Landmark,
  Home,
];

interface ProjectDetailContentProps {
  slug: string;
}

export const ProjectDetailContent = ({ slug }: ProjectDetailContentProps) => {
  const { language } = useLanguage();
  const { projects, projectDetail } = getDictionary(language);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const index = PROJECT_CATEGORY_SLUGS.findIndex((s) => s === slug);
  const category = projects.categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl mx-auto px-3 xs:px-4 py-16 xs:py-24 text-center">
        <h1 className="text-xl xs:text-2xl font-bold text-emerald-950">{projectDetail.notFoundTitle}</h1>
        <p className="mt-3 text-sm xs:text-base text-gray-600">{projectDetail.notFoundBody}</p>
        <Link
          href="/projects"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft size={16} />
          {projectDetail.backToProjects}
        </Link>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[index] ?? HandCoins;
  const media = projectMedia[index] ?? { image: null, video: null };
  const banner = projectBanners[index] ?? null;

  return (
    <div>
      <div className="relative bg-emerald-950 overflow-hidden">
        {banner ? (
          <>
            <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/75 to-emerald-950/45" />
          </>
        ) : (
          <div className="absolute inset-0 pattern-lattice-light" />
        )}
        <div className="relative w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14">
          <FadeIn>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-emerald-200 hover:text-white transition-colors"
            >
              <ArrowLeft size={15} />
              {projectDetail.backToProjects}
            </Link>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 rounded-full bg-white/10 text-amber-400 flex-shrink-0">
                <Icon size={26} />
              </span>
              <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white">{category.title}</h1>
            </div>
            <SectionDivider className="mt-5 mb-5" />
            <p className="text-sm xs:text-base text-emerald-100 leading-relaxed max-w-3xl">{category.blurb}</p>
          </FadeIn>
        </div>
      </div>

      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 xs:gap-8">
          <FadeIn className="lg:col-span-3">
            <h2 className="text-lg xs:text-xl font-bold text-emerald-950 mb-4">{projectDetail.descriptionTitle}</h2>
            <p className="text-sm xs:text-base text-gray-700 leading-relaxed">{category.description}</p>
          </FadeIn>

          <FadeIn delayMs={100} className="lg:col-span-2">
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-400">
                <h3 className="text-sm font-semibold text-emerald-950 mb-3">{projectDetail.objectivesTitle}</h3>
                <ul className="space-y-2">
                  {category.objectives.map((objective) => (
                    <li key={objective} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                      <Check size={14} className="mt-1 flex-shrink-0 text-amber-500" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-400">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-950">{projectDetail.audienceTitle}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.targetAudience}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-400">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                    <Wallet size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-emerald-950 mb-2">{projectDetail.budgetTitle}</h3>
                    <ul className="space-y-1.5">
                      {category.budgetItems.map((budgetItem) => (
                        <li key={budgetItem} className="text-sm text-gray-600">
                          {budgetItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-950">{projectDetail.areaTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">{category.area}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-950">{projectDetail.durationTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">{category.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delayMs={100}>
          <div className="mt-10 xs:mt-12 rounded-2xl bg-emerald-950 pattern-lattice-light text-center px-5 xs:px-8 py-8 xs:py-10">
            <h2 className="text-lg xs:text-xl font-bold text-white">{projects.ctaTitle}</h2>
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

        <FadeIn delayMs={150}>
          <div className="mt-10 xs:mt-12 text-center">
            <h2 className="text-xl xs:text-2xl font-bold text-emerald-950">{projectDetail.galleryTitle}</h2>
            <SectionDivider className="mt-4 mb-6" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 aspect-[16/9] xs:aspect-[21/9] flex flex-col items-center justify-center gap-2 pattern-lattice-light">
            <ImageIcon size={40} className="text-emerald-300" />
            <p className="text-sm text-emerald-800/70">{projectDetail.galleryComingSoon}</p>
          </div>
        </FadeIn>

        <FadeIn delayMs={150}>
          <div className="mt-10 xs:mt-12 text-center">
            <h2 className="text-xl xs:text-2xl font-bold text-emerald-950">{projectDetail.impactTitle}</h2>
            <SectionDivider className="mt-4 mb-6" />
          </div>
          <div className="rounded-2xl bg-gray-50 border border-gray-200 py-10 xs:py-14 flex flex-col items-center justify-center gap-2">
            <BarChart3 size={36} className="text-gray-300" />
            <p className="text-sm text-gray-500">{projectDetail.impactComingSoon}</p>
          </div>
        </FadeIn>

        <FadeIn delayMs={150}>
          <div className="mt-10 xs:mt-12">
            <h2 className="text-xl xs:text-2xl font-bold text-emerald-950 text-center">{projectDetail.faqTitle}</h2>
            <SectionDivider className="mt-4 mb-6" />
            <div className="max-w-2xl mx-auto space-y-3">
              {category.faq.map((item, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div key={item.question} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm xs:text-base font-semibold text-emerald-950">{item.question}</span>
                      <ChevronDown
                        size={18}
                        className={`flex-shrink-0 text-emerald-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <FadeIn delayMs={150}>
          <div className="mt-10 xs:mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-300 text-emerald-800 text-sm font-semibold hover:bg-emerald-50 transition-colors"
            >
              {projectDetail.backToProjects}
              <ArrowRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
