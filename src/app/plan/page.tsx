import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { CtaFooter } from "@/components/cta-footer";

export const metadata: Metadata = {
  title: "Nomadabe",
  description:
    "Nomadabe Travel багтай аяллын санаа, чиглэл, хугацаа, төсвөө хуваалцаарай.",
};

export default function PlanPage() {
  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar />
      <main className="flex-1">
        <CtaFooter showPlanningSection />
      </main>
    </>
  );
}
