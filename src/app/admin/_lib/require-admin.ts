import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/server/admin-auth";

/**
 * The admin session for this request, or a redirect to the login page.
 * Middleware already guards /admin, but every page, the layout, and every
 * Server Action check again: a layout does not re-run on client navigation,
 * and actions can be called directly.
 */
export async function requireAdmin() {
  const cookieStore = await cookies();
  const admin = await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
