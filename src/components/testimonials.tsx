"use client";

import { motion } from "framer-motion";
import { ImagePlus, Send, Star } from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import {
  TestimonialsColumn,
  type TestimonialColumnItem,
} from "@/components/ui/testimonials-columns-1";
import { useLanguage } from "./language-provider";
import type { SiteReview } from "@/lib/site-settings";

const REVIEW_PROFILES: Array<{
  email: string;
  role: string;
  text: string;
  avatar: TestimonialColumnItem["avatar"];
}> = [
  {
    email: "nomin.b***@gmail.com",
    role: "Canton Fair - 7 өдөр",
    text:
      "Анх удаа Canton Fair-д явсан болохоор бүртгэл, павильон, уулзалтын цаг бүгдийг нь урьдчилж цэгцэлж өгсөн нь хамгийн их хэрэг болсон.",
    avatar: { initials: "Н", background: "#1a73e8", foreground: "#ffffff", gender: "female" },
  },
  {
    email: "temuulen.a***@gmail.com",
    role: "Шанхай бизнес аялал - 5 өдөр",
    text:
      "Нислэг хойшлоход буудал, тосолт, дараагийн өдрийн маршрутыг хурдан өөрчилж өгсөн. Ажлын уулзалтуудаа алдалгүй амжуулсан.",
    avatar: { initials: "Т", background: "#0f9d58", foreground: "#ffffff", gender: "male" },
  },
  {
    email: "saruul.e***@gmail.com",
    role: "Жэжү гэр бүлийн аялал - 6 өдөр",
    text:
      "Хүүхдүүдтэй явсан болохоор хөтөлбөр нь хэт шахуу биш, буудал нь далайд ойр байсан нь таалагдсан. Өдөр бүрийн мэдээлэл тодорхой ирдэг байсан.",
    avatar: { initials: "С", background: "#fbbc04", foreground: "#202124", gender: "female" },
  },
  {
    email: "enkhjin.m***@gmail.com",
    role: "Япон 4 хотын аялал - 5 өдөр",
    text:
      "Галт тэрэг, хот хоорондын шилжилт дээр санаа зовж байсан ч бүх цагийн хуваарь ойлгомжтой байсан. Хөтөч нь маш тайван тайлбарладаг.",
    avatar: { initials: "Э", background: "#db4437", foreground: "#ffffff", gender: "female" },
  },
  {
    email: "munkhorgil.b***@gmail.com",
    role: "Тайвань үзэсгэлэн аялал - 7 өдөр",
    text:
      "Үзэсгэлэнгийн дараах ханган нийлүүлэгчийн уулзалтуудыг тусад нь тохируулж өгсөн. Зөвхөн аялал биш бизнес талдаа бодит үр дүнтэй байлаа.",
    avatar: { initials: "М", background: "#673ab7", foreground: "#ffffff", gender: "male" },
  },
  {
    email: "anuka.d***@gmail.com",
    role: "Турк амралт аялал - 8 өдөр",
    text:
      "Үнэ дотор юу багтсан, юуг тусад нь төлөхийг эхнээс нь тодорхой хэлсэн. Очоод гэнэтийн нэмэлт зардал гараагүй нь итгэл төрүүлсэн.",
    avatar: { initials: "А", background: "#00acc1", foreground: "#ffffff", gender: "female" },
  },
  {
    email: "bilguun.o***@gmail.com",
    role: "Хятад үйлдвэртэй уулзах аялал - 4 өдөр",
    text:
      "Орчуулагч, тээврийн зохицуулалт сайн байсан. Үйлдвэр дээр очих цаг, буцах зам, хот доторх хөдөлгөөн бүгд төлөвлөгөөний дагуу явсан.",
    avatar: { initials: "Б", background: "#e8710a", foreground: "#ffffff", gender: "male" },
  },
  {
    email: "oyuka.r***@gmail.com",
    role: "Монгол фестивалийн аялал - 6 өдөр",
    text:
      "Гадаад найзуудтайгаа явсан, хөтөч нь ёс заншил, наадмын хөтөлбөрийг ойлгомжтой тайлбарласан. Зураг авах цэгүүд хүртэл сайн сонгосон байсан.",
    avatar: { initials: "О", background: "#d81b60", foreground: "#ffffff", gender: "female" },
  },
  {
    email: "tulga.s***@gmail.com",
    role: "Захиалгат маршрут - 3 өдөр",
    text:
      "Богино хугацаанд багийнхаа төсөв, уулзалтын зорилгод тааруулж маршрут гаргуулсан. Хариу хурдан, зохион байгуулалт нь цэгцтэй.",
    avatar: { initials: "Т", background: "#3c4043", foreground: "#ffffff", gender: "male" },
  },
];

type TestimonialsProps = {
  reviews?: SiteReview[];
};

