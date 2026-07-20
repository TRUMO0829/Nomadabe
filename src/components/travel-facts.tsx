"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./language-provider";
import { DEFAULT_TRAVEL_FACTS, type TravelFact } from "@/lib/site-settings";

const SECTION_COPY = {
  mn: {
    eyebrow: "Мэдэх нь сонирхолтой",
    title: "Аяллын сонирхолтой баримтууд",
    body: "Аялах гэж буй газар нутгийнхаа талаар өмнө нь мэдээгүй байж магадгүй зүйлс.",
  },
  en: {
    eyebrow: "Good to know",
    title: "Travel facts worth knowing",
    body: "A few things you may not have known about the places we travel to.",
  },
  zh: { eyebrow: "值得了解", title: "有趣的旅行知识", body: "关于我们所前往目的地的一些冷知识。" },
  ja: { eyebrow: "知っておきたい", title: "旅の豆知識", body: "私たちが訪れる場所についての、知られざる事実。" },
  ko: { eyebrow: "알아두면 좋은", title: "흥미로운 여행 상식", body: "우리가 여행하는 곳에 대해 몰랐을 수도 있는 사실들." },
} as const;

type TravelFactsProps = {
  facts?: TravelFact[];
};

export function TravelFacts({ facts = DEFAULT_TRAVEL_FACTS }: TravelFactsProps) {
  const { contentLocale } = useLanguage();
  const copy = SECTION_COPY[contentLocale] ?? SECTION_COPY.mn;
  const isMn = contentLocale === "mn";

  if (facts.length === 0) return null;

  const spanLast = facts.length % 3 === 1;

  return (
    <section className="relative overflow-hidden bg-[#0b0a07] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-[0.22]"
        style={{ backgroundImage: "url('/nomadabe-hero-panorama.webp')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,10,7,0.94), rgba(11,10,7,0.86) 50%, rgba(11,10,7,0.96))",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <span className="nav-text inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.28em] text-accent">
          <span className="h-px w-8 bg-accent" />
          {copy.eyebrow}
        </span>
        <h2 className="site-heading mt-5 max-w-3xl text-[clamp(1.5rem,3vw,2.6rem)] leading-tight">
          {copy.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">{copy.body}</p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact, index) => {
            const place = isMn ? fact.place : fact.placeEn || fact.place;
            const note = isMn ? fact.note : fact.noteEn || fact.note;
            const isLastSpan = spanLast && index === facts.length - 1;

            return (
              <motion.article
                key={fact.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                className={`group relative min-h-[15rem] overflow-hidden bg-[#0b0a07]/90 ${
                  isLastSpan ? "sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                {fact.image ? (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url('${fact.image}')` }}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#0b0a07] via-[#0b0a07]/75 to-[#0b0a07]/35"
                    />
                  </>
                ) : null}

                <div className="relative flex h-full flex-col justify-end p-7 sm:p-8">
                  <div className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-none text-accent">
                    {fact.value}
                  </div>
                  <div className="nav-text mt-3 text-xs uppercase tracking-[0.18em] text-white/75">
                    {place}
                  </div>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">{note}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
