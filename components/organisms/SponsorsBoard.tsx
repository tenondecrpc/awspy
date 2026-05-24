// Sponsors board organism. Groups sponsors by tier (Platinum -> Community)
// and renders the SponsorCard molecule. Falls back to an EmptyState when
// there are no sponsors.

import { Heading } from "@/components/atoms/Heading";
import { SponsorCard } from "@/components/molecules/SponsorCard";
import { EmptyState } from "@/components/organisms/EmptyState";
import { groupSponsorsByTier, type Sponsor } from "@/lib/content/sponsors";
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
  className?: string;
};

export function SponsorsBoard({
  sponsors,
  eventInfo,
  variant = "full",
  className,
}: SponsorsBoardProps) {
  if (sponsors.length === 0) {
    return (
      <EmptyState
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
    <div className={cn("space-y-12", className)}>
      {groups.map((group) => (
        <section key={group.tier} aria-labelledby={`tier-${group.tier}`}>
          <Heading
            id={`tier-${group.tier}`}
            level={2}
            visualLevel={3}
            className="mb-4"
          >
            {group.tier}
          </Heading>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {group.sponsors.map((s) => (
              <li key={s.id}>
                <SponsorCard sponsor={s} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
