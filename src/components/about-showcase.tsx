"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  CalendarCheck,
  Compass,
  Globe,
  Handshake,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Route,
} from "lucide-react";
import type {
  AboutSectionSettings,
  TeamMember,
} from "@/lib/site-settings";
import { useLanguage } from "./language-provider";

type AboutShowcaseProps = {
  aboutSection: AboutSectionSettings;
  teamMembers: TeamMember[];
};

const WORK_ICONS = [Compass, CalendarCheck, Route, Handshake] as const;

const ACCENT = "#FFD400";

const CONTACT = {
  phones: ["+976 9910 3258", "+976 9918 9317"],
  email: "info@nomadabe.mn",
  address: "Minister Tower, Olympic Street 15, Ulaanbaatar",
  mapHref:
    "https://www.google.com/maps/place/Minister+Tower/@47.9153226,106.917978,425m/data=!3m2!1e3!4b1!4m6!3m5!1s0x5d9693649ea1b323:0x8bb14a35346801cd!8m2!3d47.9153226!4d106.9205583!16s%2Fg%2F11ss8zbb4r?hl=en-US",
};

const CERTIFICATION_ITEMS = [
  "Монголын аялал жуулчлалын холбооны гишүүн байгууллага",
  "Гадаадаас жуулчин хүлээн авах тур оператор",
  "Гадаад орон руу жуулчин илгээх тур оператор",
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

export function AboutShowcase({ aboutSection, teamMembers }: AboutShowcaseProps) {
  const { contentLocale } = useLanguage();
  const copy = aboutSection[contentLocale] ?? aboutSection.mn;
  const isMn = contentLocale === "mn";
  const L = (mn: string, en: string) => (isMn ? mn : en);

  const team = useMemo(() => visibleOrdered(teamMembers), [teamMembers]);
  const stats = useMemo(() => visibleOrdered(copy.who.stats), [copy]);
  const values = useMemo(() => visibleOrdered(copy.values.items), [copy]);
  const work = useMemo(() => visibleOrdered(copy.work.items), [copy]);
  const faqItems = useMemo(() => visibleOrdered(copy.faq.items), [copy]);

  const showValues = copy.values.isVisible !== false && values.length > 0;
  const showWork = copy.work.isVisible !== false && work.length > 0;
  const showTeam = copy.team.isVisible !== false && team.length > 0;
  const showFaq = copy.faq.isVisible !== false && faqItems.length > 0;

  return (
    <section className="relative overflow-hidden bg-[#0B0A07] text-[#FFFDF3]">
      {/* ambient accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: "rgba(255,212,0,0.22)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[-12%] h-[360px] w-[360px] rounded-full blur-[120px]"
        style={{ background: "rgba(255,212,0,0.12)" }}
      />

      {/* ───────────────────────── HERO ───────────────────────── */}
      <div className="relative">
        {/* nature backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-autumn.webp')" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(11,10,7,0.93) 0%, rgba(11,10,7,0.74) 48%, rgba(11,10,7,0.5) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-48"
          style={{ background: "linear-gradient(to bottom, rgba(11,10,7,0), #0B0A07)" }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-20 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40 lg:pb-28">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* left column */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] tracking-[0.28em] text-[#FFF3BF]"
              style={{ borderColor: "rgba(255,212,0,0.4)", background: "rgba(255,212,0,0.08)" }}
            >
              <MapPin className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              {L("УЛААНБААТАР · МОНГОЛ · TRAVEL", "ULAANBAATAR · MONGOLIA · TRAVEL")}
            </motion.span>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mt-7 text-xs tracking-[0.34em]"
              style={{ color: ACCENT }}
            >
              {copy.eyebrow}
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 text-4xl leading-[1.02] sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {copy.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#D8D2C2] sm:text-lg"
            >
              {copy.body}
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/plan"
                className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-[#11100B] transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: ACCENT }}
              >
                {L("Аялал төлөвлөх", "Plan a trip")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-[#FFFDF3] transition-colors duration-200 hover:border-white/50 hover:bg-white/5"
              >
                {L("Аяллууд үзэх", "Explore tours")}
              </Link>
            </motion.div>
          </motion.div>

          {/* right column — info card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm"
          >
            <div className="relative overflow-hidden rounded-[20px]">
              <Image
                src="/nomadabe-hero-panorama.webp"
                alt="Nomadabe Travel"
                width={760}
                height={520}
                className="h-56 w-full object-cover sm:h-64 lg:h-72"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] tracking-[0.22em] text-[#11100B]"
                style={{ background: ACCENT }}
              >
                <Compass className="h-3.5 w-3.5" />
                NOMADABE TRAVEL TEAM
              </span>
            </div>

            <p className="px-3 pt-5 text-sm leading-relaxed text-[#CFC9B9]">
              {copy.who.text}
            </p>

            {/* stats */}
            {stats.length > 0 && (
              <div className="mt-5 grid grid-cols-3 gap-2 px-1">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center"
                  >
                    <div className="text-2xl sm:text-3xl" style={{ color: ACCENT }}>
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[11px] leading-tight text-[#A9A491]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* contact grid */}
            <div className="mt-3 grid grid-cols-1 gap-2 px-1 pb-2 sm:grid-cols-2">
              <a
                href={CONTACT.mapHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-white/25"
              >
                <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#A9A491]">
                  <MapPin className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                  {L("БАЙРШИЛ", "LOCATION")}
                </div>
                <div className="mt-1.5 text-[13px] leading-snug text-[#E7E2D4]">
                  {CONTACT.address}
                </div>
              </a>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#A9A491]">
                  <Phone className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                  {L("ХОЛБОО", "CONTACT")}
                </div>
                <div className="mt-1.5 space-y-0.5 text-[13px] leading-snug text-[#E7E2D4]">
                  {CONTACT.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block hover:underline">
                      {p}
                    </a>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#A9A491]">
                  <Mail className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                  {L("И-МЭЙЛ", "EMAIL")}
                </div>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="mt-1.5 block text-[13px] leading-snug text-[#E7E2D4] hover:underline"
                >
                  {CONTACT.email}
                </a>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#A9A491]">
                  <Globe className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                  {L("ХЭЛ", "LANGUAGES")}
                </div>
                <div className="mt-1.5 text-[13px] leading-snug text-[#E7E2D4]">
                  {L("Монгол · Англи · Хятад", "Mongolian · English · Chinese")}
                </div>
              </div>
            </div>

            <div className="mx-1 mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#A9A491]">
                <Award className="h-4 w-4" style={{ color: ACCENT }} />
                {L("ГЭРЧИЛГЭЭ", "CERTIFICATION")}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#E7E2D4]">
                {L(
                  "Nomadabe Adventure Silkres ХХК нь Монголын аялал жуулчлалын холбооны гишүүн байгууллага.",
                  "Nomadabe Adventure Silkres LLC is a member organization of the Mongolian Tourism Association."
                )}
              </p>
            </div>
          </motion.div>
          </div>
        </div>
      </div>

      <Band bg="/nomadabe-hero-panorama.webp">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Kicker>{L("Баталгаажуулалт", "Certification")}</Kicker>
            <h2 className="mt-5 max-w-3xl text-3xl leading-tight sm:text-4xl">
              {L(
                "Монголын аялал жуулчлалын холбооны гишүүн байгууллага.",
                "Member of the Mongolian Tourism Association."
              )}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#D8D2C2]">
              {L(
                "2023 оны холбооны шийдвэр, үйл ажиллагааны ангиллын дагуу Nomadabe Adventure Silkres ХХК нь олон улсын аялал жуулчлалын тур операторын чиглэлээр бүртгэлтэй.",
                "Based on the association's 2023 certification and activity classification, Nomadabe Adventure Silkres LLC is recognized for international tour operator services."
              )}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/12 bg-[#0B0A07]/62 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.24)] backdrop-blur-md">
            <div className="flex items-start gap-4">
              <span
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(255,212,0,0.14)" }}
              >
                <Award className="h-6 w-6" style={{ color: ACCENT }} />
              </span>
              <div>
                <p className="text-xs tracking-[0.24em]" style={{ color: ACCENT }}>
                  CERTIFICATE
                </p>
                <h3 className="mt-2 text-2xl leading-tight text-[#FFFDF3]">
                  Nomadabe Adventure Silkres ХХК
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#B8B2A2]">
                  {L(
                    "Гадаад болон дотоод чиглэлийн аяллыг мэргэжлийн түвшинд төлөвлөж, зохион байгуулах баталгаатай аяллын баг.",
                    "A certified travel team for professionally planned inbound and outbound travel."
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {CERTIFICATION_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: ACCENT }}
                  />
                  <span className="text-sm leading-relaxed text-[#E7E2D4]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Band>

      {/* ───────────────────────── VALUES ───────────────────────── */}
      {showValues && (
        <Band bg="/hero-spring.webp">
          <Kicker>{copy.values.label}</Kicker>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {values.map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
                className="bg-[#0B0A07]/85 p-7 backdrop-blur-md sm:p-9"
              >
                <span className="text-sm tracking-[0.2em]" style={{ color: ACCENT }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl leading-snug sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#B8B2A2]">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </Band>
      )}

      {/* ───────────────────────── WORK ───────────────────────── */}
      {showWork && (
        <Band bg="/hero-winter.webp">
          <Kicker>{copy.work.label}</Kicker>
          <h2 className="mt-5 max-w-3xl text-3xl leading-tight sm:text-4xl">{copy.work.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#B8B2A2]">{copy.work.body}</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {work.map((item, index) => {
              const Icon = WORK_ICONS[index % WORK_ICONS.length];
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
                  className="bg-[#0B0A07]/85 p-7 backdrop-blur-md sm:p-9"
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,212,0,0.14)" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                  </span>
                  <h3 className="mt-5 text-xl leading-snug sm:text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#B8B2A2]">{item.body}</p>
                </motion.div>
              );
            })}
          </div>
        </Band>
      )}

      {/* ───────────────────────── TEAM ───────────────────────── */}
      {showTeam && (
        <Band bg="/nomadabe-hero-panorama.webp">
          <Kicker>{copy.team.label}</Kicker>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B0A07]/70 backdrop-blur-md"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.imageAlt || member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="relative flex h-full w-full items-center justify-center">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/hero-spring.webp')" }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#0B0A07] via-[#0B0A07]/55 to-[#0B0A07]/25"
                      />
                      <span className="relative text-6xl" style={{ color: ACCENT }}>
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg">{member.name}</h3>
                  <p className="mt-1 text-sm" style={{ color: ACCENT }}>
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="mt-2.5 text-sm leading-relaxed text-[#B8B2A2]">{member.bio}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Band>
      )}

      {/* ───────────────────────── FAQ ───────────────────────── */}
      {showFaq && (
        <Band bg="/hero-autumn.webp">
          <Kicker>{copy.faq.eyebrow}</Kicker>
          <h2 className="mt-5 text-3xl leading-tight sm:text-4xl">{copy.faq.title}</h2>
          {copy.faq.subtitle && (
            <p className="mt-3 text-base text-[#B8B2A2]">{copy.faq.subtitle}</p>
          )}
          <div className="mt-9 divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10">
            {faqItems.map((item, index) => (
              <FaqRow key={item.question} item={item} defaultOpen={index === 0} />
            ))}
          </div>
        </Band>
      )}
    </section>
  );
}

function Band({ children, bg }: { children: React.ReactNode; bg?: string }) {
  return (
    <div className="relative overflow-hidden">
      {bg && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${bg}')` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(11,10,7,0.95) 0%, rgba(11,10,7,0.8) 50%, rgba(11,10,7,0.95) 100%)",
            }}
          />
        </>
      )}
      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* content-width hairline divider — aligns with the section content */}
        <div
          aria-hidden="true"
          className="absolute left-5 right-5 top-0 h-px bg-white/10 sm:left-8 sm:right-8 lg:left-12 lg:right-12"
        />
        {children}
      </div>
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2.5 text-xs tracking-[0.3em]"
      style={{ color: ACCENT }}
    >
      <span className="h-px w-8" style={{ background: ACCENT }} />
      {children}
    </span>
  );
}

function FaqRow({
  item,
  defaultOpen,
}: {
  item: { question: string; answer: string };
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className="bg-[#0B0A07]/82 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span className="text-base sm:text-lg">{item.question}</span>
        <span
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: "rgba(255,212,0,0.14)" }}
        >
          {open ? (
            <Minus className="h-4 w-4" style={{ color: ACCENT }} />
          ) : (
            <Plus className="h-4 w-4" style={{ color: ACCENT }} />
          )}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-sm leading-relaxed text-[#B8B2A2]">{item.answer}</p>
      </motion.div>
    </div>
  );
}

function visibleOrdered<T extends { order?: number; isVisible?: boolean }>(items: T[]) {
  return [...items]
    .filter((item) => item.isVisible !== false)
    .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));
}
