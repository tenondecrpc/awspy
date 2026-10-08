// Venue page: where, how to get there, what is there. The top block puts the
// name, address and the three facts (where, day, hours) beside the facade
// photo; the map gets the full width below. Transport and accessibility are
// wired to the real `venue` arrays and render only when they have content:
// nothing is invented to fill a block the organizers have not written yet.

import venuePhoto from "@/public/assets/venue/cover.jpg";
import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import { IconBadge } from "@/components/atoms/IconBadge";
import {
  BTN_OUTLINE,
  Frame,
  SectionTitle,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { formatDate, formatTime } from "@/lib/utils/datetime";
import type { EventInfo } from "@/lib/content/event-info";
import type { Venue } from "@/lib/content/venue";

type VenueTemplateProps = {
  venue: Venue;
  eventInfo: EventInfo;
};

/** Swapping the photo is replacing `public/assets/venue/cover.jpg`; the static
 *  import hashes whatever the file holds, so a new photo gets a fresh URL. */
const VENUE_PHOTO = venuePhoto;

function Fact({
  icon,
  label,
  children,
}: {
  icon: GlyphName;
  label: string;
  children: string;
}) {
  return (
    <li className="flex items-center gap-4">
      <IconBadge name={icon} />
      <div className="min-w-0">
        <p className="m-0 text-sm text-[var(--color-text-muted)]">{label}</p>
        <p className="m-0 text-step-0 font-semibold leading-snug text-[var(--color-text-primary)]">
          {children}
        </p>
      </div>
    </li>
  );
}

function InfoCard({
  icon,
  title,
  items,
}: {
  icon: GlyphName;
  title: string;
  items: string[];
}) {
  return (
    <section className="min-w-0 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] p-6">
      <div className="mb-4 flex items-center gap-3">
        <IconBadge name={icon} />
        <h3 className="m-0 text-step-1">{title}</h3>
      </div>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-step-0 leading-[1.55] text-[var(--color-text-secondary)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function VenueTemplate({ venue, eventInfo }: VenueTemplateProps) {
  const hasExtras =
    venue.transport.length > 0 || venue.accessibility.length > 0;

  return (
    <>
      <section id="contenido-principal">
        <div
          className={`${WRAP} grid items-center gap-x-14 gap-y-8 py-[clamp(1.5rem,5svh,3.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]`}
        >
          <div className="min-w-0">
            <h1 className="m-0 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
              Sede
            </h1>
            <p className="m-0 mt-2 text-step-0 text-[var(--color-text-secondary)]">
              Dónde nos vemos para el AWS Community Day Paraguay.
            </p>
            <p className="m-0 mt-3 text-step-1 font-semibold leading-snug text-[var(--color-text-primary)]">
              {venue.name}
            </p>

            <ul className="m-0 mt-7 flex list-none flex-col gap-5 p-0">
              <Fact icon="pin" label="Dirección">
                {venue.address}
              </Fact>
              <Fact icon="calendar" label="Fecha">
                {formatDate(eventInfo.dates.start)}
              </Fact>
              <Fact icon="clock" label="Horario">
                {`${formatTime(eventInfo.dates.start)} – ${formatTime(eventInfo.dates.end)}`}
              </Fact>
              <Fact icon="door" label="Acreditación">
                Hall de ingreso
              </Fact>
              <Fact icon="users" label="Salas">
                Guaraní · Ñandútí · Taller
              </Fact>
            </ul>

            <div className="mt-6">
              <h2 className="m-0 mb-2 text-step-1">Espacios</h2>
              <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-sm text-[var(--color-text-secondary)]">
                {[
                  "Auditorio",
                  "Sala de taller",
                  "Espacio de networking",
                  "Ingreso / acreditación",
                ].map((space) => (
                  <li key={space}>{space}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={BTN_OUTLINE}
              >
                <GlyphIcon name="external" size={20} />
                Abrir en Google Maps
              </a>
              <a href="#mapa" className={BTN_OUTLINE}>
                <GlyphIcon name="route" size={20} />
                Cómo llegar
              </a>
            </div>
          </div>

          {/* The frame matches the source photo's exact ratio so nothing is
              cropped: 1875x839. `aspect-video` was correct for the old 16:9
              file and started cutting the left and right edges when the photo
              was swapped. Update this if cover.jpg is replaced again. */}
          <Frame
            label={`Fachada de ${venue.name}`}
            photo={VENUE_PHOTO}
            className="aspect-[1875/839] w-full rounded-[var(--radius-md)]"
            sizes="(min-width: 1024px) 680px, 100vw"
            preload
          />
        </div>
      </section>

      <section id="mapa" className="scroll-mt-24">
        <div className={`${WRAP} pb-[var(--space-section-y)]`}>
          <SectionTitle title="Cómo llegar" />
          <div className="overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-muted)]">
            {venue.embedMapUrl ? (
              <iframe
                title={`Mapa de la sede: ${venue.name}`}
                src={venue.embedMapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[22rem] w-full border-0 sm:h-[24rem]"
              />
            ) : (
              <Frame label="Mapa de la sede" className="h-[22rem] w-full" />
            )}
          </div>
        </div>
      </section>

      {hasExtras ? (
        <section>
          <div className={`${WRAP} pb-[var(--space-section-y)]`}>
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
              {venue.transport.length > 0 ? (
                <InfoCard
                  icon="route"
                  title="Transporte"
                  items={venue.transport}
                />
              ) : null}
              {venue.accessibility.length > 0 ? (
                <InfoCard
                  icon="info"
                  title="Accesibilidad"
                  items={venue.accessibility}
                />
              ) : null}
            </div>
            {venue.accessibility.length > 0 ? (
              <p className="m-0 mt-5 text-base text-[var(--color-text-secondary)]">
                Si necesitás una adaptación puntual, escribinos a{" "}
                <a
                  href={`mailto:${eventInfo.contactEmail}`}
                  className="font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4"
                >
                  {eventInfo.contactEmail}
                </a>
                .
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
