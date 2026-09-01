import { NextResponse } from "next/server";
import { getBlogPosts, ACTIVITIES_PAGE_SIZE } from "@/lib/blogger";

const MAX_PAGE_SIZE = 20;

// GET /api/activities?start=10&count=9 — used by the "Load More" button on /activities to
// fetch further pages of the Blogger feed from the client without hitting Blogger's CORS wall
// (its public JSON feed doesn't send Access-Control-Allow-Origin for browser fetches).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startIndex = Math.max(1, Number(searchParams.get("start")) || 1);
  const maxResults = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(searchParams.get("count")) || ACTIVITIES_PAGE_SIZE));

  const result = await getBlogPosts({ startIndex, maxResults });
  return NextResponse.json(result);
}
