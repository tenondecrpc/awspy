// Skeleton placeholder. CSS-only shimmer that respects
// `prefers-reduced-motion` via the global rule in `app/globals.css`.

import { cn } from "@/lib/utils/cn";

type SkeletonProps = {
  className?: string;
  /** Forces a specific width; defaults to 100%. */
  width?: number | string;
  /** Forces a specific height; defaults to a 1em line. */
  height?: number | string;
  /** When true, the skeleton renders as a circle (e.g. avatars). */
  circle?: boolean;
  /** Hidden text for assistive technology, e.g. "Cargando charlas". */
  label?: string;
};

export function Skeleton({
  className,
  width,
  height,
  circle,
  label,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width ?? "100%",
    height: height ?? "1em",
    borderRadius: circle ? "9999px" : "var(--radius-sm)",
  };
  return (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "block animate-pulse bg-[var(--color-surface-muted)]",
        className
      )}
      style={style}
    >
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
