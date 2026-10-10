// Top speaker label: marks the speakers the organizers flag as Top Speaker in
// Sessionize. Callers set it over a portrait's corner rather than in the
// caption, so a flagged card keeps its name, tagline and talk level with the
// unflagged cards beside it.
//
// The label sits on its own solid navy plate so it reads against any photo,
// with the square marker the sponsor tiers use. It is text, not a control:
// `pointer-events-none` lets a click fall through to the link underneath.

import { cn } from "@/lib/utils/cn";

type TopSpeakerBadgeProps = {
  /** Positions the label; the caller owns placement. */
  className?: string;
};

export function TopSpeakerBadge({ className }: TopSpeakerBadgeProps) {
  return (
    <span
      className={cn(
        "pointer-events-none inline-flex items-center gap-1.5 bg-[var(--color-surface-inverse)] px-2 py-1 text-step--1 font-semibold leading-none text-[var(--color-text-on-inverse)]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 flex-none bg-[var(--color-national-red-on-dark)]"
      />
      Top speaker
    </span>
  );
}
