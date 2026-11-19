"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { Info, Loader, RefreshCw } from "lucide-react";
import { MONTH_KEY_PATTERN, OTHER_PAGE, dhakaDayKey, monthDayKeys, recentDayKeys, recentMonthKeys } from "@/lib/utils/analytics";
import type { AnalyticsBreakdown, AnalyticsPeriod, AnalyticsResponse } from "@/types";
import AnalyticsBarChart, { type ChartBar } from "./AnalyticsBarChart";
import AnalyticsBreakdownCard from "./AnalyticsBreakdownCard";
import PageHeader from "./PageHeader";
import ShareLinkCard from "./ShareLinkCard";
import { getGalleryProjectTitle } from "./galleryProjectOptions";

// Matches lib/analyticsStore.ts's ANALYTICS_MONTHS_SHOWN (that module is server-only).
const MONTHS_SHOWN = 12;
const DAY_PRESETS = [7, 30, 90] as const;

// A range is either "7d" / "30d" / "90d" (rolling, ending today) or a "YYYY-MM" month.
type Range = string;
type Metric = "views" | "visits" | "visitors";

const METRICS: { id: Metric; label: string }[] = [
  { id: "views", label: "Page views" },
  { id: "visits", label: "Visits" },
  { id: "visitors", label: "Visitors" },
];

const BREAKDOWN_NAMES: AnalyticsBreakdown[] = ["pages", "sources", "referrers", "countries", "cities", "devices", "browsers"];

const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/about": "About Us",
  "/projects": "Our Projects",
  "/activities": "Our Activities",
  "/contact": "Contact Us",
  [OTHER_PAGE]: "Other pages",
};

const pageLabel = (path: string) => {
  if (path === OTHER_PAGE) return { label: PAGE_NAMES[path], detail: "404s and unknown links" };
  const projectSlug = path.match(/^\/projects\/(.+)$/)?.[1];
  const label = PAGE_NAMES[path] ?? (projectSlug && getGalleryProjectTitle(projectSlug)) ?? path;
  return { label, detail: path };
};

let regionNames: Intl.DisplayNames | null | undefined;
const countryLabel = (code: string) => {
  if (regionNames === undefined) {
    try {
      regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      regionNames = null;
    }
  }
  if (!/^[A-Z]{2}$/.test(code)) return { label: code };
  try {
    return { label: regionNames?.of(code) ?? code, detail: code };
  } catch {
    return { label: code };
  }
};

// Day/month keys are calendar dates, so format them in UTC to keep the viewer's own time zone out of it.
const formatDay = (key: string, options: Intl.DateTimeFormatOptions) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString("en-GB", { timeZone: "UTC", ...options });
const formatMonth = (key: string, options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }) =>
  new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-GB", { timeZone: "UTC", ...options });

const formatCount = (value: number) => value.toLocaleString("en-US");

const plural = (value: number, word: string) => `${formatCount(value)} ${word}${value === 1 ? "" : "s"}`;
const periodLines = (period: AnalyticsPeriod | undefined) => [
  plural(period?.views ?? 0, "page view"),
  plural(period?.visits ?? 0, "visit"),
  plural(period?.visitors ?? 0, "visitor"),
];

const isMonthRange = (range: Range) => MONTH_KEY_PATTERN.test(range);

/** The day keys a range covers, oldest first. A month stops at today, so the current one isn't padded with future days. */
const rangeDayKeys = (range: Range) => {
  if (!isMonthRange(range)) return recentDayKeys(Number.parseInt(range, 10));
  const today = dhakaDayKey();
  return monthDayKeys(range).filter((key) => key <= today);
};

const sumBreakdowns = (periods: AnalyticsPeriod[]) => {
  const merged = Object.fromEntries(BREAKDOWN_NAMES.map((name) => [name, {} as Record<string, number>])) as AnalyticsPeriod["breakdowns"];
  for (const period of periods) {
    for (const name of BREAKDOWN_NAMES) {
      for (const [key, value] of Object.entries(period.breakdowns[name] ?? {})) {
        merged[name][key] = (merged[name][key] ?? 0) + value;
      }
    }
  }
  return merged;
};

const StatCard = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <p className="text-xs sm:text-sm text-gray-500">{label}</p>
    <p className="mt-1 text-lg sm:text-xl font-bold text-gray-900 tabular-nums">{value}</p>
    {hint && <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p>}
  </div>
);

