"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { buttonClass, ButtonLink } from "../_components/primitives";

// Next 16 passes `unstable_retry`; older versions passed `reset`.
export default function AdminError({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div role="alert" className="rounded-md border border-red-200 bg-white p-8 shadow-sm">
      <AlertTriangle aria-hidden="true" className="h-8 w-8 text-red-700" />
      <h1 className="mt-4 font-display text-3xl leading-tight text-[var(--primary)]">
        Энэ хэсгийг ачаалж чадсангүй
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
        Өгөгдлийн сантай холбогдоход алдаа гарсан байж магадгүй. Дахин оролдоно уу; алдаа
        давтагдвал доорх кодыг хөгжүүлэгчид илгээнэ үү.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs font-semibold text-[var(--muted-foreground)]">Алдааны код: {error.digest}</p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2">
        {retry ? (
          <button type="button" onClick={() => retry()} className={buttonClass()}>
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Дахин оролдох
          </button>
        ) : null}
        <ButtonLink href="/admin" variant="secondary">
          Ерөнхий хуудас руу буцах
        </ButtonLink>
      </div>
    </div>
  );
}
