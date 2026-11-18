// Client-safe helpers for single YouTube videos linked into the gallery (type "youtube").
// Separate from lib/youtube.ts, which calls the Data API with a server-only key.

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

// Accepts the usual link shapes: youtube.com/watch?v=ID, youtu.be/ID, /shorts/ID, /embed/ID,
// /live/ID (with or without www./m., extra query params, or a timestamp), or a bare 11-char ID.
export const parseYouTubeVideoId = (input: string): string | null => {
  const value = input.trim();
  if (YOUTUBE_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
  let candidate: string | null = null;
  if (host === "youtu.be") {
    candidate = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    candidate = url.searchParams.get("v");
    if (!candidate) {
      const [, kind, id] = url.pathname.split("/");
      if (["shorts", "embed", "live", "v"].includes(kind)) candidate = id ?? null;
    }
  }
  return candidate && YOUTUBE_ID.test(candidate) ? candidate : null;
};

export const getYouTubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

// hqdefault exists for every video (maxresdefault doesn't); it's 4:3 with letterbox bars, so
// render it with object-cover to crop them off.
export const getYouTubeThumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// youtube-nocookie: YouTube's privacy-enhanced embed, which sets no tracking cookies until the
// visitor actually plays the video.
export const getYouTubeEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
