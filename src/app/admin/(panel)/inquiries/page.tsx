import Form from "next/form";
import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import {
  filterInquiries,
  getInquiries,
  getInquiryStatusLabel,
  INQUIRY_STATUS_LABELS,
  isInquiryStatus,
  type InquiryRecord,
} from "@/lib/server/inquiries";
import { getErrorMessage } from "@/lib/server/supabase-rest";
import { InquiryStatusForm } from "../../_components/inquiry-status-form";
import {
  buttonClass,
  EmptyState,
  FOCUS_RING,
  LoadErrorNotice,
  PageHeader,
  paginate,
  Pagination,
  SelectField,
  TextField,
  TypePill,
} from "../../_components/primitives";
import { formatDate, formatStatusLabel } from "../../_components/format";
import { firstParam, type SearchParams } from "../../_lib/page-data";
import { requireAdmin } from "../../_lib/require-admin";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => ({ value, label }));

export default async function InquiriesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const params = await searchParams;
  const query = firstParam(params.q)?.trim() ?? "";
  const rawStatus = firstParam(params.status) ?? "";
  const status = isInquiryStatus(rawStatus) ? rawStatus : "";

  let inquiries: InquiryRecord[] = [];
  let loadError = "";

  try {
    inquiries = await getInquiries();
  } catch (error) {
    loadError = getErrorMessage(error);
  }

  const filtered = filterInquiries(inquiries, { query, status });
  const { page, totalPages, items } = paginate(filtered, firstParam(params.page), PAGE_SIZE);
  const isFiltered = Boolean(query || status);
  const summary = isFiltered
    ? `Нийт ${inquiries.length} · шүүлтэд ${filtered.length} тохирсон`
    : `Нийт ${inquiries.length} бүртгэл`;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Харилцагч"
        title="Бүртгүүлсэн хүмүүс"
        description="Вебээс ирсэн аяллын хүсэлтүүд. Төлөв солиход хэрэглэгчид мэйл автоматаар очихгүй — хүсвэл „мэдэгдэх“-ийг сонгоно."
        actions={<span className="text-sm font-semibold text-[var(--muted-foreground)]">{summary}</span>}
      />

      <LoadErrorNotice errors={loadError ? [loadError] : []} />

      <Form
        key={`${query}|${status}`}
        action="/admin/inquiries"
        role="search"
        aria-label="Бүртгэл шүүх"
        className="flex flex-wrap items-end gap-3 rounded-md border border-[var(--border)] bg-white p-4 shadow-sm"
      >
        <TextField
          label="Нэр эсвэл и-мэйлээр хайх"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Жишээ: Бат эсвэл bat@mail.mn"
          className="min-w-[14rem] flex-1"
        />
        <SelectField
          label="Төлөв"
          name="status"
          defaultValue={status}
          options={[{ value: "", label: "Бүх төлөв" }, ...STATUS_OPTIONS]}
          className="w-44"
        />
        <button type="submit" className={buttonClass()}>
          <Search aria-hidden="true" className="h-4 w-4" />
          Шүүх
        </button>
        {isFiltered ? (
          <Link href="/admin/inquiries" className={buttonClass({ variant: "ghost" })}>
            Шүүлт арилгах
          </Link>
        ) : null}
      </Form>

      {items.length === 0 ? (
        isFiltered ? (
          <EmptyState
            icon={SearchX}
            title="Шүүлтэд тохирох бүртгэл олдсонгүй"
            message="Өөр нэр, и-мэйл эсвэл төлөвөөр хайж үзнэ үү."
          />
        ) : (
          <EmptyState title="Одоогоор бүртгэл алга" message="Вебээс ирэх шинэ бүртгэлүүд энд харагдана." />
        )
      ) : (
        <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Бүртгэлийн жагсаалт, {page}/{totalPages} хуудас
              </caption>
              <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Хүн</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Хүсэлт</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Хөтөлбөр</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Ирсэн огноо</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Төлөв</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((inquiry) => (
                  <tr key={inquiry.id} className="bg-white align-top">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[var(--primary)]">{inquiry.name}</div>
                      {inquiry.email ? (
                        <a href={`mailto:${inquiry.email}`} className={`mt-1 inline-block rounded text-[var(--muted-foreground)] underline-offset-2 hover:underline ${FOCUS_RING}`}>
                          {inquiry.email}
                        </a>
                      ) : (
                        <div className="mt-1 text-[var(--muted-foreground)]">И-мэйлгүй</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <TypePill label={formatStatusLabel(inquiry.inquiryType)} />
                        {inquiry.travelers ? <span className="text-[var(--muted-foreground)]">{inquiry.travelers} хүн</span> : null}
                        {inquiry.preferredDate ? <span className="text-[var(--muted-foreground)]">· {inquiry.preferredDate}</span> : null}
                      </div>
                      <p className="mt-2 max-w-sm whitespace-pre-line text-[var(--foreground)]">{inquiry.message}</p>
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">{inquiry.tripSlug ?? "Ерөнхий"}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--muted-foreground)]">{formatDate(inquiry.createdAt)}</td>
                    <td className="px-5 py-4">
                      <InquiryStatusForm
                        key={`${inquiry.id}-${inquiry.status}`}
                        inquiryId={inquiry.id}
                        name={inquiry.name}
                        status={inquiry.status}
                        hasEmail={Boolean(inquiry.email)}
                        statusOptions={STATUS_OPTIONS}
                      />
                      <span className="sr-only">Одоогийн төлөв: {getInquiryStatusLabel(inquiry.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/inquiries"
        params={{ q: query || undefined, status: status || undefined }}
      />
    </div>
  );
}
