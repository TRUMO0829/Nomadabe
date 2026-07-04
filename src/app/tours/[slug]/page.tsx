import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPinned,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { CtaFooter } from "@/components/cta-footer";
import {
  getAdventureDetailInfo,
  getAdventureGalleryImages,
  getAdventureText,
  type Adventure,
} from "@/lib/adventures";
import { getHighResolutionImageUrl } from "@/lib/image-quality";
import { getTrips } from "@/lib/server/admin-store";

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
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "shanghai",
    country: "Хятад",
    title: "Шанхай хотын аяллын хөтөлбөр",
    days: 6,
    price: 3390000,
    image:
      "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "japan",
    country: "Япон",
    title: "Япон 4 хотын аялал",
    days: 5,
    price: 4990000,
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "jeju",
    country: "БНСУ",
    title: "Жэжү арлын аялал",
    days: 5,
    price: 4290000,
    image:
      "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "turkey",
    country: "Турк",
    title: "Анталья, Памуккале, Истанбул",
    days: 8,
    price: 4690000,
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "taiwan",
    country: "Тайвань",
    title: "Тайвань Тайбэй аялал",
    days: 7,
    price: 6790000,
    image:
      "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=3200&q=90&auto=format&fit=crop",
  },
];

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function getStaticOutboundAdventureBySlug(slug: string): Adventure | null {
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
    image: option.image,
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
  const trips = await getTrips();

  return (
    trips.find((adventure) => adventure.slug === decodedSlug) ??
    getStaticOutboundAdventureBySlug(decodedSlug)
  );
}

function formatPrice(adventure: Adventure) {
  if (!adventure.price) {
    return "Үнэ тохиролцоно";
  }

  return `${adventure.price.toLocaleString("mn-MN")} ${adventure.currency}`;
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

  const text = getAdventureText(adventure, "mn");
  const details = getAdventureDetailInfo(adventure, "mn");
  const heroImage = getHighResolutionImageUrl(adventure.image);
  const galleryImages = getAdventureGalleryImages(adventure)
    .slice(0, 4)
    .map((image) => getHighResolutionImageUrl(image));
  const planHref = `/plan?trip=${encodeURIComponent(adventure.slug)}`;

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar />
      <main className="min-h-screen bg-[#f5f3ee] text-[#11100b]">
        <section
          className="relative flex min-h-screen items-end overflow-hidden px-4 pb-12 pt-28 sm:px-6 lg:px-10"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.72)), url(${heroImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative z-10 mx-auto w-full max-w-[1500px] text-white">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border border-white/20 bg-white/12 p-4 backdrop-blur-md">
                <CalendarDays className="h-5 w-5 text-[#ffcc00]" />
                <p className="mt-3 text-xs uppercase text-white/60">Хугацаа</p>
                <p className="mt-1 text-lg">{adventure.days} хоног</p>
              </div>
              <div className="border border-white/20 bg-white/12 p-4 backdrop-blur-md">
                <Users className="h-5 w-5 text-[#ffcc00]" />
                <p className="mt-3 text-xs uppercase text-white/60">Групп</p>
                <p className="mt-1 text-lg">{text.groupSize}</p>
              </div>
              <div className="border border-white/20 bg-white/12 p-4 backdrop-blur-md">
                <Star className="h-5 w-5 text-[#ffcc00]" />
                <p className="mt-3 text-xs uppercase text-white/60">Үнэлгээ</p>
                <p className="mt-1 text-lg">
                  {adventure.rating.toFixed(1)} / {adventure.reviews} review
                </p>
              </div>
              <div className="border border-white/20 bg-white/12 p-4 backdrop-blur-md">
                <MapPinned className="h-5 w-5 text-[#ffcc00]" />
                <p className="mt-3 text-xs uppercase text-white/60">Үнэ</p>
                <p className="mt-1 text-lg">{formatPrice(adventure)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1500px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-10 lg:py-24">
          <div className="space-y-12">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9b7a22]">
                Аяллын дэлгэрэнгүй
              </p>
              <h2 className="mt-4 max-w-3xl text-balance text-[clamp(2.25rem,5vw,5.25rem)] font-light leading-[0.96]">
                Таны аялалд багтах гол мэдээлэл
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {details.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="border border-black/10 bg-white p-5 shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#b9972e]" />
                  <p className="mt-4 text-sm leading-6 text-black/72">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-light">Үнэд багтсан</h3>
                <ul className="mt-6 space-y-4">
                  {details.included.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#b9972e]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-light">Үнэд багтаагүй</h3>
                <ul className="mt-6 space-y-4">
                  {details.excluded.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-black/35" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm lg:p-8">
              <h3 className="text-2xl font-light">Аяллын хөтөлбөр</h3>
              <div className="mt-8 space-y-6">
                {details.itinerary.map((step) => (
                  <div
                    key={`${step.day}-${step.title}`}
                    className="grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-[96px_1fr]"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-[#9b7a22]">
                      Өдөр {step.day}
                    </div>
                    <div>
                      <h4 className="text-xl font-light">{step.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-black/66">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="bg-[#11100b] p-6 text-white shadow-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-white/54">
                Захиалга
              </p>
              <p className="mt-4 text-3xl font-light">{formatPrice(adventure)}</p>
              <p className="mt-3 text-sm leading-6 text-white/64">
                Аяллын боломжит өдөр, хүний тоо болон нэмэлт хэрэгцээгээ
                үлдээгээд зөвлөхтэй холбогдоорой.
              </p>
              <Link
                href={planHref}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#ffcc00] px-5 py-4 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-white"
              >
                Төлөвлөх
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3">
              {galleryImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="aspect-[16/10] bg-[#e4dfd2] bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ))}
            </div>
          </aside>
        </section>

        <CtaFooter />
      </main>
    </>
  );
}
