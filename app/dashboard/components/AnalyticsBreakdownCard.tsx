"use client";

import { useMemo, useState } from "react";

const TOP_ROWS = 8;

interface AnalyticsBreakdownCardProps {
  title: string;
  unit: string; // what the counts are, e.g. "visits" — shown in the column header
  counts: Record<string, number>;
  formatLabel?: (key: string) => { label: string; detail?: string };
  emptyText?: string;
}

// One ranked breakdown (top sources, pages, countries…): a table whose rows carry a faint bar
// scaled to the top row, so the ranking reads at a glance while the numbers stay in plain text.
const AnalyticsBreakdownCard = ({
  title,
  unit,
  counts,
  formatLabel = (key) => ({ label: key }),
  emptyText = "Nothing recorded in this period.",
}: AnalyticsBreakdownCardProps) => {
  const [showAll, setShowAll] = useState(false);

  const rows = useMemo(
    () =>
      Object.entries(counts)
        .filter(([, value]) => value > 0)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    [counts]
  );
  const total = rows.reduce((sum, [, value]) => sum + value, 0);
  const topValue = rows[0]?.[1] ?? 0;
  const visibleRows = showAll ? rows : rows.slice(0, TOP_ROWS);

  return (
    <section className="bg-white rounded-lg shadow-sm min-w-0">
      <h2 className="px-4 sm:px-5 py-3 border-b text-sm font-semibold text-gray-800">{title}</h2>
      {rows.length === 0 ? (
        <p className="px-4 sm:px-5 py-6 text-sm text-gray-500">{emptyText}</p>
      ) : (
        <>
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-gray-400">
                <th scope="col" className="px-4 sm:px-5 pt-2.5 pb-1 text-left font-medium">Name</th>
                <th scope="col" className="w-20 px-2 pt-2.5 pb-1 text-right font-medium">{unit}</th>
                <th scope="col" className="w-16 pl-2 pr-4 sm:pr-5 pt-2.5 pb-1 text-right font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map(([key, value]) => {
                const { label, detail } = formatLabel(key);
                return (
                  <tr key={key}>
                    <td className="px-4 sm:px-5 py-1.5">
                      <div className="relative">
                        <span
                          className="absolute inset-y-0 -left-2 rounded bg-emerald-50"
                          style={{ width: `calc(${(value / topValue) * 100}% + 0.5rem)` }}
                          aria-hidden
                        />
                        <span className="relative block truncate text-gray-800" title={detail ? `${label} (${detail})` : label}>
                          {label}
                          {detail && <span className="ml-1.5 text-xs text-gray-400">{detail}</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums text-gray-800">{value.toLocaleString("en-US")}</td>
                    <td className="pl-2 pr-4 sm:pr-5 py-1.5 text-right tabular-nums text-gray-500">
                      {Math.round((value / total) * 100)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 sm:px-5 py-2.5">
            {rows.length > TOP_ROWS ? (
              <button
                type="button"
                onClick={() => setShowAll((current) => !current)}
                className="text-xs font-medium text-emerald-700 hover:underline"
              >
                {showAll ? "Show top 8" : `Show all ${rows.length}`}
              </button>
            ) : (
              <span className="block h-4" aria-hidden />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default AnalyticsBreakdownCard;
