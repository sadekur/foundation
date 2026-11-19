"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { GALLERY_PROJECT_OPTIONS } from "./galleryProjectOptions";

// Each value must be a key of lib/analyticsStore.ts's UTM_ALIASES so it lands under the same
// source name as untagged traffic from that app (an unknown value would still be counted, under its own name).
const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "messenger", label: "Messenger" },
  { value: "facebook", label: "Facebook" },
  { value: "telegram", label: "Telegram" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
] as const;

const MAIN_PAGES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/projects", label: "Our Projects" },
  { path: "/activities", label: "Our Activities" },
  { path: "/contact", label: "Contact Us" },
];

// Vercel exposes the production domain to client code, so links copied from a preview deployment
// or local dev still point at the live site; elsewhere fall back to wherever the dashboard is open.
const siteOrigin = () => {
  const production = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  return production ? `https://${production}` : window.location.origin;
};

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API unavailable (non-secure context or permission denied): select-and-copy fallback.
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
};

// Builds a page link tagged with ?utm_source=<channel>, so visits from apps that hide the referrer
// (WhatsApp, Messenger, copied links) are credited to that channel instead of "Direct".
const ShareLinkCard = () => {
  const [path, setPath] = useState("/");
  const [channel, setChannel] = useState<string>(CHANNELS[0].value);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setOrigin(siteOrigin());
    return () => clearTimeout(resetTimer.current);
  }, []);

  const link = `${origin}${path}?utm_source=${channel}`;

  const handleCopy = async () => {
    if (!(await copyText(link))) return;
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white rounded-lg shadow-sm min-w-0 mt-4 sm:mt-6">
      <h2 className="px-4 sm:px-5 py-3 border-b text-sm font-semibold text-gray-800 flex items-center gap-2">
        <Link2 size={16} className="text-emerald-700" />
        Share link
      </h2>
      <div className="p-4 sm:p-5 space-y-4">
        <p className="text-xs text-gray-500">
          Share this link instead of the plain address, so visits from it show under the app you pick in Traffic
          sources rather than as Direct.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] gap-4">
          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1.5">Page</span>
            <select
              value={path}
              onChange={(event) => setPath(event.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <optgroup label="Main pages">
                {MAIN_PAGES.map((page) => (
                  <option key={page.path} value={page.path}>
                    {page.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Project pages">
                {GALLERY_PROJECT_OPTIONS.map((project) => (
                  <option key={project.slug} value={`/projects/${project.slug}`}>
                    {project.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>

          <div>
            <span className="block text-xs font-medium text-gray-600 mb-1.5">Where you&apos;ll share it</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Where you'll share it">
              {CHANNELS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setChannel(option.value)}
                  aria-pressed={channel === option.value}
                  className={`px-3 h-9 rounded-lg border text-sm font-medium transition-colors ${
                    channel === option.value
                      ? "bg-emerald-700 border-emerald-700 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            value={link}
            onFocus={(event) => event.target.select()}
            aria-label="Link to share"
            className="flex-1 min-w-0 h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!origin}
            className="shrink-0 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShareLinkCard;
