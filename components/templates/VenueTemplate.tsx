// Venue page, rebuilt from scratch to reproduce the "Sede" mockup
// (`AWS Community Day Paraguay (colored)/Sede.dc.html`) 1:1 — same sections,
// same order, same colors (via exact design tokens), same spacing.
//
// The venue name, address, embedded map, external map link, transport notes,
// and accessibility notes are wired to the real `venue` prop. Sections backed
// by arrays (transport, accessibility) render the real arrays and collapse
// when empty. The fixed facts panel and photo gallery mirror the mockup's
// static presentational content.

import {
  Frame,
  NumberHeading,
  PageHeader,
  SECTION_BORDER,
  WRAP,
} from "@/components/site/primitives";
import type { Venue } from "@/lib/content/venue";

type VenueTemplateProps = {
  venue: Venue;
};

const DETAILS: Array<[string, string]> = [
  ["Fecha", "Sábado 17 de octubre de 2026"],
  ["Horario", "08:00 – 17:00"],
  ["Acreditación", "Hall de ingreso"],
  ["Salas", "Guaraní · Ñandútí · Taller"],
];

const GALLERY = [
  "Auditorio",
  "Sala de taller",
  "Espacio de networking",
  "Ingreso / acreditación",
];

export function VenueTemplate({ venue }: VenueTemplateProps) {
  return (
    <>
      <PageHeader
        eyebrow="Ubicación"
        title="Sede"
        description="Dónde nos vemos para el AWS Community Day Paraguay."
      />

      {/* ── Venue detail: photo + facts ──────────────────────── */}
      <section className={SECTION_BORDER}>
        <div className="grid items-stretch [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))]">
          <div className="relative min-h-[420px] min-w-0 border-b border-[var(--color-border-subtle)] lg:border-b-0 lg:border-r">
            <Frame label="Fachada de UniNorte" className="h-full w-full" />
          </div>
          <div className="flex min-w-0 flex-col justify-center px-7 py-14 lg:px-10">
            <h2 className="m-0 mb-3 text-[clamp(24px,3vw,34px)] font-extrabold leading-[1.08] tracking-[-0.035em] text-[var(--color-text-primary)]">
              {venue.name}
            </h2>
            <p className="m-0 mb-[26px] max-w-[30rem] text-[16px] text-[var(--color-text-secondary)]">
              {venue.address}
            </p>
            <dl className="m-0 mb-7 max-w-[30rem] border-t border-[var(--color-text-primary)]">
              {DETAILS.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b border-[var(--color-border-subtle)] py-[13px]"
                >
                  <dt className="text-[14px] text-[var(--color-text-muted)]">
                    {k}
                  </dt>
                  <dd className="m-0 text-[14.5px] font-semibold text-[var(--color-text-primary)]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center whitespace-nowrap rounded-[4px] bg-[var(--color-surface-inverse)] px-[26px] py-[13px] text-[15px] font-semibold text-[var(--color-text-on-inverse)] transition-colors hover:bg-[var(--color-action)] hover:text-[var(--color-text-on-action)]"
              >
                Abrir en Google Maps
              </a>
              <a
                href="#mapa"
                className="inline-flex items-center whitespace-nowrap rounded-[4px] border-[1.5px] border-[var(--color-border-subtle)] px-[26px] py-[13px] text-[15px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
              >
                Ver el mapa acá
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 01 · Cómo llegar (map + transport) ───────────────── */}
      <section id="mapa" className={SECTION_BORDER}>
        <div className={`${WRAP} py-14`}>
          <NumberHeading n="01" title="Cómo llegar" />
          <div className="overflow-hidden border border-[var(--color-text-primary)] bg-[var(--color-surface-muted)]">
            {venue.embedMapUrl ? (
              <iframe
                title={`Mapa de la sede: ${venue.name}`}
                src={venue.embedMapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[420px] w-full border-0"
              />
            ) : (
              <Frame label="Mapa de la sede" className="h-[420px] w-full" />
            )}
          </div>
          {venue.transport.length > 0 ? (
            <div className="mt-7 grid border-l border-t border-[var(--color-border-subtle)] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
              {venue.transport.map((t, i) => (
                <div
                  key={i}
                  className="min-w-0 border-b border-r border-[var(--color-border-subtle)] px-[22px] py-5"
                >
                  <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Cómo llegar
                  </p>
                  <p className="m-0 mt-1.5 text-[14.5px] text-[var(--color-text-primary)]">
                    {t}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── 02 · Accesibilidad ───────────────────────────────── */}
      {venue.accessibility.length > 0 ? (
        <section className={`${SECTION_BORDER} bg-[var(--color-surface-warm)]`}>
          <div className={`${WRAP} py-14`}>
            <NumberHeading n="02" title="Accesibilidad" />
            <div className="grid border-t border-[var(--color-text-primary)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              {venue.accessibility.map((a, i) => (
                <div
                  key={i}
                  className="flex min-w-0 items-baseline gap-3 border-b border-[var(--color-border-subtle)] py-4 pr-[18px]"
                >
                  <span
                    aria-hidden="true"
                    className="flex-none font-mono text-[11px] text-[var(--color-success)]"
                  >
                    ✓
                  </span>
                  <span className="text-[15px] text-[var(--color-text-primary)]">
                    {a}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[13.5px] text-[var(--color-text-muted)]">
              ¿Necesitás una adaptación puntual? Escribinos a{" "}
              <a
                href="mailto:awscommunitydayparaguay@gmail.com"
                className="font-semibold text-[var(--color-accent)]"
              >
                awscommunitydayparaguay@gmail.com
              </a>{" "}
              y lo resolvemos antes del evento.
            </p>
          </div>
        </section>
      ) : null}

      {/* ── Gallery ──────────────────────────────────────────── */}
      <section>
        <div className={`${WRAP} pb-[72px] pt-14`}>
          <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {GALLERY.map((g) => (
              <Frame key={g} label={g} className="aspect-[4/3] w-full" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
