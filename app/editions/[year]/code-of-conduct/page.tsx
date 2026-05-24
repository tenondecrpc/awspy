import { notFound } from "next/navigation";
import { CodeOfConductTemplate } from "@/components/templates/CodeOfConductTemplate";
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
    title: `Código de conducta ${year}`,
    description: `Código de conducta de la edición ${year}.`,
    path: `/editions/${year}/code-of-conduct`,
  });
}

export default async function EditionCodeOfConductPage({
  params,
}: {
  params: Promise<EditionRouteParams>;
}) {
  const { year } = await params;
  if (!editionExists(year)) notFound();
  const { codeOfConduct } = getEdition(year);
  return <CodeOfConductTemplate codeOfConduct={codeOfConduct} />;
}
