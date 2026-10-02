// The open room on a sponsor board, said plainly: one sentence and one link.
//
// It carries no tier and no amount: the board invites a company to ask, and
// the prospectus sent by mail is where the numbers live. `count` is how many
// tiers still take sponsors.

import { cn } from "@/lib/utils/cn";

type SponsorLogoSlotsProps = {
  /** How many tiers still have room. Renders nothing at zero. */
  count: number;
  /** Where the link sends the reader: the packages section or the mailto. */
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
    <p
      className={cn(
        "m-0 max-w-[40rem] text-step-0 text-[var(--color-text-secondary)]",
        className
      )}
    >
      {count === 1
        ? "Queda un nivel de patrocinio abierto. "
        : `Quedan ${count} niveles de patrocinio abiertos. `}
      <a
        href={href}
        className="inline-flex min-h-[var(--size-touch)] items-center font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]"
      >
        Sumá tu organización
      </a>
    </p>
  );
}
