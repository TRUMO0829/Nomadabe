"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturedAdventures } from "@/components/featured-adventures";
import { TravelStyles } from "@/components/travel-styles";
import { WhyUs } from "@/components/why-us";
import { Testimonials } from "@/components/testimonials";
import { CtaFooter } from "@/components/cta-footer";
import type { Adventure } from "@/lib/adventures";
import type { Language } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/site-settings";

type Props = {
  adventures: Adventure[];
  siteSettings: SiteSettings;
};

export function HomePageClient({ adventures, siteSettings }: Props) {
  const [language, setLanguage] = useState<Language>("mn");
  const [adventureQuery, setAdventureQuery] = useState("");

  function handleAdventureSearch(query: string) {
    setAdventureQuery(query);
    document.getElementById("adventures")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Navbar language={language} onLanguageChange={setLanguage} />
      <main className="flex-1">
        <Hero settings={siteSettings} language={language} onSearch={handleAdventureSearch} />
        <FeaturedAdventures
          adventures={adventures}
          language={language}
          query={adventureQuery}
          onQueryChange={setAdventureQuery}
        />
        <TravelStyles language={language} onStyleSelect={handleAdventureSearch} />
        <WhyUs language={language} />
        <Testimonials language={language} />
        <CtaFooter language={language} />
      </main>
    </>
  );
}
