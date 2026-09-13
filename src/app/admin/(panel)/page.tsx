import { ArrowRight, CalendarDays, Inbox, Mail, MessageSquare, Plane, UserCheck } from "lucide-react";
import Link from "next/link";
import { isApprovedReview } from "@/lib/site-settings";
import { getAdminDashboardData } from "@/lib/server/admin-store";
import { getCustomers } from "@/lib/server/customer-auth";
import { getInquiryStatusLabel } from "@/lib/server/inquiries";
import { getEmailLogs } from "@/lib/server/mail";
import {
  EmptyState,
  FOCUS_RING,
  LoadErrorNotice,
  MetricCard,
  PageHeader,
  SectionHeader,
  StatusPill,
} from "../_components/primitives";
import { formatDate, formatRelativeDate, isUpcomingDeparture } from "../_components/format";
import { settledErrors, settledValue } from "../_lib/page-data";
import { requireAdmin } from "../_lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const results = await Promise.allSettled([getAdminDashboardData(), getCustomers(), getEmailLogs()]);
  const [dashboardResult, customersResult, emailLogsResult] = results;
  const dashboard = settledValue(dashboardResult, null);
  const trips = dashboard?.trips ?? [];
  const inquiries = dashboard?.inquiries ?? [];
  const reviews = dashboard?.reviews ?? [];
  const customers = settledValue(customersResult, []);
  const emailLogs = settledValue(emailLogsResult, []);

  const todayIso = new Date().toISOString().slice(0, 10);
  const upcomingDepartures = trips
    .filter((trip) => isUpcomingDeparture(trip.nextDeparture, todayIso))
    .sort((left, right) => String(left.nextDeparture).localeCompare(String(right.nextDeparture)));
  const newInquiries = inquiries.filter((inquiry) => inquiry.status === "new").length;
  const pendingReviews = reviews.filter((review) => !isApprovedReview(review)).length;
  const featuredTrips = trips.filter((trip) => trip.featured).length;
  const lastInquiry = inquiries[0]?.createdAt ? formatRelativeDate(inquiries[0].createdAt) : "Одоогоор алга";
  const latestInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Админ самбар"
        title="Веб удирдлагын төв"
        description={`Хөтөлбөр, бүртгэл, хэрэглэгч, мэйлийн ажлыг нэг дороос удирдана. Сүүлийн бүртгэл: ${lastInquiry}.`}
      />

      <LoadErrorNotice errors={settledErrors(results)} />

      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Үзүүлэлтүүд</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard href="/admin/inquiries" icon={Inbox} label="Нийт бүртгэл" value={inquiries.length} detail={`Сүүлийнх: ${lastInquiry}`} />
          <MetricCard href="/admin/inquiries?status=new" icon={Inbox} label="Шинэ бүртгэл" value={newInquiries} detail="Хариу хүлээж буй" />
          <MetricCard href="/admin/customers" icon={UserCheck} label="Хэрэглэгчид" value={customers.length} detail="Баталгаажсан бүртгэлтэй" />
          <MetricCard href="/admin/trips" icon={Plane} label="Хөтөлбөрүүд" value={trips.length} detail={`${featuredTrips} онцолсон`} />
          <MetricCard href="/admin/reviews" icon={MessageSquare} label="Хүлээгдэж буй сэтгэгдэл" value={pendingReviews} detail="Нийтлэхээс өмнө хянана" />
          <MetricCard href="/admin/mail" icon={Mail} label="Мэйл" value={emailLogs.length} detail="Илгээсэн эсвэл түүхэнд хадгалсан" />
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="space-y-4">
          <SectionHeader
            title="Сүүлийн бүртгэлүүд"
            action={
              <Link href="/admin/inquiries" className={`inline-flex items-center gap-1 rounded-md font-semibold text-[var(--primary)] underline-offset-2 hover:underline ${FOCUS_RING}`}>
                Бүгдийг харах
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            }
          />
          {latestInquiries.length === 0 ? (
            <EmptyState title="Одоогоор бүртгэл алга" message="Вебээс ирэх шинэ бүртгэлүүд энд харагдана." />
          ) : (
            <ul className="space-y-2">
              {latestInquiries.map((inquiry) => (
                <li key={inquiry.id} className="rounded-md border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--primary)]">{inquiry.name}</p>
                      <p className="mt-1 truncate text-sm text-[var(--muted-foreground)]">
                        {inquiry.email ?? "И-мэйлгүй"} · {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                    <StatusPill label={getInquiryStatusLabel(inquiry.status)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Ойрын аяллууд" action={`${upcomingDepartures.length} товлогдсон`} />
          {upcomingDepartures.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Товлогдсон аялал алга"
              message="Хөтөлбөрт „Дараагийн явах огноо“ оруулбал энд харагдана."
            />
          ) : (
            <ul className="space-y-2">
              {upcomingDepartures.map((trip) => (
                <li key={trip.id}>
                  <Link
                    href={`/admin/trips/${trip.id}`}
                    className={`flex items-start justify-between gap-3 rounded-md border border-[var(--border)] bg-white px-4 py-3 shadow-sm hover:border-[var(--foreground)] ${FOCUS_RING}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[var(--primary)]">{trip.title}</span>
                      <span className="mt-1 block text-sm text-[var(--muted-foreground)]">{trip.location}</span>
                    </span>
                    <span className="whitespace-nowrap rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
                      {trip.nextDeparture}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
