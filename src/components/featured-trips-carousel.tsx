"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";
import ParticleText from "./ui/particle-text-canvas";

const COPY = {
  mn: {
    eyebrow: "Онцлох аяллууд",
    title: "Онцлох аяллууд",
    details: "Дэлгэрэнгүй",
    day: "хоног",
  },
  en: {
    eyebrow: "Featured trips",
    title: "Featured trips",
    details: "Details",
    day: "days",
  },
  zh: {
    eyebrow: "精选旅行",
    title: "精选旅行",
    details: "详情",
    day: "天",
  },
  ja: {
    eyebrow: "注目ツアー",
    title: "注目ツアー",
    details: "詳細",
    day: "日",
  },
  ko: {
    eyebrow: "추천 여행",
    title: "추천 여행",
    details: "자세히",
    day: "일",
  },
} as const;

type FeaturedTripsCarouselProps = {
  adventures?: Adventure[];
  variant?: "editorial" | "compact";
};

function uniqueBySlug(trips: Adventure[]) {
  const seen = new Set<string>();

  return trips.filter((trip) => {
    if (seen.has(trip.slug)) return false;
    seen.add(trip.slug);
    return true;
  });
}

function getFeaturedTrips(adventures: Adventure[]) {
  return uniqueBySlug([
    ...adventures.filter((adventure) => adventure.featured),
    ...ADVENTURES.filter((adventure) => adventure.featured),
  ]).slice(0, 4);
}

