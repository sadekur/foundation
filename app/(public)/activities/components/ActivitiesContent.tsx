"use client";

import { CalendarDays, ExternalLink, Newspaper } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/siteConfig";
import type { BlogPost } from "@/lib/blogger";
import { SectionDivider } from "../../components/SectionDivider";
import { FadeIn } from "../../components/FadeIn";

interface ActivitiesContentProps {
  posts: BlogPost[];
}

export const ActivitiesContent = ({ posts }: ActivitiesContentProps) => {
  const { language } = useLanguage();
  const { activities } = getDictionary(language);
  const locale = language === "bn" ? "bn-BD" : "en-US";
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div>
      <div className="bg-emerald-950 pattern-lattice-light">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14 text-center">
          <FadeIn>
            <h1 className="text-2xl xs:text-3xl font-bold text-white">{activities.title}</h1>
            <SectionDivider className="mt-4" />
            <p className="mt-4 text-sm xs:text-base text-emerald-100 max-w-2xl mx-auto">{activities.intro}</p>
          </FadeIn>
        </div>
      </div>

      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14">
        {posts.length === 0 ? (
          <FadeIn>
            <div className="text-center py-10 xs:py-14">
              <Newspaper className="mx-auto text-emerald-300" size={40} />
              <p className="mt-4 text-sm xs:text-base text-gray-600">{activities.emptyMessage}</p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
            {posts.map((post, index) => (
              <FadeIn key={post.id} delayMs={(index % 6) * 100}>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group h-full flex flex-col bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative w-full aspect-video bg-emerald-50 overflow-hidden">
                    {post.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element -- external Blogger-hosted image, not worth a remotePatterns allowlist entry
                      <img
                        src={post.thumbnail}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-200">
                        <Newspaper size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col p-4 xs:p-5">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <CalendarDays size={14} />
                      <time dateTime={post.publishedAt}>{dateFormatter.format(new Date(post.publishedAt))}</time>
                    </div>
                    <h2 className="mt-2 text-sm xs:text-base font-semibold text-emerald-950 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-xs xs:text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs xs:text-sm font-medium text-amber-600 group-hover:text-amber-700">
                      {activities.readMore}
                      <ExternalLink size={14} />
                    </span>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        )}

        <FadeIn delayMs={100}>
          <div className="mt-10 text-center">
            <a
              href={siteConfig.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              {activities.visitBlog}
              <ExternalLink size={16} />
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
