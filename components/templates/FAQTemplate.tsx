// FAQ page: quick answers. A short intro with a contact card (sticky on wide
// screens) beside the accordion. Empty content still renders a graceful state.

import { IconBadge } from "@/components/atoms/IconBadge";
import { FAQList } from "@/components/organisms/FAQList";
import { WRAP } from "@/components/molecules/SectionPrimitives";
import type { FAQItem } from "@/lib/content/faq";

type FAQTemplateProps = {
  items: FAQItem[];
};

const CONTACT_EMAIL = "awscommunitydayparaguay@gmail.com";

export function FAQTemplate({ items }: FAQTemplateProps) {
  return (
    <section id="contenido-principal">
      <div
        className={`${WRAP} grid items-start gap-x-14 gap-y-8 pb-[var(--space-section-y)] pt-[clamp(1.5rem,5svh,3.5rem)] lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]`}
      >
        <div className="min-w-0 lg:sticky lg:top-24">
          <h1 className="m-0 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
            Preguntas frecuentes
          </h1>
          <p className="m-0 mt-3 text-step-0 leading-[1.5] text-[var(--color-text-secondary)]">
            Lo que más nos consultan sobre el AWS Community Day Paraguay 2026.
            Si tu pregunta no está, escribinos.
          </p>

          <div className="mt-7 flex items-start gap-4 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-5">
            <IconBadge name="mail" tone="solid" />
            <div className="min-w-0">
              <p className="m-0 font-semibold text-[var(--color-text-primary)]">
                ¿No está tu pregunta?
              </p>
              <p className="m-0 mt-1 text-sm text-[var(--color-text-secondary)]">
                Escribinos y te respondemos. También podés consultarnos el día
                del evento en el mostrador de acreditación.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1 inline-flex min-h-[var(--size-touch)] items-center text-sm font-semibold [overflow-wrap:anywhere] text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <FAQList items={items} />
        </div>
      </div>
    </section>
  );
}
