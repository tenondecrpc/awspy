// Sponsors page template. Composes the sponsors board with the edition
// prospectus: why sponsor, what each package costs and includes, and what the
// contribution pays for. When the edition has no prospectus the page falls
// back to the plain "write to us" callout it had before.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Button } from "@/components/atoms/Button";
import { SponsorsBoard } from "@/components/organisms/SponsorsBoard";
import { SponsorshipPackages } from "@/components/organisms/SponsorshipPackages";
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
  const mailto = `mailto:${
    sponsorship?.contact?.email ?? eventInfo.contactEmail
  }?subject=Sponsor%20AWS%20Community%20Day%20Paraguay`;

  return (
    <>
      <Section spacing="lg">
        <Container>
          <SectionHeading
            level={1}
            eyebrow="Auspiciantes"
            title="Sponsors"
            description={`Las empresas y comunidades que hacen posible ${eventInfo.name}.`}
            className="mb-14"
          />
          <SponsorsBoard sponsors={sponsors} eventInfo={eventInfo} />
        </Container>
      </Section>

      {sponsorship && sponsorship.highlights.length > 0 ? (
        <Section spacing="lg" tone="muted" aria-labelledby="why-sponsor-title">
          <Container>
            <SectionHeading
              id="why-sponsor-title"
              level={2}
              eyebrow="Beneficios"
              title="¿Por qué"
              highlight="patrocinar?"
              tone="muted"
              description={sponsorship.intro}
              className="mb-12"
            />

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sponsorship.highlights.map((highlight) => (
                <li
                  key={highlight.title}
                  className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6"
                >
                  <h3 className="text-base font-bold">{highlight.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {highlight.description}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {sponsorship && sponsorship.packages.length > 0 ? (
        <Section spacing="lg" aria-labelledby="packages-title">
          <Container>
            <SectionHeading
              id="packages-title"
              level={2}
              eyebrow="Paquetes"
              title="Paquetes de"
              highlight="patrocinio"
              description="Cada nivel combina visibilidad, posicionamiento de marca y oportunidades concretas de negocio. También armamos propuestas a medida."
              className="mb-12"
            />
            <SponsorshipPackages
              packages={sponsorship.packages}
              benefits={sponsorship.benefits}
            />
          </Container>
        </Section>
      ) : null}

      {sponsorship && sponsorship.funds.length > 0 ? (
        <Section spacing="lg" tone="muted" aria-labelledby="funds-title">
          <Container>
            <SectionHeading
              id="funds-title"
              level={2}
              eyebrow="Tu aporte"
              title="En qué se"
              highlight="invierte"
              tone="muted"
              description="Tu apoyo es un aporte directo a la comunidad técnica paraguaya. Así se usa:"
              className="mb-12"
            />

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sponsorship.funds.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[var(--color-accent-strong)]"
                  >
                    <GlyphIcon name="check" size={20} />
                  </span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section spacing="md" tone="muted" aria-labelledby="be-a-sponsor-title">
        <Container>
          <SectionHeading
            id="be-a-sponsor-title"
            level={2}
            eyebrow="Auspicios"
            title="¿Querés ser"
            highlight="sponsor?"
            tone="muted"
            description="Si tu empresa quiere apoyar el primer Community Day en Paraguay, escribinos. Compartimos los paquetes de auspicio disponibles y respondemos a la brevedad."
          >
            <Button
              as="a"
              href={mailto}
              variant="primary"
              size="lg"
              shape="pill"
            >
              Escribirnos por sponsoreo
            </Button>
          </SectionHeading>

          {sponsorship?.contact ? (
            <dl className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm">
              <div className="flex flex-col items-center gap-1">
                <dt className="font-bold">Contacto</dt>
                <dd className="text-[var(--color-text-secondary)]">
                  {sponsorship.contact.name}
                </dd>
              </div>
              <div className="flex flex-col items-center gap-1">
                <dt className="font-bold">Correo</dt>
                <dd>
                  <a
                    href={`mailto:${sponsorship.contact.email}`}
                    className="text-[var(--color-accent)] underline-offset-2 hover:underline"
                  >
                    {sponsorship.contact.email}
                  </a>
                </dd>
              </div>
              {sponsorship.contact.phone ? (
                <div className="flex flex-col items-center gap-1">
                  <dt className="font-bold">Teléfono</dt>
                  <dd>
                    <a
                      href={`tel:${sponsorship.contact.phone.replace(/\s/g, "")}`}
                      className="text-[var(--color-accent)] underline-offset-2 hover:underline"
                    >
                      {sponsorship.contact.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
