import { SponsorsTemplate } from "@/components/templates/SponsorsTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Sponsors",
    description:
      "Empresas y comunidades que apoyan el AWS Community Day Paraguay.",
    path: "/sponsors",
  });
}

export default function SponsorsPage() {
  const year = currentEdition();
  const { eventInfo, sponsors } = getEdition(year);
  return <SponsorsTemplate sponsors={sponsors} eventInfo={eventInfo} />;
}
