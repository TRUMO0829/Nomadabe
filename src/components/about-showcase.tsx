"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  CalendarCheck,
  Compass,
  Handshake,
  Route,
  ShieldCheck,
} from "lucide-react";
import type { TeamMember } from "@/lib/site-settings";
import { useLanguage } from "./language-provider";

type AboutShowcaseProps = {
  teamMembers: TeamMember[];
};

type SectionId = "who" | "values" | "team" | "work";

const SECTIONS: Array<{ id: SectionId }> = [
  { id: "who" },
  { id: "values" },
  { id: "team" },
  { id: "work" },
];

const ABOUT_COPY = {
  mn: {
    eyebrow: "БИДНИЙ ТУХАЙ",
    title: "Аяллыг санаанаас бодит маршрут болгодог баг.",
    body:
      "Nomadabe Travel нь дотоод болон гадаад чиглэлийн аяллыг нэг дор төлөвлөж, буудал, тээвэр, хөтөч, уулзалт, бичиг баримтын хэрэгцээг бодитоор зохион байгуулдаг.",
    whoLabel: "Бид хэн бэ",
    whoText:
      "Бид зөвхөн санал болгодог биш, аяллын алхам бүрийг газар дээр нь гүйцэтгэхээр төлөвлөдөг аяллын баг.",
    stats: [
      { value: "24h", label: "Анхны чиглэл, хугацаа, төсвийн санал" },
      { value: "1", label: "Нэг төлөвлөх баг" },
      { value: "5+", label: "Дотоод, гадаад, expo, business, custom" },
    ],
    valuesLabel: "Бидний үнэт зүйлс",
    values: [
      {
        title: "Ил тод байдал",
        body: "Юу багтсан, юу нэмэгдэх, ямар бичиг баримт хэрэгтэйг эхнээс нь тодорхой болгоно.",
      },
      {
        title: "Хүний холбоо",
        body: "Аялагч, байгууллага, хөтөч, үйлчилгээ үзүүлэгч бүрийн хэрэгцээг нэг хэл дээр ойлгуулна.",
      },
      {
        title: "Бодит гүйцэтгэл",
        body: "Маршрут, буудал, тээвэр, уулзалт, өдөр бүрийн хөтөлбөрийг газар дээр хэрэгжихээр бэлдэнэ.",
      },
      {
        title: "Өөрийн хэв маяг",
        body: "Ердийн багцаас илүү зорилго, хугацаа, төсөвт тохирсон аяллын хувилбар гаргана.",
      },
    ],
    teamLabel: "Манай баг",
    workLabel: "Бид юу хийдэг вэ",
    workTitle: "Тодорхой төлөвлөж, аяллыг саадгүй явуулдаг.",
    workBody:
      "Бид аяллын санааг маршрутын зураг, өдрийн төлөвлөгөө, үйлчилгээний нөхцөл, холбоо барих дараагийн алхам болгон хувиргадаг.",
    work: [
      { title: "Төлөвлөлт", body: "Чиглэл, хугацаа, төсөв, аяллын зорилгыг нэг дор тодорхойлно." },
      { title: "Захиалга", body: "Буудал, нислэг, тээвэр, хөтөч, уулзалтыг уялдуулна." },
      { title: "Гүйцэтгэл", body: "Өдөр бүрийн хөтөлбөр, газар дээрх холбоо, өөрчлөлтийн дэмжлэгийг бэлдэнэ." },
      { title: "Бизнес + Экспо", body: "Үзэсгэлэн, уулзалт, бараа судалгаа, байгууллагын аялалд тохируулна." },
    ],
    imageAlt: "Nomadabe Travel route planning",
  },
  en: {
    eyebrow: "ABOUT US",
    title: "We turn travel ideas into real routes.",
    body:
      "Nomadabe Travel plans domestic and outbound trips with practical coordination across hotels, transport, guides, meetings, documents, and every next step.",
    whoLabel: "Who We Are",
    whoText:
      "We are a travel operations team, not just a recommendation desk. Every route is planned to work in the real world.",
    stats: [
      { value: "24h", label: "Initial direction, timing, and budget range" },
      { value: "1", label: "One planning team" },
      { value: "5+", label: "Domestic, outbound, expo, business, custom" },
    ],
    valuesLabel: "Our Values",
    values: [
      { title: "Transparency", body: "Inclusions, extras, documents, and risks are clarified from the start." },
      { title: "Human connection", body: "Travelers, companies, guides, and suppliers are kept aligned through real communication." },
      { title: "Real execution", body: "Routes, hotels, transport, meetings, and daily schedules are prepared to operate." },
      { title: "Distinct fit", body: "Trips are shaped around purpose, timing, budget, and the people traveling." },
    ],
    teamLabel: "Our Team",
    workLabel: "What We Do",
    workTitle: "Plan clearly. Move smoothly. Travel with context.",
    workBody:
      "We convert a trip idea into a route map, daily plan, service conditions, and a clear next step.",
    work: [
      { title: "Planning", body: "Destination, timing, budget, and purpose are clarified in one place." },
      { title: "Booking", body: "Hotels, flights, transport, guides, and meetings are coordinated." },
      { title: "Operations", body: "Daily schedules, local contacts, and change support are prepared." },
      { title: "Business + Expo", body: "Exhibitions, meetings, sourcing, and company trips are tailored." },
    ],
    imageAlt: "Nomadabe Travel route planning",
  },
  zh: {
    eyebrow: "关于我们",
    title: "我们把旅行想法变成可执行的路线。",
    body:
      "Nomadabe Travel 规划蒙古国内及出境旅行，协调酒店、交通、导游、会议、文件和后续步骤。",
    whoLabel: "我们是谁",
    whoText: "我们不是简单推荐行程，而是让路线可以真正落地执行的旅行运营团队。",
    stats: [
      { value: "24h", label: "初步方向、时间和预算建议" },
      { value: "1", label: "一个规划团队" },
      { value: "5+", label: "国内、出境、展会、商务、定制" },
    ],
    valuesLabel: "我们的价值观",
    values: [
      { title: "透明", body: "包含项目、额外费用、文件和注意事项从一开始说明清楚。" },
      { title: "真实沟通", body: "让旅客、企业、导游和供应商保持同一节奏。" },
      { title: "实际执行", body: "路线、酒店、交通、会议和每日安排都按执行需求准备。" },
      { title: "个性匹配", body: "根据目的、时间、预算和同行人员设计旅行。" },
    ],
    teamLabel: "我们的团队",
    workLabel: "我们的服务",
    workTitle: "清晰规划，顺畅出行。",
    workBody: "我们把旅行想法转化为路线、每日计划、服务条件和下一步安排。",
    work: [
      { title: "规划", body: "集中确认目的地、时间、预算和旅行目的。" },
      { title: "预订", body: "协调酒店、航班、交通、导游和会议。" },
      { title: "执行", body: "准备每日行程、当地联系和变化支持。" },
      { title: "商务 + 展会", body: "支持展会、会议、采购考察和企业旅行。" },
    ],
    imageAlt: "Nomadabe Travel route planning",
  },
  ja: {
    eyebrow: "私たちについて",
    title: "旅のアイデアを実行できるルートへ。",
    body:
      "Nomadabe Travel はモンゴル国内外の旅を、ホテル、移動、ガイド、商談、書類、次のステップまで実務的に整えます。",
    whoLabel: "私たち",
    whoText: "私たちは提案だけでなく、現地で動く旅を設計するオペレーションチームです。",
    stats: [
      { value: "24h", label: "初期ルート、時期、予算案" },
      { value: "1", label: "一つの計画チーム" },
      { value: "5+", label: "国内、海外、展示会、ビジネス、カスタム" },
    ],
    valuesLabel: "大切にしていること",
    values: [
      { title: "透明性", body: "含まれる内容、追加費用、書類、注意点を最初に明確にします。" },
      { title: "人のつながり", body: "旅行者、企業、ガイド、手配先を実際の会話でつなぎます。" },
      { title: "実行力", body: "ルート、ホテル、移動、商談、毎日の予定を運営前提で準備します。" },
      { title: "目的に合う設計", body: "目的、時期、予算、同行者に合わせて旅を組み立てます。" },
    ],
    teamLabel: "チーム",
    workLabel: "できること",
    workTitle: "明確に計画し、スムーズに旅を進めます。",
    workBody: "旅のアイデアを、ルート、日程、条件、次のアクションに変えます。",
    work: [
      { title: "計画", body: "目的地、時期、予算、目的を一か所で整理します。" },
      { title: "予約", body: "ホテル、航空券、移動、ガイド、商談を調整します。" },
      { title: "運営", body: "日程、現地連絡、変更対応を準備します。" },
      { title: "ビジネス + 展示会", body: "展示会、商談、仕入れ調査、企業旅行に対応します。" },
    ],
    imageAlt: "Nomadabe Travel route planning",
  },
  ko: {
    eyebrow: "회사 소개",
    title: "여행 아이디어를 실제 루트로 만듭니다.",
    body:
      "Nomadabe Travel은 몽골 국내외 여행을 호텔, 교통, 가이드, 미팅, 서류, 다음 단계까지 실무적으로 조율합니다.",
    whoLabel: "우리는 누구인가",
    whoText: "우리는 추천만 하는 팀이 아니라 실제로 운영 가능한 여행을 설계하는 팀입니다.",
    stats: [
      { value: "24h", label: "초기 방향, 일정, 예산 제안" },
      { value: "1", label: "하나의 기획팀" },
      { value: "5+", label: "국내, 해외, 엑스포, 비즈니스, 맞춤" },
    ],
    valuesLabel: "우리의 가치",
    values: [
      { title: "투명성", body: "포함 사항, 추가 비용, 서류, 유의점을 처음부터 명확히 안내합니다." },
      { title: "사람 중심 소통", body: "여행자, 기업, 가이드, 공급자가 같은 흐름으로 움직이게 합니다." },
      { title: "실행력", body: "루트, 호텔, 교통, 미팅, 일정을 실제 운영 기준으로 준비합니다." },
      { title: "목적 맞춤", body: "목적, 시기, 예산, 동행자에 맞게 여행을 구성합니다." },
    ],
    teamLabel: "우리 팀",
    workLabel: "우리가 하는 일",
    workTitle: "명확하게 계획하고 매끄럽게 이동합니다.",
    workBody: "여행 아이디어를 루트, 일정표, 조건, 다음 단계로 바꿉니다.",
    work: [
      { title: "기획", body: "목적지, 일정, 예산, 여행 목적을 한곳에서 정리합니다." },
      { title: "예약", body: "호텔, 항공, 교통, 가이드, 미팅을 조율합니다." },
      { title: "운영", body: "일정, 현지 연락, 변경 지원을 준비합니다." },
      { title: "비즈니스 + 엑스포", body: "전시회, 미팅, 소싱, 기업 여행에 맞춥니다." },
    ],
    imageAlt: "Nomadabe Travel route planning",
  },
} as const;

