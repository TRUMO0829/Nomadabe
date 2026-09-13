"use client";

import { Mail, Send } from "lucide-react";
import { sendAdminEmailAction, sendQuickReplyAction } from "../actions";
import { AdminForm, SubmitButton } from "./admin-form";
import { TextField, TextareaField } from "./primitives";

const QUICK_REPLY_SUBJECT = "Nomadabe Travel таны хүсэлтийг хүлээн авлаа";
const QUICK_REPLY_BODY =
  "Сайн байна уу, Nomadabe Travel-д хандсанд баярлалаа. Манай баг таны хүсэлтийг хүлээн авсан бөгөөд аяллын дэлгэрэнгүй мэдээллээр удахгүй холбогдоно.";

export type QuickReplyRecipient = { inquiryId: string; name: string; email: string };

export function EmailComposer({ quickReply }: { quickReply: QuickReplyRecipient | null }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <AdminForm
        action={sendAdminEmailAction}
        resetOnSuccess
        aria-label="Хэрэглэгч рүү мэйл илгээх"
        className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)]">
            <Send className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-2xl leading-none text-[var(--primary)]">Хэрэглэгч рүү мэйл илгээх</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Мэйл үйлчилгээ (Resend) тохируулсан бол шууд илгээнэ, тохируулаагүй бол зөвхөн мэйлийн түүхэнд хадгална.
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField label="Хүлээн авагчийн и-мэйл" name="to" type="email" autoComplete="off" placeholder="customer@example.com" required />
          <TextField label="Гарчиг" name="subject" placeholder="Nomadabe аяллын хүсэлт" required />
          <TextareaField
            label="Зурвас"
            name="body"
            rows={6}
            className="lg:col-span-2"
            placeholder="Хэрэглэгч рүү илгээх зурвасаа бичнэ үү."
            required
          />
        </div>
        <SubmitButton className="mt-4" icon={<Send aria-hidden="true" className="h-4 w-4" />} pendingLabel="Илгээж байна…">
          Мэйл илгээх
        </SubmitButton>
      </AdminForm>

      <AdminForm
        action={sendQuickReplyAction}
        aria-label="Хурдан хариу"
        className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm"
      >
        <Mail aria-hidden="true" className="h-6 w-6 text-[var(--foreground)]" />
        <h2 className="mt-4 font-display text-2xl leading-none text-[var(--primary)]">Хурдан хариу</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          И-мэйлтэй хамгийн сүүлийн бүртгэл рүү бэлэн загвар илгээнэ.
        </p>

        {quickReply ? (
          <>
            <input type="hidden" name="inquiryId" value={quickReply.inquiryId} />
            <input type="hidden" name="subject" value={QUICK_REPLY_SUBJECT} />
            <input type="hidden" name="body" value={QUICK_REPLY_BODY} />
            <dl className="mt-4 space-y-2 rounded-md bg-[var(--background)] p-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Хүлээн авагч</dt>
                <dd className="mt-1 break-words font-semibold text-[var(--primary)]">
                  {quickReply.name} &lt;{quickReply.email}&gt;
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Гарчиг</dt>
                <dd className="mt-1">{QUICK_REPLY_SUBJECT}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Зурвас</dt>
                <dd className="mt-1 leading-6 text-[var(--muted-foreground)]">{QUICK_REPLY_BODY}</dd>
              </div>
            </dl>
            <SubmitButton
              className="mt-4 w-full"
              icon={<Send aria-hidden="true" className="h-4 w-4" />}
              pendingLabel="Илгээж байна…"
              confirmMessage={`${quickReply.name} (${quickReply.email}) руу бэлэн хариу илгээх үү?`}
            >
              {quickReply.email} руу илгээх
            </SubmitButton>
          </>
        ) : (
          <p className="mt-4 rounded-md bg-[var(--muted)] px-3 py-2 text-sm font-semibold text-[var(--foreground)]">
            И-мэйл хаягтай бүртгэл одоогоор алга тул хурдан хариу илгээх боломжгүй.
          </p>
        )}
      </AdminForm>
    </div>
  );
}
