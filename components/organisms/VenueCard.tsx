// Venue card organism: name, address and the map link, with the embedded map
// beside them. Without `venue.embedMapUrl` a Placeholder of the same height
// keeps the layout stable. The embed host is restricted by the venue schema.

import { Container } from "@/components/atoms/Container";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { Placeholder } from "@/components/atoms/Placeholder";
import { IconBadge } from "@/components/atoms/IconBadge";
import { BTN_OUTLINE } from "@/components/molecules/SectionPrimitives";
import type { Venue } from "@/lib/content/venue";

type VenueCardProps = {
  venue: Venue;
};

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="m-0 mb-3 text-step-1">{title}</h3>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((item, i) => (
          <li key={i} className="text-base text-[var(--color-text-secondary)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Container>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="order-2 lg:order-1">
          {venue.embedMapUrl ? (
            <div className="overflow-hidden rounded-[var(--radius-md)]">
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

        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <div className="flex items-start gap-4">
            <IconBadge name="pin" />
            <div className="min-w-0">
              <h2 className="m-0 font-display text-step-2 leading-[1.1]">
                {venue.name}
              </h2>
              <p className="m-0 mt-1 text-[var(--color-text-secondary)]">
                {venue.address}
              </p>
            </div>
          </div>

          {venue.transport.length > 0 ? (
            <DetailList title="Cómo llegar" items={venue.transport} />
          ) : null}

          {venue.accessibility && venue.accessibility.length > 0 ? (
            <DetailList title="Accesibilidad" items={venue.accessibility} />
          ) : null}

          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN_OUTLINE} self-start`}
          >
            <GlyphIcon name="external" size={20} />
            Ver en el mapa
          </a>
        </div>
      </div>
    </Container>
  );
}
