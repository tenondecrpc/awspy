// Placeholder atom. Reserves space with an explicit aspect ratio and renders
// a token-themed background for cases where the final image is not yet
// available under `public/assets/`. When the asset later exists, the consumer
// swaps to `next/image` at the same dimensions, so there is no layout shift.
//
// Contract: specs/002-visual-refresh/contracts/public-assets.md.

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

type PlaceholderKind = "avatar" | "logo" | "cover" | "hero";

type PlaceholderProps = {
  /**
   * Visual treatment. `avatar` is rounded, the others are rectangular with
   * the radius derived from the size.
   */
  kind: PlaceholderKind;
  /**
   * Numeric aspect ratio (width / height). Defaults to a sensible value per
   * `kind` if omitted: avatar=1, logo=4, cover=16/9, hero=21/9.
   */
  aspectRatio?: number;
  /**
   * Optional short label rendered inside the placeholder (e.g. organizer
   * initials, sponsor name). When provided the wrapper is a labeled block;
   * when omitted the wrapper is `aria-hidden="true"`.
   */
  label?: string;
  className?: string;
};

const DEFAULT_ASPECT_RATIO: Record<PlaceholderKind, number> = {
  avatar: 1,
  logo: 4,
  cover: 16 / 9,
  hero: 21 / 9,
};

const KIND_CLASS: Record<PlaceholderKind, string> = {
  avatar:
    "rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
  logo: "rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]",
  cover:
    "rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]",
  hero: "bg-[var(--color-surface-hero)] text-[var(--color-text-on-hero)]",
};

export function Placeholder({
  kind,
  aspectRatio,
  label,
  className,
}: PlaceholderProps) {
  const ratio = aspectRatio ?? DEFAULT_ASPECT_RATIO[kind];
  const style: CSSProperties = { aspectRatio: ratio.toString() };

  return (
    <div
      data-testid="placeholder"
      data-kind={kind}
      aria-hidden={label ? undefined : "true"}
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn(
        "flex w-full items-center justify-center overflow-hidden text-sm font-semibold",
        KIND_CLASS[kind],
        className
      )}
      style={style}
    >
      {label ? <span>{label}</span> : null}
    </div>
  );
}
