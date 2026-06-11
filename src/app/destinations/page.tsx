import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { TravelStyles } from "@/components/travel-styles";
import { CtaFooter } from "@/components/cta-footer";
import { getTrips } from "@/lib/server/admin-store";

export const metadata: Metadata = {
  title: "Destinations | Nomadabe",
  description:
    "Browse Nomadabe domestic and outbound destinations by country, city, and travel style.",
};

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const adventures = await getTrips();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        <TravelStyles adventures={adventures} />
        <CtaFooter />
      </main>
    </>
  );
}
