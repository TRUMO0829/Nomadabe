import type { CopyLocale } from "./i18n";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  imageAlt?: string;
  bio?: string;
  order?: number;
  isVisible?: boolean;
};

export type AboutSectionId = "who" | "values" | "team" | "work";

export type OrderedVisibility = {
  order?: number;
  isVisible?: boolean;
};

export type AboutNavigationItem = OrderedVisibility & {
  id: AboutSectionId;
  label: string;
};

export type AboutStat = OrderedVisibility & {
  value: string;
  label: string;
};

export type AboutTextItem = OrderedVisibility & {
  title: string;
  body: string;
};

export type AboutGalleryImage = OrderedVisibility & {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

export type AboutCta = {
  label: string;
  href: string;
  isVisible?: boolean;
};

export type AboutFaqItem = OrderedVisibility & {
  question: string;
  answer: string;
};

export type AboutLocaleContent = {
  eyebrow: string;
  title: string;
  body: string;
  navigation: AboutNavigationItem[];
  who: OrderedVisibility & {
    label: string;
    text: string;
    stats: AboutStat[];
  };
  values: OrderedVisibility & {
    label: string;
    items: AboutTextItem[];
  };
  team: OrderedVisibility & {
    label: string;
  };
  work: OrderedVisibility & {
    label: string;
    title: string;
    body: string;
    items: AboutTextItem[];
  };
  gallery: AboutGalleryImage[];
  cta: AboutCta;
  faq: OrderedVisibility & {
    eyebrow: string;
    title: string;
    subtitle?: string;
    items: AboutFaqItem[];
  };
};

export type AboutSectionSettings = Record<CopyLocale, AboutLocaleContent>;

export type SiteSettings = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  accentColor: string;
  heroTextColor: string;
  heroOverlayOpacity: number;
  teamMembers: TeamMember[];
  aboutSection: AboutSectionSettings;
};

