import { ok } from "@/lib/server/api";
import { isAllowedAdminEmail } from "@/lib/server/admin-auth";
import { getCustomerFromRequest } from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const customer = await getCustomerFromRequest(request);

  return ok({
    customer,
    isAdmin: customer ? isAllowedAdminEmail(customer.email) : false,
  });
}
