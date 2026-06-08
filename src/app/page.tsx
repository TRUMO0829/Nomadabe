import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturedAdventures } from "@/components/featured-adventures";
import { TravelStyles } from "@/components/travel-styles";
import { WhyUs } from "@/components/why-us";
import { Testimonials } from "@/components/testimonials";
import { CtaFooter } from "@/components/cta-footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedAdventures />
        <TravelStyles />
        <WhyUs />
        <Testimonials />
        <CtaFooter />
      </main>
    </>
  );
}
