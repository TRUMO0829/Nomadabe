"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { CtaFooter } from "@/components/cta-footer";
import { useLanguage } from "@/components/language-provider";
import { Navbar } from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import type { CopyLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const COPY: Record<
  CopyLocale,
  { eyebrow: string; title: string; body: string; home: string; tours: string }
> = {
  mn: {
    eyebrow: "404 · Хуудас олдсонгүй",
    title: "Энэ зам хаашаа ч хүргэхгүй байна",
    body: "Таны хайсан хуудас устсан, нэр нь өөрчлөгдсөн эсвэл хэзээ ч байгаагүй байж магадгүй. Нүүр хуудас эсвэл аяллын жагсаалтаас дахин эхлээрэй.",
    home: "Нүүр хуудас",
    tours: "Аяллууд үзэх",
  },
  en: {
    eyebrow: "404 · Page not found",
    title: "This trail doesn't lead anywhere",
    body: "The page you were looking for may have moved, been renamed, or never existed. Start again from the home page or browse our trips.",
    home: "Home page",
    tours: "Browse trips",
  },
  zh: {
    eyebrow: "404 · 页面未找到",
    title: "这条路走不通",
    body: "您要找的页面可能已被移动、重命名或从未存在。请返回首页或浏览我们的行程。",
    home: "返回首页",
    tours: "浏览行程",
  },
  ja: {
    eyebrow: "404 · ページが見つかりません",
    title: "この道はどこにも続いていません",
    body: "お探しのページは移動・名称変更されたか、存在しない可能性があります。トップページまたはツアー一覧からもう一度お探しください。",
    home: "トップページ",
    tours: "ツアーを見る",
  },
  ko: {
    eyebrow: "404 · 페이지를 찾을 수 없음",
    title: "이 길은 어디로도 이어지지 않아요",
    body: "찾으시는 페이지가 이동되었거나 이름이 바뀌었거나 존재하지 않을 수 있습니다. 홈페이지나 여행 목록에서 다시 시작해 보세요.",
    home: "홈페이지",
    tours: "여행 둘러보기",
  },
};

export default function NotFound() {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale] ?? COPY.mn;

  return (
    <>
      <Navbar surface="light" />
      <main className="flex-1 bg-ink text-white">
        <section className="flex min-h-[80svh] items-center pb-20 pt-32">
          <Container>
            <Compass aria-hidden="true" className="h-10 w-10 text-accent" />
            <p className="nav-text mt-8 inline-flex items-center gap-2.5 text-xs uppercase text-accent">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl text-balance break-words text-3xl sm:text-4xl lg:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/72">{copy.body}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className={buttonVariants()}>
                {copy.home}
              </Link>
              <Link href="/tours" className={cn(buttonVariants({ variant: "outline-light" }))}>
                {copy.tours}
              </Link>
            </div>
          </Container>
        </section>
        <CtaFooter />
      </main>
    </>
  );
}
