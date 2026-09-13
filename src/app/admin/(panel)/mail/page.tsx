import { MailX } from "lucide-react";
import { getInquiries } from "@/lib/server/inquiries";
import { getEmailLogs } from "@/lib/server/mail";
import { EmailComposer, type QuickReplyRecipient } from "../../_components/email-composer";
import {
  EmptyState,
  LoadErrorNotice,
  PageHeader,
  paginate,
  Pagination,
  SectionHeader,
  StatusPill,
} from "../../_components/primitives";
import { formatDate, formatStatusLabel } from "../../_components/format";
import { firstParam, settledErrors, settledValue, type SearchParams } from "../../_lib/page-data";
import { requireAdmin } from "../../_lib/require-admin";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function MailPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const params = await searchParams;
  const results = await Promise.allSettled([getInquiries(), getEmailLogs()]);
  const inquiries = settledValue(results[0], []);
  const emailLogs = settledValue(results[1], []);
  const latestWithEmail = inquiries.find((inquiry) => inquiry.email);
  const quickReply: QuickReplyRecipient | null = latestWithEmail?.email
    ? { inquiryId: latestWithEmail.id, name: latestWithEmail.name, email: latestWithEmail.email }
    : null;
  const { page, totalPages, items } = paginate(emailLogs, firstParam(params.page), PAGE_SIZE);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Харилцаа"
        title="Мэйл илгээх"
        description="Хэрэглэгч рүү гараар мэйл бичих, эсвэл сүүлийн бүртгэл рүү бэлэн хариу илгээнэ."
      />

      <LoadErrorNotice errors={settledErrors(results)} />

      <EmailComposer quickReply={quickReply} />

      <section className="space-y-4">
        <SectionHeader title="Мэйлийн түүх" action={`Нийт ${emailLogs.length}`} />
        {items.length === 0 ? (
          <EmptyState icon={MailX} title="Одоогоор мэйл алга" message="Илгээсэн мэйлүүд энд харагдана." />
        ) : (
          <ul className="space-y-2">
            {items.map((log) => (
              <li key={log.id} className="rounded-md border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--primary)]">{log.subject}</p>
                    <p className="mt-1 truncate text-sm text-[var(--muted-foreground)]">
                      {log.to} · {formatDate(log.createdAt)}
                    </p>
                    {log.error ? <p className="mt-1 text-xs text-red-700">{log.error}</p> : null}
                  </div>
                  <StatusPill label={formatStatusLabel(log.status)} />
                </div>
              </li>
            ))}
          </ul>
        )}
        <Pagination page={page} totalPages={totalPages} basePath="/admin/mail" />
      </section>
    </div>
  );
}
