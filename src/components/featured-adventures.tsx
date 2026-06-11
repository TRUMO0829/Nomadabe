"use client";

import { type FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  MapPinned,
  Mountain,
  Search,
  SlidersHorizontal,
  Star,
  Send,
  Users,
} from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { cn } from "@/lib/utils";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";

type TripScope = "all" | "outbound" | "domestic";

type FeaturedAdventuresProps = {
  adventures?: Adventure[];
};

const difficultyColor: Record<string, string> = {
  Easy: "bg-accent text-accent-foreground",
  Moderate: "bg-secondary text-foreground",
  Challenging: "bg-primary text-primary-foreground",
  Tough: "bg-red-100 text-red-800",
};

const SECTION_COPY = {
  mn: {
    eyebrow: "Аяллууд",
    title: "Бүх аяллаа нэг дороос хайж сонго.",
    body:
      "Гадаад болон дотоод аяллуудыг чиглэл, нэр, аяллын төрлөөр нь хурдан хайж үзээрэй.",
    all: "Бүх аялал",
    outbound: "Гадаад аялал",
    domestic: "Дотоод аялал",
    search: "Аялал хайх...",
    listTitle: "Бүх аяллын жагсаалт",
    listBody: "Сонгосон аяллаа дарж дэлгэрэнгүй мэдээлэл, үнэ, багцын нөхцөлийг хараарай.",
    result: "аялал",
  },
  en: {
    eyebrow: "Trips",
    title: "Find every trip in one place.",
    body:
      "Search outbound and domestic trips by destination, name, or travel style.",
    all: "All trips",
    outbound: "Outbound trips",
    domestic: "Domestic trips",
    search: "Search trips...",
    listTitle: "All available trips",
    listBody: "Open a trip to view details, pricing, inclusions, and planning notes.",
    result: "trips",
  },
  zh: {
    eyebrow: "旅游",
    title: "在一个地方搜索并选择所有旅行。",
    body:
      "按目的地、名称或旅行类型快速查看出境和蒙古国内旅行。",
    all: "全部旅行",
    outbound: "出境旅行",
    domestic: "蒙古国内旅行",
    search: "搜索旅行...",
    listTitle: "全部旅行列表",
    listBody: "点击旅行查看详细信息、价格和套餐条件。",
    result: "个行程",
  },
  ja: {
    eyebrow: "ツアー",
    title: "すべてのツアーを一か所で検索・選択。",
    body:
      "海外旅行とモンゴル国内旅行を、目的地、名前、旅行タイプで素早く探せます。",
    all: "すべてのツアー",
    outbound: "海外ツアー",
    domestic: "国内ツアー",
    search: "ツアーを検索...",
    listTitle: "すべてのツアー一覧",
    listBody: "ツアーを開くと詳細、料金、含まれる条件を確認できます。",
    result: "件",
  },
  ko: {
    eyebrow: "여행",
    title: "모든 여행을 한곳에서 검색하고 선택하세요.",
    body:
      "해외 및 몽골 국내 여행을 목적지, 이름, 여행 유형으로 빠르게 찾아보세요.",
    all: "전체 여행",
    outbound: "해외 여행",
    domestic: "몽골 국내 여행",
    search: "여행 검색...",
    listTitle: "전체 여행 목록",
    listBody: "여행을 눌러 자세한 정보, 가격, 패키지 조건을 확인하세요.",
    result: "개 여행",
  },
} as const;

