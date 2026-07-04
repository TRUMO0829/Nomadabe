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

export default function StaysPage() {
  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar surface="light" />
      <main className="min-h-screen bg-[#fffdf3] pt-28 text-foreground">
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-16 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <p className="nav-text mb-5 text-xs uppercase text-accent">
              Nomadabe stays
            </p>
            <h1 className="site-heading text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.92]">
              Зочид буудал, Вилла
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
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
                  className="rounded-lg border border-border bg-white/70 p-6 shadow-[0_18px_50px_rgba(17,16,11,0.06)]"
                >
                  <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="site-heading text-2xl">{option.title}</h2>
                  <p className="mt-4 leading-7 text-muted-foreground">
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
              className="nav-text inline-flex rounded-full border border-border px-7 py-4 text-sm uppercase"
            >
              Аяллууд үзэх
            </Link>
          </div>
        </section>
        <CtaFooter />
      </main>
    </>
  );
}
