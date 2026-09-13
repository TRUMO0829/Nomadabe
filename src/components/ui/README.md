# UI Components Library

Shared building blocks for the public site. Tokens (colours, shadows, focus
ring) live in `src/app/globals.css`; these components only use those tokens.

## Components

- **`button.tsx`** — `Button` / `buttonVariants`, the site's one button. Square
  corners. `default` (amber) is the primary action; `dark`, `outline`,
  `outline-light`, `secondary`, `destructive`, `ghost` and `link` step down
  from it. Use `buttonVariants(...)` on a `<Link>` for link-buttons.
- **`section.tsx`** — `Container` (one max width and gutter for every section)
  and `SectionHeading` (amber-rule eyebrow + uppercase heading; `tone="dark"`
  on dark bands, `tone="light"` on cream/white).
- **`card-recipe.tsx`** — the shared trip/stay card: `CARD_FRAME`,
  `CARD_FRAME_LIGHT`, `CardMedia`, `CardOverlay`, `CardMeta`, `CardTitle`,
  `CARD_CTA`. A card is one link and lifts on hover in one place.
- **`dialog.tsx`** — Radix dialog primitives.

## Conventions

- Use token utilities (`bg-background`, `text-foreground`, `bg-ink`,
  `text-accent-text`, `border-border`, `border-input`, `shadow-card`…) instead
  of hex values. Amber (`text-accent`) is only readable as text on dark
  backgrounds; use `text-accent-text` on light ones.
- Panels and cards have square corners; only small chips may be `rounded-full`.
- Don't add per-element focus styles or `outline-none` workarounds: the global
  `:focus-visible` rule covers every interactive element.
- Motion must respect reduced motion. framer-motion does automatically (the
  app is wrapped in `MotionConfig reducedMotion="user"`); for JS loops use
  `useReducedMotion()`.
