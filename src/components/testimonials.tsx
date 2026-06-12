"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useLanguage } from "./language-provider";

const REVIEW_PROFILES = [
  {
    email: "nomin.business@gmail.com",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Nomin&backgroundColor=ffd400,ffe680",
  },
  {
    email: "temuulen.import@yahoo.com",
    avatar:
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Temuulen&backgroundColor=c0aede,ffd5dc",
  },
  {
    email: "saruul.family@icloud.com",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Saruul&backgroundColor=b6e3f4,ffdfbf",
  },
];

const REVIEW_COPY = {
  mn: {
    eyebrow: "Сэтгэгдэл",
    title: "Аялагчдын үнэлгээ",
    body:
      "Манайхаар аяллаа төлөвлөсөн хүмүүсийн бодит туршлага, үйлчилгээний мэдрэмжийг эндээс уншаарай.",
    previous: "Өмнөх сэтгэгдэл",
    next: "Дараах сэтгэгдэл",
  },
  en: {
    eyebrow: "Reviews",
    title: "Traveller reviews",
    body:
      "Read real experiences from travellers who planned business, expo, leisure, and custom trips with us.",
    previous: "Previous review",
    next: "Next review",
  },
  zh: {
    eyebrow: "评价",
    title: "旅行者评价",
    body: "查看通过 Nomadabe 规划商务、展会、休闲和定制旅行的真实体验。",
    previous: "上一条评价",
    next: "下一条评价",
  },
  ja: {
    eyebrow: "レビュー",
    title: "旅行者レビュー",
    body:
      "ビジネス、展示会、レジャー、カスタム旅行を計画したお客様の実体験をご覧ください。",
    previous: "前のレビュー",
    next: "次のレビュー",
  },
  ko: {
    eyebrow: "후기",
    title: "여행자 후기",
    body:
      "비즈니스, 엑스포, 휴양, 맞춤 여행을 함께 계획한 고객들의 실제 경험을 확인하세요.",
    previous: "이전 후기",
    next: "다음 후기",
  },
} as const;

export function Testimonials() {
  const { contentLocale, t } = useLanguage();
  const copy = REVIEW_COPY[contentLocale];
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: "prev" | "next") {
    scrollerRef.current?.scrollBy({
      left: direction === "next" ? 460 : -460,
      behavior: "smooth",
    });
  }

  return (
    <section id="journal" className="bg-background px-6 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-black leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {copy.eyebrow}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              {copy.body}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              aria-label={copy.previous}
              onClick={() => scrollByCard("prev")}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-accent hover:bg-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={copy.next}
              onClick={() => scrollByCard("next")}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-accent hover:bg-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-3 [scrollbar-width:none] lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {t.testimonials.quotes.map((quote, idx) => {
            const profile = REVIEW_PROFILES[idx % REVIEW_PROFILES.length];

            return (
            <motion.figure
              key={profile.email}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex min-h-[230px] min-w-[78vw] snap-start flex-col rounded-lg border border-border bg-card p-5 shadow-sm sm:min-w-[360px] lg:min-w-[360px]"
            >
              <Quote className="h-6 w-6 text-accent" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
                {quote.body}
              </blockquote>
              <div className="mt-5 flex gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <figcaption className="mt-4 border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full border border-border bg-cover bg-center bg-white shadow-sm"
                    style={{ backgroundImage: `url(${profile.avatar})` }}
                  />
                  <div>
                    <div className="text-sm font-bold">{profile.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {quote.trip}
                    </div>
                  </div>
                </div>
              </figcaption>
            </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
