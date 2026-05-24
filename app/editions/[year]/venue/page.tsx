import { notFound } from "next/navigation";
import { VenueTemplate } from "@/components/templates/VenueTemplate";
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
    title: `Sede ${year}`,
    description: `Sede de la edición ${year} del AWS Community Day Paraguay.`,
    path: `/editions/${year}/venue`,
  });
}

export default async function EditionVenuePage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const { venue } = getEdition(year);
  return <VenueTemplate venue={venue} />;
}
