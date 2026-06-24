"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  Compass,
  Handshake,
  Route,
  ShieldCheck,
} from "lucide-react";
import type {
  AboutLocaleContent,
  AboutNavigationItem,
  AboutSectionId,
  AboutSectionSettings,
  TeamMember,
} from "@/lib/site-settings";
import { useLanguage } from "./language-provider";

type AboutShowcaseProps = {
  aboutSection: AboutSectionSettings;
  teamMembers: TeamMember[];
};

const WORK_ICONS = [Compass, CalendarCheck, Route, Handshake] as const;

export function AboutShowcase({ aboutSection, teamMembers }: AboutShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { contentLocale } = useLanguage();
  const copy = aboutSection[contentLocale] ?? aboutSection.mn;
  const team = useMemo(() => getVisibleOrderedItems(teamMembers), [teamMembers]);
  const sections = useMemo(() => getVisibleSections(copy, team.length), [copy, team.length]);
  const firstSection = sections[0]?.id ?? "who";
  const [selectedSection, setSelectedSection] = useState<AboutSectionId>(firstSection);
  const activeSection = sections.some((section) => section.id === selectedSection)
    ? selectedSection
    : firstSection;
  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === activeSection));
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const setActiveSectionByProgress = useCallback(
    (progress: number) => {
      const nextIndex = getSectionIndexFromProgress(progress, sections.length);
      const nextSection = sections[nextIndex]?.id ?? firstSection;

      setSelectedSection((current) => (current === nextSection ? current : nextSection));
    },
    [firstSection, sections]
  );

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

      const viewportMarker = window.innerHeight * 0.38;
      const nextPanel = mobilePanels.reduce((closest, panel) => {
        const closestDistance = Math.abs(closest.getBoundingClientRect().top - viewportMarker);
        const panelDistance = Math.abs(panel.getBoundingClientRect().top - viewportMarker);

        return panelDistance < closestDistance ? panel : closest;
      }, mobilePanels[0]);
      const nextSection = nextPanel.dataset.aboutSection as AboutSectionId | undefined;

      if (nextSection) {
        setSelectedSection((current) => (current === nextSection ? current : nextSection));
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

  const scrollToSection = (index: number, id: AboutSectionId) => {
    setSelectedSection(id);

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
    const targetProgress = getSectionTargetProgress(index, sections.length);
    const targetScroll = sectionTop + availableScroll * targetProgress;

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const sectionStyle = {
    "--about-scroll-height": `${Math.max(6.6, sections.length * 2.2) * 100}svh`,
  } as CSSProperties;

  return (
    <>
      <section className="relative flex min-h-[calc(92svh/var(--site-scale))] items-end overflow-hidden bg-[#120905] px-6 pb-16 pt-28 text-[#fff7ec] sm:px-10 lg:px-16 lg:pb-24 lg:pt-36 xl:px-20">
        <AboutBackground tone="dark" />
        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="trip-meta-text text-xs uppercase tracking-[0.16em] text-[#FFD400]"
          >
            {copy.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-7 max-w-4xl text-balance font-display text-[clamp(2.45rem,5.6vw,5.9rem)] leading-[0.96] text-[#fff7ec]"
          >
            {copy.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.68, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-8 max-w-3xl text-base leading-8 text-[#f4d9b5]/78 lg:text-xl lg:leading-9"
          >
            {copy.body}
          </motion.p>
        </div>
      </section>

      <section
        ref={sectionRef}
        className="relative min-h-screen overflow-hidden bg-[#f7f2e8] text-[#11100b] lg:h-[calc(var(--about-scroll-height)/var(--site-scale))] lg:overflow-clip"
        style={sectionStyle}
      >
        <AboutBackground />

        <div className="relative z-10 grid min-h-screen lg:sticky lg:top-0 lg:h-[calc(100svh/var(--site-scale))] lg:grid-cols-[0.72fr_1px_1.28fr]">
          <div className="flex min-h-[calc(100svh/var(--site-scale))] flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-20">
            <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:max-w-[460px]">
              {sections.map((section, index) => {
                const selected = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => scrollToSection(index, section.id)}
                    className={[
                      "group relative flex min-h-14 items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all duration-300",
                      selected
                        ? "border-[#d7bd6c]/70 bg-white/72 text-[#11100b] shadow-[0_16px_45px_rgba(92,76,45,0.08)]"
                        : "border-[#d7bd6c]/25 bg-white/36 text-[#4f483c]/68 hover:border-[#d7bd6c]/55 hover:bg-white/62",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-2 w-2 rounded-full transition-colors",
                        selected ? "bg-[#b99631]" : "bg-[#d7bd6c]/35",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] text-[#FFD400]/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 text-sm uppercase leading-snug tracking-normal">
                      {section.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {copy.cta.isVisible && copy.cta.label && copy.cta.href ? (
              <a
                href={copy.cta.href}
                className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-lg border border-[#d7bd6c]/45 bg-white/72 px-4 text-sm text-[#11100b] shadow-[0_16px_40px_rgba(92,76,45,0.08)] transition-colors hover:border-[#b99631]"
              >
                {copy.cta.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>

          <div className="relative hidden bg-[#c9b16b]/35 lg:block">
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-[16%] h-20 w-px -translate-x-1/2 bg-[#8f7020]/28"
              animate={{ y: `${activeIndex * 58}px` }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="relative hidden min-h-[calc(100svh/var(--site-scale))] items-center px-6 py-8 sm:px-10 lg:flex lg:overflow-hidden lg:px-10 xl:px-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: -42 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 56 }}
                transition={{ duration: 0.64, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[700px]"
              >
                <AboutPanel section={activeSection} copy={copy} team={team} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative z-10 space-y-12 px-6 pb-16 sm:px-10 lg:hidden">
          {sections.map((section, index) => (
            <section
              key={section.id}
              data-about-mobile-panel
              data-about-section={section.id}
              className="scroll-mt-24 border-t border-[#d7bd6c]/35 pt-8"
            >
              <div className="mb-5 flex items-center gap-3 text-[#11100b]">
                <span className="h-2 w-2 rounded-full bg-[#b99631]" aria-hidden="true" />
                <span className="trip-meta-text text-xs uppercase tracking-[0.16em]">
                  {section.label}
                </span>
                <span className="ml-auto text-xs text-[#6b604e]/50">{index + 1}</span>
              </div>
              <AboutPanel section={section.id} copy={copy} team={team} />
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

function AboutBackground({ tone = "light" }: { tone?: "light" | "dark" }) {
  if (tone === "dark") {
    return (
      <>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,129,35,0.28),transparent_34%),linear-gradient(135deg,#090604_0%,#1b0c05_48%,#3a1607_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(90deg,rgba(255,169,77,0.32)_1px,transparent_1px),linear-gradient(180deg,rgba(255,169,77,0.18)_1px,transparent_1px)] [background-size:96px_96px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-[#160904]/44 to-transparent"
        />
        <svg
          aria-hidden="true"
          className="absolute right-[-12%] top-12 h-[70%] w-[58%] text-[#ff9a2f]/28"
          viewBox="0 0 620 720"
          fill="none"
        >
          <path
            d="M37 640C149 520 57 401 183 305C286 226 376 306 457 196C516 116 496 66 586 28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="10 18"
          />
          <path
            d="M96 118C208 172 259 65 363 116C466 166 417 282 540 323"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="8 14"
          />
        </svg>
      </>
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,#fffdf8_0%,#f7f0e3_48%,#edf4f6_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(90deg,rgba(143,112,32,0.16)_1px,transparent_1px),linear-gradient(180deg,rgba(143,112,32,0.1)_1px,transparent_1px)] [background-size:96px_96px]"
      />
      <svg
        aria-hidden="true"
        className="absolute right-[-12%] top-12 h-[70%] w-[58%] text-[#b99631]/20"
        viewBox="0 0 620 720"
        fill="none"
      >
        <path
          d="M37 640C149 520 57 401 183 305C286 226 376 306 457 196C516 116 496 66 586 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="10 18"
        />
        <path
          d="M96 118C208 172 259 65 363 116C466 166 417 282 540 323"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="8 14"
        />
      </svg>
    </>
  );
}

function AboutPanel({
  section,
  copy,
  team,
}: {
  section: AboutSectionId;
  copy: AboutLocaleContent;
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

function WhoPanel({ copy }: { copy: AboutLocaleContent }) {
  const stats = getVisibleOrderedItems(copy.who.stats);

  return (
    <div>
      <div>
        <p className="trip-meta-text text-sm uppercase tracking-[0.16em] text-[#FFD400]">
          {copy.who.label}
        </p>
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-xl text-sm leading-7 text-[#39352c]/74 lg:text-base lg:leading-8"
        >
          {copy.who.text}
        </motion.p>
        <div className="mt-8 grid gap-0">
          {stats.map((stat, index) => (
            <motion.div
              key={`${stat.value}-${stat.label}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[minmax(120px,0.58fr)_minmax(0,0.42fr)] items-center gap-5 border-b border-[#d7bd6c]/25 py-5 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="font-display text-[clamp(4.5rem,8.2vw,7.5rem)] leading-[0.84] text-[#11100b]">
                {stat.value}
              </div>
              <p className="justify-self-end text-right text-sm leading-6 text-[#11100b] lg:max-w-[190px] lg:text-lg lg:leading-7">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ValuesPanel({ copy }: { copy: AboutLocaleContent }) {
  const values = getVisibleOrderedItems(copy.values.items);

  return (
    <div>
      <p className="trip-meta-text text-sm uppercase tracking-[0.16em] text-[#FFD400]">
        {copy.values.label}
      </p>
      <div className="mt-5 grid gap-2.5">
        <div className="grid gap-2.5">
          {values.map((value, index) => (
            <motion.article
              key={value.title}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-lg border border-[#d7bd6c]/25 bg-white/68 p-3.5 shadow-[0_12px_30px_rgba(92,76,45,0.055)] backdrop-blur lg:p-4"
            >
              <div className="flex items-center justify-between gap-4 text-[#FFD400]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="trip-meta-text text-[11px] tracking-[0.14em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-2.5 text-lg leading-tight text-[#11100b] lg:text-xl">
                {value.title}
              </h2>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#39352c]/68 lg:text-sm lg:leading-6">
                {value.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamPanel({ copy, team }: { copy: AboutLocaleContent; team: TeamMember[] }) {
  return (
    <div>
      <p className="trip-meta-text text-sm uppercase tracking-[0.16em] text-[#FFD400]">
        {copy.team.label}
      </p>
      <div className="mt-7 grid gap-5 xl:grid-cols-2">
        {team.map((member, index) => (
          <motion.article
            key={member.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="group relative min-h-[390px] overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_20px_60px_rgba(92,76,45,0.1)]"
          >
            {member.image ? (
              <div
                role="img"
                aria-label={member.imageAlt || member.name}
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url('${member.image}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(145deg,#fffdf8,#e8dcc5)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/12 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-7">
              <p className="text-2xl leading-tight lg:text-3xl">{member.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#f6d36c]">
                {member.role}
              </p>
              {member.bio ? (
                <p className="mt-4 text-sm leading-7 text-white/76">{member.bio}</p>
              ) : null}
            </div>
            {!member.image ? (
              <div className="absolute left-6 top-6 text-[clamp(4rem,7vw,7rem)] leading-none text-[#b99631]/26">
                {String(index + 1).padStart(2, "0")}
              </div>
            ) : null}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function WorkPanel({ copy }: { copy: AboutLocaleContent }) {
  const workItems = getVisibleOrderedItems(copy.work.items);

  return (
    <div>
      <p className="trip-meta-text text-sm uppercase tracking-[0.16em] text-[#FFD400]">
        {copy.work.label}
      </p>
      <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl leading-tight text-[#11100b] lg:text-3xl">
        {copy.work.title}
      </h2>
      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 max-w-xl text-xs leading-6 text-[#39352c]/68 lg:text-sm"
      >
        {copy.work.body}
      </motion.p>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {workItems.map((item, index) => {
          const Icon = WORK_ICONS[index % WORK_ICONS.length];

          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-28 rounded-lg border border-[#d7bd6c]/25 bg-white/68 p-3.5 shadow-[0_12px_30px_rgba(92,76,45,0.055)] backdrop-blur"
            >
              <div className="flex items-center justify-between text-[#FFD400]">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="trip-meta-text text-[11px] tracking-[0.14em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 text-base leading-tight text-[#11100b] lg:text-lg">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-[#39352c]/68 lg:text-sm">
                {item.body}
              </p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function getVisibleSections(copy: AboutLocaleContent, teamCount: number): AboutNavigationItem[] {
  const sectionVisibility: Record<AboutSectionId, boolean> = {
    who: copy.who.isVisible !== false,
    values: copy.values.isVisible !== false && getVisibleOrderedItems(copy.values.items).length > 0,
    team: copy.team.isVisible !== false && teamCount > 0,
    work: copy.work.isVisible !== false && getVisibleOrderedItems(copy.work.items).length > 0,
  };

  return getVisibleOrderedItems(copy.navigation).filter((section) => sectionVisibility[section.id]);
}

function getSectionIndexFromProgress(progress: number, sectionCount: number) {
  if (sectionCount <= 1) {
    return 0;
  }

  const clampedProgress = Math.min(0.999, Math.max(0, progress));
  const segmentSize = 1 / (sectionCount + 0.8);

  return Math.min(sectionCount - 1, Math.floor(clampedProgress / segmentSize));
}

function getSectionTargetProgress(index: number, sectionCount: number) {
  if (sectionCount <= 1) {
    return 0;
  }

  const segmentSize = 1 / (sectionCount + 0.8);

  return Math.min(0.92, Math.max(0, index * segmentSize));
}

function getVisibleOrderedItems<T extends { order?: number; isVisible?: boolean }>(items: T[]) {
  return [...items]
    .filter((item) => item.isVisible !== false)
    .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));
}
