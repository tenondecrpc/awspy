// Sponsors page, rebuilt from scratch to reproduce the "Sponsors" mockup
// (`AWS Community Day Paraguay (colored)/Sponsors.dc.html`) 1:1 — same
// sections, same order, same colors (via exact design tokens), same spacing.
//
// The real data is wired through: the confirmed sponsors board, and — when the
// edition has published a prospectus — the "why sponsor" highlights, the
// package cards with their benefit comparison table, and the "what your money
// pays for" list. Editions without a prospectus fall back to the plain contact
// callout the page had before. Every sponsor logo links to its site.

import {
  NumberHeading,
  PageHeader,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { SponsorSlotCard } from "@/components/molecules/SponsorSlotCard";
import { SponsorTile } from "@/components/molecules/SponsorTile";
import { listAvailableTiers } from "@/lib/content/sponsors";
import { TIER_COLOR, TIER_LABEL_ES } from "@/lib/utils/sponsor-tiers";
import type { Sponsor } from "@/lib/content/sponsors";
import type { Sponsorship } from "@/lib/content/sponsorship";
import type { EventInfo } from "@/lib/content/event-info";

type SponsorsTemplateProps = {
  sponsors: Sponsor[];
  eventInfo: EventInfo;
  /** Edition prospectus. `null` when this edition has not published one. */
  sponsorship?: Sponsorship | null;
};

export function SponsorsTemplate({
  sponsors,
  eventInfo,
  sponsorship = null,
}: SponsorsTemplateProps) {
  const contactEmail = sponsorship?.contact?.email ?? eventInfo.contactEmail;
  const mailto = `mailto:${contactEmail}?subject=Sponsor%20AWS%20Community%20Day%20Paraguay`;

  const hasHighlights =
    sponsorship != null && sponsorship.highlights.length > 0;
  const hasPackages = sponsorship != null && sponsorship.packages.length > 0;
  const hasFunds = sponsorship != null && sponsorship.funds.length > 0;

  // The tiers still for sale. They fill the board while the real logos are
  // being signed, and each one drops off as its sponsor is confirmed.
  const packages = sponsorship?.packages ?? [];
  const availableTiers = listAvailableTiers(packages, sponsors);
  const priceByTier = new Map(packages.map((p) => [p.tier, p.price]));
  const slotHref = hasPackages ? "#paquetes" : mailto;

  return (
    <>
      <PageHeader
        eyebrow="Auspiciantes"
        title="Sponsors"
        description={`Las empresas y comunidades que hacen posible ${eventInfo.name}.`}
      >
        <div className="flex flex-wrap gap-2.5">
          {hasPackages ? (
            <a
              href="#paquetes"
              className="inline-flex items-center rounded-[4px] bg-[var(--color-action)] px-[22px] py-[11px] text-[14.5px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
            >
              Ver paquetes
            </a>
          ) : null}
          <a
            href={mailto}
            className="inline-flex items-center rounded-[4px] border-[1.5px] border-[var(--color-text-primary)] px-[22px] py-[11px] text-[14.5px] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
          >
            Escribirnos
          </a>
        </div>
      </PageHeader>

      {/* ── 01 · Quiénes nos acompañan ───────────────────────── */}
      <section className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface)]">
        <div className={`${WRAP} py-14`}>
          <NumberHeading n="01" title="Quiénes nos acompañan" />
          {sponsors.length === 0 && availableTiers.length > 0 ? (
            <p className="m-0 mb-7 max-w-[44rem] text-[16px] text-[var(--color-text-secondary)]">
              Todavía no hay sponsors confirmados. Estos son los cupos
              disponibles para la primera edición:
            </p>
          ) : null}
          {sponsors.length === 0 && availableTiers.length === 0 ? (
            <div className="border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] px-7 py-14 text-center">
              <h3 className="m-0 text-[22px] font-bold tracking-[-0.02em]">
                Sumate como sponsor
              </h3>
              <p className="mx-auto mt-3 max-w-[34rem] text-[15px] text-[var(--color-text-secondary)]">
                Aún no hay sponsors confirmados. Si querés auspiciar el primer
                Community Day en Paraguay,{" "}
                <a
                  href={mailto}
                  className="font-bold text-[var(--color-accent)]"
                >
                  escribinos
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="grid border-l border-t border-[var(--color-border-subtle)] [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
              {sponsors.map((sponsor) => (
                <SponsorTile
                  key={sponsor.id}
                  sponsor={sponsor}
                  className="min-h-[160px] py-9"
                />
              ))}
              {availableTiers.map((tier) => (
                <SponsorSlotCard
                  key={tier}
                  tier={tier}
                  price={priceByTier.get(tier)}
                  href={slotHref}
                  className="min-h-[160px] py-9"
                />
              ))}
            </div>
          )}
          <p className="mt-[18px] text-[13.5px] text-[var(--color-text-muted)]">
            Los sponsors confirmados se publican a medida que se cierran los
            acuerdos.
          </p>
        </div>
      </section>

      {/* ── 02 · ¿Por qué patrocinar? ────────────────────────── */}
      {hasHighlights ? (
        <section className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface-warm)]">
          <div className={`${WRAP} py-16`}>
            <NumberHeading n="02" title="¿Por qué patrocinar?" />
            <p className="m-0 mb-9 max-w-[46rem] text-[16.5px] text-[var(--color-text-secondary)]">
              {sponsorship!.intro}
            </p>
            <div className="grid border-l border-t border-[var(--color-text-primary)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              {sponsorship!.highlights.map((highlight, i) => (
                <div
                  key={highlight.title}
                  className="min-w-0 border-b border-r border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-[22px] py-6"
                >
                  <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mb-1.5 mt-2 text-[16px] font-bold tracking-[-0.015em]">
                    {highlight.title}
                  </h3>
                  <p className="m-0 text-[14px] leading-[1.55] text-[var(--color-text-muted)]">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── 03 · Paquetes de patrocinio ──────────────────────── */}
      {hasPackages ? (
        <section
          id="paquetes"
          className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface)]"
        >
          <div className={`${WRAP} py-16`}>
            <NumberHeading n="03" title="Paquetes de patrocinio" />
            <p className="m-0 mb-8 max-w-[44rem] text-[16px] text-[var(--color-text-secondary)]">
              Cada nivel combina visibilidad, posicionamiento de marca y
              oportunidades concretas de negocio. También armamos propuestas a
              medida.
            </p>

            <div className="mb-9 grid border-l border-t border-[var(--color-text-primary)] [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
              {sponsorship!.packages.map((pkg) => {
                const count = sponsorship!.benefits.filter((b) =>
                  b.tiers.includes(pkg.tier)
                ).length;
                return (
                  <div
                    key={pkg.tier}
                    className="min-w-0 border-b border-r border-[var(--color-border-subtle)] px-[22px] py-[26px]"
                  >
                    <div className="mb-3 flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 rounded-[2px]"
                        style={{ background: TIER_COLOR[pkg.tier] }}
                      />
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        {TIER_LABEL_ES[pkg.tier]}
                      </span>
                    </div>
                    <div className="mb-1 text-[28px] font-extrabold tracking-[-0.035em]">
                      {pkg.price}
                    </div>
                    <div className="text-[13px] text-[var(--color-text-muted)]">
                      {count}{" "}
                      {count === 1
                        ? "beneficio incluido"
                        : "beneficios incluidos"}
                    </div>
                  </div>
                );
              })}
            </div>

            {sponsorship!.benefits.length > 0 ? (
              <div className="overflow-x-auto border border-[var(--color-border-subtle)]">
                <table className="w-full min-w-[720px] border-collapse text-[14px]">
                  <caption className="sr-only">
                    Beneficios incluidos en cada paquete de patrocinio
                  </caption>
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="bg-[var(--color-surface-inverse)] px-[18px] py-3.5 text-left text-[12px] font-semibold tracking-[0.04em] text-[var(--color-text-on-inverse)]"
                      >
                        Beneficio
                      </th>
                      {sponsorship!.packages.map((pkg) => (
                        <th
                          key={pkg.tier}
                          scope="col"
                          className="w-[110px] bg-[var(--color-surface-inverse)] px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-on-inverse)]"
                        >
                          {TIER_LABEL_ES[pkg.tier]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sponsorship!.benefits.map((benefit, i) => (
                      <tr
                        key={benefit.label}
                        className={
                          "border-t border-[var(--color-border-subtle)] " +
                          (i % 2 === 1
                            ? "bg-[var(--color-surface-muted)]"
                            : "bg-[var(--color-surface)]")
                        }
                      >
                        <td className="px-[18px] py-3.5 leading-[1.5] text-[var(--color-text-secondary)]">
                          {benefit.label}
                        </td>
                        {sponsorship!.packages.map((pkg) => {
                          const included = benefit.tiers.includes(pkg.tier);
                          return (
                            <td
                              key={pkg.tier}
                              className={
                                "px-3 py-3.5 text-center text-[16px] font-bold " +
                                (included
                                  ? "text-[var(--color-success)]"
                                  : "text-[var(--color-text-muted)]")
                              }
                            >
                              <span className="sr-only">
                                {TIER_LABEL_ES[pkg.tier]}:{" "}
                                {included ? "incluido" : "no incluido"}
                              </span>
                              <span aria-hidden="true">
                                {included ? "✓" : "—"}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── 04 · En qué se invierte tu aporte ────────────────── */}
      {hasFunds ? (
        <section className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface-muted)]">
          <div className={`${WRAP} py-16`}>
            <NumberHeading n="04" title="En qué se invierte tu aporte" />
            <p className="m-0 mb-7 max-w-[44rem] text-[16px] text-[var(--color-text-secondary)]">
              Tu apoyo es un aporte directo a la comunidad técnica paraguaya.
              Así se usa:
            </p>
            <ul className="grid list-none border-t border-[var(--color-text-primary)] p-0 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
              {sponsorship!.funds.map((item) => (
                <li
                  key={item}
                  className="flex min-w-0 items-baseline gap-3 border-b border-[var(--color-border-subtle)] py-4 pr-[18px]"
                >
                  <span
                    aria-hidden="true"
                    className="flex-none font-mono text-[11px] text-[var(--color-action-label)]"
                  >
                    ✓
                  </span>
                  <span className="text-[15px] text-[var(--color-text-primary)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── 05 · ¿Querés ser sponsor? ────────────────────────── */}
      <section className="bg-[var(--color-surface)]">
        <div className={`${WRAP} pb-[72px] pt-16`}>
          <div className="grid items-center gap-10 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div className="min-w-0">
              <h2 className="m-0 mb-3.5 text-[clamp(24px,3vw,36px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
                ¿Querés ser sponsor?
              </h2>
              <p className="m-0 mb-6 max-w-[32rem] text-[16px] text-[var(--color-text-secondary)]">
                Si tu empresa quiere apoyar el primer Community Day en Paraguay,
                escribinos. Compartimos los paquetes disponibles y respondemos a
                la brevedad.
              </p>
              <a
                href={mailto}
                className="inline-flex items-center rounded-[4px] bg-[var(--color-action)] px-7 py-3.5 text-[15.5px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
              >
                Escribirnos por patrocinio
              </a>
            </div>

            {sponsorship?.contact ? (
              <dl className="m-0 min-w-0 border-t border-[var(--color-text-primary)]">
                <div className="flex justify-between gap-4 border-b border-[var(--color-border-subtle)] py-3.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Contacto
                  </dt>
                  <dd className="m-0 text-[15px] font-semibold">
                    {sponsorship.contact.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[var(--color-border-subtle)] py-3.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Correo
                  </dt>
                  <dd className="m-0 break-words text-[15px]">
                    <a
                      href={`mailto:${sponsorship.contact.email}`}
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      {sponsorship.contact.email}
                    </a>
                  </dd>
                </div>
                {sponsorship.contact.phone ? (
                  <div className="flex justify-between gap-4 border-b border-[var(--color-border-subtle)] py-3.5">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      Teléfono
                    </dt>
                    <dd className="m-0 text-[15px]">
                      <a
                        href={`tel:${sponsorship.contact.phone.replace(/\s/g, "")}`}
                        className="text-[var(--color-accent)] hover:underline"
                      >
                        {sponsorship.contact.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
