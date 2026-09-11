// Stat tile molecule. One headline figure: a large value above a short label.
// Used by the home page's "Esperamos contar con" band.
//
// The value keeps the font's proportional figures on purpose - `tabular-nums`
// gives every digit the width of a zero, which reads loose at display sizes.
// Reserve tabular figures for columns of numbers that must align vertically.
//
// There is no delta and no sparkline: these are projections for a first
// edition, not a measurement tracked over time.

import { cn } from "@/lib/utils/cn";

type StatTileProps = {
  /** The figure as it reads, including any "+" ("200+", "3", "1"). */
  value: string;
  /** Short sentence-case label, no trailing colon. */
  label: string;
  className?: string;
};

export function StatTile({ value, label, className }: StatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-[var(--radius-lg)]",
        "border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]",
        "px-3 py-5 text-center",
        className
      )}
    >
      <span className="text-3xl font-bold leading-none text-[var(--color-accent-strong)] sm:text-4xl">
        {value}
      </span>
      <span className="text-xs font-medium text-[var(--color-text-secondary)] sm:text-sm">
        {label}
      </span>
    </div>
  );
}
