// Vertical section primitive. Adds breathing room above/below content,
// optionally a muted/inverse/hero background, and an optional eyebrow slot
// rendered above the children for visual rhythm (orange accent line).

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
  /** Tone of the background. */
  tone?: "default" | "muted" | "inverse" | "hero";
  /** Vertical padding scale. */
  spacing?: "sm" | "md" | "lg";
  /** Optional id for in-page anchors and a11y references. */
  id?: string;
  "aria-labelledby"?: string;
  /**
   * Optional eyebrow content rendered above children with an action-orange
   * accent. Use for short uppercase labels ("KEYNOTE", "AGENDA").
   */
  eyebrow?: ReactNode;
};

const TONE_CLASS: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
  muted: "bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]",
  inverse:
    "bg-[var(--color-surface-inverse)] text-[var(--color-text-on-inverse)]",
  hero:
    "relative overflow-hidden bg-[var(--color-surface-hero)] text-[var(--color-text-on-hero)]",
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
  eyebrow,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(TONE_CLASS[tone], SPACING_CLASS[spacing], className)}
      data-tone={tone}
    >
      {eyebrow ? (
        <div className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-action)]">
          <span className="inline-block h-px w-8 bg-[var(--color-action)]" aria-hidden="true" />
          <span>{eyebrow}</span>
          <span className="inline-block h-px w-8 bg-[var(--color-action)]" aria-hidden="true" />
        </div>
      ) : null}
      {children}
    </section>
  );
}
