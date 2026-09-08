// Past edition CFP page. Per FR-035, always renders the archived notice
// regardless of the historical CFP status flag.

import { notFound } from "next/navigation";
import { CFPTemplate } from "@/components/templates/CFPTemplate";
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
    title: `Convocatoria de charlas ${year}`,
    description: `Convocatoria de charlas archivada de la edición ${year}.`,
    path: `/editions/${year}/cfp`,
  });
}

export default async function EditionCFPPage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const { eventInfo } = getEdition(year);
  return <CFPTemplate eventInfo={eventInfo} archived />;
}
