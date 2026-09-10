// Speaker card molecule. Portrait, photo-dominant card: the headshot fills
// the top of the card, the talk title is revealed over it on hover or on
// keyboard focus, and the name plus tagline sit on the card surface below.
//
// Design notes:
//  - One link per card. The name anchor is stretched over the whole card with
//    an `::after` overlay, so the card is fully clickable but still exposes a
//    single tab stop and a single accessible name (the speaker's full name).
//  - The talk title lives in the DOM at all times (the scrim animates
//    `opacity`), so assistive technology reads it whatever the visual state
//    is, and touch devices - which have no hover - always show it.
//  - The accent border cycles through palette tokens purely for rhythm. It
//    carries no meaning, so no information is communicated by color alone.

import type { CSSProperties } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils/cn";
import type { Speaker } from "@/lib/api/sessionize";

type SpeakerCardProps = {
  speaker: Speaker;
  /** Path prefix for the detail link (e.g. `/speakers` or
   *  `/editions/2025/speakers`). */
  basePath?: string;
  /** Position in the list. Selects which accent the card border uses. */
  accentIndex?: number;
  className?: string;
};

// Decorative only, and deliberately just two steps: the palette's two blues
// are close enough that a three-step cycle read as an inconsistency rather
// than a pattern. Alternating flag blue and Paraguayan red gives a row of
// four cards a clear beat.
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

export function SpeakerCard({
  speaker,
  basePath = "/speakers",
  accentIndex = 0,
  className,
}: SpeakerCardProps) {
  const detailHref = `${basePath}/${speaker.slug}`;
  const talkTitle = speaker.sessions?.find((s) => s.name)?.name;
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

      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-accent-soft)]">
        {speaker.profilePicture ? (
          <Image
            src={speaker.profilePicture}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-5xl font-bold text-[var(--color-accent-strong)]"
          >
            {initials(speaker.fullName)}
          </div>
        )}

        {speaker.isTopSpeaker ? (
          <Badge variant="info" className="absolute right-3 top-3">
            Top speaker
          </Badge>
        ) : null}

        {talkTitle ? (
          <div className="media-card__scrim pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 pt-10">
            <p className="text-sm font-semibold text-[var(--color-text-on-hero)]">
              <span className="sr-only">Charla: </span>
              {talkTitle}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <NextLink
          href={detailHref}
          className={cn(
            "text-base font-bold sm:text-lg",
            "text-[var(--color-text-primary)]",
            "after:absolute after:inset-0 after:content-['']",
            "hover:text-[var(--color-accent)]"
          )}
        >
          {speaker.fullName}
        </NextLink>
        {speaker.tagLine ? (
          // Sessionize taglines run from two words to four lines. Clamping
          // keeps the grid even; the full text is on the detail page.
          <p className="line-clamp-2 text-sm text-[var(--color-text-secondary)]">
            {speaker.tagLine}
          </p>
        ) : null}
      </div>
    </article>
  );
}
