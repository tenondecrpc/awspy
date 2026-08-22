"use client";

// Sponsor card molecule. Renders the sponsor's logo (with name fallback when
// the image fails to load) plus tier badge and link to the sponsor's site.

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge";
import { Link } from "@/components/atoms/Link";
import { cn } from "@/lib/utils/cn";
import type { Sponsor, SponsorTier } from "@/lib/content/sponsors";

type SponsorCardProps = {
  sponsor: Sponsor;
  variant?: "full" | "compact";
  className?: string;
};

const TIER_VARIANT: Record<
  SponsorTier,
  Parameters<typeof Badge>[0]["variant"]
> = {
  Platinum: "tier-platinum",
  Gold: "tier-gold",
  Silver: "tier-silver",
  Bronze: "tier-bronze",
  Community: "tier-community",
};

export function SponsorCard({
  sponsor,
  variant = "full",
  className,
}: SponsorCardProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  const logoSize = variant === "compact" ? 80 : 160;
  const logoSrc = sponsor.logo.light;
  const showLogo = !logoFailed;

  return (
    <article
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 text-center shadow-sm",
        variant === "compact" && "p-2 shadow-none bg-transparent",
        className
      )}
    >
      <Link
        href={sponsor.url}
        external
        className="flex flex-col items-center gap-2"
        aria-label={`${sponsor.name} (sponsor ${sponsor.tier})`}
      >
        {showLogo ? (
          <Image
            src={logoSrc}
            alt={sponsor.name}
            width={logoSize}
            height={logoSize}
            sizes={`${logoSize}px`}
            className="h-auto max-h-[80px] w-auto object-contain"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          // Visible name fallback when the logo URL fails (Edge Case in spec).
          <span className="text-base font-bold">{sponsor.name}</span>
        )}
        {variant === "full" ? (
          <span className="font-semibold">{sponsor.name}</span>
        ) : null}
      </Link>
      {variant === "full" ? (
        <Badge variant={TIER_VARIANT[sponsor.tier]}>{sponsor.tier}</Badge>
      ) : null}
      {variant === "full" && sponsor.description ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {sponsor.description}
        </p>
      ) : null}
    </article>
  );
}
