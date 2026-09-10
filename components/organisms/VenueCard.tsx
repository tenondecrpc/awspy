// Venue card organism. Lays the venue out the way the rest of the AWS
// Community Day family does it: the map takes the visual lead, and the
// practical details sit beside it as separate cards (address, how to get
// there, accessibility) with the map actions at the end.
//
// When `venue.embedMapUrl` is absent, a Placeholder of the same height keeps
// the two columns balanced, so configuring the embed later causes no layout
// shift. The embed host is restricted by the venue schema.

import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Button } from "@/components/atoms/Button";
import { Placeholder } from "@/components/atoms/Placeholder";
import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import type { Venue } from "@/lib/content/venue";

type VenueCardProps = {
  venue: Venue;
};

function InfoCard({
  glyph,
  title,
  children,
}: {
  glyph: GlyphName;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-5">
      <h3 className="mb-3 flex items-center gap-2 text-base font-bold">
        <GlyphIcon
          name={glyph}
          size={18}
          className="text-[var(--color-national-red-label)]"
        />
        {title}
      </h3>
      {children}
    </div>
  );
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Container>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* Map first on large screens, after the details on small ones, so a
            phone shows the address before a 400px map. */}
        <div className="order-2 lg:order-1">
          {venue.embedMapUrl ? (
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm">
              <iframe
                src={venue.embedMapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full border-0 sm:h-[460px]"
                title={`Mapa de ${venue.name}`}
              />
            </div>
          ) : (
            <Placeholder
              kind="cover"
              aspectRatio={4 / 3}
              className="h-[320px] w-full sm:h-[460px]"
            />
          )}
        </div>

        <div className="order-1 flex flex-col gap-5 lg:order-2">
          <div className="space-y-2">
            <Heading level={2} visualLevel={3}>
              {venue.name}
            </Heading>
            <p className="flex items-start gap-2 text-[var(--color-text-secondary)]">
              <GlyphIcon
                name="pin"
                size={20}
                className="mt-0.5 text-[var(--color-national-red-label)]"
              />
              {venue.address}
            </p>
          </div>

          {venue.transport.length > 0 ? (
            <InfoCard glyph="pin" title="Cómo llegar">
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                {venue.transport.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-[var(--radius-pill)] bg-[var(--color-action)]"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </InfoCard>
          ) : null}

          {venue.accessibility && venue.accessibility.length > 0 ? (
            <InfoCard glyph="users" title="Accesibilidad">
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                {venue.accessibility.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-[var(--radius-pill)] bg-[var(--color-tier-community)]"
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </InfoCard>
          ) : null}

          <Button
            as="a"
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            shape="pill"
            className="self-start"
          >
            Ver en el mapa
          </Button>
        </div>
      </div>
    </Container>
  );
}
