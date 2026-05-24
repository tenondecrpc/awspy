import { notFound } from "next/navigation";
import { ScheduleTemplate } from "@/components/templates/ScheduleTemplate";
import { editionExists, getEdition } from "@/lib/content/editions";
import { getScheduleGrid, listSpeakers } from "@/lib/api/sessionize";
import { buildPageMetadata } from "@/lib/utils/seo";
import { listEditionParams, type EditionRouteParams } from "../_shared";

export const dynamicParams = false;

export function generateStaticParams() {
  return listEditionParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  return buildPageMetadata({
    title: `Agenda ${year}`,
    description: `Agenda de la edición ${year} del AWS Community Day Paraguay.`,
    path: `/editions/${year}/schedule`,
  });
}

export default async function EditionSchedulePage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
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
      speakerBasePath={`/editions/${year}/speakers`}
    />
  );
}