interface Loaded {
  range: Range;
  dayKeys: string[];
  response: AnalyticsResponse;
}

interface AnalyticsScreenProps {
  user: User;
}

// The admin Analytics page: anonymous public-site traffic counters (written by
// app/api/analytics/collect, read through the admin-only GET /api/analytics). Every range change
// fetches that range's daily buckets plus the last 12 monthly ones; the previous numbers stay on
// screen while the next range loads.
const AnalyticsScreen = ({ user }: AnalyticsScreenProps) => {
  const [range, setRange] = useState<Range>("30d");
  const [metric, setMetric] = useState<Metric>("views");
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  const monthKeys = useMemo(() => recentMonthKeys(MONTHS_SHOWN), []);

  useEffect(() => {
    let cancelled = false;
    const dayKeys = rangeDayKeys(range);
    setLoading(true);
    setFailed(false);

    (async () => {
      try {
        const idToken = await user.getIdToken();
        const params = new URLSearchParams({ from: dayKeys[0], to: dayKeys[dayKeys.length - 1] });
        const res = await fetch(`/api/analytics?${params}`, {
          headers: { Authorization: `Bearer ${idToken}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Analytics request failed (${res.status})`);
        const response = (await res.json()) as AnalyticsResponse;
        if (!cancelled) setLoaded({ range, dayKeys, response });
      } catch (error) {
        console.error("Error loading analytics:", error);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, range, reloadCount]);

  const view = useMemo(() => {
    if (!loaded) return null;
    const { range: loadedRange, dayKeys, response } = loaded;
    const byDay = new Map(response.days.map((period) => [period.key, period]));
    const byMonth = new Map(response.months.map((period) => [period.key, period]));

    // A month's own bucket counts each browser once for the whole month; summing its days would
    // count a returning visitor once per day. Rolling ranges have no such bucket, so they sum days.
    const monthBucket = isMonthRange(loadedRange) ? byMonth.get(loadedRange) : undefined;
    const totals = monthBucket ?? {
      views: response.days.reduce((sum, period) => sum + period.views, 0),
      visits: response.days.reduce((sum, period) => sum + period.visits, 0),
      visitors: response.days.reduce((sum, period) => sum + period.visitors, 0),
    };
    const breakdowns = monthBucket?.breakdowns ?? sumBreakdowns(response.days);

    const dailyBars: ChartBar[] = dayKeys.map((key) => {
      const period = byDay.get(key);
      return {
        key,
        label: formatDay(key, { day: "numeric", month: "short" }),
        value: period?.[metric] ?? 0,
        tooltip: [formatDay(key, { weekday: "short", day: "numeric", month: "short", year: "numeric" }), ...periodLines(period)],
      };
    });

    const monthlyBars: ChartBar[] = monthKeys.map((key) => {
      const period = byMonth.get(key);
      return {
        key,
        label: formatMonth(key, { month: "short" }),
        value: period?.[metric] ?? 0,
        tooltip: [formatMonth(key), ...periodLines(period)],
      };
    });

    return {
      loadedRange,
      totals,
      breakdowns,
      dailyBars,
      monthlyBars,
      visitorsHint: monthBucket ? "Each browser counted once this month" : "Each browser counted once per day",
    };
  }, [loaded, metric, monthKeys]);

  const rangeLabel = (value: Range) => (isMonthRange(value) ? formatMonth(value) : `Last ${Number.parseInt(value, 10)} days`);

  const header = (
    <PageHeader
      title="Analytics"
      description="Who visits the public website, and how they find it."
      actions={
        <div className="flex items-center gap-2">
          {loading && loaded && <Loader size={16} className="animate-spin text-emerald-600" aria-label="Loading" />}
          <label htmlFor="analytics-range" className="sr-only">
            Date range
          </label>
          <select
            id="analytics-range"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="flex-1 sm:flex-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <optgroup label="Rolling">
              {DAY_PRESETS.map((days) => (
                <option key={days} value={`${days}d`}>
                  Last {days} days
                </option>
              ))}
            </optgroup>
            <optgroup label="Month">
              {[...monthKeys].reverse().map((key) => (
                <option key={key} value={key}>
                  {formatMonth(key)}
                </option>
              ))}
            </optgroup>
          </select>
          <button
            type="button"
            onClick={() => setReloadCount((count) => count + 1)}
            disabled={loading}
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            title="Refresh"
            aria-label="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      }
    />
  );

  if (!view) {
    return (
      <>
        {header}
        {failed ? (
          <div className="py-16 text-center">
            <p className="text-sm text-red-600">Couldn&apos;t load the analytics.</p>
            <button
              type="button"
              onClick={() => setReloadCount((count) => count + 1)}
              className="mt-3 text-sm font-medium text-emerald-700 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <Loader className="animate-spin h-8 w-8 text-emerald-600 mx-auto my-16" />
        )}
      </>
    );
  }

  const { totals, breakdowns, dailyBars, monthlyBars, loadedRange, visitorsHint } = view;
  const metricLabel = METRICS.find((option) => option.id === metric)!.label;
  const hasTraffic = totals.views > 0;

  return (
    <>
      {header}

      {failed && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          Couldn&apos;t load {rangeLabel(range).toLowerCase()} — still showing {rangeLabel(loadedRange).toLowerCase()}.
        </p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Page views" value={formatCount(totals.views)} hint="Every page opened" />
        <StatCard label="Visits" value={formatCount(totals.visits)} hint="Browser-tab sessions" />
        <StatCard label="Visitors" value={formatCount(totals.visitors)} hint={visitorsHint} />
        <StatCard
          label="Pages per visit"
          value={totals.visits > 0 ? (totals.views / totals.visits).toFixed(1) : "—"}
          hint="Page views ÷ visits"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-5 xl:col-span-3 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="text-sm font-semibold text-gray-800">
              {metricLabel} per day <span className="font-normal text-gray-500">· {rangeLabel(loadedRange)}</span>
            </h2>
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5" role="group" aria-label="Chart metric">
              {METRICS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMetric(option.id)}
                  aria-pressed={metric === option.id}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    metric === option.id ? "bg-emerald-700 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <AnalyticsBarChart
            title={`${metricLabel} per day, ${rangeLabel(loadedRange)}`}
            bars={dailyBars}
            labelEvery={Math.max(1, Math.ceil(dailyBars.length / 7))}
          />
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-5 xl:col-span-2 min-w-0">
          <h2 className="text-sm font-semibold text-gray-800 mb-1">
            {metricLabel} per month <span className="font-normal text-gray-500">· last {MONTHS_SHOWN} months</span>
          </h2>
          <p className="text-xs text-gray-400 mb-4">Click a month to view it.</p>
          <AnalyticsBarChart
            title={`${metricLabel} per month, last ${MONTHS_SHOWN} months`}
            bars={monthlyBars}
            selectedKey={isMonthRange(loadedRange) ? loadedRange : null}
            onSelect={setRange}
          />
        </section>
      </div>

      {!hasTraffic && (
        <p className="mb-4 sm:mb-6 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
          No visits recorded for {rangeLabel(loadedRange).toLowerCase()}.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <AnalyticsBreakdownCard title="Traffic sources" unit="visits" counts={breakdowns.sources} />
        <AnalyticsBreakdownCard title="Pages" unit="views" counts={breakdowns.pages} formatLabel={pageLabel} />
        <AnalyticsBreakdownCard
          title="Linking websites & apps"
          unit="visits"
          counts={breakdowns.referrers}
          emptyText="No visits came from another website or app in this period."
        />
        <AnalyticsBreakdownCard title="Countries" unit="visits" counts={breakdowns.countries} formatLabel={countryLabel} />
        <AnalyticsBreakdownCard title="Cities" unit="visits" counts={breakdowns.cities} />
        <AnalyticsBreakdownCard title="Devices" unit="visits" counts={breakdowns.devices} />
        <AnalyticsBreakdownCard title="Browsers" unit="visits" counts={breakdowns.browsers} />
      </div>

      <ShareLinkCard />

      <p className="mt-6 flex items-start gap-2 text-xs text-gray-400">
        <Info size={14} className="shrink-0 mt-px" />
        <span>
          Counts the public website only, in Bangladesh time, from the live site (not local development). No cookies or
          personal data are stored. Browsers you&apos;ve signed in to this dashboard on aren&apos;t counted. Every visit is
          counted, but most WhatsApp and Messenger links hide where they came from, so those visits show up as Direct —
          share links made with the Share link tool above to label them.
        </span>
      </p>
    </>
  );
};

export default AnalyticsScreen;
