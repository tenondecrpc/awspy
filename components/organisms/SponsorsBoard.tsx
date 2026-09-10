// Sponsors board organism. Groups sponsors by tier (Platinum -> Community)
// and renders the SponsorCard molecule. Falls back to a themed empty state
// when there are no sponsors and to a skeleton when isLoading is true.

import { Heading } from "@/components/atoms/Heading";
import { LoadingGrid } from "@/components/atoms/LoadingGrid";
import { SponsorCard } from "@/components/molecules/SponsorCard";
import { EmptyState } from "@/components/organisms/EmptyState";
import {
  groupSponsorsByTier,
  type Sponsor,
  type SponsorTier,
} from "@/lib/content/sponsors";
import type { EventInfo } from "@/lib/content/event-info";
import { cn } from "@/lib/utils/cn";

type SponsorsBoardProps = {
  sponsors: Sponsor[];
  eventInfo: EventInfo;
  /**
   * `full`: tier-grouped layout used on `/sponsors`.
   * `compact`: dense single-row preview used on the home page.
   */
  variant?: "full" | "compact";
  /** When true and the list is empty, render a skeleton instead. */
  isLoading?: boolean;
  className?: string;
};

// Decorative rule under each tier heading. The tier name is always written
// out next to it, so the tint is reinforcement rather than the only signal.
// Text keeps its own AA-verified token; these values are only ever used as a
// background, which is the pairing verified in the palette contract.
const TIER_RULE: Record<SponsorTier, string> = {
  Platinum: "var(--color-tier-platinum)",
  Gold: "var(--color-tier-gold)",
  Silver: "var(--color-tier-silver)",
  Bronze: "var(--color-tier-bronze)",
  Community: "var(--color-tier-community)",
};

export function SponsorsBoard({
  sponsors,
  eventInfo,
  variant = "full",
  isLoading = false,
  className,
}: SponsorsBoardProps) {
  if (isLoading && sponsors.length === 0) {
    return (
      <LoadingGrid
        columns={variant === "compact" ? 6 : 3}
        rows={variant === "compact" ? 1 : 2}
        itemAspectRatio={4 / 3}
        loadingLabel="Cargando sponsors"
        className={className}
      />
    );
  }

  if (sponsors.length === 0) {
    return (
      <EmptyState
        variant="sponsors"
        title="Sumate como sponsor"
        description="Aún no hay sponsors confirmados. Si querés auspiciar el primer Community Day en Paraguay, escribinos."
        actionHref={`mailto:${eventInfo.contactEmail}?subject=Sponsor%20AWS%20Community%20Day%20Paraguay`}
        actionLabel="Quiero ser sponsor"
      />
    );
  }

  if (variant === "compact") {
    return (
      <ul
        className={cn(
          "flex flex-wrap items-center justify-center gap-6",
          className
        )}
        aria-label="Sponsors"
      >
        {sponsors.map((s) => (
          <li key={s.id}>
            <SponsorCard sponsor={s} variant="compact" />
          </li>
        ))}
      </ul>
    );
  }

  const groups = groupSponsorsByTier(sponsors);
  return (
    <div className={cn("space-y-16", className)}>
      {groups.map((group) => (
        <section key={group.tier} aria-labelledby={`tier-${group.tier}`}>
          <div className="mb-8 flex flex-col items-center gap-3">
            <Heading id={`tier-${group.tier}`} level={2} visualLevel={4}>
              {group.tier}
            </Heading>
            <span
              aria-hidden="true"
              className="h-1 w-16 rounded-[var(--radius-pill)]"
              style={{ background: TIER_RULE[group.tier] }}
            />
          </div>
          <ul className="grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {group.sponsors.map((s) => (
              <li key={s.id} className="h-full">
                <SponsorCard sponsor={s} className="h-full" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
