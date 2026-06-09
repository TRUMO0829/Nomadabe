export type Locale = "mn" | "en";

export const DEFAULT_LOCALE: Locale = "mn";

export const LANGUAGES: ReadonlyArray<{
  code: Locale;
  short: string;
  label: string;
}> = [
  { code: "mn", short: "MN", label: "Монгол" },
  { code: "en", short: "EN", label: "English" },
];

export const UI_COPY = {
  mn: {
    nav: {
      items: [
        { label: "Аяллууд", href: "/tours" },
        { label: "Чиглэлүүд", href: "/#destinations" },
        { label: "Сэтгэгдэл", href: "/#journal" },
        { label: "Бидний тухай", href: "/#about" },
      ],
      cta: "Аялал төлөвлөх",
      language: "Хэл сонгох",
      openMenu: "Цэс нээх",
      closeMenu: "Цэс хаах",
    },
    hero: {
      rating: "5 одтой үнэлгээтэй, 1,200+ аялагч",
      established: "2025 оноос - Улаанбаатар",
      headingLine1: "Аяллаа",
      headingEmphasis: "нүүдэлчин",
      headingLine2: "хэмнэлээр.",
      body:
        "Монгол болон дэлхийн чиглэлүүдэд жижиг групп, бизнес, expo, амралтын аяллыг орон нутгийн мэдлэгтэй баг эхнээс нь дуустал зохион байгуулна.",
      quick: [
        "Canton Fair",
        "Нарны эрчим хүч",
        "Хүнсний expo",
        "Захиалгат аялал",
        "Гэр бүлийн амралт",
      ],
      scroll: "Доош",
    },
    featured: {
      eyebrow: "Онцлох аяллууд",
      title: "Бизнес, expo, амралт зугаалгын аяллаа эндээс эхлүүл.",
      all: "Бүх аяллыг харах",
      days: "өдөр",
      price: "Үнэ",
      quote: "Санал авах",
      details: "Дэлгэрэнгүй",
      noResults: "Сонгосон нөхцөлд тохирох аялал олдсонгүй.",
    },
    styles: {
      eyebrow: "Аяллын төрлөө сонго",
      titleStart: "Танд тохирох",
      titleEmphasis: "аяллын хэв маяг",
      titleEnd: "сонго.",
      body:
        "Бизнес уулзалт, олон улсын expo, гэр бүлийн амралт, өөрийн хэмнэлтэй аялал гээд зорилгод тань тааруулна.",
      countLabel: "аялал",
      cards: [
        "Бизнес аялал",
        "Expo аялал",
        "Амралт зугаалга",
        "Захиалгат аялал",
        "Соёлын аялал",
        "Байгальд ойр аялал",
      ],
    },
    why: {
      eyebrow: "Яагаад Nomadabe",
      titleStart: "Бид аяллыг",
      titleEmphasis: "бодитоор",
      titleEnd: "зохион байгуулдаг.",
      body:
        "Зурагтай маршрут төдий биш. Буудал, тээвэр, орчуулга, уулзалт, даатгал хүртэл нэг дор төлөвлөсөн аяллын дэмжлэг.",
      link: "Бидний түүхийг унших",
      reasons: [
        {
          title: "Орон нутгийн мэдлэгтэй баг",
          body:
            "Чиглэл бүр дээр тухайн газраа мэддэг хөтөч, орчуулагч, аяллын түншүүдтэй хамтран ажиллана.",
        },
        {
          title: "Бизнес ба аяллын хос дэмжлэг",
          body:
            "Expo бүртгэл, уулзалт, бүтээгдэхүүн судалгаа, карго, төлбөр тооцооны эхний чиглүүлгийг нэг баг хариуцна.",
        },
        {
          title: "Уян хатан төлөвлөлт",
          body:
            "Хугацаа, төсөв, багийн хэмжээ, аяллын зорилгод тань тохируулж маршрутаа нарийвчилна.",
        },
        {
          title: "Ил тод зөвлөгөө",
          body:
            "Юу багтсан, юу нэмэгдэх, хаана эрсдэлтэйг аялал эхлэхээс өмнө тодорхой хэлж өгнө.",
        },
      ],
      stats: [
        { value: "1,200+", label: "Сэтгэл хангалуун аялагч" },
        { value: "84", label: "Төлөвлөсөн аялал" },
        { value: "4.9★", label: "Дундаж үнэлгээ" },
        { value: "27", label: "Хөтөч, түнш" },
      ],
    },
    testimonials: {
      eyebrow: "Аялагчдын сэтгэгдэл",
      titleStart: "Манай аялагчид",
      titleEmphasis: "аяллын дараа",
      titleEnd: "ингэж хэлдэг.",
      rating: "4.9 / 5 - 412 баталгаажсан үнэлгээ",
      quotes: [
        {
          name: "Номин Б.",
          trip: "Canton Fair - 7 өдөр",
          body:
            "Бид анх удаа expo-д оролцсон ч бүртгэл, буудал, орчуулга бүгд ойлгомжтой байсан. Үйлдвэрлэгчтэй уулзахад хамгийн их тус болсон.",
        },
        {
          name: "Тэмүүлэн А.",
          trip: "Захиалгат бизнес аялал - 4 өдөр",
          body:
            "Зүгээр аяллын багц биш, яг манай бизнесийн зорилгод таарсан уулзалт, маршрут гаргаж өгсөн нь үнэ цэнтэй байлаа.",
        },
        {
          name: "Саруул Э.",
          trip: "Амралт зугаалга - 6 өдөр",
          body:
            "Гэр бүлээрээ санаа зовох зүйлгүй аялсан. Буудал, тээвэр, өдөр тутмын хөтөлбөр бүгд цэгцтэй, хүүхдүүдэд ч тохиромжтой байсан.",
        },
      ],
    },
    cta: {
      headingLine1: "Аяллын санаа толгойд байна уу?",
      headingLine2: "Бидэнтэй хуваалцаарай.",
      body:
        "Бизнес уулзалт, expo эсвэл амралт гээд зорилгоо бичээрэй. Манай баг 24 цагийн дотор чиглэл, хугацаа, төсвийн анхны санал илгээнэ.",
      placeholder: "email@example.com",
      loading: "Илгээж байна...",
      button: "Төлөвлөлт эхлүүлэх",
      success: "Баярлалаа. Бид таны хүсэлтийг хүлээн аваад эргэн холбогдоно.",
      error: "Одоогоор илгээж чадсангүй. Дахин оролдоно уу.",
      idle: "Спам байхгүй. Зөвхөн аяллын бодит санал илгээнэ.",
    },
    footer: {
      description:
        "Монгол болон дэлхийн чиглэлүүдэд бизнес, expo, амралт зугаалгын аяллыг Улаанбаатараас төлөвлөн зохион байгуулна.",
      columns: [
        {
          title: "Аяллууд",
          links: ["Монгол", "Азийн чиглэл", "Олон улсын expo", "Захиалгат аялал", "Групп аялал"],
        },
        {
          title: "Компани",
          links: ["Бидний тухай", "Хөтөчид", "Тогтвортой аялал", "Мэдээ", "Ажлын байр"],
        },
        {
          title: "Тусламж",
          links: ["Асуулт хариулт", "Захиалгын нөхцөл", "Даатгал", "Холбоо барих", "Нэвтрэх"],
        },
      ],
      copyright: "Nomadabe LLC - Улаанбаатар, Монгол",
      legal: ["Нууцлал", "Нөхцөл", "Cookies"],
    },
    modal: {
      close: "Хаах",
      reviews: "үнэлгээ",
      about: "Аяллын тухай",
      duration: "Хугацаа",
      group: "Групп",
      departure: "Явах",
      flexible: "Тохиролцоно",
      ideal: "Хэнд тохиромжтой вэ?",
      includes: "Багцад багтаж болох зүйлс",
      business: "Бизнес дэмжлэг",
      price: "Үнэ",
      quote: "Санал",
      quoteDetails: "дэлгэрэнгүй авах",
      register: "Бүртгүүлэх",
      ask: "Асуух",
      note: "Nomadabe Travel баг тантай холбогдож дэлгэрэнгүй мэдээлэл өгнө.",
    },
  },
  en: {
    nav: {
      items: [
        { label: "Adventures", href: "/tours" },
        { label: "Destinations", href: "/#destinations" },
        { label: "Reviews", href: "/#journal" },
        { label: "About", href: "/#about" },
      ],
      cta: "Plan your trip",
      language: "Choose language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      rating: "5-star rated by 1,200+ travellers",
      established: "Est. 2025 - Ulaanbaatar",
      headingLine1: "Travel the",
      headingEmphasis: "nomad",
      headingLine2: "way.",
      body:
        "Small-group, business, expo, and leisure trips across Mongolia and beyond, planned end to end by a local team.",
      quick: ["Canton Fair", "Solar energy", "Food expo", "Custom trip", "Family holiday"],
      scroll: "Scroll",
    },
    featured: {
      eyebrow: "Featured trips",
      title: "Start with business travel, expo trips, and tailored holidays.",
      all: "View all trips",
      days: "days",
      price: "Price",
      quote: "Request quote",
      details: "Details",
      noResults: "No trips match the selected filters.",
    },
    styles: {
      eyebrow: "Choose your travel style",
      titleStart: "Pick the",
      titleEmphasis: "travel style",
      titleEnd: "that fits.",
      body:
        "From business meetings and global expos to family holidays and flexible custom routes, we shape the trip around your goal.",
      countLabel: "trips",
      cards: [
        "Business travel",
        "Expo travel",
        "Leisure holidays",
        "Custom routes",
        "Culture trips",
        "Nature escapes",
      ],
    },
    why: {
      eyebrow: "Why Nomadabe",
      titleStart: "We make travel",
      titleEmphasis: "practical",
      titleEnd: "from the first call.",
      body:
        "Not just a pretty itinerary. Hotels, transport, translation, meetings, insurance, and trip support are planned in one place.",
      link: "Read our story",
      reasons: [
        {
          title: "Local knowledge on every route",
          body:
            "We work with guides, translators, and travel partners who know the destination beyond the brochure.",
        },
        {
          title: "Business plus travel support",
          body:
            "Expo registration, meetings, sourcing, cargo, and payment guidance can be coordinated by one team.",
        },
        {
          title: "Flexible planning",
          body:
            "Routes are shaped around your dates, budget, group size, and the reason you are travelling.",
        },
        {
          title: "Clear advice",
          body:
            "We explain what is included, what may cost extra, and where the practical risks are before the trip starts.",
        },
      ],
      stats: [
        { value: "1,200+", label: "Happy travellers" },
        { value: "84", label: "Planned trips" },
        { value: "4.9★", label: "Average rating" },
        { value: "27", label: "Guides and partners" },
      ],
    },
    testimonials: {
      eyebrow: "Traveller reviews",
      titleStart: "What travellers",
      titleEmphasis: "say after",
      titleEnd: "the trip.",
      rating: "4.9 / 5 - 412 verified reviews",
      quotes: [
        {
          name: "Nomin B.",
          trip: "Canton Fair - 7 days",
          body:
            "It was our first expo trip, but registration, hotel, and translation were all clear. The supplier meetings were the most useful part.",
        },
        {
          name: "Temuulen A.",
          trip: "Custom business trip - 4 days",
          body:
            "This was not just a tour package. They built meetings and a route around our business goal, which made the trip worth it.",
        },
        {
          name: "Saruul E.",
          trip: "Leisure holiday - 6 days",
          body:
            "Our family travelled without worrying about the details. Hotels, transport, and the daily plan were organized and kid-friendly.",
        },
      ],
    },
    cta: {
      headingLine1: "Have a trip idea in mind?",
      headingLine2: "Tell us about it.",
      body:
        "Share your business, expo, or holiday goal. Our team will reply within 24 hours with route ideas, timing, and an initial budget range.",
      placeholder: "you@example.com",
      loading: "Sending...",
      button: "Start planning",
      success: "Thanks. We saved your request and will get back to you.",
      error: "Could not send right now. Please try again.",
      idle: "No spam. Just practical trip ideas.",
    },
    footer: {
      description:
        "Business, expo, and leisure travel from Mongolia to the rest of the world, planned from Ulaanbaatar.",
      columns: [
        {
          title: "Trips",
          links: ["Mongolia", "Asia", "Global expos", "Custom travel", "Group bookings"],
        },
        {
          title: "Company",
          links: ["About", "Guides", "Sustainability", "News", "Careers"],
        },
        {
          title: "Help",
          links: ["FAQ", "Booking terms", "Insurance", "Contact", "Login"],
        },
      ],
      copyright: "Nomadabe LLC - Ulaanbaatar, Mongolia",
      legal: ["Privacy", "Terms", "Cookies"],
    },
    modal: {
      close: "Close",
      reviews: "reviews",
      about: "About this trip",
      duration: "Duration",
      group: "Group",
      departure: "Departure",
      flexible: "Flexible",
      ideal: "Best for",
      includes: "What can be included",
      business: "Business support",
      price: "Price",
      quote: "Quote",
      quoteDetails: "request details",
      register: "Register",
      ask: "Ask a question",
      note: "The Nomadabe Travel team will contact you with detailed information.",
    },
  },
} as const;
