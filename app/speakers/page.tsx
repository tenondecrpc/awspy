// Speakers list page (current edition).

import { SpeakersTemplate } from "@/components/templates/SpeakersTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { listSpeakers } from "@/lib/api/sessionize";
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
  const speakers = await listSpeakers(eventInfo.sessionizeEventId);
  return <SpeakersTemplate speakers={speakers} eventInfo={eventInfo} />;
}