const WORK_ICONS = [Compass, CalendarCheck, Route, Handshake] as const;
const LAST_SECTION_INDEX = SECTIONS.length - 1;
const SECTION_PROGRESS_STOPS = [0, 0.22, 0.44, 0.62] as const;
const FAQ_COPY = {
  mn: {
    eyebrow: "FAQ",
    title: "Түгээмэл асуултууд",
    items: [
      {
        question: "Аяллын хүсэлт илгээсний дараа юу болох вэ?",
        answer:
          "Манай баг чиглэл, хугацаа, хүн тоо, төсөв болон хэрэгцээг тань шалгаад дараагийн алхмыг тодруулж холбогдоно.",
      },
      {
        question: "Дотоод болон гадаад аяллыг хоёуланг нь төлөвлөдөг үү?",
        answer:
          "Тийм. Монгол дахь аялал, гадаад чиглэл, business, expo болон захиалгат аяллын зохион байгуулалтыг хийдэг.",
      },
      {
        question: "Захиалгат аялал гаргаж болох уу?",
        answer:
          "Болно. Зорилго, хугацаа, төсөв, хамт явах хүмүүсийн онцлогт тааруулж маршрут, буудал, тээвэр, хөтөлбөрийг санал болгоно.",
      },
      {
        question: "Баталгаажуулахын өмнө ямар мэдээлэл хэрэгтэй вэ?",
        answer:
          "Явах хугацаа, зорих газар, зорчигчдын тоо, төсөв, аяллын зорилго болон тусгай хэрэгцээгээ илгээвэл төлөвлөлт илүү хурдан гарна.",
      },
    ],
  },
  en: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What happens after I send a trip request?",
        answer:
          "Our team reviews your destination, timing, group size, budget, and needs, then follows up with the next step.",
      },
      {
        question: "Do you plan both domestic and outbound trips?",
        answer:
          "Yes. We plan Mongolia trips, outbound routes, business travel, expo trips, and custom itineraries.",
      },
      {
        question: "Can you create a custom trip?",
        answer:
          "Yes. We shape the route, hotels, transport, and schedule around your goal, timing, budget, and travelers.",
      },
      {
        question: "What details should I prepare before confirming?",
        answer:
          "Preferred dates, destination, traveler count, budget, trip purpose, and any special needs help us plan faster.",
      },
    ],
  },
  zh: {
    eyebrow: "常见问题",
    title: "常见问题",
    items: [
      {
        question: "发送旅行请求后会发生什么？",
        answer:
          "我们的团队会查看目的地、时间、人数、预算和需求，然后联系您确认下一步。",
      },
      {
        question: "你们会规划国内和出境旅行吗？",
        answer:
          "会。我们规划蒙古国内旅行、出境路线、商务旅行、展会旅行和定制行程。",
      },
      {
        question: "可以定制旅行吗？",
        answer:
          "可以。我们会根据目标、时间、预算和同行人员安排路线、酒店、交通和日程。",
      },
      {
        question: "确认前需要准备哪些信息？",
        answer:
          "建议提供日期、目的地、人数、预算、旅行目的和特殊需求，这样规划会更快。",
      },
    ],
  },
  ja: {
    eyebrow: "FAQ",
    title: "よくある質問",
    items: [
      {
        question: "旅行リクエストを送った後はどうなりますか？",
        answer:
          "目的地、時期、人数、予算、希望内容を確認し、次のステップについてご連絡します。",
      },
      {
        question: "国内旅行と海外旅行の両方に対応していますか？",
        answer:
          "はい。モンゴル国内旅行、海外ルート、ビジネス旅行、展示会旅行、カスタム行程に対応しています。",
      },
      {
        question: "カスタム旅行は作れますか？",
        answer:
          "はい。目的、時期、予算、参加者に合わせてルート、ホテル、移動、日程を組み立てます。",
      },
      {
        question: "確定前にどんな情報が必要ですか？",
        answer:
          "希望日、目的地、人数、予算、旅行目的、特別な希望があると、より早く計画できます。",
      },
    ],
  },
  ko: {
    eyebrow: "FAQ",
    title: "자주 묻는 질문",
    items: [
      {
        question: "여행 요청을 보내면 다음 단계는 무엇인가요?",
        answer:
          "목적지, 일정, 인원, 예산, 필요한 내용을 확인한 뒤 다음 단계 안내를 위해 연락드립니다.",
      },
      {
        question: "국내 여행과 해외 여행을 모두 기획하나요?",
        answer:
          "네. 몽골 국내 여행, 해외 루트, 비즈니스 여행, 엑스포 여행, 맞춤 일정을 기획합니다.",
      },
      {
        question: "맞춤 여행도 만들 수 있나요?",
        answer:
          "네. 목적, 일정, 예산, 동행자에 맞춰 루트, 호텔, 교통, 일정을 구성합니다.",
      },
      {
        question: "확정 전에 어떤 정보를 준비해야 하나요?",
        answer:
          "희망 날짜, 목적지, 인원, 예산, 여행 목적, 특별 요청을 알려주시면 더 빠르게 계획할 수 있습니다.",
      },
    ],
  },
} as const;

