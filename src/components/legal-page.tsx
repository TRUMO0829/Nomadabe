"use client";

import { useLanguage } from "./language-provider";

export type LegalPageKind = "terms" | "privacy";

export type LegalCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

export const LEGAL_COPY: Record<string, Record<LegalPageKind, LegalCopy>> = {
  mn: {
    terms: {
      eyebrow: "Nomadabe Travel",
      title: "Үйлчилгээний нөхцөл",
      subtitle:
        "Энэхүү нөхцөл нь Nomadabe Travel-ийн вэбсайт, аяллын хүсэлт, зөвлөгөө болон аялал төлөвлөлтийн үйлчилгээ ашиглахтай холбоотой үндсэн мэдээллийг тайлбарлана.",
      updated: "Сүүлд шинэчилсэн: 2026.06.24",
      sections: [
        {
          title: "Үйлчилгээ ашиглах",
          body:
            "Та аяллын хүсэлт, холбоо барих маягт болон вэбсайтын мэдээллийг үнэн зөвөөр ашиглах үүрэгтэй. Аяллын эцсийн хөтөлбөр, үнэ, нөхцөл нь баталгаажсан санал болон гэрээний дагуу хүчинтэй болно.",
        },
        {
          title: "Захиалга ба баталгаажуулалт",
          body:
            "Аяллын чиглэл, хугацаа, хүн тоо, үйлчилгээний хүрээ, төлбөрийн нөхцөлийг харилцан тохиролцсоны дараа захиалга баталгаажна. Нислэг, буудал, гуравдагч талын үйлчилгээний өөрчлөлт тухайн үйлчилгээ үзүүлэгчийн нөхцөлөөс хамаарна.",
        },
        {
          title: "Аяллын мэдээлэл",
          body:
            "Вэбсайт дээрх аяллын тайлбар, зураг, маршрут нь танилцуулгын зориулалттай. Цаг агаар, зам, виз, хилийн нөхцөл, тээвэр болон бусад хүчин зүйлээс шалтгаалан аяллын хөтөлбөр өөрчлөгдөж болно.",
        },
        {
          title: "Хариуцлага",
          body:
            "Nomadabe Travel нь аяллыг мэргэжлийн түвшинд зохион байгуулахыг зорьдог боловч хэрэглэгчийн буруу мэдээлэл, гуравдагч талын саатал, давагдашгүй хүчин зүйлээс үүдсэн эрсдэлийг бүрэн хариуцахгүй.",
        },
      ],
    },
    privacy: {
      eyebrow: "Nomadabe Travel",
      title: "Нууцлалын бодлого",
      subtitle:
        "Энэхүү бодлого нь бид таны аяллын хүсэлт, холбоо барих мэдээлэл болон үйлчилгээ авах үед өгсөн мэдээллийг хэрхэн ашиглаж, хамгаалдгийг тайлбарлана.",
      updated: "Сүүлд шинэчилсэн: 2026.06.24",
      sections: [
        {
          title: "Цуглуулах мэдээлэл",
          body:
            "Бид таны нэр, имэйл, утасны дугаар, аяллын чиглэл, хугацаа, хүн тоо, төсөв болон аялал төлөвлөхөд шаардлагатай нэмэлт мэдээллийг цуглуулж болно.",
        },
        {
          title: "Мэдээлэл ашиглах",
          body:
            "Таны мэдээллийг аяллын санал боловсруулах, үйлчилгээний талаар холбогдох, захиалга зохион байгуулах, хэрэглэгчийн дэмжлэг үзүүлэх зорилгоор ашиглана.",
        },
        {
          title: "Мэдээлэл хамгаалах",
          body:
            "Бид хэрэглэгчийн мэдээллийг зөвшөөрөлгүй хандалт, алдагдал, буруу ашиглалтаас хамгаалах зохистой арга хэмжээ авна. Шаардлагатай тохиолдолд аялал зохион байгуулахад оролцох түнш байгууллагатай зөвхөн хэрэгцээт мэдээллийг хуваалцаж болно.",
        },
        {
          title: "Холбоо барих",
          body:
            "Та өөрийн мэдээлэлтэй холбоотой асуулт, засвар, устгалын хүсэлтээ info@nomadabe.mn хаягаар илгээж болно.",
        },
      ],
    },
  },
  en: {
    terms: {
      eyebrow: "Nomadabe Travel",
      title: "Terms of service",
      subtitle:
        "These terms explain the basic conditions for using Nomadabe Travel's website, trip inquiries, consulting, and travel planning services.",
      updated: "Last updated: 2026.06.24",
      sections: [
        {
          title: "Using the service",
          body:
            "You agree to provide accurate information when using trip request forms, contact forms, and website features. Final itineraries, prices, and conditions apply only after a confirmed proposal or agreement.",
        },
        {
          title: "Bookings and confirmation",
          body:
            "A booking is confirmed after the route, timing, group size, service scope, and payment conditions are agreed. Changes to flights, hotels, and third-party services follow the relevant provider's terms.",
        },
        {
          title: "Trip information",
          body:
            "Trip descriptions, images, and routes on the website are for presentation. Weather, road, visa, border, transport, and other conditions may require itinerary changes.",
        },
        {
          title: "Responsibility",
          body:
            "Nomadabe Travel aims to organize travel professionally, but cannot fully assume responsibility for inaccurate user information, third-party delays, or force majeure events.",
        },
      ],
    },
    privacy: {
      eyebrow: "Nomadabe Travel",
      title: "Privacy policy",
      subtitle:
        "This policy explains how we use and protect the information you provide when sending trip requests, contacting us, or using our services.",
      updated: "Last updated: 2026.06.24",
      sections: [
        {
          title: "Information we collect",
          body:
            "We may collect your name, email, phone number, destination, travel dates, group size, budget, and other details needed for travel planning.",
        },
        {
          title: "How we use information",
          body:
            "We use your information to prepare trip proposals, contact you about services, coordinate bookings, and provide customer support.",
        },
        {
          title: "Protecting information",
          body:
            "We take reasonable measures to protect customer information from unauthorized access, loss, and misuse. When needed, we may share only necessary details with travel partners involved in your trip.",
        },
        {
          title: "Contact",
          body:
            "You can send questions, corrections, or deletion requests about your information to info@nomadabe.mn.",
        },
      ],
    },
  },
};

