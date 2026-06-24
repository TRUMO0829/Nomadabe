"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ConfirmSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  message: string;
  children: ReactNode;
};

// Submit button that asks for confirmation before the form (server action)
// runs — prevents one-click accidental deletes in the admin panel.
export function ConfirmSubmitButton({
  message,
  children,
  ...props
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      {...props}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
