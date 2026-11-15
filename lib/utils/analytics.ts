// Client-safe analytics helpers shared by the public page-view tracker
// (app/(public)/components/AnalyticsTracker.tsx), the server-side store (lib/analyticsStore.ts)
// and the admin Analytics page. Nothing here touches Firebase.

// Days and months are bucketed in Bangladesh time (UTC+6, no daylight saving), so "today" on the
// dashboard matches the foundation's own calendar no matter where the server runs.
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** "2026-11-15" — the Bangladesh calendar day `date` falls on. */
export const dhakaDayKey = (date: Date = new Date()) => new Date(date.getTime() + DHAKA_OFFSET_MS).toISOString().slice(0, 10);

/** "2026-11" — the Bangladesh calendar month `date` falls on. */
export const dhakaMonthKey = (date: Date = new Date()) => dhakaDayKey(date).slice(0, 7);

/** The last `count` day keys, oldest first, ending today (Bangladesh time). */
export const recentDayKeys = (count: number, end: Date = new Date()) =>
  Array.from({ length: count }, (_, i) => dhakaDayKey(new Date(end.getTime() - (count - 1 - i) * DAY_MS)));

/** The last `count` month keys, oldest first, ending this month (Bangladesh time). */
export const recentMonthKeys = (count: number, end: Date = new Date()) => {
  const [year, month] = dhakaMonthKey(end).split("-").map(Number);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(year, month - 1 - (count - 1 - i), 1));
    return d.toISOString().slice(0, 7);
  });
};

/** Every day key in a "YYYY-MM" month, in order. */
export const monthDayKeys = (monthKey: string) => {
  const [year, month] = monthKey.split("-").map(Number);
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: days }, (_, i) => `${monthKey}-${String(i + 1).padStart(2, "0")}`);
};

export const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;

// localStorage flag that stops a browser's page views from being counted. AdminShell sets it
// whenever the admin is signed in, so the foundation's own browsing doesn't inflate the numbers.
export const ANALYTICS_IGNORE_KEY = "analytics:ignore";

// The `pages` breakdown key every path that isn't one of the site's real public routes collapses
// into (lib/analyticsStore.ts's normalizePage), so the admin page can label it.
export const OTHER_PAGE = "(other)";

/** Sent by AnalyticsTracker to POST /api/analytics/collect. */
export interface AnalyticsHitPayload {
  path: string;
  /** First page view from this browser today (Bangladesh time) — counts a daily visitor. */
  newDay: boolean;
  /** First page view from this browser this month — counts a monthly visitor. */
  newMonth: boolean;
  /** Present only on the first page of a visit (browser tab session): where it came from. */
  entry?: { referrer: string; search: string };
}
