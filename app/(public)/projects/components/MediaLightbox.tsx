"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { GalleryItem } from "@/types";
import { getYouTubeEmbedUrl } from "@/lib/youtubeVideo";

// Shows a play button over the video whenever it's paused: before playback starts, after the
// visitor pauses, or when the browser blocks autoplay-with-sound. The button only covers the
// middle of the frame, so the native controls along the bottom stay clickable.
const LightboxVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        controls
        autoPlay
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="max-h-[80vh] max-w-full rounded-lg"
      />
      {!isPlaying && (
        <button
          type="button"
          onClick={() => void videoRef.current?.play().catch(() => {})}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 rounded-full bg-black/50 ring-2 ring-white/80 backdrop-blur-sm text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Play video"
        >
          <Play size={36} className="ml-1 fill-current" />
        </button>
      )}
    </div>
  );
};

interface MediaLightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// Fullscreen viewer opened by clicking a thumbnail in the marquee (see UploadedMediaTab).
// Operates on the real (non-padded) items list, independent of how many times the marquee
// visually repeats each item.
export const MediaLightbox = ({ items, index, onClose, onNavigate }: MediaLightboxProps) => {
  const item = items[index];
  const goPrev = () => onNavigate((index - 1 + items.length) % items.length);
  const goNext = () => onNavigate((index + 1) % items.length);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goPrev/goNext close over index, re-bind every render is fine for a keydown listener
  }, [index, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 xs:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 xs:top-4 xs:right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {items.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          className="absolute left-1 xs:left-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      <div
        className="max-w-4xl max-h-full w-full flex flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        {item.type === "youtube" && item.youtubeId ? (
          // YouTube's own player, so no custom play button. Keyed so switching videos reloads the iframe.
          <div key={item.id} className="w-full aspect-video max-h-[80vh] rounded-lg overflow-hidden bg-black">
            <iframe
              src={getYouTubeEmbedUrl(item.youtubeId)}
              title={item.caption || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        ) : item.type === "video" ? (
          // Keyed so the play state resets when navigating between videos.
          <LightboxVideo key={item.id} src={item.url} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- lightbox shows the original Cloudinary asset, not a fixed next/image layout
          <img
            src={item.url}
            alt={item.caption ?? ""}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
          />
        )}
        {item.caption && <p className="mt-3 text-sm xs:text-base text-white/90 text-center">{item.caption}</p>}
      </div>

      {items.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          className="absolute right-1 xs:right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
};
