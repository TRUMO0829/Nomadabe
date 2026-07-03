"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  Mail,
  Plane,
  RefreshCw,
  Trash2,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Customer = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
};

type Inquiry = {
  id: string;
  inquiryType: "trip" | "business" | "expo" | "custom" | "general";
  status: "new" | "contacted" | "confirmed" | "closed";
  tripSlug?: string;
  tripTitle: string;
  tripImage: string | null;
  tripLocation: string | null;
  travelers?: number;
  preferredDate?: string;
  message: string;
  createdAt: string;
};

type ProfileData = {
  customer: Customer;
  inquiries: Inquiry[];
  stats: {
    totalInquiries: number;
    confirmed: number;
    active: number;
  };
};

type InquiryFilter = "all" | "active" | "traveled";

const statusCopy: Record<Inquiry["status"], { label: string; className: string }> = {
  new: {
    label: "Хүлээгдэж буй",
    className: "bg-white text-[var(--foreground)] ring-1 ring-[var(--border)]",
  },
  contacted: {
    label: "Хүлээгдэж буй",
    className: "bg-[var(--muted)] text-[var(--foreground)]",
  },
  confirmed: {
    label: "Явсан",
    className: "bg-emerald-600 text-white",
  },
  closed: {
    label: "Явсан",
    className: "bg-[var(--primary)] text-white",
  },
};

