import { redirect } from "next/navigation";

// The old destinations index now lives on /tours; this route only redirects.
export default function DestinationsPage() {
  redirect("/tours");
}
