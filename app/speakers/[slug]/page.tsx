// Speaker detail page (current edition). Statically generated for every
// known slug at build time and revalidated alongside the Sessionize cache
// tag.

import { notFound } from "next/navigation";
import { SpeakerDetailTemplate } from "@/components/templates/SpeakerDetailTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import {
  getSpeakerBySlug,
  listSessions,
  listSpeakers,
} from "@/lib/api/sessionize";
import { buildPageMetadata } from "@/lib/utils/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  const speakers = await listSpeakers(eventInfo.sessionizeEventId);
  return speakers.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  const speaker = await getSpeakerBySlug(eventInfo.sessionizeEventId, slug);
  if (!speaker) {
    return buildPageMetadata({
      title: "Speaker no encontrado",
      description:
        "El speaker que buscás no está disponible. Volvé a la lista de speakers.",
      path: `/speakers/${slug}`,
    });
  }
  return buildPageMetadata({
    title: speaker.fullName,
    description:
      speaker.tagLine ?? `${speaker.fullName} en AWS Community Day Paraguay`,
    path: `/speakers/${slug}`,
    type: "profile",
  });
}

export default async function SpeakerDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  const speaker = await getSpeakerBySlug(eventInfo.sessionizeEventId, slug);
  if (!speaker) notFound();

  const sessions = await listSessions(eventInfo.sessionizeEventId);
  return (
    <SpeakerDetailTemplate
      speaker={speaker}
      sessions={sessions}
      detailPath={`/speakers/${slug}`}
    />
  );
}
