// Session card molecule. One session of the agenda, built to sit next to the
// sessions that start at the same time in other rooms: room first (dot plus
// name, so the hue is never the only signal), then the title, the people and
// the duration. The long description folds into a <details> so a slot stays
// short. Breaks and meals render as a slim full-width row instead.

import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import {
  SessionSpeakers,
  type SessionSpeakerRef,
} from "@/components/molecules/SessionSpeakers";
import { tieLast } from "@/lib/utils/typography";

export type SessionCardData = {
  id: string;
  title: string;
  description?: string | null;
  durationLabel: string;
  roomName: string;
  roomColor: string;
  isPlenum: boolean;
  isService: boolean;
  speakers: SessionSpeakerRef[];
};

type SessionCardProps = {
  session: SessionCardData;
  speakerBasePath: string;
};

const CHIP =
  "inline-flex items-center gap-1.5 text-step--1 text-[var(--color-text-secondary)]";

export function SessionCard({ session, speakerBasePath }: SessionCardProps) {
  if (session.isService) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-4 py-3">
        <GlyphIcon name="coffee" size={20} />
        <h3 className="m-0 text-step-0">{tieLast(session.title)}</h3>
        <span className={CHIP}>{session.durationLabel}</span>
      </div>
    );
  }

  return (
    <article className="flex h-full flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-5">
      <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-step--1 font-semibold text-[var(--color-text-primary)]">
        <span
          aria-hidden="true"
          className="size-3 shrink-0 rounded-full"
          style={{ backgroundColor: session.roomColor }}
        />
        <GlyphIcon name="pin" size={16} />
        <span className="min-w-0">{tieLast(session.roomName)}</span>
        {session.isPlenum ? (
          <span className="rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] px-2 py-0.5 font-semibold">
            Plenaria
          </span>
        ) : null}
      </p>

      <h3 className="m-0 text-step-0 leading-[1.3] sm:text-step-1 sm:leading-[1.25]">
        {session.title}
      </h3>

      <SessionSpeakers
        speakers={session.speakers}
        basePath={speakerBasePath}
      />

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-1">
        <span className={CHIP}>
          <GlyphIcon name="clock" size={16} />
          {session.durationLabel}
        </span>
        {session.description ? (
          <details className="w-full">
            <summary className="inline-flex min-h-[var(--size-touch)] cursor-pointer items-center text-step--1 font-semibold underline decoration-[var(--color-border-subtle)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]">
              Ver descripción
            </summary>
            <p className="m-0 whitespace-pre-line break-words text-step--1 leading-[1.55] text-[var(--color-text-secondary)]">
              {tieLast(session.description)}
            </p>
          </details>
        ) : null}
      </div>
    </article>
  );
}
