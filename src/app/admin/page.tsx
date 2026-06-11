import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Inbox,
  LayoutDashboard,
  Palette,
  Plane,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AdminVisualEditor } from "@/components/admin-visual-editor";
import type { Adventure, TravelService } from "@/lib/adventures";
import {
  getAdminDashboardData,
  getBookingCount,
} from "@/lib/server/admin-store";
import {
  deleteServiceAction,
  deleteTripAction,
  saveServiceAction,
  saveTripAction,
  updateInquiryStatusAction,
} from "./actions";

export const dynamic = "force-dynamic";

const categoryLabels = {
  business: "Business",
  expo: "Expo",
  leisure: "Leisure",
  custom: "Custom",
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Registrations", icon: Users },
  { label: "Programs", icon: Plane },
  { label: "Visual editor", icon: Palette },
];

export default async function AdminDashboard() {
  const { trips, services, siteSettings, inquiries, bookingStats } = await getAdminDashboardData();
  const featuredTrips = trips.filter((trip) => trip.featured);
  const latestInquiries = inquiries.slice(0, 12);
  const upcomingDepartures = trips
    .filter((trip) => trip.nextDeparture)
    .sort((left, right) => String(left.nextDeparture).localeCompare(String(right.nextDeparture)));
  const lastInquiry = inquiries[0]?.createdAt ? formatRelativeDate(inquiries[0].createdAt) : "No activity";
  const bookedPeople = inquiries.filter((inquiry) => inquiry.tripSlug).length;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1560px] lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-[var(--border)] bg-[var(--primary)] text-white lg:block">
          <div className="flex h-full min-h-screen flex-col px-5 py-6">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="h-12 w-12 rounded-md bg-black bg-[url('/nomadabe-mark.png')] bg-center bg-no-repeat shadow-sm ring-1 ring-white/15 [background-position:center_35%] [background-size:175%]"
              />
              <div>
                <div className="text-xl font-black leading-none text-[var(--accent)]">
                  Nomadabe
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/75">Admin</div>
              </div>
            </div>

            <nav className="mt-10 space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={`#${item.label.toLowerCase().replace(" ", "-")}`}
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
                Protected
              </div>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Program management, registration lists and site edits are protected.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header id="overview" className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--primary)] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[url('/nomadabe-hero-panorama.png')] bg-cover bg-center opacity-25"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/35 via-[var(--primary)]/85 to-[var(--primary)]" />
            <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                  <span>Admin dashboard</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  <span>Last registration: {lastInquiry}</span>
                </div>
                <h1 className="mt-2 max-w-3xl font-display text-4xl leading-none text-balance sm:text-5xl lg:text-6xl">
                  Website control center
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                  Manage Nomadabe trips, registrations, services and homepage visuals from one focused workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-3 text-sm font-semibold text-[var(--accent-foreground)] transition-colors hover:bg-[var(--secondary)]"
                >
                  View site
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </header>

          <div className="space-y-8 px-5 py-6 sm:px-8 lg:px-10">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard icon={Inbox} label="Total registrations" value={inquiries.length} detail={lastInquiry} tone="orange" />
              <MetricCard icon={Users} label="Program bookings" value={bookedPeople} detail="Trip-specific requests" tone="green" />
              <MetricCard icon={Plane} label="Programs" value={trips.length} detail={`${featuredTrips.length} featured`} tone="blue" />
              <MetricCard icon={CalendarDays} label="Departures" value={upcomingDepartures.length} detail="Scheduled programs" tone="slate" />
              <MetricCard icon={ClipboardList} label="Services" value={services.length} detail="Service categories" tone="orange" />
            </section>

            <section id="visual-editor" className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <SectionHeader eyebrow="Website" title="Visual editor" action="Hero content" />
                <AdminVisualEditor settings={siteSettings} />

                <SectionHeader eyebrow="Management" title="Add new program" action="Appears on website" />
                <TripForm mode="create" />

                <SectionHeader eyebrow="Services" title="Manage services" action={`${services.length} total`} />
                <ServiceForm mode="create" />
                <div className="grid gap-3 lg:grid-cols-2">
                  {services.map((service) => (
                    <ServiceEditor key={service.id} service={service} />
                  ))}
                </div>

                <SectionHeader eyebrow="Programs" title="Edit programs" action={`${trips.length} total`} />
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <ProgramEditor
                      key={trip.id}
                      trip={trip}
                      bookingCount={getBookingCount(bookingStats, trip.slug)}
                    />
                  ))}
                </div>
              </div>

              <aside className="space-y-6">
                <section className="rounded-md border border-[var(--border)] bg-[var(--primary)] p-5 text-white shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                        Pipeline
                      </p>
                      <h2 className="mt-2 text-xl font-semibold">Today at a glance</h2>
                    </div>
                    <Gauge className="h-6 w-6 text-[var(--accent)]" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MiniStat label="All people" value={inquiries.length} />
                    <MiniStat label="Booked trips" value={bookedPeople} />
                  </div>
                </section>

                <SidebarSection title="Bookings by program">
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

                <SidebarSection title="Upcoming departures">
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

            <section id="registrations" className="space-y-4">
              <SectionHeader eyebrow="CRM" title="Registered people" action={`${latestInquiries.length} visible`} />
              {latestInquiries.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                      <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Person</th>
                          <th className="px-5 py-3 font-semibold">Request</th>
                          <th className="px-5 py-3 font-semibold">Program</th>
                          <th className="px-5 py-3 font-semibold">Received</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {latestInquiries.map((inquiry) => (
                          <tr key={inquiry.id} className="bg-white align-top hover:bg-[var(--background)]">
                            <td className="px-5 py-4">
                              <div className="font-semibold text-[var(--primary)]">{inquiry.name}</div>
                              <div className="mt-1 text-[var(--muted-foreground)]">{inquiry.email}</div>
                              {inquiry.phone ? <div className="mt-1 text-[var(--muted-foreground)]">{inquiry.phone}</div> : null}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <TypePill label={inquiry.inquiryType} />
                                {inquiry.travelers ? <span className="text-[var(--muted-foreground)]">{inquiry.travelers} pax</span> : null}
                              </div>
                              <p className="mt-2 max-w-sm text-[var(--foreground)]">{inquiry.message}</p>
                            </td>
                            <td className="px-5 py-4 text-[var(--muted-foreground)]">{inquiry.tripSlug ?? "General"}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-[var(--muted-foreground)]">{formatDate(inquiry.createdAt)}</td>
                            <td className="px-5 py-4">
                              <form action={updateInquiryStatusAction} className="flex items-center gap-2">
                                <input type="hidden" name="id" defaultValue={inquiry.id} />
                                <select
                                  name="status"
                                  defaultValue={inquiry.status}
                                  className="h-9 rounded-md border border-[var(--border)] bg-white px-2 text-xs font-semibold text-[var(--primary)]"
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="closed">Closed</option>
                                </select>
                                <button
                                  type="submit"
                                  className="inline-flex h-9 items-center rounded-md bg-[var(--primary)] px-3 text-xs font-semibold text-white"
                                >
                                  Save
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
          <TypePill label="Service" />
          <h3 className="mt-2 truncate text-base font-semibold text-[var(--primary)]">{service.title}</h3>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">Edit</span>
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
            Delete service
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
        <TextField label="Service ID" name="id" defaultValue={service?.id} placeholder="business-travel" />
        <TextField label="Title" name="title" defaultValue={service?.title} required />
        <TextareaField
          label="Description"
          name="description"
          defaultValue={service?.description}
          rows={3}
          className="lg:col-span-2"
        />
        <TextareaField
          label="Highlights"
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
        {mode === "create" ? "Add service" : "Save service"}
      </button>
    </form>
  );
}

function ProgramEditor({ trip, bookingCount }: { trip: Adventure; bookingCount: number }) {
  return (
    <details className="rounded-md border border-[var(--border)] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <TypePill label={categoryLabels[trip.category]} />
            {trip.featured ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Featured
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
              <Users className="h-3.5 w-3.5" />
              {bookingCount} bookings
            </span>
          </div>
          <h3 className="mt-2 truncate text-base font-semibold text-[var(--primary)]">{trip.title}</h3>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">Edit</span>
      </summary>
      <div className="border-t border-[var(--border)] p-4">
        <TripForm mode="edit" trip={trip} />
        <form action={deleteTripAction} className="mt-3">
          <input type="hidden" name="id" defaultValue={trip.id} />
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]"
          >
            <Trash2 className="h-4 w-4" />
            Delete program
          </button>
        </form>
      </div>
    </details>
  );
}

function TripForm({ mode, trip }: { mode: "create" | "edit"; trip?: Adventure }) {
  return (
    <form action={saveTripAction} className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
      {trip ? <input type="hidden" name="id" defaultValue={trip.id} /> : null}
      <div className="grid gap-4 lg:grid-cols-3">
        <TextField label="Title" name="title" defaultValue={trip?.title} required />
        <TextField label="Slug" name="slug" defaultValue={trip?.slug} placeholder="custom-business-trip" />
        <SelectField label="Category" name="category" defaultValue={trip?.category ?? "custom"} options={["business", "expo", "leisure", "custom"]} />
        <TextField label="Location" name="location" defaultValue={trip?.location} />
        <TextField label="Country" name="country" defaultValue={trip?.country} />
        <TextField label="Days" name="days" type="number" defaultValue={String(trip?.days ?? 5)} />
        <TextField label="Group size" name="groupSize" defaultValue={trip?.groupSize ?? "Flexible"} />
        <SelectField label="Difficulty" name="difficulty" defaultValue={trip?.difficulty ?? "Easy"} options={["Easy", "Moderate", "Challenging", "Tough"]} />
        <TextField label="Next departure" name="nextDeparture" defaultValue={trip?.nextDeparture} placeholder="2026-10" />
        <TextField label="Price" name="price" type="number" defaultValue={String(trip?.price ?? 0)} />
        <TextField label="Currency" name="currency" defaultValue={trip?.currency ?? "MNT"} />
        <TextField label="Seats left" name="seatsLeft" type="number" defaultValue={trip?.seatsLeft ? String(trip.seatsLeft) : ""} />
        <TextField label="Image URL" name="image" defaultValue={trip?.image} className="lg:col-span-3" />
        <TextField label="Tags" name="tags" defaultValue={trip?.tags.join(", ")} placeholder="Expo, Import, Business" />
        <TextField label="Rating" name="rating" type="number" step="0.1" defaultValue={String(trip?.rating ?? 4.8)} />
        <TextField label="Reviews" name="reviews" type="number" defaultValue={String(trip?.reviews ?? 0)} />
        <TextareaField label="Summary" name="summary" defaultValue={trip?.summary} rows={3} className="lg:col-span-3" />
        <TextareaField label="Ideal for" name="idealFor" defaultValue={trip?.idealFor.join(", ")} rows={2} />
        <TextareaField label="Includes" name="includes" defaultValue={trip?.includes.join(", ")} rows={2} />
        <TextareaField label="Business support" name="businessSupport" defaultValue={trip?.businessSupport.join(", ")} rows={2} />
      </div>
      <label className="mt-4 flex w-fit items-center gap-2 text-sm font-semibold text-[var(--primary)]">
        <input type="checkbox" name="featured" defaultChecked={trip?.featured ?? false} className="h-4 w-4 accent-[var(--accent)]" />
        Featured on website
      </label>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
        >
          {mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Add program" : "Save changes"}
        </button>
      </div>
    </form>
  );
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
  options: string[];
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
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  detail: string;
  tone: "orange" | "green" | "blue" | "slate";
}) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm transition-colors hover:border-[var(--accent)]">
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
    </div>
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
      <h3 className="mt-3 text-base font-semibold text-[var(--primary)]">No registrations yet</h3>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">New website registrations will appear here.</p>
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
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
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  return formatDate(value);
}
