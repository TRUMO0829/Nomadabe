import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { CtaFooter } from "@/components/cta-footer";
import { TourDetailBody } from "@/components/tour-detail-body";
import { getAdventureText, type Adventure } from "@/lib/adventures";
import { getAdminStore } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

type TourDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type StaticOutboundTrip = {
  id: string;
  country: string;
  title: string;
  days: number;
  price: number;
  image: string;
};

const STATIC_OUTBOUND_TRIPS: StaticOutboundTrip[] = [
  {
    id: "zhangjiajie",
    country: "Хятад",
    title: "Жанжиажэ аялал /Аватар/",
    days: 8,
    price: 2990000,
    image:
      "https://images.unsplash.com/photo-1561031454-4f1331bd2a34?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "shanghai",
    country: "Хятад",
    title: "Шанхай хотын аяллын хөтөлбөр",
    days: 6,
    price: 3390000,
    image:
      "https://images.unsplash.com/photo-1748078096261-5eff2aee113f?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "japan",
    country: "Япон",
    title: "Япон 4 хотын аялал",
    days: 5,
    price: 4990000,
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "jeju",
    country: "БНСУ",
    title: "Жэжү арлын аялал",
    days: 5,
    price: 4290000,
    image:
      "https://images.unsplash.com/photo-1667971286457-144269b0e4d8?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "turkey",
    country: "Турк",
    title: "Анталья, Памуккале, Истанбул",
    days: 8,
    price: 4690000,
    image:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "taiwan",
    country: "Тайвань",
    title: "Тайвань Тайбэй аялал",
    days: 7,
    price: 6790000,
    image:
      "https://images.unsplash.com/photo-1748104433499-3d492d0337cb?w=3200&q=90&auto=format&fit=crop",
  },
];

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function getStaticOutboundAdventureBySlug(
  slug: string,
  outboundTripImages: Record<string, string>
): Adventure | null {
  const option = STATIC_OUTBOUND_TRIPS.find(
    (trip) => `static-outbound-${trip.id}` === slug
  );

  if (!option) {
    return null;
  }

  return {
    id: `static-outbound-${option.id}`,
    slug: `static-outbound-${option.id}`,
    title: option.title,
    location: option.country,
    country: option.country,
    days: option.days,
    groupSize: "Жижиг групп",
    difficulty: "Easy",
    price: option.price,
    currency: "MNT",
    image: outboundTripImages[option.id] || option.image,
    tags: ["Гадаад аялал", option.country],
    rating: 4.8,
    reviews: 24,
    category: "outbound",
    summary: `${option.country} чиглэлийн ${option.days} хоногийн гадаад аяллын багц. Маршрут, буудал, тээвэр болон аяллын зөвлөгөөг нэг дор зохион байгуулна.`,
    idealFor: ["Гэр бүл", "Жижиг групп", "Амралт"],
    includes: [
      "Маршрут төлөвлөлт",
      "Аяллын зөвлөгөө",
      "Зохион байгуулалт",
    ],
    businessSupport: [],
    nextDeparture: "Тохиролцоно",
  };
}

async function getTourBySlug(slug: string) {
  const decodedSlug = decodeSlug(slug);
  const { trips, siteSettings } = await getAdminStore();

  return (
    trips.find((adventure) => adventure.slug === decodedSlug) ??
    getStaticOutboundAdventureBySlug(decodedSlug, siteSettings.outboundTripImages)
  );
}

export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const adventure = await getTourBySlug(slug);

  if (!adventure) {
    return {
      title: "Nomadabe",
    };
  }

  const text = getAdventureText(adventure, "mn");

  return {
    title: `${text.title} | Nomadabe Travel`,
    description: text.summary,
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  const adventure = await getTourBySlug(slug);

  if (!adventure) {
    notFound();
  }

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar />
      <TourDetailBody adventure={adventure} />
      <CtaFooter />
    </>
  );
}
