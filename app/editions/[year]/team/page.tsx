import { notFound } from "next/navigation";
import { TeamTemplate } from "@/components/templates/TeamTemplate";
import { editionExists, getEdition } from "@/lib/content/editions";
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
    title: `Equipo ${year}`,
    description: `Equipo organizador de la edición ${year} del AWS Community Day Paraguay.`,
    path: `/editions/${year}/team`,
  });
}

export default async function EditionTeamPage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const { eventInfo, organizers } = getEdition(year);
  return <TeamTemplate organizers={organizers} eventInfo={eventInfo} />;
}
