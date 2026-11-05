"use client";

import { CalendarDays, ExternalLink, Newspaper } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { BlogPost } from "@/lib/blogger";

interface ActivityCardProps {
  post: BlogPost;
  heading?: "h2" | "h3";
}

// One blog post, linking out to the original on Blogspot. Used by Our Activities and the home page.
export const ActivityCard = ({ post, heading: Heading = "h2" }: ActivityCardProps) => {
  const { language } = useLanguage();
  const { activities } = getDictionary(language);
  // A fixed time zone keeps the server-rendered date identical to the browser's.
  const dateFormatter = new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-US", {
    dateStyle: "medium",
    timeZone: "Asia/Dhaka",
  });

  return (
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
        <Heading className="mt-2 text-sm xs:text-base font-semibold text-emerald-950 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {post.title}
        </Heading>
        <p className="mt-2 text-xs xs:text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs xs:text-sm font-medium text-amber-600 group-hover:text-amber-700">
          {activities.readMore}
          <ExternalLink size={14} />
        </span>
      </div>
    </a>
  );
};
