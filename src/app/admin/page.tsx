import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Gauge,
  Inbox,
  LayoutDashboard,
  Mail,
  Plane,
  Plus,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Adventure, AdventureTranslation, TravelService } from "@/lib/adventures";
import { AdminItineraryEditor } from "@/components/admin-itinerary-editor";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";
import type { TeamMember } from "@/lib/site-settings";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/server/admin-auth";
import {
  getAdminDashboardData,
  getBookingCount,
} from "@/lib/server/admin-store";
import {
  deleteServiceAction,
  deleteTeamMemberAction,
  deleteTripAction,
  emailLatestInquiryAction,
  logoutAdminAction,
  refreshAdminAction,
  saveServiceAction,
  saveTeamMemberAction,
  saveTripAction,
  sendAdminEmailAction,
  updateInquiryStatusAction,
} from "./actions";
import { getCustomers } from "@/lib/server/customer-auth";
import { getEmailLogs } from "@/lib/server/mail";
import { getErrorMessage } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

const defaultCategoryLabels: Record<string, string> = {
  business: "Бизнес",
  festival: "Festival",
  leisure: "Амралт",
  custom: "Захиалгат",
};

const navItems = [
  { label: "Ерөнхий", href: "#overview", icon: LayoutDashboard },
  { label: "Бүртгэлүүд", href: "#registrations", icon: Users },
  { label: "Хэрэглэгчид", href: "#customers", icon: UserCheck },
  { label: "Хөтөлбөрүүд", href: "#programs", icon: Plane },
  { label: "Манай баг", href: "#team", icon: Users },
  { label: "Мэйл илгээх", href: "#mail-sender", icon: Mail },
];

const translationLanguages = LANGUAGES.filter(
  (language): language is typeof language & { code: Exclude<CopyLocale, "mn"> } =>
    language.code !== "mn"
);

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const cookieStore = await cookies();
  const admin = verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!admin) {
    redirect("/admin/login");
  }

  const [dashboardData, customersResult, emailLogsResult] =
    await Promise.allSettled([getAdminDashboardData(), getCustomers(), getEmailLogs()]);
  const { trips, services, inquiries, bookingStats } =
    dashboardData.status === "fulfilled"
      ? dashboardData.value
      : {
          trips: [],
          services: [],
          inquiries: [],
          bookingStats: [],
        };
  const customers = customersResult.status === "fulfilled" ? customersResult.value : [];
  const emailLogs = emailLogsResult.status === "fulfilled" ? emailLogsResult.value : [];
  const loadErrors = [dashboardData, customersResult, emailLogsResult]
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) => getErrorMessage(result.reason));
  const categoryOptions = getCategoryOptions(trips);
  const featuredTrips = trips.filter((trip) => trip.featured);
  const teamMembers =
    dashboardData.status === "fulfilled" ? dashboardData.value.siteSettings.teamMembers : [];
  const latestInquiries = inquiries.slice(0, 12);
  const latestCustomers = customers.slice(0, 12);
  const latestEmailLogs = emailLogs.slice(0, 8);
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

            <nav className="mt-10 space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                    index === 0
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              ))}
            </nav>

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
              className="absolute inset-0 bg-[url('/nomadabe-hero-panorama.webp')] bg-cover bg-center opacity-25"
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
                  Nomadabe-ийн аялал, бүртгэл, үйлчилгээ, нүүр хуудасны дизайныг нэг дороос удирдана.
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

            <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <SectionHeader eyebrow="Удирдлага" title="Шинэ аяллын хөтөлбөр нэмэх" action="Хэрэглэгчийн веб дээр харагдана" />
                <TripForm mode="create" categoryOptions={categoryOptions} />

                <section id="team" className="scroll-mt-6 space-y-4">
                  <SectionHeader eyebrow="About" title="Манай хамт олон" action={`Нийт ${teamMembers.length}`} />
                  <TeamMemberForm mode="create" />
                  <div className="grid gap-3 lg:grid-cols-3">
                    {teamMembers.map((member) => (
                      <TeamMemberEditor key={member.id} member={member} />
                    ))}
                  </div>
                </section>

                <section id="mail-sender" className="scroll-mt-6 space-y-4">
                  <SectionHeader eyebrow="Автоматжуулалт" title="Мэйл илгээх" action="Гараар болон автоматаар" />
                  <EmailComposer />
                </section>

                <details className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
                  <summary className="cursor-pointer list-none">
                    <SectionHeader eyebrow="Нэмэлт тохиргоо" title="Үйлчилгээний төрлүүд" action={`Нийт ${services.length}`} />
                    <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--muted-foreground)]">
                      Энэ хэсэг нь аяллын бус, компанийн санал болгодог туслах үйлчилгээний жагсаалт.
                      Жишээ нь бизнес аялал зохион байгуулах, expo дэмжлэг, захиалгат маршрут гэх мэт.
                      Шинэ аялал нэмэхэд энэ хэсгийг бөглөх шаардлагагүй.
                    </p>
                  </summary>
                  <div className="mt-4 space-y-4">
                    <ServiceForm mode="create" />
                    <div className="grid gap-3 lg:grid-cols-2">
                      {services.map((service) => (
                        <ServiceEditor key={service.id} service={service} />
                      ))}
                    </div>
                  </div>
                </details>

                <section id="programs" className="scroll-mt-6 space-y-4">
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
                </section>
              </div>

              <aside className="space-y-6">
                <section className="rounded-md border border-[var(--border)] bg-[var(--primary)] p-5 text-white shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                        Явц
                      </p>
                      <h2 className="mt-2 text-xl font-semibold">Өнөөдрийн тойм</h2>
                    </div>
                    <Gauge className="h-6 w-6 text-[var(--accent)]" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MiniStat label="Нийт хүн" value={inquiries.length} />
                    <MiniStat label="Аяллын хүсэлт" value={bookedPeople} />
                  </div>
                </section>

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
          </div>
        </section>
      </div>
    </main>
  );
}

