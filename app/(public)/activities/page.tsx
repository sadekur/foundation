import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blogger";
import { ActivitiesContent } from "./components/ActivitiesContent";

export const metadata: Metadata = {
  title: "Our Activities",
  description:
    "Reports and updates from As-Salsabil Foundation's recent activities and events, published on our blog.",
};

export default async function ActivitiesPage() {
  const { posts, total } = await getBlogPosts();
  return <ActivitiesContent initialPosts={posts} total={total} />;
}
