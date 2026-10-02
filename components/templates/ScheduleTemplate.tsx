// Schedule page. The Sessionize GridSmart response is grouped by its Asunción
// start day and then by start time, so the sessions that run in parallel in
// different rooms sit side by side as cards under one large serif time. That is
// what a visitor needs to understand: what can I choose between, and when.
//
// Two rails stick under the header while the page scrolls. The room rail is a
// <nav> of links (so the filter works without JavaScript and stays shareable)
// that scrolls sideways on a phone; each chip carries the room's dot, which
// doubles as the legend, and the active room is marked by a filled chip and
// `aria-current`. The time rail jumps to the first slot of each hour; with
// several days it jumps between days.
//
// Sessionize accepts talks well before it publishes the grid. In that window
// the page lists the confirmed talks, built from the sessions each speaker
// already carries, instead of an empty agenda. The empty state is kept for
// when neither exists.

import NextLink from "next/link";
import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import { IconBadge } from "@/components/atoms/IconBadge";
import {
  SessionCard,
  type SessionCardData,
} from "@/components/molecules/SessionCard";
import {
  SessionSpeakers,
  type SessionSpeakerRef,
} from "@/components/molecules/SessionSpeakers";
import {
  BTN_PRIMARY,
  SectionTitle,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { formatDate, formatTime, startOfDayKey } from "@/lib/utils/datetime";
import type { ScheduleGrid, Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

type ScheduleTemplateProps = {
  grid: ScheduleGrid;
  speakers: Speaker[];
  eventInfo: EventInfo;
  speakerBasePath?: string;
  schedulePath?: string;
  selectedRoom?: string | null;
};

// A fixed-order set of categorical hues that tells sibling rooms apart. It is
// identity, never meaning: every card also carries its written room name.
const ROOM_COLORS = [
  "var(--color-category-blue)",
  "var(--color-category-teal)",
  "var(--color-category-amber)",
  "var(--color-category-green)",
  "var(--color-category-violet)",
  "var(--color-category-pink)",
] as const;

type TimeBlock = {
  key: string;
  startsAt: string;
  endsAt: string;
  sessions: SessionCardData[];
};

type DayGroup = {
  dayKey: string;
  representative: string;
  blocks: TimeBlock[];
};

type Talk = {
  id: string;
  title: string;
  speakers: SessionSpeakerRef[];
};

/** Rooms in first-appearance order, each mapped to a stable accent hue. */
function listRooms(grid: ScheduleGrid): Array<{ name: string; color: string }> {
  const seen = new Map<string, string>();
  for (const day of grid) {
    for (const room of day.rooms) {
      if (room.sessions.length > 0 && !seen.has(room.name)) {
        seen.set(room.name, ROOM_COLORS[seen.size % ROOM_COLORS.length]);
      }
    }
  }
  return Array.from(seen, ([name, color]) => ({ name, color }));
}

function durationLabel(startsAt: string, endsAt: string): string {
  const mins = Math.round(
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000
  );
  return `${Math.max(0, mins)} min`;
}

/**
 * Groups every session by its Asunción start day, then by start time, and sorts
 * both ascending. Sessions that cross midnight appear under their start day.
 * `room` keeps only that room's sessions.
 */
function groupByDayAndTime(
  grid: ScheduleGrid,
  speakers: Speaker[],
  room: string | undefined
): DayGroup[] {
  const color = new Map(listRooms(grid).map((r) => [r.name, r.color]));
  const speakerById = new Map(speakers.map((sp) => [sp.id, sp]));

  const days = new Map<string, DayGroup>();
  const blocks = new Map<string, TimeBlock>();

  for (const day of grid) {
    for (const r of day.rooms) {
      if (room && r.name !== room) continue;
      for (const session of r.sessions) {
        const dayKey = startOfDayKey(session.startsAt);
        if (!dayKey) continue;
        let group = days.get(dayKey);
        if (!group) {
          group = { dayKey, representative: session.startsAt, blocks: [] };
          days.set(dayKey, group);
        }
        const blockKey = `${dayKey}|${new Date(session.startsAt).getTime()}`;
        let block = blocks.get(blockKey);
        if (!block) {
          block = {
            key: blockKey,
            startsAt: session.startsAt,
            endsAt: session.endsAt,
            sessions: [],
          };
          blocks.set(blockKey, block);
          group.blocks.push(block);
        }
        if (new Date(session.endsAt) > new Date(block.endsAt)) {
          block.endsAt = session.endsAt;
        }
        block.sessions.push({
          id: session.id,
          title: session.title,
          description: session.description,
          durationLabel: durationLabel(session.startsAt, session.endsAt),
          roomName: r.name,
          roomColor: color.get(r.name) ?? ROOM_COLORS[0],
          isPlenum: session.isPlenumSession,
          isService: session.isServiceSession,
          speakers: session.speakers.map((sp) => ({
            id: sp.id,
            name: sp.name,
            slug: speakerById.get(sp.id)?.slug,
            photo: speakerById.get(sp.id)?.profilePicture,
          })),
        });
      }
    }
  }

  const result = Array.from(days.values());
  result.sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  for (const d of result) {
    d.blocks.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }
  return result;
}

/**
 * The accepted talks, one entry per session id with all of its speakers, sorted
 * by title. Only used while the grid is unpublished, so it needs no times.
 */
function listConfirmedTalks(speakers: Speaker[]): Talk[] {
  const talks = new Map<string, Talk>();
  for (const sp of speakers) {
    for (const session of sp.sessions) {
      if (!session.name) continue;
      let talk = talks.get(session.id);
      if (!talk) {
        talk = { id: session.id, title: session.name, speakers: [] };
        talks.set(session.id, talk);
      }
      talk.speakers.push({
        id: sp.id,
        name: sp.fullName,
        slug: sp.slug,
        photo: sp.profilePicture,
      });
    }
  }
  return Array.from(talks.values()).sort((a, b) =>
    a.title.localeCompare(b.title, "es")
  );
}

/** Two-digit Asunción hour of a timestamp, e.g. "09". */
function hourOf(iso: string): string {
  return formatTime(iso).slice(0, 2);
}

const RAIL =
  "flex snap-x snap-proximity items-center gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const CHIP =
  "inline-flex min-h-[var(--size-touch)] shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border-2 px-4 text-step--1 font-semibold leading-tight transition-colors";

const CHIP_ON =
  "border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-surface)]";

const CHIP_OFF =
  "border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)]";

const CARD_GRID =
  "grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr))]";

function Fact({ icon, children }: { icon: GlyphName; children: string }) {
  return (
    <li className="flex items-center gap-2 text-step--1 text-[var(--color-text-secondary)] sm:text-step-0">
      <GlyphIcon name={icon} size={20} />
      <span>{children}</span>
    </li>
  );
}

export function ScheduleTemplate({
  grid,
  speakers,
  eventInfo,
  speakerBasePath = "/speakers",
  schedulePath = "/schedule",
  selectedRoom,
}: ScheduleTemplateProps) {
  const rooms = listRooms(grid);
  const activeRoom = rooms.find((room) => room.name === selectedRoom)?.name;
  const days = groupByDayAndTime(grid, speakers, activeRoom);
  const multiDay = days.length > 1;
  const hasGrid = days.length > 0;
  const talks = hasGrid ? [] : listConfirmedTalks(speakers);

  // First slot of each hour is the target of the time rail.
  const hourAnchors = new Map<string, string>();
  if (days.length === 1) {
    for (const block of days[0].blocks) {
      const hour = hourOf(block.startsAt);
      if (!hourAnchors.has(hour)) hourAnchors.set(hour, block.key);
    }
  }
  const hourIds = Array.from(hourAnchors.keys());

  const showRail = rooms.length > 0;
  const showTimeRail = hourIds.length > 1 || multiDay;

  return (
    <>
      <section id="contenido-principal">
        <div
          className={`${WRAP} flex flex-wrap items-end justify-between gap-x-10 gap-y-3 py-[clamp(1rem,3.5svh,2rem)]`}
        >
          <h1 className="m-0 font-display text-step-2 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
            Agenda
          </h1>
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
            <Fact icon="calendar">{formatDate(eventInfo.dates.start)}</Fact>
            <Fact icon="pin">{eventInfo.location.summary}</Fact>
            <Fact icon="clock">Hora de Asunción (UTC−3)</Fact>
          </ul>
        </div>
      </section>

      {showRail ? (
        <div className="sticky top-[4.0625rem] z-20 bg-[var(--color-surface)]">
          <div className={WRAP}>
            <nav aria-label="Filtrar agenda por sala" className={RAIL}>
              <NextLink
                href={schedulePath}
                prefetch={false}
                scroll={false}
                aria-current={!activeRoom ? "page" : undefined}
                className={`${CHIP} ${!activeRoom ? CHIP_ON : CHIP_OFF}`}
              >
                Todas las salas
              </NextLink>
              {rooms.map((room) => (
                <NextLink
                  key={room.name}
                  href={{ pathname: schedulePath, query: { room: room.name } }}
                  prefetch={false}
                  scroll={false}
                  aria-current={activeRoom === room.name ? "page" : undefined}
                  className={`${CHIP} ${
                    activeRoom === room.name ? CHIP_ON : CHIP_OFF
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: room.color }}
                  />
                  {room.name}
                </NextLink>
              ))}
            </nav>
            {showTimeRail ? (
              <nav
                aria-label={multiDay ? "Saltar a un día" : "Saltar a una hora"}
                className={`${RAIL} py-1`}
              >
                <span className="shrink-0 pr-1 text-step--1 text-[var(--color-text-secondary)]">
                  {multiDay ? "Día" : "Hora"}
                </span>
                {multiDay
                  ? days.map((day) => (
                      <a
                        key={day.dayKey}
                        href={`#day-${day.dayKey}`}
                        className="inline-flex min-h-[var(--size-touch)] shrink-0 snap-start items-center whitespace-nowrap px-2 text-step--1 font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-border-subtle)] decoration-2 underline-offset-4 first-letter:uppercase"
                      >
                        {formatDate(day.representative)}
                      </a>
                    ))
                  : hourIds.map((hour) => (
                      <a
                        key={hour}
                        href={`#hour-${hour}`}
                        className="inline-flex min-h-[var(--size-touch)] min-w-[var(--size-touch)] shrink-0 snap-start items-center justify-center whitespace-nowrap px-2 font-display text-step-0 text-[var(--color-text-primary)] underline decoration-[var(--color-border-subtle)] decoration-2 underline-offset-4"
                      >
                        {hour}:00
                      </a>
                    ))}
              </nav>
            ) : null}
          </div>
        </div>
      ) : null}

      <section>
        <div className={`${WRAP} pb-16 pt-6 sm:pt-8`}>
          {!hasGrid && talks.length > 0 ? (
            <div>
              <SectionTitle title="Charlas confirmadas" />
              <p className="m-0 mb-8 max-w-[44rem] text-step-0 text-[var(--color-text-secondary)]">
                Todavía estamos armando la grilla. Estas son las {talks.length}{" "}
                {talks.length === 1 ? "charla" : "charlas"} ya aceptadas; los
                horarios y las salas se publican acá apenas estén definidos.
              </p>
              <ul className={`${CARD_GRID} m-0 list-none p-0`}>
                {talks.map((talk) => (
                  <li
                    key={talk.id}
                    className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-5"
                  >
                    <h3 className="m-0 text-step-0 leading-[1.3] sm:text-step-1">
                      {talk.title}
                    </h3>
                    <SessionSpeakers
                      speakers={talk.speakers}
                      basePath={speakerBasePath}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : !hasGrid ? (
            <div className="flex max-w-[40rem] items-start gap-4 pt-4">
              <IconBadge name="calendar" size="lg" />
              <div>
                <h2 className="m-0 font-display text-step-2 leading-[1.1]">
                  Agenda próximamente
                </h2>
                <p className="m-0 mt-3 text-step-0 text-[var(--color-text-secondary)]">
                  Estamos cerrando la agenda con horarios y salas. Volvé en unos
                  días para verla completa.
                </p>
              </div>
            </div>
          ) : (
            days.map((day) => (
              <div
                key={day.dayKey}
                id={`day-${day.dayKey}`}
                className={`scroll-mt-44 ${multiDay ? "mb-14" : ""}`}
              >
                {multiDay ? (
                  <SectionTitle
                    title={
                      <span className="first-letter:uppercase">
                        {formatDate(day.representative)}
                      </span>
                    }
                  />
                ) : null}
                <ol className="m-0 flex list-none flex-col gap-8 p-0 sm:gap-10">
                  {day.blocks.map((block) => {
                    const hour = hourOf(block.startsAt);
                    const isAnchor =
                      !multiDay && hourAnchors.get(hour) === block.key;
                    const onlyBreaks = block.sessions.every((s) => s.isService);
                    return (
                      <li
                        key={block.key}
                        id={isAnchor ? `hour-${hour}` : undefined}
                        className="grid scroll-mt-44 gap-x-8 gap-y-3 sm:[grid-template-columns:8.5rem_minmax(0,1fr)]"
                      >
                        <div className="flex items-baseline gap-3 sm:block">
                          <time
                            dateTime={block.startsAt}
                            className="block font-display text-step-3 leading-none text-[var(--color-text-primary)]"
                          >
                            {formatTime(block.startsAt)}
                          </time>
                          <span className="block text-step--1 text-[var(--color-text-secondary)] sm:mt-2">
                            hasta {formatTime(block.endsAt)}
                          </span>
                        </div>
                        <div
                          className={
                            onlyBreaks
                              ? "flex min-w-0 flex-col gap-3"
                              : CARD_GRID
                          }
                        >
                          {block.sessions.map((s) => (
                            <SessionCard
                              key={`${s.id}-${s.roomName}`}
                              session={s}
                              speakerBasePath={speakerBasePath}
                            />
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))
          )}

          {hasGrid ? (
            <p className="mt-8 flex items-center gap-2 text-step--1 text-[var(--color-text-secondary)]">
              <GlyphIcon name="info" size={18} />
              Los horarios pueden ajustarse hasta la semana del evento.
            </p>
          ) : null}

          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-6 sm:p-8">
            <div className="flex min-w-0 max-w-[36rem] items-start gap-4">
              <IconBadge name="ticket" tone="solid" />
              <div>
                <h2 className="m-0 mb-2 font-display text-step-2 leading-[1.1]">
                  Reservá tu lugar
                </h2>
                <p className="m-0 text-step-0 text-[var(--color-text-secondary)]">
                  La entrada es gratis. Registrate para asistir a{" "}
                  {eventInfo.name}; cada taller indica sus requisitos en esta
                  agenda.
                </p>
              </div>
            </div>
            <NextLink href="/register" className={BTN_PRIMARY}>
              Registrarme gratis
            </NextLink>
          </div>
        </div>
      </section>
    </>
  );
}
