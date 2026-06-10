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
  Sparkles,
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
    <main className="min-h-screen bg-[#f6f2ea] text-[#121815]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1560px] lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-[#ded7ca] bg-[#101915] text-white lg:block">
          <div className="flex h-full min-h-screen flex-col px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e85d2c]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f6b79f]">
                  Nomadabe
                </div>
                <div className="text-lg font-semibold">Admin</div>
              </div>
            </div>

            <nav className="mt-10 space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={`#${item.label.toLowerCase().replace(" ", "-")}`}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                    index === 0
                      ? "bg-white text-[#101915]"
                      : "text-[#d9d2c3] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto rounded-md border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-[#f6b79f]" />
                Protected
              </div>
              <p className="mt-2 text-sm leading-6 text-[#d9d2c3]">
                Program management, registration lists and site edits are protected.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header id="overview" className="border-b border-[#ded7ca] bg-white/90 px-5 py-5 backdrop-blur sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#5c5c56]">
                  <span>Admin dashboard</span>
                  <span className="h-1 w-1 rounded-full bg-[#c7beac]" />
                  <span>Last registration: {lastInquiry}</span>
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#0f1a17] sm:text-4xl">
                  Website control center
                </h1>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d9d2c3] bg-white px-3 text-sm font-semibold text-[#0f1a17] hover:border-[#bfb5a3]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-[#0f1a17] px-3 text-sm font-semibold text-white hover:bg-[#22312b]"
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
                <section className="rounded-md border border-[#ded7ca] bg-[#0f1a17] p-5 text-white shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f6b79f]">
                        Pipeline
                      </p>
                      <h2 className="mt-2 text-xl font-semibold">Today at a glance</h2>
                    </div>
                    <Gauge className="h-6 w-6 text-[#f6b79f]" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MiniStat label="All people" value={inquiries.length} />
                    <MiniStat label="Booked trips" value={bookedPeople} />
                  </div>
                </section>

                <SidebarSection title="Bookings by program">
                  <div className="space-y-2">
                    {trips.map((trip) => (
                      <div key={trip.id} className="rounded-md border border-[#ded7ca] bg-white px-4 py-3 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">{trip.title}</h3>
                            <p className="mt-1 text-sm text-[#5c5c56]">{trip.location}</p>
                          </div>
                          <span className="rounded-md bg-[#e8f0eb] px-2 py-1 text-xs font-semibold text-[#2d5f4e]">
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
                      <div key={trip.id} className="rounded-md border border-[#ded7ca] bg-white px-4 py-3 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">{trip.title}</h3>
                            <p className="mt-1 text-sm text-[#5c5c56]">{trip.location}</p>
                          </div>
                          <span className="whitespace-nowrap rounded-md bg-[#fff3ed] px-2 py-1 text-xs font-semibold text-[#c34a21]">
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
                <div className="overflow-hidden rounded-md border border-[#ded7ca] bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                      <thead className="border-b border-[#ded7ca] bg-[#f9f6f0] text-xs uppercase tracking-[0.12em] text-[#706b62]">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Person</th>
                          <th className="px-5 py-3 font-semibold">Request</th>
                          <th className="px-5 py-3 font-semibold">Program</th>
                          <th className="px-5 py-3 font-semibold">Received</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eee7dc]">
                        {latestInquiries.map((inquiry) => (
                          <tr key={inquiry.id} className="bg-white align-top hover:bg-[#fbfaf7]">
                            <td className="px-5 py-4">
                              <div className="font-semibold text-[#0f1a17]">{inquiry.name}</div>
                              <div className="mt-1 text-[#5c5c56]">{inquiry.email}</div>
                              {inquiry.phone ? <div className="mt-1 text-[#5c5c56]">{inquiry.phone}</div> : null}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <TypePill label={inquiry.inquiryType} />
                                {inquiry.travelers ? <span className="text-[#5c5c56]">{inquiry.travelers} pax</span> : null}
                              </div>
                              <p className="mt-2 max-w-sm text-[#3e4641]">{inquiry.message}</p>
                            </td>
                            <td className="px-5 py-4 text-[#5c5c56]">{inquiry.tripSlug ?? "General"}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-[#5c5c56]">{formatDate(inquiry.createdAt)}</td>
                            <td className="px-5 py-4">
                              <form action={updateInquiryStatusAction} className="flex items-center gap-2">
                                <input type="hidden" name="id" defaultValue={inquiry.id} />
                                <select
                                  name="status"
                                  defaultValue={inquiry.status}
                                  className="h-9 rounded-md border border-[#d9d2c3] bg-white px-2 text-xs font-semibold text-[#0f1a17]"
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="closed">Closed</option>
                                </select>
                                <button
                                  type="submit"
                                  className="inline-flex h-9 items-center rounded-md bg-[#0f1a17] px-3 text-xs font-semibold text-white"
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
    <details className="rounded-md border border-[#ded7ca] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <TypePill label="Service" />
          <h3 className="mt-2 truncate text-base font-semibold text-[#0f1a17]">{service.title}</h3>
        </div>
        <span className="text-sm text-[#5c5c56]">Edit</span>
      </summary>
      <div className="border-t border-[#eee7dc] p-4">
        <ServiceForm mode="edit" service={service} />
        <form action={deleteServiceAction} className="mt-3">
          <input type="hidden" name="id" defaultValue={service.id} />
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#e4b7a5] bg-[#fff3ed] px-4 text-sm font-semibold text-[#c34a21] hover:border-[#c34a21]"
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
    <form action={saveServiceAction} className="rounded-md border border-[#ded7ca] bg-[#fbfaf7] p-4">
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
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[#0f1a17] px-4 text-sm font-semibold text-white hover:bg-[#22312b]"
      >
        {mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {mode === "create" ? "Add service" : "Save service"}
      </button>
    </form>
  );
}

function ProgramEditor({ trip, bookingCount }: { trip: Adventure; bookingCount: number }) {
  return (
    <details className="rounded-md border border-[#ded7ca] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <TypePill label={categoryLabels[trip.category]} />
            {trip.featured ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#e8f0eb] px-2 py-1 text-xs font-semibold text-[#2d5f4e]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Featured
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#f4efe6] px-2 py-1 text-xs font-semibold text-[#5c5c56]">
              <Users className="h-3.5 w-3.5" />
              {bookingCount} bookings
            </span>
          </div>
          <h3 className="mt-2 truncate text-base font-semibold text-[#0f1a17]">{trip.title}</h3>
        </div>
        <span className="text-sm text-[#5c5c56]">Edit</span>
      </summary>
      <div className="border-t border-[#eee7dc] p-4">
        <TripForm mode="edit" trip={trip} />
        <form action={deleteTripAction} className="mt-3">
          <input type="hidden" name="id" defaultValue={trip.id} />
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#e4b7a5] bg-[#fff3ed] px-4 text-sm font-semibold text-[#c34a21] hover:border-[#c34a21]"
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
    <form action={saveTripAction} className="rounded-md border border-[#ded7ca] bg-[#fbfaf7] p-4">
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
      <label className="mt-4 flex w-fit items-center gap-2 text-sm font-semibold text-[#0f1a17]">
        <input type="checkbox" name="featured" defaultChecked={trip?.featured ?? false} className="h-4 w-4 accent-[#e85d2c]" />
        Featured on website
      </label>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#0f1a17] px-4 text-sm font-semibold text-white hover:bg-[#22312b]"
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
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#706b62]">{label}</span>
      <input
        name={name}
        className="mt-2 h-10 w-full rounded-md border border-[#d9d2c3] bg-white px-3 text-sm outline-none focus:border-[#e85d2c] focus:ring-2 focus:ring-[#e85d2c]/15"
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
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#706b62]">{label}</span>
      <textarea
        name={name}
        className="mt-2 w-full rounded-md border border-[#d9d2c3] bg-white px-3 py-2 text-sm outline-none focus:border-[#e85d2c] focus:ring-2 focus:ring-[#e85d2c]/15"
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
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#706b62]">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 h-10 w-full rounded-md border border-[#d9d2c3] bg-white px-3 text-sm outline-none focus:border-[#e85d2c] focus:ring-2 focus:ring-[#e85d2c]/15"
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
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  detail: string;
  tone: "orange" | "green" | "blue" | "slate";
}) {
  const tones = {
    orange: "bg-[#fff3ed] text-[#c34a21]",
    green: "bg-[#e8f0eb] text-[#2d5f4e]",
    blue: "bg-[#edf4ff] text-[#24548f]",
    slate: "bg-[#eff1ee] text-[#3e4641]",
  };

  return (
    <div className="rounded-md border border-[#ded7ca] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-[#5c5c56]">{label}</div>
          <div className="mt-2 text-3xl font-semibold text-[#0f1a17]">{value}</div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-md ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 border-t border-[#eee7dc] pt-3 text-sm text-[#5c5c56]">{detail}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e85d2c]">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-semibold text-[#0f1a17]">{title}</h2>
      </div>
      <span className="text-sm font-medium text-[#5c5c56]">{action}</span>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-[#0f1a17]">{title}</h2>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-[#cfc6b7] bg-white p-8 text-center shadow-sm">
      <Inbox className="mx-auto h-8 w-8 text-[#2d5f4e]" />
      <h3 className="mt-3 text-base font-semibold text-[#0f1a17]">No registrations yet</h3>
      <p className="mt-2 text-sm text-[#5c5c56]">New website registrations will appear here.</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white/10 p-3">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-[#d9d2c3]">{label}</div>
    </div>
  );
}

function TypePill({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit rounded-md bg-[#f4efe6] px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#5c5c56]">
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
