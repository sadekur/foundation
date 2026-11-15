import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

interface HeroHeadingProps {
  eyebrow: string;
  title: string;
  location: string;
  subtitle: string;
}

// Rub el Hizb: two overlapping squares, one turned 45°. Drawn in a 100×100 box.
const RUB_EL_HIZB_PATH =
  "M50 5 L61.7 21.7 L81.8 18.2 L78.3 38.3 L95 50 L78.3 61.7 L81.8 81.8 L61.7 78.3 L50 95 L38.3 78.3 L18.2 81.8 L21.7 61.7 L5 50 L21.7 38.3 L18.2 18.2 L38.3 21.7 Z";

const StarGlyph = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path d={RUB_EL_HIZB_PATH} fill="currentColor" />
  </svg>
);

// Gold rule with a star at its centre, fading out at both ends.
const OrnamentRule = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
    <span className="h-px w-12 xs:w-20 sm:w-28 bg-gradient-to-r from-transparent to-amber-400/70" />
    <span className="h-1.5 w-1.5 rotate-45 bg-amber-400/70" />
    <StarGlyph className="h-4 w-4 text-amber-400" />
    <span className="h-1.5 w-1.5 rotate-45 bg-amber-400/70" />
    <span className="h-px w-12 xs:w-20 sm:w-28 bg-gradient-to-l from-transparent to-amber-400/70" />
  </div>
);

export const HeroHeading = ({ eyebrow, title, location, subtitle }: HeroHeadingProps) => (
  <div className="relative">
    {/* Medallion behind the title: a soft gold glow and a slowly turning star outline. */}
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 sm:h-96 sm:w-96"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-3xl" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-amber-300/[0.08] motion-safe:animate-hero-star-spin">
        <path d={RUB_EL_HIZB_PATH} fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 2" />
      </svg>
    </div>

    <div className="relative">
      <p dir="rtl" lang="ar" className="font-amiri text-xl xs:text-2xl sm:text-3xl text-amber-200/90 leading-loose">
        {siteConfig.bismillahArabic}
      </p>

      <div className="mt-4 flex items-center justify-center gap-2 xs:gap-3">
        <span className="h-px w-8 xs:w-12 bg-gradient-to-r from-transparent to-amber-400/60" aria-hidden="true" />
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs xs:text-sm font-semibold tracking-wider text-amber-200 backdrop-blur-sm">
          <StarGlyph className="h-3 w-3 text-amber-400" />
          {eyebrow}
          <StarGlyph className="h-3 w-3 text-amber-400" />
        </span>
        <span className="h-px w-8 xs:w-12 bg-gradient-to-l from-transparent to-amber-400/60" aria-hidden="true" />
      </div>

      <h1 className="mt-5 py-1 text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-snug bg-gradient-to-b from-amber-50 via-amber-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(251,191,36,0.25)]">
        {title}
      </h1>

      <OrnamentRule className="mt-4" />

      <p className="mt-5 text-base xs:text-lg sm:text-xl font-medium text-emerald-50 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>

      <p className="mt-3 inline-flex items-center gap-1.5 text-xs xs:text-sm text-emerald-200/80">
        <MapPin size={14} className="shrink-0 text-amber-400/80" aria-hidden="true" />
        {location}
      </p>
    </div>
  </div>
);
