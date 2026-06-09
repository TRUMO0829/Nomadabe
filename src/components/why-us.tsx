"use client";

import { motion } from "framer-motion";
import { Compass, Leaf, ShieldCheck, HeartHandshake } from "lucide-react";
import type { Language } from "@/lib/i18n";

const REASONS = [
  {
    icon: Compass,
    title: "Local guides, always",
    body: "Every trip is led by someone who grew up on the land you're exploring — herders, mountaineers, hunters.",
  },
  {
    icon: Leaf,
    title: "Low-impact by design",
    body: "Small groups, locally-owned gers and lodges, carbon-offset flights. Tourism that gives back, not takes.",
  },
  {
    icon: ShieldCheck,
    title: "Flexible booking",
    body: "Free changes up to 60 days out. Full medical and evacuation cover included on every itinerary.",
  },
  {
    icon: HeartHandshake,
    title: "Real travellers, no fluff",
    body: "Honest pre-trip calls, no upsells, no surprises. Just the kind of adventure we'd book ourselves.",
  },
];

const TEXT = {
  mn: {
    eyebrow: "★ Яагаад Nomadabe вэ?",
    title: "Бид өөрсдөө захиалахыг хүсэх аяллаа бүтээсэн.",
    subtitle:
      "Бид аяллыг зөвхөн зурагтай танилцуулга биш, нутгийн хүнтэй уулзах, морь унах, шинэ тэнгэр харах бодит туршлага гэж хардаг.",
    story: "Аяллаа төлөвлөх →",
    stats: [
      { v: "1,200+", l: "Аялагч" },
      { v: "84", l: "Бэлтгэсэн аялал" },
      { v: "4.9★", l: "Дундаж үнэлгээ" },
      { v: "27", l: "Орон нутгийн хөтөч" },
    ],
  },
  en: {
    eyebrow: "★ Why Nomadabe",
    title: "We built the trip we wished we could book.",
    subtitle:
      "Most tour companies sell brochures. We sell a handshake with a herder, a horse, and a horizon you've never seen.",
    story: "Start planning →",
    stats: [
      { v: "1,200+", l: "Happy travellers" },
      { v: "84", l: "Curated trips" },
      { v: "4.9★", l: "Average rating" },
      { v: "27", l: "Local guides" },
    ],
  },
};

export function WhyUs({ language }: { language: Language }) {
  const text = TEXT[language];

  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs lg:text-sm tracking-[0.2em] uppercase text-accent font-semibold mb-4">
              {text.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-balance">
              {text.title}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              {text.subtitle}
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-foreground border-b-2 border-accent pb-1 hover:gap-3 transition-all"
            >
              {text.story}
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {REASONS.map((r, idx) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className="rounded-3xl bg-card border border-border p-6 lg:p-7"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <r.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl lg:text-2xl mb-2 leading-snug">
                  {r.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                  {r.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-20 lg:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 border-y border-border py-10 lg:py-12">
            {text.stats.map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl lg:text-6xl tracking-tight">
                {s.v}
              </div>
              <div className="text-xs lg:text-sm tracking-wider uppercase text-muted-foreground mt-2">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
