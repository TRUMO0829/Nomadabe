"use client";

import { motion } from "framer-motion";

const STYLES = [
  {
    title: "Trekking",
    count: 28,
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Horseback",
    count: 14,
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Desert",
    count: 9,
    image:
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Winter & Ski",
    count: 12,
    image:
      "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Culture",
    count: 21,
    image:
      "https://images.unsplash.com/photo-1612538498488-cd6f02d4b0bf?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Wildlife",
    count: 7,
    image:
      "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80&auto=format&fit=crop",
  },
];

export function TravelStyles() {
  return (
    <section id="destinations" className="py-24 lg:py-32 bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-xs lg:text-sm tracking-[0.2em] uppercase text-accent font-semibold mb-4">
            ★ How do you adventure?
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-balance">
            Pick your <span className="italic">style</span> of trip.
          </h2>
          <p className="mt-5 text-primary-foreground/70 text-lg max-w-xl">
            From quiet horseback days on the steppe to lung-burning ridge climbs
            — choose the kind of adventure that fits you.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
          {STYLES.map((s, idx) => (
            <motion.a
              key={s.title}
              href={`#style-${s.title}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.05 }}
              className="relative group aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${s.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                <h3 className="font-display text-2xl lg:text-4xl text-white leading-tight">
                  {s.title}
                </h3>
                <p className="text-white/80 text-sm mt-1">{s.count} trips</p>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
