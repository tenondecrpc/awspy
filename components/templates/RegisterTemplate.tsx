// Register page, rebuilt from scratch to reproduce the "Registro" mockup
// (`AWS Community Day Paraguay (colored)/Registro.dc.html`) 1:1 — the light
// header band with a live registration-status badge, the "Cómo funciona" steps
// beside the "Entrada general" ticket card, and the cream "Antes de venir"
// panel. Colors come only from design tokens and spacing matches the mockup.
//
// All registration behavior is preserved: the `archived`, closed, upcoming,
// and open states, and the `EventbriteRegisterButton` (external link + mailto
// fallback) as the single registration CTA.

import NextLink from "next/link";
import { WRAP, SECTION_BORDER } from "@/components/site/primitives";
import { EventbriteRegisterButton } from "@/components/organisms/EventbriteRegisterButton";
import { formatDate } from "@/lib/utils/datetime";
import type { EventInfo } from "@/lib/content/event-info";

type RegisterTemplateProps = {
  eventInfo: EventInfo;
  /** When true, renders only the "Esta edición ya finalizó" message. Used by
   *  past-edition routes per FR-035. */
  archived?: boolean;
};

const STEPS = [
  {
    n: "01",
    title: "Reservá tu entrada",
    body: "El registro se hace en Eventbrite. Necesitás un correo válido y nada más.",
  },
  {
    n: "02",
    title: "Guardá el ticket",
    body: "Te llega por correo. Podés mostrarlo desde el teléfono al llegar.",
  },
  {
    n: "03",
    title: "Acreditate el día del evento",
    body: "La acreditación abre a las 08:00 en el hall de ingreso de UniNorte.",
  },
  {
    n: "04",
    title: "Anotate a los talleres",
    body: "Los labs tienen cupo limitado y se anotan en el mostrador de acreditación.",
  },
];

const NOTES = [
  {
    title: "Llevá tu notebook",
    body: "Solo si vas a participar de los talleres hands-on. Conviene tener una cuenta de AWS activa.",
  },
  {
    title: "Aceptás el código de conducta",
    body: "Aplica a todas las personas participantes, incluidos speakers, sponsors y voluntarios.",
  },
  {
    title: "Si no podés venir, liberá tu lugar",
    body: "Cancelá tu entrada en Eventbrite para que otra persona pueda usar el cupo.",
  },
];

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "muted";
}) {
  return (
    <div
      className={
        "inline-flex items-center gap-[9px] rounded-[3px] border px-3 py-[5px] " +
        (tone === "success"
          ? "border-[var(--color-success)]"
          : "border-[var(--color-border-subtle)]")
      }
    >
      <span
        aria-hidden="true"
        className={
          "h-[7px] w-[7px] rounded-full " +
          (tone === "success"
            ? "bg-[var(--color-success)]"
            : "bg-[var(--color-text-muted)]")
        }
      />
      <span
        className={
          "font-mono text-[11px] uppercase tracking-[0.12em] " +
          (tone === "success"
            ? "text-[var(--color-success)]"
            : "text-[var(--color-text-muted)]")
        }
      >
        {label}
      </span>
    </div>
  );
}

const H1 =
  "m-0 text-[clamp(34px,5vw,58px)] font-extrabold leading-[0.98] tracking-[-0.04em] text-[var(--color-text-primary)]";
const LEAD =
  "m-0 max-w-[38rem] text-[17px] leading-[1.55] text-[var(--color-text-secondary)]";

