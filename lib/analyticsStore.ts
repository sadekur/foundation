// Server-only website analytics: turns one page-view beacon into counter increments, and reads
// the counters back for the admin Analytics page. Never import this from a Client Component.
//
// Storage is two Firestore collections of pre-aggregated counters, written and read only through
// the Admin SDK (so no security rules are involved):
//   analytics_daily/{YYYY-MM-DD}  and  analytics_monthly/{YYYY-MM}   (Bangladesh time)
// Each doc holds views/visits/visitors totals plus count maps (see AnalyticsPeriod in types/).
// A dashboard load therefore reads one doc per day shown (≤ 90) plus 12 monthly docs, however
// many visitors the site gets. Nothing personal is stored — no IP, user agent or visitor ID.
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { PROJECT_CATEGORY_SLUGS } from "@/lib/siteConfig";
import { dhakaDayKey, dhakaMonthKey, recentMonthKeys, type AnalyticsHitPayload } from "@/lib/utils/analytics";
import type { AnalyticsBreakdown, AnalyticsPeriod } from "@/types";

const DAILY = "analytics_daily";
const MONTHLY = "analytics_monthly";
export const ANALYTICS_MONTHS_SHOWN = 12;

const BREAKDOWNS: AnalyticsBreakdown[] = ["pages", "sources", "referrers", "countries", "cities", "devices", "browsers"];

// Map keys are URL-encoded (plus "." and "_") so a page path or host can never be read as a
// Firestore field path or hit the reserved `__name__` form. decodeKey reverses it.
const encodeKey = (key: string) => encodeURIComponent(key).replace(/\./g, "%2E").replace(/_/g, "%5F");
const decodeKey = (key: string) => {
  try {
    return decodeURIComponent(key);
  } catch {
    return key;
  }
};

// Only the site's real public routes are kept as-is; anything else (typos, 404s, junk sent to the
// public endpoint) collapses into one bucket so the pages map can't grow without bound.
const STATIC_PAGES = new Set(["/", "/about", "/projects", "/activities", "/contact"]);

const normalizePage = (raw: string) => {
  const path = raw.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (STATIC_PAGES.has(path)) return path;
  const slug = path.match(/^\/projects\/([^/]+)$/)?.[1];
  if (slug && (PROJECT_CATEGORY_SLUGS as readonly string[]).includes(slug)) return path;
  return OTHER_PAGE;
};

// Matched against the referrer's host (www. stripped) or, for Android apps that send an
// `android-app://<package>` referrer, the package name. First match wins, so Gmail precedes Google.
const SOURCE_RULES: { name: string; pattern: RegExp }[] = [
  { name: "Email", pattern: /^mail\.google\.com$|^com\.google\.android\.gm$|(^|\.)(outlook\.live\.com|outlook\.com|mail\.yahoo\.com)$/ },
  { name: "Google", pattern: /(^|\.)google\.[a-z.]+$|^com\.google\.android\.googlequicksearchbox$/ },
  { name: "Bing", pattern: /(^|\.)bing\.com$/ },
  { name: "Yahoo", pattern: /(^|\.)yahoo\.com$/ },
  { name: "DuckDuckGo", pattern: /(^|\.)duckduckgo\.com$/ },
  { name: "Messenger", pattern: /(^|\.)messenger\.com$|^com\.facebook\.orca$/ },
  { name: "Facebook", pattern: /(^|\.)(facebook\.com|fb\.com|fb\.me)$|^com\.facebook\.(katana|lite)$/ },
  { name: "Instagram", pattern: /(^|\.)instagram\.com$|^com\.instagram\.android$/ },
  { name: "YouTube", pattern: /(^|\.)(youtube\.com|youtu\.be)$|^com\.google\.android\.youtube$/ },
  { name: "WhatsApp", pattern: /(^|\.)(whatsapp\.com|whatsapp\.net|wa\.me)$|^com\.whatsapp$/ },
  { name: "Telegram", pattern: /(^|\.)(t\.me|telegram\.org|telegram\.me)$|^org\.telegram\.messenger$/ },
  { name: "X (Twitter)", pattern: /(^|\.)(twitter\.com|x\.com|t\.co)$/ },
  { name: "LinkedIn", pattern: /(^|\.)(linkedin\.com|lnkd\.in)$/ },
  { name: "Blog", pattern: /(^|\.)(blogspot\.com|blogger\.com)$/ },
];

// `?utm_source=` values people commonly put on shared links, mapped onto the same names.
const UTM_ALIASES: Record<string, string> = {
  fb: "Facebook", facebook: "Facebook", messenger: "Messenger", ig: "Instagram", instagram: "Instagram",
  yt: "YouTube", youtube: "YouTube", wa: "WhatsApp", whatsapp: "WhatsApp", telegram: "Telegram",
  google: "Google", twitter: "X (Twitter)", x: "X (Twitter)", linkedin: "LinkedIn", email: "Email",
  newsletter: "Email", blog: "Blog", blogger: "Blog",
};

export const DIRECT_SOURCE = "Direct";
const OTHER_WEBSITES = "Other websites";

