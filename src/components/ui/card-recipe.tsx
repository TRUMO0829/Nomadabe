import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * One card recipe, shared by every trip / stay card on the site.
 *
 * The homepage previously carried four different card treatments — different
 * borders, different scrim strengths, different meta rows — so nothing read as
 * one system. These pieces fix the shared visual language (frame, image scrim,
 * meta chips, title, call to action) while each caller keeps its own sizing,
 * because a carousel card and a three-up grid card genuinely need different
 * dimensions.
 *
 * House style: square corners, hairline border, amber accent, bottom-anchored
 * text over a single scrim strength.
 */

export const ACCENT = "#FFD400";

/** Outer frame. Square corners and a hairline border, everywhere. */
export const CARD_FRAME =
  "group relative isolate block overflow-hidden border border-white/12 bg-[#11100b] text-left " +
  "shadow-[0_10px_30px_rgba(17,16,11,0.10)] transition-all duration-300 " +
  "hover:-translate-y-1 hover:border-[rgba(255,212,0,0.55)] hover:shadow-[0_24px_60px_rgba(17,16,11,0.22)]";

/** Frame for cards that sit on a light surface and carry a text body below. */
export const CARD_FRAME_LIGHT =
  "group relative isolate flex flex-col overflow-hidden border border-[#eadfac] bg-[#fffdf3] text-left " +
  "shadow-[0_10px_30px_rgba(17,16,11,0.08)] transition-all duration-300 " +
  "hover:-translate-y-1 hover:border-[#d8c56d] hover:shadow-[0_24px_60px_rgba(17,16,11,0.18)]";

/**
 * A single scrim for the whole site, with explicit stops rather than Tailwind's
 * default 0/50/100 so it stays dark across the whole text well. The weakest
 * previous value (from-black/48) left white text sitting on pale skies and
 * lake water, which is exactly where these cards' photos are brightest.
 */
const SCRIM =
  "bg-[linear-gradient(to_top,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.78)_26%,rgba(0,0,0,0.44)_58%,rgba(0,0,0,0.10)_100%)]";

export function CardMedia({
  src,
  alt,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        quality={90}
        className={cn(
          "object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105",
          className
        )}
      />
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", SCRIM)} />
    </>
  );
}

/** Bottom-anchored content well. All overlay text lives here. */
export function CardOverlay({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-10 flex flex-col px-5 pb-5 text-white sm:px-6 sm:pb-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export type CardMetaItem = {
  label: string;
  icon?: LucideIcon;
};

/**
 * The meta row: country, location, duration. Rendered as chips over an image
 * and as plain text on a light surface, but always the same order and casing.
 */
export function CardMeta({
  items,
  tone = "overlay",
  className,
}: {
  items: CardMetaItem[];
  tone?: "overlay" | "light";
  className?: string;
}) {
  // Drop empties and repeats. Country and location are often the same value,
  // and "Хятад · Хятад · 8 хоног" is noise on a card that should stay minimal.
  const seen = new Set<string>();
  const visible = items.filter((item) => {
    const label = item.label?.trim();

    if (!label || seen.has(label.toLowerCase())) {
      return false;
    }

    seen.add(label.toLowerCase());
    return true;
  });

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Keyed by position, not label: country and location are frequently the
          same word (a trip to "Хятад" in "Хятад"), which collided as a key. */}
      {visible.map(({ label, icon: Icon }, index) => (
        <span
          key={`${index}-${label}`}
          className={cn(
            "trip-meta-text inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] uppercase",
            tone === "overlay"
              ? "border-white/25 bg-black/35 text-white backdrop-blur"
              : "border-[#eadfac] bg-white text-[#8a6f12]"
          )}
        >
          {Icon ? (
            <Icon
              className="h-3.5 w-3.5"
              style={{ color: tone === "overlay" ? ACCENT : "#b89422" }}
            />
          ) : null}
          {label}
        </span>
      ))}
    </div>
  );
}

export function CardTitle({
  children,
  tone = "overlay",
  className,
}: {
  children: ReactNode;
  tone?: "overlay" | "light";
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "trip-header-title trip-header-title--compact mt-3 max-w-[16ch] text-balance",
        tone === "overlay"
          ? "text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]"
          : "text-[#11100b]",
        className
      )}
    >
      {children}
    </h3>
  );
}

/** The one call-to-action style: a filled amber block with an arrow. */
export const CARD_CTA =
  "nav-text relative z-10 inline-flex min-h-10 items-center justify-center gap-2 bg-accent px-5 " +
  "text-[10px] uppercase text-accent-foreground transition-all duration-200 " +
  "hover:gap-3 hover:shadow-[0_8px_22px_rgba(255,212,0,0.45)]";
