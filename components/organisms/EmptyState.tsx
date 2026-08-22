// Empty-state organism. Used wherever an external data source returns no
// content (Sessionize empty, sponsors not yet seeded, schedule not yet
// published, etc.). Spanish copy by default; the caller may override.
//
// Visual treatment: a themed illustration (token-only SVG) sits next to or
// above the text block. The block is announced to screen readers via
// `role="status"` + `aria-live="polite"`.

import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { EmptyStateIllustration } from "@/components/atoms/EmptyStateIllustration";
import { cn } from "@/lib/utils/cn";

type EmptyStateVariant =
  "default" | "speakers" | "schedule" | "sponsors" | "team" | "venue" | "faq";

type EmptyStateProps = {
  /** Visible heading. Defaults to a neutral Spanish "Próximamente". */
  title?: string;
  /** Visible description body. */
  description?: string;
  /**
   * Custom illustration node. When omitted, the default
   * EmptyStateIllustration is rendered with the variant below.
   */
  illustration?: ReactNode;
  /**
   * Drives the default illustration when `illustration` is not provided.
   */
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
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="empty-state"
      data-variant={variant}
      className={cn(
        "flex flex-col items-center justify-center gap-5 rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] p-8 text-center",
        className
      )}
    >
      {illustration ?? <EmptyStateIllustration variant={variant} />}
      <div className="flex flex-col items-center gap-2">
        <Heading level={headingLevel} visualLevel={3}>
          {title}
        </Heading>
        <p className="max-w-prose text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
      {actionHref && actionLabel ? (
        <Button as="a" href={actionHref} variant="primary" size="md">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
