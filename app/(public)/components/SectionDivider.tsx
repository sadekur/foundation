export const SectionDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
    <span className="h-px w-10 xs:w-16 bg-amber-400/60" />
    <span className="h-2 w-2 rotate-45 bg-amber-500" />
    <span className="h-px w-10 xs:w-16 bg-amber-400/60" />
  </div>
);