const classifyEntry = (entry: NonNullable<AnalyticsHitPayload["entry"]>, ownHost: string) => {
  const params = new URLSearchParams(entry.search.slice(0, 500));
  const utm = params.get("utm_source")?.trim().toLowerCase().slice(0, 40);

  let referrerHost: string | null = null;
  let source = DIRECT_SOURCE;
  try {
    const url = new URL(entry.referrer);
    const host = url.hostname.toLowerCase().replace(/^www\./, "").slice(0, 100);
    if (host && host !== ownHost) {
      const isApp = url.protocol === "android-app:";
      source = SOURCE_RULES.find((rule) => rule.pattern.test(host))?.name ?? (isApp ? "Other apps" : OTHER_WEBSITES);
      referrerHost = isApp ? `app: ${host}` : host;
    }
  } catch {
    // Empty or unparseable referrer: typed URL, bookmark, or an app that hides the referrer
    // (WhatsApp and Messenger usually do) — counted as Direct unless the URL says otherwise.
  }

  // Tagged links beat the referrer; Facebook/Google ad click IDs beat a missing one.
  if (utm) source = UTM_ALIASES[utm] ?? (utm.replace(/[^a-z0-9 ._-]/g, "") || source);
  else if (source === DIRECT_SOURCE && params.has("fbclid")) source = "Facebook";
  else if (source === DIRECT_SOURCE && params.has("gclid")) source = "Google";

  return { source, referrerHost };
};

const detectDevice = (ua: string) => {
  if (/iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)/i.test(ua)) return "Tablet";
  if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua)) return "Mobile";
  return "Desktop";
};

// Order matters: most in-app and Chromium-based browsers also say "Chrome" and "Safari".
const BROWSER_RULES: [string, RegExp][] = [
  ["Facebook app", /FBAN|FBAV|FB_IAB|FBIOS/],
  ["Instagram app", /Instagram/],
  ["Samsung Internet", /SamsungBrowser/],
  ["UC Browser", /UCBrowser|UCWEB/],
  ["Opera", /OPR\/|Opera|OPiOS/],
  ["Edge", /Edg(e|A|iOS)?\//],
  ["Firefox", /Firefox|FxiOS/],
  ["Chrome", /Chrome|CriOS/],
  ["Safari", /Safari/],
];
const detectBrowser = (ua: string) => BROWSER_RULES.find(([, pattern]) => pattern.test(ua))?.[0] ?? "Other";

export const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pagespeed|monitor|curl|wget|python|axios|node-fetch/i;

export interface HitContext {
  userAgent: string;
  host: string; // the site's own host, so internal referrers count as Direct
  country: string | null; // ISO code from the hosting platform's geo header
  city: string | null;
}

/** Records one page view. `hit` is untrusted input from the public collect route. */
export const recordHit = async (hit: AnalyticsHitPayload, context: HitContext) => {
  const now = new Date();
  const increment = FieldValue.increment(1);

  const counts: Record<string, unknown> = {
    views: increment,
    pages: { [encodeKey(normalizePage(hit.path))]: increment },
  };

  if (hit.entry) {
    const { source, referrerHost } = classifyEntry(hit.entry, context.host);
    const country = context.country && /^[A-Z]{2}$/.test(context.country) ? context.country : "Unknown";
    const city = context.city ? `${context.city.slice(0, 60)}${country !== "Unknown" ? `, ${country}` : ""}` : "Unknown";

    counts.visits = increment;
    counts.sources = { [encodeKey(source)]: increment };
    if (referrerHost) counts.referrers = { [encodeKey(referrerHost)]: increment };
    counts.countries = { [encodeKey(country)]: increment };
    counts.cities = { [encodeKey(city)]: increment };
    counts.devices = { [encodeKey(detectDevice(context.userAgent))]: increment };
    counts.browsers = { [encodeKey(detectBrowser(context.userAgent))]: increment };
  }

  const dayKey = dhakaDayKey(now);
  const monthKey = dhakaMonthKey(now);
  const db = getAdminDb();
  const batch = db.batch();
  // merge: true + nested maps of increments only touches the named counters; concurrent hits
  // are safe because increment() is applied atomically on the server.
  batch.set(
    db.collection(DAILY).doc(dayKey),
    { key: dayKey, ...counts, ...(hit.newDay && { visitors: increment }) },
    { merge: true }
  );
  batch.set(
    db.collection(MONTHLY).doc(monthKey),
    { key: monthKey, ...counts, ...(hit.newMonth && { visitors: increment }) },
    { merge: true }
  );
  await batch.commit();
};

const toPeriod = (data: FirebaseFirestore.DocumentData): AnalyticsPeriod => {
  const breakdowns = {} as AnalyticsPeriod["breakdowns"];
  for (const name of BREAKDOWNS) {
    const raw = (data[name] ?? {}) as Record<string, number>;
    breakdowns[name] = Object.fromEntries(Object.entries(raw).map(([key, value]) => [decodeKey(key), Number(value) || 0]));
  }
  return {
    key: String(data.key),
    views: Number(data.views) || 0,
    visits: Number(data.visits) || 0,
    visitors: Number(data.visitors) || 0,
    breakdowns,
  };
};

const readRange = async (collection: string, from: string, to: string) => {
  // A range on one field needs only Firestore's automatic single-field index.
  const snapshot = await getAdminDb().collection(collection).where("key", ">=", from).where("key", "<=", to).get();
  return snapshot.docs.map((doc) => toPeriod(doc.data())).sort((a, b) => a.key.localeCompare(b.key));
};

/** Daily buckets for [fromDay, toDay] plus the last 12 monthly buckets. */
export const getAnalytics = async (fromDay: string, toDay: string) => {
  const monthKeys = recentMonthKeys(ANALYTICS_MONTHS_SHOWN);
  const [days, months] = await Promise.all([
    readRange(DAILY, fromDay, toDay),
    readRange(MONTHLY, monthKeys[0], monthKeys[monthKeys.length - 1]),
  ]);
  return { days, months };
};