function ServiceEditor({ service }: { service: TravelService }) {
  return (
    <details className="rounded-md border border-[var(--border)] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <TypePill label="Үйлчилгээ" />
          <h3 className="mt-2 truncate text-base font-semibold text-[var(--primary)]">{service.title}</h3>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">Засах</span>
      </summary>
      <div className="border-t border-[var(--border)] p-4">
        <ServiceForm mode="edit" service={service} />
        <form action={deleteServiceAction} className="mt-3">
          <input type="hidden" name="id" defaultValue={service.id} />
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]"
          >
            <Trash2 className="h-4 w-4" />
            Үйлчилгээ устгах
          </button>
        </form>
      </div>
    </details>
  );
}

function ServiceForm({ mode, service }: { mode: "create" | "edit"; service?: TravelService }) {
  return (
    <form action={saveServiceAction} className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <TextField label="Үйлчилгээний ID" name="id" defaultValue={service?.id} placeholder="business-travel" />
        <TextField label="Гарчиг" name="title" defaultValue={service?.title} required />
        <TextareaField
          label="Тайлбар"
          name="description"
          defaultValue={service?.description}
          rows={3}
          className="lg:col-span-2"
        />
        <TextareaField
          label="Онцлох зүйлс"
          name="highlights"
          defaultValue={service?.highlights.join(", ")}
          rows={2}
          className="lg:col-span-2"
        />
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
      >
        {mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {mode === "create" ? "Үйлчилгээ нэмэх" : "Үйлчилгээ хадгалах"}
      </button>
    </form>
  );
}


function TeamMemberEditor({ member }: { member: TeamMember }) {
  return (
    <details className="rounded-md border border-[var(--border)] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            aria-hidden="true"
            className="h-16 w-12 shrink-0 rounded-md border border-[var(--border)] bg-[var(--muted)] bg-cover bg-center"
            style={member.image ? { backgroundImage: `url('${member.image}')` } : undefined}
          />
          <div className="min-w-0">
            <TypePill label="Багийн гишүүн" />
            <h3 className="mt-2 truncate text-base font-semibold text-[var(--primary)]">
              {member.name}
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-[var(--muted-foreground)]">
              {member.role}
            </p>
            {member.isVisible === false ? (
              <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
                Hidden
              </p>
            ) : null}
          </div>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">Засах</span>
      </summary>
      <div className="border-t border-[var(--border)] p-4">
        <TeamMemberForm mode="edit" member={member} />
        <form action={deleteTeamMemberAction} className="mt-3">
          <input type="hidden" name="id" defaultValue={member.id} />
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]"
          >
            <Trash2 className="h-4 w-4" />
            Багийн гишүүн устгах
          </button>
        </form>
      </div>
    </details>
  );
}

