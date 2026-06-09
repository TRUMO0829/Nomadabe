import { HomePageClient } from "@/components/home-page-client";
import { getSiteSettings, getTrips } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [adventures, siteSettings] = await Promise.all([getTrips(), getSiteSettings()]);

  return (
    <HomePageClient adventures={adventures} siteSettings={siteSettings} />
  );
}
