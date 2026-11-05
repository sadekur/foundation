import type { CSSProperties } from "react";
import { FadeIn } from "./FadeIn";

interface HeroProjectNamesProps {
  names: string[];
}

interface PillPlacement {
  position: CSSProperties;
  className: string;
  durationSeconds: number;
  delaySeconds: number;
}

// `left`/`right` centre a 13rem pill in the gutter beside the 48rem text column, so at xl and up the
// names stay clear of the Qur'anic verse at every width. They have no effect below xl, where the
// pills are static and wrap into a row under the buttons. Index-aligned with `home.heroProjects`.
const GUTTER = "calc((100% - 48rem) / 4 - 6.5rem)";

const PLACEMENTS: PillPlacement[] = [
  { position: { top: "20%", left: GUTTER }, className: "xl:w-52", durationSeconds: 6, delaySeconds: 0 },
  { position: { top: "22%", right: GUTTER }, className: "xl:w-52", durationSeconds: 6.8, delaySeconds: -2.2 },
  { position: { top: "62%", left: GUTTER }, className: "xl:w-52", durationSeconds: 7.2, delaySeconds: -4.1 },
  { position: { top: "60%", right: GUTTER }, className: "xl:w-52", durationSeconds: 6.4, delaySeconds: -1.3 },
  { position: { bottom: "5rem", left: "50%" }, className: "xl:w-max xl:-translate-x-1/2", durationSeconds: 7, delaySeconds: -3.2 },
];

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 text-amber-400" fill="currentColor" aria-hidden="true">
    <rect x="5" y="5" width="14" height="14" />
    <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
  </svg>
);

// The foundation's project names, softly bouncing around the home hero. Calm by design: slow timing,
// the same emerald/gold palette as the rest of the hero, nothing crossing the verse, and no motion at
// all under prefers-reduced-motion.
export const HeroProjectNames = ({ names }: HeroProjectNamesProps) => (
  <FadeIn delayMs={400} className="xl:absolute xl:inset-0 pointer-events-none">
    <ul className="relative h-full flex flex-wrap justify-center gap-x-3 gap-y-5 px-3 xs:px-4 sm:px-6 pb-8 xl:block xl:p-0">
      {names.map((name, index) => {
        const placement = PLACEMENTS[index];
        if (!placement) return null;
        return (
          <li
            key={name}
            className={`xl:absolute xl:flex xl:justify-center ${placement.className}`}
            style={placement.position}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full bg-emerald-950/60 border border-amber-400/30 px-3.5 py-1.5 text-xs xs:text-sm font-medium text-amber-100 shadow-md shadow-emerald-950/30 animate-hero-bounce motion-reduce:animate-none"
              style={{
                animationDuration: `${placement.durationSeconds}s`,
                animationDelay: `${placement.delaySeconds}s`,
              }}
            >
              <StarIcon />
              {name}
            </span>
          </li>
        );
      })}
    </ul>
  </FadeIn>
);
