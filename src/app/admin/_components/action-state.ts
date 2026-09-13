/**
 * What every admin Server Action returns to `useActionState`. Errors come back
 * as `ok: false` instead of a redirect, so the form keeps what the admin typed.
 * `id` carries the saved record's id when the client needs it (e.g. to open
 * the trip that was just created).
 */
export type ActionResult = {
  ok: boolean;
  message: string;
  id?: string;
};

export type FormAction = (
  previousState: ActionResult | null,
  formData: FormData
) => Promise<ActionResult>;
