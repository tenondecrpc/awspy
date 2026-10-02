// Picks the first few sessions of the programme for the home page, so the
// agenda section shows real talks instead of a sentence pointing elsewhere.
// Pure and server-safe: it only reshapes the Sessionize grid.

import type { ScheduleGrid } from "@/lib/api/sessionize";

export type AgendaPreviewItem = {
  id: string;
  startsAt: string;
  title: string;
  roomName: string;
  speakers: string[];
};

/**
 * Flattens the grid, drops placeholder-only sessions, orders by start time and
 * returns the first `limit` items. Service sessions (breaks, registration) are
 * skipped: the home page is about what people come to hear.
 */
export function buildAgendaPreview(
  grid: ScheduleGrid,
  limit = 5
): AgendaPreviewItem[] {
  const items: AgendaPreviewItem[] = [];
  for (const day of grid) {
    for (const room of day.rooms) {
      for (const session of room.sessions) {
        if (session.isServiceSession || session.isMockup) continue;
        items.push({
          id: session.id,
          startsAt: session.startsAt,
          title: session.title,
          roomName: room.name,
          speakers: session.speakers.map((sp) => sp.name),
        });
      }
    }
  }
  items.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
  return items.slice(0, limit);
}
