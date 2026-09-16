// A confirmed sponsor, drawn as one tile of the sponsor board: logo, name and
// tier, linking to the sponsor's own site.
//
// The home page and the sponsors page render this same tile, so a sponsor
// looks and behaves identically on both — before this existed the home copy
// was a plain div and the logos there were not clickable at all. It shares its
// geometry with `SponsorSlotCard` so confirmed sponsors and open tiers line up
// in one grid.

import { cn } from "@/lib/utils/cn";
import { TIER_LABEL_ES } from "@/lib/utils/sponsor-tiers";
import type { Sponsor } from "@/lib/content/sponsors";

type SponsorTileProps = {
  sponsor: Sponsor;
  className?: string;
};

export function SponsorTile({ sponsor, className }: SponsorTileProps) {
  const tier = TIER_LABEL_ES[sponsor.tier];

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${sponsor.name} (sponsor ${tier})`}
      className={cn(
        "flex min-h-[152px] flex-col items-center justify-center gap-3",
        "border-b border-r border-[var(--color-border-subtle)] px-[18px] py-[34px]",
        "text-center text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-muted)]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="h-[54px] w-[54px] bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${sponsor.logo.light})` }}
      />
      <span className="text-[14px] font-bold tracking-[-0.01em]">
        {sponsor.name}
      </span>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {tier}
      </span>
    </a>
  );
}
