import { UserCheck } from "lucide-react";
import { getCustomers, type Customer } from "@/lib/server/customer-auth";
import { getErrorMessage } from "@/lib/server/supabase-rest";
import {
  EmptyState,
  LoadErrorNotice,
  PageHeader,
  paginate,
  Pagination,
  StatusPill,
} from "../../_components/primitives";
import { formatDate } from "../../_components/format";
import { firstParam, type SearchParams } from "../../_lib/page-data";
import { requireAdmin } from "../../_lib/require-admin";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export default async function CustomersPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const params = await searchParams;
  let customers: Customer[] = [];
  let loadError = "";

  try {
    customers = await getCustomers();
  } catch (error) {
    loadError = getErrorMessage(error);
  }

  const { page, totalPages, items } = paginate(customers, firstParam(params.page), PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Аккаунт"
        title="Хэрэглэгчийн бүртгэл"
        description="И-мэйлээ баталгаажуулж бүртгүүлсэн хэрэглэгчид."
        actions={<span className="text-sm font-semibold text-[var(--muted-foreground)]">Нийт {customers.length} хэрэглэгч</span>}
      />

      <LoadErrorNotice errors={loadError ? [loadError] : []} />

      {items.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="Баталгаажсан хэрэглэгч алга"
          message="Хэрэглэгч и-мэйлийн кодоо баталгаажуулсны дараа энд харагдана."
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((customer) => (
            <li key={customer.id} className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-[var(--primary)]">
                    {customer.name || customer.email || "Хэрэглэгч"}
                  </h2>
                  {customer.name ? (
                    <p className="mt-1 truncate text-sm text-[var(--muted-foreground)]">{customer.email}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">Дугаар: {customer.id.slice(0, 8)}</p>
                </div>
                <StatusPill label="баталгаажсан" />
              </div>
              <div className="mt-4 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted-foreground)]">
                Шинэчлэгдсэн: {formatDate(customer.updatedAt)}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/customers" />
    </div>
  );
}
