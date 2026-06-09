"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Language } from "@/lib/i18n";

const QUOTES = [
  {
    name: "Sofia M.",
    trip: "Altai Tavan Bogd · 9 days",
    body: "I booked solo and ended up with a tiny crew of six and a guide who knew every ridge by name. The morning we crossed the glacier I cried — not from cold, just awe.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80&auto=format&fit=crop&crop=faces",
  },
  {
    name: "Marcus L.",
    trip: "Eagle hunters · 6 days",
    body: "Staying in a Kazakh family's ger, drinking salty tea while the eagle perched two metres away — Nomadabe pulled off something I genuinely didn't think was bookable.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80&auto=format&fit=crop&crop=faces",
  },
  {
    name: "Anya K.",
    trip: "Gobi expedition · 7 days",
    body: "The logistics were flawless and the trip was *not* the polished safari version of the Gobi. We slept under stars, ate with herders, and broke down twice. Perfect.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&q=80&auto=format&fit=crop&crop=faces",
  },
];

const TEXT = {
  mn: {
    eyebrow: "★ Аялагчдын сэтгэгдэл",
    title: "Манай аялагчид юу гэж хэлдэг вэ.",
    reviews: "4.9 / 5 · 412 баталгаажсан үнэлгээ",
  },
  en: {
    eyebrow: "★ From the campfire",
    title: "What our adventurers actually say.",
    reviews: "4.9 / 5 · 412 verified reviews",
  },
};

export function Testimonials({ language }: { language: Language }) {
  const text = TEXT[language];

  return (
    <section id="journal" className="py-24 lg:py-32 bg-muted">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <p className="text-xs lg:text-sm tracking-[0.2em] uppercase text-accent font-semibold mb-4">
              {text.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-balance">
              {text.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm font-semibold">
              {text.reviews}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          {QUOTES.map((q, idx) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-card rounded-3xl p-7 lg:p-8 flex flex-col gap-6 border border-border"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-foreground text-foreground"
                  />
                ))}
              </div>
              <blockquote className="font-display text-lg lg:text-xl leading-snug text-balance flex-1">
                “{q.body}”
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-2">
                <div
                  className="w-11 h-11 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${q.avatar})` }}
                />
                <div>
                  <div className="font-semibold text-sm">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.trip}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
