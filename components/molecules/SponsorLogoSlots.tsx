// The open room on a sponsor board, drawn as a row of empty "Tu logo aquí"
// frames, one per tier that still takes sponsors.
//
// The frames deliberately carry no tier and no amount: the board invites a
// company to ask, and the prospectus sent by mail is where the numbers live.
// A dashed, empty frame the size of a logo plate reads as "this space is for
// sale" without implying a sponsor nobody signed.
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
    <div className={className}>
      <p className="m-0 mb-3 text-sm text-[var(--color-text-secondary)]">
        {count === 1
          ? "Queda un nivel de patrocinio abierto."
          : `Quedan ${count} niveles de patrocinio abiertos.`}
      </p>
      <a href={href} aria-label="Sumá tu organización" className="group block">
        <span className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4")}>
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="flex h-[72px] min-w-0 items-center justify-center border border-dashed border-[var(--color-border-strong)] px-3 text-center text-sm font-semibold text-[var(--color-text-secondary)] transition-colors duration-150 group-hover:border-[var(--color-text-primary)] group-hover:text-[var(--color-text-primary)] sm:h-[88px]"
            >
              Tu logo aquí
            </span>
          ))}
        </span>
        <span className="mt-3 inline-block text-sm font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] underline-offset-4">
          Sumá tu organización
        </span>
      </a>
    </div>
  );
}
