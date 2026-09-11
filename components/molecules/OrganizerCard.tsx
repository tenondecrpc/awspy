// Organizer card molecule. A thumbnail (photo, or an initials placeholder)
// beside the name, the role, the optional bio paragraph, and social links
// rendered as pills.
//
// The layout is horizontal rather than the portrait shape SpeakerCard uses,
// because an organizer record carries a paragraph of prose that needs a
// readable measure, and because the committee photos are small headshots
// that a full-bleed square would only stretch.
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

      {/*
        Two columns: the thumbnail, then the text. The prose sits in its own
        row so it can span both columns on a phone - beside an 80px photo the
        measure would be a sliver - and tuck back under the name from `sm` up,
        where the card is wide enough for the indent to read as alignment.
        There the photo spans both rows, so the prose follows the role line
        directly instead of clearing the full height of the photo.
      */}
      <div className="grid flex-1 grid-cols-[auto_1fr] items-start gap-x-4 gap-y-3 p-4 sm:gap-x-5 sm:p-5">
        <div className="relative col-start-1 row-start-1 size-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] sm:row-span-2 sm:size-24">
          {organizer.photo ? (
            <Image
              src={organizer.photo}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--color-accent-strong)] sm:text-3xl"
            >
              {initials(organizer.name)}
            </div>
          )}
        </div>

        <div className="col-start-2 row-start-1 flex min-w-0 flex-col gap-1 self-center sm:self-start">
          <p className="text-base font-bold sm:text-lg">{organizer.name}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {organizer.role}
          </p>
        </div>

        {/* Skipped entirely when empty, so the grid gap adds no dead row. */}
        {organizer.bio || linkEntries.length > 0 ? (
          <div className="col-span-2 row-start-2 min-w-0 sm:col-span-1 sm:col-start-2">
            {organizer.bio ? (
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {organizer.bio}
              </p>
            ) : null}

            {linkEntries.length > 0 ? (
              <ul
                className={cn("flex flex-wrap gap-2", organizer.bio && "mt-3")}
              >
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
        ) : null}
      </div>
    </article>
  );
}
