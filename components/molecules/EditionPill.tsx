// Compact pill that displays the edition year. Used in the header next to
// the brand mark and in the footer.

import { cn } from "@/lib/utils/cn";

type EditionPillProps = {
  year: string;
  className?: string;
};

export function EditionPill({ year, className }: EditionPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--color-accent-strong)]",
        className
      )}
      aria-label={`Edición ${year}`}
    >
      {year}
    </span>
  );
}
