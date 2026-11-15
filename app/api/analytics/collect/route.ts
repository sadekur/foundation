import { BOT_PATTERN, recordHit } from "@/lib/analyticsStore";
import type { AnalyticsHitPayload } from "@/lib/utils/analytics";

const decodeHeader = (value: string | null) => {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const str = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");

// POST /api/analytics/collect — public. Receives one page-view beacon from AnalyticsTracker and
// bumps the daily/monthly counters (lib/analyticsStore.ts). Always answers 204, even on bad input
// or a Firestore failure: a beacon has nobody to show an error to, and analytics must never break
// the site. Country/city come from Vercel's geo headers (absent locally, so they read "Unknown").
export async function POST(request: Request) {
  const noContent = new Response(null, { status: 204 });
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || BOT_PATTERN.test(userAgent)) return noContent;

  let body: Record<string, unknown>;
  try {
    // sendBeacon may send the JSON with a text/plain or application/json content type.
    body = JSON.parse((await request.text()).slice(0, 4000));
  } catch {
    return noContent;
  }

  const path = str(body.path, 200);
  if (!path.startsWith("/")) return noContent;

  const rawEntry = body.entry as Record<string, unknown> | undefined;
  const hit: AnalyticsHitPayload = {
    path,
    newDay: body.newDay === true,
    newMonth: body.newMonth === true,
    entry: rawEntry && typeof rawEntry === "object" ? { referrer: str(rawEntry.referrer, 500), search: str(rawEntry.search, 500) } : undefined,
  };

  const host = (request.headers.get("host") ?? "").toLowerCase().split(":")[0].replace(/^www\./, "");
  try {
    await recordHit(hit, {
      userAgent,
      host,
      country: request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry"),
      city: decodeHeader(request.headers.get("x-vercel-ip-city")),
    });
  } catch (error) {
    console.error("Analytics hit failed:", error);
  }
  return noContent;
}
