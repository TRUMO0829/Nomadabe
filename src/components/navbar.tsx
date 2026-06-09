"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGE_LABELS, type Language } from "@/lib/i18n";

const NAV: Record<Language, { label: string; href: string }[]> = {
  mn: [
    { label: "Аяллууд", href: "#adventures" },
    { label: "Чиглэлүүд", href: "#destinations" },
    { label: "Сэтгэгдэл", href: "#journal" },
    { label: "Бидний тухай", href: "#about" },
  ],
  en: [
    { label: "Adventures", href: "#adventures" },
    { label: "Destinations", href: "#destinations" },
    { label: "Journal", href: "#journal" },
    { label: "About", href: "#about" },
  ],
};

type Props = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export function Navbar({ language, onLanguageChange }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const planLabel = language === "mn" ? "Аялал төлөвлөх" : "Plan your trip";

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
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "font-display text-2xl lg:text-3xl tracking-tight",
              scrolled ? "text-foreground" : "text-white"
            )}
          >
            Nomadabe
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV[language].map((n) => (
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
            className={cn(
              "flex items-center gap-1 rounded-full border px-2 py-1",
              scrolled ? "border-border bg-background/60" : "border-white/25 bg-white/10"
            )}
          >
            <Globe
              className={cn("w-4 h-4", scrolled ? "text-foreground/70" : "text-white/80")}
            />
            {(["mn", "en"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={language === item}
                onClick={() => onLanguageChange(item)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                  language === item
                    ? "bg-accent text-accent-foreground"
                    : scrolled
                      ? "text-foreground/70 hover:text-accent"
                      : "text-white/85 hover:text-white"
                )}
              >
                {LANGUAGE_LABELS[item]}
              </button>
            ))}
          </div>
          <Link
            href="#contact"
            className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            {planLabel}
          </Link>
        </div>

        <button
          aria-label="Open menu"
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
            {NAV[language].map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium text-foreground/80 hover:text-accent"
              >
                {n.label}
              </a>
            ))}
            <div className="flex items-center gap-2 py-2">
              <Globe className="w-4 h-4 text-foreground/60" />
              {(["mn", "en"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={language === item}
                  onClick={() => onLanguageChange(item)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    language === item
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-foreground/70 hover:text-accent"
                  )}
                >
                  {LANGUAGE_LABELS[item]}
                </button>
              ))}
            </div>
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent text-accent-foreground px-5 py-3 text-sm font-semibold text-center"
            >
              {planLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
