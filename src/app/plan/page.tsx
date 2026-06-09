import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { CtaFooter } from "@/components/cta-footer";
import { LanguageProvider } from "@/components/language-provider";

export const metadata: Metadata = {
  title: "Аялал төлөвлөх | Nomadabe Travel",
  description:
    "Nomadabe Travel багтай аяллын санаа, чиглэл, хугацаа, төсвөө хуваалцаарай.",
};

export default function PlanPage() {
  return (
    <LanguageProvider>
      <Navbar />
      <main className="flex-1">
        <CtaFooter showPlanningSection />
      </main>
    </LanguageProvider>
  );
}
