import { ok } from "@/lib/server/api";
import { getServices } from "@/lib/server/admin-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase();
  let services = await getServices();

  if (query) {
    services = services.filter((service) =>
      [service.title, service.description, ...service.highlights]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }

  return ok({
    services,
    count: services.length,
    filters: {
      q: searchParams.get("q") ?? null,
    },
  });
}
