// Empty-state organism. Used wherever a content source has nothing yet
// (speakers, schedule, sponsors, venue, FAQ). A small icon badge per variant,
// a heading, one sentence and an optional action button. Announced to screen
// readers via `role="status"` + `aria-live="polite"`.

import type { ReactNode } from "react";
import { type GlyphName } from "@/components/atoms/GlyphIcon";
import { IconBadge } from "@/components/atoms/IconBadge";
import { BTN_OUTLINE } from "@/components/molecules/SectionPrimitives";
import { cn } from "@/lib/utils/cn";

type EmptyStateVariant =
  "default" | "speakers" | "schedule" | "sponsors" | "venue" | "faq";

const VARIANT_ICON: Record<EmptyStateVariant, GlyphName> = {
  default: "clock",
  speakers: "mic",
  schedule: "calendar",
  sponsors: "heart",
  venue: "pin",
  faq: "chat",
};

type EmptyStateProps = {
  /** Visible heading. Defaults to a neutral Spanish "Próximamente". */
  title?: string;
  /** Visible description body. */
  description?: string;
  /** Replaces the default icon badge when provided. */
  illustration?: ReactNode;
  /** Identifies the empty section (exposed as `data-variant`). */
  variant?: EmptyStateVariant;
  /** When provided, renders a CTA at the bottom. */
  actionHref?: string;
  actionLabel?: string;
  /** Visible heading semantic level. Defaults to h2. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

export function EmptyState({
  title = "Próximamente",
  description = "Estamos trabajando para tener esta sección disponible. Volvé pronto.",
  illustration,
  variant = "default",
  actionHref,
  actionLabel,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Tag = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="empty-state"
      data-variant={variant}
      className={cn(
        "flex max-w-[40rem] flex-col items-start gap-5 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] p-6 sm:p-8",
        className
      )}
    >
      {illustration ?? <IconBadge name={VARIANT_ICON[variant]} size="lg" />}
      <div className="flex flex-col items-start gap-2">
        <Tag className="m-0 font-display text-step-2 leading-[1.1] text-[var(--color-text-primary)]">
          {title}
        </Tag>
        <p className="m-0 max-w-prose text-step-0 leading-[1.55] text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
      {actionHref && actionLabel ? (
        <a href={actionHref} className={BTN_OUTLINE}>
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}
