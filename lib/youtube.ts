// Fetches playlists from the foundation's YouTube channel (@AsSalsabilTv) via the YouTube Data
// API v3's public REST endpoint — mirrors lib/blogger.ts's shape (native fetch, revalidate,
// safe fallback on error) rather than pulling in the `googleapis` SDK, matching how this
// codebase talks to its one other external content source without an SDK.
import { siteConfig } from "./siteConfig";

interface YouTubePlaylistListItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
  contentDetails: {
    itemCount: number;
  };
}

interface YouTubePlaylistListResponse {
  items?: YouTubePlaylistListItem[];
  nextPageToken?: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  itemCount: number;
  publishedAt: string;
}

export interface YouTubePlaylistsResult {
  playlists: YouTubePlaylist[];
  nextPageToken: string | null;
}

export const PLAYLISTS_PAGE_SIZE = 12;

interface GetPlaylistsOptions {
  pageToken?: string;
  maxResults?: number;
}

export const getPlaylists = async ({
  pageToken,
  maxResults = PLAYLISTS_PAGE_SIZE,
}: GetPlaylistsOptions = {}): Promise<YouTubePlaylistsResult> => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = siteConfig.youtube.channelId;
  if (!apiKey || !channelId) return { playlists: [], nextPageToken: null };

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlists");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("maxResults", String(maxResults));
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return { playlists: [], nextPageToken: null };

    const data: YouTubePlaylistListResponse = await res.json();
    const playlists = (data.items ?? []).map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails.high?.url ??
        item.snippet.thumbnails.medium?.url ??
        item.snippet.thumbnails.default?.url ??
        null,
      itemCount: item.contentDetails.itemCount,
      publishedAt: item.snippet.publishedAt,
    }));

    return { playlists, nextPageToken: data.nextPageToken ?? null };
  } catch {
    return { playlists: [], nextPageToken: null };
  }
};
