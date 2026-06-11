import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { FeaturedAdventures } from "@/components/featured-adventures";
import { CtaFooter } from "@/components/cta-footer";
import { getTrips } from "@/lib/server/admin-store";

export const metadata: Metadata = {
  title: "Nomadabe",
  description:
    "Nomadabe Travel-ийн гадаад болон дотоод аяллуудыг нэг дороос хайж сонго.",
};

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const adventures = await getTrips();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FeaturedAdventures adventures={adventures} />
        <CtaFooter />
      </main>
    </>
  );
}
