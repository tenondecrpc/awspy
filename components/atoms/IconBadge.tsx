// IconBadge atom. A line icon inside a soft round badge: the visual anchor of a
// fact, a step or a role, so a person can scan a page by its icons before
// reading a word. Flat, no shadow, no gradient.
//
// Tones follow the page surface it sits on. `solid` is the one filled variant,
// for the single most important item of a group.

import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import { cn } from "@/lib/utils/cn";

type IconBadgeProps = {
  name: GlyphName;
  /** `soft` (default) on paper, `solid` for emphasis, `on-dark` on navy. */
  tone?: "soft" | "solid" | "on-dark";
  /** Badge diameter in rem: `md` 2.75rem (default), `lg` 3.5rem, `sm` 2.25rem. */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const TONE = {
  soft: "bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]",
  solid: "bg-[var(--color-text-primary)] text-[var(--color-surface)]",
  "on-dark":
    "bg-[var(--color-border-on-inverse)] text-[var(--color-text-on-inverse)]",
} as const;

const BOX = {
  sm: "size-9",
  md: "size-11",
  lg: "size-14",
} as const;

const GLYPH = { sm: 18, md: 22, lg: 28 } as const;

export function IconBadge({
  name,
  tone = "soft",
  size = "md",
  className,
}: IconBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        TONE[tone],
        BOX[size],
        className
      )}
    >
      <GlyphIcon name={name} size={GLYPH[size]} />
    </span>
  );
}
