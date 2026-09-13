/**
 * Route-level loading state. Deliberately quiet: a thin amber bar that pulses
 * only when the visitor allows motion, plus screen-reader text. The page's own
 * navbar and content replace it as soon as the segment streams in.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60svh] flex-1 items-start bg-background"
    >
      <div
        aria-hidden="true"
        className="h-1 w-full bg-accent/70 motion-safe:animate-pulse"
      />
      <span className="sr-only">Ачаалж байна…</span>
    </div>
  );
}
