"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ImageOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getGalleryItems } from "@/lib/gallery";
import type { GalleryItem } from "@/types";
import { MediaLightbox } from "./MediaLightbox";

interface UploadedMediaTabProps {
  initialItems: GalleryItem[];
  initialCursor: string | null;
}

// However many real items are loaded, pad the belt up to this many so a small gallery doesn't
// read as "3 thumbnails slowly drifting" — and so the loop (see `track` below) always has
// enough width to feel continuous rather than obviously repeating within one viewport.
const MIN_MARQUEE_ITEMS = 8;
// Seconds each item takes to cross the belt — keeps the speed constant regardless of count.
const SECONDS_PER_ITEM = 3.5;

export const UploadedMediaTab = ({ initialItems, initialCursor }: UploadedMediaTabProps) => {
  const { language } = useLanguage();
  const { gallery } = getDictionary(language);

  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  // Two identical halves back to back, each padded up to MIN_MARQUEE_ITEMS real items. The
  // animation (see globals.css's gallery-marquee keyframes) just slides left by exactly one
  // half's width and the halves being pixel-identical is what makes the reset invisible.
  const track = useMemo(() => {
    if (items.length === 0) return [];
    const repeatCount = Math.max(1, Math.ceil(MIN_MARQUEE_ITEMS / items.length));
    const half = Array.from({ length: repeatCount }, () => items).flat();
    return [...half, ...half];
  }, [items]);

  const durationSeconds = (track.length / 2) * SECONDS_PER_ITEM;

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
      <div
        className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          className="flex w-max gap-3 xs:gap-4 animate-gallery-marquee motion-reduce:animate-none"
          style={{ animationDuration: `${durationSeconds}s`, animationPlayState: isPaused ? "paused" : "running" }}
        >
          {track.map((item, i) => (
            <button
              type="button"
              key={`${item.id}-${i}`}
              onClick={() => setLightboxIndex(items.findIndex((original) => original.id === item.id))}
              className="relative shrink-0 w-32 xs:w-40 sm:w-48 md:w-56 aspect-square rounded-xl overflow-hidden bg-emerald-50 border border-emerald-100 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={item.caption || "View media"}
            >
              {item.type === "video" ? (
                <video src={item.url} muted playsInline className="w-full h-full object-cover pointer-events-none" />
              ) : (
                <Image
                  src={item.url}
                  alt={item.caption ?? ""}
                  fill
                  sizes="(min-width: 768px) 224px, (min-width: 640px) 192px, (min-width: 375px) 160px, 128px"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              {item.caption && (
                <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[11px] px-2 py-1 truncate text-left">
                  {item.caption}
                </span>
              )}
            </button>
          ))}
        </div>
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

      {lightboxIndex !== null && (
        <MediaLightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
};
