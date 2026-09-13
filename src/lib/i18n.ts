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

// Strings shared by several components. Copy used in one place lives in
// that component, next to the markup it labels.
export const UI_COPY = {
  mn: {
    nav: {
      language: "Хэл сонгох",
      openMenu: "Цэс нээх",
      closeMenu: "Цэс хаах"
    },
    featured: {
      eyebrow: "Онцлох аяллууд",
      title: "Бизнес, expo, амралт зугаалгын аяллаа эндээс эхлүүл.",
      all: "Бүх аяллыг харах",
      days: "өдөр",
      price: "Үнэ",
      quote: "Санал авах",
      details: "Дэлгэрэнгүй",
      noResults: "Сонгосон нөхцөлд тохирох аялал олдсонгүй."
    },
    testimonials: {
      eyebrow: "Аялагчдын сэтгэгдэл"
    },
    cta: {
      headingLine1: "Аяллын санаа толгойд байна уу?",
      headingLine2: "Бидэнтэй хуваалцаарай.",
      body: "Бизнес уулзалт, expo эсвэл амралт гээд зорилгоо бичээрэй. Манай баг 24 цагийн дотор чиглэл, хугацаа, төсвийн анхны санал илгээнэ.",
      placeholder: "email@example.com",
      loading: "Илгээж байна...",
      button: "Төлөвлөлт эхлүүлэх",
      success: "Баярлалаа. Бид таны хүсэлтийг хүлээн аваад эргэн холбогдоно.",
      error: "Одоогоор илгээж чадсангүй. Дахин оролдоно уу.",
      idle: "Спам байхгүй. Зөвхөн аяллын бодит санал илгээнэ."
    }
  },
  en: {
    nav: {
      language: "Choose language",
      openMenu: "Open menu",
      closeMenu: "Close menu"
    },
    featured: {
      eyebrow: "Featured trips",
      title: "Start with business travel, expo trips, and tailored holidays.",
      all: "View all trips",
      days: "days",
      price: "Price",
      quote: "Request quote",
      details: "Details",
      noResults: "No trips match the selected filters."
    },
    testimonials: {
      eyebrow: "Traveller reviews"
    },
    cta: {
      headingLine1: "Have a trip idea in mind?",
      headingLine2: "Tell us about it.",
      body: "Share your business, expo, or holiday goal. Our team will reply within 24 hours with route ideas, timing, and an initial budget range.",
      placeholder: "you@example.com",
      loading: "Sending...",
      button: "Start planning",
      success: "Thanks. We saved your request and will get back to you.",
      error: "Could not send right now. Please try again.",
      idle: "No spam. Just practical trip ideas."
    }
  },
  zh: {
    nav: {
      language: "选择语言",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单"
    },
    featured: {
      eyebrow: "精选旅行",
      title: "从商务旅行、展会行程和定制假期开始。",
      all: "查看全部旅行",
      days: "天",
      price: "价格",
      quote: "获取报价",
      details: "详情",
      noResults: "没有符合当前筛选条件的旅行。"
    },
    testimonials: {
      eyebrow: "旅行者评价"
    },
    cta: {
      headingLine1: "已经有旅行想法了吗？",
      headingLine2: "告诉我们吧。",
      body: "告诉我们您的商务、展会或度假目标。我们的团队会在24小时内回复路线建议、时间安排和初步预算范围。",
      placeholder: "you@example.com",
      loading: "正在发送...",
      button: "开始规划",
      success: "谢谢。我们已收到您的请求，会尽快联系您。",
      error: "暂时无法发送，请再试一次。",
      idle: "不发送垃圾邮件，只提供实用旅行建议。"
    }
  },
  ja: {
    nav: {
      language: "言語を選択",
      openMenu: "メニューを開く",
      closeMenu: "メニューを閉じる"
    },
    featured: {
      eyebrow: "注目ツアー",
      title: "ビジネス旅行、展示会ツアー、オーダーメイド休暇から始めましょう。",
      all: "すべてのツアーを見る",
      days: "日",
      price: "料金",
      quote: "見積もり依頼",
      details: "詳細",
      noResults: "選択した条件に合うツアーはありません。"
    },
    testimonials: {
      eyebrow: "旅行者の声"
    },
    cta: {
      headingLine1: "旅のアイデアがありますか？",
      headingLine2: "ぜひ教えてください。",
      body: "ビジネス、展示会、休暇など目的をお知らせください。24時間以内にルート案、時期、初期予算の目安をご連絡します。",
      placeholder: "you@example.com",
      loading: "送信中...",
      button: "計画を始める",
      success: "ありがとうございます。リクエストを受け付けました。折り返しご連絡します。",
      error: "現在送信できません。もう一度お試しください。",
      idle: "迷惑メールは送りません。実用的な旅の提案だけをお届けします。"
    }
  },
  ko: {
    nav: {
      language: "언어 선택",
      openMenu: "메뉴 열기",
      closeMenu: "메뉴 닫기"
    },
    featured: {
      eyebrow: "추천 여행",
      title: "비즈니스 여행, 엑스포 일정, 맞춤 휴가부터 시작하세요.",
      all: "모든 여행 보기",
      days: "일",
      price: "가격",
      quote: "견적 요청",
      details: "자세히",
      noResults: "선택한 조건에 맞는 여행이 없습니다."
    },
    testimonials: {
      eyebrow: "여행자 후기"
    },
    cta: {
      headingLine1: "떠올린 여행 아이디어가 있나요?",
      headingLine2: "저희에게 알려주세요.",
      body: "비즈니스, 엑스포, 휴가 목적을 공유해 주세요. 저희 팀이 24시간 이내에 루트 아이디어, 일정, 초기 예산 범위를 보내드립니다.",
      placeholder: "you@example.com",
      loading: "전송 중...",
      button: "계획 시작하기",
      success: "감사합니다. 요청을 저장했으며 곧 연락드리겠습니다.",
      error: "지금은 전송할 수 없습니다. 다시 시도해 주세요.",
      idle: "스팸 없이 실용적인 여행 제안만 보내드립니다."
    }
  }
} as const;
