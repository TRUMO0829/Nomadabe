"use client";

import { motion } from "framer-motion";
import { Compass, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import { useLanguage } from "./language-provider";

const ICONS = [Compass, Leaf, ShieldCheck, HeartHandshake];

export function WhyUs() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs lg:text-sm tracking-[0.2em] uppercase text-foreground font-bold mb-4">
              ★ {t.why.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-balance">
              {t.why.titleStart}{" "}
              <span className="italic text-accent">{t.why.titleEmphasis}</span>{" "}
              {t.why.titleEnd}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              {t.why.body}
            </p>
            <a
              href="#story"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-foreground border-b-2 border-accent pb-1 hover:text-accent transition-colors"
            >
              {t.why.link} →
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {t.why.reasons.map((reason, idx) => {
              const Icon = ICONS[idx];

              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: idx * 0.08 }}
                  className="rounded-lg bg-card border border-border p-6 lg:p-7 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-md bg-accent text-accent-foreground flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl lg:text-2xl mb-2 leading-snug">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                    {reason.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 lg:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 border-y border-border py-10 lg:py-12">
          {t.why.stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-4xl lg:text-6xl">
                {stat.value}
              </div>
              <div className="text-xs lg:text-sm tracking-wider uppercase text-muted-foreground mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
