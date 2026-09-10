// Organizer card molecule. Portrait card with the photo (or an initials
// placeholder), the name, the role, and social links rendered as pills.
//
// Unlike SpeakerCard this one is not a single stretched link: an organizer
// has no detail page, and the only destinations are the social links, so
// each stays its own tab stop.
//
// The photo comes from the organizer record (a Sessionize-hosted URL) or from
// a file under `public/team/<slug>.jpg`. When there is no photo the same
// square is filled with the initials, so uploading the real photos later
// causes no layout shift.

import type { CSSProperties } from "react";
import Image from "next/image";
import { Link } from "@/components/atoms/Link";
import { cn } from "@/lib/utils/cn";
import type { Organizer } from "@/lib/content/organizers";

type OrganizerCardProps = {
  organizer: Organizer;
  /** Position in the list. Selects which accent the card border uses. */
  accentIndex?: number;
  className?: string;
};

const SOCIAL_LABELS: Record<keyof NonNullable<Organizer["links"]>, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter",
  github: "GitHub",
  website: "Sitio",
};

// Decorative, matching the two-step beat used by the speakers grid.
const ACCENTS = [
  { accent: "var(--color-action)", glow: "var(--color-glow-action)" },
  { accent: "var(--color-national-red)", glow: "var(--color-glow-red)" },
] as const;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function OrganizerCard({
  organizer,
  accentIndex = 0,
  className,
}: OrganizerCardProps) {
  const linkEntries = (
    Object.entries(organizer.links ?? {}) as Array<
      [keyof typeof SOCIAL_LABELS, string | undefined]
    >
  ).filter(([, url]) => Boolean(url));

  const { accent, glow } = ACCENTS[accentIndex % ACCENTS.length];

  return (
    <article
      className={cn(
        "media-card relative flex h-full flex-col overflow-hidden",
        "rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] shadow-sm",
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

      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-accent-soft)]">
        {organizer.photo ? (
          <Image
            src={organizer.photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-4xl font-bold text-[var(--color-accent-strong)] sm:text-5xl"
          >
            {initials(organizer.name)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <p className="text-base font-bold sm:text-lg">{organizer.name}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {organizer.role}
        </p>

        {linkEntries.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {linkEntries.map(([key, url]) => (
              <li key={key}>
                <Link
                  href={url as string}
                  external
                  className={cn(
                    "inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold",
                    "border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
                    "hover:border-[var(--card-accent)] hover:text-[var(--color-accent)]"
                  )}
                >
                  {SOCIAL_LABELS[key]}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