function getSectionIndexFromProgress(progress: number) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  for (let index = LAST_SECTION_INDEX; index >= 0; index -= 1) {
    if (clampedProgress >= SECTION_PROGRESS_STOPS[index]) {
      return index;
    }
  }

  return 0;
}

export function AboutShowcase({ teamMembers }: AboutShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("who");
  const { contentLocale } = useLanguage();
  const copy = ABOUT_COPY[contentLocale];
  const team = normalizeTeam(teamMembers);
  const sectionLabels: Record<SectionId, string> = {
    who: copy.whoLabel,
    values: copy.valuesLabel,
    team: copy.teamLabel,
    work: copy.workLabel,
  };
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const setActiveSectionByProgress = useCallback((progress: number) => {
    const nextIndex = getSectionIndexFromProgress(progress);
    const nextSection = SECTIONS[nextIndex]?.id ?? "who";

    setActiveSection((current) => (current === nextSection ? current : nextSection));
  }, []);

  const syncActiveSectionFromScroll = useCallback(() => {
    const section = sectionRef.current;

    if (!section || typeof window === "undefined") {
      return;
    }

    if (!window.matchMedia("(min-width: 1024px)").matches) {
      const mobilePanels = Array.from(
        section.querySelectorAll<HTMLElement>("[data-about-mobile-panel]")
      );

      if (mobilePanels.length === 0) {
        return;
      }

      const viewportMarker = window.innerHeight * 0.42;
      const nextPanel = mobilePanels.reduce((closest, panel) => {
        const closestDistance = Math.abs(closest.getBoundingClientRect().top - viewportMarker);
        const panelDistance = Math.abs(panel.getBoundingClientRect().top - viewportMarker);

        return panelDistance < closestDistance ? panel : closest;
      }, mobilePanels[0]);
      const nextSection = nextPanel.dataset.aboutSection as SectionId | undefined;

      if (nextSection) {
        setActiveSection((current) => (current === nextSection ? current : nextSection));
      }

      return;
    }

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollLength = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = (window.scrollY - sectionTop) / scrollLength;

    setActiveSectionByProgress(progress);
  }, [setActiveSectionByProgress]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    setActiveSectionByProgress(latest);
  });

  useEffect(() => {
    syncActiveSectionFromScroll();
    window.addEventListener("scroll", syncActiveSectionFromScroll, { passive: true });
    window.addEventListener("resize", syncActiveSectionFromScroll);

    return () => {
      window.removeEventListener("scroll", syncActiveSectionFromScroll);
      window.removeEventListener("resize", syncActiveSectionFromScroll);
    };
  }, [syncActiveSectionFromScroll]);

  const scrollToSection = (index: number, id: SectionId) => {
    setActiveSection(id);

    const section = sectionRef.current;
    if (!section || typeof window === "undefined") {
      return;
    }

    if (!window.matchMedia("(min-width: 1024px)").matches) {
      section
        .querySelector<HTMLElement>(`[data-about-section="${id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const availableScroll = Math.max(0, section.offsetHeight - window.innerHeight);
    const targetProgress = SECTION_PROGRESS_STOPS[index] ?? SECTION_PROGRESS_STOPS[0];
    const targetScroll = sectionTop + availableScroll * targetProgress;

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <>
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-white text-[#11100b] lg:h-[calc(680svh/var(--site-scale))] lg:overflow-clip"
      style={contentLocale === "mn" ? { letterSpacing: "2px" } : undefined}
    >
      <div className="relative z-10 grid min-h-screen lg:sticky lg:top-0 lg:h-[calc(100svh/var(--site-scale))] lg:grid-cols-[0.98fr_1px_1.02fr]">
        <div className="flex min-h-[calc(100svh/var(--site-scale))] flex-col justify-start px-6 pb-12 pt-28 sm:px-10 lg:px-16 lg:pt-32">
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="trip-meta-text text-sm uppercase tracking-[0.18em] text-[#FFD400] lg:mt-2"
          >
            {copy.eyebrow}
          </motion.p>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-[760px] text-balance font-display text-[clamp(3rem,3.85vw,4.75rem)] leading-[1.2] text-[#11100b]"
          >
            {copy.title}
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-8 max-w-[720px] text-base leading-8 text-[#11100b]/68 lg:text-xl lg:leading-9"
          >
            {copy.body}
          </motion.p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {SECTIONS.map((section, index) => {
              const selected = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => scrollToSection(index, section.id)}
                  className="group flex items-center gap-4 text-left text-base uppercase tracking-wide text-[#11100b]/46 transition-colors hover:text-[#11100b] sm:text-lg"
                >
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className="absolute h-2 w-2 rotate-45 bg-[#FFD400]" />
                    {selected ? (
                      <motion.span
                        layoutId="about-tab-ring"
                        className="absolute h-6 w-6 rounded-full border border-[#FFD400]/70"
                      />
                    ) : null}
                  </span>
                  <span className="flex flex-col">
                    <span className={selected ? "text-[#FFD400]" : ""}>
                      {sectionLabels[section.id]}
                    </span>
                    <span className={selected ? "mt-1 text-sm text-[#FFD400]" : "mt-1 text-sm text-[#11100b]/35"}>
                      {index + 1}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative hidden bg-[#FFD400] lg:block">
          <div className="absolute left-1/2 top-[31%] h-10 w-10 -translate-x-1/2 rounded-full bg-[#FFD400]" />
        </div>

        <div className="relative hidden min-h-[calc(100svh/var(--site-scale))] items-start px-6 pb-20 pt-6 sm:px-10 lg:flex lg:overflow-hidden lg:px-16 lg:pb-14 lg:pt-32">
          <motion.div
            key={activeSection}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <AboutPanel section={activeSection} copy={copy} team={team} />
          </motion.div>
        </div>
      </div>

      <div className="space-y-14 px-6 pb-16 sm:px-10 lg:hidden">
        {SECTIONS.map((section, index) => (
          <section
            key={section.id}
            data-about-mobile-panel
            data-about-section={section.id}
            className="scroll-mt-28 border-t border-[#FFD400]/35 pt-8"
          >
            <div className="mb-5 flex items-center gap-3 text-[#11100b]">
              <span className="h-2.5 w-2.5 rotate-45 bg-[#FFD400]" />
              <span className="trip-meta-text text-xs uppercase tracking-[0.18em]">
                {sectionLabels[section.id]}
              </span>
              <span className="ml-auto text-xs text-[#11100b]/45">{index + 1}</span>
            </div>
            <AboutPanel section={section.id} copy={copy} team={team} />
          </section>
        ))}
      </div>
    </section>
    <AboutFaq locale={contentLocale} />
    </>
  );
}

function AboutPanel({
  section,
  copy,
  team,
}: {
  section: SectionId;
  copy: (typeof ABOUT_COPY)[keyof typeof ABOUT_COPY];
  team: TeamMember[];
}) {
  if (section === "who") {
    return <WhoPanel copy={copy} />;
  }

  if (section === "values") {
    return <ValuesPanel copy={copy} />;
  }

  if (section === "team") {
    return <TeamPanel copy={copy} team={team} />;
  }

  return <WorkPanel copy={copy} />;
}

function WhoPanel({ copy }: { copy: (typeof ABOUT_COPY)[keyof typeof ABOUT_COPY] }) {
  return (
    <div>
      <p className="trip-meta-text text-lg uppercase tracking-[0.18em] text-[#FFD400]">
        {copy.whoLabel}
      </p>
      <p className="mt-5 max-w-3xl text-lg leading-9 text-[#11100b]/72 lg:text-xl">{copy.whoText}</p>
      <div className="mt-8 grid gap-8">
        {copy.stats.map((stat) => (
          <div key={stat.value} className="grid items-center gap-6 sm:grid-cols-[0.54fr_1fr]">
            <div
              className="font-sans !font-extralight text-[clamp(6rem,9.4vw,11.4rem)] leading-[0.82] text-[#11100b]"
              style={{ fontWeight: 200 }}
            >
              {stat.value}
            </div>
            <p
              className="text-balance !font-extralight text-2xl leading-tight text-[#11100b] sm:text-3xl lg:text-[2rem]"
              style={{ fontWeight: 200 }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValuesPanel({ copy }: { copy: (typeof ABOUT_COPY)[keyof typeof ABOUT_COPY] }) {
  return (
    <div>
      <p className="trip-meta-text text-sm uppercase tracking-[0.18em] text-[#FFD400]">
        {copy.valuesLabel}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {copy.values.map((value, index) => (
          <motion.article
            key={value.title}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="min-h-52 border border-[#FFD400]/35 bg-white p-6"
          >
            <div className="flex items-center justify-between text-[#FFD400]">
              <ShieldCheck className="h-6 w-6" />
              <span className="trip-meta-text text-xs tracking-[0.18em]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="mt-8 text-2xl leading-tight text-[#11100b]">{value.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#11100b]/62">{value.body}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function TeamPanel({
  copy,
  team,
}: {
  copy: (typeof ABOUT_COPY)[keyof typeof ABOUT_COPY];
  team: TeamMember[];
}) {
  return (
    <div>
      <p className="trip-meta-text text-sm uppercase tracking-[0.18em] text-[#FFD400]">
        {copy.teamLabel}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {team.map((member, index) => (
          <article key={member.id} className="group relative aspect-[3/4] overflow-hidden border border-[#FFD400]/35 bg-white">
            {member.image ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${member.image}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-white" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-lg font-semibold text-[#11100b]">{member.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#FFD400]">
                {member.role}
              </p>
            </div>
            {!member.image ? (
              <div className="absolute left-5 top-5 font-display text-6xl leading-none text-[#FFD400]/32">
                {String(index + 1).padStart(2, "0")}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function WorkPanel({ copy }: { copy: (typeof ABOUT_COPY)[keyof typeof ABOUT_COPY] }) {
  return (
    <div className="overflow-visible lg:max-h-[calc(100svh/var(--site-scale)-8rem)] lg:overflow-hidden">
      <p className="trip-meta-text text-sm uppercase tracking-[0.18em] text-[#FFD400]">
        {copy.workLabel}
      </p>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl leading-tight text-[#11100b] lg:text-4xl">
        {copy.workTitle}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#11100b]/66 lg:text-base">{copy.workBody}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {copy.work.map((item, index) => {
          const Icon = WORK_ICONS[index];

          return (
            <motion.article
              key={item.title}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="min-h-40 border border-[#FFD400]/45 bg-white p-4 lg:min-h-44"
            >
              <div className="flex items-center justify-between text-[#FFD400]">
                <Icon className="h-5 w-5" />
                <span className="trip-meta-text text-xs tracking-[0.18em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-xl text-[#11100b] lg:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#11100b]/62">{item.body}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function AboutFaq({ locale }: { locale: keyof typeof FAQ_COPY }) {
  const faq = FAQ_COPY[locale];

  return (
    <section
      className="bg-white px-6 py-16 text-[#11100b] sm:px-10 lg:px-16 lg:py-24"
      style={locale === "mn" ? { letterSpacing: "2px" } : undefined}
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.42fr_1fr]">
        <div>
          <p className="trip-meta-text text-sm uppercase tracking-[0.18em] text-[#FFD400]">
            {faq.eyebrow}
          </p>
          <h2 className="mt-4 max-w-md text-balance font-display text-3xl leading-tight text-[#11100b] lg:text-5xl">
            {faq.title}
          </h2>
        </div>

        <div className="grid gap-3">
          {faq.items.map((item, index) => (
            <details
              key={item.question}
              className="group border border-[#FFD400]/40 bg-white px-5 py-4"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-lg text-[#11100b] marker:hidden">
                <span>{item.question}</span>
                <span className="shrink-0 text-2xl leading-none text-[#FFD400] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#11100b]/66 lg:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function normalizeTeam(teamMembers: TeamMember[]) {
  const fallback: TeamMember[] = [
    { id: "team-slot-1", name: "Нэр оруулах", role: "Үүсгэн байгуулагч", image: "" },
    { id: "team-slot-2", name: "Нэр оруулах", role: "Аялал төлөвлөлтийн менежер", image: "" },
    { id: "team-slot-3", name: "Нэр оруулах", role: "Зохион байгуулалтын менежер", image: "" },
  ];

  return [...teamMembers, ...fallback].slice(0, 3);
}
