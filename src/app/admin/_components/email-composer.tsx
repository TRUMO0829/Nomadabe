import { Mail, Send } from "lucide-react";
import { emailLatestInquiryAction, sendAdminEmailAction } from "../actions";
import { TextField, TextareaField } from "./primitives";

export function EmailComposer() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <form action={sendAdminEmailAction} className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)]">
            <Send className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-2xl leading-none text-[var(--primary)]">Хэрэглэгч рүү мэйл илгээх</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Resend тохируулсан бол шууд илгээнэ, тохируулаагүй бол дарааллын лог болгож хадгална.
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField label="Хүлээн авагчийн и-мэйл" name="to" type="email" placeholder="customer@example.com" required />
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
        <button
          type="submit"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
        >
          <Send className="h-4 w-4" />
          Мэйл илгээх
        </button>
      </form>

      <form action={emailLatestInquiryAction} className="rounded-md border border-[var(--border)] bg-[var(--primary)] p-4 text-white shadow-sm">
        <Mail className="h-6 w-6 text-[var(--accent)]" />
        <h3 className="mt-4 font-display text-2xl leading-none">Хурдан хариу</h3>
        <p className="mt-2 text-sm leading-6 text-white/65">
          И-мэйлтэй хамгийн сүүлийн бүртгэл рүү бэлэн загвар илгээнэ.
        </p>
        <input type="hidden" name="subject" value="Nomadabe Travel таны хүсэлтийг хүлээн авлаа" />
        <input
          type="hidden"
          name="body"
          value="Сайн байна уу, Nomadabe Travel-д хандсанд баярлалаа. Манай баг таны хүсэлтийг хүлээн авсан бөгөөд аяллын дэлгэрэнгүй мэдээллээр удахгүй холбогдоно."
        />
        <button
          type="submit"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-foreground)] hover:bg-[var(--secondary)]"
        >
          <Send className="h-4 w-4" />
          Сүүлийн бүртгэл рүү илгээх
        </button>
      </form>
    </div>
  );
}
