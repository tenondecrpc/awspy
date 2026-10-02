// Sponsors page. It has one job beyond listing who is already in: SELL the
// sponsorship. Two people arrive here and each needs a different answer:
//   - an attendee or the community: "who is backing this event?" -> the
//     confirmed sponsors, large and linked, at the top;
//   - a company: "why should we, what do we get, and how do we join?" ->
//     a pitch backed by the event's expected numbers, the benefits, then the
//     packages as a ladder where each level adds to the one below, and a clear
//     way to write to a person.
//
// The page names each package and what it includes, never what it costs: an
// amount on a public page turns companies away before they write, so pricing
// goes out on request.

import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import { IconBadge } from "@/components/atoms/IconBadge";
import {
  BTN_INK,
  BTN_OUTLINE,
  H2,
  SECTION_Y,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { SponsorBoard } from "@/components/organisms/SponsorBoard";
import { SponsorshipPackages } from "@/components/organisms/SponsorshipPackages";
import { TIER_COLOR, TIER_LABEL } from "@/lib/utils/sponsor-tiers";
import type { Sponsor } from "@/lib/content/sponsors";
import type { Sponsorship } from "@/lib/content/sponsorship";
import type { EventInfo } from "@/lib/content/event-info";

type SponsorsTemplateProps = {
  sponsors: Sponsor[];
  eventInfo: EventInfo;
  /** Edition prospectus. `null` when this edition has not published one. */
  sponsorship?: Sponsorship | null;
};

/** An icon for each reason to sponsor, chosen by the topic of its title. */
const HIGHLIGHT_ICONS: { match: RegExp; icon: GlyphName }[] = [
  { match: /visibilidad/i, icon: "globe" },
  { match: /audiencia/i, icon: "users" },
  { match: /negocio/i, icon: "target" },
  { match: /networking/i, icon: "chat" },
  { match: /posicionamiento|l[ií]der/i, icon: "bolt" },
  { match: /programa|participaci/i, icon: "mic" },
  { match: /talento/i, icon: "laptop" },
  { match: /comunidad|contribuci/i, icon: "heart" },
];

/** The figures worth putting in front of a sponsor, in this order. */
const FIGURE_LABELS = ["Asistentes", "Speakers", "Sesiones técnicas", "Horas de contenido"];

const LINK =
  "font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4 [overflow-wrap:anywhere]";

const nbsp = (text: string) => text.replace(/ /g, " ");

export function SponsorsTemplate({
  sponsors,
  eventInfo,
  sponsorship = null,
}: SponsorsTemplateProps) {
  const contact = sponsorship?.contact;
  const contactEmail = contact?.email ?? eventInfo.contactEmail;
  const subject = "Sponsor AWS Community Day Paraguay";
  const mailto = (s: string) =>
    `mailto:${contactEmail}?subject=${encodeURIComponent(s)}`;

  const packages = sponsorship?.packages ?? [];
  const benefits = sponsorship?.benefits ?? [];
  const highlights = sponsorship?.highlights ?? [];
  const funds = sponsorship?.funds ?? [];
  const notes = sponsorship?.notes ?? [];

  const figures = FIGURE_LABELS.map((label) =>
    eventInfo.expectedFigures.find((f) => f.label === label)
  ).filter((f): f is { value: string; label: string } => Boolean(f));

  // The packages as a ladder: each one lists only what it ADDS to the level
  // below it (the next package in the prospectus order), so the step up reads
  // at a glance instead of repeating the same rows four times.
  const ladder = packages.map((pkg, i) => {
    const below = packages[i + 1];
    const included = benefits.filter((b) => b.tiers.includes(pkg.tier));
    const inherited = below
      ? benefits.filter((b) => b.tiers.includes(below.tier))
      : [];
    return {
      tier: pkg.tier,
      below: below?.tier ?? null,
      total: included.length,
      added: included.filter((b) => !inherited.includes(b)),
    };
  });

  return (
    <>
      {/* ── Quién respalda el evento ──────────────────────────── */}
      <section className={SECTION_Y} id="contenido-principal">
        <div className={WRAP}>
          <h1 className="m-0 mb-3 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
            Sponsors
          </h1>
          <p className="m-0 mb-8 max-w-[38rem] text-step-0 text-[var(--color-text-secondary)]">
            Las empresas y comunidades que hacen posible {eventInfo.name}.
          </p>

          {sponsors.length === 0 ? (
            <p className="m-0 flex items-center gap-3 text-step-0 text-[var(--color-text-secondary)]">
              <IconBadge name="heart" />
              Todavía no hay sponsors confirmados.
            </p>
          ) : (
            <div className="max-w-[44rem]">
              <SponsorBoard
                sponsors={sponsors}
                openSlots={0}
                slotHref={mailto(subject)}
                size="lg"
              />
            </div>
          )}
        </div>
      </section>

      {/* ── La oferta: por qué ser sponsor ────────────────────── */}
      <section
        className={`${SECTION_Y} bg-[var(--color-surface-muted)]`}
        aria-labelledby="ser-sponsor"
      >
        <div className={WRAP}>
          <div className="grid items-start gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <h2 id="ser-sponsor" className={`${H2} mb-3`}>
                ¿Querés ser{" "}sponsor?
              </h2>
              <p className="m-0 mb-7 max-w-[34rem] text-step-0 text-[var(--color-text-secondary)]">
                {sponsorship?.intro ??
                  "Sumá tu organización a la primera edición del Community Day en Paraguay."}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <a href={mailto(subject)} className={BTN_INK}>
                  <GlyphIcon name="mail" size={18} />
                  Quiero ser sponsor
                </a>
                {packages.length > 0 ? (
                  <a href="#paquetes" className={BTN_OUTLINE}>
                    Ver los paquetes
                    <GlyphIcon name="arrow-right" size={18} />
                  </a>
                ) : null}
              </div>

              {contact ? (
                <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <IconBadge name="user" size="sm" tone="solid" />
                    <span className="min-w-0">
                      <span className="block text-sm text-[var(--color-text-muted)]">
                        Persona de contacto
                      </span>
                      <span className="block whitespace-nowrap text-base font-semibold text-[var(--color-text-primary)]">
                        {contact.name}
                      </span>
                    </span>
                  </li>
                  {contact.phone ? (
                    <li className="flex items-center gap-3">
                      <IconBadge name="phone" size="sm" tone="solid" />
                      <span className="min-w-0">
                        <span className="block text-sm text-[var(--color-text-muted)]">
                          Teléfono
                        </span>
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, "")}`}
                          className={`${LINK} block whitespace-nowrap text-base`}
                        >
                          {nbsp(contact.phone)}
                        </a>
                      </span>
                    </li>
                  ) : null}
                  <li className="flex items-center gap-3 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <IconBadge name="mail" size="sm" tone="solid" />
                    <span className="min-w-0">
                      <span className="block text-sm text-[var(--color-text-muted)]">
                        Correo
                      </span>
                      <a
                        href={`mailto:${contact.email}`}
                        className={`${LINK} block text-base`}
                      >
                        {contact.email}
                      </a>
                    </span>
                  </li>
                </ul>
              ) : null}
            </div>

            {/* The numbers a sponsor asks first. They are projections, and the
                caption says so. */}
            {figures.length > 0 ? (
              <div className="min-w-0 bg-[var(--color-surface-elevated)] p-7 sm:p-8">
                <p className="m-0 mb-5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)]">
                  <GlyphIcon name="target" size={18} />
                  Lo que esperamos del Community Day
                </p>
                <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-7">
                  {figures.map((f) => (
                    <div key={f.label} className="min-w-0">
                      <dd className="m-0 font-display text-[clamp(2.5rem,1.6rem+3vw,3.75rem)] leading-none tracking-[-0.02em] text-[var(--color-text-primary)]">
                        {f.value}
                      </dd>
                      <dt className="mt-2 text-base text-[var(--color-text-secondary)]">
                        {f.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>

          {/* Why sponsor: eight reasons, each with its icon. */}
          {highlights.length > 0 ? (
            <ul className="m-0 mt-12 grid list-none gap-4 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(15rem,100%),1fr))]">
              {highlights.map((h) => {
                const icon =
                  HIGHLIGHT_ICONS.find((m) => m.match.test(h.title))?.icon ??
                  "check";
                return (
                  <li
                    key={h.title}
                    className="flex min-w-0 flex-col gap-3 bg-[var(--color-surface-elevated)] p-5"
                  >
                    <IconBadge name={icon} />
                    <h3 className="m-0 text-step-0 leading-snug text-[var(--color-text-primary)]">
                      {h.title}
                    </h3>
                    <p className="m-0 text-step--1 text-[var(--color-text-secondary)]">
                      {h.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </section>

      {/* ── Paquetes: una escalera ────────────────────────────── */}
      {ladder.length > 0 ? (
        <section id="paquetes" className={`${SECTION_Y} scroll-mt-20`}>
          <div className={WRAP}>
            <h2 className={`${H2} mb-3`}>Paquetes de patrocinio</h2>
            <p className="m-0 mb-10 max-w-[40rem] text-step-0 text-[var(--color-text-secondary)]">
              Cuatro niveles. Cada uno incluye todo lo del nivel de abajo y suma
              algo más. Los valores se envían a pedido.
            </p>

            {/* One row per level, each sized to what it holds: a ladder you
                read top to bottom, with the tier color as its left edge. */}
            <ul className="m-0 grid list-none gap-3 p-0">
              {ladder.map((p, i) => (
                <li
                  key={p.tier}
                  style={{
                    borderLeft: `0.5rem solid ${TIER_COLOR[p.tier]}`,
                    backgroundColor: `color-mix(in srgb, ${TIER_COLOR[p.tier]} ${14 - i * 3}%, var(--color-surface-elevated))`,
                  }}
                  className="grid min-w-0 gap-x-8 gap-y-4 bg-[var(--color-surface-elevated)] p-6 md:grid-cols-[15rem_minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      style={{
                        background: `color-mix(in srgb, ${TIER_COLOR[p.tier]} 30%, var(--color-surface-elevated))`,
                      }}
                      className="grid h-14 w-14 flex-none place-items-center rounded-full text-[var(--color-text-primary)]"
                    >
                      {/* More gems the higher the level: the badge itself says it. */}
                      <span className="flex items-center">
                        {Array.from({ length: ladder.length - i }).map((_, g) => (
                          <GlyphIcon
                            key={g}
                            name="gem"
                            size={ladder.length - i > 2 ? 14 : 20}
                            className={g > 0 ? "-ml-1" : ""}
                          />
                        ))}
                      </span>
                    </span>
                    <div className="min-w-0">
                      <h3 className="m-0 text-step-1 leading-tight text-[var(--color-text-primary)]">
                        {TIER_LABEL[p.tier]}
                      </h3>
                      <p className="m-0 text-sm text-[var(--color-text-secondary)]">
                        {i === 0
                          ? "El más completo"
                          : p.below
                            ? `Suma al nivel ${TIER_LABEL[p.below]}`
                            : "Para empezar"}
                      </p>
                      <p className="m-0 mt-1 flex items-baseline gap-1.5 text-sm text-[var(--color-text-muted)]">
                        <span className="font-display text-step-2 leading-none text-[var(--color-text-primary)]">
                          {p.total}
                        </span>
                        {p.total === 1 ? "beneficio" : "beneficios"}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="m-0 mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
                      {p.below
                        ? `Todo lo de ${TIER_LABEL[p.below]}, y además:`
                        : "Incluye:"}
                    </p>
                    <ul className="m-0 grid list-none gap-x-6 gap-y-2.5 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(17rem,100%),1fr))]">
                      {p.added.map((b) => (
                        <li
                          key={b.label}
                          className="flex items-start gap-2.5 text-step--1 leading-[1.45] text-[var(--color-text-secondary)]"
                        >
                          <GlyphIcon
                            name="check"
                            size={18}
                            className="mt-0.5 text-[var(--color-success)]"
                          />
                          {b.label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={mailto(
                      `Sponsor ${TIER_LABEL[p.tier]} - AWS Community Day Paraguay`
                    )}
                    className={`${BTN_OUTLINE} md:justify-self-end`}
                  >
                    Consultar este nivel
                  </a>
                </li>
              ))}
            </ul>

            {notes.length > 0 ? (
              <ul
                aria-label="Condiciones de los paquetes"
                className="m-0 mt-6 grid list-none gap-1 p-0"
              >
                {notes.map((note) => (
                  <li
                    key={note}
                    className="flex max-w-[46rem] items-start gap-2.5 text-sm leading-[1.55] text-[var(--color-text-secondary)]"
                  >
                    <GlyphIcon
                      name="info"
                      size={16}
                      className="mt-0.5 text-[var(--color-text-muted)]"
                    />
                    {note}
                  </li>
                ))}
              </ul>
            ) : null}

            {/* The full side-by-side table, for whoever wants to compare. */}
            {benefits.length > 0 ? (
              <div id="comparacion" className="mt-14 scroll-mt-20">
                <h3 className="m-0 mb-1 font-display text-step-1 text-[var(--color-text-primary)]">
                  Compará los niveles lado a lado
                </h3>
                <p className="m-0 mb-5 text-step--1 text-[var(--color-text-secondary)]">
                  Cada columna es un paquete; cada fila, un beneficio.
                </p>
                <SponsorshipPackages
                  packages={packages}
                  benefits={benefits}
                  actionHref={(tier) =>
                    mailto(
                      `Sponsor ${TIER_LABEL[tier]} - AWS Community Day Paraguay`
                    )
                  }
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── En qué se invierte el aporte ──────────────────────── */}
      {funds.length > 0 ? (
        <section className={`${SECTION_Y} bg-[var(--color-surface-muted)]`}>
          <div className={WRAP}>
            <h2 className={`${H2} mb-2`}>En qué se invierte el aporte</h2>
            <p className="m-0 mb-6 max-w-[38rem] text-step-0 text-[var(--color-text-secondary)]">
              El patrocinio se destina a hacer posible la jornada.
            </p>
            <ul className="m-0 grid list-none gap-3 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(16rem,100%),1fr))]">
              {funds.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 bg-[var(--color-surface-elevated)] p-4 text-base text-[var(--color-text-primary)]"
                >
                  <IconBadge name="check" size="sm" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
