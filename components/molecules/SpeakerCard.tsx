// Speaker card molecule. An editorial entry, not a boxed card: the portrait
// sits on the paper with no frame, and under it come the name in the display
// serif, the tagline and the talk title, all always visible (touch screens have
// no hover, and a hover-only title is invisible to most readers).
//
// Design notes:
//  - One link per card. The name anchor is stretched over the whole entry with
//    an `::after` overlay, so the entry is fully clickable but still exposes a
//    single tab stop and a single accessible name (the speaker's full name).
//  - Every portrait is a square. The source photos are square (Sessionize
//    serves 400x400), so a square frame shows each one whole: nothing is
//    cropped into a close-up or stretched, and all speakers carry equal weight.
//    `accentIndex` is kept for call-site compatibility and no longer varies
//    anything.
//  - No "Top speaker" marker: a label on only some cards moved their names out of line with the rest and made some speakers weigh more than others.

import Image from "next/image";
import NextLink from "next/link";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { cn } from "@/lib/utils/cn";
import type { Speaker } from "@/lib/api/sessionize";
import { tieLast } from "@/lib/utils/typography";

type SpeakerCardProps = {
  speaker: Speaker;
  /** Path prefix for the detail link (e.g. `/speakers` or
   *  `/editions/2025/speakers`). */
  basePath?: string;
  /** When the talk is scheduled: start time label and room name. */
  talkSlot?: { time: string; room: string };
  /** Kept for call-site compatibility; the card no longer varies by position. */
  accentIndex?: number;
  className?: string;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function SpeakerCard({
  speaker,
  basePath = "/speakers",
  talkSlot,
  className,
}: SpeakerCardProps) {
  const detailHref = `${basePath}/${speaker.slug}`;
  const talkTitle = speaker.sessions?.find((s) => s.name)?.name;

  return (
    // The card spans four rows of the parent grid (portrait, name, tagline,
    // talk) as a subgrid, so each field sits at the same height across a whole
    // row of cards however many lines the others take.
    <article
      className={cn(
        "group relative row-span-4 grid grid-rows-subgrid gap-y-0",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface-muted)]">
        {speaker.profilePicture ? (
          <Image
            src={speaker.profilePicture}
            alt=""
            fill
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 33vw, 50vw"
            className="object-cover object-[50%_20%]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center font-display text-step-4 text-[var(--color-text-secondary)]"
          >
            {initials(speaker.fullName)}
          </div>
        )}
      </div>

      <>
        <h3 className="m-0 mt-3 font-semibold text-step-2 leading-[1.08]">
          <NextLink
            href={detailHref}
            className={cn(
              "text-[var(--color-text-primary)]",
              "after:absolute after:inset-0 after:content-['']",
              "underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-[var(--color-national-red)]"
            )}
          >
            {speaker.fullName}
          </NextLink>
        </h3>
        {speaker.tagLine ? (
          // Sessionize taglines run from two words to four lines. Clamping
          // keeps the rhythm; the full text is on the detail page.
          <p className="m-0 mt-1.5 line-clamp-3 text-step--1 text-[var(--color-text-secondary)]">
            {tieLast(speaker.tagLine)}
          </p>
        ) : (
          <div aria-hidden="true" />
        )}
        {talkTitle ? (
          // No filled box: a box sized by its text reads as empty space under
          // the shorter titles. A hairline rule opens the talk instead.
          <div className="mt-3 flex flex-col gap-2 border-t border-[var(--color-border-strong)] pt-3">
            <p className="m-0 text-step--1 font-semibold leading-[1.35] text-[var(--color-text-primary)] sm:text-step-0">
              <span className="sr-only">Charla: </span>
              {tieLast(talkTitle)}
            </p>
            {talkSlot ? (
              <p className="m-0 flex flex-wrap gap-x-3 gap-y-1 text-step--1 text-[var(--color-text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <GlyphIcon name="clock" size={16} />
                  {talkSlot.time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GlyphIcon name="pin" size={16} />
                  {tieLast(talkSlot.room)}
                </span>
              </p>
            ) : null}
          </div>
        ) : (
          <div aria-hidden="true" />
        )}
      </>
    </article>
  );
}
