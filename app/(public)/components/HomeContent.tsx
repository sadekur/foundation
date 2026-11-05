"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectMedia, siteConfig } from "@/lib/siteConfig";
import type { BlogPost } from "@/lib/blogger";
import { SectionDivider } from "./SectionDivider";
import { FadeIn } from "./FadeIn";
import { HeroProjectNames } from "./HeroProjectNames";
import { HeroWave } from "./HeroWave";
import { ActivityCard } from "./ActivityCard";

const FEATURED_PROJECT_COUNT = 6;

const CONTAINER_CLASS =
  "w-full max-w-none xs:max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8";
const SECTION_TITLE_CLASS = "text-xl xs:text-2xl font-bold text-emerald-950";

interface HomeContentProps {
  latestPosts: BlogPost[];
}

const SectionLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="mt-6 inline-flex items-center gap-1.5 text-sm xs:text-base font-semibold text-emerald-800 hover:text-emerald-600 transition-colors"
  >
    {children}
    <ArrowRight size={16} />
  </Link>
);

export const HomeContent = ({ latestPosts }: HomeContentProps) => {
  const { language } = useLanguage();
  const dictionary = getDictionary(language);
  const { home, about } = dictionary;
  // Paired up before filtering because projectMedia lines up with categories by index.
  const featuredProjects = dictionary.projects.categories
    .flatMap((category, index) => {
      const image = projectMedia[index]?.image;
      return image ? [{ category, image }] : [];
    })
    .slice(0, FEATURED_PROJECT_COUNT);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800">
        <div className="absolute inset-0 pattern-lattice-light pointer-events-none" aria-hidden="true" />
        <div className="relative w-full max-w-none xs:max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-14 xs:py-20 sm:py-28 text-center">
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

        <HeroProjectNames names={about.projects.map((project) => project.title)} />
        <HeroWave />
      </section>

      <section className="bg-stone-50">
        <div className={`${CONTAINER_CLASS} py-12 xs:py-16`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <FadeIn>
              <h2 className={`${SECTION_TITLE_CLASS} mb-3`}>{home.introTitle}</h2>
              <p className="text-sm xs:text-base text-gray-700 leading-relaxed">{home.introBody}</p>
              <SectionLink href="/about">{home.aboutLink}</SectionLink>
            </FadeIn>
            <FadeIn delayMs={120}>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 xs:p-6">
                <h2 className="text-base xs:text-lg font-semibold text-emerald-900 mb-2">{about.missionTitle}</h2>
                <p className="text-sm xs:text-base text-emerald-800 leading-relaxed">{about.missionBody}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${CONTAINER_CLASS} py-12 xs:py-16`}>
          <FadeIn>
            <h2 className={SECTION_TITLE_CLASS}>{home.projectsTitle}</h2>
            <p className="mt-2 text-sm xs:text-base text-gray-600">{home.projectsIntro}</p>
          </FadeIn>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
            {featuredProjects.map(({ category, image }, index) => (
              <FadeIn key={category.slug} delayMs={(index % 3) * 100}>
                <Link
                  href={`/projects/${category.slug}`}
                  className="group h-full flex flex-col bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative w-full aspect-video bg-emerald-50 overflow-hidden">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 p-4 xs:p-5">
                    <h3 className="text-sm xs:text-base font-semibold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                      {category.title}
                    </h3>
                    <p className="mt-2 text-xs xs:text-sm text-gray-600 leading-relaxed line-clamp-3">{category.blurb}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <div className="text-center">
            <SectionLink href="/projects">{home.projectsViewAll}</SectionLink>
          </div>
        </div>
      </section>

      <section className="bg-stone-50">
        <div className={`${CONTAINER_CLASS} py-12 xs:py-16`}>
          {latestPosts.length > 0 && (
            <div className="mb-12 xs:mb-16">
              <FadeIn>
                <h2 className={SECTION_TITLE_CLASS}>{home.activitiesTitle}</h2>
                <p className="mt-2 text-sm xs:text-base text-gray-600">{home.activitiesIntro}</p>
              </FadeIn>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
                {latestPosts.map((post, index) => (
                  <FadeIn key={post.id} delayMs={index * 100}>
                    <ActivityCard post={post} heading="h3" />
                  </FadeIn>
                ))}
              </div>
              <div className="text-center">
                <SectionLink href="/activities">{home.activitiesViewAll}</SectionLink>
              </div>
            </div>
          )}

          <FadeIn>
            <div className="rounded-2xl bg-emerald-950 pattern-lattice-light px-5 xs:px-8 py-8 xs:py-10 text-center">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-white">{about.supportTitle}</h2>
              <SectionDivider className="my-4" />
              <p className="max-w-3xl mx-auto text-sm xs:text-base text-emerald-100 leading-relaxed">
                {about.supportBody[0]}
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2">
                {home.supportWays.map((way) => (
                  <li
                    key={way}
                    className="rounded-full bg-emerald-900/70 border border-amber-400/30 px-3.5 py-1.5 text-xs xs:text-sm font-medium text-amber-100"
                  >
                    {way}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs xs:text-sm text-emerald-100">{home.donateLabel}</p>
              <div className="mt-1 flex flex-wrap justify-center gap-x-5 gap-y-1">
                {siteConfig.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/-/g, "")}`}
                    className="text-base xs:text-lg font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    {phone}
                  </a>
                ))}
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-block bg-amber-400 text-emerald-950 px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-300 transition-colors"
              >
                {about.ctaContact}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
