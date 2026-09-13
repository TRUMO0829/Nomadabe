import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { CtaFooter } from "@/components/cta-footer";
import { TripDetailView } from "@/components/trip-detail-view";
import {
  getAdventureGalleryImages,
  getAdventureText,
  type Adventure,
} from "@/lib/adventures";
import { getHighResolutionImageUrl } from "@/lib/image-quality";
import {
  OUTBOUND_OPTIONS,
  STATIC_OUTBOUND_SLUG_PREFIX,
  getStaticOutboundAdventureBySlug,
} from "@/lib/outbound-trips";
import { getAdminStore } from "@/lib/server/admin-store";
import { absoluteUrl } from "@/lib/site-url";

// Content changes only when an admin saves, and every admin action calls
// revalidatePath, so the page is rebuilt immediately on a change. The window
// below is just a backstop; it replaces force-dynamic, which made every single
// visitor trigger a fresh round of Supabase queries.
export const revalidate = 300;

// Prerender the trips that exist at build time; anything added later is rendered
// on first request and then cached under the same window.
export async function generateStaticParams() {
  const { trips } = await getAdminStore();

  return [
    ...trips.map((trip) => ({ slug: trip.slug })),
    ...OUTBOUND_OPTIONS.map((option) => ({
      slug: `${STATIC_OUTBOUND_SLUG_PREFIX}${option.id}`,
    })),
  ];
}

type TourDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

async function getTourBySlug(slug: string) {
  const decodedSlug = decodeSlug(slug);
  const { trips, siteSettings } = await getAdminStore();

  return (
    trips.find((adventure) => adventure.slug === decodedSlug) ??
    getStaticOutboundAdventureBySlug(
      decodedSlug,
      siteSettings.outboundTripImages,
      "Тохиролцоно"
    )
  );
}

export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const adventure = await getTourBySlug(slug);

  if (!adventure) {
    return {
      title: "Аялал олдсонгүй",
    };
  }

  const text = getAdventureText(adventure, "mn");
  const image = getHighResolutionImageUrl(adventure.image);
  const path = `/tours/${adventure.slug}`;

  return {
    title: text.title,
    description: text.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: text.title,
      description: text.summary,
      url: path,
      images: image ? [{ url: image, alt: text.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: text.title,
      description: text.summary,
      images: image ? [image] : undefined,
    },
  };
}

/**
 * Search engines show trips with price, duration, and rating when the page
 * carries TouristTrip structured data — the single highest-leverage SEO item
 * for a travel catalogue.
 */
function getTripJsonLd(adventure: Adventure, text: ReturnType<typeof getAdventureText>) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: text.title,
    description: text.summary,
    url: absoluteUrl(`/tours/${adventure.slug}`),
    image: getHighResolutionImageUrl(adventure.image) || undefined,
    touristType: text.idealFor,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: adventure.days,
      itemListElement: (adventure.itinerary ?? []).map((step, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: step.title,
      })),
    },
    provider: {
      "@type": "TravelAgency",
      name: "Nomadabe Travel",
      url: absoluteUrl("/"),
    },
    ...(adventure.price > 0
      ? {
          offers: {
            "@type": "Offer",
            price: adventure.price,
            priceCurrency: adventure.currency,
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/plan?trip=${encodeURIComponent(adventure.slug)}`),
          },
        }
      : {}),
    // Only real, collected reviews: never emit a rating we cannot back up.
    ...(adventure.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: adventure.rating,
            reviewCount: adventure.reviews,
          },
        }
      : {}),
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  const adventure = await getTourBySlug(slug);

  if (!adventure) {
    notFound();
  }

  // Metadata and structured data stay Mongolian (the site's primary locale);
  // the visible body is rendered by TripDetailView in the visitor's language.
  const text = getAdventureText(adventure, "mn");
  // next/image fetches the source once and resizes it itself, so ask Unsplash
  // for a sane master size instead of the 3200px / q90 default.
  const heroImage = getHighResolutionImageUrl(adventure.image, { width: 2400, quality: 80 });
  const allImages = getAdventureGalleryImages(adventure);
  // The first gallery entry is the hero photo; skip it so the aside doesn't
  // repeat the image the visitor just scrolled past.
  const galleryImages = (allImages.length > 1 ? allImages.slice(1, 5) : allImages).map(
    (image) => getHighResolutionImageUrl(image, { width: 1200, quality: 80 })
  );
  const planHref = `/plan?trip=${encodeURIComponent(adventure.slug)}`;

  return (
    <>
      <script
        type="application/ld+json"
        // Structured data is generated from our own trip record, not user input.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getTripJsonLd(adventure, text)),
        }}
      />
      <SignupPromptModal autoOpen={false} />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <TripDetailView
          adventure={adventure}
          heroImage={heroImage}
          galleryImages={galleryImages}
          planHref={planHref}
        />
        <CtaFooter />
      </main>
    </>
  );
}
