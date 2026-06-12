"use client";

import { FeaturedAdventures } from "@/components/featured-adventures";
import { FeaturedTripsCarousel } from "@/components/featured-trips-carousel";
import { OutboundTripsCarousel } from "@/components/outbound-trips-carousel";
import { TravelOptionsCarousel } from "@/components/travel-options-carousel";
import type { Adventure } from "@/lib/adventures";

type ToursExperienceProps = {
  adventures: Adventure[];
};

export function ToursExperience({ adventures }: ToursExperienceProps) {
  return (
    <FeaturedAdventures
      adventures={adventures}
      beforeList={(
        <>
          <FeaturedTripsCarousel adventures={adventures} />
          <OutboundTripsCarousel adventures={adventures} />
          <TravelOptionsCarousel adventures={adventures} />
        </>
      )}
    />
  );
}
