import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Inbox,
  Mail,
  Plane,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Users,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isApprovedReview } from "@/lib/site-settings";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/server/admin-auth";
import { getAdminDashboardData, getBookingCount } from "@/lib/server/admin-store";
import { getCustomers } from "@/lib/server/customer-auth";
import { getEmailLogs } from "@/lib/server/mail";
import { getErrorMessage } from "@/lib/server/supabase-rest";
import {
  logoutAdminAction,
  refreshAdminAction,
  updateInquiryStatusAction,
} from "./actions";
import { AdminNav } from "./_components/admin-nav";
import { EmailComposer } from "./_components/email-composer";
import { LandingVideoSettingsForm } from "./_components/landing-video-settings-form";
import { ProgramEditor } from "./_components/program-editor";
import { ReviewCard } from "./_components/review-card";
import { ServiceForm, ServiceRow } from "./_components/service-editor";
import { TeamMemberForm, TeamMemberRow } from "./_components/team-editor";
import { TripForm } from "./_components/trip-form";
import {
  EmptyState,
  MetricCard,
  SectionHeader,
  SidebarSection,
  StatusPill,
  TypePill,
} from "./_components/primitives";
import {
  formatDate,
  formatRelativeDate,
  formatStatusLabel,
  getCategoryOptions,
} from "./_components/format";

export const dynamic = "force-dynamic";




