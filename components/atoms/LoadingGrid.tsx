// LoadingGrid atom. Skeleton building block used by SpeakersGrid, ScheduleGrid,
// SponsorsBoard, and OrganizersGrid while their underlying data resolves.
//
// The grid mirrors the populated layout (column count, gap, item aspect
// ratio) to eliminate CLS when content swaps in. The wrapper exposes
// `role="status"` and `aria-busy="true"`; the visually hidden Spanish label
// is announced once. The pulse animation is suppressed under
// `prefers-reduced-motion: reduce` by the global rule in `app/globals.css`.

import { Skeleton } from "@/components/atoms/Skeleton";
import { cn } from "@/lib/utils/cn";

type Columns = 1 | 2 | 3 | 4 | 6;

type LoadingGridProps = {
  /** Number of columns at the lg breakpoint. */
  columns: Columns;
  /** Number of rows of skeletons to render. */
  rows: number;
  /** Aspect ratio (width / height) of each item. Defaults to 4/3. */
  itemAspectRatio?: number;
  /** Visually hidden Spanish label (e.g. "Cargando speakers"). */
  loadingLabel: string;
  /** Gap between items. */
  gap?: "sm" | "md" | "lg";
  className?: string;
};

const GAP_CLASS: Record<NonNullable<LoadingGridProps["gap"]>, string> = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

const COLUMNS_CLASS: Record<Columns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  // Two-up on phones: the only consumer is the portrait speakers grid, whose
  // cards are too tall to stack one per row.
  4: "grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export function LoadingGrid({
  columns,
  rows,
  itemAspectRatio = 4 / 3,
  loadingLabel,
  gap = "md",
  className,
}: LoadingGridProps) {
  const totalItems = columns * rows;

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-testid="loading-grid"
      data-columns={columns}
      data-rows={rows}
      className={cn("grid", COLUMNS_CLASS[columns], GAP_CLASS[gap], className)}
    >
      <span className="sr-only">{loadingLabel}</span>
      {Array.from({ length: totalItems }, (_, i) => (
        <div
          key={i}
          data-testid="loading-grid-item"
          className="rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] p-4 shadow-sm"
        >
          <Skeleton
            className="skeleton-pulse w-full"
            height={`calc(100% * ${1 / itemAspectRatio})`}
            width="100%"
          />
          <div className="mt-3 flex flex-col gap-2">
            <Skeleton className="skeleton-pulse" height={14} width="80%" />
            <Skeleton className="skeleton-pulse" height={12} width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
}
