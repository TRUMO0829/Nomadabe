import type { Metadata } from "next";
import { CtaFooter } from "@/components/cta-footer";
import { LegalPage } from "@/components/legal-page";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";

export const metadata: Metadata = {
  title: "Үйлчилгээний нөхцөл | Nomadabe",
  description: "Nomadabe Travel-ийн үйлчилгээний нөхцөл.",
};

export default function TermsPage() {
  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar surface="light" />
      <main className="flex-1 bg-[#0b0a07]">
        <LegalPage kind="terms" />
        <CtaFooter />
      </main>
    </>
  );
}
