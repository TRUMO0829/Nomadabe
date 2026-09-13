"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import type { CopyLocale } from "@/lib/i18n";
import { Container } from "./ui/section";
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

export const LEGAL_COPY: Record<CopyLocale, Record<LegalPageKind, LegalCopy>> = {
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
  zh: {
    terms: {
      eyebrow: "Nomadabe Travel",
      title: "服务条款",
      subtitle:
        "本条款说明使用 Nomadabe Travel 网站、行程咨询、顾问及旅行规划服务的基本条件。",
      updated: "最后更新：2026.06.24",
      sections: [
        {
          title: "使用服务",
          body:
            "您在使用行程咨询表、联系表及网站功能时，应提供真实准确的信息。最终行程、价格和条件以确认后的方案或合同为准。",
        },
        {
          title: "预订与确认",
          body:
            "路线、时间、人数、服务范围及付款条件经双方商定后，预订方可确认。航班、酒店及第三方服务的变更，以相应服务提供方的条款为准。",
        },
        {
          title: "行程信息",
          body:
            "网站上的行程介绍、图片和路线仅供展示参考。受天气、道路、签证、边境、交通等因素影响，行程可能会有所调整。",
        },
        {
          title: "责任",
          body:
            "Nomadabe Travel 致力于以专业水准组织旅行，但对于因用户提供的信息有误、第三方延误或不可抗力所造成的风险，不承担全部责任。",
        },
      ],
    },
    privacy: {
      eyebrow: "Nomadabe Travel",
      title: "隐私政策",
      subtitle:
        "本政策说明我们如何使用和保护您在提交行程咨询、联系我们或使用服务时提供的信息。",
      updated: "最后更新：2026.06.24",
      sections: [
        {
          title: "我们收集的信息",
          body:
            "我们可能会收集您的姓名、电子邮箱、电话号码、目的地、出行日期、人数、预算以及规划旅行所需的其他信息。",
        },
        {
          title: "信息的使用",
          body:
            "我们使用您的信息来制定行程方案、就服务事宜与您联系、安排预订并提供客户支持。",
        },
        {
          title: "信息的保护",
          body:
            "我们采取合理措施，防止客户信息遭到未经授权的访问、丢失或滥用。必要时，我们仅会与参与您行程的合作伙伴共享所需的信息。",
        },
        {
          title: "联系我们",
          body:
            "如对您的个人信息有任何疑问，或需要更正、删除，请发送邮件至 info@nomadabe.mn。",
        },
      ],
    },
  },
  ja: {
    terms: {
      eyebrow: "Nomadabe Travel",
      title: "利用規約",
      subtitle:
        "本規約は、Nomadabe Travel のウェブサイト、旅行のお問い合わせ、コンサルティングおよび旅行計画サービスをご利用いただく際の基本的な条件を定めるものです。",
      updated: "最終更新日：2026.06.24",
      sections: [
        {
          title: "サービスのご利用",
          body:
            "旅行のお問い合わせフォーム、お問い合わせフォームおよびウェブサイトの各機能をご利用の際は、正確な情報をご提供ください。最終的な旅程、料金、条件は、確定したご提案または契約に基づいて有効となります。",
        },
        {
          title: "ご予約と確定",
          body:
            "ルート、日程、人数、サービス内容、お支払い条件について双方で合意した時点で、ご予約が確定します。航空便、ホテル、第三者サービスの変更は、各サービス提供者の規定に従います。",
        },
        {
          title: "旅行情報",
          body:
            "ウェブサイトに掲載されている旅行の説明、写真、ルートはご案内を目的としたものです。天候、道路状況、ビザ、国境、交通その他の事情により、旅程が変更される場合があります。",
        },
        {
          title: "責任",
          body:
            "Nomadabe Travel は旅行をプロの水準で手配するよう努めておりますが、お客様による誤った情報、第三者による遅延、不可抗力に起因するリスクについては、そのすべてを負うものではありません。",
        },
      ],
    },
    privacy: {
      eyebrow: "Nomadabe Travel",
      title: "プライバシーポリシー",
      subtitle:
        "本ポリシーは、旅行のお問い合わせ、ご連絡、サービスのご利用の際にお客様からご提供いただいた情報を、当社がどのように利用し保護するかを説明するものです。",
      updated: "最終更新日：2026.06.24",
      sections: [
        {
          title: "収集する情報",
          body:
            "当社は、お名前、メールアドレス、電話番号、行き先、旅行日程、人数、ご予算、その他旅行の計画に必要な情報を収集することがあります。",
        },
        {
          title: "情報の利用",
          body:
            "お客様の情報は、旅行プランのご提案、サービスに関するご連絡、ご予約の手配、カスタマーサポートの提供のために利用します。",
        },
        {
          title: "情報の保護",
          body:
            "当社は、お客様の情報を不正アクセス、紛失、不正利用から保護するため、適切な措置を講じます。必要な場合に限り、ご旅行の手配に関わる提携先と必要最小限の情報を共有することがあります。",
        },
        {
          title: "お問い合わせ",
          body:
            "ご自身の情報に関するご質問、訂正・削除のご依頼は、info@nomadabe.mn までお送りください。",
        },
      ],
    },
  },
  ko: {
    terms: {
      eyebrow: "Nomadabe Travel",
      title: "이용약관",
      subtitle:
        "본 약관은 Nomadabe Travel 웹사이트, 여행 문의, 상담 및 여행 기획 서비스를 이용할 때 적용되는 기본 조건을 설명합니다.",
      updated: "최종 업데이트: 2026.06.24",
      sections: [
        {
          title: "서비스 이용",
          body:
            "여행 문의 양식, 연락 양식 및 웹사이트 기능을 이용할 때에는 정확한 정보를 제공해야 합니다. 최종 일정, 가격 및 조건은 확정된 제안서 또는 계약에 따라 효력이 발생합니다.",
        },
        {
          title: "예약 및 확정",
          body:
            "여행 경로, 일정, 인원, 서비스 범위 및 결제 조건에 대해 상호 합의한 후 예약이 확정됩니다. 항공편, 숙소 및 제3자 서비스의 변경은 해당 서비스 제공업체의 약관을 따릅니다.",
        },
        {
          title: "여행 정보",
          body:
            "웹사이트의 여행 설명, 사진 및 경로는 안내를 위한 것입니다. 날씨, 도로, 비자, 국경, 교통 및 기타 사정에 따라 여행 일정이 변경될 수 있습니다.",
        },
        {
          title: "책임",
          body:
            "Nomadabe Travel은 여행을 전문적으로 운영하기 위해 노력하지만, 이용자의 부정확한 정보, 제3자의 지연 또는 불가항력으로 인해 발생한 위험에 대해서는 모든 책임을 지지 않습니다.",
        },
      ],
    },
    privacy: {
      eyebrow: "Nomadabe Travel",
      title: "개인정보 처리방침",
      subtitle:
        "본 방침은 여행 문의, 연락 또는 서비스 이용 시 제공하신 정보를 당사가 어떻게 이용하고 보호하는지 설명합니다.",
      updated: "최종 업데이트: 2026.06.24",
      sections: [
        {
          title: "수집하는 정보",
          body:
            "당사는 이름, 이메일, 전화번호, 여행지, 여행 날짜, 인원, 예산 및 여행 기획에 필요한 기타 정보를 수집할 수 있습니다.",
        },
        {
          title: "정보의 이용",
          body:
            "고객님의 정보는 여행 제안서 작성, 서비스 관련 연락, 예약 진행 및 고객 지원을 위해 이용됩니다.",
        },
        {
          title: "정보의 보호",
          body:
            "당사는 고객 정보를 무단 접근, 분실 및 오용으로부터 보호하기 위해 합리적인 조치를 취합니다. 필요한 경우 여행 운영에 참여하는 협력사와 꼭 필요한 정보만 공유할 수 있습니다.",
        },
        {
          title: "문의",
          body:
            "개인정보와 관련된 문의, 정정 또는 삭제 요청은 info@nomadabe.mn으로 보내 주세요.",
        },
      ],
    },
  },
};

