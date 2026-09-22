// The open room on a sponsor board, drawn as a row of empty "Tu logo aquí"
// frames.
//
// The frames deliberately carry no tier and no amount: the board invites a
// company to ask, and the prospectus sent by mail is where the numbers live.
// A dashed, empty frame reads as "this space is for sale" without implying a
// sponsor nobody signed.
//
// The whole row is a single link. The frames are identical, so separate links
// would make a screen reader announce the same destination once per frame and
// a keyboard user tab through each of them.

import { cn } from "@/lib/utils/cn";

type SponsorLogoSlotsProps = {
  /** How many empty frames to draw. Renders nothing at zero. */
  count: number;
  /** Where the row sends the reader: the packages section or the mailto. */
  href: string;
  className?: string;
};

export function SponsorLogoSlots({
  count,
  href,
  className,
}: SponsorLogoSlotsProps) {
  if (count <= 0) return null;

  return (
    <a
      href={href}
      aria-label="Tu logo aquí: sumate como sponsor"
      className={cn(
        "group grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(160px,100%),1fr))]",
        className
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="flex h-[88px] items-center justify-center rounded-[4px] border border-dashed border-[var(--color-border-strong)] px-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] transition-colors group-hover:border-[var(--color-text-primary)] group-hover:text-[var(--color-text-primary)]"
        >
          Tu logo aquí
        </span>
      ))}
    </a>
  );
}
