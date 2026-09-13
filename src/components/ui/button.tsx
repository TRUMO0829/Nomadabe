import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The site's one button. Square corners to match the card recipe; the amber
 * fill is the primary action, everything else steps down from it. Focus
 * styling comes from the global :focus-visible rule in globals.css.
 */
const buttonVariants = cva(
  "nav-text inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs uppercase transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground hover:bg-secondary",
        dark: "bg-foreground text-background hover:bg-ink",
        outline: "border border-input bg-transparent text-foreground hover:bg-muted",
        "outline-light": "border border-white/45 bg-transparent text-white hover:bg-white/10",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "text-foreground hover:bg-muted",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-12 px-6",
        sm: "min-h-10 px-4",
        lg: "min-h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
