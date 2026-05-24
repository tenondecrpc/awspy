import { CodeOfConductTemplate } from "@/components/templates/CodeOfConductTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Código de conducta",
    description:
      "Código de conducta del AWS Community Day Paraguay: cómo participamos para que el evento sea seguro, inclusivo y respetuoso.",
    path: "/code-of-conduct",
  });
}

export default function CodeOfConductPage() {
  const year = currentEdition();
  const { codeOfConduct } = getEdition(year);
  return <CodeOfConductTemplate codeOfConduct={codeOfConduct} />;
}
