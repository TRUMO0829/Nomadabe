export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Ачаалж байна…</span>
      <div aria-hidden="true" className="space-y-3 border-b border-[var(--border)] pb-6">
        <div className="h-3 w-24 animate-pulse rounded bg-[var(--muted)]" />
        <div className="h-9 w-72 max-w-full animate-pulse rounded bg-[var(--muted)]" />
      </div>
      <div aria-hidden="true" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-md border border-[var(--border)] bg-white" />
        ))}
      </div>
    </div>
  );
}
