"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  ChevronDown,
  Compass,
  Globe,
  Globe2,
  Menu,
  MountainSnow,
  X,
} from "lucide-react";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

const NAV_DESTINATION_COPY = {
  mn: {
    title: "Чиглэлүүд",
    body: "Улс, хот, сонирхол болон аяллын хэв маягаар чиглэлүүдийг үзээрэй.",
    viewAll: "Бүх чиглэлийг харах",
  },
  en: {
    title: "Destinations",
    body: "Browse outbound and domestic routes by country and travel type.",
    viewAll: "View all destinations",
  },
  zh: {
    title: "Destinations",
    body: "Browse outbound and domestic routes by country and travel type.",
    viewAll: "View all destinations",
  },
  ja: {
    title: "Destinations",
    body: "Browse outbound and domestic routes by country and travel type.",
    viewAll: "View all destinations",
  },
  ko: {
    title: "Destinations",
    body: "Browse outbound and domestic routes by country and travel type.",
    viewAll: "View all destinations",
  },
} as const;

const NAV_DESTINATION_GROUPS = [
  {
    icon: MountainSnow,
    title: {
      mn: "Дотоод аялал",
      en: "Domestic",
      zh: "Domestic",
      ja: "Domestic",
      ko: "Domestic",
    },
    items: ["Mongolia", "Khuvsgul", "Gobi", "Terelj"],
  },
  {
    icon: Globe2,
    title: {
      mn: "Гадаад аялал",
      en: "Outbound",
      zh: "Outbound",
      ja: "Outbound",
      ko: "Outbound",
    },
    items: ["Japan", "Korea", "China", "Turkey"],
  },
  {
    icon: Building2,
    title: {
      mn: "Хот, expo",
      en: "Cities & expo",
      zh: "Cities & expo",
      ja: "Cities & expo",
      ko: "Cities & expo",
    },
    items: ["Tokyo", "Seoul", "Shanghai", "Guangzhou"],
  },
  {
    icon: Compass,
    title: {
      mn: "Амралтын хэв маяг",
      en: "Vacation style",
      zh: "Vacation style",
      ja: "Vacation style",
      ko: "Vacation style",
    },
    items: ["Family", "Business", "Island", "Custom"],
  },
] as const;

function DestinationMegaMenu({ locale }: { locale: CopyLocale }) {
  const copy = NAV_DESTINATION_COPY[locale];

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card text-foreground shadow-2xl">
      <div className="grid gap-5 border-b border-border bg-background p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
            {copy.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {copy.body}
          </p>
        </div>
        <Link
          href="/destinations"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-black text-accent-foreground transition-colors hover:bg-secondary lg:justify-self-end"
        >
          {copy.viewAll}
        </Link>
      </div>

      <div className="grid gap-0 md:grid-cols-4">
        {NAV_DESTINATION_GROUPS.map((group) => {
          const Icon = group.icon;

          return (
            <div key={group.title.en} className="border-border p-5 md:border-r md:last:border-r-0">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-black">{group.title[locale]}</h3>
              </div>
              <ul className="grid gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Link
                      href="/destinations"
                      className="block rounded-md px-2 py-1.5 text-sm font-semibold text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const { contentLocale, locale, setLocale, t } = useLanguage();
  const currentLanguage =
    LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Nomadabe Travel"
          className="flex shrink-0 items-center gap-3"
        >
          <span
            aria-hidden="true"
            className="h-10 w-10 rounded-md bg-black bg-[url('/nomadabe-mark.png')] bg-center bg-no-repeat shadow-sm ring-1 ring-white/20 [background-size:175%] [background-position:center_35%] lg:h-12 lg:w-12"
          />
          <span className="flex flex-col leading-none">
            <span className="font-sans text-xl font-black text-accent lg:text-2xl">
              Nomadabe
            </span>
            <span
              className={cn(
                "mt-1 text-[10px] font-bold uppercase lg:text-xs",
                scrolled ? "text-foreground/75" : "text-white/85"
              )}
            >
              Travel
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {t.nav.items.map((n) => {
            const isDestination = n.href === "/destinations";

            if (!isDestination) {
              return (
                <a
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-accent",
                    scrolled ? "text-foreground/80" : "text-white/90"
                  )}
                >
                  {n.label}
                </a>
              );
            }

            return (
              <div
                key={n.href}
                className="relative"
                onMouseEnter={() => setDestinationOpen(true)}
                onMouseLeave={() => setDestinationOpen(false)}
              >
                <a
                  href={n.href}
                  onClick={() => setDestinationOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-accent",
                    destinationOpen && "text-accent",
                    scrolled ? "text-foreground/80" : "text-white/90"
                  )}
                >
                  {n.label}
                </a>

                {destinationOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-[760px] -translate-x-1/2 pt-5">
                    <DestinationMegaMenu locale={contentLocale} />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <div
            aria-label={t.nav.language}
            className={cn(
              "relative rounded-lg border",
              scrolled
                ? "border-border bg-card/90 text-foreground"
                : "border-white/30 bg-black/25 text-white"
            )}
          >
            <button
              type="button"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((value) => !value)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-white/15"
            >
              <Globe className="h-4 w-4" />
              {currentLanguage.short}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  languageOpen && "rotate-180"
                )}
              />
            </button>

            {languageOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] min-w-36 overflow-hidden rounded-lg border border-border bg-card p-1 text-foreground shadow-xl">
                {LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    aria-pressed={locale === language.code}
                    title={language.label}
                    onClick={() => {
                      setLocale(language.code);
                      setLanguageOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-bold transition-colors",
                      locale === language.code
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <span>{language.label}</span>
                    <span>{language.short}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/plan"
            className="rounded-lg bg-accent hover:bg-secondary text-accent-foreground px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            {t.nav.cta}
          </Link>
        </div>

        <button
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "lg:hidden p-2 rounded-md",
            scrolled ? "text-foreground" : "text-white"
          )}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-3">
            <div
              aria-label={t.nav.language}
              className="relative mb-2 w-fit rounded-lg border border-border bg-card text-foreground"
            >
              <button
                type="button"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen((value) => !value)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                {currentLanguage.short}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    languageOpen && "rotate-180"
                  )}
                />
              </button>

              {languageOpen && (
                <div className="absolute left-0 top-[calc(100%+0.5rem)] z-10 min-w-36 overflow-hidden rounded-lg border border-border bg-card p-1 text-foreground shadow-xl">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      aria-pressed={locale === language.code}
                      onClick={() => {
                        setLocale(language.code);
                        setLanguageOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-bold transition-colors",
                        locale === language.code
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <span>{language.label}</span>
                      <span>{language.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {t.nav.items.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium text-foreground/80 hover:text-accent"
              >
                {n.label}
              </a>
            ))}
            <Link
              href="/plan"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-accent text-accent-foreground px-5 py-3 text-sm font-semibold text-center"
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
