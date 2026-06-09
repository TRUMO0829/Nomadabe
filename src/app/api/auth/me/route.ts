import { ok } from "@/lib/server/api";
import { getCustomerFromRequest } from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return ok({
    customer: await getCustomerFromRequest(request),
  });
}
