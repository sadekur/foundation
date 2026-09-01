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

const EXCERPT_LENGTH = 160;

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const truncate = (text: string, length: number) =>
  text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;

const extractFirstImage = (html: string): string | null => {
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  return match ? match[1] : null;
};

// Blogger image URLs embed a size segment (e.g. "/s320/", "/s72-c/") that can be swapped
// for a larger one to get a decent card thumbnail instead of a thumbnail-sized crop.
const upsizeImage = (url: string) => url.replace(/\/s\d+(-c)?\//, "/s600/");

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const feedUrl = `${siteConfig.blogUrl}feeds/posts/default?alt=json&max-results=20`;
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data: BloggerFeedResponse = await res.json();
    const entries = data.feed.entry ?? [];

    return entries.map((entry) => {
      const link = entry.link.find((l) => l.rel === "alternate")?.href ?? siteConfig.blogUrl;
      const html = entry.content?.$t ?? entry.summary?.$t ?? "";
      const rawThumbnail = entry.media$thumbnail?.url ?? extractFirstImage(html);

      return {
        id: entry.id.$t,
        title: entry.title.$t,
        link,
        publishedAt: entry.published.$t,
        excerpt: truncate(stripHtml(html), EXCERPT_LENGTH),
        thumbnail: rawThumbnail ? upsizeImage(rawThumbnail) : null,
      };
    });
  } catch {
    return [];
  }
};
