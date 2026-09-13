import type { ReactNode } from "react";
import { AdminShell } from "../_components/admin-shell";
import { requireAdmin } from "../_lib/require-admin";

// Shared by every admin page except /admin/login, which sits outside this
// route group so the auth check and the navigation never wrap it.
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return <AdminShell adminEmail={admin.email}>{children}</AdminShell>;
}
