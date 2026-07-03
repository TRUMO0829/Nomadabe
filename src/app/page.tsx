import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { CtaFooter } from "@/components/cta-footer";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { TravelOptionsCarousel } from "@/components/travel-options-carousel";
import { FeaturedTripsCarousel } from "@/components/featured-trips-carousel";
import { OutboundTripsCarousel } from "@/components/outbound-trips-carousel";
import { getAdminStore } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { trips: adventures, siteSettings } = await getAdminStore();

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <main className="flex-1">
        <Hero settings={siteSettings} />
        <TravelOptionsCarousel adventures={adventures} />
        <OutboundTripsCarousel adventures={adventures} />
        <FeaturedTripsCarousel adventures={adventures} variant="compact" />
        <Testimonials />
        <CtaFooter />
      </main>
    </>
  );
}