const LEGAL_UI: Record<
  CopyLocale,
  { contents: string; questions: string; other: Record<LegalPageKind, string> }
> = {
  mn: {
    contents: "Агуулга",
    questions: "Асуулт байвал бидэнд бичээрэй",
    other: { terms: "Нууцлалын бодлого", privacy: "Үйлчилгээний нөхцөл" },
  },
  en: {
    contents: "Contents",
    questions: "Questions? Write to us",
    other: { terms: "Privacy policy", privacy: "Terms of service" },
  },
  zh: {
    contents: "目录",
    questions: "如有疑问，请联系我们",
    other: { terms: "隐私政策", privacy: "服务条款" },
  },
  ja: {
    contents: "目次",
    questions: "ご不明な点はお問い合わせください",
    other: { terms: "プライバシーポリシー", privacy: "利用規約" },
  },
  ko: {
    contents: "목차",
    questions: "궁금한 점은 문의해 주세요",
    other: { terms: "개인정보 처리방침", privacy: "이용약관" },
  },
};

// next/image resizes from this master; 2400px is plenty for a darkened
// full-bleed background.
const LEGAL_BACKGROUND_IMAGES: Record<LegalPageKind, string> = {
  terms:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=80",
  privacy:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80",
};

const CONTACT_EMAIL = "info@nomadabe.mn";

