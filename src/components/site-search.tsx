"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "./language-provider";

const SITE_SEARCH_COPY = {
  mn: {
    placeholder: "Аялал, улс, хот хайх...",
    button: "Хайх",
    label: "Аялал хайх",
  },
  en: {
    placeholder: "Search trips, countries, cities...",
    button: "Search",
    label: "Search trips",
  },
  zh: {
    placeholder: "搜索旅行、国家、城市...",
    button: "搜索",
    label: "搜索旅行",
  },
  ja: {
    placeholder: "ツアー、国、都市を検索...",
    button: "検索",
    label: "ツアーを検索",
  },
  ko: {
    placeholder: "여행, 국가, 도시 검색...",
    button: "검색",
    label: "여행 검색",
  },
} as const;

export function SiteSearch({ compact = false }: { compact?: boolean }) {
  const { contentLocale } = useLanguage();
  const [query, setQuery] = useState("");
  const copy = SITE_SEARCH_COPY[contentLocale];

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    window.location.href = trimmedQuery
      ? `/tours?search=${encodeURIComponent(trimmedQuery)}`
      : "/tours";
  }

  return (
    <form
      onSubmit={handleSearch}
      aria-label={copy.label}
      className={[
        "flex w-full items-center gap-2 rounded-full border border-white/45 bg-white/18 p-1.5 text-left shadow-[0_8px_22px_rgba(0,0,0,0.18)] backdrop-blur-[2px]",
        compact ? "max-w-[min(92vw,560px)]" : "max-w-[min(92vw,620px)]",
      ].join(" ")}
    >
      <Search className="ml-3 h-4 w-4 shrink-0 text-white/86 drop-shadow sm:ml-4" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={copy.placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none drop-shadow placeholder:text-white/78"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-black text-accent-foreground transition-colors hover:bg-secondary"
      >
        {copy.button}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
