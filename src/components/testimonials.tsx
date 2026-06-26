"use client";

import { motion } from "framer-motion";
import {
  TestimonialsColumn,
  type TestimonialColumnItem,
} from "@/components/ui/testimonials-columns-1";
import { useLanguage } from "./language-provider";

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

export function Testimonials() {
  const { contentLocale, t } = useLanguage();
  const copy = t.testimonials;

  const testimonials: TestimonialColumnItem[] = REVIEW_PROFILES.map((profile, index) => {
    const quote = copy.quotes[index % copy.quotes.length];

    return {
      text: contentLocale === "mn" ? profile.text : quote.body,
      email: profile.email,
      avatar: profile.avatar,
      role: contentLocale === "mn" ? profile.role : quote.trip,
    };
  });

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

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
      </div>
    </section>
  );
}
