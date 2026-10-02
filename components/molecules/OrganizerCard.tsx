"use client";

// Organizer card: square portrait on top, name, role, a three-line bio with a
// "Leer más" toggle, and the social links as small icon + label links. Without
// a photo the same square is filled with the initials, so adding the real
// photo later causes no layout shift.

import { useId, useState } from "react";
import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import { Frame } from "@/components/molecules/SectionPrimitives";
import { cn } from "@/lib/utils/cn";
import type { Organizer } from "@/lib/content/organizers";
import { tieLast } from "@/lib/utils/typography";

type OrganizerCardProps = {
  organizer: Organizer;
  /** Kept for call-site compatibility; the card no longer varies by position. */
  accentIndex?: number;
  className?: string;
};

type LinkKey = keyof NonNullable<Organizer["links"]>;

const SOCIAL: Record<LinkKey, { label: string; icon: GlyphName }> = {
  linkedin: { label: "LinkedIn", icon: "external" },
  twitter: { label: "Twitter", icon: "external" },
  github: { label: "GitHub", icon: "external" },
  website: { label: "Sitio", icon: "globe" },
};

/** A bio under this many characters fits the three-line clamp: no toggle. */
const CLAMP_THRESHOLD = 150;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function OrganizerCard({ organizer, className }: OrganizerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const bioId = useId();
  const linkEntries = (
    Object.entries(organizer.links ?? {}) as Array<[LinkKey, string | undefined]>
  ).filter(([, url]) => Boolean(url));
  const canExpand = (organizer.bio?.length ?? 0) > CLAMP_THRESHOLD;

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)]",
        className
      )}
    >
      {organizer.photo ? (
        <Frame
          label={organizer.name}
          photo={organizer.photo}
          className="aspect-square w-full"
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 100vw"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-square w-full items-center justify-center bg-[var(--color-surface-muted)] font-display text-step-4 text-[var(--color-text-primary)]"
        >
          {initials(organizer.name)}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="m-0 text-step-1 leading-tight">{tieLast(organizer.name)}</h3>
        <p className="m-0 mt-1 text-base font-semibold text-[var(--color-accent)]">
          {tieLast(organizer.role)}
        </p>

        {organizer.bio ? (
          <div className="mt-3">
            <p
              id={bioId}
              className={cn(
                "m-0 text-base leading-[1.55] text-[var(--color-text-secondary)]",
                !expanded && "line-clamp-3"
              )}
            >
              {tieLast(organizer.bio)}
            </p>
            {canExpand ? (
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={bioId}
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 inline-flex min-h-[var(--size-touch)] items-center text-base font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4"
              >
                {expanded ? "Leer menos" : "Leer más"}
              </button>
            ) : null}
          </div>
        ) : null}

        {linkEntries.length > 0 ? (
          <ul className="m-0 mt-auto flex list-none flex-wrap gap-x-5 p-0 pt-2">
            {linkEntries.map(([key, url]) => (
              <li key={key}>
                <a
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[var(--size-touch)] items-center gap-1.5 text-sm font-semibold text-[var(--color-text-primary)] hover:underline"
                >
                  <GlyphIcon name={SOCIAL[key].icon} size={16} />
                  {SOCIAL[key].label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
