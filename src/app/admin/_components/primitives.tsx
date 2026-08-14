import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Inbox } from "lucide-react";

export function TextField({
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

export function TextareaField({
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

export function SelectField({
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

export function MetricCard({
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

export function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action: string }) {
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

export function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-2xl leading-none text-[var(--primary)]">{title}</h2>
      {children}
    </section>
  );
}

export function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-[var(--border)] bg-white p-8 text-center shadow-sm">
      <Inbox className="mx-auto h-8 w-8 text-[var(--foreground)]" />
      <h3 className="mt-3 text-base font-semibold text-[var(--primary)]">Одоогоор бүртгэл алга</h3>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">Вебээс ирэх шинэ бүртгэлүүд энд харагдана.</p>
    </div>
  );
}

export function TypePill({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
      {label}
    </span>
  );
}

export function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit rounded-md bg-[var(--accent)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent-foreground)]">
      {label}
    </span>
  );
}
