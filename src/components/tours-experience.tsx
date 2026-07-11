"use client";

import { FeaturedAdventures } from "@/components/featured-adventures";
import { FeaturedTripsCarousel } from "@/components/featured-trips-carousel";
import type { Adventure } from "@/lib/adventures";
import type { StayOption } from "@/lib/site-settings";

type ToursExperienceProps = {
  adventures: Adventure[];
  outboundTripImages?: Record<string, string>;
  stays?: StayOption[];
  pageMode?: "all" | "outbound" | "domestic";
};

export function ToursExperience({
  adventures,
  outboundTripImages,
  stays,
  pageMode = "all",
}: ToursExperienceProps) {
  return (
    <FeaturedAdventures
      adventures={adventures}
      outboundTripImages={outboundTripImages}
      stays={stays}
      pageMode={pageMode}
      beforeList={pageMode === "all" ? (
        <>
          <FeaturedTripsCarousel adventures={adventures} variant="compact" />
        </>
      ) : null}
    />
  );
}
