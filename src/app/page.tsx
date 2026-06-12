import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { WhyUs } from "@/components/why-us";
import { Testimonials } from "@/components/testimonials";
import { CtaFooter } from "@/components/cta-footer";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { TravelOptionsCarousel } from "@/components/travel-options-carousel";
import { FeaturedTripsCarousel } from "@/components/featured-trips-carousel";
import { OutboundTripsCarousel } from "@/components/outbound-trips-carousel";
import { getTrips } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const adventures = await getTrips();

  return (
    <>
      <SignupPromptModal />
      <Navbar showHomeSearch />
      <main className="flex-1">
        <Hero />
        <TravelOptionsCarousel adventures={adventures} />
        <OutboundTripsCarousel adventures={adventures} />
        <FeaturedTripsCarousel adventures={adventures} />
        <WhyUs />
        <Testimonials />
        <CtaFooter />
      </main>
    </>
  );
}
