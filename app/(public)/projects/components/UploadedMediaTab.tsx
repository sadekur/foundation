"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getGalleryItems } from "@/lib/gallery";
import type { GalleryItem } from "@/types";
import { MediaLightbox } from "./MediaLightbox";

interface UploadedMediaTabProps {
  initialItems: GalleryItem[];
  initialCursor: string | null;
}

// Slow and unhurried on purpose — this is a background-ambient slideshow, not something
// visitors are meant to actively track, so both numbers below stay generous.
const AUTOPLAY_INTERVAL_MS = 6000;
const SLIDE_TRANSITION_MS = 1200;

export const UploadedMediaTab = ({ initialItems, initialCursor }: UploadedMediaTabProps) => {
  const { language } = useLanguage();
  const { gallery } = getDictionary(language);

  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const goTo = (index: number) => setCurrentIndex(((index % items.length) + items.length) % items.length);
  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  // Auto-play: pauses on hover/touch and while the lightbox is open, so it never fights a
  // visitor who's actively looking at something.
  useEffect(() => {
    if (isPaused || lightboxIndex !== null || items.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPaused, lightboxIndex, items.length]);

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
        className="relative rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          className="flex ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)`, transitionProperty: "transform", transitionDuration: `${SLIDE_TRANSITION_MS}ms` }}
        >
          {items.map((item, i) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setLightboxIndex(i)}
              className="relative w-full shrink-0 aspect-[4/3] xs:aspect-[16/10] sm:aspect-[16/9] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
              aria-label={item.caption || "View media"}
              aria-hidden={i !== currentIndex}
              tabIndex={i === currentIndex ? 0 : -1}
            >
              {item.type === "video" ? (
                <video src={item.url} muted playsInline className="w-full h-full object-contain" />
              ) : (
                <Image
                  src={item.url}
                  alt={item.caption ?? ""}
                  fill
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-contain"
                  priority={i === 0}
                />
              )}
              {item.caption && (
                <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs xs:text-sm px-4 xs:px-5 py-3 xs:py-4 text-left">
                  {item.caption}
                </span>
              )}
            </button>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 xs:left-3 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-1.5 xs:p-2 rounded-full transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-1.5 xs:p-2 rounded-full transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-2 xs:bottom-3 right-3 xs:right-4 text-[11px] xs:text-xs text-white bg-black/40 rounded-full px-2.5 py-1">
              {currentIndex + 1} / {items.length}
            </span>
          </>
        )}
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
