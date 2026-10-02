// Schedule slot molecule. One session as a ruled row: a large serif start
// time, the title, the speakers and the room name as plain text.
//
// Each room gets its own accent, assigned by the parent grid and drawn as a
// stripe down the left edge. The accent is decorative: the room name is always
// written out beside it, so nothing is communicated by color alone.

import NextLink from "next/link";
import { formatTime, formatTimeRange } from "@/lib/utils/datetime";
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

const ACCENTS = [
  "var(--color-category-blue)",
  "var(--color-category-teal)",
  "var(--color-category-amber)",
  "var(--color-category-green)",
  "var(--color-category-violet)",
  "var(--color-category-pink)",
] as const;

export function ScheduleSlot({
  slot,
  speakerBasePath = "/speakers",
  accentIndex = 0,
  className,
}: ScheduleSlotProps) {
  return (
    <article
      className={cn(
        "grid gap-x-8 gap-y-3 py-5 pl-4 pr-1 sm:pl-6 sm:[grid-template-columns:7.5rem_minmax(0,1fr)_minmax(0,11rem)]",
        className
      )}
      style={{ borderLeftColor: ACCENTS[accentIndex % ACCENTS.length] }}
    >
      <div className="min-w-0">
        <time
          dateTime={slot.startsAt}
          className="block font-display text-step-2 leading-none text-[var(--color-text-primary)]"
          aria-label={formatTimeRange(slot.startsAt, slot.endsAt)}
        >
          {formatTime(slot.startsAt)}
        </time>
        <span
          aria-hidden="true"
          className="mt-1.5 block text-step--1 text-[var(--color-text-secondary)]"
        >
          hasta {formatTime(slot.endsAt)}
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="m-0 mb-2 max-w-[40rem] font-semibold text-step-1 leading-[1.2]">
          {slot.title}
        </h3>
        {slot.speakers.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-step--1">
            {slot.speakers.map((sp) => (
              <li key={sp.id}>
                {sp.slug ? (
                  <NextLink
                    href={`${speakerBasePath}/${sp.slug}`}
                    className="font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4"
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

      <p className="m-0 min-w-0 break-words text-step--1 font-semibold text-[var(--color-text-primary)] sm:text-right">
        {slot.roomName}
        {slot.isPlenum ? (
          <span className="block font-normal text-[var(--color-text-secondary)]">
            Plenaria
          </span>
        ) : null}
      </p>
    </article>
  );
}
