// Schedule slot molecule. Renders a single session card with time, room,
// title, and speakers.
//
// Each room gets its own accent, assigned by the parent grid and applied as
// a stripe down the left edge plus the tint of the room glyph. The accent is
// decorative: the room name is always spelled out next to it, so nothing is
// communicated by color alone (constitution Principle VI). Only the stripe
// and the glyph are tinted - the time and the room label keep their
// AA-verified text tokens.

import type { CSSProperties } from "react";
import NextLink from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { formatTimeRange } from "@/lib/utils/datetime";
import { cn } from "@/lib/utils/cn";

export type ScheduleSlotData = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  roomName: string;
  isPlenum?: boolean;
  speakers: { id: string; name: string; slug?: string }[];
};

type ScheduleSlotProps = {
  slot: ScheduleSlotData;
  /** Path prefix for speaker detail links. */
  speakerBasePath?: string;
  /** Selects the room accent. Rooms keep the same accent all day. */
  accentIndex?: number;
  className?: string;
};

// Five visually distinguishable steps. `--color-accent` is deliberately
// absent: it is too close to `--color-action` to tell two rooms apart.
const ACCENTS = [
  { accent: "var(--color-action)", glow: "var(--color-glow-action)" },
  { accent: "var(--color-national-red)", glow: "var(--color-glow-red)" },
  { accent: "var(--color-tier-community)", glow: "var(--color-glow-accent)" },
  { accent: "var(--color-tier-gold)", glow: "var(--color-glow-action)" },
  { accent: "var(--color-tier-bronze)", glow: "var(--color-glow-red)" },
] as const;

export function ScheduleSlot({
  slot,
  speakerBasePath = "/speakers",
  accentIndex = 0,
  className,
}: ScheduleSlotProps) {
  const { accent, glow } = ACCENTS[accentIndex % ACCENTS.length];

  return (
    <article
      className={cn(
        "media-card relative overflow-hidden rounded-[var(--radius-lg)]",
        "bg-[var(--color-surface-elevated)] shadow-sm",
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
        className="absolute inset-y-0 left-0 w-1.5 bg-[var(--card-accent)]"
      />

      <div className="flex flex-col gap-3 py-5 pl-7 pr-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tinted rather than neutral so the time leads the card, the way
              the Community Day family styles it. It uses the accent pair
              rather than `--card-accent`: the red half of that alternation
              does not hold white text at AA. */}
          <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--color-accent-strong)]">
            <GlyphIcon name="clock" size={15} />
            <time dateTime={slot.startsAt}>
              {formatTimeRange(slot.startsAt, slot.endsAt)}
            </time>
          </span>

          <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
            <GlyphIcon
              name="pin"
              size={15}
              className="text-[var(--card-accent)]"
            />
            {slot.roomName}
          </span>

          {slot.isPlenum ? <Badge variant="info">Plenaria</Badge> : null}
        </div>

        <h3 className="text-lg font-bold sm:text-xl">{slot.title}</h3>

        {slot.speakers.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {slot.speakers.map((sp) => (
              <li key={sp.id} className="flex items-center gap-1.5">
                <GlyphIcon
                  name="mic"
                  size={14}
                  className="text-[var(--color-text-muted)]"
                />
                {sp.slug ? (
                  <NextLink
                    href={`${speakerBasePath}/${sp.slug}`}
                    className="font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    {sp.name}
                  </NextLink>
                ) : (
                  <span className="font-semibold">{sp.name}</span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
