// EyebrowPill atom. The small uppercase label that sits above a section
// title ("SPEAKERS", "AGENDA"). Distinct from `Badge`, which communicates
// state (registration open, sponsor tier) and is therefore semantically
// meaningful; this one is a typographic device for section rhythm.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { GlyphName } from "@/components/atoms/GlyphIcon";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";

type Tone = "default" | "muted" | "inverse" | "hero";

type EyebrowPillProps = {
  children: ReactNode;
  /** Matches the `tone` of the surrounding `Section`. */
  tone?: Tone;
  /** Optional decorative glyph rendered before the label. */
  glyph?: GlyphName;
  className?: string;
};

const TONE_CLASS: Record<Tone, string> = {
  default:
    "border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
  muted:
    "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-accent-strong)]",
  inverse: "glass-panel text-[var(--color-national-red-on-dark)]",
  hero: "glass-panel text-[var(--color-national-red-on-dark)]",
};

export function EyebrowPill({
  children,
  tone = "default",
  glyph,
  className,
}: EyebrowPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-1.5",
        "text-xs font-bold uppercase tracking-[0.14em]",
        TONE_CLASS[tone],
        className
      )}
    >
      {glyph ? <GlyphIcon name={glyph} size={14} /> : null}
      {children}
    </span>
  );
}
