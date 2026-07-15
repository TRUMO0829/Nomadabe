"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Globe2,
  Hotel,
  MapPinned,
  MessageCircle,
  Route,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { ADVENTURES, type Adventure } from "@/lib/adventures";
import { useLanguage } from "./language-provider";

const COPY = {
  mn: {
    eyebrow: "Travel desk",
    title: "Аяллыг жагсаалтаас биш, зорилгоос нь эхлүүлье.",
    body:
      "Nomadabe баг таны аяллын зорилго, хугацаа, хүний тоо, хэрэгтэй дэмжлэгийг нэг дор цэгцэлж маршрут, буудал, унаа, зөвлөгөөг төлөвлөнө.",
    boardTitle: "Аялал төлөвлөлтийн самбар",
    boardSubtitle: "Эхний мэдээллээ өгөөд бодит маршрут болгож авна.",
    live: "Шинэ хүсэлт",
    totalTrips: "боломжит аялал",
    goal: "Зорилго",
    goalValue: "Амралт, бизнес, expo эсвэл гэр бүл",
    duration: "Хугацаа",
    durationValue: "3-14 хоног, уян хатан огноо",
    support: "Дэмжлэг",
    supportValue: "Орчуулга, буудал, унаа, зөвлөгөө",
    output: "Гарах үр дүн",
    outputValue: "Маршрут + төсөв + дараагийн алхам",
    actionsTitle: "Эндээс эхэлж болно",
    plan: "Аялал төлөвлүүлэх",
    business: "Бизнес аялал",
    villas: "Вилла & амралт",
  },
  en: {
    eyebrow: "Travel desk",
    title: "Start with the purpose, not a long trip list.",
    body:
      "Nomadabe turns your goal, timing, group size, and support needs into a clear route with hotels, transport, consulting, and next steps.",
    boardTitle: "Trip planning board",
    boardSubtitle: "Share the first details and turn them into a real route.",
    live: "New request",
    totalTrips: "available trips",
    goal: "Goal",
    goalValue: "Leisure, business, expo, or family",
    duration: "Timing",
    durationValue: "3-14 days, flexible dates",
    support: "Support",
    supportValue: "Interpreter, hotel, transport, consulting",
    output: "Output",
    outputValue: "Route + budget + next step",
    actionsTitle: "Start here",
    plan: "Plan a trip",
    business: "Business travel",
    villas: "Villas & stays",
  },
  zh: {
    eyebrow: "Travel desk",
    title: "先从旅行目的开始，而不是从长列表开始。",
    body:
      "Nomadabe 会把目的、时间、人数和所需支持整理成路线、酒店、交通、咨询和下一步。",
    boardTitle: "旅行规划看板",
    boardSubtitle: "先提供基础信息，再生成真实路线。",
    live: "新需求",
    totalTrips: "可选行程",
    goal: "目的",
    goalValue: "休闲、商务、展会或家庭",
    duration: "时间",
    durationValue: "3-14 天，日期灵活",
    support: "支持",
    supportValue: "翻译、酒店、交通、咨询",
    output: "结果",
    outputValue: "路线 + 预算 + 下一步",
    actionsTitle: "从这里开始",
    plan: "规划旅行",
    business: "商务旅行",
    villas: "别墅与度假",
  },
  ja: {
    eyebrow: "Travel desk",
    title: "長いリストではなく、旅の目的から始めます。",
    body:
      "Nomadabe は目的、日程、人数、必要なサポートを整理し、ルート、ホテル、移動、相談、次のステップにします。",
    boardTitle: "旅行計画ボード",
    boardSubtitle: "最初の情報から具体的なルートへ。",
    live: "新規依頼",
    totalTrips: "候補ツアー",
    goal: "目的",
    goalValue: "休暇、ビジネス、展示会、家族旅行",
    duration: "日程",
    durationValue: "3-14日、柔軟な日付",
    support: "サポート",
    supportValue: "通訳、ホテル、移動、相談",
    output: "成果",
    outputValue: "ルート + 予算 + 次のステップ",
    actionsTitle: "ここから開始",
    plan: "旅行を計画",
    business: "ビジネス旅行",
    villas: "ヴィラ・滞在",
  },
  ko: {
    eyebrow: "Travel desk",
    title: "긴 여행 목록보다 목적부터 시작합니다.",
    body:
      "Nomadabe는 목적, 일정, 인원, 필요한 지원을 정리해 루트, 호텔, 교통, 컨설팅, 다음 단계로 만듭니다.",
    boardTitle: "여행 계획 보드",
    boardSubtitle: "첫 정보를 실제 일정으로 바꿉니다.",
    live: "새 요청",
    totalTrips: "가능한 여행",
    goal: "목적",
    goalValue: "휴식, 비즈니스, 전시회, 가족",
    duration: "기간",
    durationValue: "3-14일, 유연한 날짜",
    support: "지원",
    supportValue: "통역, 호텔, 교통, 컨설팅",
    output: "결과",
    outputValue: "루트 + 예산 + 다음 단계",
    actionsTitle: "여기서 시작",
    plan: "여행 계획하기",
    business: "비즈니스 여행",
    villas: "빌라 & 스테이",
  },
} as const;

