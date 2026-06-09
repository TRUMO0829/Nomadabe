"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./language-provider";

const STYLE_CARDS = [
  {
    count: 28,
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80&auto=format&fit=crop",
  },
  {
    count: 14,
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80&auto=format&fit=crop",
  },
  {
    count: 9,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop",
  },
  {
    count: 12,
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80&auto=format&fit=crop",
  },
  {
    count: 21,
    image:
      "https://images.unsplash.com/photo-1612538498488-cd6f02d4b0bf?w=800&q=80&auto=format&fit=crop",
  },
  {
    count: 7,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80&auto=format&fit=crop",
  },
];

export function TravelStyles() {
  const { t } = useLanguage();

  return (
    <section
      id="destinations"
      className="py-24 lg:py-32 bg-primary text-primary-foreground"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-xs lg:text-sm tracking-[0.2em] uppercase text-accent font-bold mb-4">
            ★ {t.styles.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-balance">
            {t.styles.titleStart}{" "}
            <span className="italic text-accent">{t.styles.titleEmphasis}</span>{" "}
            {t.styles.titleEnd}
          </h2>
          <p className="mt-5 text-primary-foreground/75 text-lg max-w-xl">
            {t.styles.body}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
          {STYLE_CARDS.map((style, idx) => {
            const title = t.styles.cards[idx];

            return (
              <motion.a
                key={title}
                href={`#style-${idx}`}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="relative group aspect-[4/5] sm:aspect-square rounded-lg overflow-hidden border border-white/10"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${style.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                  <h3 className="font-display text-2xl lg:text-4xl text-white leading-tight">
                    {title}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {style.count} {t.styles.countLabel}
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-md bg-accent text-accent-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
