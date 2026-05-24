// Home page of the current edition. Server component: loads everything it
// needs server-side, passes plain data to the template.

import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { listSpeakers } from "@/lib/api/sessionize";
import { buildEventJsonLd, buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  return buildPageMetadata({
    title: eventInfo.name,
    description: eventInfo.tagline,
    path: "/",
  });
}

export default async function HomePage() {
  const year = currentEdition();
  const edition = getEdition(year);
  const speakers = await listSpeakers(edition.eventInfo.sessionizeEventId);

  const eventLd = buildEventJsonLd({
    name: edition.eventInfo.name,
    description: edition.eventInfo.tagline,
    startDate: edition.eventInfo.dates.start,
    endDate: edition.eventInfo.dates.end,
    path: "/",
    location: {
      name: edition.venue.name,
      address: edition.venue.address,
      city: edition.eventInfo.location.city,
      country: edition.eventInfo.location.country,
    },
    organizerName: "AWS Community Day Paraguay",
    organizerUrl: "/",
  });

  return (
    <>
      <script
        type="application/ld+json"
        // Next.js sanitizes innerHTML for JSON-LD scripts; the payload comes
        // from validated content + Sessionize, never from arbitrary user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      <HomeTemplate
        eventInfo={edition.eventInfo}
        speakersPreview={speakers}
        sponsorsPreview={edition.sponsors}
      />
    </>
  );
}
