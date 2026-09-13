"use client";

import Image from "next/image";
import Link from "next/link";
import {
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
  ArrowRight,
  Check,
  ImageIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectMedia } from "@/lib/siteConfig";
import type { GalleryItem } from "@/types";
import { SectionDivider } from "../../components/SectionDivider";
import { FadeIn } from "../../components/FadeIn";
import { GallerySection } from "./GallerySection";

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

interface ProjectsContentProps {
  initialGalleryItems: GalleryItem[];
  initialGalleryCursor: string | null;
}

export const ProjectsContent = ({ initialGalleryItems, initialGalleryCursor }: ProjectsContentProps) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6">
          {projects.categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[index] ?? HandCoins;
            const media = projectMedia[index] ?? { image: null, video: null };

            return (
              <FadeIn key={category.slug} delayMs={index * 75}>
                <Link
                  href={`/projects/${category.slug}`}
                  className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-emerald-100"
                >
                  <div className="relative w-full aspect-[4/3] sm:aspect-video bg-gradient-to-br from-emerald-900 to-emerald-950">
                    {media.video ? (
                      <video
                        src={media.video}
                        poster={media.image ?? undefined}
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : media.image ? (
                      <Image
                        src={media.image}
                        alt={category.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pattern-lattice-light">
                        <Icon size={40} className="text-emerald-100/30" />
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-100/70">
                          <ImageIcon size={12} />
                          {language === "bn" ? "শীঘ্রই ছবি/ভিডিও যুক্ত হবে" : "Photos/video coming soon"}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full shadow-sm">
                      <Icon size={14} className="text-emerald-700" />
                      <span className="text-[11px] font-bold text-emerald-900">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-5 xs:p-6 flex flex-col">
                    <span className="block w-10 h-1 bg-amber-400 rounded-full mb-3" />
                    <h2 className="text-base xs:text-lg font-bold text-emerald-950 mb-2">{category.title}</h2>
                    <p className="text-xs xs:text-sm text-gray-600 leading-relaxed mb-4 flex-1">{category.blurb}</p>
                    <span className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-emerald-700 group-hover:text-emerald-800 group-hover:gap-2.5 transition-all">
                      {projects.detailsButton}
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <GallerySection initialItems={initialGalleryItems} initialCursor={initialGalleryCursor} />

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
