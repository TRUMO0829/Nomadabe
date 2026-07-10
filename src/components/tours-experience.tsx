"use client";

import { FeaturedAdventures } from "@/components/featured-adventures";
import { FeaturedTripsCarousel } from "@/components/featured-trips-carousel";
import type { Adventure } from "@/lib/adventures";
import type { StayOption } from "@/lib/site-settings";

type ToursExperienceProps = {
  adventures: Adventure[];
  outboundTripImages?: Record<string, string>;
  stays?: StayOption[];
};

export function ToursExperience({
  adventures,
  outboundTripImages,
  stays,
}: ToursExperienceProps) {
  return (
    <FeaturedAdventures
      adventures={adventures}
      outboundTripImages={outboundTripImages}
      stays={stays}
      beforeList={(
        <>
          <FeaturedTripsCarousel adventures={adventures} variant="compact" />
        </>
      )}
    />
  );
}
