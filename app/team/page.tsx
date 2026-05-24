import { TeamTemplate } from "@/components/templates/TeamTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Equipo",
    description:
      "Equipo voluntario que organiza el AWS Community Day Paraguay.",
    path: "/team",
  });
}

export default function TeamPage() {
  const year = currentEdition();
  const { eventInfo, organizers } = getEdition(year);
  return <TeamTemplate organizers={organizers} eventInfo={eventInfo} />;
}
