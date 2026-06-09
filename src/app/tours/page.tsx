import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { FeaturedAdventures } from "@/components/featured-adventures";
import { CtaFooter } from "@/components/cta-footer";
import { LanguageProvider } from "@/components/language-provider";

export const metadata: Metadata = {
  title: "Аяллууд | Nomadabe Travel",
  description:
    "Nomadabe Travel-ийн гадаад болон дотоод аяллуудыг нэг дороос хайж сонго.",
};

export default function ToursPage() {
  return (
    <LanguageProvider>
      <Navbar />
      <main className="flex-1">
        <FeaturedAdventures />
        <CtaFooter />
      </main>
    </LanguageProvider>
  );
}
