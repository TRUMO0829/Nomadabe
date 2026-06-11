import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Trips | Nomadabe",
  description:
    "Browse Nomadabe domestic and outbound trips by country, city, and travel style.",
};

export const dynamic = "force-dynamic";

export default function DestinationsPage() {
  redirect("/tours");
}
