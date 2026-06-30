export type Locale = "mn" | "en" | "zh" | "ja" | "ko";
export type Language = Locale;
export type CopyLocale = Locale;

export const DEFAULT_LOCALE: Locale = "mn";

export const LANGUAGES: ReadonlyArray<{
  code: Locale;
  short: string;
  label: string;
}> = [
  { code: "mn", short: "MN", label: "Монгол" },
  { code: "en", short: "EN", label: "English" },
  { code: "zh", short: "CN", label: "中文" },
  { code: "ja", short: "JP", label: "日本語" },
  { code: "ko", short: "KR", label: "한국어" },
];

export const LANGUAGE_LABELS: Record<Language, string> = {
  mn: "MN",
  en: "EN",
  zh: "CN",
  ja: "JP",
  ko: "KR",
};

export function isLocale(value: string | null): value is Locale {
  return LANGUAGES.some((language) => language.code === value);
}

export function getCopyLocale(locale: Locale): CopyLocale {
  return locale;
}

export const UI_COPY = {
  mn: {
    nav: {
      items: [
        { label: "Аяллууд", href: "/tours" },
        { label: "Сэтгэгдэл", href: "/#journal" },
        { label: "Бидний тухай", href: "/about" },
      ],
      cta: "Төлөвлөх",
      language: "Хэл сонгох",
      openMenu: "Цэс нээх",
      closeMenu: "Цэс хаах",
    },
    hero: {
      rating: "5 одтой үнэлгээтэй, 1,200+ аялагч",
      established: "2025 оноос - Улаанбаатар",
      headingLine1: "Дараагийн",
      headingEmphasis: "түвшинд",
      headingLine2: "аял.",
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
      eyebrow: "Яагаад Nomadabe вэ?",
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
          links: ["Захиалгын нөхцөл", "Даатгал", "Холбоо барих", "Нэвтрэх"],
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
        { label: "Reviews", href: "/#journal" },
        { label: "About", href: "/about" },
      ],
      cta: "Request",
      language: "Choose language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      rating: "5-star rated by 1,200+ travellers",
      established: "Est. 2025 - Ulaanbaatar",
      headingLine1: "Travel",
      headingEmphasis: "at the next",
      headingLine2: "level.",
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
          links: ["Booking terms", "Insurance", "Contact", "Login"],
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
  zh: {
    nav: {
      items: [
        { label: "旅游", href: "/tours" },
        { label: "评价", href: "/#journal" },
        { label: "关于我们", href: "/about" },
      ],
      cta: "提交请求",
      language: "选择语言",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
    },
    hero: {
      rating: "5星评价，1,200+ 位旅行者",
      established: "2025年起 - 乌兰巴托",
      headingLine1: "开启",
      headingEmphasis: "下一层级",
      headingLine2: "的旅行。",
      body:
        "我们为蒙古及全球目的地提供小团、商务、展会和休闲旅行，由熟悉当地的团队从开始到结束全程安排。",
      quick: ["广交会", "太阳能", "食品展", "定制旅行", "家庭度假"],
      scroll: "向下",
    },
    featured: {
      eyebrow: "精选旅行",
      title: "从商务旅行、展会行程和定制假期开始。",
      all: "查看全部旅行",
      days: "天",
      price: "价格",
      quote: "获取报价",
      details: "详情",
      noResults: "没有符合当前筛选条件的旅行。",
    },
    styles: {
      eyebrow: "选择旅行类型",
      titleStart: "选择适合您的",
      titleEmphasis: "旅行方式",
      titleEnd: "。",
      body:
        "无论是商务会议、国际展会、家庭度假还是自由定制路线，我们都会按照您的目标来设计行程。",
      countLabel: "个行程",
      cards: [
        "商务旅行",
        "展会旅行",
        "休闲度假",
        "定制路线",
        "文化旅行",
        "自然探索",
      ],
    },
    why: {
      eyebrow: "为什么选择 Nomadabe",
      titleStart: "我们让旅行从第一次沟通开始",
      titleEmphasis: "更实际",
      titleEnd: "。",
      body:
        "不只是漂亮的行程表。酒店、交通、翻译、会议、保险和旅行支持都在一个团队内统一规划。",
      link: "阅读我们的故事",
      reasons: [
        {
          title: "每条路线都有当地经验",
          body:
            "我们与熟悉目的地的导游、翻译和旅行伙伴合作，不只停留在宣传册层面。",
        },
        {
          title: "商务与旅行双重支持",
          body:
            "展会报名、会议安排、产品调研、货运和付款建议都可由同一团队协调。",
        },
        {
          title: "灵活规划",
          body:
            "路线会根据您的日期、预算、团队人数和旅行目的进行调整。",
        },
        {
          title: "清晰建议",
          body:
            "出发前会说明包含内容、可能增加的费用以及需要注意的实际风险。",
        },
      ],
      stats: [
        { value: "1,200+", label: "满意旅行者" },
        { value: "84", label: "已规划行程" },
        { value: "4.9★", label: "平均评分" },
        { value: "27", label: "导游与伙伴" },
      ],
    },
    testimonials: {
      eyebrow: "旅行者评价",
      titleStart: "旅行结束后",
      titleEmphasis: "客人们",
      titleEnd: "这样说。",
      rating: "4.9 / 5 - 412 条已验证评价",
      quotes: [
        {
          name: "Nomin B.",
          trip: "广交会 - 7天",
          body:
            "这是我们第一次参加展会旅行，但报名、酒店和翻译都安排得很清楚。供应商会面最有帮助。",
        },
        {
          name: "Temuulen A.",
          trip: "定制商务旅行 - 4天",
          body:
            "这不是普通旅行套餐。他们围绕我们的商务目标安排了会议和路线，非常有价值。",
        },
        {
          name: "Saruul E.",
          trip: "休闲度假 - 6天",
          body:
            "我们一家人不用担心细节。酒店、交通和每日安排都很有条理，也适合孩子。",
        },
      ],
    },
    cta: {
      headingLine1: "已经有旅行想法了吗？",
      headingLine2: "告诉我们吧。",
      body:
        "告诉我们您的商务、展会或度假目标。我们的团队会在24小时内回复路线建议、时间安排和初步预算范围。",
      placeholder: "you@example.com",
      loading: "正在发送...",
      button: "开始规划",
      success: "谢谢。我们已收到您的请求，会尽快联系您。",
      error: "暂时无法发送，请再试一次。",
      idle: "不发送垃圾邮件，只提供实用旅行建议。",
    },
    footer: {
      description:
        "从乌兰巴托出发，为蒙古和全球目的地规划商务、展会与休闲旅行。",
      columns: [
        {
          title: "旅行",
          links: ["蒙古", "亚洲", "国际展会", "定制旅行", "团队预订"],
        },
        {
          title: "公司",
          links: ["关于我们", "导游", "可持续旅行", "新闻", "招聘"],
        },
        {
          title: "帮助",
          links: ["预订条款", "保险", "联系", "登录"],
        },
      ],
      copyright: "Nomadabe LLC - 乌兰巴托，蒙古",
      legal: ["隐私", "条款", "Cookies"],
    },
    modal: {
      close: "关闭",
      reviews: "条评价",
      about: "关于此行程",
      duration: "时长",
      group: "团队",
      departure: "出发",
      flexible: "可协商",
      ideal: "适合人群",
      includes: "可包含内容",
      business: "商务支持",
      price: "价格",
      quote: "报价",
      quoteDetails: "索取详情",
      register: "报名",
      ask: "咨询",
      note: "Nomadabe Travel 团队会联系您并提供详细信息。",
    },
  },
  ja: {
    nav: {
      items: [
        { label: "ツアー", href: "/tours" },
        { label: "レビュー", href: "/#journal" },
        { label: "私たちについて", href: "/about" },
      ],
      cta: "リクエスト",
      language: "言語を選択",
      openMenu: "メニューを開く",
      closeMenu: "メニューを閉じる",
    },
    hero: {
      rating: "5つ星評価、1,200人以上の旅行者",
      established: "2025年より - ウランバートル",
      headingLine1: "旅を",
      headingEmphasis: "次のレベル",
      headingLine2: "へ。",
      body:
        "モンゴル国内外の小グループ、ビジネス、展示会、レジャー旅行を、現地に詳しいチームが最初から最後まで手配します。",
      quick: ["広州交易会", "太陽光エネルギー", "食品展示会", "カスタム旅行", "家族旅行"],
      scroll: "下へ",
    },
    featured: {
      eyebrow: "注目ツアー",
      title: "ビジネス旅行、展示会ツアー、オーダーメイド休暇から始めましょう。",
      all: "すべてのツアーを見る",
      days: "日",
      price: "料金",
      quote: "見積もり依頼",
      details: "詳細",
      noResults: "選択した条件に合うツアーはありません。",
    },
    styles: {
      eyebrow: "旅のスタイルを選択",
      titleStart: "あなたに合う",
      titleEmphasis: "旅のスタイル",
      titleEnd: "を選びましょう。",
      body:
        "ビジネスミーティング、国際展示会、家族旅行、自由なカスタムルートまで、目的に合わせて旅を組み立てます。",
      countLabel: "ツアー",
      cards: [
        "ビジネス旅行",
        "展示会旅行",
        "レジャー旅行",
        "カスタムルート",
        "文化体験",
        "自然の旅",
      ],
    },
    why: {
      eyebrow: "Nomadabe が選ばれる理由",
      titleStart: "私たちは旅を",
      titleEmphasis: "実用的に",
      titleEnd: "形にします。",
      body:
        "見栄えの良い旅程表だけではありません。ホテル、交通、通訳、商談、保険、旅行サポートを一か所で計画します。",
      link: "私たちのストーリーを読む",
      reasons: [
        {
          title: "各ルートに現地知識",
          body:
            "パンフレット以上に目的地を知るガイド、通訳、旅行パートナーと連携します。",
        },
        {
          title: "ビジネスと旅行の両面サポート",
          body:
            "展示会登録、商談、仕入れ調査、貨物、支払いの初期相談まで一つのチームで調整できます。",
        },
        {
          title: "柔軟な計画",
          body:
            "日程、予算、人数、旅行目的に合わせてルートを調整します。",
        },
        {
          title: "明確なアドバイス",
          body:
            "含まれる内容、追加費用の可能性、実際の注意点を出発前に説明します。",
        },
      ],
      stats: [
        { value: "1,200+", label: "満足した旅行者" },
        { value: "84", label: "計画済みツアー" },
        { value: "4.9★", label: "平均評価" },
        { value: "27", label: "ガイドとパートナー" },
      ],
    },
    testimonials: {
      eyebrow: "旅行者の声",
      titleStart: "旅のあと、",
      titleEmphasis: "旅行者は",
      titleEnd: "こう話しています。",
      rating: "4.9 / 5 - 412件の認証済みレビュー",
      quotes: [
        {
          name: "Nomin B.",
          trip: "広州交易会 - 7日間",
          body:
            "初めての展示会旅行でしたが、登録、ホテル、通訳がすべて分かりやすく手配されていました。サプライヤーとの面談が一番役立ちました。",
        },
        {
          name: "Temuulen A.",
          trip: "カスタムビジネス旅行 - 4日間",
          body:
            "単なる旅行パッケージではなく、私たちのビジネス目的に合わせて商談とルートを作ってくれたのが価値でした。",
        },
        {
          name: "Saruul E.",
          trip: "レジャー旅行 - 6日間",
          body:
            "家族で細かいことを心配せずに旅行できました。ホテル、交通、毎日の予定が整理されていて、子どもにも合っていました。",
        },
      ],
    },
    cta: {
      headingLine1: "旅のアイデアがありますか？",
      headingLine2: "ぜひ教えてください。",
      body:
        "ビジネス、展示会、休暇など目的をお知らせください。24時間以内にルート案、時期、初期予算の目安をご連絡します。",
      placeholder: "you@example.com",
      loading: "送信中...",
      button: "計画を始める",
      success: "ありがとうございます。リクエストを受け付けました。折り返しご連絡します。",
      error: "現在送信できません。もう一度お試しください。",
      idle: "迷惑メールは送りません。実用的な旅の提案だけをお届けします。",
    },
    footer: {
      description:
        "ウランバートルから、モンゴルと世界各地へのビジネス、展示会、レジャー旅行を計画します。",
      columns: [
        {
          title: "ツアー",
          links: ["モンゴル", "アジア", "国際展示会", "カスタム旅行", "グループ予約"],
        },
        {
          title: "会社",
          links: ["私たちについて", "ガイド", "サステナブル旅行", "ニュース", "採用"],
        },
        {
          title: "ヘルプ",
          links: ["予約条件", "保険", "お問い合わせ", "ログイン"],
        },
      ],
      copyright: "Nomadabe LLC - ウランバートル、モンゴル",
      legal: ["プライバシー", "利用規約", "Cookies"],
    },
    modal: {
      close: "閉じる",
      reviews: "レビュー",
      about: "このツアーについて",
      duration: "期間",
      group: "グループ",
      departure: "出発",
      flexible: "応相談",
      ideal: "おすすめ",
      includes: "含められる内容",
      business: "ビジネスサポート",
      price: "料金",
      quote: "見積もり",
      quoteDetails: "詳細を依頼",
      register: "申し込む",
      ask: "問い合わせる",
      note: "Nomadabe Travel チームが詳細情報をご連絡します。",
    },
  },
  ko: {
    nav: {
      items: [
        { label: "여행", href: "/tours" },
        { label: "후기", href: "/#journal" },
        { label: "회사 소개", href: "/about" },
      ],
      cta: "요청하기",
      language: "언어 선택",
      openMenu: "메뉴 열기",
      closeMenu: "메뉴 닫기",
    },
    hero: {
      rating: "5성급 평가, 1,200명+ 여행자",
      established: "2025년부터 - 울란바토르",
      headingLine1: "여행을",
      headingEmphasis: "다음 단계",
      headingLine2: "로.",
      body:
        "몽골과 전 세계 목적지의 소규모 그룹, 비즈니스, 엑스포, 휴양 여행을 현지 지식이 있는 팀이 처음부터 끝까지 준비합니다.",
      quick: ["캔톤페어", "태양광 에너지", "식품 엑스포", "맞춤 여행", "가족 휴가"],
      scroll: "아래로",
    },
    featured: {
      eyebrow: "추천 여행",
      title: "비즈니스 여행, 엑스포 일정, 맞춤 휴가부터 시작하세요.",
      all: "모든 여행 보기",
      days: "일",
      price: "가격",
      quote: "견적 요청",
      details: "자세히",
      noResults: "선택한 조건에 맞는 여행이 없습니다.",
    },
    styles: {
      eyebrow: "여행 스타일 선택",
      titleStart: "나에게 맞는",
      titleEmphasis: "여행 스타일",
      titleEnd: "을 선택하세요.",
      body:
        "비즈니스 미팅, 국제 엑스포, 가족 휴가, 자유로운 맞춤 루트까지 목적에 맞춰 여행을 설계합니다.",
      countLabel: "여행",
      cards: [
        "비즈니스 여행",
        "엑스포 여행",
        "휴양 여행",
        "맞춤 루트",
        "문화 여행",
        "자연 여행",
      ],
    },
    why: {
      eyebrow: "Nomadabe를 선택하는 이유",
      titleStart: "우리는 여행을",
      titleEmphasis: "실용적으로",
      titleEnd: "만듭니다.",
      body:
        "보기 좋은 일정표만이 아닙니다. 호텔, 교통, 통역, 미팅, 보험, 여행 지원을 한곳에서 계획합니다.",
      link: "우리 이야기 읽기",
      reasons: [
        {
          title: "모든 루트의 현지 지식",
          body:
            "브로슈어 이상의 정보를 아는 가이드, 통역사, 여행 파트너와 함께합니다.",
        },
        {
          title: "비즈니스와 여행 동시 지원",
          body:
            "엑스포 등록, 미팅, 소싱, 화물, 결제 관련 기본 안내를 한 팀이 조율할 수 있습니다.",
        },
        {
          title: "유연한 계획",
          body:
            "날짜, 예산, 그룹 규모, 여행 목적에 맞춰 루트를 조정합니다.",
        },
        {
          title: "명확한 안내",
          body:
            "포함 사항, 추가 비용 가능성, 실제 주의점을 여행 전에 분명히 알려드립니다.",
        },
      ],
      stats: [
        { value: "1,200+", label: "만족한 여행자" },
        { value: "84", label: "계획한 여행" },
        { value: "4.9★", label: "평균 평점" },
        { value: "27", label: "가이드와 파트너" },
      ],
    },
    testimonials: {
      eyebrow: "여행자 후기",
      titleStart: "여행 후",
      titleEmphasis: "고객들은",
      titleEnd: "이렇게 말합니다.",
      rating: "4.9 / 5 - 인증 후기 412개",
      quotes: [
        {
          name: "Nomin B.",
          trip: "캔톤페어 - 7일",
          body:
            "첫 엑스포 여행이었지만 등록, 호텔, 통역이 모두 명확했습니다. 공급업체 미팅이 가장 도움이 되었습니다.",
        },
        {
          name: "Temuulen A.",
          trip: "맞춤 비즈니스 여행 - 4일",
          body:
            "단순한 여행 패키지가 아니라 우리 비즈니스 목표에 맞춘 미팅과 루트를 만들어준 점이 가치 있었습니다.",
        },
        {
          name: "Saruul E.",
          trip: "휴양 여행 - 6일",
          body:
            "가족과 함께 세부 사항을 걱정하지 않고 여행했습니다. 호텔, 교통, 일일 일정이 잘 정리되어 아이들에게도 좋았습니다.",
        },
      ],
    },
    cta: {
      headingLine1: "떠올린 여행 아이디어가 있나요?",
      headingLine2: "저희에게 알려주세요.",
      body:
        "비즈니스, 엑스포, 휴가 목적을 공유해 주세요. 저희 팀이 24시간 이내에 루트 아이디어, 일정, 초기 예산 범위를 보내드립니다.",
      placeholder: "you@example.com",
      loading: "전송 중...",
      button: "계획 시작하기",
      success: "감사합니다. 요청을 저장했으며 곧 연락드리겠습니다.",
      error: "지금은 전송할 수 없습니다. 다시 시도해 주세요.",
      idle: "스팸 없이 실용적인 여행 제안만 보내드립니다.",
    },
    footer: {
      description:
        "울란바토르에서 몽골과 전 세계로 향하는 비즈니스, 엑스포, 휴양 여행을 계획합니다.",
      columns: [
        {
          title: "여행",
          links: ["몽골", "아시아", "국제 엑스포", "맞춤 여행", "단체 예약"],
        },
        {
          title: "회사",
          links: ["회사 소개", "가이드", "지속 가능한 여행", "뉴스", "채용"],
        },
        {
          title: "도움말",
          links: ["예약 조건", "보험", "연락처", "로그인"],
        },
      ],
      copyright: "Nomadabe LLC - 울란바토르, 몽골",
      legal: ["개인정보", "약관", "Cookies"],
    },
    modal: {
      close: "닫기",
      reviews: "후기",
      about: "이 여행 소개",
      duration: "기간",
      group: "그룹",
      departure: "출발",
      flexible: "협의 가능",
      ideal: "추천 대상",
      includes: "포함 가능 항목",
      business: "비즈니스 지원",
      price: "가격",
      quote: "견적",
      quoteDetails: "자세히 요청",
      register: "신청하기",
      ask: "문의하기",
      note: "Nomadabe Travel 팀이 자세한 정보를 가지고 연락드립니다.",
    },
  },
} as const;