const RATING_COPY = {
  mn: {
    rate: "Үнэлэх",
    title: "Энэ аяллыг үнэлэх",
    name: "Таны нэр",
    email: "И-мэйл",
    note: "Санал хүсэлт",
    submit: "Илгээх",
    loading: "Илгээж байна...",
    done: "Үнэлсэн",
    success: "Баярлалаа. Үнэлгээ хүлээн авлаа.",
    error: "Илгээж чадсангүй. Дахин оролдоно уу.",
    score: "Үнэлгээ",
    recordLabel: "Аяллын үнэлгээ",
  },
  en: {
    rate: "Rate",
    title: "Rate this trip",
    name: "Your name",
    email: "Email",
    note: "Feedback",
    submit: "Send",
    loading: "Sending...",
    done: "Rated",
    success: "Thanks. We received your rating.",
    error: "Could not send. Please try again.",
    score: "Rating",
    recordLabel: "Trip rating",
  },
  zh: {
    rate: "评分",
    title: "评价此行程",
    name: "姓名",
    email: "邮箱",
    note: "反馈",
    submit: "提交",
    loading: "发送中...",
    done: "已评分",
    success: "谢谢，我们已收到您的评分。",
    error: "暂时无法发送，请再试一次。",
    score: "评分",
    recordLabel: "行程评分",
  },
  ja: {
    rate: "評価",
    title: "このツアーを評価",
    name: "お名前",
    email: "メール",
    note: "ご意見",
    submit: "送信",
    loading: "送信中...",
    done: "評価済み",
    success: "ありがとうございます。評価を受け付けました。",
    error: "送信できませんでした。もう一度お試しください。",
    score: "評価",
    recordLabel: "ツアー評価",
  },
  ko: {
    rate: "평가",
    title: "이 여행 평가",
    name: "이름",
    email: "이메일",
    note: "의견",
    submit: "보내기",
    loading: "전송 중...",
    done: "평가됨",
    success: "감사합니다. 평가를 받았습니다.",
    error: "전송할 수 없습니다. 다시 시도해주세요.",
    score: "평점",
    recordLabel: "여행 평가",
  },
} as const;

type RatingStatus = "idle" | "loading" | "success" | "error";