type TravelOptionsCarouselProps = {
  adventures?: Adventure[];
};

export function TravelOptionsCarousel({
  adventures = ADVENTURES,
}: TravelOptionsCarouselProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const tripCount = adventures.length;
  const boardItems = [
    {
      label: copy.goal,
      value: copy.goalValue,
      icon: Route,
    },
    {
      label: copy.duration,
      value: copy.durationValue,
      icon: CalendarClock,
    },
    {
      label: copy.support,
      value: copy.supportValue,
      icon: ShieldCheck,
    },
    {
      label: copy.output,
      value: copy.outputValue,
      icon: ClipboardList,
    },
  ];
  const actionLinks = [
    {
      href: "/plan",
      label: copy.plan,
      icon: MessageCircle,
    },
    {
      href: "/tours/outbound#corporate-trips",
      label: copy.business,
      icon: BriefcaseBusiness,
    },
    {
      href: "/tours/outbound#stays",
      label: copy.villas,
      icon: Hotel,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0f0e0a] text-[#fffdf3]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-38"
        style={{ backgroundImage: "url('/hero-autumn.webp')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,14,10,0.96),rgba(15,14,10,0.82)_48%,rgba(15,14,10,0.66))]"
      />
      <div className="relative mx-auto grid min-h-[calc(100svh/var(--site-scale))] w-full max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div>
          <p className="nav-text text-xs uppercase text-[#ffd400]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl text-balance text-[clamp(2.2rem,5vw,5.3rem)] leading-[1.02]">
            {copy.title}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            {copy.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 border border-white/16 bg-white/7 px-4 py-3 text-xs uppercase text-white/74">
              <Globe2 className="h-4 w-4 text-[#ffd400]" />
              {tripCount} {copy.totalTrips}
            </span>
            <span className="inline-flex items-center gap-2 border border-white/16 bg-white/7 px-4 py-3 text-xs uppercase text-white/74">
              <UsersRound className="h-4 w-4 text-[#ffd400]" />
              {copy.live}
            </span>
          </div>
        </div>

        <div className="border border-white/14 bg-black/24 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-3 border-b border-white/12 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="nav-text text-[11px] uppercase text-[#ffd400]">
                {copy.boardTitle}
              </p>
              <h3 className="mt-2 text-2xl leading-tight text-white sm:text-3xl">
                {copy.boardSubtitle}
              </h3>
            </div>
            <MapPinned className="h-8 w-8 text-[#ffd400]" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {boardItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="border border-white/12 bg-white/[0.055] p-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase text-white/50">
                    <Icon className="h-4 w-4 text-[#ffd400]" />
                    {item.label}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/82">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border border-[#ffd400]/26 bg-[#ffd400]/9 p-4">
            <div className="flex items-center gap-2 text-[11px] uppercase text-[#ffd400]">
              <CheckCircle2 className="h-4 w-4" />
              {copy.actionsTitle}
            </div>
            <div className="mt-4 grid gap-2">
              {actionLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex min-h-12 items-center justify-between gap-4 bg-[#fffdf3] px-4 text-xs uppercase text-[#11100b] transition-colors hover:bg-[#ffd400]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
