import { FAQTemplate } from "@/components/templates/FAQTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Preguntas frecuentes",
    description:
      "Respuestas a las dudas más comunes sobre el AWS Community Day Paraguay.",
    path: "/faq",
  });
}

export default function FAQPage() {
  const year = currentEdition();
  const { faq } = getEdition(year);
  return <FAQTemplate items={faq} />;
}
