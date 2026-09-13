"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
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
import type { CopyLocale } from "@/lib/i18n";
import type {
  AboutSectionSettings,
  TeamMember,
} from "@/lib/site-settings";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { SectionHeading } from "./ui/section";
import { useLanguage } from "./language-provider";

type AboutShowcaseProps = {
  aboutSection: AboutSectionSettings;
  teamMembers: TeamMember[];
};

const WORK_ICONS = [Compass, CalendarCheck, Route, Handshake] as const;

type AboutCopy = {
  tagline: string;
  plan: string;
  tours: string;
  teamBadge: string;
  certEyebrow: string;
  certTitle: string;
  certBody: string;
  certLabel: string;
  company: string;
  certCardBody: string;
  certItems: string[];
};

/** Fixed About-page strings. Admin-editable copy comes from `aboutSection`. */
const ABOUT_COPY: Record<CopyLocale, AboutCopy> = {
  mn: {
    tagline: "УЛААНБААТАР · МОНГОЛ · TRAVEL",
    plan: "Аялал төлөвлөх",
    tours: "Аяллууд үзэх",
    teamBadge: "Nomadabe Travel баг",
    certEyebrow: "Баталгаажуулалт",
    certTitle: "Монголын аялал жуулчлалын холбооны гишүүн байгууллага.",
    certBody:
      "2023 оны холбооны шийдвэр, үйл ажиллагааны ангиллын дагуу Nomadabe Adventure Silkres ХХК нь олон улсын аялал жуулчлалын тур операторын чиглэлээр бүртгэлтэй.",
    certLabel: "Гэрчилгээ",
    company: "Nomadabe Adventure Silkres ХХК",
    certCardBody:
      "Гадаад болон дотоод чиглэлийн аяллыг мэргэжлийн түвшинд төлөвлөж, зохион байгуулах баталгаатай аяллын баг.",
    certItems: [
      "Монголын аялал жуулчлалын холбооны гишүүн байгууллага",
      "Гадаадаас жуулчин хүлээн авах тур оператор",
      "Гадаад орон руу жуулчин илгээх тур оператор",
    ],
  },
  en: {
    tagline: "ULAANBAATAR · MONGOLIA · TRAVEL",
    plan: "Plan a trip",
    tours: "Explore tours",
    teamBadge: "Nomadabe Travel team",
    certEyebrow: "Certification",
    certTitle: "Member of the Mongolian Tourism Association.",
    certBody:
      "Based on the association's 2023 decision and activity classification, Nomadabe Adventure Silkres LLC is registered as an international tour operator.",
    certLabel: "Certificate",
    company: "Nomadabe Adventure Silkres LLC",
    certCardBody:
      "A certified travel team that plans and runs inbound and outbound trips to a professional standard.",
    certItems: [
      "Member organisation of the Mongolian Tourism Association",
      "Inbound tour operator welcoming international visitors",
      "Outbound tour operator for travel abroad",
    ],
  },
  zh: {
    tagline: "乌兰巴托 · 蒙古 · 旅行",
    plan: "规划旅行",
    tours: "浏览行程",
    teamBadge: "Nomadabe Travel 团队",
    certEyebrow: "资质认证",
    certTitle: "蒙古旅游协会会员单位。",
    certBody:
      "根据该协会2023年的决定及业务分类，Nomadabe Adventure Silkres 有限责任公司已登记为国际旅游经营商。",
    certLabel: "证书",
    company: "Nomadabe Adventure Silkres 有限责任公司",
    certCardBody: "以专业水准规划并组织出入境旅行的认证旅行团队。",
    certItems: [
      "蒙古旅游协会会员单位",
      "接待外国游客的入境旅游经营商",
      "组织出境旅游的旅游经营商",
    ],
  },
  ja: {
    tagline: "ウランバートル · モンゴル · トラベル",
    plan: "旅行を計画する",
    tours: "ツアーを見る",
    teamBadge: "Nomadabe Travel チーム",
    certEyebrow: "認証",
    certTitle: "モンゴル観光協会の会員企業です。",
    certBody:
      "協会の2023年の決定および事業分類に基づき、Nomadabe Adventure Silkres LLC は国際ツアーオペレーターとして登録されています。",
    certLabel: "認定証",
    company: "Nomadabe Adventure Silkres LLC",
    certCardBody:
      "インバウンド・アウトバウンドの旅行をプロの水準で企画・手配する認定旅行チームです。",
    certItems: [
      "モンゴル観光協会 会員企業",
      "海外からの旅行者を受け入れるインバウンドツアーオペレーター",
      "海外旅行を手配するアウトバウンドツアーオペレーター",
    ],
  },
  ko: {
    tagline: "울란바토르 · 몽골 · 여행",
    plan: "여행 계획하기",
    tours: "여행 둘러보기",
    teamBadge: "Nomadabe Travel 팀",
    certEyebrow: "인증",
    certTitle: "몽골 관광협회 회원사입니다.",
    certBody:
      "협회의 2023년 결정 및 사업 분류에 따라 Nomadabe Adventure Silkres LLC는 국제 투어 운영사로 등록되어 있습니다.",
    certLabel: "인증서",
    company: "Nomadabe Adventure Silkres LLC",
    certCardBody:
      "인바운드·아웃바운드 여행을 전문적인 수준으로 기획하고 운영하는 인증 여행팀입니다.",
    certItems: [
      "몽골 관광협회 회원사",
      "해외 관광객을 맞이하는 인바운드 투어 운영사",
      "해외여행을 보내는 아웃바운드 투어 운영사",
    ],
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

// The page H1 is server-rendered; it slides in but is never hidden, so it
// shows before JavaScript loads.
const riseOnly = {
  hidden: { y: 18 },
  show: { y: 0 },
};

export function AboutShowcase({ aboutSection, teamMembers }: AboutShowcaseProps) {
  const { contentLocale } = useLanguage();
  const copy = aboutSection[contentLocale] ?? aboutSection.mn;
  const ui = ABOUT_COPY[contentLocale] ?? ABOUT_COPY.mn;

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
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden bg-ink text-background">
        {/* ambient accent glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-accent/20 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[-12%] h-[360px] w-[360px] rounded-full bg-accent/10 blur-[120px]"
        />

        {/* ───────────────────────── HERO ───────────────────────── */}
        <div className="about-screen relative">
          {/* nature backdrop — the page's largest above-the-fold image */}
          <Image
            src="/hero-autumn.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,10,7,0.93)_0%,rgba(11,10,7,0.74)_48%,rgba(11,10,7,0.5)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-ink/0 to-ink"
          />
          <div className="about-screen relative mx-auto flex w-full max-w-7xl items-center px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
            <div className="grid min-w-0 items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              {/* left column */}
              <motion.div
                className="min-w-0"
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
                  className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1.5 text-[10px] text-muted"
                >
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                  {ui.tagline}
                </motion.span>

                <motion.p
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  className="mt-6 text-[11px] text-accent"
                >
                  {copy.eyebrow}
                </motion.p>

                <motion.h1
                  variants={riseOnly}
                  transition={{ duration: 0.7 }}
                  className="mt-4 max-w-4xl break-words text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
                >
                  {copy.title}
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  transition={{ duration: 0.7 }}
                  className="mt-5 max-w-lg text-sm text-white/80 sm:text-base"
                >
                  {copy.body}
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.7 }}
                  className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                  <Link href="/plan" className={cn(buttonVariants(), "group")}>
                    {ui.plan}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                  <Link href="/tours" className={buttonVariants({ variant: "outline-light" })}>
                    {ui.tours}
                  </Link>
                </motion.div>
              </motion.div>

              {/* right column — info card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="min-w-0 border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src="/nomadabe-hero-panorama.webp"
                    alt="Nomadabe Travel"
                    width={760}
                    height={520}
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="h-56 w-full object-cover sm:h-64 lg:h-72"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-[10px] uppercase text-foreground">
                    <Compass aria-hidden="true" className="h-3.5 w-3.5" />
                    {ui.teamBadge}
                  </span>
                </div>

                <p className="px-3 pt-5 text-xs text-white/75 sm:text-sm">{copy.who.text}</p>

                {/* stats */}
                {stats.length > 0 && (
                  <dl className="mt-5 grid grid-cols-3 gap-2 px-1">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex min-w-0 flex-col-reverse bg-white/[0.03] px-2 py-3 text-center"
                      >
                        <dt className="mt-1 break-words text-[10px] text-white/60">
                          {stat.label}
                        </dt>
                        <dd className="text-xl text-accent sm:text-2xl">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        <Band bg="/nomadabe-hero-panorama.webp">
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow={ui.certEyebrow}
              title={ui.certTitle}
              description={ui.certBody}
            />

            <div className="min-w-0 border border-white/12 bg-ink/60 p-5 shadow-floating backdrop-blur-md">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15"
                >
                  <Award className="h-6 w-6 text-accent" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase text-accent">{ui.certLabel}</p>
                  <h3 className="mt-2 break-words text-2xl text-background">{ui.company}</h3>
                  <p className="mt-2 text-sm text-white/70">{ui.certCardBody}</p>
                </div>
              </div>

              <ul className="mt-6 grid gap-3">
                {ui.certItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border border-white/10 bg-white/[0.04] px-4 py-3"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="text-sm text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Band>

        {/* ───────────────────────── VALUES ───────────────────────── */}
        {showValues && (
          <Band bg="/hero-spring.webp">
            <Kicker as="h2">{copy.values.label}</Kicker>
            <div className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
              {values.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
                  className="bg-ink/85 p-7 backdrop-blur-md sm:p-9"
                >
                  <span aria-hidden="true" className="text-sm text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl sm:text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </Band>
        )}

        {/* ───────────────────────── WORK ───────────────────────── */}
        {showWork && (
          <Band bg="/hero-winter.webp">
            <SectionHeading
              eyebrow={copy.work.label}
              title={copy.work.title}
              description={copy.work.body}
            />
            <div className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
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
                    className="bg-ink/85 p-7 backdrop-blur-md sm:p-9"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/15"
                    >
                      <Icon className="h-5 w-5 text-accent" />
                    </span>
                    <h3 className="mt-5 text-xl sm:text-2xl">{item.title}</h3>
                    <p className="mt-3 text-sm text-white/70">{item.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </Band>
        )}

        {/* ───────────────────────── TEAM ───────────────────────── */}
        {showTeam && (
          <Band bg="/nomadabe-hero-panorama.webp">
            <Kicker as="h2">{copy.team.label}</Kicker>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:max-w-4xl">
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
                  <div className="relative h-[min(72vw,320px)] w-[min(72vw,320px)] overflow-hidden rounded-full border border-white/18 bg-ink/40 shadow-floating transition-transform duration-300 group-hover:-translate-y-1 sm:h-72 sm:w-72">
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
                        <Image
                          src="/hero-spring.webp"
                          alt=""
                          fill
                          sizes="(max-width: 640px) 72vw, 288px"
                          className="object-cover"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
                        />
                        <span aria-hidden="true" className="relative text-6xl text-accent">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-white/5"
                    />
                  </div>
                  <div className="mt-5 max-w-full rounded-full border border-white/12 bg-ink/45 px-7 py-4 shadow-raised">
                    <h3 className="break-words text-lg">{member.name}</h3>
                    <p className="mt-1 text-sm text-accent">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Band>
        )}

        {/* ───────────────────────── FAQ ───────────────────────── */}
        {showFaq && (
          <Band bg="/hero-autumn.webp">
            <SectionHeading
              eyebrow={copy.faq.eyebrow}
              title={copy.faq.title}
              description={copy.faq.subtitle || undefined}
            />
            <div className="mt-9 divide-y divide-white/10 overflow-hidden border border-white/10">
              {faqItems.map((item, index) => (
                <FaqRow
                  key={item.question}
                  id={`about-faq-${index}`}
                  item={item}
                  defaultOpen={index === 0}
                />
              ))}
            </div>
          </Band>
        )}
      </section>
    </MotionConfig>
  );
}

function Band({ children, bg }: { children: ReactNode; bg?: string }) {
  return (
    <div className="about-screen relative overflow-hidden">
      {bg && (
        <>
          <Image src={bg} alt="" fill sizes="100vw" className="object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,10,7,0.95)_0%,rgba(11,10,7,0.8)_50%,rgba(11,10,7,0.95)_100%)]"
          />
        </>
      )}
      <div className="about-screen relative mx-auto flex w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
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

/**
 * The amber-rule eyebrow on its own. Sections whose only admin-editable title
 * is this label render it as their H2 so the heading outline doesn't jump
 * from the page H1 straight to the card H3s.
 */
function Kicker({ children, as: Tag = "p" }: { children: ReactNode; as?: "p" | "h2" }) {
  return (
    <Tag className="nav-text inline-flex items-center gap-2.5 text-xs uppercase text-accent">
      <span aria-hidden="true" className="h-px w-8 bg-accent" />
      {children}
    </Tag>
  );
}

function FaqRow({
  id,
  item,
  defaultOpen,
}: {
  id: string;
  item: { question: string; answer: string };
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const panelId = `${id}-panel`;

  return (
    <div className="bg-ink/80 backdrop-blur-md">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left normal-case transition-colors hover:bg-white/[0.02]"
        >
          <span className="text-base sm:text-lg">{item.question}</span>
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15"
          >
            {open ? (
              <Minus className="h-4 w-4 text-accent" />
            ) : (
              <Plus className="h-4 w-4 text-accent" />
            )}
          </span>
        </button>
      </h3>
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
        aria-hidden={!open}
      >
        <p className="px-6 pb-6 text-sm text-white/70">{item.answer}</p>
      </motion.div>
    </div>
  );
}

function visibleOrdered<T extends { order?: number; isVisible?: boolean }>(items: T[]) {
  return [...items]
    .filter((item) => item.isVisible !== false)
    .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));
}
