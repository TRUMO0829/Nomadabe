"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import type { CopyLocale } from "@/lib/i18n";

const COPY: Record<
  CopyLocale,
  { eyebrow: string; title: string; body: string; retry: string; home: string }
> = {
  mn: {
    eyebrow: "Алдаа гарлаа",
    title: "Хуудсыг ачаалж чадсангүй",
    body: "Түр зуурын саатал гарсан байж магадгүй. Дахин оролдох эсвэл нүүр хуудас руу буцна уу.",
    retry: "Дахин оролдох",
    home: "Нүүр хуудас",
  },
  en: {
    eyebrow: "Something went wrong",
    title: "We couldn't load this page",
    body: "This may be a temporary problem. Try again, or head back to the home page.",
    retry: "Try again",
    home: "Home page",
  },
  zh: {
    eyebrow: "出现错误",
    title: "页面加载失败",
    body: "可能是暂时性的问题。请重试，或返回首页。",
    retry: "重试",
    home: "返回首页",
  },
  ja: {
    eyebrow: "エラーが発生しました",
    title: "ページを読み込めませんでした",
    body: "一時的な問題の可能性があります。もう一度お試しいただくか、トップページにお戻りください。",
    retry: "もう一度試す",
    home: "トップページ",
  },
  ko: {
    eyebrow: "오류가 발생했습니다",
    title: "페이지를 불러오지 못했습니다",
    body: "일시적인 문제일 수 있습니다. 다시 시도하거나 홈페이지로 돌아가 주세요.",
    retry: "다시 시도",
    home: "홈페이지",
  },
};

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale] ?? COPY.mn;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center bg-ink py-32 text-white">
      <Container>
        <TriangleAlert aria-hidden="true" className="h-10 w-10 text-accent" />
        <p className="nav-text mt-8 inline-flex items-center gap-2.5 text-xs uppercase text-accent">
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          {copy.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-balance break-words text-3xl sm:text-4xl lg:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base text-white/72">{copy.body}</p>
        {error.digest ? (
          <p className="mt-3 text-xs text-white/50">ID: {error.digest}</p>
        ) : null}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={() => unstable_retry()}>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            {copy.retry}
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline-light" })}>
            {copy.home}
          </Link>
        </div>
      </Container>
    </main>
  );
}
