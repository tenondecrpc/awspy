import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
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
  return (
    <Section spacing="lg">
      <Container>
        <div className="mx-auto max-w-3xl space-y-3">
          <Heading level={1}>Código de conducta</Heading>
          {frontmatter.lastUpdated ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Última actualización: {formatDate(frontmatter.lastUpdated)}
              {frontmatter.version
                ? ` (versión ${frontmatter.version})`
                : null}
            </p>
          ) : frontmatter.version ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Versión {frontmatter.version}
            </p>
          ) : null}
          <RenderMarkdown source={body} />
        </div>
      </Container>
    </Section>
  );
}
