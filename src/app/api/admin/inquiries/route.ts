import { ok } from "@/lib/server/api";
import { getInquiries } from "@/lib/server/inquiries";

export const runtime = "nodejs";

export async function GET() {
  const inquiries = await getInquiries();

  return ok({
    inquiries,
    count: inquiries.length,
  });
}
