"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useCallback,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import type { ActionResult, FormAction } from "./action-state";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./primitives";
import { useAdminToast } from "./toast";

type FormState = {
  pending: boolean;
  uploads: number;
  trackUpload: (delta: number) => void;
};

const FormStateContext = createContext<FormState>({
  pending: false,
  uploads: 0,
  trackUpload: () => {},
});

/** Lets a MediaSlot tell its form "an upload is running, don't submit yet". */
export function useUploadTracker() {
  return useContext(FormStateContext).trackUpload;
}

const NETWORK_ERROR = "Сервертэй холбогдож чадсангүй. Интернэтээ шалгаад дахин оролдоно уу.";

/**
 * Form wrapper for every admin Server Action.
 *
 * It submits through onSubmit + startTransition instead of `<form action>`:
 * React resets an uncontrolled form after every `<form action={fn}>`
 * submission, even a failed one, which would wipe what the admin typed. Here
 * the fields stay put, the result goes to the toast, and `resetOnSuccess`
 * clears the form only when the save worked (for "add new" forms).
 */
export function AdminForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  onSuccess,
  "aria-label": ariaLabel,
}: {
  action: FormAction;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  onSuccess?: (result: ActionResult) => void;
  "aria-label"?: string;
}) {
  const toast = useAdminToast();
  const [resetKey, setResetKey] = useState(0);
  const [uploads, setUploads] = useState(0);
  const [, dispatch, pending] = useActionState<ActionResult | null, FormData>(
    async (previousState, formData) => {
      let result: ActionResult;

      try {
        result = await action(previousState, formData);
      } catch (error) {
        // Next's redirect/notFound signals must keep propagating.
        if (isNextSignal(error)) {
          throw error;
        }

        result = { ok: false, message: NETWORK_ERROR };
      }

      toast(result);

      if (result.ok) {
        if (resetOnSuccess) {
          setResetKey((key) => key + 1);
          setUploads(0);
        }

        onSuccess?.(result);
      }

      return result;
    },
    null
  );

  const trackUpload = useCallback((delta: number) => {
    setUploads((count) => Math.max(0, count + delta));
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending || uploads > 0) {
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter);
    startTransition(() => dispatch(formData));
  }

  return (
    <FormStateContext value={{ pending, uploads, trackUpload }}>
      <form
        key={resetKey}
        onSubmit={handleSubmit}
        aria-busy={pending}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </form>
    </FormStateContext>
  );
}

function isNextSignal(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_")
  );
}

/**
 * Submit button with a spinner while the form is saving. It is disabled while
 * pending (no double submit) and while a file upload is still running. With
 * `confirmMessage` it asks first — used for every destructive action.
 */
export function SubmitButton({
  children,
  icon,
  pendingLabel = "Хадгалж байна…",
  variant = "primary",
  size = "md",
  className,
  confirmMessage,
  disabled,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  icon?: ReactNode;
  pendingLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  confirmMessage?: string;
}) {
  const formStatus = useFormStatus();
  const formState = useContext(FormStateContext);
  const pending = formStatus.pending || formState.pending;
  const uploading = formState.uploads > 0;

  return (
    <button
      type="submit"
      {...props}
      disabled={disabled || pending || uploading}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
          return;
        }

        props.onClick?.(event);
      }}
      className={buttonClass({ variant, size, className })}
    >
      {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : icon}
      {pending ? pendingLabel : uploading ? "Файл байршиж дуусахыг хүлээнэ үү" : children}
    </button>
  );
}
