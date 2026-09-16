// An open sponsorship tier, drawn as an empty logo slot marked DISPONIBLE.
//
// It replaces the invented placeholder brands the boards used to show while
// no sponsor was confirmed: a dashed, empty frame reads as "this space is for
// sale" instead of implying a sponsor nobody signed. The tile keeps the
// geometry of a confirmed sponsor tile so both sit in the same grid, and the
// tier name is always spelled out next to its color chip, so the color
// reinforces the tier and never carries it alone (constitution Principle VI).

import { cn } from "@/lib/utils/cn";
import type { SponsorTier } from "@/lib/content/sponsors";

const TIER_ES: Record<SponsorTier, string> = {
  Diamante: "Diamante",
  Platinum: "Platino",
  Gold: "Oro",
  Silver: "Plata",
  Bronze: "Bronce",
  Community: "Comunidad",
};

// Tier tokens are only ever used as a small color chip here, which is the
// pairing verified in the palette contract.
const TIER_DOT: Record<SponsorTier, string> = {
  Diamante: "var(--color-tier-diamante)",
  Platinum: "var(--color-tier-platinum)",
  Gold: "var(--color-tier-gold)",
  Silver: "var(--color-tier-silver)",
  Bronze: "var(--color-tier-bronze)",
  Community: "var(--color-tier-community)",
};

type SponsorSlotCardProps = {
  tier: SponsorTier;
  /** Written price from the prospectus ("USD 3.000"). */
  price?: string;
  /** Where the slot sends the reader: the packages section or the mailto. */
  href: string;
  className?: string;
};

export function SponsorSlotCard({
  tier,
  price,
  href,
  className,
}: SponsorSlotCardProps) {
  const label = TIER_ES[tier];

  return (
    <a
      href={href}
      aria-label={
        price
          ? `Cupo de sponsor ${label} disponible, ${price}`
          : `Cupo de sponsor ${label} disponible`
      }
      className={cn(
        "group flex min-h-[152px] flex-col items-center justify-center gap-3",
        "border-b border-r border-[var(--color-border-subtle)] px-[18px] py-[34px]",
        "text-center transition-colors hover:bg-[var(--color-surface-muted)]",
        className
      )}
    >
      <span className="flex h-[54px] w-full max-w-[140px] items-center justify-center border border-dashed border-[var(--color-border-subtle)] font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] transition-colors group-hover:border-[var(--color-text-primary)] group-hover:text-[var(--color-text-primary)]">
        Disponible
      </span>
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 flex-none rounded-[2px]"
          style={{ background: TIER_DOT[tier] }}
        />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          {label}
        </span>
      </span>
      {price ? (
        <span className="text-[13px] font-semibold text-[var(--color-text-secondary)]">
          {price}
        </span>
      ) : null}
    </a>
  );
}