function FeaturedTripScrollPanel({
  adventure,
  copy,
  index,
  onSelect,
}: {
  adventure: Adventure;
  copy: (typeof COPY)[keyof typeof COPY];
  index: number;
  onSelect: (adventure: Adventure) => void;
}) {
  const { contentLocale } = useLanguage();
  const panelRef = useRef<HTMLElement>(null);
  const text = getAdventureText(adventure, contentLocale);
  const imageOnRight = index % 2 === 1;
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start start", "end end"],
  });
  const imageClipPath = useTransform(
    scrollYProgress,
    [0, 0.42, 0.74, 1],
    imageOnRight
      ? [
          "inset(16vh 3vw 30vh 68vw round 30px)",
          "inset(7vh 1vw 7vh 24vw round 18px)",
          "inset(-3vh -3vw -3vh -3vw round 0px)",
          "inset(-3vh -3vw -3vh -3vw round 0px)",
        ]
      : [
          "inset(16vh 68vw 30vh 3vw round 30px)",
          "inset(7vh 24vw 7vh 1vw round 18px)",
          "inset(-3vh -3vw -3vh -3vw round 0px)",
          "inset(-3vh -3vw -3vh -3vw round 0px)",
        ],
  );
  const imageScale = useTransform(scrollYProgress, [0, 0.74], [1.02, 1.08]);
  const textY = useTransform(scrollYProgress, [0.16, 0.34, 1], [36, 0, 0]);
  const textX = useTransform(
    scrollYProgress,
    [0.16, 0.34, 1],
    imageOnRight ? [-40, 0, 0] : [40, 0, 0],
  );
  const textOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const panelBackground = useTransform(
    scrollYProgress,
    [0, 0.52, 0.74, 1],
    [
      "rgba(255,255,255,0.96)",
      "rgba(255,255,255,0.9)",
      "rgba(255,255,255,0)",
      "rgba(255,255,255,0)",
    ],
  );
  const panelBorderColor = useTransform(
    scrollYProgress,
    [0, 0.74, 1],
    [
      "rgba(234,223,172,1)",
      "rgba(255,255,255,0.28)",
      "rgba(255,255,255,0.28)",
    ],
  );
  const panelTextColor = useTransform(
    scrollYProgress,
    [0, 0.58, 0.74, 1],
    ["#11100b", "#11100b", "#fffdf3", "#fffdf3"],
  );
  const panelMutedColor = useTransform(
    scrollYProgress,
    [0, 0.58, 0.74, 1],
    ["#11100b", "#11100b", "#fffdf3", "#fffdf3"],
  );
  const panelAccentColor = useTransform(
    scrollYProgress,
    [0, 0.58, 0.74, 1],
    ["#b89422", "#b89422", "#f0d57a", "#f0d57a"],
  );
  const chipBackground = useTransform(
    scrollYProgress,
    [0, 0.74, 1],
    ["rgba(255,255,255,1)", "rgba(0,0,0,0.28)", "rgba(0,0,0,0.28)"],
  );
  const chipBorderColor = useTransform(
    scrollYProgress,
    [0, 0.74, 1],
    ["rgba(234,223,172,1)", "rgba(255,255,255,0.42)", "rgba(255,255,255,0.42)"],
  );

  return (
    <section
      ref={panelRef}
      className="relative hidden h-[calc(280svh/var(--site-scale))] bg-white lg:block"
    >
      <div className="sticky top-0 h-[calc(100svh/var(--site-scale))] overflow-hidden bg-white">
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden shadow-[0_36px_100px_rgba(17,16,11,0.18)] will-change-transform"
          style={{
            clipPath: imageClipPath,
          }}
        >
          <motion.div className="relative h-full w-full" style={{ scale: imageScale }}>
            <Image
              src={adventure.image}
              alt={text.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/44 via-black/10 to-transparent" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute top-[20vh] z-10 w-[min(32vw,460px)] rounded-[22px] border p-[clamp(1rem,1.8vw,1.8rem)] shadow-[0_22px_70px_rgba(17,16,11,0.16)] backdrop-blur"
          style={{
            left: imageOnRight ? "clamp(1.5rem, 5vw, 6rem)" : "auto",
            right: imageOnRight ? "auto" : "clamp(1.5rem, 5vw, 6rem)",
            backgroundColor: panelBackground,
            borderColor: panelBorderColor,
            color: panelTextColor,
            opacity: textOpacity,
            x: textX,
            y: textY,
          }}
        >
          <div className="max-w-xl">
            <div className="trip-meta-text mb-4 flex flex-wrap gap-2 text-xs">
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[0_12px_32px_rgba(17,16,11,0.06)]"
                style={{ backgroundColor: chipBackground, borderColor: chipBorderColor }}
              >
                <motion.span style={{ color: panelAccentColor }}>
                  <MapPin className="h-3.5 w-3.5" />
                </motion.span>
                {text.location}
              </motion.span>
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[0_12px_32px_rgba(17,16,11,0.06)]"
                style={{ backgroundColor: chipBackground, borderColor: chipBorderColor }}
              >
                <motion.span style={{ color: panelAccentColor }}>
                  <CalendarDays className="h-3.5 w-3.5" />
                </motion.span>
                {adventure.days} {copy.day}
              </motion.span>
            </div>

            <h3 className="trip-header-title trip-header-title--hero max-w-[12ch] text-balance !text-[clamp(1.75rem,3.4vw,3.25rem)] !leading-[0.96]">
              {text.title}
            </h3>
            <motion.p
              className="trip-copy-text mt-4 max-w-xl text-sm leading-7 lg:text-base"
              style={{ color: panelMutedColor }}
            >
              {text.summary}
            </motion.p>
            <button
              type="button"
              onClick={() => onSelect(adventure)}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-accent bg-accent px-6 text-xs uppercase text-accent-foreground transition-colors hover:bg-white hover:text-[#11100b]"
            >
              {copy.details}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedTripsScrollStack({
  copy,
  featuredTrips,
  onSelect,
}: {
  copy: (typeof COPY)[keyof typeof COPY];
  featuredTrips: Adventure[];
  onSelect: (adventure: Adventure) => void;
}) {
  const { contentLocale } = useLanguage();

  return (
    <section id="trips" className="bg-white text-black">
      <div className="relative hidden min-h-[calc(58svh/var(--site-scale))] items-center justify-center bg-white px-6 pt-24 lg:flex">
        <h2 className="sr-only">{copy.title}</h2>
        <ParticleText
          text={copy.title}
          colors={["#11100b", "#8f7020", "#ffd400"]}
          particleGap={3}
          particleSize={1.35}
          mouseRadius={170}
          className="h-[clamp(5rem,11vw,9rem)] w-full max-w-5xl"
          canvasClassName="pointer-events-auto"
        />
      </div>

      {featuredTrips.map((adventure, index) => (
        <FeaturedTripScrollPanel
          key={adventure.id}
          adventure={adventure}
          copy={copy}
          index={index}
          onSelect={onSelect}
        />
      ))}

      <div className="space-y-5 bg-white px-4 py-8 sm:px-6 lg:hidden">
        {featuredTrips.map((adventure) => {
          const text = getAdventureText(adventure, contentLocale);

          return (
            <article
              key={adventure.id}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={adventure.image}
                  alt={text.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="trip-meta-text mb-3 flex flex-wrap gap-2 text-[10px] uppercase text-white">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/36 px-2.5 py-1 backdrop-blur">
                      <MapPin className="h-3.5 w-3.5" />
                      {text.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/36 px-2.5 py-1 backdrop-blur">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {adventure.days} {copy.day}
                    </span>
                  </div>
                  <h3 className="trip-header-title trip-header-title--compact max-w-[14ch] text-balance text-white">
                    {text.title}
                  </h3>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <p className="trip-copy-text text-sm leading-7 text-black">
                  {text.summary}
                </p>
                <button
                  type="button"
                  onClick={() => onSelect(adventure)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-accent bg-accent px-5 text-xs uppercase text-accent-foreground transition-colors hover:bg-white hover:text-black"
                >
                  {copy.details}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedTripsGrid({
  copy,
  featuredTrips,
  onSelect,
}: {
  copy: (typeof COPY)[keyof typeof COPY];
  featuredTrips: Adventure[];
  onSelect: (adventure: Adventure) => void;
}) {
  const { contentLocale } = useLanguage();

  return (
    <section id="trips" className="bg-white px-3 py-4 text-[#1d1d1f] sm:px-4 lg:px-5">
      <div className="mx-auto max-w-[1800px]">
        <div className="mx-auto max-w-3xl px-4 py-8 text-center lg:py-12">
          <h2 className="!normal-case text-[clamp(2.1rem,4vw,4.25rem)] leading-[1.02] text-[#1d1d1f]">
            {copy.title}
          </h2>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {featuredTrips.map((adventure, index) => {
            const text = getAdventureText(adventure, contentLocale);
            return (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative isolate min-h-[560px] overflow-hidden bg-[#11100b] text-center lg:min-h-[680px]"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={adventure.image}
                    alt={text.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>

                <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pt-12 drop-shadow-[0_2px_12px_rgba(0,0,0,0.72)] sm:pt-14 lg:pt-16">
                  <h3 className="max-w-[14ch] !normal-case text-balance text-[clamp(2.15rem,4.6vw,4.25rem)] leading-[0.98] text-white">
                    {text.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-white lg:text-base">
                    {text.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => onSelect(adventure)}
                      className="nav-text inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm text-accent-foreground transition-colors hover:bg-white hover:text-[#11100b]"
                    >
                      {copy.details}
                    </button>
                  </div>
                </div>

              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturedTripsCarousel({
  adventures = ADVENTURES,
  variant = "editorial",
}: FeaturedTripsCarouselProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const [selected, setSelected] = useState<Adventure | null>(null);
  const featuredTrips = getFeaturedTrips(adventures).slice(
    0,
    variant === "compact" ? 4 : 3,
  );

  function handleFeaturedRegister() {
    setSelected(null);

    window.setTimeout(() => {
      const requestSection = document.getElementById("contact");

      if (!requestSection) {
        window.location.href = "/plan#contact";
        return;
      }

      requestSection.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#contact`
      );
    }, 0);

    return true;
  }

  if (featuredTrips.length === 0) {
    return null;
  }

  if (variant === "compact") {
    return (
      <>
        <FeaturedTripsGrid
          copy={copy}
          featuredTrips={featuredTrips}
          onSelect={setSelected}
        />
        <AdventureModal
          adventure={selected}
          onClose={() => setSelected(null)}
          onRegisterClick={handleFeaturedRegister}
        />
      </>
    );
  }

  return (
    <>
      <FeaturedTripsScrollStack
        copy={copy}
        featuredTrips={featuredTrips}
        onSelect={setSelected}
      />
      <AdventureModal
        adventure={selected}
        onClose={() => setSelected(null)}
        onRegisterClick={handleFeaturedRegister}
      />
    </>
  );
}
