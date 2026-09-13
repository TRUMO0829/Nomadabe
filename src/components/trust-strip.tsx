"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ShieldCheck } from "lucide-react";
import { CONTAINER } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

const TRUST_COPY = {
  mn: {
    label: "Итгэл",
    items: [
      "Монголын аялал жуулчлалын холбооны гишүүн",
      "Олон улсын тур операторын чиглэлээр бүртгэлтэй",
      "Улаанбаатар, Minister Tower-т оффистой",
    ],
    more: "Бидний тухай",
  },
  en: {
    label: "Trust",
    items: [
      "Member of the Mongolian Tourism Association",
      "Registered international tour operator",
      "Office in Minister Tower, Ulaanbaatar",
    ],
    more: "About us",
  },
  zh: {
    label: "信誉",
    items: ["蒙古旅游协会会员", "注册国际旅游经营者", "乌兰巴托 Minister Tower 设有办公室"],
    more: "关于我们",
  },
  ja: {
    label: "信頼",
    items: [
      "モンゴル観光協会 会員",
      "国際ツアーオペレーターとして登録",
      "ウランバートル Minister Tower にオフィス",
    ],
    more: "私たちについて",
  },
  ko: {
    label: "신뢰",
    items: ["몽골관광협회 회원사", "국제 투어 운영사 등록", "울란바토르 Minister Tower 사무실"],
    more: "회사 소개",
  },
} as const;

const ICONS = [ShieldCheck, BadgeCheck, Building2];

/**
 * The strongest real trust signals the business has — association membership,
 * operator registration, a physical office — used to live only on /about.
 */
export function TrustStrip() {
  const { contentLocale } = useLanguage();
  const copy = TRUST_COPY[contentLocale];

  return (
    <section aria-label={copy.label} className="border-b border-border bg-background">
      <div
        className={cn(
          CONTAINER,
          "flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between"
        )}
      >
        <ul className="grid gap-3 sm:grid-cols-3 lg:flex lg:gap-10">
          {copy.items.map((item, index) => {
            const Icon = ICONS[index];

            return (
              <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                <Icon className="h-5 w-5 shrink-0 text-accent-text" aria-hidden="true" />
                {item}
              </li>
            );
          })}
        </ul>
        <Link
          href="/about"
          className="nav-text inline-flex shrink-0 items-center gap-2 text-xs uppercase text-foreground underline-offset-4 hover:underline"
        >
          {copy.more}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
