import { notFound } from "next/navigation";
import { SponsorsTemplate } from "@/components/templates/SponsorsTemplate";
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
    title: `Sponsors ${year}`,
    description: `Sponsors de la edición ${year} del AWS Community Day Paraguay.`,
    path: `/editions/${year}/sponsors`,
  });
}

export default async function EditionSponsorsPage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const { eventInfo, sponsors, sponsorship } = getEdition(year);
  return (
    <SponsorsTemplate
      sponsors={sponsors}
      eventInfo={eventInfo}
      sponsorship={sponsorship}
    />
  );
}
