// Venue card organism. Renders the venue name, address, optional embedded
// map (constrained to trusted hosts in the schema), and transport/access
// notes.

import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import type { Venue } from "@/lib/content/venue";

type VenueCardProps = {
  venue: Venue;
};

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <Heading level={2} visualLevel={3}>
            {venue.name}
          </Heading>
          <p className="text-[var(--color-text-secondary)]">{venue.address}</p>
          <Link href={venue.mapUrl} external className="text-sm">
            Ver en el mapa
          </Link>

          {venue.transport.length > 0 ? (
            <div className="space-y-2">
              <p className="font-semibold">Cómo llegar</p>
              <ul className="list-disc pl-5 text-sm text-[var(--color-text-secondary)]">
                {venue.transport.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {venue.accessibility && venue.accessibility.length > 0 ? (
            <div className="space-y-2">
              <p className="font-semibold">Accesibilidad</p>
              <ul className="list-disc pl-5 text-sm text-[var(--color-text-secondary)]">
                {venue.accessibility.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {venue.embedMapUrl ? (
          <div className="overflow-hidden rounded-[var(--radius-lg)] shadow-sm">
            <iframe
              src={venue.embedMapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[400px] w-full border-0"
              title={`Mapa de ${venue.name}`}
            />
          </div>
        ) : null}
      </div>
    </Container>
  );
}
