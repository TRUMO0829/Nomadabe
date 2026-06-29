"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { getAdventureText, type Adventure } from "@/lib/adventures";
import { getHighResolutionImageUrl } from "@/lib/image-quality";
import { useLanguage } from "./language-provider";

type StickyTripCopy = {
  eyebrow: string;
  title?: string;
  body?: string;
  priceFrom?: string;
  details: string;
  day: string;
  route?: string;
};

type StickyHorizontalTripShowcaseProps = {
  id?: string;
  trips: Adventure[];
  copy: StickyTripCopy;
  onSelect: (adventure: Adventure) => void;
};

function TripPanel({
  adventure,
  copy,
  onSelect,
  compact = false,
}: {
  adventure: Adventure;
  copy: StickyTripCopy;
  onSelect: (adventure: Adventure) => void;
  compact?: boolean;
}) {
  const { contentLocale } = useLanguage();
  const panelRef = useRef<HTMLElement>(null);
  const text = getAdventureText(adventure, contentLocale);
  const image = getHighResolutionImageUrl(adventure.image);
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });
  const imageWidth = useTransform(
    scrollYProgress,
    [0.04, 0.34, 0.52, 1],
    ["38vw", "74vw", "100vw", "100vw"],
  );
  const imageHeight = useTransform(
    scrollYProgress,
    [0.04, 0.34, 0.52, 1],
    ["62vh", "86vh", "100vh", "100vh"],
  );
  const imageTop = useTransform(
    scrollYProgress,
    [0.04, 0.34, 0.52, 1],
    ["19vh", "7vh", "0vh", "0vh"],
  );
  const imageLeft = useTransform(
    scrollYProgress,
    [0.04, 0.34, 0.52, 1],
    ["5vw", "1vw", "0vw", "0vw"],
  );
  const imageScale = useTransform(scrollYProgress, [0.04, 0.52], [1, 1.08]);
  const imageRadius = useTransform(
    scrollYProgress,
    [0.04, 0.52],
    ["34px", "0px"],
  );
  const textY = useTransform(scrollYProgress, [0.18, 0.38, 1], [44, 0, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.12, 0.32, 1], [0, 1, 1]);

  if (!compact) {
    return (
      <section
        ref={panelRef}
        className="relative hidden h-[calc(190svh/var(--site-scale))] bg-white lg:block"
      >
        <div className="sticky top-0 h-[calc(100svh/var(--site-scale))] overflow-hidden bg-white">
          <motion.div
            className="absolute z-0 overflow-hidden shadow-[0_36px_100px_rgba(17,16,11,0.18)]"
            style={{
              width: imageWidth,
              height: imageHeight,
              top: imageTop,
              left: imageLeft,
              borderRadius: imageRadius,
            }}
          >
            <motion.div
              className="relative h-full w-full"
              style={{ scale: imageScale }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/24 to-black/14" />
              <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-black/78 via-black/36 to-transparent" />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-0 right-0 top-0 z-10 flex w-[46%] items-center justify-start px-[clamp(3rem,7vw,8rem)] text-white"
            style={{ opacity: textOpacity, y: textY }}
          >
            <div className="max-w-xl text-white drop-shadow-[0_18px_42px_rgba(0,0,0,0.58)]">
              <div className="trip-meta-text mb-6 flex flex-wrap gap-3 text-sm text-white">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-black/24 px-4 py-2 backdrop-blur">
                  <MapPin className="h-4 w-4 text-[#f0d57a]" />
                  {text.location}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-black/24 px-4 py-2 backdrop-blur">
                  <CalendarDays className="h-4 w-4 text-[#f0d57a]" />
                  {adventure.days} {copy.day}
                </span>
              </div>

              {copy.route ? (
                <p className="trip-meta-text mb-4 text-sm uppercase tracking-[0.2em] text-[#f0d57a]">
                  {copy.route}
                </p>
              ) : null}
              <h3 className="trip-header-title trip-header-title--hero max-w-[12ch] text-balance text-white">
                {text.title}
              </h3>
              <p className="trip-copy-text mt-5 max-w-xl text-base leading-8 text-white/82 lg:text-lg">
                {text.summary}
              </p>
              <button
                type="button"
                onClick={() => onSelect(adventure)}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[#f0d57a] bg-[#f0d57a] px-7 text-sm uppercase text-black transition-colors hover:bg-transparent hover:text-[#f0d57a]"
              >
                {copy.details}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-[0_18px_44px_rgba(17,16,11,0.1)]">
      <div className="relative aspect-[5/4] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out hover:scale-[1.025]"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/18 via-transparent to-black/8" />
      </div>

      <div className="space-y-4 bg-white px-5 py-6 text-black">
        <div className="trip-meta-text mb-5 flex flex-wrap gap-2 text-xs text-black lg:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfac] bg-white px-3 py-2">
            <MapPin className="h-3.5 w-3.5 text-black" />
            {text.location}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfac] bg-white px-3 py-2">
            <CalendarDays className="h-3.5 w-3.5 text-black" />
            {adventure.days} {copy.day}
          </span>
        </div>

        <div className="space-y-4">
          {copy.route ? (
            <p className="trip-meta-text text-[11px] uppercase text-black">
              {copy.route}
            </p>
          ) : null}
          <h3 className="trip-header-title trip-header-title--compact text-balance text-black">
            {text.title}
          </h3>
          <p className="trip-copy-text max-w-2xl text-sm leading-7 text-black">
            {text.summary}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onSelect(adventure)}
            className="trip-meta-text inline-flex min-h-12 items-center justify-center rounded-full border border-black bg-black px-6 text-sm uppercase text-white transition-colors hover:bg-white hover:text-black"
          >
            {copy.details}
          </button>
        </div>
      </div>
    </article>
  );
}

export function StickyHorizontalTripShowcase({
  id,
  trips,
  copy,
  onSelect,
}: StickyHorizontalTripShowcaseProps) {
  if (trips.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className="relative bg-white text-[#11100b]"
    >
      {trips.map((adventure) => (
        <TripPanel
          key={adventure.id}
          adventure={adventure}
          copy={copy}
          onSelect={onSelect}
        />
      ))}

      <div className="relative z-10 space-y-5 bg-white px-4 py-6 sm:px-6 lg:hidden">
        {trips.map((adventure) => (
          <TripPanel
            key={adventure.id}
            adventure={adventure}
            copy={copy}
            onSelect={onSelect}
            compact
          />
        ))}
      </div>
    </section>
  );
}
