import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TravelStyles } from "@/components/travel-styles";
import { WhyUs } from "@/components/why-us";
import { Testimonials } from "@/components/testimonials";
import { CtaFooter } from "@/components/cta-footer";
import { LanguageProvider } from "@/components/language-provider";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { TravelOptionsCarousel } from "@/components/travel-options-carousel";
import { FeaturedTripsCarousel } from "@/components/featured-trips-carousel";
import { OutboundTripsCarousel } from "@/components/outbound-trips-carousel";

export default function Home() {
  return (
    <LanguageProvider>
      <SignupPromptModal />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TravelOptionsCarousel />
        <OutboundTripsCarousel />
        <FeaturedTripsCarousel />
        <TravelStyles />
        <WhyUs />
        <Testimonials />
        <CtaFooter />
      </main>
    </LanguageProvider>
  );
}