function TripRatingWidget({
  adventure,
  title,
  locale,
}: {
  adventure: Adventure;
  title: string;
  locale: keyof typeof RATING_COPY;
}) {
  const copy = RATING_COPY[locale];
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [form, setForm] = useState({ name: "", email: "", note: "" });
  const [status, setStatus] = useState<RatingStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setStatus("loading");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          inquiryType: "trip",
          tripSlug: adventure.slug,
          message: [
            copy.recordLabel,
            `${copy.score}: ${rating}/5`,
            `Trip: ${title}`,
            form.note ? `${copy.note}: ${form.note}` : "No extra note.",
          ].join("\n"),
        }),
      });

      if (response.ok) {
        setForm({ name: "", email: "", note: "" });
        setRating(5);
        setStatus("success");
        setOpen(false);
        return;
      }
    } catch {
      setStatus("error");
      return;
    }

    setStatus("error");
  }

  return (
    <div
      className="mt-4"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {!open ? (
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setOpen(true);
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-black text-foreground transition-colors hover:border-accent hover:bg-accent"
        >
          <Star className="h-4 w-4 fill-red-500 text-red-500" />
          {status === "success" ? copy.done : copy.rate}
        </button>
      ) : (
        <form
          className="grid gap-2 rounded-md border border-border bg-background p-3"
          onSubmit={handleSubmit}
        >
          <div className="text-xs font-black uppercase tracking-wider text-foreground">
            {copy.title}
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${copy.score} ${value}`}
                aria-pressed={rating === value}
                onClick={() => setRating(value)}
                className="rounded-sm p-0.5 text-red-500 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-4 w-4 ${
                    rating >= value ? "fill-current" : "fill-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
          <input
            required
            value={form.name}
            onChange={(event) =>
              setForm((value) => ({ ...value, name: event.target.value }))
            }
            placeholder={copy.name}
            className="min-w-0 rounded-md border border-border bg-card px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((value) => ({ ...value, email: event.target.value }))
            }
            placeholder={copy.email}
            className="min-w-0 rounded-md border border-border bg-card px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <textarea
            value={form.note}
            onChange={(event) =>
              setForm((value) => ({ ...value, note: event.target.value }))
            }
            placeholder={copy.note}
            rows={2}
            className="min-w-0 resize-none rounded-md border border-border bg-card px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <p className="min-h-4 text-[11px] leading-tight text-muted-foreground">
              {status === "success"
                ? copy.success
                : status === "error"
                  ? copy.error
                  : ""}
            </p>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-wait disabled:opacity-70"
            >
              {status === "loading" ? copy.loading : copy.submit}
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function FeaturedAdventures({
  adventures = ADVENTURES,
}: FeaturedAdventuresProps) {
  const [selected, setSelected] = useState<Adventure | null>(null);
  const [scope, setScope] = useState<TripScope>("all");
  const [query, setQuery] = useState("");
  const { contentLocale, t } = useLanguage();
  const sectionCopy = SECTION_COPY[contentLocale];

  const outboundCount = useMemo(
    () => adventures.filter((adventure) => adventure.country !== "Mongolia").length,
    [adventures]
  );
  const domesticCount = useMemo(
    () => adventures.filter((adventure) => adventure.country === "Mongolia").length,
    [adventures]
  );

  const filteredAdventures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return adventures.filter((adventure) => {
      const text = getAdventureText(adventure, contentLocale);
      const isDomestic = adventure.country === "Mongolia";
      const searchText = [
        text.title,
        text.location,
        text.country,
        text.summary,
        adventure.category,
        ...text.tags,
        ...text.idealFor,
      ]
        .join(" ")
        .toLowerCase();

      const matchesScope =
        scope === "all" ||
        (scope === "domestic" && isDomestic) ||
        (scope === "outbound" && !isDomestic);
      const matchesQuery =
        !normalizedQuery || searchText.includes(normalizedQuery);

      return matchesScope && matchesQuery;
    });
  }, [adventures, contentLocale, query, scope]);

  const scopeOptions = [
    {
      key: "all" as const,
      label: sectionCopy.all,
      count: adventures.length,
      icon: SlidersHorizontal,
    },
    {
      key: "outbound" as const,
      label: sectionCopy.outbound,
      count: outboundCount,
      icon: Globe2,
    },
    {
      key: "domestic" as const,
      label: sectionCopy.domestic,
      count: domesticCount,
      icon: MapPinned,
    },
  ];

  return (
    <section id="adventures" className="bg-background">
      <div className="relative overflow-hidden bg-primary px-6 pb-16 pt-32 text-primary-foreground lg:px-10 lg:pb-20 lg:pt-40">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/nomadabe-hero-panorama.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-primary/90 to-primary" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent lg:text-sm">
            {sectionCopy.eyebrow}
          </p>
          <div>
            <h1 className="max-w-4xl text-balance font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
              {sectionCopy.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/75 lg:text-xl">
              {sectionCopy.body}
            </p>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/15 bg-background p-3 text-foreground shadow-2xl">
            <label className="flex items-center gap-4 rounded-full bg-card px-5 py-4">
              <Search className="h-6 w-6 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={sectionCopy.search}
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground lg:text-xl"
              />
              <SlidersHorizontal className="h-6 w-6 shrink-0 text-muted-foreground" />
            </label>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {scopeOptions.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setScope(item.key)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition-colors",
                    scope === item.key
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.count} {item.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 px-1 pb-1">
              {t.hero.quick.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-accent hover:text-foreground lg:text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="all" className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:mb-10 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-foreground lg:text-sm">
              {sectionCopy.eyebrow}
            </p>
            <h2 className="font-display text-3xl text-balance sm:text-4xl lg:text-5xl">
              {sectionCopy.listTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              {sectionCopy.listBody}
            </p>
          </div>
          <div className="rounded-full border border-border bg-card px-5 py-2 text-sm font-bold text-foreground">
            {filteredAdventures.length} {sectionCopy.result}
          </div>
        </div>

        <div className="space-y-5">
          {filteredAdventures.map((adventure, idx) => {
            const text = getAdventureText(adventure, contentLocale);

            return (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.24) }}
                onClick={() => setSelected(adventure)}
                className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent hover:shadow-xl lg:grid lg:grid-cols-[340px_1fr]"
              >
                <div className="relative min-h-[260px] overflow-hidden lg:min-h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${adventure.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                        difficultyColor[adventure.difficulty]
                      )}
                    >
                      {text.difficulty}
                    </span>
                    {text.tags.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{adventure.rating}</span>
                    <span className="text-white/65">({adventure.reviews})</span>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-5 p-5 lg:p-7">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    <span>{text.location}</span>
                    <span>/</span>
                    <span>{text.country}</span>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
                    <div className="min-w-0">
                      <h3 className="font-display text-3xl leading-tight text-balance lg:text-4xl">
                        {text.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground lg:text-base">
                        {text.summary}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-4">
                      <div className="text-xs text-muted-foreground">
                        {t.featured.price}
                      </div>
                      <div className="mt-1 font-display text-2xl">
                        {adventure.price > 0
                          ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                          : t.featured.quote}
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelected(adventure);
                        }}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground"
                      >
                        {t.featured.details}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <TripRatingWidget
                        adventure={adventure}
                        title={text.title}
                        locale={contentLocale}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mountain className="h-4 w-4 text-accent" />
                      <span>
                        {adventure.days} {t.featured.days}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-accent" />
                      <span>{text.groupSize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-accent" />
                      <span>
                        {text.nextDeparture ??
                          adventure.nextDeparture ??
                          (contentLocale === "mn" ? "Тохиролцоно" : "Flexible")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredAdventures.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            {t.featured.noResults}
          </div>
        )}
      </div>

      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