export const DEFAULT_ABOUT_SECTION: AboutSectionSettings = {
  mn: {
    eyebrow: "NOMADABE — TRAVEL ELEVATED",
    title: "Дараагийн түвшинд аял.",
    body:
      "Nomadabe Travel нь бизнес аялал, олон улсын үзэсгэлэн (expo), хөтөлбөртэй амралт зугаалга болон чөлөөт аяллыг мэргэжлийн түвшинд зохион байгуулдаг аяллын компани. Улаанбаатар хотод төвтэй, 10,000 гаруй аялагчийн аяллыг амжилттай зохион байгуулсан туршлагатай.",
    navigation: [
      { id: "who", label: "Бид хэн бэ", order: 1, isVisible: true },
      { id: "values", label: "Бидний үнэт зүйлс", order: 2, isVisible: true },
      { id: "team", label: "Манай баг", order: 3, isVisible: true },
      { id: "work", label: "Бид юу хийдэг вэ", order: 4, isVisible: true },
    ],
    who: {
      label: "Бид хэн бэ",
      text:
        "Nomadabe Travel нь зөвхөн аялал зохион байгуулахаас гадна бизнес зорилготой аялагчдад зориулсан зөвлөгөө, логистик, худалдан авалт, бүтээгдэхүүн судалгаа, олон улсын үзэсгэлэнгийн дэмжлэгийг нэг дор үзүүлдэг. Жил бүр 2,000 гаруй аялагчийг хүлээн авч, бизнес болон амралтын аяллыг бодит зохион байгуулалттай холбодог.",
      order: 1,
      isVisible: true,
      stats: [
        { value: "7+", label: "Жилийн туршлага", order: 1, isVisible: true },
        { value: "10К+", label: "Үйлчлүүлэгчид", order: 2, isVisible: true },
        { value: "2К+", label: "Жил бүрийн аялагч", order: 3, isVisible: true },
      ],
    },
    values: {
      label: "Бидний үнэт зүйлс",
      order: 2,
      isVisible: true,
      items: [
        {
          title: "Зөвхөн аялал биш — бизнесийн шийдэл",
          body: "Аяллын явцад бараа бүтээгдэхүүн судлах, үйлдвэрлэгч, нийлүүлэгчтэй холбогдох, импорт, борлуулалт, санхүүжилт, логистикийн бодит зөвлөгөө авах боломжийг олгоно.",
          order: 1,
          isVisible: true,
        },
        {
          title: "All-in-one зохион байгуулалт",
          body: "Нислэг, буудал, eSIM/дата SIM, даатгал, орчуулагч, хөтөч, бизнес зөвлөгөө, тээвэр логистикийг нэг багцад багтаасан тул аялагч зөвхөн цүнхээ үүрээд гарахад хангалттай.",
          order: 2,
          isVisible: true,
        },
        {
          title: "Олон улсын үзэсгэлэн, түншлэл",
          body: "Canton Fair, SNEC PV+, SIAL Shanghai зэрэг дэлхийн томоохон үзэсгэлэнд оролцож, шинэ бүтээгдэхүүн, нийлүүлэгч, түншлэлийн боломжийг нээнэ.",
          order: 3,
          isVisible: true,
        },
        {
          title: "Итгэлтэй, мэргэжлийн баг",
          body: "Аялал, бизнес зөвлөгөө, худалдан авалт, логистик, орчуулга, хөтөчийн дэмжлэгийг сэтгэлтэй, найдвартай баг нэг дор хариуцна.",
          order: 4,
          isVisible: true,
        },
      ],
    },
    team: { label: "Манай баг", order: 3, isVisible: true },
    work: {
      label: "Бид юу хийдэг вэ",
      title: "Бизнес, expo, амралт, чөлөөт аяллыг нэг дор.",
      body:
        "Бид бизнес аялал, олон улсын үзэсгэлэн (expo), хөтөлбөртэй амралт зугаалга болон чөлөөт аяллыг төлөвлөж, зөвлөгөө, орчуулга, хөтөч, логистикийн дэмжлэгтэйгээр бодитоор гүйцэтгэдэг.",
      order: 4,
      isVisible: true,
      items: [
        {
          title: "Бизнес аялал",
          body: "Импорт эхлүүлэх, бизнесээ өргөжүүлэх, шинэ бараа бүтээгдэхүүн, үйлдвэрлэгч, нийлүүлэгч судлах зорилготой аялал — бизнес зөвлөгөө, know-how-той хамт.",
          order: 1,
          isVisible: true,
        },
        {
          title: "Олон улсын үзэсгэлэн / Expo аялал",
          body: "Canton Fair, SNEC PV+ 2026, SIAL Shanghai зэрэг олон улсын үзэсгэлэн, худалдааны event-д оролцох аяллын багц.",
          order: 2,
          isVisible: true,
        },
        {
          title: "Хөтөлбөртэй амралт зугаалга",
          body: "Урьдчилан төлөвлөсөн, ойлгомжтой маршрут, зохион байгуулалттай амралт, аялал, туршлага хосолсон аялал.",
          order: 3,
          isVisible: true,
        },
        {
          title: "Чөлөөт аялал",
          body: "Аялагчийн зорилго, хугацаа, сонирхолд тааруулсан уян хатан маршрут — шинэ улс, шинэ дурсамж, шинэ адал явдал.",
          order: 4,
          isVisible: true,
        },
      ],
    },
    gallery: [
      {
        id: "about-route-planning",
        src: "https://images.unsplash.com/photo-1547531455-ccff21cdf2c4?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 1,
        isVisible: true,
      },
      {
        id: "about-mongolia-landscape",
        src: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 2,
        isVisible: true,
      },
    ],
    cta: { label: "", href: "", isVisible: false },
    faq: {
      eyebrow: "FAQ",
      title: "Түгээмэл асуултууд",
      subtitle: "Таны сонирхсон асуултын хариулт энд байх магадгүй",
      order: 5,
      isVisible: true,
      items: [
        {
          question: "Nomadabe Travel ямар үйлчилгээ үзүүлдэг вэ?",
          answer:
            "Бизнес аялал, олон улсын үзэсгэлэн / expo аялал, хөтөлбөртэй амралт зугаалга болон чөлөөт аяллын үйлчилгээ үзүүлдэг.",
          order: 1,
          isVisible: true,
        },
        {
          question: "Бизнес аялал гэж юу вэ?",
          answer:
            "Зөвхөн аялах биш, харин бизнесээ өргөжүүлэх, шинэ бүтээгдэхүүн судлах, үйлдвэрлэгч/нийлүүлэгчтэй холбогдох, импорт болон борлуулалтын боломж судлах зорилготой аялал юм.",
          order: 2,
          isVisible: true,
        },
        {
          question: "Аяллын багцад юу багтаж болох вэ?",
          answer:
            "Нислэгийн тийз, зочид буудал, дата SIM/eSIM, аяллын даатгал, мэргэжлийн орчуулагч, хөтөч, бизнес зөвлөгөө, тээвэр логистикийн зөвлөгөө багтах боломжтой.",
          order: 3,
          isVisible: true,
        },
        {
          question: "Canton Fair аялал хэнд тохиромжтой вэ?",
          answer:
            "Импортын бизнес эхлүүлэх, бизнесээ өргөжүүлэх, шинэ бараа бүтээгдэхүүн, тоног төхөөрөмж, брэнд, үйлдвэрлэгч хайж буй бизнес эрхлэгчдэд тохиромжтой.",
          order: 4,
          isVisible: true,
        },
        {
          question: "Үнэ хэд вэ, суудал байгаа эсэхийг яаж мэдэх вэ?",
          answer:
            "Үнэ нь аяллын төрөл, хугацаа, багц, суудал, үйлчилгээний бүрэлдэхүүнээс хамаарч өөрчлөгддөг. Хамгийн зөв мэдээллийг авах бол хүсэлт илгээх эсвэл манай баг руу шууд холбогдоно уу.",
          order: 5,
          isVisible: true,
        },
      ],
    },
  },
  en: {
    eyebrow: "ABOUT US",
    title: "Connecting Mongolia with the world",
    body:
      "Nomadabe Travel is a professional travel company based in Ulaanbaatar, specializing in business travel, inbound tours, and outbound tours. We have successfully organized trips for over 10,000 travelers within Mongolia and to international destinations.",
    navigation: [
      { id: "who", label: "Who We Are", order: 1, isVisible: true },
      { id: "values", label: "Our Values", order: 2, isVisible: true },
      { id: "team", label: "Our Team", order: 3, isVisible: true },
      { id: "work", label: "What We Do", order: 4, isVisible: true },
    ],
    who: {
      label: "Who We Are",
      text:
        "Since 2019, we have served over 2,000 travelers annually, bridging the gap between business and leisure by connecting entrepreneurs to major international events and opportunities for sustainable growth.",
      order: 1,
      isVisible: true,
      stats: [
        { value: "7+", label: "Years of experience", order: 1, isVisible: true },
        { value: "10k+", label: "Clients", order: 2, isVisible: true },
        { value: "2k+", label: "Annual travelers", order: 3, isVisible: true },
      ],
    },
    values: {
      label: "Our Values",
      order: 2,
      isVisible: true,
      items: [
        {
          title: "Showcase Mongolia",
          body: "We turn Mongolia's natural beauty and nomadic heritage into memorable travel experiences.",
          order: 1,
          isVisible: true,
        },
        {
          title: "Connect to the world",
          body: "We link travelers and businesses with international routes, exhibitions, and industry events.",
          order: 2,
          isVisible: true,
        },
        {
          title: "Trusted coordination",
          body: "Business and leisure trips are organized with hotels, transport, programs, and meetings aligned.",
          order: 3,
          isVisible: true,
        },
        {
          title: "Long-term opportunity",
          body: "Travel becomes a path to new partnerships, markets, and sustainable growth.",
          order: 4,
          isVisible: true,
        },
      ],
    },
    team: { label: "Our Team", order: 3, isVisible: true },
    work: {
      label: "What We Do",
      title: "Business, leisure, and custom trips, organized end to end.",
      body:
        "We arrange business travel, leisure travel, customized routes, international expo trips, and major industry event travel across Asia and beyond.",
      order: 4,
      isVisible: true,
      items: [
        {
          title: "Business Tours",
          body: "International exhibitions, meetings, industry events, and market research trips.",
          order: 1,
          isVisible: true,
        },
        {
          title: "Leisure Tours",
          body: "Domestic and international holidays shaped around nature, cities, culture, and rest.",
          order: 2,
          isVisible: true,
        },
        {
          title: "Customized Tours",
          body: "Routes tailored for families, friends, companies, and special travel goals.",
          order: 3,
          isVisible: true,
        },
        {
          title: "Inbound + Outbound",
          body: "One team for trips into Mongolia and from Mongolia to the world.",
          order: 4,
          isVisible: true,
        },
      ],
    },
    gallery: [
      {
        id: "about-route-planning",
        src: "https://images.unsplash.com/photo-1547531455-ccff21cdf2c4?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 1,
        isVisible: true,
      },
      {
        id: "about-mongolia-landscape",
        src: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 2,
        isVisible: true,
      },
    ],
    cta: { label: "", href: "", isVisible: false },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "The answer to your question may already be here.",
      order: 5,
      isVisible: true,
      items: [
        {
          question: "What happens after I send a trip request?",
          answer:
            "Our team reviews your destination, timing, group size, budget, and needs, then follows up with the next step.",
          order: 1,
          isVisible: true,
        },
        {
          question: "Do you plan both domestic and outbound trips?",
          answer:
            "Yes. We plan Mongolia trips, outbound routes, business travel, expo trips, and custom itineraries.",
          order: 2,
          isVisible: true,
        },
        {
          question: "Can you create a custom trip?",
          answer:
            "Yes. We shape the route, hotels, transport, and schedule around your goal, timing, budget, and travelers.",
          order: 3,
          isVisible: true,
        },
        {
          question: "What details should I prepare before confirming?",
          answer:
            "Preferred dates, destination, traveler count, budget, trip purpose, and any special needs help us plan faster.",
          order: 4,
          isVisible: true,
        },
      ],
    },
  },
  zh: {
    eyebrow: "关于我们",
    title: "一家位于乌兰巴托、连接蒙古与世界的旅行公司。",
    body:
      "Nomadabe Travel 是一家位于蒙古首都乌兰巴托的专业旅行公司，专注于商务旅行、入境游和出境游。我们已为超过 10,000 名旅客成功组织蒙古国内及国际目的地旅行。",
    navigation: [
      { id: "who", label: "我们是谁", order: 1, isVisible: true },
      { id: "values", label: "我们的价值观", order: 2, isVisible: true },
      { id: "team", label: "我们的团队", order: 3, isVisible: true },
      { id: "work", label: "我们的服务", order: 4, isVisible: true },
    ],
    who: {
      label: "我们是谁",
      text: "自 2019 年以来，我们每年服务超过 2,000 名旅客，连接商务与休闲旅行，并帮助企业家接触重要国际活动和可持续增长机会。",
      order: 1,
      isVisible: true,
      stats: [
        { value: "7+", label: "年经验", order: 1, isVisible: true },
        { value: "10k+", label: "客户", order: 2, isVisible: true },
        { value: "2k+", label: "年度旅客", order: 3, isVisible: true },
      ],
    },
    values: {
      label: "我们的价值观",
      order: 2,
      isVisible: true,
      items: [
        { title: "展示蒙古", body: "把蒙古的自然之美和游牧文化转化为难忘的旅行体验。", order: 1, isVisible: true },
        { title: "连接世界", body: "帮助旅客和企业连接国际路线、展会及行业活动。", order: 2, isVisible: true },
        { title: "可信赖的统筹", body: "将酒店、交通、行程和会议协调到商务及休闲旅行中。", order: 3, isVisible: true },
        { title: "长期机会", body: "让旅行成为建立合作、进入市场和持续成长的机会。", order: 4, isVisible: true },
      ],
    },
    team: { label: "我们的团队", order: 3, isVisible: true },
    work: {
      label: "我们的服务",
      title: "商务、休闲与定制旅行，全流程组织。",
      body: "我们组织商务旅行、休闲旅行、定制路线、国际展会旅行以及亚洲及其他地区的重要行业活动旅行。",
      order: 4,
      isVisible: true,
      items: [
        { title: "商务旅行", body: "国际展会、会议、行业活动和市场调研旅行。", order: 1, isVisible: true },
        { title: "休闲旅行", body: "围绕自然、城市、文化和休息设计的国内外度假行程。", order: 2, isVisible: true },
        { title: "定制旅行", body: "为家庭、朋友、企业和特别目标量身定制路线。", order: 3, isVisible: true },
        { title: "入境 + 出境", body: "同一团队负责来蒙古和从蒙古前往世界的旅行。", order: 4, isVisible: true },
      ],
    },
    gallery: [
      {
        id: "about-route-planning",
        src: "https://images.unsplash.com/photo-1547531455-ccff21cdf2c4?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 1,
        isVisible: true,
      },
      {
        id: "about-mongolia-landscape",
        src: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 2,
        isVisible: true,
      },
    ],
    cta: { label: "", href: "", isVisible: false },
    faq: {
      eyebrow: "常见问题",
      title: "常见问题",
      order: 5,
      isVisible: true,
      items: [
        { question: "发送旅行请求后会发生什么？", answer: "我们的团队会查看目的地、时间、人数、预算和需求，然后联系您确认下一步。", order: 1, isVisible: true },
        { question: "你们会规划国内和出境旅行吗？", answer: "会。我们规划蒙古国内旅行、出境路线、商务旅行、展会旅行和定制行程。", order: 2, isVisible: true },
        { question: "可以定制旅行吗？", answer: "可以。我们会根据目标、时间、预算和同行人员安排路线、酒店、交通和日程。", order: 3, isVisible: true },
        { question: "确认前需要准备哪些信息？", answer: "建议提供日期、目的地、人数、预算、旅行目的和特殊需求，这样规划会更快。", order: 4, isVisible: true },
      ],
    },
  },
  ja: {
    eyebrow: "私たちについて",
    title: "ウランバートルからモンゴルと世界をつなぐ旅行会社です。",
    body:
      "Nomadabe Travel はウランバートルを拠点とする旅行会社で、ビジネス旅行、インバウンド、アウトバウンドツアーを専門としています。モンゴル国内外で 10,000 人以上の旅行を手配してきました。",
    navigation: [
      { id: "who", label: "私たち", order: 1, isVisible: true },
      { id: "values", label: "大切にしていること", order: 2, isVisible: true },
      { id: "team", label: "チーム", order: 3, isVisible: true },
      { id: "work", label: "できること", order: 4, isVisible: true },
    ],
    who: {
      label: "私たち",
      text: "2019 年以来、年間 2,000 人以上の旅行者をサポートし、ビジネスとレジャーをつなぎながら、起業家を主要な国際イベントと持続的成長の機会へ結びつけています。",
      order: 1,
      isVisible: true,
      stats: [
        { value: "7+", label: "年の経験", order: 1, isVisible: true },
        { value: "10k+", label: "顧客", order: 2, isVisible: true },
        { value: "2k+", label: "年間旅行者", order: 3, isVisible: true },
      ],
    },
    values: {
      label: "大切にしていること",
      order: 2,
      isVisible: true,
      items: [
        { title: "モンゴルを伝える", body: "自然の美しさと遊牧文化を、記憶に残る旅の体験にします。", order: 1, isVisible: true },
        { title: "世界へつなぐ", body: "旅行者と企業を国際ルート、展示会、業界イベントにつなげます。", order: 2, isVisible: true },
        { title: "信頼できる手配", body: "ホテル、移動、プログラム、商談を一体で調整します。", order: 3, isVisible: true },
        { title: "長期的な機会", body: "旅を新しい提携、市場、持続的な成長につながる機会にします。", order: 4, isVisible: true },
      ],
    },
    team: { label: "チーム", order: 3, isVisible: true },
    work: {
      label: "できること",
      title: "ビジネス、レジャー、カスタム旅行を一貫して手配します。",
      body: "ビジネス旅行、レジャー旅行、カスタムルート、国際展示会、アジア各地の業界イベント旅行を手配します。",
      order: 4,
      isVisible: true,
      items: [
        { title: "Business Tours", body: "国際展示会、商談、業界イベント、市場調査の旅。", order: 1, isVisible: true },
        { title: "Leisure Tours", body: "自然、都市、文化、休暇に合わせた国内外の旅。", order: 2, isVisible: true },
        { title: "Customized Tours", body: "家族、友人、企業、特別な目的に合わせたルート。", order: 3, isVisible: true },
        { title: "Inbound + Outbound", body: "モンゴルへの旅と、モンゴルから世界への旅を一つのチームで。", order: 4, isVisible: true },
      ],
    },
    gallery: [
      {
        id: "about-route-planning",
        src: "https://images.unsplash.com/photo-1547531455-ccff21cdf2c4?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 1,
        isVisible: true,
      },
      {
        id: "about-mongolia-landscape",
        src: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 2,
        isVisible: true,
      },
    ],
    cta: { label: "", href: "", isVisible: false },
    faq: {
      eyebrow: "FAQ",
      title: "よくある質問",
      order: 5,
      isVisible: true,
      items: [
        { question: "旅行リクエストを送った後はどうなりますか？", answer: "目的地、時期、人数、予算、希望内容を確認し、次のステップについてご連絡します。", order: 1, isVisible: true },
        { question: "国内旅行と海外旅行の両方に対応していますか？", answer: "はい。モンゴル国内旅行、海外ルート、ビジネス旅行、展示会旅行、カスタム行程に対応しています。", order: 2, isVisible: true },
        { question: "カスタム旅行は作れますか？", answer: "はい。目的、時期、予算、参加者に合わせてルート、ホテル、移動、日程を組み立てます。", order: 3, isVisible: true },
        { question: "確定前にどんな情報が必要ですか？", answer: "希望日、目的地、人数、予算、旅行目的、特別な希望があると、より早く計画できます。", order: 4, isVisible: true },
      ],
    },
  },
  ko: {
    eyebrow: "회사 소개",
    title: "울란바토르에서 몽골과 세계를 연결하는 여행사입니다.",
    body:
      "Nomadabe Travel은 울란바토르에 기반을 둔 전문 여행사로 비즈니스 여행, 인바운드, 아웃바운드 투어를 전문으로 합니다. 몽골 국내와 해외 목적지에서 10,000명 이상의 여행을 성공적으로 운영했습니다.",
    navigation: [
      { id: "who", label: "우리는 누구인가", order: 1, isVisible: true },
      { id: "values", label: "우리의 가치", order: 2, isVisible: true },
      { id: "team", label: "우리 팀", order: 3, isVisible: true },
      { id: "work", label: "우리가 하는 일", order: 4, isVisible: true },
    ],
    who: {
      label: "우리는 누구인가",
      text: "2019년부터 매년 2,000명 이상의 여행자를 지원하며, 비즈니스와 레저를 연결하고 기업가들이 주요 국제 행사와 지속 가능한 성장 기회를 만날 수 있도록 돕고 있습니다.",
      order: 1,
      isVisible: true,
      stats: [
        { value: "7+", label: "년 경험", order: 1, isVisible: true },
        { value: "10k+", label: "고객", order: 2, isVisible: true },
        { value: "2k+", label: "연간 여행자", order: 3, isVisible: true },
      ],
    },
    values: {
      label: "우리의 가치",
      order: 2,
      isVisible: true,
      items: [
        { title: "몽골을 보여주기", body: "몽골의 자연미와 유목 문화를 기억에 남는 여행 경험으로 만듭니다.", order: 1, isVisible: true },
        { title: "세계와 연결", body: "여행자와 기업을 국제 노선, 전시회, 산업 행사와 연결합니다.", order: 2, isVisible: true },
        { title: "신뢰할 수 있는 운영", body: "호텔, 교통, 일정, 미팅을 비즈니스 및 레저 여행에 맞춰 조율합니다.", order: 3, isVisible: true },
        { title: "장기적 기회", body: "여행을 새로운 파트너십, 시장, 지속 가능한 성장의 기회로 만듭니다.", order: 4, isVisible: true },
      ],
    },
    team: { label: "우리 팀", order: 3, isVisible: true },
    work: {
      label: "우리가 하는 일",
      title: "비즈니스, 레저, 맞춤 여행을 처음부터 끝까지 운영합니다.",
      body: "비즈니스 여행, 레저 여행, 맞춤 루트, 국제 엑스포, 아시아 및 기타 지역의 주요 산업 행사 여행을 운영합니다.",
      order: 4,
      isVisible: true,
      items: [
        { title: "Business Tours", body: "국제 전시회, 미팅, 산업 행사, 시장 조사 여행.", order: 1, isVisible: true },
        { title: "Leisure Tours", body: "자연, 도시, 문화, 휴식을 중심으로 구성한 국내외 여행.", order: 2, isVisible: true },
        { title: "Customized Tours", body: "가족, 친구, 기업, 특별 목적에 맞춘 맞춤 루트.", order: 3, isVisible: true },
        { title: "Inbound + Outbound", body: "몽골로 들어오는 여행과 몽골에서 세계로 나가는 여행을 한 팀이 담당합니다.", order: 4, isVisible: true },
      ],
    },
    gallery: [
      {
        id: "about-route-planning",
        src: "https://images.unsplash.com/photo-1547531455-ccff21cdf2c4?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 1,
        isVisible: true,
      },
      {
        id: "about-mongolia-landscape",
        src: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=2400&q=90&fit=crop&fm=webp",
        alt: "Nomadabe Travel route planning",
        order: 2,
        isVisible: true,
      },
    ],
    cta: { label: "", href: "", isVisible: false },
    faq: {
      eyebrow: "FAQ",
      title: "자주 묻는 질문",
      order: 5,
      isVisible: true,
      items: [
        { question: "여행 요청을 보내면 다음 단계는 무엇인가요?", answer: "목적지, 일정, 인원, 예산, 필요한 내용을 확인한 뒤 다음 단계 안내를 위해 연락드립니다.", order: 1, isVisible: true },
        { question: "국내 여행과 해외 여행을 모두 기획하나요?", answer: "네. 몽골 국내 여행, 해외 루트, 비즈니스 여행, 엑스포 여행, 맞춤 일정을 기획합니다.", order: 2, isVisible: true },
        { question: "맞춤 여행도 만들 수 있나요?", answer: "네. 목적, 일정, 예산, 동행자에 맞춰 루트, 호텔, 교통, 일정을 구성합니다.", order: 3, isVisible: true },
        { question: "확정 전에 어떤 정보를 준비해야 하나요?", answer: "희망 날짜, 목적지, 인원, 예산, 여행 목적, 특별 요청을 알려주시면 더 빠르게 계획할 수 있습니다.", order: 4, isVisible: true },
      ],
    },
  },
};
