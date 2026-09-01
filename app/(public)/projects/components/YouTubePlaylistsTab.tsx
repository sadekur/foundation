"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Youtube } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { YouTubePlaylist } from "@/lib/youtube";

interface PlaylistsResponse {
  playlists: YouTubePlaylist[];
  nextPageToken: string | null;
}

// Mounted only when the YouTube tab is activated (see GallerySection) — this fetches on mount
// rather than being prefetched server-side, deliberately, to conserve the YouTube Data API's
// daily quota by not spending a request on every /projects page view.
export const YouTubePlaylistsTab = () => {
  const { language } = useLanguage();
  const { gallery } = getDictionary(language);

  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/youtube/playlists");
        const data: PlaylistsResponse = await res.json();
        if (!cancelled) {
          setPlaylists(data.playlists);
          setNextPageToken(data.nextPageToken);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = async () => {
    if (!nextPageToken) return;
    setIsLoadingMore(true);
    setLoadMoreFailed(false);
    try {
      const res = await fetch(`/api/youtube/playlists?pageToken=${nextPageToken}`);
      if (!res.ok) throw new Error("request failed");
      const data: PlaylistsResponse = await res.json();
      setPlaylists((prev) => [...prev, ...data.playlists]);
      setNextPageToken(data.nextPageToken);
    } catch {
      setLoadMoreFailed(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 xs:py-14">
        <Loader2 className="animate-spin text-emerald-400" size={32} />
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-10 xs:py-14">
        <Youtube className="mx-auto text-emerald-300" size={40} />
        <p className="mt-4 text-sm xs:text-base text-gray-600">{gallery.emptyYoutubeMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
        {playlists.map((playlist) => (
          <a
            key={playlist.id}
            href={`https://www.youtube.com/playlist?list=${playlist.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group h-full flex flex-col bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative w-full aspect-video bg-emerald-50 overflow-hidden">
              {playlist.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element -- external YouTube-hosted thumbnail, not worth a remotePatterns allowlist entry
                <img
                  src={playlist.thumbnail}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-200">
                  <Youtube size={32} />
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col p-4 xs:p-5">
              <h3 className="text-sm xs:text-base font-semibold text-emerald-950 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                {playlist.title}
              </h3>
              <p className="mt-1 text-xs text-emerald-600">
                {gallery.playlistVideoCount.replace("{count}", String(playlist.itemCount))}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs xs:text-sm font-medium text-amber-600 group-hover:text-amber-700">
                {gallery.watchOnYoutube}
                <ExternalLink size={14} />
              </span>
            </div>
          </a>
        ))}
      </div>

      {nextPageToken && (
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
