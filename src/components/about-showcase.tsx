"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
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
    title: "Улаанбаатараас дэлхий рүү холбодог аяллын баг.",
    body:
      "Nomadabe Travel нь Улаанбаатар хотод төвтэй, бизнес аялал, inbound болон outbound чиглэлээр мэргэшсэн мэргэжлийн аяллын компани. Бид Монгол дотор болон олон улсын чиглэлд 10,000 гаруй аялагчийн аяллыг амжилттай зохион байгуулсан.",
    whoLabel: "Бид хэн бэ",
    whoText:
      "Since 2019, we have served over 2,000 travelers annually, bridging the gap between business and leisure by connecting entrepreneurs to major international events and opportunities for sustainable growth.",
    stats: [
      { value: "7", label: "Жилийн туршлага" },
      { value: "10К+", label: "Үйлчлүүлэгчид" },
      { value: "2К+", label: "Жил бүрийн аялагч" },
    ],
    valuesLabel: "Бидний үнэт зүйлс",
    values: [
      {
        title: "Монголыг дэлхийд харуулах",
        body: "Монголын байгалийн гайхамшиг, уламжлалт нүүдлийн соёлыг аялагчдад мартагдашгүй туршлага болгон хүргэнэ.",
      },
      {
        title: "Дэлхий рүү холбох",
        body: "Монгол аялагч, бизнесүүдийг олон улсын чиглэл, үзэсгэлэн, салбарын томоохон арга хэмжээнүүдтэй холбоно.",
      },
      {
        title: "Итгэлтэй зохион байгуулалт",
        body: "Бизнес болон амралтын аяллыг буудал, тээвэр, хөтөлбөр, уулзалттай нь уялдуулан бодитоор хэрэгжүүлнэ.",
      },
      {
        title: "Урт хугацааны боломж",
        body: "Аяллыг зөвхөн зорчих биш, шинэ түншлэл, зах зээл, бизнесийн өсөлтийн боломж болгохыг зорьдог.",
      },
    ],
    teamLabel: "Манай баг",
    workLabel: "Бид юу хийдэг вэ",
    workTitle: "Business, leisure, custom аяллыг нэг дор зохион байгуулдаг.",
    workBody:
      "Бид бизнес аялал, амралтын аялал, захиалгат маршрут, олон улсын expo болон салбарын арга хэмжээнд оролцох аяллыг төлөвлөж гүйцэтгэдэг.",
    work: [
      { title: "Business Tours", body: "Олон улсын үзэсгэлэн, уулзалт, салбарын арга хэмжээ, зах зээл судлах аяллыг зохион байгуулна." },
      { title: "Leisure Tours", body: "Монгол болон гадаад чиглэлийн амралт, хот, байгаль, соёлын аяллыг төлөвлөнө." },
      { title: "Customized Tours", body: "Гэр бүл, найз нөхөд, байгууллагын зорилгод тохирсон захиалгат маршрутыг гаргана." },
      { title: "Inbound + Outbound", body: "Монголд ирэх болон Монголоос гадагш аялах чиглэлийг нэг баг гүйцэтгэнэ." },
    ],
    imageAlt: "Nomadabe Travel route planning",
  },
  en: {
    eyebrow: "ABOUT US",
    title: "A Ulaanbaatar travel company connecting Mongolia with the world.",
    body:
      "Nomadabe Travel is a professional travel company based in Ulaanbaatar, specializing in business travel, inbound tours, and outbound tours. We have successfully organized trips for over 10,000 travelers within Mongolia and to international destinations.",
    whoLabel: "Who We Are",
    whoText:
      "Since 2019, we have served over 2,000 travelers annually, bridging the gap between business and leisure by connecting entrepreneurs to major international events and opportunities for sustainable growth.",
    stats: [
      { value: "7", label: "Years of experience" },
      { value: "10k+", label: "Clients" },
      { value: "2k+", label: "Annual travelers" },
    ],
    valuesLabel: "Our Values",
    values: [
      { title: "Showcase Mongolia", body: "We turn Mongolia's natural beauty and nomadic heritage into memorable travel experiences." },
      { title: "Connect to the world", body: "We link travelers and businesses with international routes, exhibitions, and industry events." },
      { title: "Trusted coordination", body: "Business and leisure trips are organized with hotels, transport, programs, and meetings aligned." },
      { title: "Long-term opportunity", body: "Travel becomes a path to new partnerships, markets, and sustainable growth." },
    ],
    teamLabel: "Our Team",
    workLabel: "What We Do",
    workTitle: "Business, leisure, and custom trips, organized end to end.",
    workBody:
      "We arrange business travel, leisure travel, customized routes, international expo trips, and major industry event travel across Asia and beyond.",
    work: [
      { title: "Business Tours", body: "International exhibitions, meetings, industry events, and market research trips." },
      { title: "Leisure Tours", body: "Domestic and international holidays shaped around nature, cities, culture, and rest." },
      { title: "Customized Tours", body: "Routes tailored for families, friends, companies, and special travel goals." },
      { title: "Inbound + Outbound", body: "One team for trips into Mongolia and from Mongolia to the world." },
    ],
    imageAlt: "Nomadabe Travel route planning",
  },
  zh: {
    eyebrow: "关于我们",
    title: "一家位于乌兰巴托、连接蒙古与世界的旅行公司。",
    body:
      "Nomadabe Travel 是一家位于蒙古首都乌兰巴托的专业旅行公司，专注于商务旅行、入境游和出境游。我们已为超过 10,000 名旅客成功组织蒙古国内及国际目的地旅行。",
    whoLabel: "我们是谁",
    whoText: "自 2019 年以来，我们每年服务超过 2,000 名旅客，连接商务与休闲旅行，并帮助企业家接触重要国际活动和可持续增长机会。",
    stats: [
      { value: "7", label: "年经验" },
      { value: "10k+", label: "客户" },
      { value: "2k+", label: "年度旅客" },
    ],
    valuesLabel: "我们的价值观",
    values: [
      { title: "展示蒙古", body: "把蒙古的自然之美和游牧文化转化为难忘的旅行体验。" },
      { title: "连接世界", body: "帮助旅客和企业连接国际路线、展会及行业活动。" },
      { title: "可信赖的统筹", body: "将酒店、交通、行程和会议协调到商务及休闲旅行中。" },
      { title: "长期机会", body: "让旅行成为建立合作、进入市场和持续成长的机会。" },
    ],
    teamLabel: "我们的团队",
    workLabel: "我们的服务",
    workTitle: "商务、休闲与定制旅行，全流程组织。",
    workBody: "我们组织商务旅行、休闲旅行、定制路线、国际展会旅行以及亚洲及其他地区的重要行业活动旅行。",
    work: [
      { title: "商务旅行", body: "国际展会、会议、行业活动和市场调研旅行。" },
      { title: "休闲旅行", body: "围绕自然、城市、文化和休息设计的国内外度假行程。" },
      { title: "定制旅行", body: "为家庭、朋友、企业和特别目标量身定制路线。" },
      { title: "入境 + 出境", body: "同一团队负责来蒙古和从蒙古前往世界的旅行。" },
    ],
    imageAlt: "Nomadabe Travel route planning",
  },
  ja: {
    eyebrow: "私たちについて",
    title: "ウランバートルからモンゴルと世界をつなぐ旅行会社です。",
    body:
      "Nomadabe Travel はウランバートルを拠点とする旅行会社で、ビジネス旅行、インバウンド、アウトバウンドツアーを専門としています。モンゴル国内外で 10,000 人以上の旅行を手配してきました。",
    whoLabel: "私たち",
    whoText: "2019 年以来、年間 2,000 人以上の旅行者をサポートし、ビジネスとレジャーをつなぎながら、起業家を主要な国際イベントと持続的成長の機会へ結びつけています。",
    stats: [
      { value: "7", label: "年の経験" },
      { value: "10k+", label: "顧客" },
      { value: "2k+", label: "年間旅行者" },
    ],
    valuesLabel: "大切にしていること",
    values: [
      { title: "モンゴルを伝える", body: "自然の美しさと遊牧文化を、記憶に残る旅の体験にします。" },
      { title: "世界へつなぐ", body: "旅行者と企業を国際ルート、展示会、業界イベントにつなげます。" },
      { title: "信頼できる手配", body: "ホテル、移動、プログラム、商談を一体で調整します。" },
      { title: "長期的な機会", body: "旅を新しい提携、市場、持続的な成長につながる機会にします。" },
    ],
    teamLabel: "チーム",
    workLabel: "できること",
    workTitle: "ビジネス、レジャー、カスタム旅行を一貫して手配します。",
    workBody: "ビジネス旅行、レジャー旅行、カスタムルート、国際展示会、アジア各地の業界イベント旅行を手配します。",
    work: [
      { title: "Business Tours", body: "国際展示会、商談、業界イベント、市場調査の旅。" },
      { title: "Leisure Tours", body: "自然、都市、文化、休暇に合わせた国内外の旅。" },
      { title: "Customized Tours", body: "家族、友人、企業、特別な目的に合わせたルート。" },
      { title: "Inbound + Outbound", body: "モンゴルへの旅と、モンゴルから世界への旅を一つのチームで。" },
    ],
    imageAlt: "Nomadabe Travel route planning",
  },
  ko: {
    eyebrow: "회사 소개",
    title: "울란바토르에서 몽골과 세계를 연결하는 여행사입니다.",
    body:
      "Nomadabe Travel은 울란바토르에 기반을 둔 전문 여행사로 비즈니스 여행, 인바운드, 아웃바운드 투어를 전문으로 합니다. 몽골 국내와 해외 목적지에서 10,000명 이상의 여행을 성공적으로 운영했습니다.",
    whoLabel: "우리는 누구인가",
    whoText: "2019년부터 매년 2,000명 이상의 여행자를 지원하며, 비즈니스와 레저를 연결하고 기업가들이 주요 국제 행사와 지속 가능한 성장 기회를 만날 수 있도록 돕고 있습니다.",
    stats: [
      { value: "7", label: "년 경험" },
      { value: "10k+", label: "고객" },
      { value: "2k+", label: "연간 여행자" },
    ],
    valuesLabel: "우리의 가치",
    values: [
      { title: "몽골을 보여주기", body: "몽골의 자연미와 유목 문화를 기억에 남는 여행 경험으로 만듭니다." },
      { title: "세계와 연결", body: "여행자와 기업을 국제 노선, 전시회, 산업 행사와 연결합니다." },
      { title: "신뢰할 수 있는 운영", body: "호텔, 교통, 일정, 미팅을 비즈니스 및 레저 여행에 맞춰 조율합니다." },
      { title: "장기적 기회", body: "여행을 새로운 파트너십, 시장, 지속 가능한 성장의 기회로 만듭니다." },
    ],
    teamLabel: "우리 팀",
    workLabel: "우리가 하는 일",
    workTitle: "비즈니스, 레저, 맞춤 여행을 처음부터 끝까지 운영합니다.",
    workBody: "비즈니스 여행, 레저 여행, 맞춤 루트, 국제 엑스포, 아시아 및 기타 지역의 주요 산업 행사 여행을 운영합니다.",
    work: [
      { title: "Business Tours", body: "국제 전시회, 미팅, 산업 행사, 시장 조사 여행." },
      { title: "Leisure Tours", body: "자연, 도시, 문화, 휴식을 중심으로 구성한 국내외 여행." },
      { title: "Customized Tours", body: "가족, 친구, 기업, 특별 목적에 맞춘 맞춤 루트." },
      { title: "Inbound + Outbound", body: "몽골로 들어오는 여행과 몽골에서 세계로 나가는 여행을 한 팀이 담당합니다." },
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
      <div className="relative z-10 grid min-h-screen lg:sticky lg:top-0 lg:h-[calc(100svh/var(--site-scale))] lg:grid-cols-[0.9fr_1px_1.1fr]">
        <div className="flex min-h-[calc(100svh/var(--site-scale))] flex-col px-6 pb-12 pt-20 sm:px-10 lg:px-16 lg:pt-24">
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

          <div className="mt-8 grid border border-[#FFD400]/35 bg-white/70 shadow-[0_24px_80px_rgba(17,16,11,0.06)] backdrop-blur-sm sm:grid-cols-2 xl:grid-cols-4">
            {SECTIONS.map((section, index) => {
              const selected = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => scrollToSection(index, section.id)}
                  className={[
                    "group relative flex min-h-20 flex-col justify-between border-[#FFD400]/25 px-4 py-3 text-left uppercase transition-colors hover:bg-[#FFD400]/8",
                    "sm:border-r sm:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:last-child]:border-r-0",
                    selected ? "text-[#11100b]" : "text-[#11100b]/48",
                  ].join(" ")}
                >
                  {selected ? (
                    <motion.span
                      layoutId="about-tab-highlight"
                      className="absolute inset-x-0 bottom-0 h-1 bg-[#FFD400]"
                    />
                  ) : null}
                  <span className="trip-meta-text text-xs tracking-[0.18em] text-[#FFD400]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-3 whitespace-normal text-sm leading-tight tracking-wide sm:text-base">
                    {sectionLabels[section.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative hidden bg-[#FFD400] lg:block">
          <div className="absolute left-1/2 top-[31%] h-10 w-10 -translate-x-1/2 rounded-full bg-[#FFD400]" />
        </div>

        <div className="relative hidden min-h-[calc(100svh/var(--site-scale))] items-start px-6 pb-20 pt-6 sm:px-10 lg:flex lg:overflow-x-hidden lg:overflow-y-auto lg:px-16 lg:pb-14 lg:pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 96, clipPath: "inset(18% 0 0 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0, y: -48, clipPath: "inset(0 0 18% 0)" }}
              transition={{ duration: 0.84, ease: [0.16, 1, 0.3, 1] }}
              className="w-full will-change-transform"
            >
              <AboutPanel section={activeSection} copy={copy} team={team} />
            </motion.div>
          </AnimatePresence>
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
      <motion.p
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="mt-5 max-w-3xl text-base font-semibold leading-[1.7] text-[#11100b]/72 lg:text-lg"
      >
        {copy.whoText}
      </motion.p>
      <div className="mt-6 grid gap-4 lg:gap-5">
        {copy.stats.map((stat) => (
          <div key={stat.value} className="grid items-center gap-3 sm:grid-cols-[minmax(7rem,0.34fr)_1fr]">
            <div
              className="font-sans !font-extralight text-[clamp(3.5rem,5.4vw,6.4rem)] leading-[0.9] text-[#11100b]"
              style={{ fontWeight: 200 }}
            >
              {stat.value}
            </div>
            <p
              className="text-balance !font-extralight text-lg leading-tight text-[#11100b] sm:text-xl lg:text-2xl"
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
      <div className="mt-8 max-h-none overflow-hidden rounded-[18px] border border-[#FFD400]/45 bg-white shadow-[0_26px_80px_rgba(17,16,11,0.10)] lg:max-h-[calc(100svh/var(--site-scale)-12rem)] lg:overflow-y-auto">
        {copy.values.map((value, index) => (
          <motion.article
            key={value.title}
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="grid gap-4 border-b border-[#FFD400]/28 bg-white px-6 py-6 last:border-b-0 odd:bg-[#fffdf3] sm:grid-cols-[5rem_1fr] lg:px-8 lg:py-6"
          >
            <div className="flex items-center justify-between text-[#FFD400] sm:block">
              <ShieldCheck className="h-6 w-6" aria-hidden />
              <span className="trip-meta-text text-xs tracking-[0.18em] sm:mt-3 sm:block">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h2 className="text-2xl leading-tight text-[#11100b] lg:text-3xl">
                {value.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#11100b]/64 lg:text-base lg:leading-8">
                {value.body}
              </p>
            </div>
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
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {team.map((member, index) => (
          <article
            key={member.id}
            className="group relative min-h-[420px] overflow-hidden border border-[#FFD400]/45 bg-[#11100b] shadow-[0_26px_70px_rgba(17,16,11,0.08)] lg:min-h-[480px]"
          >
            {member.image ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${member.image}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,212,0,0.18),transparent_34%),linear-gradient(145deg,#fff,#f4f0df)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-7">
              <p className="text-2xl font-semibold leading-tight lg:text-3xl">{member.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#FFD400]">
                {member.role}
              </p>
              {member.bio ? (
                <p className="mt-4 text-sm leading-7 text-white/72">{member.bio}</p>
              ) : null}
            </div>
            {!member.image ? (
              <div className="absolute left-6 top-6 font-display text-[clamp(5rem,8vw,8.5rem)] leading-none text-[#FFD400]/42">
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
      <motion.p
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 max-w-2xl text-sm leading-7 text-[#11100b]/66 lg:text-base lg:leading-8"
      >
        {copy.workBody}
      </motion.p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {copy.work.map((item, index) => {
          const Icon = WORK_ICONS[index];

          return (
            <article
              key={item.title}
              className="min-h-40 border border-[#FFD400]/45 bg-white p-4 lg:min-h-44"
            >
              <div className="flex items-center justify-between text-[#FFD400]">
                <Icon className="h-5 w-5" />
                <span className="trip-meta-text text-xs tracking-[0.18em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-xl text-[#11100b] lg:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#11100b]/62">{item.body}</p>
            </article>
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
    { id: "team-founder-ceo", name: "N. Ariunbold", role: "Co-Founder, CEO", image: "" },
    { id: "team-founder-coo", name: "B. Bilguun", role: "Co-Founder, COO", image: "" },
  ];

  const members = [...fallback, ...teamMembers];
  const seen = new Set<string>();

  return members.filter((member) => {
    const key = `${member.name.trim().toLowerCase()}-${member.role.trim().toLowerCase()}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
