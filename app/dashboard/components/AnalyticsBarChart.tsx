"use client";

import { useState } from "react";

export interface ChartBar {
  key: string;
  label: string; // x-axis label, e.g. "15 Nov"
  value: number; // bar height
  tooltip: string[]; // first line is the heading, the rest are detail lines
}

interface AnalyticsBarChartProps {
  title: string; // names the series, so a single-series chart needs no legend
  bars: ChartBar[];
  labelEvery?: number; // show every Nth x-axis label, so dense ranges don't collide
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
}

const formatCount = (value: number) => value.toLocaleString("en-US");

// Rounds the axis top up to 1/2/2.5/5 × 10ⁿ so the gridline labels are round numbers.
const niceMax = (max: number) => {
  if (max <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(max));
  return ([1, 2, 2.5, 5, 10].map((step) => step * pow).find((candidate) => candidate >= max) ?? 10 * pow);
};

// A single-series column chart in plain divs: thin emerald bars with 4px rounded tops anchored to
// the baseline, recessive gridlines at 0 / half / max, and a hover (or tap / keyboard focus)
// tooltip per bar whose hit target is the full column height. A visually hidden table carries the
// same numbers for screen readers.
const AnalyticsBarChart = ({ title, bars, labelEvery = 1, selectedKey = null, onSelect }: AnalyticsBarChartProps) => {
  const [active, setActive] = useState<number | null>(null);
  const top = niceMax(Math.max(0, ...bars.map((bar) => bar.value)));
  const gap = bars.length > 45 ? 1 : 2;
  const activeBar = active === null ? null : bars[active];
  // Shifting the tooltip by its own width × the bar's position keeps it inside the plot at both ends.
  const activeFraction = active === null ? 0 : (active + 0.5) / bars.length;

  const barColor = (key: string) => {
    if (selectedKey === null) return "bg-emerald-600 group-hover:bg-emerald-700";
    return key === selectedKey ? "bg-emerald-700" : "bg-emerald-300 group-hover:bg-emerald-400";
  };

  return (
    <div>
      <div className="flex">
        <div className="relative w-9 shrink-0 h-40 text-[10px] text-gray-400 text-right" aria-hidden>
          <span className="absolute right-0 top-0 -translate-y-1/2">{formatCount(top)}</span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2">{formatCount(top / 2)}</span>
          <span className="absolute right-0 bottom-0 translate-y-1/2">0</span>
        </div>

        <div className="relative flex-1 min-w-0 h-40 ml-2" onMouseLeave={() => setActive(null)}>
          <div className="absolute inset-x-0 top-0 border-t border-gray-100" aria-hidden />
          <div className="absolute inset-x-0 top-1/2 border-t border-gray-100" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 border-t border-gray-300" aria-hidden />

          <div className="absolute inset-0 flex items-end" style={{ gap }} aria-hidden>
            {bars.map((bar, index) => (
              <div
                key={bar.key}
                tabIndex={0}
                className={`group relative flex-1 min-w-0 h-full flex items-end outline-none ${onSelect ? "cursor-pointer" : ""}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                onClick={() => {
                  setActive(index);
                  onSelect?.(bar.key);
                }}
                onKeyDown={(event) => {
                  if (onSelect && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onSelect(bar.key);
                  }
                }}
              >
                <span
                  className={`w-full rounded-t transition-colors group-focus-visible:ring-2 group-focus-visible:ring-emerald-400 ${barColor(bar.key)}`}
                  style={{ height: `${(bar.value / top) * 100}%`, minHeight: bar.value > 0 ? 2 : 0 }}
                />
              </div>
            ))}
          </div>

          {activeBar && (
            <div
              className="pointer-events-none absolute bottom-full mb-2 z-10 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg whitespace-nowrap"
              style={{ left: `${activeFraction * 100}%`, transform: `translateX(-${activeFraction * 100}%)` }}
            >
              <p className="font-semibold">{activeBar.tooltip[0]}</p>
              {activeBar.tooltip.slice(1).map((line) => (
                <p key={line} className="text-gray-300">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex ml-11 mt-1.5 h-4" style={{ gap }} aria-hidden>
        {bars.map((bar, index) => (
          <div key={bar.key} className="relative flex-1 min-w-0">
            {index % labelEvery === 0 && (
              <span className="absolute left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap">{bar.label}</span>
            )}
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {bars.map((bar) => (
            <tr key={bar.key}>
              <th scope="row">{bar.tooltip[0]}</th>
              <td>{bar.tooltip.slice(1).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsBarChart;
