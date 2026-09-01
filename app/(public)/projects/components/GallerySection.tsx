"use client";

import { useState } from "react";
import { Image as ImageIcon, Youtube } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { GalleryItem } from "@/types";
import { FadeIn } from "../../components/FadeIn";
import { SectionDivider } from "../../components/SectionDivider";
import { UploadedMediaTab } from "./UploadedMediaTab";
import { YouTubePlaylistsTab } from "./YouTubePlaylistsTab";

type GalleryTab = "media" | "youtube";

interface GallerySectionProps {
  initialItems: GalleryItem[];
  initialCursor: string | null;
}

export const GallerySection = ({ initialItems, initialCursor }: GallerySectionProps) => {
  const { language } = useLanguage();
  const { gallery } = getDictionary(language);
  const [activeTab, setActiveTab] = useState<GalleryTab>("media");

  return (
    <FadeIn delayMs={50}>
      <div className="mt-10 xs:mt-12">
        <div className="text-center mb-8 xs:mb-10">
          <span className="block w-12 h-1 bg-amber-400 rounded-full mb-4 mx-auto" />
          <h2 className="text-xl xs:text-2xl font-bold text-emerald-950">{gallery.title}</h2>
          <SectionDivider className="mt-4 mb-4" />
          <p className="text-sm xs:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">{gallery.intro}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6 xs:mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`flex items-center gap-2 px-4 xs:px-5 py-2 xs:py-2.5 rounded-full text-sm font-semibold transition-colors ${
              activeTab === "media" ? "bg-emerald-800 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <ImageIcon size={16} />
            {gallery.tabMedia}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("youtube")}
            className={`flex items-center gap-2 px-4 xs:px-5 py-2 xs:py-2.5 rounded-full text-sm font-semibold transition-colors ${
              activeTab === "youtube" ? "bg-emerald-800 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <Youtube size={16} />
            {gallery.tabYoutube}
          </button>
        </div>

        {activeTab === "media" ? (
          <UploadedMediaTab initialItems={initialItems} initialCursor={initialCursor} />
        ) : (
          <YouTubePlaylistsTab />
        )}
      </div>
    </FadeIn>
  );
};