export function LegalPage({ kind }: { kind: LegalPageKind }) {
  const { contentLocale } = useLanguage();
  const copy = LEGAL_COPY[contentLocale]?.[kind] ?? LEGAL_COPY.mn[kind];
  const ui = LEGAL_UI[contentLocale] ?? LEGAL_UI.mn;
  const otherHref = kind === "terms" ? "/privacy" : "/terms";

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-ink pb-16 pt-28 text-white lg:pb-24 lg:pt-32">
      <Image
        src={LEGAL_BACKGROUND_IMAGES[kind]}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.7)_54%,rgba(0,0,0,0.45)_100%)]"
      />

      <Container>
        <article className="mx-auto max-w-4xl border border-white/16 bg-black/40 p-6 shadow-floating backdrop-blur-md sm:p-8 lg:p-12">
          <p className="nav-text inline-flex items-center gap-2.5 text-xs uppercase text-accent">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            {copy.eyebrow}
          </p>
          <h1 className="mt-5 break-words text-[clamp(1.9rem,4vw,3.25rem)] text-white">
            {copy.title}
          </h1>
          <p className="mt-6 text-base text-white/80 sm:text-lg">{copy.subtitle}</p>
          <p className="mt-3 text-sm text-white/60">{copy.updated}</p>

          <nav
            aria-label={ui.contents}
            className="mt-8 border-y border-white/12 py-5"
          >
            <p className="nav-text text-xs uppercase text-white/60">{ui.contents}</p>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {copy.sections.map((section, index) => (
                <li key={section.title}>
                  <a
                    href={`#legal-${index + 1}`}
                    className="text-sm text-white/85 underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-10">
            {copy.sections.map((section, index) => (
              <section
                key={section.title}
                id={`legal-${index + 1}`}
                aria-labelledby={`legal-${index + 1}-title`}
                className="scroll-mt-28"
              >
                <h2
                  id={`legal-${index + 1}-title`}
                  className="flex gap-3 text-lg text-white sm:text-xl"
                >
                  <span aria-hidden="true" className="text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 break-words">{section.title}</span>
                </h2>
                <p className="mt-3 text-base text-white/78 sm:text-lg">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-accent"
            >
              <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
              <span>
                {ui.questions}: <span className="break-all">{CONTACT_EMAIL}</span>
              </span>
            </a>
            <Link
              href={otherHref}
              className="nav-text inline-flex items-center gap-2 text-xs uppercase text-accent transition-colors hover:text-white"
            >
              {ui.other[kind]}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </Container>
    </section>
  );
}
