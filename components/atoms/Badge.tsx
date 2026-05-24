// Badge atom for status flags and sponsor tiers. Color is always paired with
// the visible text label to satisfy constitution Principle VI (no
// color-only state). Variants do not change the rendered text content; the
// caller decides what label to show.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "tier-platinum"
  | "tier-gold"
  | "tier-silver"
  | "tier-bronze"
  | "tier-community";

type BadgeProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

const VARIANT_CLASS: Record<Variant, string> = {
  neutral:
    "bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]",
  info: "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
  success: "bg-[#E5F5EA] text-[var(--color-success)]",
  warning: "bg-[#FFF1DD] text-[var(--color-warning)]",
  danger: "bg-[#FCE4E2] text-[var(--color-danger)]",
  "tier-platinum":
    "bg-[var(--color-tier-platinum)] text-[var(--color-text-on-inverse)]",
  "tier-gold":
    "bg-[var(--color-tier-gold)] text-[var(--color-text-on-inverse)]",
  "tier-silver":
    "bg-[var(--color-tier-silver)] text-[var(--color-text-on-inverse)]",
  "tier-bronze":
    "bg-[var(--color-tier-bronze)] text-[var(--color-text-on-inverse)]",
  "tier-community":
    "bg-[var(--color-tier-community)] text-[var(--color-text-on-inverse)]",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        VARIANT_CLASS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