const LEGAL_BACKGROUND_IMAGES: Record<LegalPageKind, string> = {
  terms:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2600&q=90",
  privacy:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=90",
};

export function LegalPage({ kind }: { kind: LegalPageKind }) {
  const { contentLocale } = useLanguage();
  const copy = LEGAL_COPY[contentLocale]?.[kind] ?? LEGAL_COPY.mn[kind];

  return (
    <section
      className="min-h-screen bg-cover bg-center px-6 pb-16 pt-28 text-white sm:px-10 lg:px-16 lg:pb-24 lg:pt-32"
      style={{
        backgroundImage: `linear-gradient(115deg, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.64) 54%, rgba(0,0,0,0.36) 100%), url(${LEGAL_BACKGROUND_IMAGES[kind]})`,
      }}
    >
      <div className="mx-auto max-w-6xl">
        <article className="rounded-lg border border-white/16 bg-black/34 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-md sm:p-8 lg:p-10">
          <p className="nav-text mb-5 text-xs uppercase text-accent">
            {copy.eyebrow}
          </p>
          <h1 className="font-sans text-[clamp(2.1rem,4vw,3.25rem)] font-black leading-tight tracking-normal text-white">
            {copy.title}
          </h1>

          <div className="mt-8 space-y-6 font-sans text-[1.08rem] leading-[1.55] text-white/76 sm:text-[1.25rem] lg:text-[1.35rem]">
            <p>{copy.subtitle}</p>
            <p>{copy.updated}</p>

            {copy.sections.map((section) => (
              <section key={section.title} className="space-y-4">
                <h2 className="text-[1.15rem] font-black leading-snug text-white sm:text-[1.35rem] lg:text-[1.45rem]">
                  {section.title}
                </h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
