import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The shared page container: one max width and one set of side gutters for
 * every public section, so edges line up as you scroll from band to band.
 */
export const CONTAINER = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(CONTAINER, className)}>{children}</div>;
}

/**
 * The one section-heading treatment: an eyebrow with an amber rule, then the
 * heading. `tone` picks eyebrow colours that stay readable on dark bands
 * (amber) and on light ones (a darker gold that clears 4.5:1 on cream).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  id,
  tone = "dark",
  align = "start",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
  tone?: "dark" | "light";
  align?: "start" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div className={cn(centered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "nav-text inline-flex items-center gap-2.5 text-xs uppercase",
            tone === "dark" ? "text-accent" : "text-accent-text"
          )}
        >
          <span
            aria-hidden="true"
            className={cn("h-px w-8", tone === "dark" ? "bg-accent" : "bg-accent-text")}
          />
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          "max-w-3xl text-balance text-3xl leading-tight sm:text-4xl lg:text-5xl",
          eyebrow ? "mt-5" : null,
          centered && "mx-auto"
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base",
            tone === "dark" ? "text-white/72" : "text-muted-foreground",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
