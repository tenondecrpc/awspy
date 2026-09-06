import { notFound } from "next/navigation";
import { VolunteersTemplate } from "@/components/templates/VolunteersTemplate";
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
    title: `Voluntariado ${year}`,
    description: `Voluntariado de la edición ${year} del AWS Community Day Paraguay.`,
    path: `/editions/${year}/volunteers`,
  });
}

export default async function EditionVolunteersPage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const { eventInfo } = getEdition(year);
  return <VolunteersTemplate eventInfo={eventInfo} archived />;
}
