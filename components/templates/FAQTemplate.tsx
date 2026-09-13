// FAQ page, rebuilt from scratch to reproduce the "FAQ" mockup
// (`AWS Community Day Paraguay (colored)/FAQ.dc.html`) 1:1 — same light header
// band, same Q/A list layout, same "¿No está tu pregunta?" contact panel, and
// the same colors (via exact design tokens) and spacing.
//
// The mockup groups sample questions into categories, but the app passes a
// flat, real `FAQItem[]`, so the questions render as a two-column Q/A list
// (the finished Home rebuild uses the same idiom). Empty content still renders
// a graceful notice.

import {
  WRAP,
  SECTION_BORDER,
  PageHeader,
} from "@/components/molecules/SectionPrimitives";
import type { FAQItem } from "@/lib/content/faq";

type FAQTemplateProps = {
  items: FAQItem[];
};

const CONTACT_EMAIL = "awscommunitydayparaguay@gmail.com";

export function FAQTemplate({ items }: FAQTemplateProps) {
  return (
    <>
      <PageHeader
        eyebrow="Ayuda"
        title="Preguntas frecuentes"
        description="Lo que más nos consultan sobre el AWS Community Day Paraguay 2026. Si tu pregunta no está, escribinos."
      />

      <section className={SECTION_BORDER}>
        <div className={`${WRAP} pb-16 pt-12`}>
          {items.length === 0 ? (
            <p className="text-[15px] text-[var(--color-text-secondary)]">
              Estamos preparando las preguntas frecuentes. Pronto vamos a
              publicar las dudas más comunes con sus respuestas.
            </p>
          ) : (
            <div className="grid gap-x-14 border-t border-[var(--color-text-primary)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="min-w-0 border-b border-[var(--color-border-subtle)] py-[18px]"
                >
                  <h2 className="m-0 mb-1.5 text-[17px] font-bold tracking-[-0.015em] text-[var(--color-text-primary)]">
                    {item.question}
                  </h2>
                  <p className="m-0 max-w-[52rem] text-[15.5px] leading-[1.6] text-[var(--color-text-secondary)]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-11 flex flex-wrap items-center justify-between gap-[22px] border border-[var(--color-text-primary)] p-[30px]">
            <div className="min-w-0">
              <h2 className="m-0 mb-1.5 text-[19px] font-extrabold tracking-[-0.025em] text-[var(--color-text-primary)]">
                ¿No está tu pregunta?
              </h2>
              <p className="m-0 text-[15px] text-[var(--color-text-secondary)]">
                Escribinos y te respondemos. También podés consultarnos el día
                del evento en el mostrador de acreditación.
              </p>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex flex-none items-center whitespace-nowrap rounded-[4px] border-[1.5px] border-[var(--color-text-primary)] px-[26px] py-[13px] text-[15px] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
            >
              Escribirnos
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
