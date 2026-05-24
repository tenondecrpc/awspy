// Schedule page (current edition).

import { ScheduleTemplate } from "@/components/templates/ScheduleTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { getScheduleGrid, listSpeakers } from "@/lib/api/sessionize";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Agenda",
    description:
      "Agenda completa de AWS Community Day Paraguay: charlas, talleres y actividades por día y por sala.",
    path: "/schedule",
  });
}

export default async function SchedulePage() {
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  const [grid, speakers] = await Promise.all([
    getScheduleGrid(eventInfo.sessionizeEventId),
    listSpeakers(eventInfo.sessionizeEventId),
  ]);
  return (
    <ScheduleTemplate
      grid={grid}
      speakers={speakers}
      eventInfo={eventInfo}
    />
  );
}
