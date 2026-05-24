// Vertical section primitive. Adds breathing room above/below content and
// (optionally) a muted background.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
  /** Tone of the background. */
  tone?: "default" | "muted" | "inverse";
  /** Vertical padding scale. */
  spacing?: "sm" | "md" | "lg";
  /** Optional id for in-page anchors and a11y references. */
  id?: string;
  "aria-labelledby"?: string;
};

const TONE_CLASS: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
  muted: "bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]",
  inverse:
    "bg-[var(--color-surface-inverse)] text-[var(--color-text-on-inverse)]",
};

const SPACING_CLASS: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-8 sm:py-10",
  md: "py-12 sm:py-16",
  lg: "py-16 sm:py-24",
};

export function Section({
  children,
  className,
  tone = "default",
  spacing = "md",
  id,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(TONE_CLASS[tone], SPACING_CLASS[spacing], className)}
    >
      {children}
    </section>
  );
}
