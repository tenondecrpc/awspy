// Past edition home (or current edition mirror). Reuses HomeTemplate but
// passes archived register/cfp hrefs so the CTAs do not point at the live
// pages.

import { notFound } from "next/navigation";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { editionExists, getEdition } from "@/lib/content/editions";
import { listSpeakers } from "@/lib/api/sessionize";
import { buildPageMetadata } from "@/lib/utils/seo";
import { listEditionParams, type EditionRouteParams } from "./_shared";

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
  if (!editionExists(year)) {
    return buildPageMetadata({
      title: "Edición no encontrada",
      description:
        "La edición que buscás no existe. Volvé al listado de ediciones.",
      path: `/editions/${year}`,
    });
  }
  const { eventInfo } = getEdition(year);
  return buildPageMetadata({
    title: eventInfo.name,
    description: eventInfo.tagline,
    path: `/editions/${year}`,
  });
}

export default async function EditionHomePage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const edition = getEdition(year);
  const speakers = await listSpeakers(edition.eventInfo.sessionizeEventId);

  return (
    <HomeTemplate
      eventInfo={edition.eventInfo}
      speakersPreview={speakers}
      sponsorsPreview={edition.sponsors}
      registerHref={`/editions/${year}/register`}
      cfpHref={`/editions/${year}/cfp`}
      speakersHref={`/editions/${year}/speakers`}
      sponsorsHref={`/editions/${year}/sponsors`}
      volunteersHref={`/editions/${year}/volunteers`}
    />
  );
}
