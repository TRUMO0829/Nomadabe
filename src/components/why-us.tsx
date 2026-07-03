"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Globe2,
  Handshake,
  MapPinned,
  PlaneTakeoff,
} from "lucide-react";
import { useLanguage } from "./language-provider";

const FACT_COPY = {
  mn: {
    label: "Fact check",
    headline: "Зөвхөн санал болгодог биш, аяллыг газар дээр нь гүйцэтгэдэг баг.",
    body:
      "Маршрут, буудал, нислэг, тээвэр, хөтөч, орчуулга, уулзалт, даатгал, төлбөрийн нөхцөлөө аялал эхлэхээс өмнө нэг дор тодорхой болгодог.",
    proofTitle: "Nomadabe ажиллах зарчим",
    routeTitle: "Гадаад + дотоод чиглэл",
    routeBody:
      "Монголын дотоод аялал болон Япон, Солонгос, Хятад, Турк зэрэг гадаад маршрутыг нэг баг төлөвлөнө.",
    operationTitle: "Бодит зохион байгуулалт",
    operationBody:
      "Буудал, тээвэр, хөтөч, орчуулагч, өдөр бүрийн хөтөлбөрийг аяллын зорилготой уялдуулж бэлдэнэ.",
    scopeTitle: "Бизнес, expo, амралт",
    scopeBody:
      "Үзэсгэлэн, уулзалт, бараа судалгаа, гэр бүл, найз нөхөд, байгууллагын захиалгат аялалд тохируулна.",
    clarityTitle: "Ил тод нөхцөл",
    clarityBody:
      "Юу багтсан, юу нэмэгдэх, ямар бичиг баримт хэрэгтэйг эхнээс нь тодорхой тайлбарлана.",
    chips: ["Дотоод аялал", "Гадаад аялал", "Expo", "Business", "Custom"],
    summary: ["Монгол чиглэлүүд", "Гадаад орнууд", "Нэг төлөвлөх баг"],
  },
  en: {
    label: "Fact check",
    headline: "A team that operates trips, not just recommends them.",
    body:
      "Routes, hotels, flights, transport, guides, interpretation, meetings, insurance, and payment terms are clarified before the trip starts.",
    proofTitle: "How Nomadabe works",
    routeTitle: "Outbound + domestic routes",
    routeBody:
      "One team plans Mongolia trips and outbound routes to Japan, Korea, China, Turkey, and more.",
    operationTitle: "Real operations",
    operationBody:
      "Hotels, transport, guides, interpreters, and daily schedules are matched to the purpose of the trip.",
    scopeTitle: "Business, expo, leisure",
    scopeBody:
      "Trips are shaped for exhibitions, meetings, sourcing, families, friends, and custom company groups.",
    clarityTitle: "Clear conditions",
    clarityBody:
      "Inclusions, extra costs, risks, and required documents are explained before the trip is confirmed.",
    chips: ["Domestic", "Outbound", "Expo", "Business", "Custom"],
    summary: ["Mongolia routes", "Outbound countries", "One planning desk"],
  },
  zh: {
    label: "服务核对",
    headline: "我们不只是推荐行程，而是真正落地执行。",
    body:
      "路线、酒店、航班、交通、导游、翻译、会议、保险和付款条件，都会在出发前确认清楚。",
    proofTitle: "Nomadabe 的服务方式",
    routeTitle: "出境与蒙古国内路线",
    routeBody:
      "同一团队负责蒙古国内旅行，以及日本、韩国、中国、土耳其等出境路线。",
    operationTitle: "真实执行",
    operationBody:
      "酒店、交通、导游、翻译和每日安排都会围绕旅行目的来匹配。",
    scopeTitle: "商务、展会、休闲",
    scopeBody:
      "适合展会、商务会议、采购考察、家庭、朋友和企业定制团队。",
    clarityTitle: "条件清晰",
    clarityBody:
      "确认前会说明包含项目、额外费用、注意事项和所需文件。",
    chips: ["国内", "出境", "展会", "商务", "定制"],
    summary: ["蒙古路线", "出境国家", "统一规划窗口"],
  },
  ja: {
    label: "サービス確認",
    headline: "おすすめするだけでなく、旅を現地で運営します。",
    body:
      "ルート、ホテル、航空券、移動、ガイド、通訳、商談、保険、支払い条件を出発前に明確にします。",
    proofTitle: "Nomadabe の進め方",
    routeTitle: "海外 + モンゴル国内ルート",
    routeBody:
      "モンゴル国内旅行と、日本・韓国・中国・トルコなどの海外ルートを同じチームが計画します。",
    operationTitle: "実務まで対応",
    operationBody:
      "ホテル、移動、ガイド、通訳、毎日の予定を旅の目的に合わせて準備します。",
    scopeTitle: "ビジネス、展示会、休暇",
    scopeBody:
      "展示会、商談、仕入れ調査、家族旅行、友人旅行、企業のカスタム旅行に対応します。",
    clarityTitle: "明確な条件",
    clarityBody:
      "含まれる内容、追加費用、注意点、必要書類を確定前に説明します。",
    chips: ["国内", "海外", "展示会", "ビジネス", "カスタム"],
    summary: ["モンゴルルート", "海外の国々", "一つの計画窓口"],
  },
  ko: {
    label: "서비스 확인",
    headline: "추천만 하는 것이 아니라 여행을 실제로 운영합니다.",
    body:
      "루트, 호텔, 항공, 교통, 가이드, 통역, 미팅, 보험, 결제 조건을 출발 전에 명확히 안내합니다.",
    proofTitle: "Nomadabe 진행 방식",
    routeTitle: "해외 + 몽골 국내 루트",
    routeBody:
      "한 팀이 몽골 국내 여행과 일본, 한국, 중국, 튀르키예 등 해외 루트를 함께 계획합니다.",
    operationTitle: "실제 운영",
    operationBody:
      "호텔, 교통, 가이드, 통역, 일별 일정은 여행 목적에 맞게 준비합니다.",
    scopeTitle: "비즈니스, 엑스포, 휴가",
    scopeBody:
      "전시회, 미팅, 소싱, 가족, 친구, 기업 맞춤 그룹에 맞춰 여행을 구성합니다.",
    clarityTitle: "명확한 조건",
    clarityBody:
      "포함 사항, 추가 비용, 주의점, 필요한 서류를 확정 전에 설명합니다.",
    chips: ["국내", "해외", "엑스포", "비즈니스", "맞춤"],
    summary: ["몽골 루트", "해외 국가", "하나의 계획 창구"],
  },
} as const;

