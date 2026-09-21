"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const SUCCESS_TIMEOUT_MS = 5000;

/**
 * Save feedback for the admin panel.
 *
 * Every admin action redirects back with `?status=…`, so the message used to
 * sit on the page until the admin navigated somewhere else. A successful save
 * now clears itself after 5 seconds, and the query param goes with it so a
 * refresh (or the back button) doesn't bring the old message back. Errors stay
 * put — those need to be read.
 */
export function AdminStatusBanner({ message }: { message: string }) {
  const router = useRouter();
  const isError = message.startsWith("Алдаа");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isError) {
      return;
    }

    const timer = window.setTimeout(() => {
      // Hide right away, then drop `status` from the URL through the router so
      // its own idea of the current URL stays in sync. A raw
      // history.replaceState would leave the router still on `?status=…`, and
      // the next save — which redirects to that very same URL — would look
      // like a no-op navigation and never show its message.
      setVisible(false);

      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
    }, SUCCESS_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [isError, router]);

  if (!visible) {
    return null;
  }

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live="polite"
      className={`sticky top-3 z-30 flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-bold shadow-lg ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {isError ? (
        <AlertTriangle className="h-5 w-5 shrink-0" />
      ) : (
        <CheckCircle2 className="h-5 w-5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}
