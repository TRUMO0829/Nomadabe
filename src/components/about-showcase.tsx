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
  Handshake,
  MapPin,
  Minus,
  Plus,
  Route,
} from "lucide-react";
import type {
  AboutSectionSettings,
  TeamMember,
} from "@/lib/site-settings";
import { Surface } from "@/components/ui/surface";
import { useLanguage } from "./language-provider";

type AboutShowcaseProps = {
  aboutSection: AboutSectionSettings;
  teamMembers: TeamMember[];
};

const WORK_ICONS = [Compass, CalendarCheck, Route, Handshake] as const;

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
    <section className="relative overflow-hidden">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <div className="surface-dark about-screen relative overflow-hidden bg-background text-foreground">
        {/* ambient accent glow — inside the hero, where there is a dark ground
            for it to glow against */}
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
        <div className="about-screen relative mx-auto flex w-full max-w-7xl items-center px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
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
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-sans text-[10px] tracking-[0.22em] text-[#FFF3BF]"
              style={{ background: "rgba(255,212,0,0.08)" }}
            >
              <MapPin className="h-3.5 w-3.5" style={{ color: "var(--accent-text)" }} />
              {L("УЛААНБААТАР · МОНГОЛ · TRAVEL", "ULAANBAATAR · MONGOLIA · TRAVEL")}
            </motion.span>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mt-6 font-sans text-[11px] tracking-[0.26em]"
              style={{ color: "var(--accent-text)" }}
            >
              {copy.eyebrow}
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 max-w-4xl font-sans text-3xl leading-[1.06] sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              {copy.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-5 max-w-lg font-sans text-sm leading-relaxed text-muted-foreground sm:text-base"
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
                className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-medium text-[#11100B] transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: "var(--accent)" }}
              >
                {L("Аялал төлөвлөх", "Plan a trip")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-medium text-foreground transition-colors duration-200 hover:bg-white/5"
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
            className="rounded-[28px] bg-white/[0.04] p-3 backdrop-blur-sm"
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
                style={{ background: "var(--accent)" }}
              >
                <Compass className="h-3.5 w-3.5" />
                NOMADABE TRAVEL TEAM
              </span>
            </div>

            <p className="px-3 pt-5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {copy.who.text}
            </p>

            {/* stats */}
            {stats.length > 0 && (
              <div className="mt-5 grid grid-cols-3 gap-2 px-1">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/[0.03] px-3 py-3 text-center"
                  >
                    <div className="text-xl sm:text-2xl" style={{ color: "var(--accent-text)" }}>
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[10px] leading-tight text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          </div>
        </div>

        {/* Bottom edge of the dark hero — the fixed navbar watches this. */}
        <span
          aria-hidden="true"
          data-nav-sentinel=""
          className="pointer-events-none absolute bottom-0 left-0 h-px w-px"
        />
      </div>

      <Surface>
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Kicker>{L("Баталгаажуулалт", "Certification")}</Kicker>
            <h2 className="mt-5 max-w-3xl text-3xl leading-tight sm:text-4xl">
              {L(
                "Монголын аялал жуулчлалын холбооны гишүүн байгууллага.",
                "Member of the Mongolian Tourism Association."
              )}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {L(
                "2023 оны холбооны шийдвэр, үйл ажиллагааны ангиллын дагуу Nomadabe Adventure Seekers ХХК нь олон улсын аялал жуулчлалын тур операторын чиглэлээр бүртгэлтэй.",
                "Based on the association's 2023 certification and activity classification, Nomadabe Adventure Seekers LLC is recognized for international tour operator services."
              )}
            </p>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-5 shadow-[0_18px_50px_rgba(17,16,11,0.08)]">
            <div className="flex items-start gap-4">
              <span
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--primary)" }}
              >
                <Award className="h-6 w-6" style={{ color: "var(--accent-text)" }} />
              </span>
              <div>
                <p className="text-xs tracking-[0.24em]" style={{ color: "var(--accent-text)" }}>
                  CERTIFICATE
                </p>
                <h3 className="mt-2 text-2xl leading-tight text-foreground">
                  Nomadabe Adventure Seekers ХХК
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: "var(--accent-text)" }}
                  />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Surface>

      {/* ───────────────────────── VALUES ───────────────────────── */}
      {showValues && (
        <Surface photo="/hero-spring.webp">
          <Kicker>{copy.values.label}</Kicker>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
            {values.map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
                className="bg-card p-7 sm:p-9"
              >
                <span className="text-sm tracking-[0.2em]" style={{ color: "var(--accent-text)" }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl leading-snug sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </Surface>
      )}

      {/* ───────────────────────── WORK ───────────────────────── */}
      {showWork && (
        <Surface>
          <Kicker>{copy.work.label}</Kicker>
          <h2 className="mt-5 max-w-3xl text-3xl leading-tight sm:text-4xl">{copy.work.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{copy.work.body}</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
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
                  className="bg-card p-7 sm:p-9"
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "var(--primary)" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: "var(--accent-text)" }} />
                  </span>
                  <h3 className="mt-5 text-xl leading-snug sm:text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </motion.div>
              );
            })}
          </div>
        </Surface>
      )}

      {/* ───────────────────────── TEAM ───────────────────────── */}
      {showTeam && (
        <Surface photo="/nomadabe-hero-panorama.webp">
          <Kicker>{copy.team.label}</Kicker>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative h-[min(72vw,320px)] w-[min(72vw,320px)] overflow-hidden rounded-full border border-border bg-card shadow-[0_18px_50px_rgba(17,16,11,0.08)] transition-transform duration-300 group-hover:-translate-y-1 sm:h-72 sm:w-72">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.imageAlt || member.name}
                      fill
                      sizes="(max-width: 640px) 72vw, 288px"
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
                      <span className="relative text-6xl" style={{ color: "var(--accent)" }}>
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0B0A07]/62 via-transparent to-white/8"
                  />
                </div>
                <div className="mt-5 rounded-full border border-border bg-card px-7 py-4 shadow-[0_18px_50px_rgba(17,16,11,0.08)]">
                  <h3 className="text-lg font-medium">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--accent-text)" }}>
                    {member.role}
                  </p>
                  {member.bio ? (
                    <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{member.bio}</p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </Surface>
      )}

      {/* ───────────────────────── FAQ ───────────────────────── */}
      {showFaq && (
        <Surface>
          <Kicker>{copy.faq.eyebrow}</Kicker>
          <h2 className="mt-5 text-3xl leading-tight sm:text-4xl">{copy.faq.title}</h2>
          {copy.faq.subtitle && (
            <p className="mt-3 text-base text-muted-foreground">{copy.faq.subtitle}</p>
          )}
          <div className="mt-9 divide-y divide-border overflow-hidden rounded-3xl border border-border">
            {faqItems.map((item, index) => (
              <FaqRow key={item.question} item={item} defaultOpen={index === 0} />
            ))}
          </div>
        </Surface>
      )}
    </section>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2.5 text-xs tracking-[0.3em]"
      style={{ color: "var(--accent-text)" }}
    >
      <span className="h-px w-8" style={{ background: "var(--accent-text)" }} />
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
    <div className="bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-muted"
      >
        <span className="text-base sm:text-lg">{item.question}</span>
        <span
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--primary)" }}
        >
          {open ? (
            <Minus className="h-4 w-4" style={{ color: "var(--accent-text)" }} />
          ) : (
            <Plus className="h-4 w-4" style={{ color: "var(--accent-text)" }} />
          )}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
      </motion.div>
    </div>
  );
}

function visibleOrdered<T extends { order?: number; isVisible?: boolean }>(items: T[]) {
  return [...items]
    .filter((item) => item.isVisible !== false)
    .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));
}
