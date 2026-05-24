import { notFound } from "next/navigation";
import { FAQTemplate } from "@/components/templates/FAQTemplate";
import { editionExists, getEdition } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";
import { listEditionParams, type EditionRouteParams } from "../_shared";

export const dynamicParams = false;

export function generateStaticParams() {
  return listEditionParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  return buildPageMetadata({
    title: `Preguntas frecuentes ${year}`,
    description: `Preguntas frecuentes de la edición ${year} del AWS Community Day Paraguay.`,
    path: `/editions/${year}/faq`,
  });
}

export default async function EditionFAQPage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const { faq } = getEdition(year);
  return <FAQTemplate items={faq} />;
}
