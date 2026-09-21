import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * One band of a page, on a named ground.
 *
 * Lifted out of the `Band` helper that used to live inside about-showcase, so
 * the site's rhythm — dark photographic hero, light reading content, dark
 * footer — is something a page opts into rather than something each page
 * re-invents in hex.
 *
 * `tone` applies a surface scope from globals.css, which swaps the ground
 * tokens (`--background`, `--foreground`, `--card`, `--muted-foreground`,
 * `--border`) and the photo scrim underneath everything in the band. Brand
 * colour is deliberately not part of a scope, so `bg-accent` is the same gold
 * on either ground.
 *
 * The defaults matter: a band with no props is light, content-height reading
 * copy. Only a hero has to say anything.
 */
export type SurfaceTone = "light" | "dark";
export type SurfaceHeight = "auto" | "band" | "screen";

const HEIGHT_CLASS: Record<SurfaceHeight, string> = {
  auto: "",
  band: "min-h-[45svh]",
  // .about-screen is 100svh, divided by --site-scale to survive the global zoom.
  screen: "about-screen",
};

export function Surface({
  tone = "light",
  height = "auto",
  photo,
  hairline = true,
  navSentinel = false,
  className,
  innerClassName,
  children,
}: {
  tone?: SurfaceTone;
  height?: SurfaceHeight;
  /** Background image washed toward `--scrim-*`, i.e. dark on a dark tone and cream on a light one. */
  photo?: string;
  hairline?: boolean;
  /** Marks the bottom edge of the band the navbar sits over, so it can pick its own colour. */
  navSentinel?: boolean;
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        tone === "dark" ? "surface-dark" : "surface-light",
        "relative overflow-hidden bg-background text-foreground",
        HEIGHT_CLASS[height],
        className
      )}
    >
      {photo ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${photo}')` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, var(--scrim-strong) 0%, var(--scrim-soft) 50%, var(--scrim-strong) 100%)",
            }}
          />
        </>
      ) : null}

      <div
        className={cn(
          "relative mx-auto flex w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24",
          HEIGHT_CLASS[height],
          innerClassName
        )}
      >
        {hairline ? (
          /* content-width hairline divider — aligns with the section content */
          <div
            aria-hidden="true"
            className="absolute left-5 right-5 top-0 h-px bg-border sm:left-8 sm:right-8 lg:left-12 lg:right-12"
          />
        ) : null}
        {children}
      </div>

      {navSentinel ? (
        <span
          aria-hidden="true"
          data-nav-sentinel=""
          className="pointer-events-none absolute bottom-0 left-0 h-px w-px"
        />
      ) : null}
    </div>
  );
}
