// Code of conduct template, restyled to match the "Código de Conducta" mockup
// (`AWS Community Day Paraguay (colored)/Codigo-de-Conducta.dc.html`): a light
// inner-page header band over a single prose column. The document body is
// authored in MDX/markdown and still renders through the restricted local
// Markdown renderer — only the wrapper and prose framing changed here.
//
// Colors come exclusively from the design tokens in `app/globals.css`.

import { PageHeader, SECTION_BORDER, WRAP } from "@/components/site/primitives";
import { RenderMarkdown } from "@/lib/content/markdown";
import { formatDate } from "@/lib/utils/datetime";
import type { CodeOfConduct } from "@/lib/content/code-of-conduct";

type CodeOfConductTemplateProps = {
  codeOfConduct: CodeOfConduct;
};

export function CodeOfConductTemplate({
  codeOfConduct,
}: CodeOfConductTemplateProps) {
  const { frontmatter, body } = codeOfConduct;

  const meta = frontmatter.lastUpdated
    ? `Última actualización: ${formatDate(frontmatter.lastUpdated)}${
        frontmatter.version ? ` · versión ${frontmatter.version}` : ""
      }`
    : frontmatter.version
      ? `Versión ${frontmatter.version}`
      : null;

  return (
    <>
      <PageHeader
        eyebrow="Normas"
        title="Código de conducta"
        description="Un espacio seguro, inclusivo y respetuoso para toda la comunidad AWS local, sin importar quién seas ni tu nivel técnico."
      >
        {meta ? (
          <p className="m-0 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {meta}
          </p>
        ) : null}
      </PageHeader>

      <section className={SECTION_BORDER}>
        <div className={`${WRAP} py-[56px]`}>
          <div className="max-w-[46rem]">
            <RenderMarkdown source={body} />
          </div>
        </div>
      </section>
    </>
  );
}
