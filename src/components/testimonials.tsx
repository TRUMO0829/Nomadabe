"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "./language-provider";

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&q=80&auto=format&fit=crop&crop=faces",
];

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section id="journal" className="bg-muted py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-7 flex flex-col justify-between gap-5 lg:mb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground lg:text-xs">
              ★ {t.testimonials.eyebrow}
            </p>
            <h2 className="font-display text-2xl text-balance sm:text-3xl lg:text-4xl">
              {t.testimonials.titleStart}{" "}
              <span className="italic">{t.testimonials.titleEmphasis}</span>{" "}
              {t.testimonials.titleEnd}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-foreground text-foreground"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-foreground/75 lg:text-sm">
              {t.testimonials.rating}
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
          {t.testimonials.quotes.map((quote, idx) => (
            <motion.figure
              key={quote.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-accent text-accent"
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/80 lg:text-base">
                “{quote.body}”
              </blockquote>
              <figcaption className="mt-1 flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${AVATARS[idx]})` }}
                />
                <div>
                  <div className="text-sm font-semibold">{quote.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {quote.trip}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
