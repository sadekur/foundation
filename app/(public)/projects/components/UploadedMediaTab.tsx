"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getGalleryItems } from "@/lib/gallery";
import type { GalleryItem } from "@/types";

interface UploadedMediaTabProps {
  initialItems: GalleryItem[];
  initialCursor: string | null;
}

export const UploadedMediaTab = ({ initialItems, initialCursor }: UploadedMediaTabProps) => {
  const { language } = useLanguage();
  const { gallery } = getDictionary(language);

  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);

  const loadMore = async () => {
    if (!cursor) return;
    setIsLoadingMore(true);
    setLoadMoreFailed(false);
    try {
      const result = await getGalleryItems({ afterCreatedAt: cursor });
      setItems((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
    } catch {
      setLoadMoreFailed(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-10 xs:py-14">
        <ImageOff className="mx-auto text-emerald-300" size={40} />
        <p className="mt-4 text-sm xs:text-base text-gray-600">{gallery.emptyMediaMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative aspect-square rounded-xl overflow-hidden bg-emerald-50 border border-emerald-100"
          >
            {item.type === "video" ? (
              <video src={item.url} controls className="w-full h-full object-cover" />
            ) : (
              <Image
                src={item.url}
                alt={item.caption ?? ""}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            )}
            {item.caption && (
              <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[11px] px-2 py-1 truncate">
                {item.caption}
              </span>
            )}
          </div>
        ))}
      </div>

      {cursor && (
        <div className="mt-8 xs:mt-10 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoadingMore}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-emerald-300 text-emerald-800 text-sm font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {gallery.loadingMore}
              </>
            ) : (
              gallery.loadMore
            )}
          </button>
          {loadMoreFailed && <p className="text-xs text-red-600">{gallery.loadMoreError}</p>}
        </div>
      )}
    </div>
  );
};
