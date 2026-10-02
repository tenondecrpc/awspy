// Code of conduct page: what is expected, what is not tolerated, how to
// report. Three summary cards sit above the full text; they are built from
// the same markdown the page renders (its "esperado", "inaceptable" and
// "reportar" sections), so no policy is written here. The body is authored in
// MDX/markdown and rendered by the restricted local Markdown renderer.

import { IconBadge } from "@/components/atoms/IconBadge";
import type { GlyphName } from "@/components/atoms/GlyphIcon";
import { WRAP } from "@/components/molecules/SectionPrimitives";
import { RenderMarkdown } from "@/lib/content/markdown";
import { formatDate } from "@/lib/utils/datetime";
import type { CodeOfConduct } from "@/lib/content/code-of-conduct";

type CodeOfConductTemplateProps = {
  codeOfConduct: CodeOfConduct;
};

/** The text of a `## ` section, matched by a word in its heading. */
function sectionLines(body: string, headingWord: RegExp): string[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex(
    (l) => /^## /.test(l) && headingWord.test(l)
  );
  if (start < 0) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^#{1,3} /.test(l));
  return end < 0 ? rest : rest.slice(0, end);
}

const bullets = (lines: string[]) =>
  lines.filter((l) => /^- /.test(l)).map((l) => l.replace(/^- /, "").trim());

type SummaryCard = {
  icon: GlyphName;
  title: string;
  items: string[];
  email?: string;
};

function buildSummary(body: string): SummaryCard[] {
  const expected = bullets(sectionLines(body, /esperado/i)).slice(0, 3);
  const unacceptable = bullets(sectionLines(body, /inaceptable/i)).slice(0, 3);
  const reportText = sectionLines(body, /reportar/i).join(" ");
  const email = /[\w.+-]+@[\w-]+\.[\w.-]+/.exec(reportText)?.[0];
  const confidential = /[^.]*confidencialidad[^.]*\./i
    .exec(reportText)?.[0]
    .trim();

  const cards: SummaryCard[] = [];
  if (expected.length > 0)
    cards.push({ icon: "heart", title: "Nos cuidamos", items: expected });
  if (unacceptable.length > 0)
    cards.push({
      icon: "shield",
      title: "Lo que no se tolera",
      items: unacceptable,
    });
  if (email)
    cards.push({
      icon: "mail",
      title: "Cómo reportar",
      items: confidential ? [confidential] : [],
      email,
    });
  return cards;
}

const PROSE =
  "max-w-[42rem] text-step-0 leading-[1.7] text-[var(--color-text-secondary)] " +
  "[&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-step-2 [&_h2]:font-normal [&_h2]:leading-[1.1] [&_h2]:tracking-[-0.01em] [&_h2]:text-[var(--color-text-primary)] " +
  "[&_h3]:mt-8 [&_h3]:text-step-1 [&_h3]:text-[var(--color-text-primary)] " +
  "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 " +
  "[&_a]:font-semibold [&_a]:text-[var(--color-text-primary)] [&_a]:underline [&_a]:decoration-[var(--color-national-red)] [&_a]:decoration-2 [&_a]:underline-offset-4 " +
  "[&_code]:font-sans [&_code]:rounded-[var(--radius-sm)] [&_code]:bg-[var(--color-surface-muted)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:text-[var(--color-text-primary)] [&_code]:[overflow-wrap:anywhere]";

export function CodeOfConductTemplate({
  codeOfConduct,
}: CodeOfConductTemplateProps) {
  const { frontmatter, body } = codeOfConduct;
  const summary = buildSummary(body);

  const meta = frontmatter.lastUpdated
    ? `Última actualización: ${formatDate(frontmatter.lastUpdated)}${
        frontmatter.version ? ` · versión ${frontmatter.version}` : ""
      }`
    : frontmatter.version
      ? `Versión ${frontmatter.version}`
      : null;

  return (
    <>
      <section id="contenido-principal">
        <div className={`${WRAP} pb-8 pt-[clamp(1.5rem,5svh,3.5rem)]`}>
          <h1 className="m-0 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
            Código de conducta
          </h1>
          <p className="m-0 mt-3 max-w-[40rem] text-step-0 leading-[1.5] text-[var(--color-text-secondary)]">
            Un espacio seguro, inclusivo y respetuoso para toda la comunidad
            AWS local, sin importar quién seas ni tu nivel técnico.
          </p>
          {meta ? (
            <p className="m-0 mt-2 text-sm text-[var(--color-text-muted)]">
              {meta}
            </p>
          ) : null}
        </div>
      </section>

      {summary.length > 0 ? (
        <section>
          <div className={`${WRAP} pb-10`}>
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
              {summary.map((card) => (
                <article
                  key={card.title}
                  className="min-w-0 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <IconBadge name={card.icon} />
                    <h3 className="m-0 text-step-1">
                      {card.title}
                    </h3>
                  </div>
                  {card.items.length > 0 ? (
                    <ul className="m-0 flex list-none flex-col gap-2 p-0 text-base leading-[1.5] text-[var(--color-text-secondary)]">
                      {card.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {card.email ? (
                    <a
                      href={`mailto:${card.email}`}
                      className="mt-3 inline-flex min-h-[var(--size-touch)] items-center break-all text-base font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4"
                    >
                      {card.email}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className={`${WRAP} pb-[var(--space-section-y)]`}>
          <div className={PROSE}>
            <RenderMarkdown source={body} />
          </div>
        </div>
      </section>
    </>
  );
}
