// Fetches published posts from the foundation's Blogger blog (siteConfig.blogUrl) via its
// public JSON feed — no API key needed since the blog is public. Used by the "Our Activities"
// page to list posts that link out to the original Blogspot post.
import { siteConfig } from "./siteConfig";

interface BloggerFeedLink {
  rel: string;
  href: string;
}

interface BloggerFeedEntry {
  id: { $t: string };
  title: { $t: string };
  published: { $t: string };
  content?: { $t: string };
  summary?: { $t: string };
  link: BloggerFeedLink[];
  media$thumbnail?: { url: string };
}

interface BloggerFeedResponse {
  feed: {
    entry?: BloggerFeedEntry[];
    openSearch$totalResults?: { $t: string };
  };
}

export interface BlogPost {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
  excerpt: string;
  thumbnail: string | null;
}

export interface BlogPostsResult {
  posts: BlogPost[];
  total: number;
}

export const ACTIVITIES_PAGE_SIZE = 9;

// How long a saved copy of the feed is served, so a new post appears within about this long.
const BLOG_REVALIDATE_SECONDS = 300;

const EXCERPT_LENGTH = 160;

const HTML_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

// One pass, so "&amp;nbsp;" correctly becomes the literal text "&nbsp;". Unknown names are left as they are.
const decodeHtmlEntities = (text: string) =>
  text.replace(/&(?:#(\d+)|#x([\da-f]+)|(\w+));/gi, (entity, decimal, hex, name) => {
    if (name) return HTML_ENTITIES[name.toLowerCase()] ?? entity;
    const codePoint = decimal ? Number(decimal) : parseInt(hex, 16);
    return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
  });

const stripHtml = (html: string) =>
  decodeHtmlEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

const truncate = (text: string, length: number) =>
  text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;

const extractFirstImage = (html: string): string | null => {
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  return match ? match[1] : null;
};

// Blogger image URLs carry a size segment just before the filename (e.g. "/s320/", "/s72-c/",
// "/s72-w554-h269-c/"), and the feed's thumbnails are only 72px, so swap it for a large one.
const upsizeBloggerImage = (url: string) => url.replace(/\/[swh]\d+[^/]*(?=\/[^/]+$)/, "/s1600");

const YOUTUBE_THUMBNAIL = /^(https?:\/\/img\.youtube\.com\/vi\/[^/]+)\/[^/]+\.jpg$/;

// The feed gives YouTube's 120x90 default.jpg. maxresdefault doesn't exist for every video, so
// check for it and fall back to hqdefault, which always does.
const upsizeYouTubeThumbnail = async (videoBase: string) => {
  const maxRes = `${videoBase}/maxresdefault.jpg`;
  try {
    const res = await fetch(maxRes, { method: "HEAD", next: { revalidate: BLOG_REVALIDATE_SECONDS } });
    if (res.ok) return maxRes;
  } catch {
    // Fall through to the size that's always available.
  }
  return `${videoBase}/hqdefault.jpg`;
};

const upsizeThumbnail = async (url: string) => {
  const youtube = url.match(YOUTUBE_THUMBNAIL);
  return youtube ? upsizeYouTubeThumbnail(youtube[1]) : upsizeBloggerImage(url);
};

interface GetBlogPostsOptions {
  startIndex?: number;
  maxResults?: number;
}

// startIndex is 1-based, matching Blogger's feed API — pass posts.length + 1 to fetch the next page.
export const getBlogPosts = async ({
  startIndex = 1,
  maxResults = ACTIVITIES_PAGE_SIZE,
}: GetBlogPostsOptions = {}): Promise<BlogPostsResult> => {
  try {
    const feedUrl = `${siteConfig.blogUrl}feeds/posts/default?alt=json&start-index=${startIndex}&max-results=${maxResults}`;
    const res = await fetch(feedUrl, { next: { revalidate: BLOG_REVALIDATE_SECONDS } });
    if (!res.ok) return { posts: [], total: 0 };

    const data: BloggerFeedResponse = await res.json();
    const entries = data.feed.entry ?? [];
    const total = Number(data.feed.openSearch$totalResults?.$t ?? entries.length);

    const posts = await Promise.all(entries.map(async (entry) => {
      const link = entry.link.find((l) => l.rel === "alternate")?.href ?? siteConfig.blogUrl;
      const html = entry.content?.$t ?? entry.summary?.$t ?? "";
      const rawThumbnail = entry.media$thumbnail?.url ?? extractFirstImage(html);

      return {
        id: entry.id.$t,
        title: entry.title.$t,
        link,
        publishedAt: entry.published.$t,
        excerpt: truncate(stripHtml(html), EXCERPT_LENGTH),
        thumbnail: rawThumbnail ? await upsizeThumbnail(rawThumbnail) : null,
      };
    }));

    return { posts, total };
  } catch {
    return { posts: [], total: 0 };
  }
};
