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
  },
  zh: {
    label: "Fact check",
    headline: "We operate trips, not only recommend them.",
    body:
      "Routes, hotels, flights, transport, guides, interpretation, meetings, insurance, and payment terms are clarified before travel.",
    proofTitle: "How Nomadabe works",
    routeTitle: "Outbound + domestic routes",
    routeBody:
      "One team plans Mongolia trips and outbound routes to Japan, Korea, China, Turkey, and more.",
    operationTitle: "Real operations",
    operationBody:
      "Hotels, transport, guides, interpreters, and schedules are matched to the trip purpose.",
    scopeTitle: "Business, expo, leisure",
    scopeBody:
      "Trips are shaped for exhibitions, meetings, sourcing, families, friends, and custom groups.",
    clarityTitle: "Clear conditions",
    clarityBody:
      "Inclusions, extra costs, risks, and documents are explained before confirmation.",
    chips: ["Domestic", "Outbound", "Expo", "Business", "Custom"],
  },
  ja: {
    label: "Fact check",
    headline: "We operate trips, not only recommend them.",
    body:
      "Routes, hotels, flights, transport, guides, interpretation, meetings, insurance, and payment terms are clarified before travel.",
    proofTitle: "How Nomadabe works",
    routeTitle: "Outbound + domestic routes",
    routeBody:
      "One team plans Mongolia trips and outbound routes to Japan, Korea, China, Turkey, and more.",
    operationTitle: "Real operations",
    operationBody:
      "Hotels, transport, guides, interpreters, and schedules are matched to the trip purpose.",
    scopeTitle: "Business, expo, leisure",
    scopeBody:
      "Trips are shaped for exhibitions, meetings, sourcing, families, friends, and custom groups.",
    clarityTitle: "Clear conditions",
    clarityBody:
      "Inclusions, extra costs, risks, and documents are explained before confirmation.",
    chips: ["Domestic", "Outbound", "Expo", "Business", "Custom"],
  },
  ko: {
    label: "Fact check",
    headline: "We operate trips, not only recommend them.",
    body:
      "Routes, hotels, flights, transport, guides, interpretation, meetings, insurance, and payment terms are clarified before travel.",
    proofTitle: "How Nomadabe works",
    routeTitle: "Outbound + domestic routes",
    routeBody:
      "One team plans Mongolia trips and outbound routes to Japan, Korea, China, Turkey, and more.",
    operationTitle: "Real operations",
    operationBody:
      "Hotels, transport, guides, interpreters, and schedules are matched to the trip purpose.",
    scopeTitle: "Business, expo, leisure",
    scopeBody:
      "Trips are shaped for exhibitions, meetings, sourcing, families, friends, and custom groups.",
    clarityTitle: "Clear conditions",
    clarityBody:
      "Inclusions, extra costs, risks, and documents are explained before confirmation.",
    chips: ["Domestic", "Outbound", "Expo", "Business", "Custom"],
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
    <section id="about" className="border-y border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-border bg-card px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-foreground">
              {t.why.eyebrow}
            </p>
            <h2 className="max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {t.why.titleStart}{" "}
              <span className="rounded-md bg-accent px-2 italic text-accent-foreground">
                {t.why.titleEmphasis}
              </span>{" "}
              {t.why.titleEnd}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            {copy.headline}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-lg border border-border bg-accent p-6 text-accent-foreground shadow-sm lg:p-8"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-md bg-card text-foreground shadow-sm">
              <PlaneTakeoff className="h-7 w-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.24em]">
              {copy.label}
            </p>
            <h3 className="mt-4 text-balance font-display text-3xl leading-tight lg:text-4xl">
              {copy.proofTitle}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-foreground/75 lg:text-base">
              {copy.body}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {copy.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-foreground/15 bg-card px-3 py-1.5 text-xs font-bold text-foreground"
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
                  className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-lg lg:p-6"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl leading-snug lg:text-2xl">
                    {fact.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {fact.body}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-md bg-background p-4">
            <MapPinned className="h-5 w-5 text-foreground" />
            <span className="text-sm font-bold">Mongolia routes</span>
          </div>
          <div className="flex items-center gap-3 rounded-md bg-background p-4">
            <Globe2 className="h-5 w-5 text-foreground" />
            <span className="text-sm font-bold">Outbound countries</span>
          </div>
          <div className="flex items-center gap-3 rounded-md bg-background p-4">
            <Handshake className="h-5 w-5 text-foreground" />
            <span className="text-sm font-bold">One planning desk</span>
          </div>
        </div>
      </div>
    </section>
  );
}
