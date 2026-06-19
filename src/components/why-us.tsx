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
      className="relative overflow-hidden bg-white py-20 text-[#11100b] lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(17,16,11,0.16)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"
        >
          <div>
            <p className="mb-4 inline-flex rounded-full border border-[#d8bb72]/45 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8f7020] shadow-sm">
              {t.why.eyebrow}
            </p>
            <h2
              data-plane-landing
              className="max-w-3xl text-balance font-display text-3xl font-semibold leading-tight text-[#11100b] sm:text-4xl lg:text-5xl"
            >
              {t.why.titleStart}{" "}
              <span className="inline-block text-[#11100b]">
                {t.why.titleEmphasis}
              </span>{" "}
              {t.why.titleEnd}
            </h2>
          </div>
          <p className="max-w-2xl text-base font-medium leading-relaxed text-[#11100b]/68 lg:text-lg">
            {copy.headline}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-lg border border-[#eadfac] bg-white p-6 text-[#11100b] shadow-[0_18px_46px_rgba(17,16,11,0.08)] lg:p-8"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-md bg-[#ffd400] text-[#11100b] shadow-sm">
              <PlaneTakeoff className="h-7 w-7" />
            </div>
            <p className="text-xs font-black uppercase text-[#8f7020]">
              {copy.label}
            </p>
            <h3 className="mt-4 text-balance font-display text-3xl leading-tight lg:text-4xl">
              {copy.proofTitle}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-[#11100b]/76 lg:text-base">
              {copy.body}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {copy.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#11100b]/15 bg-[#fff8ea] px-3 py-1.5 text-xs font-bold text-[#11100b]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {facts.map((fact, idx) => {
              const Icon = FACT_ICONS[idx];

              return (
                <motion.article
                  key={fact.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  className="rounded-lg border border-[#d8bb72]/28 bg-white p-5 shadow-[0_16px_40px_rgba(17,16,11,0.06)] transition-all hover:border-[#d8bb72]/65 hover:bg-[#fff9df] lg:p-6"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-[#d8bb72]/16 text-[#8f7020]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold leading-snug text-[#11100b] lg:text-2xl">
                    {fact.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#11100b]/62">
                    {fact.body}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mt-6 grid gap-3 rounded-lg border border-[#d8bb72]/28 bg-white p-4 shadow-[0_16px_40px_rgba(17,16,11,0.06)] sm:grid-cols-3"
        >
          <div className="flex items-center gap-3 rounded-md bg-[#fff9df] p-4">
            <MapPinned className="h-5 w-5 text-[#8f7020]" />
            <span className="text-sm font-bold text-[#11100b]">{copy.summary[0]}</span>
          </div>
          <div className="flex items-center gap-3 rounded-md bg-[#fff9df] p-4">
            <Globe2 className="h-5 w-5 text-[#8f7020]" />
            <span className="text-sm font-bold text-[#11100b]">{copy.summary[1]}</span>
          </div>
          <div className="flex items-center gap-3 rounded-md bg-[#fff9df] p-4">
            <Handshake className="h-5 w-5 text-[#8f7020]" />
            <span className="text-sm font-bold text-[#11100b]">{copy.summary[2]}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
