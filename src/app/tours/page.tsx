import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { FeaturedAdventures } from "@/components/featured-adventures";
import { CtaFooter } from "@/components/cta-footer";
import { LanguageProvider } from "@/components/language-provider";
import { getTrips } from "@/lib/server/admin-store";

export const metadata: Metadata = {
  title: "Аяллууд | Nomadabe Travel",
  description:
    "Nomadabe Travel-ийн гадаад болон дотоод аяллуудыг нэг дороос хайж сонго.",
};

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const adventures = await getTrips();

  return (
    <LanguageProvider>
      <Navbar />
      <main className="flex-1">
        <FeaturedAdventures adventures={adventures} />
        <CtaFooter />
      </main>
    </LanguageProvider>
  );
}
