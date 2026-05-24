// Empty-state organism. Used wherever an external data source returns no
// content (Sessionize empty, sponsors not yet seeded, schedule not yet
// published, etc.). Spanish copy by default; the caller may override.

import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  /** Visible heading. Defaults to a neutral Spanish "Próximamente". */
  title?: string;
  /** Visible description body. */
  description?: string;
  /** Optional inline icon to the left of the title. */
  icon?: ReactNode;
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
  icon,
  actionHref,
  actionLabel,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] p-8 text-center",
        className
      )}
    >
      {icon ? <div aria-hidden="true">{icon}</div> : null}
      <Heading level={headingLevel} visualLevel={3}>
        {title}
      </Heading>
      <p className="max-w-prose text-[var(--color-text-secondary)]">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Button as="a" href={actionHref} variant="secondary" size="md">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
