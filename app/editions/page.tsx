import { EditionsIndexTemplate } from "@/components/templates/EditionsIndexTemplate";
import { listPastEditions } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Ediciones anteriores",
    description:
      "Archivo de las ediciones pasadas del AWS Community Day Paraguay.",
    path: "/editions",
  });
}

export default function EditionsIndexPage() {
  const pastEditions = listPastEditions();
  return <EditionsIndexTemplate pastEditions={pastEditions} />;
}