export function RegisterTemplate({
  eventInfo,
  archived = false,
}: RegisterTemplateProps) {
  const status = archived ? "archived" : eventInfo.registrationStatus;

  const badge: { label: string; tone: "success" | "muted" } =
    status === "open"
      ? { label: "Registro abierto", tone: "success" }
      : status === "upcoming"
        ? { label: "Registro próximamente", tone: "muted" }
        : status === "closed"
          ? { label: "Registro cerrado", tone: "muted" }
          : { label: "Edición finalizada", tone: "muted" };

  const lead =
    status === "open"
      ? "El acceso al evento es gratuito. Reservá tu lugar a través de Eventbrite: es un proceso rápido y solo necesitás un correo."
      : status === "upcoming"
        ? "Aún no abrimos el registro. Vas a poder reservar tu lugar cuando esté disponible."
        : status === "closed"
          ? "El registro para esta edición ya está cerrado."
          : "Esta edición ya finalizó. El registro no está disponible.";

  return (
    <>
      {/* ── Header band ──────────────────────────────────────── */}
      <section
        id="contenido-principal"
        className={`${SECTION_BORDER} bg-[var(--color-surface-muted)]`}
      >
        <div className={`${WRAP} py-16`}>
          <div className="mb-[18px]">
            <StatusBadge label={badge.label} tone={badge.tone} />
          </div>
          <h1 className={H1}>Registro</h1>
          <p className={`${LEAD} mt-4`}>{lead}</p>
        </div>
      </section>

      {status === "open" ? (
        <>
          {/* ── Cómo funciona + ticket ───────────────────────── */}
          <section className={SECTION_BORDER}>
            <div className={WRAP}>
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
                <div className="min-w-0 py-14 pr-0 lg:pr-12">
                  <h2 className="m-0 mb-5 text-[24px] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                    Cómo funciona
                  </h2>
                  <div className="border-t border-[var(--color-text-primary)]">
                    {STEPS.map((s) => (
                      <div
                        key={s.n}
                        className="flex gap-4 border-b border-[var(--color-border-subtle)] py-[18px]"
                      >
                        <span className="flex-none pt-[3px] font-mono text-[11.5px] text-[var(--color-action)]">
                          {s.n}
                        </span>
                        <div className="min-w-0">
                          <h3 className="m-0 mb-[3px] text-[16px] font-bold text-[var(--color-text-primary)]">
                            {s.title}
                          </h3>
                          <p className="m-0 text-[14.5px] text-[var(--color-text-muted)]">
                            {s.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-[22px] text-[13.5px] text-[var(--color-text-muted)]">
                    El registro lo gestiona Eventbrite bajo sus propias
                    políticas de privacidad. Este sitio no recolecta tus datos
                    ni embebe scripts de terceros.
                  </p>
                </div>

                <div className="flex min-w-0 flex-col justify-center border-t border-[var(--color-border-subtle)] py-14 lg:border-l lg:border-t-0 lg:pl-12">
                  <div className="border border-[var(--color-text-primary)] p-8">
                    <p className="m-0 mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      Entrada general
                    </p>
                    <div className="mb-[18px] flex items-baseline gap-2.5">
                      <span className="text-[46px] font-extrabold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
                        Gratis
                      </span>
                      <span className="text-[14px] text-[var(--color-text-muted)]">
                        cupo limitado
                      </span>
                    </div>
                    <dl className="m-0 mb-6 border-t border-[var(--color-border-subtle)]">
                      {[
                        ["Fecha", formatDate(eventInfo.dates.start)],
                        ["Horario", "08:00 – 17:00"],
                        ["Sede", eventInfo.location.summary],
                        ["Incluye", "Charlas, labs y coffee"],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex justify-between gap-3.5 border-b border-[var(--color-border-subtle)] py-[11px]"
                        >
                          <dt className="text-[14px] text-[var(--color-text-muted)]">
                            {k}
                          </dt>
                          <dd className="m-0 text-[14px] font-semibold text-[var(--color-text-primary)]">
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <EventbriteRegisterButton
                      eventbriteEventUrl={eventInfo.eventbriteEventUrl}
                      contactEmail={eventInfo.contactEmail}
                      label="Reservar mi lugar en Eventbrite"
                    />
                    <p className="mt-3 text-center text-[12.5px] text-[var(--color-text-muted)]">
                      Se abre en una pestaña nueva
                    </p>
                  </div>
                  <p className="mt-5 text-[14px] text-[var(--color-text-secondary)]">
                    ¿Problemas con el registro? Escribinos a{" "}
                    <a
                      href={`mailto:${eventInfo.contactEmail}`}
                      className="font-semibold text-[var(--color-accent)]"
                    >
                      {eventInfo.contactEmail}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Antes de venir ───────────────────────────────── */}
          <section className={`${SECTION_BORDER} bg-[var(--color-surface-warm)]`}>
            <div className={`${WRAP} py-14`}>
              <h2 className="m-0 mb-6 text-[clamp(22px,2.6vw,30px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--color-text-primary)]">
                Antes de venir
              </h2>
              <div className="grid border-l border-t border-[var(--color-text-primary)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                {NOTES.map((n) => (
                  <div
                    key={n.title}
                    className="min-w-0 border-b border-r border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-[22px]"
                  >
                    <h3 className="m-0 mb-1.5 text-[16px] font-bold text-[var(--color-text-primary)]">
                      {n.title}
                    </h3>
                    <p className="m-0 text-[14.5px] text-[var(--color-text-muted)]">
                      {n.body}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-[26px] flex flex-wrap gap-2.5">
                <NextLink
                  href="/schedule"
                  className="inline-flex items-center rounded-[4px] border-[1.5px] border-[var(--color-text-primary)] px-[22px] py-[11px] text-[14.5px] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
                >
                  Ver la agenda
                </NextLink>
                <NextLink
                  href="/venue"
                  className="inline-flex items-center rounded-[4px] border-[1.5px] border-[var(--color-border-subtle)] px-[22px] py-[11px] text-[14.5px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
                >
                  Cómo llegar
                </NextLink>
                <NextLink
                  href="/code-of-conduct"
                  className="inline-flex items-center rounded-[4px] border-[1.5px] border-[var(--color-border-subtle)] px-[22px] py-[11px] text-[14.5px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
                >
                  Código de conducta
                </NextLink>
              </div>
            </div>
          </section>
        </>
      ) : status === "upcoming" ? (
        <section className={SECTION_BORDER}>
          <div className={`${WRAP} py-16`}>
            <div className="max-w-2xl space-y-6">
              <p className="text-[16px] text-[var(--color-text-secondary)]">
                Vas a poder reservar tu lugar cuando el registro esté
                disponible. Dejanos tu mail y te avisamos apenas abra.
              </p>
              <EventbriteRegisterButton
                eventbriteEventUrl={eventInfo.eventbriteEventUrl}
                contactEmail={eventInfo.contactEmail}
                label="Avisame por mail"
              />
            </div>
          </div>
        </section>
      ) : status === "closed" ? (
        <section className={SECTION_BORDER}>
          <div className={`${WRAP} py-16`}>
            <p className="max-w-2xl text-[16px] text-[var(--color-text-secondary)]">
              Si querés que te avisemos de la próxima edición, escribinos a{" "}
              <a
                href={`mailto:${eventInfo.contactEmail}`}
                className="font-semibold text-[var(--color-accent)]"
              >
                {eventInfo.contactEmail}
              </a>
              .
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}
