import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blogger";
import { HomeContent } from "./components/HomeContent";

export const metadata: Metadata = {
  title: "Home",
  description:
    "As-Salsabil Foundation runs Zakat, sadaqah jariyah, and rehabilitation projects in Gobindaganj, Gaibandha, following the Sunnah of the Prophet (peace be upon him).",
};

const LATEST_POST_COUNT = 3;

export default async function HomePage() {
  const { posts } = await getBlogPosts({ maxResults: LATEST_POST_COUNT });
  return <HomeContent latestPosts={posts} />;
}
