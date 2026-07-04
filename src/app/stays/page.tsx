import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Home, MapPin } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { CtaFooter } from "@/components/cta-footer";

export const metadata: Metadata = {
  title: "Зочид буудал, Вилла | Nomadabe",
  description:
    "Nomadabe Travel-ийн зочид буудал, вилла, амралтын байрны сонголт болон захиалгын зөвлөгөө.",
};

const stayOptions = [
  {
    title: "Зочид буудал",
    body: "Хотын төв, бизнес аялал, expo болон гэр бүлийн аялалд тохирох буудлын сонголт.",
    icon: Building2,
  },
  {
    title: "Вилла",
    body: "Амралт, жижиг групп, хувийн орчин шаардсан аялалд тохирох вилла болон хаус.",
    icon: Home,
  },
  {
    title: "Байршлын зөвлөгөө",
    body: "Аяллын маршрут, уулзалт, нисэх буудал, үзвэртэй ойр байршлыг хамт төлөвлөнө.",
    icon: MapPin,
  },
];

const STAYS_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2600&q=90";

export default function StaysPage() {
  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar surface="light" />
      <main className="min-h-screen bg-[#0b0a07] text-white">
        <section
          className="relative min-h-screen overflow-hidden bg-cover bg-center px-6 pb-16 pt-36 sm:px-8 lg:px-10 lg:pt-40"
          style={{
            backgroundImage: `linear-gradient(115deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.54) 48%, rgba(0,0,0,0.28) 100%), url(${STAYS_BACKGROUND_IMAGE})`,
          }}
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
            <div className="max-w-4xl">
              <p className="nav-text mb-5 text-xs uppercase text-accent">
                Nomadabe stays
              </p>
              <h1 className="site-heading text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.92] text-white">
                Зочид буудал, Вилла
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/76">
                Аяллын зорилго, төсөв, байршилд тань таарсан буудал болон вилла
                сонголтыг аяллын төлөвлөгөөтэй хамт нэг дор зөвлөнө.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {stayOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <article
                    key={option.title}
                    className="rounded-lg border border-white/18 bg-black/28 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-md"
                  >
                    <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="site-heading text-2xl text-white">
                      {option.title}
                    </h2>
                    <p className="mt-4 leading-7 text-white/70">
                      {option.body}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/plan"
                className="nav-text inline-flex rounded-full bg-accent px-7 py-4 text-sm uppercase text-accent-foreground"
              >
                Захиалга өгөх
              </Link>
              <Link
                href="/tours"
                className="nav-text inline-flex rounded-full border border-white/35 bg-white/8 px-7 py-4 text-sm uppercase text-white backdrop-blur transition-colors hover:bg-white/16"
              >
                Аяллууд үзэх
              </Link>
            </div>
          </div>
        </section>
        <CtaFooter />
      </main>
    </>
  );
}
