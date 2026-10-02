// Register page: the answer ("it's free") and the Eventbrite action first, with
// the key facts as icon items and a real photo beside them; then how it works
// in four steps and what to know before coming.
//
// Registration behavior is preserved: the `archived`, closed, upcoming, and
// open states, and `EventbriteRegisterButton` (external link + mailto
// fallback) as the only registration CTA.

import NextLink from "next/link";
import type { GlyphName } from "@/components/atoms/GlyphIcon";
import { IconBadge } from "@/components/atoms/IconBadge";
import {
  Frame,
  H2,
  SECTION_Y,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { EventbriteRegisterButton } from "@/components/organisms/EventbriteRegisterButton";
import { formatDate, formatTime } from "@/lib/utils/datetime";
import type { EventInfo } from "@/lib/content/event-info";

type RegisterTemplateProps = {
  eventInfo: EventInfo;
  /** When true, renders only the "Esta edición ya finalizó" message. Used by
   *  past-edition routes per FR-035. */
  archived?: boolean;
};

const STEPS: { icon: GlyphName; title: string; body: string }[] = [
  {
    icon: "ticket",
    title: "Reservá tu entrada",
    body: "El registro se hace en Eventbrite. Necesitás un correo válido y nada más.",
  },
  {
    icon: "mail",
    title: "Guardá el ticket",
    body: "Te llega por correo. Podés mostrarlo desde el teléfono al llegar.",
  },
  {
    icon: "door",
    title: "Acreditate el día del evento",
    body: "Presentá tu ticket en el hall de ingreso del SNPP.",
  },
  {
    icon: "flask",
    title: "Anotate a los talleres",
    body: "Los labs tienen cupo limitado y se anotan en el mostrador de acreditación.",
  },
];

const MAIL_LINK =
  "font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4 [overflow-wrap:anywhere]";
const TEXT_LINK =
  "inline-flex min-h-[var(--size-touch)] items-center font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]";

const STATUS_LABEL = {
  open: "Registro abierto",
  upcoming: "Registro próximamente",
  closed: "Registro cerrado",
  archived: "Edición finalizada",
} as const;

function StatusLine({ status }: { status: keyof typeof STATUS_LABEL }) {
  return (
    <p className="m-0 flex items-center gap-2.5 text-base font-semibold text-[var(--color-text-primary)]">
      <span
        aria-hidden="true"
        className={
          "size-2.5 flex-none " +
          (status === "open"
            ? "bg-[var(--color-success)]"
            : "border-2 border-[var(--color-text-muted)]")
        }
      />
      {STATUS_LABEL[status]}
    </p>
  );
}

function Fact({
  icon,
  children,
  wide,
}: {
  icon: GlyphName;
  children: string;
  wide?: boolean;
}) {
  return (
    <li
      className={
        (wide ? "sm:col-span-2 " : "") +
        "flex items-center gap-3 text-base font-semibold text-[var(--color-text-primary)]"
      }
    >
      <IconBadge name={icon} size="sm" />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export function RegisterTemplate({
  eventInfo,
  archived = false,
}: RegisterTemplateProps) {
  const status = archived ? "archived" : eventInfo.registrationStatus;
  const mailto = (
    <a href={`mailto:${eventInfo.contactEmail}`} className={MAIL_LINK}>
      {eventInfo.contactEmail}
    </a>
  );

  if (status !== "open") {
    return (
      <section id="contenido-principal" className={SECTION_Y}>
        <div className={WRAP}>
          <div className="max-w-2xl">
            <StatusLine status={status} />
            <h1 className="m-0 mb-4 mt-3 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
              Registro
            </h1>
            <p className="m-0 mb-6 text-step-0 text-[var(--color-text-secondary)]">
              {status === "upcoming"
                ? "Aún no abrimos el registro. Vas a poder reservar tu lugar cuando esté disponible. Dejanos tu mail y te avisamos apenas abra."
                : status === "closed"
                  ? "El registro para esta edición ya está cerrado. Si querés que te avisemos de la próxima edición, escribinos a "
                  : "Esta edición ya finalizó. El registro no está disponible."}
              {status === "closed" ? <>{mailto}.</> : null}
            </p>
            {status === "upcoming" ? (
              <EventbriteRegisterButton
                eventbriteEventUrl={eventInfo.eventbriteEventUrl}
                contactEmail={eventInfo.contactEmail}
                label="Avisame por mail"
              />
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="contenido-principal"
        className="pb-[var(--space-section-y)] pt-[clamp(1.5rem,4svh,3rem)]"
      >
        <div className={WRAP}>
          <div className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-2">
            <div className="min-w-0">
              <StatusLine status="open" />
              <h1 className="m-0 mb-5 mt-3 font-display text-step-2 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
                Registro
              </h1>

              {/* The card holds the one registration action. */}
              <div className="border border-transparent bg-[var(--color-surface-elevated)] p-8">
                <p className="m-0 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
                  Entrada gratuita
                </p>
                <p className="m-0 mb-6 mt-2 text-base text-[var(--color-text-secondary)]">
                  El acceso al evento es gratuito. Reservá tu lugar a través de
                  Eventbrite: es un proceso rápido y solo necesitás un correo.
                  El cupo es limitado.
                </p>
                <ul className="m-0 mb-7 grid list-none gap-3 p-0 sm:grid-cols-2">
                  <Fact icon="calendar">
                    {formatDate(eventInfo.dates.start)}
                  </Fact>
                  <Fact icon="clock">
                    {`${formatTime(eventInfo.dates.start)} – ${formatTime(
                      eventInfo.dates.end
                    )}`}
                  </Fact>
                  <Fact icon="pin" wide>
                    {eventInfo.location.summary}
                  </Fact>
                  <Fact icon="ticket">Cupo limitado</Fact>
                  <Fact icon="heart">Charlas, labs y café</Fact>
                </ul>
                <EventbriteRegisterButton
                  eventbriteEventUrl={eventInfo.eventbriteEventUrl}
                  contactEmail={eventInfo.contactEmail}
                  label="Reservar en Eventbrite"
                  className="w-full text-center"
                />
                <p className="m-0 mt-3 text-center text-sm text-[var(--color-text-secondary)]">
                  Se abre en una pestaña nueva
                </p>
              </div>
              <p className="m-0 mt-5 text-base text-[var(--color-text-secondary)]">
                ¿Problemas con el registro? Escribinos a {mailto}.
              </p>
            </div>

            <Frame
              label="Asistentes conversando durante un AWS Community Day"
              photo="/assets/charla.jpg"
              sizes="(min-width: 1024px) 600px, 100vw"
              preload
              className="aspect-[1600/1027] w-full rounded-[var(--radius-sm)]"
            />
          </div>
        </div>
      </section>

      <section className={`${SECTION_Y} bg-[var(--color-surface-muted)]`}>
        <div className={WRAP}>
          <h2 className={`${H2} mb-8`}>Cómo funciona</h2>
          <ol className="m-0 grid list-none gap-5 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(14rem,100%),1fr))]">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="min-w-0 bg-[var(--color-surface-elevated)] p-6"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <IconBadge name={s.icon} size="lg" tone="solid" />
                  <span
                    aria-hidden="true"
                    className="font-display text-step-3 leading-none text-[var(--color-text-muted)]"
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="m-0 mb-1 text-step-0 leading-tight text-[var(--color-text-primary)]">
                  {s.title}
                </h3>
                <p className="m-0 text-base text-[var(--color-text-secondary)]">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
          <p className="m-0 mt-6 max-w-[38rem] text-sm text-[var(--color-text-secondary)]">
            El registro lo gestiona Eventbrite bajo sus propias políticas de
            privacidad. Este sitio no recibe datos de registro ni embebe scripts
            de Eventbrite.
          </p>
        </div>
      </section>

      <section className={SECTION_Y}>
        <div className={WRAP}>
          <h2 className={`${H2} mb-8`}>Antes de venir</h2>
          <ul className="m-0 grid list-none gap-x-10 gap-y-8 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(18rem,100%),1fr))]">
            <li className="flex min-w-0 gap-4">
              <IconBadge name="laptop" />
              <div className="min-w-0">
                <h3 className="m-0 mb-1 text-step-0 text-[var(--color-text-primary)]">
                  Talleres prácticos
                </h3>
                <p className="m-0 mb-1 text-base text-[var(--color-text-secondary)]">
                  Si querés participar, revisá los requisitos de cada taller en
                  la agenda. Para asistir al evento no necesitás notebook ni
                  cuenta de AWS.
                </p>
                <NextLink href="/schedule" className={TEXT_LINK}>
                  Ver la agenda
                </NextLink>
              </div>
            </li>
            <li className="flex min-w-0 gap-4">
              <IconBadge name="shield" />
              <div className="min-w-0">
                <h3 className="m-0 mb-1 text-step-0 text-[var(--color-text-primary)]">
                  Aceptás el código de conducta
                </h3>
                <p className="m-0 mb-1 text-base text-[var(--color-text-secondary)]">
                  Aplica a todas las personas participantes, incluidos speakers,
                  sponsors y voluntarios.
                </p>
                <NextLink href="/code-of-conduct" className={TEXT_LINK}>
                  Código de conducta
                </NextLink>
              </div>
            </li>
            <li className="flex min-w-0 gap-4">
              <IconBadge name="heart" />
              <div className="min-w-0">
                <h3 className="m-0 mb-1 text-step-0 text-[var(--color-text-primary)]">
                  Si no podés venir, liberá tu lugar
                </h3>
                <p className="m-0 mb-1 text-base text-[var(--color-text-secondary)]">
                  Cancelá tu entrada en Eventbrite para que otra persona pueda
                  usar el cupo.
                </p>
                <NextLink href="/venue" className={TEXT_LINK}>
                  Cómo llegar
                </NextLink>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