function TeamMemberForm({ mode, member }: { mode: "create" | "edit"; member?: TeamMember }) {
  return (
    <form action={saveTeamMemberAction} className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
      {member ? <input type="hidden" name="id" defaultValue={member.id} /> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <TextField label="Нэр" name="name" defaultValue={member?.name} required />
        <TextField label="Албан тушаал" name="role" defaultValue={member?.role} required />
        <TextField
          label="Зургийн URL"
          name="image"
          defaultValue={member?.image}
          className="lg:col-span-2"
          placeholder="https://..."
        />
        <TextField
          label="Зургийн alt text"
          name="imageAlt"
          defaultValue={member?.imageAlt}
          className="lg:col-span-2"
          placeholder={member?.name ?? "Photo description"}
        />
        <TextField
          label="Дараалал"
          name="order"
          type="number"
          defaultValue={String(member?.order ?? "")}
        />
        <SelectField
          label="Харагдах эсэх"
          name="isVisible"
          defaultValue={String(member?.isVisible ?? true)}
          options={[
            { value: "true", label: "Харагдана" },
            { value: "false", label: "Нууна" },
          ]}
        />
        <TextareaField
          label="Товч тайлбар"
          name="bio"
          defaultValue={member?.bio}
          rows={3}
          className="lg:col-span-2"
        />
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
      >
        {mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {mode === "create" ? "Багийн гишүүн нэмэх" : "Багийн гишүүн хадгалах"}
      </button>
    </form>
  );
}

function ProgramEditor({
  trip,
  bookingCount,
  categoryOptions,
}: {
  trip: Adventure;
  bookingCount: number;
  categoryOptions: CategoryOption[];
}) {
  return (
    <details className="rounded-md border border-[var(--border)] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
        <div className="flex min-w-0 items-center gap-4">
          <div
            aria-hidden="true"
            className="hidden h-20 w-28 shrink-0 rounded-md border border-[var(--border)] bg-cover bg-center sm:block"
            style={{ backgroundImage: `url('${trip.image}')` }}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
            <TypePill label={getCategoryLabel(trip.category)} />
              {trip.featured ? (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Онцолсон
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                <Users className="h-3.5 w-3.5" />
                {bookingCount} бүртгэл
              </span>
            </div>
            <h3 className="mt-2 truncate text-base font-semibold text-[var(--primary)]">{trip.title}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-[var(--muted-foreground)]">{trip.summary}</p>
          </div>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">Засах</span>
      </summary>
      <div className="border-t border-[var(--border)] p-4">
        <TripForm mode="edit" trip={trip} categoryOptions={categoryOptions} />
        <form action={deleteTripAction} className="mt-3">
          <input type="hidden" name="id" defaultValue={trip.id} />
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]"
          >
            <Trash2 className="h-4 w-4" />
            Хөтөлбөр устгах
          </button>
        </form>
      </div>
    </details>
  );
}

function EmailComposer() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <form action={sendAdminEmailAction} className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)]">
            <Send className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-2xl leading-none text-[var(--primary)]">Хэрэглэгч рүү мэйл илгээх</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Resend тохируулсан бол шууд илгээнэ, тохируулаагүй бол дарааллын лог болгож хадгална.
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField label="Хүлээн авагчийн и-мэйл" name="to" type="email" placeholder="customer@example.com" required />
          <TextField label="Гарчиг" name="subject" placeholder="Nomadabe аяллын хүсэлт" required />
          <TextareaField
            label="Зурвас"
            name="body"
            rows={6}
            className="lg:col-span-2"
            placeholder="Хэрэглэгч рүү илгээх зурвасаа бичнэ үү."
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
        >
          <Send className="h-4 w-4" />
          Мэйл илгээх
        </button>
      </form>

      <form action={emailLatestInquiryAction} className="rounded-md border border-[var(--border)] bg-[var(--primary)] p-4 text-white shadow-sm">
        <Mail className="h-6 w-6 text-[var(--accent)]" />
        <h3 className="mt-4 font-display text-2xl leading-none">Хурдан хариу</h3>
        <p className="mt-2 text-sm leading-6 text-white/65">
          И-мэйлтэй хамгийн сүүлийн бүртгэл рүү бэлэн загвар илгээнэ.
        </p>
        <input type="hidden" name="subject" value="Nomadabe Travel таны хүсэлтийг хүлээн авлаа" />
        <input
          type="hidden"
          name="body"
          value="Сайн байна уу, Nomadabe Travel-д хандсанд баярлалаа. Манай баг таны хүсэлтийг хүлээн авсан бөгөөд аяллын дэлгэрэнгүй мэдээллээр удахгүй холбогдоно."
        />
        <button
          type="submit"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-foreground)] hover:bg-[var(--secondary)]"
        >
          <Send className="h-4 w-4" />
          Сүүлийн бүртгэл рүү илгээх
        </button>
      </form>
    </div>
  );
}