export function ProfilePageClient() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<InquiryFilter>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const initials = useMemo(() => getInitials(data?.customer), [data?.customer]);
  const profileMetrics = useMemo(() => {
    const inquiries = data?.inquiries ?? [];

    return {
      total: inquiries.length,
      active: inquiries.filter((inquiry) => isActiveInquiry(inquiry)).length,
      traveled: inquiries.filter((inquiry) => isTraveledInquiry(inquiry)).length,
    };
  }, [data?.inquiries]);
  const filteredInquiries = useMemo(() => {
    const inquiries = data?.inquiries ?? [];

    if (filter === "active") {
      return inquiries.filter((inquiry) => isActiveInquiry(inquiry));
    }

    if (filter === "traveled") {
      return inquiries.filter((inquiry) => isTraveledInquiry(inquiry));
    }

    return inquiries;
  }, [data?.inquiries, filter]);

  useEffect(() => {
    void loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      const result = (await response.json()) as {
        ok?: boolean;
        data?: ProfileData;
        error?: { message?: string };
      };

      if (!response.ok || !result.ok || !result.data) {
        throw new Error(result.error?.message ?? "Профайл уншиж чадсангүй.");
      }

      setData(result.data);
    } catch (caught) {
      setData(null);
      setError(caught instanceof Error ? caught.message : "Профайл уншиж чадсангүй.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.dispatchEvent(new Event("nomadabe:auth-changed"));
    window.location.href = "/";
  }

  async function handleDeleteInquiry(id: string) {
    setDeletingId(id);
    setDeleteError("");

    try {
      const response = await fetch(`/api/profile/inquiries/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: { message?: string };
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message ?? "Could not delete pending trip.");
      }

      setData((current) => {
        if (!current) {
          return current;
        }

        const inquiries = current.inquiries.filter((inquiry) => inquiry.id !== id);

        return {
          ...current,
          inquiries,
          stats: {
            totalInquiries: inquiries.length,
            confirmed: inquiries.filter((inquiry) => isTraveledInquiry(inquiry)).length,
            active: inquiries.filter((inquiry) => isActiveInquiry(inquiry)).length,
          },
        };
      });
    } catch (caught) {
      setDeleteError(caught instanceof Error ? caught.message : "Could not delete pending trip.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-5 pt-28 text-[var(--foreground)]">
        <div className="mx-auto max-w-6xl">
          <div className="h-40 animate-pulse rounded-md border border-[var(--border)] bg-white" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-5 pt-28 text-[var(--foreground)]">
        <section className="mx-auto max-w-3xl rounded-md border border-[var(--border)] bg-white p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent)]">
            <UserRound className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-black uppercase">Нэвтрэх шаардлагатай</h1>
          <p className="mt-3 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Профайл болон аяллын хүсэлтүүдээ харахын тулд эхлээд нэвтэрнэ үү.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("nomadabe:open-signup-prompt"))}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-black uppercase text-[var(--accent-foreground)]"
            >
              <UserRound className="h-4 w-4" />
              Нэвтрэх
            </button>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-5 py-3 text-sm font-black uppercase"
            >
              <Plane className="h-4 w-4" />
              Аяллууд харах
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 pb-16 pt-28 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-md border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[var(--primary)] text-xl font-black text-[var(--accent)]">
                {initials}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-black uppercase">
                  {data.customer.name || "Миний профайл"}
                </h1>
                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)]">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{data.customer.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <ProfileMetric
                label="Нийт"
                value={profileMetrics.total}
                active={filter === "all"}
                onClick={() => setFilter("all")}
              />
              <ProfileMetric
                label="Идэвхтэй"
                value={profileMetrics.active}
                active={filter === "active"}
                onClick={() => setFilter("active")}
              />
              <ProfileMetric
                label="Явсан"
                value={profileMetrics.traveled}
                active={filter === "traveled"}
                onClick={() => setFilter("traveled")}
              />
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={loadProfile}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-3 text-sm font-black uppercase transition-colors hover:border-[var(--accent)]"
              >
                <RefreshCw className="h-4 w-4" />
                Шинэчлэх
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-3 text-sm font-black uppercase text-white transition-colors hover:bg-black"
              >
                <LogOut className="h-4 w-4" />
                Гарах
              </button>
            </div>
          </aside>

          <section className="rounded-md border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-[var(--muted-foreground)]">
                  Миний аяллын хүсэлтүүд
                </p>
                <h2 className="mt-1 text-2xl font-black uppercase">Бүртгэлийн түүх</h2>
              </div>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-black uppercase text-[var(--accent-foreground)]"
              >
                <Plane className="h-4 w-4" />
                Шинэ аялал
              </Link>
            </div>

            {data.inquiries.length === 0 ? (
              <div className="mt-6 rounded-md border border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center">
                <Plane className="mx-auto h-9 w-9 text-[var(--muted-foreground)]" />
                <h3 className="mt-4 text-lg font-black uppercase">Аяллын хүсэлт алга</h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[var(--muted-foreground)]">
                  Та аялал сонгоод бүртгүүлэхэд энд статус болон мэдээлэл нь харагдана.
                </p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="mt-6 rounded-md border border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center">
                <Plane className="mx-auto h-9 w-9 text-[var(--muted-foreground)]" />
                <h3 className="mt-4 text-lg font-black uppercase">
                  Энэ ангилалд аялал алга
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[var(--muted-foreground)]">
                  Өөр ангилал сонгоод бүртгэлийн түүхээ харна уу.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-3">
                {filteredInquiries.map((inquiry) => (
                  <InquiryCard
                    key={inquiry.id}
                    inquiry={inquiry}
                    deleting={deletingId === inquiry.id}
                    onDelete={handleDeleteInquiry}
                  />
                ))}
              </div>
            )}
            {deleteError ? (
              <p className="mt-4 text-sm font-semibold text-red-600">{deleteError}</p>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}

function ProfileMetric({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-md border p-3 text-center transition-colors",
        active
          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
          : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent)]"
      )}
    >
      <div className="text-xl font-black">{value}</div>
      <div
        className={cn(
          "mt-1 text-[11px] font-bold uppercase",
          active ? "text-white/75" : "text-[var(--muted-foreground)]"
        )}
      >
        {label}
      </div>
    </button>
  );
}

function InquiryCard({
  inquiry,
  deleting,
  onDelete,
}: {
  inquiry: Inquiry;
  deleting: boolean;
  onDelete: (id: string) => void;
}) {
  const status = statusCopy[inquiry.status];
  const canDelete = isActiveInquiry(inquiry);

  return (
    <article className="grid gap-4 rounded-md border border-[var(--border)] bg-[var(--background)] p-4 sm:grid-cols-[112px_1fr]">
      <div
        aria-hidden="true"
        className="min-h-28 rounded-md bg-[var(--muted)] bg-cover bg-center"
        style={inquiry.tripImage ? { backgroundImage: `url(${inquiry.tripImage})` } : undefined}
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black uppercase">{inquiry.tripTitle}</h3>
            <p className="mt-1 text-sm font-semibold text-[var(--muted-foreground)]">
              {inquiry.tripLocation || getInquiryTypeLabel(inquiry.inquiryType)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-black uppercase",
                status.className
              )}
            >
              {isTraveledInquiry(inquiry) ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Clock3 className="h-3.5 w-3.5" />
              )}
              {status.label}
            </span>
            {canDelete ? (
              <button
                type="button"
                aria-label="Delete pending trip"
                disabled={deleting}
                onClick={() => onDelete(inquiry.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 ring-1 ring-[var(--border)]">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(inquiry.createdAt)}
          </span>
          {inquiry.preferredDate ? (
            <span className="rounded-md bg-white px-2.5 py-1.5 ring-1 ring-[var(--border)]">
              Явах: {inquiry.preferredDate}
            </span>
          ) : null}
          {inquiry.travelers ? (
            <span className="rounded-md bg-white px-2.5 py-1.5 ring-1 ring-[var(--border)]">
              {inquiry.travelers} хүн
            </span>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-[var(--foreground)]/75">
          {inquiry.message}
        </p>
      </div>
    </article>
  );
}

function isActiveInquiry(inquiry: Inquiry) {
  return inquiry.status === "new" || inquiry.status === "contacted";
}

function isTraveledInquiry(inquiry: Inquiry) {
  return inquiry.status === "confirmed" || inquiry.status === "closed";
}

function getInitials(customer: Customer | undefined) {
  const source = customer?.name || customer?.email || "N";
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function getInquiryTypeLabel(type: Inquiry["inquiryType"]) {
  const labels: Record<Inquiry["inquiryType"], string> = {
    trip: "Аялал",
    business: "Бизнес аялал",
    expo: "Expo аялал",
    custom: "Захиалгат аялал",
    general: "Ерөнхий хүсэлт",
  };

  return labels[type];
}
