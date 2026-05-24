// Schedule slot molecule. Renders a single session card with time, room,
// title, and speakers.

import NextLink from "next/link";
import { Badge } from "@/components/atoms/Badge";
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
  className?: string;
};

export function ScheduleSlot({
  slot,
  speakerBasePath = "/speakers",
  className,
}: ScheduleSlotProps) {
  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 shadow-sm",
        slot.isPlenum && "border-l-4 border-[var(--color-accent)]",
        className
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-secondary)]">
        <time dateTime={slot.startsAt}>
          {formatTimeRange(slot.startsAt, slot.endsAt)}
        </time>
        <span aria-hidden="true">|</span>
        <span>{slot.roomName}</span>
        {slot.isPlenum ? <Badge variant="info">Plenaria</Badge> : null}
      </div>
      <h3 className="text-lg font-semibold">{slot.title}</h3>
      {slot.speakers.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2 text-sm">
          {slot.speakers.map((sp) => (
            <li key={sp.id}>
              {sp.slug ? (
                <NextLink
                  href={`${speakerBasePath}/${sp.slug}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {sp.name}
                </NextLink>
              ) : (
                <span>{sp.name}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