type CategoryOption = {
  value: string;
  label: string;
};

function TripForm({
  mode,
  trip,
  categoryOptions,
}: {
  mode: "create" | "edit";
  trip?: Adventure;
  categoryOptions: CategoryOption[];
}) {
  return (
    <form action={saveTripAction} encType="multipart/form-data" className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
      {trip ? <input type="hidden" name="id" defaultValue={trip.id} /> : null}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-base font-black text-[var(--primary)]">
            {mode === "create" ? "Цөөн мэдээллээр аяллаа нэмнэ" : "Гол мэдээллийг засах"}
          </h3>
          <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Нэр, байршил, хугацаа, ангилал, зураг, товч тайлбараа оруулахад хангалттай.
            Үнэ, tag, орчуулга зэрэг нэмэлт мэдээллийг дараа нь эвхэгддэг хэсгээс нөхөж болно.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
        >
          {mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Хөтөлбөр нэмэх" : "Хадгалах"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PosterField trip={trip} className="lg:col-span-3" />
        <SelectField
          label="Ангилал"
          name="category"
          defaultValue={trip?.category ?? "custom"}
          options={categoryOptions}
        />
        <TextField
          label="Аяллын нэр"
          name="title"
          defaultValue={trip?.title}
          placeholder="Говийн аялал"
          required
          className="lg:col-span-2"
        />
      </div>

      <details className="mt-4 rounded-md border border-[var(--border)] bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-black text-[var(--primary)]">Дэлгэрэнгүй мэдээлэл</span>
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Байршил, хугацаа, үнэ, tag, багц</span>
        </summary>
        <div className="grid gap-4 border-t border-[var(--border)] p-4 lg:grid-cols-3">
          <TextField label="Байршил / хот" name="location" defaultValue={trip?.location} placeholder="Өмнөговь" />
          <TextField label="Улс" name="country" defaultValue={trip?.country} placeholder="Mongolia" />
          <TextField label="Хугацаа / өдөр" name="days" type="number" defaultValue={String(trip?.days ?? 5)} />
          <TextField label="Дараагийн явах огноо" name="nextDeparture" type="date" defaultValue={getDateInputValue(trip?.nextDeparture)} />
          <TextareaField label="Хэрэглэгчид харагдах товч тайлбар" name="summary" defaultValue={trip?.summary} rows={3} className="lg:col-span-3" />
          <TextField label="Эсвэл зургийн URL (постер оруулаагүй бол)" name="image" defaultValue={trip?.image} className="lg:col-span-3" />
          <TextField label="Slug" name="slug" defaultValue={trip?.slug} placeholder="gobi-adventure" />
          <TextField label="Шинэ ангилал нэмэх" name="categoryCustom" placeholder="Жишээ: Дотоод аялал" />
          <TextField label="Групп / хэнд зориулсан" name="groupSize" defaultValue={trip?.groupSize ?? "Flexible"} placeholder="Family / Group" />
          <SelectField
            label="Аяллын түвшин"
            name="difficulty"
            defaultValue={trip?.difficulty ?? "Easy"}
            options={[
              { value: "Easy", label: "Хялбар" },
              { value: "Moderate", label: "Дунд" },
              { value: "Challenging", label: "Сорилттой" },
              { value: "Tough", label: "Хүнд" },
            ]}
          />
          <TextField label="Үнэ / 0 бол санал авах" name="price" type="number" defaultValue={String(trip?.price ?? 0)} />
          <TextField label="Валют" name="currency" defaultValue={trip?.currency ?? "MNT"} />
          <TextField label="Тагууд / comma-аар" name="tags" defaultValue={trip?.tags.join(", ")} placeholder="Domestic, Gobi, Nature" />
          <TextField label="Үнэлгээ" name="rating" type="number" step="0.1" defaultValue={String(trip?.rating ?? 4.8)} />
          <TextField label="Сэтгэгдлийн тоо" name="reviews" type="number" defaultValue={String(trip?.reviews ?? 0)} />
          <TextareaField label="Хэнд тохиромжтой / comma-аар" name="idealFor" defaultValue={trip?.idealFor.join(", ")} rows={2} />
          <TextareaField label="Багцад багтах зүйлс / comma-аар" name="includes" defaultValue={trip?.includes.join(", ")} rows={2} />
          <TextareaField label="Бизнес / expo нэмэлт дэмжлэг" name="businessSupport" defaultValue={trip?.businessSupport.join(", ")} rows={2} />
        </div>
      </details>

      <details className="mt-4 rounded-md border border-[var(--border)] bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-black text-[var(--primary)]">Аяллын хөтөлбөр (өдөр / цаг)</span>
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Уян хатан, оруулаагүй бол автоматаар</span>
        </summary>
        <div className="border-t border-[var(--border)] p-4">
          <AdminItineraryEditor defaultValue={trip?.itinerary} />
        </div>
      </details>

      <details className="mt-4 rounded-md border border-[var(--border)] bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-black text-[var(--primary)]">Орчуулга хянах</span>
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Сонголттой</span>
        </summary>
        <div className="space-y-3 border-t border-[var(--border)] p-4">
          <p className="text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Автомат орчуулга энд харагдана. Та засаж хадгалбал дараагийн автомат орчуулга тухайн засварыг дарж бичихгүй.
          </p>
          {translationLanguages.map((language) => (
            <TranslationEditor
              key={language.code}
              locale={language.code}
              label={language.label}
              translation={trip?.translations?.[language.code]}
            />
          ))}
        </div>
      </details>

      <label className="mt-4 flex w-fit items-center gap-2 text-sm font-semibold text-[var(--primary)]">
        <input type="checkbox" name="featured" defaultChecked={trip?.featured ?? false} className="h-4 w-4 accent-[var(--accent)]" />
        Веб дээр онцлох
      </label>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm font-medium text-[var(--muted-foreground)]">
          Хадгалах үед English, 中文, 日本語, 한국어 орчуулга автоматаар үүсэж Supabase-д хадгалагдана.
        </p>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
        >
          {mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Хөтөлбөр нэмэх" : "Өөрчлөлт хадгалах"}
        </button>
      </div>
    </form>
  );
}

function TranslationEditor({
  locale,
  label,
  translation,
}: {
  locale: Exclude<CopyLocale, "mn">;
  label: string;
  translation?: AdventureTranslation;
}) {
  return (
    <details className="rounded-md border border-[var(--border)] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
        <span className="text-sm font-black text-[var(--primary)]">
          {label} ({locale.toUpperCase()})
        </span>
        <span className="text-xs font-semibold text-[var(--muted-foreground)]">
          Засах
        </span>
      </summary>
      <div className="grid gap-4 border-t border-[var(--border)] p-4 lg:grid-cols-3">
        <TextField
          label="Гарчиг"
          name={translationFieldName(locale, "title")}
          defaultValue={translation?.title}
        />
        <TextField
          label="Байршил / хот"
          name={translationFieldName(locale, "location")}
          defaultValue={translation?.location}
        />
        <TextField
          label="Улс"
          name={translationFieldName(locale, "country")}
          defaultValue={translation?.country}
        />
        <TextField
          label="Групп"
          name={translationFieldName(locale, "groupSize")}
          defaultValue={translation?.groupSize}
        />
        <TextField
          label="Түвшин"
          name={translationFieldName(locale, "difficulty")}
          defaultValue={translation?.difficulty}
        />
        <TextField
          label="Тагууд / comma-аар"
          name={translationFieldName(locale, "tags")}
          defaultValue={translation?.tags?.join(", ")}
        />
        <TextareaField
          label="Товч тайлбар"
          name={translationFieldName(locale, "summary")}
          defaultValue={translation?.summary}
          rows={3}
          className="lg:col-span-3"
        />
        <TextareaField
          label="Хэнд тохиромжтой / comma-аар"
          name={translationFieldName(locale, "idealFor")}
          defaultValue={translation?.idealFor?.join(", ")}
          rows={2}
        />
        <TextareaField
          label="Багцад багтах зүйлс / comma-аар"
          name={translationFieldName(locale, "includes")}
          defaultValue={translation?.includes?.join(", ")}
          rows={2}
        />
        <TextareaField
          label="Бизнес / expo дэмжлэг"
          name={translationFieldName(locale, "businessSupport")}
          defaultValue={translation?.businessSupport?.join(", ")}
          rows={2}
        />
      </div>
    </details>
  );
}

function getDateInputValue(value?: string) {
  if (!value) {
    return undefined;
  }

  if (/^\d{4}-\d{2}$/.test(value)) {
    return `${value}-01`;
  }

  return value;
}

function translationFieldName(locale: Exclude<CopyLocale, "mn">, key: keyof AdventureTranslation) {
  return `translation_${locale}_${key}`;
}

function getCategoryOptions(trips: Adventure[]): CategoryOption[] {
  const categories = new Map<string, string>();

  for (const [value, label] of Object.entries(defaultCategoryLabels)) {
    categories.set(value, label);
  }

  for (const trip of trips) {
    categories.set(trip.category, getCategoryLabel(trip.category));
  }

  return Array.from(categories, ([value, label]) => ({ value, label }));
}

function getCategoryLabel(category: string) {
  return defaultCategoryLabels[category] ?? category;
}

function TextField({
  label,
  name,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{label}</span>
      <input
        name={name}
        className="mt-2 h-10 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
        {...props}
      />
    </label>
  );
}

function PosterField({ trip, className }: { trip?: Adventure; className?: string }) {
  return (
    <div className={`block ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        Постер зураг
      </span>
      <div className="mt-2 flex flex-col gap-3 rounded-md border border-dashed border-[var(--border)] bg-white p-4 sm:flex-row sm:items-center">
        {trip?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trip.image}
            alt={trip.title ? `${trip.title} постер` : "Одоогийн постер"}
            className="h-24 w-24 shrink-0 rounded-md object-cover ring-1 ring-[var(--border)]"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)]">
            Постер алга
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            name="poster"
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
            className="block w-full text-sm text-[var(--foreground)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--foreground)]"
          />
          <p className="mt-2 text-xs font-medium leading-5 text-[var(--muted-foreground)]">
            Зургаа сонгоно уу (JPG, PNG, WEBP — 8MB хүртэл). Постер оруулбал доорх URL-г дарж бичнэ.
            {trip ? " Шинэ зураг оруулаагүй бол одоогийн постер хэвээр үлдэнэ." : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function TextareaField({
  label,
  name,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{label}</span>
      <textarea
        name={name}
        className="mt-2 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
        {...props}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 h-10 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MetricCard({
  href,
  icon: Icon,
  label,
  value,
  detail,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: number;
  detail: string;
  tone: "orange" | "green" | "blue" | "slate";
}) {
  return (
    <a
      href={href}
      aria-label={`${label} хэсэг рүү очих`}
      className="block rounded-md border border-[var(--border)] bg-white p-4 shadow-sm transition-colors hover:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/35"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-[var(--muted-foreground)]">{label}</div>
          <div className="mt-2 font-display text-4xl leading-none text-[var(--primary)]">{value}</div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted-foreground)]">{detail}</div>
    </a>
  );
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--foreground)]">{eyebrow}</p>
        <h2 className="mt-1 font-display text-3xl leading-none text-[var(--primary)]">{title}</h2>
      </div>
      <span className="text-sm font-medium text-[var(--muted-foreground)]">{action}</span>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-2xl leading-none text-[var(--primary)]">{title}</h2>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-[var(--border)] bg-white p-8 text-center shadow-sm">
      <Inbox className="mx-auto h-8 w-8 text-[var(--foreground)]" />
      <h3 className="mt-3 text-base font-semibold text-[var(--primary)]">Одоогоор бүртгэл алга</h3>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">Вебээс ирэх шинэ бүртгэлүүд энд харагдана.</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white/10 p-3">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-[var(--border)]">{label}</div>
    </div>
  );
}

function TypePill({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
      {label}
    </span>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit rounded-md bg-[var(--accent)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent-foreground)]">
      {label}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRelativeDate(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (diffMinutes < 1) {
    return "Дөнгөж сая";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} минутын өмнө`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} цагийн өмнө`;
  }

  return formatDate(value);
}

function formatStatusLabel(value: string) {
  const labels: Record<string, string> = {
    new: "Шинэ",
    contacted: "Холбогдсон",
    confirmed: "Баталгаажсан",
    closed: "Хаагдсан",
    sent: "Илгээгдсэн",
    queued: "Дараалалд",
    failed: "Амжилтгүй",
    trip: "Аялал",
    business: "Бизнес",
    festival: "Festival",
    expo: "Экспо",
    custom: "Захиалгат",
    general: "Ерөнхий",
    leisure: "Амралт",
  };

  return labels[value] ?? value;
}
