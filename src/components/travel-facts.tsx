"use client";

import { motion } from "framer-motion";
import { Compass, Landmark, Mountain, Snowflake, Sun, Waves } from "lucide-react";
import { useLanguage } from "./language-provider";

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
  zh: {
    eyebrow: "值得了解",
    title: "有趣的旅行知识",
    body: "关于我们所前往目的地的一些冷知识。",
  },
  ja: {
    eyebrow: "知っておきたい",
    title: "旅の豆知識",
    body: "私たちが訪れる場所についての、知られざる事実。",
  },
  ko: {
    eyebrow: "알아두면 좋은",
    title: "흥미로운 여행 상식",
    body: "우리가 여행하는 곳에 대해 몰랐을 수도 있는 사실들.",
  },
} as const;

type Fact = {
  icon: typeof Mountain;
  value: string;
  place: { mn: string; en: string };
  note: { mn: string; en: string };
};

// Edit these to update the facts shown on the homepage.
const FACTS: Fact[] = [
  {
    icon: Mountain,
    value: "1,580 м",
    place: { mn: "Монгол улс", en: "Mongolia" },
    note: {
      mn: "Далайн түвшнээс дээш дундаж өндөр — дэлхийд хамгийн өндөрт оршдог орнуудын нэг.",
      en: "Average elevation above sea level — one of the highest-lying countries on Earth.",
    },
  },
  {
    icon: Snowflake,
    value: "-25°C",
    place: { mn: "Улаанбаатар", en: "Ulaanbaatar" },
    note: {
      mn: "Өвлийн дундаж хэм. Улаанбаатар бол дэлхийн хамгийн хүйтэн нийслэл хот.",
      en: "Average winter temperature — the coldest capital city in the world.",
    },
  },
  {
    icon: Waves,
    value: "70%",
    place: { mn: "Хөвсгөл нуур", en: "Lake Khövsgöl" },
    note: {
      mn: "Монгол орны цэвэр усны нөөцийн ойролцоогоор энэ хувийг ганцаараа агуулдаг.",
      en: "Holds roughly this share of Mongolia's entire fresh water reserve on its own.",
    },
  },
  {
    icon: Sun,
    value: "1.3 сая км²",
    place: { mn: "Говь цөл", en: "The Gobi" },
    note: {
      mn: "Азийн хамгийн том цөл. Зуны халуун, өвлийн хүйтний ялгаа 80°C хүрдэг.",
      en: "Asia's largest desert, where summer-to-winter temperatures can swing by 80°C.",
    },
  },
  {
    icon: Landmark,
    value: "21,196 км",
    place: { mn: "Хятад — Цагаан хэрэм", en: "China — Great Wall" },
    note: {
      mn: "Албан ёсны хэмжилтээр бүх салбар нийлээд ийм урттай.",
      en: "The official surveyed length of all its branches combined.",
    },
  },
  {
    icon: Compass,
    value: "3,776 м",
    place: { mn: "Япон — Фүжи уул", en: "Japan — Mt. Fuji" },
    note: {
      mn: "Японы хамгийн өндөр цэг бөгөөд жилд 300 мянга орчим хүн авирдаг.",
      en: "Japan's highest point, climbed by around 300,000 people every year.",
    },
  },
];

export function TravelFacts() {
  const { contentLocale } = useLanguage();
  const copy = SECTION_COPY[contentLocale] ?? SECTION_COPY.mn;
  const isMn = contentLocale === "mn";
  const pick = (text: { mn: string; en: string }) => (isMn ? text.mn : text.en);

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
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
          {copy.body}
        </p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {FACTS.map((fact, index) => {
            const Icon = fact.icon;

            return (
              <motion.article
                key={fact.place.en}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                className="group bg-[#0b0a07]/90 p-7 backdrop-blur-md transition-colors hover:bg-[#141209]/90 sm:p-8"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/15">
                  <Icon className="h-5 w-5 text-accent" />
                </span>
                <div className="mt-5 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-none text-accent">
                  {fact.value}
                </div>
                <div className="nav-text mt-3 text-xs uppercase tracking-[0.18em] text-white/70">
                  {pick(fact.place)}
                </div>
                <p className="mt-3 text-sm leading-6 text-white/55">{pick(fact.note)}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
