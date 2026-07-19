"use client";

import { motion } from "framer-motion";
import {
  Building2,
  CloudSun,
  Compass,
  Flame,
  Footprints,
  Landmark,
  Map,
  Mountain,
  MountainSnow,
  Thermometer,
  Sun,
  TreePine,
  Users,
  Waves,
} from "lucide-react";
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
    icon: Thermometer,
    value: "+40 / −40°C",
    place: { mn: "Монгол улс", en: "Mongolia" },
    note: {
      mn: "Дэлхийн хамгийн эрс тэрс уур амьсгалтай орнуудын нэг — зун +40°C хүртэл халж, өвөл −40°C хүртэл хүйтэрдэг.",
      en: "One of the world's most extreme continental climates — from +40°C in summer down to −40°C in winter.",
    },
  },
  {
    icon: Users,
    value: "2 хүн / км²",
    place: { mn: "Монгол улс", en: "Mongolia" },
    note: {
      mn: "Хүн амын нягтрал дэлхийн бүрэн эрхт улсуудаас хамгийн бага нь.",
      en: "The lowest population density of any sovereign country in the world.",
    },
  },
  {
    icon: Map,
    value: "1.56 сая км²",
    place: { mn: "Монгол улс", en: "Mongolia" },
    note: {
      mn: "Нутаг дэвсгэрийн хэмжээгээр дэлхийд 18-рт ордог.",
      en: "The 18th largest country in the world by land area.",
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
      mn: "Азийн хамгийн том цөл — үлэг гүрвэлийн олдворууд анх олдсон газраараа дэлхийд алдартай.",
      en: "Asia's largest desert — world famous as the place the first dinosaur eggs were found.",
    },
  },
  {
    icon: CloudSun,
    value: "250+ өдөр",
    place: { mn: "Мөнх хөх тэнгэр", en: "Eternal Blue Sky" },
    note: {
      mn: "Монголд жилд дунджаар ийм олон нарлаг өдөр тохиодог.",
      en: "Mongolia averages this many sunny days a year — hence its nickname.",
    },
  },
  {
    icon: Footprints,
    value: "4 сая морь",
    place: { mn: "Монголын адуу", en: "Mongolian horses" },
    note: {
      mn: "Морьдын тоо нь хүн амаас (≈3.5 сая) илүү байдаг.",
      en: "Horses outnumber the country's people (≈3.5 million).",
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
    icon: MountainSnow,
    value: "3,776 м",
    place: { mn: "Япон — Фүжи уул", en: "Japan — Mt. Fuji" },
    note: {
      mn: "Японы хамгийн өндөр цэг бөгөөд идэвхтэй галт уул юм.",
      en: "Japan's highest point — and an active volcano.",
    },
  },
  {
    icon: Flame,
    value: "100+",
    place: { mn: "Япон — галт уул", en: "Japan — volcanoes" },
    note: {
      mn: "Идэвхтэй галт уулын тоо — дэлхийн нийт галт уулын ~10%.",
      en: "Active volcanoes — around 10% of all the world's active volcanoes.",
    },
  },
  {
    icon: TreePine,
    value: "70%",
    place: { mn: "Өмнөд Солонгос", en: "South Korea" },
    note: {
      mn: "Нутаг дэвсгэрийн ойролцоогоор энэ хувь нь уулархаг газар.",
      en: "Roughly this share of the country's land is mountainous.",
    },
  },
  {
    icon: Building2,
    value: "2 тив",
    place: { mn: "Турк — Истанбул", en: "Türkiye — Istanbul" },
    note: {
      mn: "Ази, Европ хоёр тивд зэрэг оршдог дэлхийн цорын ганц том хот.",
      en: "The only major city in the world that sits on two continents at once.",
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
                className={`group bg-[#0b0a07]/90 p-7 backdrop-blur-md transition-colors hover:bg-[#141209]/90 sm:p-8 ${
                  index === FACTS.length - 1 && FACTS.length % 3 === 1
                    ? "sm:col-span-2 lg:col-span-3"
                    : ""
                }`}
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
