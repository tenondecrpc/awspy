// Speakers list page (current edition).

import { SpeakersTemplate } from "@/components/templates/SpeakersTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { getProgramme } from "@/lib/api/sessionize";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Speakers",
    description:
      "Speakers confirmados para AWS Community Day Paraguay. Charlas técnicas, talleres y casos reales en el ecosistema AWS.",
    path: "/speakers",
  });
}

export default async function SpeakersPage() {
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  // The programme gives each speaker's talk its time and room.
  const { grid, speakers } = await getProgramme(eventInfo.sessionizeEventId);
  return (
    <SpeakersTemplate speakers={speakers} eventInfo={eventInfo} grid={grid} />
  );
}
