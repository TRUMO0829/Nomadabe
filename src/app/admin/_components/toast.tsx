"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

type Toast = { id: number; ok: boolean; message: string };
type PushToast = (result: { ok: boolean; message: string }) => void;

const ToastContext = createContext<PushToast>(() => {});

const SUCCESS_TIMEOUT_MS = 6000;

/**
 * Save feedback for the whole admin area. It sits in the layout, so a message
 * survives the form that sent it unmounting (a deleted row, a navigation after
 * create). The live regions are always in the DOM so screen readers announce
 * new messages; errors use role="alert" and stay until dismissed.
 */
export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback<PushToast>(
    (result) => {
      if (!result.message) {
        return;
      }

      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-3), { id, ...result }]);

      if (result.ok) {
        window.setTimeout(() => dismiss(id), SUCCESS_TIMEOUT_MS);
      }
    },
    [dismiss]
  );

  const successes = toasts.filter((toast) => toast.ok);
  const errors = toasts.filter((toast) => !toast.ok);

  return (
    <ToastContext value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:w-[26rem]">
        <div role="alert" className="flex w-full flex-col gap-2">
          {errors.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
        <div role="status" aria-live="polite" className="flex w-full flex-col gap-2">
          {successes.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
      </div>
    </ToastContext>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-md border px-4 py-3 text-sm font-semibold shadow-lg ${
        toast.ok
          ? "border-emerald-300 bg-emerald-50 text-emerald-900"
          : "border-red-300 bg-red-50 text-red-900"
      }`}
    >
      {toast.ok ? (
        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      )}
      <span className="flex-1 leading-6">
        {toast.ok ? null : <span className="sr-only">Алдаа: </span>}
        {toast.message}
      </span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Мэдэгдлийг хаах"
        className="-mr-1 rounded-md p-1 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useAdminToast() {
  return useContext(ToastContext);
}
