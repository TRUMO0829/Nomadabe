"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Mountain,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  getAdventureDetailInfo,
  getAdventureGalleryImages,
  getAdventureText,
  type Adventure,
} from "@/lib/adventures";
import { useLanguage } from "./language-provider";

type Props = {
  adventure: Adventure | null;
  onClose: () => void;
};

const DETAIL_COPY = {
  mn: {
    morePhotos: "Нэмэлт зургууд",
    highlights: "Аяллын онцлогууд",
    included: "Үнэд багтсан",
    excluded: "Үнэд багтаагүй",
    itinerary: "Аяллын хөтөлбөр",
  },
  en: {
    morePhotos: "More photos",
    highlights: "Trip highlights",
    included: "Included",
    excluded: "Not included",
    itinerary: "Itinerary",
  },
  zh: {
    morePhotos: "更多照片",
    highlights: "行程亮点",
    included: "费用包含",
    excluded: "费用不含",
    itinerary: "行程安排",
  },
  ja: {
    morePhotos: "追加写真",
    highlights: "ツアーの見どころ",
    included: "料金に含まれるもの",
    excluded: "料金に含まれないもの",
    itinerary: "旅程",
  },
  ko: {
    morePhotos: "추가 사진",
    highlights: "여행 하이라이트",
    included: "포함 사항",
    excluded: "불포함 사항",
    itinerary: "여행 일정",
  },
} as const;

export function AdventureModal({ adventure, onClose }: Props) {
  const { contentLocale, t } = useLanguage();
  const copy = DETAIL_COPY[contentLocale];
  const text = adventure ? getAdventureText(adventure, contentLocale) : null;
  const details = adventure
    ? getAdventureDetailInfo(adventure, contentLocale)
    : null;
  const additionalImages = adventure
    ? getAdventureGalleryImages(adventure).slice(1, 5)
    : [];

  useEffect(() => {
    if (!adventure) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [adventure, onClose]);

  return (
    <AnimatePresence>
      {adventure && text && details && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm lg:p-8"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-6xl overflow-hidden rounded-lg bg-background shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label={t.modal.close}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-md bg-background/90 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-[21/9]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${adventure.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-10">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
                    {text.difficulty}
                  </span>
                  {text.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="max-w-3xl text-balance font-display text-3xl leading-tight lg:text-5xl">
                  {text.title}
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-current" />
                    <strong>{adventure.rating}</strong>
                    <span className="opacity-75">
                      ({adventure.reviews} {t.modal.reviews})
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 opacity-90">
                    <MapPin className="h-4 w-4" />
                    {text.location}, {text.country}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 lg:grid-cols-[1.5fr_1fr] lg:gap-12 lg:p-10">
              <div>
                <h4 className="mb-3 font-display text-xl">{t.modal.about}</h4>
                <p className="leading-relaxed text-muted-foreground">
                  {text.summary}
                </p>

                {additionalImages.length > 0 && (
                  <div className="mt-8">
                    <h4 className="mb-3 font-display text-xl">
                      {copy.morePhotos}
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {additionalImages.map((image, index) => (
                        <div
                          key={image}
                          className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card"
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${image})` }}
                          />
                          <div className="absolute left-3 top-3 rounded-md bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: Mountain,
                      label: t.modal.duration,
                      value: `${adventure.days} ${t.featured.days}`,
                    },
                    { icon: Users, label: t.modal.group, value: text.groupSize },
                    {
                      icon: Calendar,
                      label: t.modal.departure,
                      value: text.nextDeparture ?? t.modal.flexible,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <stat.icon className="mb-2 h-5 w-5 text-accent" />
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="mb-4 mt-9 font-display text-2xl">
                  {copy.highlights}
                </h4>
                <ul className="grid gap-x-6 gap-y-3 text-sm text-foreground/80 sm:grid-cols-2 lg:grid-cols-3">
                  {details.highlights.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Star className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-9 grid gap-7 lg:grid-cols-2">
                  <div>
                    <h4 className="mb-4 font-display text-2xl">
                      {copy.included}
                    </h4>
                    <ul className="space-y-3 text-sm text-foreground/80">
                      {details.included.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-4 font-display text-2xl">
                      {copy.excluded}
                    </h4>
                    <ul className="space-y-3 text-sm text-foreground/80">
                      {details.excluded.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <h4 className="mb-4 mt-10 font-display text-2xl">
                  {copy.itinerary}
                </h4>
                <div className="space-y-3">
                  {details.itinerary.map((step) => (
                    <details
                      key={`${step.day}-${step.title}`}
                      className="group rounded-lg border border-border bg-card"
                    >
                      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                          {step.day}
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-bold text-foreground lg:text-base">
                          {step.title}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="px-5 pb-5 pl-[4.75rem] text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {t.modal.price}
                    </div>
                    <div className="font-display text-4xl">
                      {adventure.price > 0
                        ? `${adventure.price.toLocaleString()}`
                        : t.modal.quote}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {adventure.price > 0
                        ? adventure.currency
                        : t.modal.quoteDetails}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <a
                    href={`#book-${adventure.slug}`}
                    className="block w-full rounded-lg bg-accent px-6 py-3.5 text-center font-semibold text-accent-foreground transition-colors hover:bg-secondary"
                  >
                    {t.modal.register}
                  </a>
                  <a
                    href={`#enquiry-${adventure.slug}`}
                    className="block w-full rounded-lg border border-foreground/15 px-6 py-3.5 text-center font-semibold text-foreground transition-colors hover:border-accent"
                  >
                    {t.modal.ask}
                  </a>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  {t.modal.note}
                </p>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
