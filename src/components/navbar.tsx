"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Adventures", href: "#adventures" },
  { label: "Destinations", href: "#destinations" },
  { label: "Journal", href: "#journal" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          {NAV.map((n) => (
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
          <button
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-accent",
              scrolled ? "text-foreground/80" : "text-white/90"
            )}
          >
            <Globe className="w-4 h-4" /> EN
          </button>
          <Link
            href="#contact"
            className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Plan your trip
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
            {NAV.map((n) => (
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
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent text-accent-foreground px-5 py-3 text-sm font-semibold text-center"
            >
              Plan your trip
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
