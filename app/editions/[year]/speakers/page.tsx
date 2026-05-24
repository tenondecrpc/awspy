import { notFound } from "next/navigation";
import { SpeakersTemplate } from "@/components/templates/SpeakersTemplate";
import { editionExists, getEdition } from "@/lib/content/editions";
import { listSpeakers } from "@/lib/api/sessionize";
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
    title: `Speakers ${year}`,
    description: `Speakers de la edición ${year} del AWS Community Day Paraguay.`,
    path: `/editions/${year}/speakers`,
  });
}

export default async function EditionSpeakersPage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const { eventInfo } = getEdition(year);
  const speakers = await listSpeakers(eventInfo.sessionizeEventId);
  return (
    <SpeakersTemplate
      speakers={speakers}
      eventInfo={eventInfo}
      basePath={`/editions/${year}/speakers`}
    />
  );
}