export default async function AdminDashboard({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const cookieStore = await cookies();
  const admin = await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!admin) {
    redirect("/admin/login");
  }

  const [dashboardData, customersResult, emailLogsResult] =
    await Promise.allSettled([getAdminDashboardData(), getCustomers(), getEmailLogs()]);
  const { trips, services, inquiries, bookingStats, siteSettings, reviews } =
    dashboardData.status === "fulfilled"
      ? dashboardData.value
      : {
          trips: [],
          services: [],
          inquiries: [],
          bookingStats: [],
          siteSettings: null,
          reviews: [],
        };
  const customers = customersResult.status === "fulfilled" ? customersResult.value : [];
  const emailLogs = emailLogsResult.status === "fulfilled" ? emailLogsResult.value : [];
  const loadErrors = [dashboardData, customersResult, emailLogsResult]
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) => getErrorMessage(result.reason));
  const categoryOptions = getCategoryOptions(trips);
  const featuredTrips = trips.filter((trip) => trip.featured);
  const latestInquiries = inquiries.slice(0, 12);
  const latestCustomers = customers.slice(0, 12);
  const latestEmailLogs = emailLogs.slice(0, 8);
  const teamMembers = siteSettings?.teamMembers ?? [];
  const allReviews = reviews;
  const pendingReviews = allReviews.filter((review) => !isApprovedReview(review));
  const approvedReviews = allReviews.filter(isApprovedReview);
  const upcomingDepartures = trips
    .filter((trip) => trip.nextDeparture)
    .sort((left, right) => String(left.nextDeparture).localeCompare(String(right.nextDeparture)));
  const lastInquiry = inquiries[0]?.createdAt ? formatRelativeDate(inquiries[0].createdAt) : "Идэвх байхгүй";
  const bookedPeople = inquiries.filter((inquiry) => inquiry.tripSlug).length;
  const statusMessage = (await searchParams)?.status;
  const statusIsError = statusMessage?.startsWith("Алдаа") ?? false;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1560px] lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-[var(--border)] bg-[var(--primary)] text-white lg:block">
          <div className="flex h-full min-h-screen flex-col px-5 py-6">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="h-12 w-12 rounded-md bg-black bg-[url('/nomadabe-mark.webp')] bg-center bg-no-repeat shadow-sm ring-1 ring-white/15 [background-position:center_35%] [background-size:175%]"
              />
              <div>
                <div className="text-xl font-black leading-none text-[var(--accent)]">
                  Nomadabe
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/75">Админ</div>
              </div>
            </div>

            <AdminNav />

            <div className="mt-auto rounded-md border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
                Хамгаалагдсан
              </div>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {admin?.email ?? "Админ"} эрхээр нэвтэрсэн. Хөтөлбөр, бүртгэл,
                вебийн засварын хэсэг нэвтрэлтээр хамгаалагдсан.
              </p>
              <form action={logoutAdminAction} className="mt-4">
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                >
                  <LogOut className="h-4 w-4" />
                  Гарах
                </button>
              </form>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header id="overview" className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--primary)] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[url('/hero-autumn.webp')] bg-cover bg-center opacity-25"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/35 via-[var(--primary)]/85 to-[var(--primary)]" />
            <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                  <span>Админ самбар</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  <span>Сүүлийн бүртгэл: {lastInquiry}</span>
                </div>
                <h1 className="mt-2 max-w-3xl font-display text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl">
                  Веб удирдлагын төв
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                  Nomadabe-ийн хөтөлбөр, бүртгэл, хэрэглэгчийн мэдээлэл, мэйлийн ажлыг нэг дороос удирдана.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <form action={logoutAdminAction}>
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                  >
                    <LogOut className="h-4 w-4" />
                    Гарах
                  </button>
                </form>
                <form action={refreshAdminAction}>
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Шинэчлэх
                  </button>
                </form>
                <Link
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-3 text-sm font-semibold text-[var(--accent-foreground)] transition-colors hover:bg-[var(--secondary)]"
                >
                  Веб харах
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </header>

          <div className="space-y-8 px-5 py-6 sm:px-8 lg:px-10">
            {statusMessage ? (
              <div
                className={`sticky top-3 z-30 flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-bold shadow-lg ${
                  statusIsError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {statusIsError ? (
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            ) : null}

            {loadErrors.length > 0 ? (
              <div className="rounded-md border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--muted)] shadow-sm">
                Зарим админ дата уншигдсангүй: {loadErrors[0]}
              </div>
            ) : null}

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              <MetricCard href="#registrations" icon={Inbox} label="Нийт бүртгэл" value={inquiries.length} detail={lastInquiry} tone="orange" />
              <MetricCard href="#registrations" icon={Users} label="Аяллын хүсэлт" value={bookedPeople} detail="Хөтөлбөртэй холбоотой хүсэлт" tone="green" />
              <MetricCard href="#customers" icon={UserCheck} label="Хэрэглэгчид" value={customers.length} detail="Баталгаажсан нэвтрэлт" tone="slate" />
              <MetricCard href="#programs" icon={Plane} label="Хөтөлбөрүүд" value={trips.length} detail={`${featuredTrips.length} онцолсон`} tone="blue" />
              <MetricCard href="#programs" icon={CalendarDays} label="Явах огноо" value={upcomingDepartures.length} detail="Товлогдсон аяллууд" tone="slate" />
              <MetricCard href="#mail-sender" icon={Mail} label="Мэйл" value={emailLogs.length} detail="Илгээсэн эсвэл дараалалд" tone="orange" />
            </section>

            <section id="registrations" className="scroll-mt-6 space-y-4">
              <SectionHeader eyebrow="CRM" title="Бүртгүүлсэн хүмүүс" action={`${latestInquiries.length} харагдана`} />
              {latestInquiries.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                      <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Хүн</th>
                          <th className="px-5 py-3 font-semibold">Хүсэлт</th>
                          <th className="px-5 py-3 font-semibold">Хөтөлбөр</th>
                          <th className="px-5 py-3 font-semibold">Ирсэн огноо</th>
                          <th className="px-5 py-3 font-semibold">Төлөв</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {latestInquiries.map((inquiry) => (
                          <tr key={inquiry.id} className="bg-white align-top hover:bg-[var(--background)]">
                            <td className="px-5 py-4">
                              <div className="font-semibold text-[var(--primary)]">{inquiry.name}</div>
                              <div className="mt-1 text-[var(--muted-foreground)]">{inquiry.email}</div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <TypePill label={formatStatusLabel(inquiry.inquiryType)} />
                                {inquiry.travelers ? <span className="text-[var(--muted-foreground)]">{inquiry.travelers} хүн</span> : null}
                              </div>
                              <p className="mt-2 max-w-sm text-[var(--foreground)]">{inquiry.message}</p>
                            </td>
                            <td className="px-5 py-4 text-[var(--muted-foreground)]">{inquiry.tripSlug ?? "Ерөнхий"}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-[var(--muted-foreground)]">{formatDate(inquiry.createdAt)}</td>
                            <td className="px-5 py-4">
                              <form action={updateInquiryStatusAction} className="flex items-center gap-2">
                                <input type="hidden" name="id" defaultValue={inquiry.id} />
                                <select
                                  name="status"
                                  defaultValue={inquiry.status}
                                  className="h-9 rounded-md border border-[var(--border)] bg-white px-2 text-xs font-semibold text-[var(--primary)]"
                                >
                                  <option value="new">Шинэ</option>
                                  <option value="contacted">Холбогдсон</option>
                                  <option value="confirmed">Баталгаажсан</option>
                                  <option value="closed">Хаагдсан</option>
                                </select>
                                <button
                                  type="submit"
                                  className="inline-flex h-9 items-center rounded-md bg-[var(--primary)] px-3 text-xs font-semibold text-white"
                                >
                                  Хадгалах
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            <section id="customers" className="scroll-mt-6 space-y-4">
              <SectionHeader eyebrow="Аккаунт" title="Хэрэглэгчийн бүртгэл" action={`${latestCustomers.length} харагдана`} />
              {latestCustomers.length === 0 ? (
                <div className="rounded-md border border-dashed border-[var(--border)] bg-white p-8 text-center shadow-sm">
                  <UserCheck className="mx-auto h-8 w-8 text-[var(--accent-foreground)]" />
                  <h3 className="mt-3 text-base font-semibold text-[var(--primary)]">Баталгаажсан хэрэглэгч алга</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Хэрэглэгч и-мэйл эсвэл утасны кодоо баталгаажуулсны дараа энд харагдана.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {latestCustomers.map((customer) => (
                    <div key={customer.id} className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[var(--primary)]">
                            {customer.email || "Хэрэглэгч"}
                          </h3>
                          <p className="mt-1 text-xs text-[var(--muted-foreground)]">ID: {customer.id.slice(0, 8)}</p>
                        </div>
                        <StatusPill label="баталгаажсан" />
                      </div>
                      <div className="mt-4 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted-foreground)]">
                        Шинэчлэгдсэн: {formatDate(customer.updatedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section id="reviews" className="scroll-mt-6 space-y-4">
              <SectionHeader
                eyebrow="Модерац"
                title="Сэтгэгдэл хянах"
                action={`${pendingReviews.length} хүлээгдэж байна`}
              />
              <p className="text-sm text-[var(--muted-foreground)]">
                Сайтад сэтгэгдэл нэвтрэлтгүйгээр илгээгддэг тул та зөвшөөрөх хүртэл
                нүүр хуудсанд харагдахгүй.
              </p>

              {allReviews.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-6">
                  {pendingReviews.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                        Хүлээгдэж буй
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {pendingReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {approvedReviews.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                        Нийтлэгдсэн
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {approvedReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </section>

            <section id="programs" className="scroll-mt-6 space-y-4">
              <SectionHeader eyebrow="Удирдлага" title="Шинэ аяллын хөтөлбөр нэмэх" action="Хэрэглэгчийн веб дээр харагдана" />
              <TripForm mode="create" categoryOptions={categoryOptions} />

              <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                <div className="space-y-4">
                <SectionHeader eyebrow="Хөтөлбөрүүд" title="Хөтөлбөр засварлах" action={`Нийт ${trips.length}`} />
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <ProgramEditor
                      key={trip.id}
                      trip={trip}
                      bookingCount={getBookingCount(bookingStats, trip.slug)}
                      categoryOptions={categoryOptions}
                    />
                  ))}
                </div>
                </div>

                <aside className="space-y-6">
              <SidebarSection title="Хөтөлбөрөөр бүртгэл">
                <div className="space-y-2">
                  {trips.map((trip) => (
                    <div key={trip.id} className="rounded-md border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">{trip.title}</h3>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{trip.location}</p>
                        </div>
                        <span className="rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
                          {getBookingCount(bookingStats, trip.slug)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SidebarSection>
              <SidebarSection title="Ойрын аяллууд">
                <div className="space-y-2">
                  {upcomingDepartures.map((trip) => (
                    <div key={trip.id} className="rounded-md border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">{trip.title}</h3>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{trip.location}</p>
                        </div>
                        <span className="whitespace-nowrap rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
                          {trip.nextDeparture}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SidebarSection>
                </aside>
              </div>
            </section>

            <section id="team-services" className="scroll-mt-6 space-y-4">
              <SectionHeader
                eyebrow="Танилцуулга"
                title="Баг ба үйлчилгээ"
                action={`${teamMembers.length} гишүүн · ${services.length} үйлчилгээ`}
              />

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                    Багийн гишүүд — /about хуудсанд харагдана
                  </h3>
                  <TeamMemberForm />
                  {teamMembers.map((member) => (
                    <TeamMemberRow key={member.id} member={member} />
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                    Үйлчилгээнүүд
                  </h3>
                  <ServiceForm />
                  {services.map((service) => (
                    <ServiceRow key={service.id} service={service} />
                  ))}
                </div>
              </div>
            </section>

            {siteSettings ? (
              <section id="web-settings" className="scroll-mt-6 space-y-4">
                <SectionHeader
                  eyebrow="Веб тохиргоо"
                  title="Landing page бичлэгүүд"
                  action="Нүүр хэсэгт шууд нөлөөлнө"
                />
                <LandingVideoSettingsForm settings={siteSettings} />
              </section>
            ) : null}

            <section id="mail-sender" className="scroll-mt-6 space-y-4">
              <SectionHeader eyebrow="Автоматжуулалт" title="Мэйл илгээх" action="Гараар болон автоматаар" />
              <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                <EmailComposer />
              <SidebarSection title="Мэйлийн түүх">
                <div className="space-y-2">
                  {latestEmailLogs.length === 0 ? (
                    <div className="rounded-md border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted-foreground)] shadow-sm">
                      Одоогоор мэйл байхгүй
                    </div>
                  ) : (
                    latestEmailLogs.map((log) => (
                      <div key={log.id} className="rounded-md border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">{log.subject}</h3>
                            <p className="mt-1 truncate text-sm text-[var(--muted-foreground)]">{log.to}</p>
                          </div>
                          <StatusPill label={formatStatusLabel(log.status)} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </SidebarSection>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
