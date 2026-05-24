// Past edition register page. Per FR-035, always renders the archived
// notice regardless of the historical registration status flag.

import { notFound } from "next/navigation";
import { RegisterTemplate } from "@/components/templates/RegisterTemplate";
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
    title: `Registro ${year}`,
    description: `Registro archivado de la edición ${year}.`,
    path: `/editions/${year}/register`,
  });
}

export default async function EditionRegisterPage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const { eventInfo } = getEdition(year);
  return <RegisterTemplate eventInfo={eventInfo} archived />;
}
