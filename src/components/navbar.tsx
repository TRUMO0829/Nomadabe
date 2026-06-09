"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

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
          {t.nav.items.map((n) => (
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
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <div
            aria-label={t.nav.language}
            className={cn(
              "flex items-center gap-1 rounded-lg border p-1",
              scrolled
                ? "border-border bg-card/90 text-foreground"
                : "border-white/30 bg-black/25 text-white"
            )}
          >
            <Globe className="ml-2 w-4 h-4" />
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                type="button"
                aria-pressed={locale === language.code}
                title={language.label}
                onClick={() => setLocale(language.code)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-bold transition-colors",
                  locale === language.code
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-white/15"
                )}
              >
                {language.short}
              </button>
            ))}
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
              className="mb-2 flex w-fit items-center gap-1 rounded-lg border border-border bg-card p-1 text-foreground"
            >
              <Globe className="ml-2 w-4 h-4 text-muted-foreground" />
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  aria-pressed={locale === language.code}
                  onClick={() => setLocale(language.code)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-bold transition-colors",
                    locale === language.code
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {language.short}
                </button>
              ))}
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
