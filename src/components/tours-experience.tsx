"use client";

import { FeaturedAdventures } from "@/components/featured-adventures";
import { FeaturedTripsCarousel } from "@/components/featured-trips-carousel";
import type { Adventure } from "@/lib/adventures";

type ToursExperienceProps = {
  adventures: Adventure[];
  outboundTripImages?: Record<string, string>;
};

export function ToursExperience({
  adventures,
  outboundTripImages,
}: ToursExperienceProps) {
  return (
    <FeaturedAdventures
      adventures={adventures}
      outboundTripImages={outboundTripImages}
      beforeList={(
        <>
          <FeaturedTripsCarousel adventures={adventures} variant="compact" />
        </>
      )}
    />
  );
}
