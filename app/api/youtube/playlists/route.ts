import { NextResponse } from "next/server";
import { getPlaylists } from "@/lib/youtube";

// GET /api/youtube/playlists?pageToken=... — proxies the YouTube Data API v3 so
// YOUTUBE_API_KEY never reaches the browser (unlike the /api/activities proxy, this one
// exists because of the secret, not CORS).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get("pageToken") ?? undefined;

  const result = await getPlaylists({ pageToken });
  return NextResponse.json(result);
}