const FACT_ICONS = [Globe2, ClipboardCheck, Building2, BadgeCheck] as const;

export function WhyUs() {
  const { contentLocale, t } = useLanguage();
  const copy = FACT_COPY[contentLocale];
  const facts = [
    { title: copy.routeTitle, body: copy.routeBody },
    { title: copy.operationTitle, body: copy.operationBody },
    { title: copy.scopeTitle, body: copy.scopeBody },
    { title: copy.clarityTitle, body: copy.clarityBody },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-24 text-[#11100b] lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(184,148,34,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(184,148,34,0.10)_1px,transparent_1px)] [background-size:42px_42px]" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <path
          d="M80 210 C240 145 330 290 475 230 C620 165 690 120 835 178 C980 235 1040 175 1160 105"
          fill="none"
          stroke="rgba(184,148,34,0.44)"
          strokeDasharray="14 18"
          strokeWidth="2"
        />
      </svg>
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.35fr] lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="mb-5 inline-flex rounded-lg border border-[#eadfac] bg-[#fffdf3] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#8f7020] shadow-sm">
            {t.why.eyebrow}
          </p>
          <h2
            data-plane-landing
            className="max-w-xl text-balance font-display text-3xl leading-tight text-[#11100b] sm:text-4xl lg:text-5xl"
          >
            {t.why.titleStart}{" "}
            <span className="inline-block text-[#8f7020]">
              {t.why.titleEmphasis}
            </span>{" "}
            {t.why.titleEnd}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#4b4538] lg:text-lg">
            {copy.headline}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="flex items-center gap-3 rounded-lg border border-[#eadfac] bg-white p-4 shadow-[0_16px_42px_rgba(17,16,11,0.05)]">
              <MapPinned className="h-5 w-5 text-[#b89422]" />
              <span className="text-sm font-medium text-[#4b4538]">
                {copy.summary[0]}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#eadfac] bg-white p-4 shadow-[0_16px_42px_rgba(17,16,11,0.05)]">
              <Globe2 className="h-5 w-5 text-[#b89422]" />
              <span className="text-sm font-medium text-[#4b4538]">
                {copy.summary[1]}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#eadfac] bg-white p-4 shadow-[0_16px_42px_rgba(17,16,11,0.05)]">
              <Handshake className="h-5 w-5 text-[#b89422]" />
              <span className="text-sm font-medium text-[#4b4538]">
                {copy.summary[2]}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-lg border border-[#d8bd59] bg-[#11100b] p-6 text-white shadow-[0_28px_80px_rgba(17,16,11,0.16)] md:p-8"
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#ffd400] text-[#11100b] shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
                <PlaneTakeoff className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#ffd400]">
                  {copy.label}
                </p>
                <h3 className="mt-3 text-balance font-display text-2xl leading-tight text-white lg:text-3xl">
                  {copy.proofTitle}
                </h3>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-white/76 lg:text-base">
                  {copy.body}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {copy.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/18 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/82"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            {facts.map((fact, idx) => {
              const Icon = FACT_ICONS[idx];

              return (
                <motion.article
                  key={fact.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  className="group min-h-[220px] rounded-lg border border-[#eadfac] bg-[#fffdf3]/92 p-6 shadow-[0_20px_58px_rgba(17,16,11,0.07)] backdrop-blur transition-all hover:-translate-y-1 hover:border-[#b89422]/70 hover:bg-white"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#b89422] shadow-[0_12px_30px_rgba(17,16,11,0.08)] transition-colors group-hover:bg-[#ffd400] group-hover:text-[#11100b]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="trip-meta-text text-xs uppercase tracking-[0.2em] text-[#b89422]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-balance font-display text-xl leading-snug text-[#11100b]">
                    {fact.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#4b4538]">
                    {fact.body}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
