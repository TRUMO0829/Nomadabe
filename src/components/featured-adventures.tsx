"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Users, Mountain, ArrowUpRight } from "lucide-react";
import { ADVENTURES, type Adventure } from "@/lib/adventures";
import { cn } from "@/lib/utils";
import { AdventureModal } from "./adventure-modal";

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-800",
  Moderate: "bg-amber-100 text-amber-800",
  Challenging: "bg-orange-100 text-orange-800",
  Tough: "bg-red-100 text-red-800",
};

export function FeaturedAdventures() {
  const [selected, setSelected] = useState<Adventure | null>(null);

  return (
    <section id="adventures" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <p className="text-xs lg:text-sm tracking-[0.2em] uppercase text-accent font-semibold mb-4">
              ★ Онцлох аяллууд
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-balance max-w-2xl">
              Бизнес зорилготой аялал, expo, амралт зугаалга.
            </h2>
          </div>
          <a
            href="#all"
            className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-accent transition-colors group whitespace-nowrap"
          >
            Бүх аяллыг харах
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ADVENTURES.map((a, idx) => (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.07 }}
              onClick={() => setSelected(a)}
              className="group cursor-pointer flex flex-col rounded-3xl overflow-hidden bg-card border border-border hover:border-foreground/20 transition-all hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${a.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full",
                      difficultyColor[a.difficulty]
                    )}
                  >
                    {a.difficulty}
                  </span>
                  {a.tags.slice(0, 1).map((t) => (
                    <span
                      key={t}
                      className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-white/95 text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{a.rating}</span>
                    <span className="opacity-70">({a.reviews})</span>
                    <span className="mx-2 opacity-50">·</span>
                    <span>
                      {a.location}, {a.country}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1">
                <h3 className="font-display text-2xl leading-tight text-balance">
                  {a.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mountain className="w-4 h-4" />
                    {a.days} days
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {a.groupSize}
                  </span>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-border mt-auto">
                  <div>
                    <div className="text-xs text-muted-foreground">Үнэ</div>
                    <div className="font-display text-2xl">
                      {a.price > 0 ? `${a.price.toLocaleString()} ${a.currency}` : "Санал авах"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(a);
                    }}
                    className="rounded-full bg-foreground text-background text-sm font-semibold px-4 py-2 group-hover:bg-accent transition-colors"
                  >
                    Дэлгэрэнгүй →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
