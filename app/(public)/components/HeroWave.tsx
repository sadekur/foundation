// Each path repeats every 1440 units across its 2880-wide viewBox, so sliding the double-width SVG
// left by half its width loops with no visible jump.
const FRONT_WAVE = "M0,24 Q360,-8 720,24 T1440,24 T2160,24 T2880,24 L2880,48 L0,48 Z";
const BACK_WAVE = "M0,20 Q360,44 720,20 T1440,20 T2160,20 T2880,20 L2880,48 L0,48 Z";

const WAVE_LAYER_CLASS = "absolute bottom-0 left-0 h-full w-[200%] motion-reduce:animate-none";

// The hero's bottom edge: a pale front wave over a faint emerald one, drifting in opposite directions.
export const HeroWave = () => (
  <div className="relative h-10 sm:h-16 overflow-hidden" aria-hidden="true">
    <svg
      className={`${WAVE_LAYER_CLASS} text-emerald-400/20 animate-hero-wave-slow [animation-direction:reverse]`}
      viewBox="0 0 2880 48"
      preserveAspectRatio="none"
    >
      <path fill="currentColor" d={BACK_WAVE} />
    </svg>
    <svg
      className={`${WAVE_LAYER_CLASS} text-stone-50 animate-hero-wave`}
      viewBox="0 0 2880 48"
      preserveAspectRatio="none"
    >
      <path fill="currentColor" d={FRONT_WAVE} />
    </svg>
  </div>
);