export function Testimonials({ reviews = [] }: TestimonialsProps) {
  const { contentLocale, t } = useLanguage();
  const copy = t.testimonials;
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [localReviews, setLocalReviews] = useState<SiteReview[]>(reviews);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staticTestimonials: TestimonialColumnItem[] = REVIEW_PROFILES.map((profile, index) => {
    const quote = copy.quotes[index % copy.quotes.length];

    return {
      text: contentLocale === "mn" ? profile.text : quote.body,
      email: profile.email,
      avatar: profile.avatar,
      role: contentLocale === "mn" ? profile.role : quote.trip,
    };
  });

  const testimonials: TestimonialColumnItem[] = useMemo(() => {
    const storedReviews = localReviews.map((review) => ({
      text: review.message,
      email: review.name,
      avatar: {
        initials: review.name.slice(0, 1).toUpperCase() || "N",
        background: "#ffd400",
        foreground: "#11100b",
        gender: "female" as const,
      },
      role: [review.trip, review.location].filter(Boolean).join(" - ") || "Nomadabe traveller",
      imageUrl: review.imageUrl,
    }));

    return storedReviews.length > 0
      ? [...storedReviews, ...staticTestimonials.slice(storedReviews.length)]
      : staticTestimonials;
  }, [localReviews, staticTestimonials]);

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error?.message || "Сэтгэгдэл хадгалж чадсангүй.");
      }

      setLocalReviews((current) => [payload.data.review, ...current].slice(0, 36));
      formRef.current?.reset();
      setStatus("Сэтгэгдэл хадгалагдлаа. Баярлалаа.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Сэтгэгдэл хадгалж чадсангүй.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function scrollToReviewForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => nameInputRef.current?.focus(), 450);
  }

  return (
    <section id="journal" className="relative bg-white px-4 py-10 lg:px-8 lg:py-12">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[520px] flex-col items-center justify-center text-center"
        >
          <h2 className="text-balance text-2xl font-semibold leading-tight text-foreground sm:text-3xl lg:text-4xl">
            {copy.eyebrow}
          </h2>
          <button
            type="button"
            onClick={scrollToReviewForm}
            className="nav-text mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-xs uppercase tracking-[0.12em] text-primary-foreground shadow-[0_12px_30px_rgba(255,212,0,0.28)] transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Сэтгэгдэл бичих
          </button>
        </motion.div>

        <div className="mx-auto mt-8 grid max-h-[430px] w-full max-w-5xl grid-cols-1 gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)] md:grid-cols-3">
          <TestimonialsColumn testimonials={firstColumn} className="w-full" duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden w-full md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden w-full md:block"
            duration={17}
          />
        </div>

        <form
          id="write-review"
          ref={formRef}
          onSubmit={submitReview}
          className="mx-auto mt-8 grid w-full max-w-5xl scroll-mt-28 gap-3 rounded-xl border border-[#eadfac] bg-[#fffdf3] p-4 shadow-sm shadow-primary/10 md:grid-cols-[1fr_1fr_auto]"
        >
          <input
            ref={nameInputRef}
            name="name"
            required
            minLength={2}
            placeholder="Нэр"
            className="h-12 rounded-lg border border-[#eadfac] bg-white px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary"
          />
          <input
            name="trip"
            placeholder="Аяллын нэр"
            className="h-12 rounded-lg border border-[#eadfac] bg-white px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary"
          />
          <select
            name="rating"
            defaultValue="5"
            className="h-12 rounded-lg border border-[#eadfac] bg-white px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary"
            aria-label="Үнэлгээ"
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} од
              </option>
            ))}
          </select>
          <textarea
            name="message"
            required
            minLength={8}
            placeholder="Сэтгэгдлээ бичнэ үү"
            className="min-h-24 rounded-lg border border-[#eadfac] bg-white px-4 py-3 text-sm font-medium leading-6 text-foreground outline-none transition focus:border-primary md:col-span-2"
          />
          <label className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#d8c56d] bg-white px-4 text-sm font-semibold text-foreground/70 transition hover:border-primary hover:text-foreground">
            <ImagePlus className="h-5 w-5 text-primary" />
            Зураг
            <input name="image" type="file" accept="image/*" className="sr-only" />
          </label>
          <div className="flex flex-col gap-3 md:col-span-3 md:flex-row md:items-center">
            <input
              name="location"
              placeholder="Хот / улс"
              className="h-12 flex-1 rounded-lg border border-[#eadfac] bg-white px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#11100b] px-6 text-sm font-semibold text-white transition hover:bg-[#2a271d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Star className="h-4 w-4" />
              {isSubmitting ? "Хадгалж байна" : "Сэтгэгдэл үлдээх"}
              <Send className="h-4 w-4" />
            </button>
          </div>
          {status ? (
            <p className="text-sm font-medium text-foreground/70 md:col-span-3">{status}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
