import { VenueTemplate } from "@/components/templates/VenueTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Sede",
    description:
      "Sede del AWS Community Day Paraguay con dirección, mapa y datos de transporte.",
    path: "/venue",
  });
}

export default function VenuePage() {
  const year = currentEdition();
  const { venue } = getEdition(year);
  return <VenueTemplate venue={venue} />;
}
