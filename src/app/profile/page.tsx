import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { ProfilePageClient } from "@/components/profile-page-client";
import { SignupPromptModal } from "@/components/signup-prompt-modal";

export const metadata: Metadata = {
  title: "Миний профайл | Nomadabe",
  description: "Nomadabe Travel хэрэглэгчийн профайл болон аяллын хүсэлтүүд.",
};

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar />
      <ProfilePageClient />
    </>
  );
}
