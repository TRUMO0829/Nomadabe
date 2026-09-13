"use client";

import { Save } from "lucide-react";
import { updateInquiryStatusAction } from "../actions";
import { AdminForm, SubmitButton } from "./admin-form";
import { CheckboxField } from "./primitives";

/**
 * Status change for one inquiry. Emailing the customer is opt-in via the
 * checkbox (off by default). The page keys this form on the saved status, so
 * after a change it remounts with the checkbox cleared again.
 */
export function InquiryStatusForm({
  inquiryId,
  name,
  status,
  hasEmail,
  statusOptions,
}: {
  inquiryId: string;
  name: string;
  status: string;
  hasEmail: boolean;
  statusOptions: Array<{ value: string; label: string }>;
}) {
  const selectId = `inquiry-status-${inquiryId}`;

  return (
    <AdminForm action={updateInquiryStatusAction} aria-label={`${name} — төлөв`} className="space-y-2">
      <input type="hidden" name="id" value={inquiryId} />
      <label htmlFor={selectId} className="block text-xs font-semibold text-[var(--muted-foreground)]">
        Төлөв
      </label>
      <div className="flex items-center gap-2">
        <select
          id={selectId}
          name="status"
          defaultValue={status}
          className="h-9 rounded-md border border-[var(--border)] bg-white px-2 text-xs font-semibold text-[var(--primary)] focus-visible:border-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <SubmitButton size="sm" icon={<Save aria-hidden="true" className="h-3.5 w-3.5" />}>
          Хадгалах
        </SubmitButton>
      </div>
      {hasEmail ? (
        <CheckboxField name="notifyCustomer" label="Хэрэглэгчид и-мэйлээр мэдэгдэх" className="text-xs" />
      ) : (
        <p className="text-xs text-[var(--muted-foreground)]">И-мэйлгүй тул мэдэгдэл илгээх боломжгүй.</p>
      )}
    </AdminForm>
  );
}
