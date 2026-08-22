import { notFound } from "next/navigation";
import { SpeakerDetailTemplate } from "@/components/templates/SpeakerDetailTemplate";
import {
  editionExists,
  getEdition,
  listEditions,
} from "@/lib/content/editions";
import {
  getSpeakerBySlug,
  listSessions,
  listSpeakers,
} from "@/lib/api/sessionize";
import { buildPageMetadata } from "@/lib/utils/seo";

type Params = { year: string; slug: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const out: Params[] = [];
  for (const year of listEditions()) {
    const { eventInfo } = getEdition(year);
    const speakers = await listSpeakers(eventInfo.sessionizeEventId);
    for (const sp of speakers) {
      out.push({ year, slug: sp.slug });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year, slug } = await params;
  if (!editionExists(year)) {
    return buildPageMetadata({
      title: "Edición no encontrada",
      description: "La edición que buscás no existe.",
      path: `/editions/${year}/speakers/${slug}`,
    });
  }
  const { eventInfo } = getEdition(year);
  const speaker = await getSpeakerBySlug(eventInfo.sessionizeEventId, slug);
  return buildPageMetadata({
    title: speaker?.fullName ?? "Speaker",
    description: speaker?.tagLine ?? `Speaker de la edición ${year}`,
    path: `/editions/${year}/speakers/${slug}`,
    type: "profile",
  });
}

export default async function EditionSpeakerDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year, slug } = await params;
  if (!editionExists(year)) notFound();
  const { eventInfo } = getEdition(year);
  const speaker = await getSpeakerBySlug(eventInfo.sessionizeEventId, slug);
  if (!speaker) notFound();
  const sessions = await listSessions(eventInfo.sessionizeEventId);
  return (
    <SpeakerDetailTemplate
      speaker={speaker}
      sessions={sessions}
      backPath={`/editions/${year}/speakers`}
      detailPath={`/editions/${year}/speakers/${slug}`}
    />
  );
}
