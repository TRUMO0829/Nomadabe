import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { CtaFooter } from "@/components/cta-footer";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { TravelOptionsCarousel } from "@/components/travel-options-carousel";
import { FeaturedTripsCarousel } from "@/components/featured-trips-carousel";
import { OutboundTripsCarousel } from "@/components/outbound-trips-carousel";
import { getAdminStore, getSiteReviews } from "@/lib/server/admin-store";
import { getPublicReviews, toPublicSiteSettings } from "@/lib/site-settings";

// Content changes only when an admin saves, and every admin action calls
// revalidatePath, so the page is rebuilt immediately on a change. The window
// below is just a backstop; it replaces force-dynamic, which made every single
// visitor trigger a fresh round of Supabase queries.
export const revalidate = 300;

export default async function Home() {
  const [{ trips: adventures, siteSettings }, reviews] = await Promise.all([
    getAdminStore(),
    getSiteReviews(),
  ]);

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <main className="flex-1">
        <Hero settings={toPublicSiteSettings(siteSettings)} />
        <TravelOptionsCarousel adventures={adventures} />
        <OutboundTripsCarousel
          adventures={adventures}
          outboundTripImages={siteSettings.outboundTripImages}
        />
        <FeaturedTripsCarousel adventures={adventures} variant="compact" />
        <Testimonials reviews={getPublicReviews(reviews)} />
        <CtaFooter />
      </main>
    </>
  );
}
