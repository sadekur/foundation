import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/firebaseAdmin";
import { getAnalytics } from "@/lib/analyticsStore";
import { DAY_KEY_PATTERN } from "@/lib/utils/analytics";

const MAX_RANGE_DAYS = 400;

// GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD — admin-only (Firebase ID token as
// `Authorization: Bearer …`). Returns the daily counters in that range plus the last 12 months,
// for the dashboard's Analytics page.
export async function GET(request: Request) {
  const uid = await verifyAdminRequest(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  if (!DAY_KEY_PATTERN.test(from) || !DAY_KEY_PATTERN.test(to) || from > to) {
    return NextResponse.json({ error: "from and to must be YYYY-MM-DD dates, from ≤ to" }, { status: 400 });
  }
  if ((Date.parse(to) - Date.parse(from)) / 86_400_000 > MAX_RANGE_DAYS) {
    return NextResponse.json({ error: `Range is limited to ${MAX_RANGE_DAYS} days` }, { status: 400 });
  }

  try {
    return NextResponse.json(await getAnalytics(from, to), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Analytics read failed:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
