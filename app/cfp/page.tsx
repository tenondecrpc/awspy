import { CFPTemplate } from "@/components/templates/CFPTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Proponé una charla",
    description:
      "Enviá tu propuesta de charla o taller para el AWS Community Day Paraguay.",
    path: "/cfp",
  });
}

export default function CFPPage() {
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  return <CFPTemplate eventInfo={eventInfo} />;
}
