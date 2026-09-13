import type { LucideIcon } from "lucide-react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import Link from "next/link";
import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

/*
 * Shared admin building blocks. This file has no hooks, so it works from both
 * Server and Client Components. Interactive pieces (SubmitButton, AdminForm)
 * live in admin-form.tsx.
 */

/** A 2px dark ring that stays visible on the cream background. */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const INPUT_CLASS =
  "mt-2 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-[var(--foreground)] outline-none focus-visible:border-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--foreground)] disabled:opacity-60";

const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]";

/** The same ring for dark surfaces (sidebar, mobile top bar). */
export const INVERSE_FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]";

/** `inverse` is `secondary` for the dark sidebar / top bar. */
export type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost" | "inverse";
export type ButtonSize = "sm" | "md";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-[var(--primary)] text-white hover:bg-[var(--foreground)]/85",
  secondary:
    "border border-[var(--border)] bg-white text-[var(--primary)] hover:border-[var(--foreground)]",
  destructive: "bg-red-700 text-white hover:bg-red-800",
  ghost: "text-[var(--foreground)] hover:bg-[var(--muted)]",
  inverse: "border border-white/20 bg-white/10 text-white hover:bg-white/20",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
};

/** The one place admin button styling is defined. */
export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    variant === "inverse" ? INVERSE_FOCUS_RING : FOCUS_RING,
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className ?? "",
  ].join(" ");
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  external,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className={buttonClass({ variant, size, className })}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}

function FieldHint({ hint }: { hint?: ReactNode }) {
  return hint ? (
    <span className="mt-1.5 block text-xs leading-5 text-[var(--muted-foreground)]">{hint}</span>
  ) : null;
}

export function TextField({
  label,
  name,
  className,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; hint?: ReactNode }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className={LABEL_CLASS}>{label}</span>
      <input name={name} className={`${INPUT_CLASS} h-10`} {...props} />
      <FieldHint hint={hint} />
    </label>
  );
}

export function TextareaField({
  label,
  name,
  className,
  hint,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  hint?: ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className={LABEL_CLASS}>{label}</span>
      <textarea name={name} className={`${INPUT_CLASS} py-2`} {...props} />
      <FieldHint hint={hint} />
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  className,
  hint,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  hint?: ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className={LABEL_CLASS}>{label}</span>
      <select name={name} className={`${INPUT_CLASS} h-10`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldHint hint={hint} />
    </label>
  );
}

export function CheckboxField({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label
      className={`flex w-fit items-center gap-2 text-sm font-semibold text-[var(--primary)] ${className ?? ""}`}
    >
      <input
        type="checkbox"
        className="h-4 w-4 accent-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2"
        {...props}
      />
      {label}
    </label>
  );
}

/**
 * Collapsible section with a chevron that flips when open. The rotation keys
 * off this element's own [open] (not a Tailwind group), so nested disclosures
 * don't rotate each other's chevrons.
 */
export function Disclosure({
  title,
  hint,
  children,
  className,
  defaultOpen,
}: {
  title: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className={`rounded-md border border-[var(--border)] bg-white shadow-sm [&[open]>summary_.disclosure-chevron]:rotate-180 ${className ?? ""}`}
    >
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 py-3 [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
      >
        <span className="text-sm font-black text-[var(--primary)]">{title}</span>
        <span className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
          {hint}
          <ChevronDown
            aria-hidden="true"
            className="disclosure-chevron h-4 w-4 shrink-0 transition-transform"
          />
        </span>
      </summary>
      <div className="border-t border-[var(--border)] p-4">{children}</div>
    </details>
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
}) {
  // No aria-label: it would replace the link's content, and screen readers
  // would announce the label without the number.
  return (
    <Link
      href={href}
      className={`block rounded-md border border-[var(--border)] bg-white p-4 shadow-sm transition-colors hover:border-[var(--foreground)] ${FOCUS_RING}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-[var(--muted-foreground)]">{label}</div>
          <div className="mt-2 font-display text-4xl leading-none text-[var(--primary)]">{value}</div>
        </div>
        <div
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)]"
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted-foreground)]">
        {detail}
      </div>
    </Link>
  );
}

/** The page's single h1. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight text-[var(--primary)] sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 font-display text-2xl leading-none text-[var(--primary)]">{title}</h2>
      </div>
      {action ? (
        <span className="text-sm font-medium text-[var(--muted-foreground)]">{action}</span>
      ) : null}
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

export function EmptyState({
  title,
  message,
  icon: Icon = Inbox,
  action,
}: {
  title: string;
  message?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-md border border-dashed border-[var(--border)] bg-white p-8 text-center shadow-sm">
      <Icon aria-hidden="true" className="mx-auto h-8 w-8 text-[var(--foreground)]" />
      <h3 className="mt-3 text-base font-semibold text-[var(--primary)]">{title}</h3>
      {message ? <p className="mt-2 text-sm text-[var(--muted-foreground)]">{message}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

/** Shown when some of a page's data failed to load; the rest still renders. */
export function LoadErrorNotice({ errors }: { errors: string[] }) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900">
      <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <span>Зарим өгөгдөл уншигдсангүй: {errors[0]}</span>
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

/**
 * Previous / next links driven by the URL's `page` search param. `params` are
 * the other search params to carry along (filters, search text).
 */
export function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
  pageParam = "page",
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
  pageParam?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  function hrefFor(target: number) {
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        search.set(key, value);
      }
    }

    if (target > 1) {
      search.set(pageParam, String(target));
    }

    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const disabledClass = buttonClass({
    variant: "secondary",
    size: "sm",
    className: "pointer-events-none opacity-50",
  });

  return (
    <nav aria-label="Хуудаслалт" className="flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={buttonClass({ variant: "secondary", size: "sm" })}>
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Өмнөх
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Өмнөх
        </span>
      )}
      <span className="text-sm font-semibold text-[var(--muted-foreground)]">
        {page} / {totalPages} хуудас
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={buttonClass({ variant: "secondary", size: "sm" })}>
          Дараах
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Дараах
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

/** Clamp a `page` search param to 1..totalPages and slice the list. */
export function paginate<T>(items: T[], rawPage: string | undefined, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const parsed = Number.parseInt(rawPage ?? "1", 10);
  const page = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), totalPages) : 1;

  return {
    page,
    totalPages,
    items: items.slice((page - 1) * pageSize, page * pageSize),
  };
}
