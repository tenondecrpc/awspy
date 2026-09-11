"use client";

// Sponsor card molecule. Renders the sponsor's logo (with name fallback when
// the image fails to load) plus tier badge and link to the sponsor's site.
//
// The tier tints the accent border and the top stripe; the tier name is still
// spelled out in the badge, so the color is reinforcement and never the only
// signal (constitution Principle VI). The whole card is clickable through a
// stretched overlay on the single link, which keeps one tab stop per sponsor.

import { useState, type CSSProperties } from "react";
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
  Diamante: "tier-diamante",
  Platinum: "tier-platinum",
  Gold: "tier-gold",
  Silver: "tier-silver",
  Bronze: "tier-bronze",
  Community: "tier-community",
};

// Tier tokens are only ever used as a background here, which is the pairing
// verified in the palette contract.
const TIER_ACCENT: Record<SponsorTier, { accent: string; glow: string }> = {
  Diamante: {
    accent: "var(--color-tier-diamante)",
    glow: "var(--color-glow-accent)",
  },
  Platinum: {
    accent: "var(--color-tier-platinum)",
    glow: "var(--color-glow-accent)",
  },
  Gold: { accent: "var(--color-tier-gold)", glow: "var(--color-glow-action)" },
  Silver: {
    accent: "var(--color-tier-silver)",
    glow: "var(--color-glow-accent)",
  },
  Bronze: { accent: "var(--color-tier-bronze)", glow: "var(--color-glow-red)" },
  Community: {
    accent: "var(--color-tier-community)",
    glow: "var(--color-glow-accent)",
  },
};

export function SponsorCard({
  sponsor,
  variant = "full",
  className,
}: SponsorCardProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  const isCompact = variant === "compact";
  const logoSize = isCompact ? 120 : 240;
  const logoSrc = sponsor.logo.light;
  const showLogo = !logoFailed;
  const { accent, glow } = TIER_ACCENT[sponsor.tier];

  const logo = showLogo ? (
    <Image
      src={logoSrc}
      alt={sponsor.name}
      width={logoSize}
      height={logoSize}
      sizes={`${logoSize}px`}
      className={cn(
        "w-auto object-contain",
        isCompact ? "max-h-[48px]" : "max-h-[64px]"
      )}
      onError={() => setLogoFailed(true)}
    />
  ) : (
    // Visible name fallback when the logo URL fails (Edge Case in spec).
    <span className="text-lg font-bold">{sponsor.name}</span>
  );

  if (isCompact) {
    return (
      <article
        className={cn(
          "flex items-center justify-center px-2 py-1",
          "opacity-80 transition hover:opacity-100",
          className
        )}
      >
        <Link
          href={sponsor.url}
          external
          aria-label={`${sponsor.name} (sponsor ${sponsor.tier})`}
        >
          {logo}
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "media-card relative flex h-full flex-col items-center gap-4 overflow-hidden",
        "rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] pb-6 text-center shadow-sm",
        className
      )}
      style={
        {
          "--card-accent": accent,
          "--card-glow": glow,
        } as CSSProperties
      }
    >
      <span
        aria-hidden="true"
        className="h-1 w-full shrink-0 bg-[var(--card-accent)]"
      />

      <Link
        href={sponsor.url}
        external
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-4 px-6 pt-2",
          "after:absolute after:inset-0 after:content-['']"
        )}
        aria-label={`${sponsor.name} (sponsor ${sponsor.tier})`}
      >
        <span className="flex h-[72px] items-center justify-center">
          {logo}
        </span>
        <span className="text-base font-bold text-[var(--color-text-primary)]">
          {sponsor.name}
        </span>
      </Link>

      <Badge variant={TIER_VARIANT[sponsor.tier]}>{sponsor.tier}</Badge>

      {sponsor.description ? (
        <p className="px-6 text-sm text-[var(--color-text-secondary)]">
          {sponsor.description}
        </p>
      ) : null}
    </article>
  );
}
