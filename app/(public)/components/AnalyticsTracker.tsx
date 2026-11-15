"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ANALYTICS_IGNORE_KEY, dhakaDayKey, type AnalyticsHitPayload } from "@/lib/utils/analytics";

const LAST_DAY_KEY = "analytics:lastDay";
const LAST_MONTH_KEY = "analytics:lastMonth";
const VISIT_KEY = "analytics:visit";

// Storage can throw (private mode, blocked site data); fall back to memory for this page load so
// a blocked browser still counts once rather than once per page.
const memory = new Map<string, string>();
const read = (storage: () => Storage, key: string) => {
  try {
    return storage().getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
};
const write = (storage: () => Storage, key: string, value: string) => {
  try {
    storage().setItem(key, value);
  } catch {
    memory.set(key, value);
  }
};
const local = () => window.localStorage;
const session = () => window.sessionStorage;

const send = (payload: AnalyticsHitPayload) => {
  const body = JSON.stringify(payload);
  const sent = navigator.sendBeacon?.("/api/analytics/collect", new Blob([body], { type: "application/json" }));
  if (!sent) {
    fetch("/api/analytics/collect", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  }
};

// Sends one anonymous page-view beacon per public route change (see lib/analyticsStore.ts). No
// cookies and no visitor ID: "first visit today/this month" and "first page of this visit" are
// just flags in this browser's own storage. Off outside production builds (so `npm run dev`
// doesn't count) and in any browser the admin has signed in on (AdminShell sets the ignore flag).
export const AnalyticsTracker = () => {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    // Also guards Strict Mode's double effect run — the ref survives it.
    if (!pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    if (read(local, ANALYTICS_IGNORE_KEY) === "1") return;

    const today = dhakaDayKey();
    const month = today.slice(0, 7);
    const newDay = read(local, LAST_DAY_KEY) !== today;
    const newMonth = read(local, LAST_MONTH_KEY) !== month;
    if (newDay) write(local, LAST_DAY_KEY, today);
    if (newMonth) write(local, LAST_MONTH_KEY, month);

    // A visit is one browser-tab session; its first page carries the referrer and link tags.
    // document.referrer stays the original one across client-side navigations, so it's only
    // meaningful here.
    const isEntry = read(session, VISIT_KEY) !== "1";
    if (isEntry) write(session, VISIT_KEY, "1");

    send({
      path: pathname,
      newDay,
      newMonth,
      entry: isEntry ? { referrer: document.referrer, search: window.location.search } : undefined,
    });
  }, [pathname]);

  return null;
};
