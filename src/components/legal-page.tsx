"use client";

import { useLanguage } from "./language-provider";

type LegalPageKind = "terms" | "privacy";

type LegalCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

const LEGAL_COPY: Record<string, Record<LegalPageKind, LegalCopy>> = {
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

export function LegalPage({ kind }: { kind: LegalPageKind }) {
  const { contentLocale } = useLanguage();
  const copy = LEGAL_COPY[contentLocale]?.[kind] ?? LEGAL_COPY.mn[kind];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-6 pb-20 pt-28 text-[#11100b] sm:px-10 lg:px-16 lg:pb-28 lg:pt-36">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,#fffdf8_0%,#f7f0e3_52%,#eef6f8_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(90deg,rgba(143,112,32,0.14)_1px,transparent_1px),linear-gradient(180deg,rgba(143,112,32,0.1)_1px,transparent_1px)] [background-size:96px_96px]"
      />

      <div className="relative mx-auto max-w-5xl">
        <p className="trip-meta-text text-xs uppercase tracking-[0.16em] text-[#FFD400]">
          {copy.eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl text-balance font-display text-[clamp(3rem,7vw,6.4rem)] leading-[0.94] text-[#11100b]">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#39352c]/72 lg:text-xl lg:leading-9">
          {copy.subtitle}
        </p>
        <p className="mt-5 text-sm text-[#6b604e]/70">{copy.updated}</p>

        <div className="mt-12 grid gap-4">
          {copy.sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-lg border border-[#d7bd6c]/25 bg-white/72 p-5 shadow-[0_16px_45px_rgba(92,76,45,0.06)] backdrop-blur lg:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="trip-meta-text mt-1 text-xs tracking-[0.14em] text-[#FFD400]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-2xl leading-tight text-[#11100b]">{section.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#39352c]/72 lg:text-base">
                    {section.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
