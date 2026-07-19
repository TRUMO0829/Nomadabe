import { Hero } from "@/components/hero";
import { CtaFooter } from "@/components/cta-footer";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { TravelFacts } from "@/components/travel-facts";
import { getAdminStore } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { siteSettings } = await getAdminStore();

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <main className="flex-1">
        <Hero settings={siteSettings} />
        <TravelFacts />
        <CtaFooter />
      </main>
    </>
  );
}
