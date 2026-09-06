import { VolunteersTemplate } from "@/components/templates/VolunteersTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";

export function generateMetadata() {
  return buildPageMetadata({
    title: "Voluntariado",
    description:
      "Sumate como voluntario o voluntaria al AWS Community Day Paraguay.",
    path: "/volunteers",
  });
}

export default function VolunteersPage() {
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  return <VolunteersTemplate eventInfo={eventInfo} />;
}
