// Home page. A printed-poster layout: a full-bleed photograph with the title
// set in a solid block over it, then sections that each take a different shape
// (statement and collage, a ruled agenda list, one large speaker beside smaller
// ones, a venue band, a typographic Q&A, a staggered team strip, an open call).
//
// The countdown, agenda preview, speakers, sponsors, FAQ and organizers use
// edition content and Sessionize data. Copy is limited to what the content
// files and the schedule can back up.

import NextLink from "next/link";
// Imported rather than referenced by path so the optimizer's upstream is the
// content-hashed `/_next/static/media/` copy: replacing the file changes the
// URL, which is what makes a long optimizer TTL safe, and the import also
// carries the blur placeholder for the LCP frame.
import heroPhoto from "@/public/assets/anterior.jpg";
import venuePhoto from "@/public/assets/venue/cover.jpg";
import { Countdown } from "@/components/organisms/Countdown";
import { Lace } from "@/components/atoms/Lace";
import {
  BTN_OUTLINE_ON_DARK,
  BTN_PRIMARY,
  Frame,
  SectionTitle,
  SECTION_FIT,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { formatDate, formatTime } from "@/lib/utils/datetime";
import type { EventInfo } from "@/lib/content/event-info";
import type { Speaker } from "@/lib/api/sessionize";
import type { AgendaPreviewItem } from "@/lib/utils/agenda-preview";
import { SponsorBoard } from "@/components/organisms/SponsorBoard";
import type { Sponsor } from "@/lib/content/sponsors";
import type { Sponsorship } from "@/lib/content/sponsorship";
import type { FAQItem } from "@/lib/content/faq";
import type { Organizer } from "@/lib/content/organizers";
import type { Venue } from "@/lib/content/venue";
import { tieLast } from "@/lib/utils/typography";

type HomeTemplateProps = {
  eventInfo: EventInfo;
  venue: Venue;
  speakers: Speaker[];
  /** First sessions of the programme. Empty until the agenda is published. */
  agenda?: AgendaPreviewItem[];
  sponsors: Sponsor[];
  /** Not used here any more: the home shows who sponsors and one link to the
   *  sponsors page, where the packages live. Kept so callers still compile. */
  sponsorship?: Sponsorship | null;
  faq: FAQItem[];
  organizers: Organizer[];
  registerHref?: string;
  cfpHref?: string;
  speakersHref?: string;
  sponsorsHref?: string;
  scheduleHref?: string;
  teamHref?: string;
  volunteersHref?: string;
};

/** Underlined text link, the one link style used inside running copy. */
const TEXT_LINK =
  "font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]";

export function HomeTemplate({
  eventInfo,
  venue,
  speakers,
  agenda = [],
  sponsors,
  faq,
  organizers,
  registerHref = "/register",
  cfpHref = "/cfp",
  speakersHref = "/speakers",
  sponsorsHref = "/sponsors",
  scheduleHref = "/schedule",
  teamHref = "/team",
  volunteersHref = "/volunteers",
}: HomeTemplateProps) {
  const dateLabel = formatDate(eventInfo.dates.start);
  const timeLabel = `${formatTime(eventInfo.dates.start)} – ${formatTime(
    eventInfo.dates.end
  )}`;
  const isOpen = eventInfo.registrationStatus === "open";
  const previewSpeakers = speakers.slice(0, 4);
  const previewTeam = organizers.slice(0, 5);

  return (
    <>
      {/* ── Hero: photograph, title set in a solid block ─────── */}
      <section
        id="contenido-principal"
        className="snap-here relative isolate overflow-hidden bg-[var(--color-surface-hero)] text-[var(--color-text-on-hero)]"
      >
        {/* The photo is a group selfie with people across its whole width, so
            nothing is set over it: on desktop it takes the right 7/12 of the
            hero beside the text, on phones it sits above the text at its own
            4:3 ratio. The text never covers a face. */}
        <div className="grid xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative order-1 aspect-[16/10] min-w-0 sm:aspect-[4/3] xl:order-2 xl:aspect-auto xl:min-h-[min(43.75vw,calc(100svh-var(--header-h)))]">
            <Frame
              label="Asistentes a una edición anterior del Community Day"
              photo={heroPhoto}
              className="absolute inset-0 h-full w-full"
              sizes="(min-width: 1280px) 58vw, 100vw"
              preload
            />
          </div>

          <div className="relative order-2 min-w-0 overflow-hidden px-6 pb-7 pt-6 sm:px-10 sm:pb-12 sm:pt-10 xl:order-1 xl:flex xl:flex-col xl:justify-center xl:py-[clamp(1.25rem,5svh,4rem)] xl:pl-[clamp(2.75rem,calc((100vw-1240px)/2+1.75rem),6rem)] xl:pr-12">
            <Lace
              size="30rem"
              rings={5}
              className="absolute -right-40 -top-40 text-[var(--color-border-on-inverse)]"
            />
            <p className="relative m-0 mb-[clamp(0.5rem,2svh,1.5rem)] text-base font-semibold text-[var(--color-text-on-hero)]">
              Primera edición ·{" "}
              <span className="text-[var(--color-national-red-on-dark)]">
                {isOpen ? "Registro abierto" : "Registro próximamente"}
              </span>
            </p>

            <h1 className="relative m-0 mb-[clamp(0.625rem,2svh,1.75rem)] font-display text-[min(clamp(2.25rem,0.9rem+2.6vw,4rem),8svh)] leading-[0.98] tracking-[-0.015em]">
              AWS Community Day&nbsp;Paraguay
            </h1>

            <p className="relative m-0 mb-2 text-step-1 leading-[1.35]">
              {dateLabel}
            </p>
            <p className="relative m-0 mb-[clamp(0.75rem,2.4svh,2rem)] text-base text-[var(--color-text-on-inverse-secondary)]">
              {timeLabel} · {eventInfo.location.summary} · Entrada gratuita
            </p>

            {/* The days left are the most time-sensitive fact on the page, so
                the number is set huge in the action orange, with a thick bar,
                between the date and the call to action. */}
            <Countdown
              targetDate={eventInfo.dates.start}
              variant="display"
              tone="hero"
              className="relative mb-[clamp(0.75rem,2svh,2rem)] border-l-[0.375rem] border-[var(--color-action)] pl-4 text-[var(--color-action)]"
            />

            <div className="relative flex flex-wrap items-center gap-x-4 gap-y-3">
              <NextLink href={registerHref} className={BTN_PRIMARY}>
                Registrarme gratis
              </NextLink>
              <NextLink href={cfpHref} className={BTN_OUTLINE_ON_DARK}>
                Proponer una charla
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── Qué es: statement and photo collage ──────────────── */}
      <section
        id="sobre"
        className={`${SECTION_FIT} bg-[var(--color-surface)]`}
      >
        <div className={WRAP}>
          <div className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-[1.15fr_1fr]">
            <div className="min-w-0">
              <SectionTitle size="lg" title="Qué es el Community Day" />
              <p className="m-0 mb-[clamp(1rem,3.5svh,2rem)] font-display text-[min(clamp(1.375rem,0.95rem+1.05vw,2.125rem),4.6svh)] leading-[1.18] text-[var(--color-text-primary)]">
                Un día entero de charlas y talleres sobre AWS, dados en español
                por quienes trabajan con la nube en Paraguay y la región.
              </p>
              <p className="m-0 mb-4 max-w-[34rem] text-step-0 text-[var(--color-text-secondary)]">
                Lo organizamos voluntarios del AWS User Group Paraguay y del
                user group de Canindeyú. La entrada es gratuita; hace falta
                registrarse porque la capacidad del auditorio es limitada.
              </p>
              <NextLink href={registerHref} className={BTN_PRIMARY}>
                Reservar mi lugar
              </NextLink>
            </div>

            {/* Every photo keeps its own proportions (the stage is 1600x1027,
                the other two are 16:9), so nothing is cropped or stretched.
                To make the block fit a short screen, its WIDTH is capped from
                the viewport height: the three frames stack to about 0.92 of
                the width in height, so the cap is the usable height divided
                by 0.92 (usable = 100svh minus the header minus the section's
                6svh padding top and bottom). */}
            <div className="grid min-w-0 grid-cols-2 gap-3 lg:w-full lg:max-w-[calc((100svh-var(--header-h)-max(5rem,12svh)-0.6rem)/0.922)] lg:justify-self-end">
              <Frame
                label="Sala llena durante una charla"
                photo="/assets/charla.jpg"
                className="col-span-2 aspect-[1600/1027]"
                sizes="(min-width: 1024px) 520px, 100vw"
              />
              <Frame
                label="Asistentes conversando durante el networking"
                photo="/assets/networking.jpg"
                className="aspect-video"
                sizes="(min-width: 1024px) 260px, 50vw"
              />
              <Frame
                label="Participantes en un taller hands-on"
                photo="/assets/handson.jpg"
                className="aspect-video"
                sizes="(min-width: 1024px) 260px, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Agenda: a ruled list of the first sessions ───────── */}
      <section
        id="agenda"
        className={`${SECTION_FIT} bg-[var(--color-surface-muted)]`}
      >
        <div className={WRAP}>
          <SectionTitle
            size="lg"
            title="Agenda del día"
            action={{ href: scheduleHref, label: "Agenda completa" }}
          />
          {agenda.length === 0 ? (
            <p className="m-0 max-w-[40rem] text-step-0 text-[var(--color-text-secondary)]">
              Todavía estamos cerrando la agenda. Mientras tanto, mirá a los
              speakers confirmados o{" "}
              <NextLink href={cfpHref} className={TEXT_LINK}>
                proponé tu charla
              </NextLink>
              .
            </p>
          ) : (
            <ol className="m-0 list-none p-0">
              {agenda.map((item, i) => (
                <li
                  key={item.id}
                  // Later sessions drop out on short wide screens so the list
                  // always fits: the 5th up to 55rem of height, the 4th up to
                  // 44rem. Phones and tall windows keep all five.
                  className={`grid gap-x-8 gap-y-2 py-[clamp(0.625rem,2svh,1.5rem)] sm:grid-cols-[7.5rem_1fr_13rem] ${
                    i >= 4 ? "hide-on-short" : i === 3 ? "hide-on-shorter" : ""
                  }`}
                >
                  <time
                    dateTime={item.startsAt}
                    className="font-display text-step-2 leading-none text-[var(--color-national-red-label)]"
                  >
                    {formatTime(item.startsAt)}
                  </time>
                  <div className="min-w-0">
                    <h3 className="m-0 mb-1 font-semibold text-step-1 leading-[1.2]">
                      {tieLast(item.title)}
                    </h3>
                    {item.speakers.length > 0 ? (
                      <p className="m-0 text-base text-[var(--color-text-secondary)]">
                        {item.speakers.join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <p className="m-0 text-base font-semibold text-[var(--color-text-primary)] sm:text-right">
                    {tieLast(item.roomName)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* ── Speakers: four portraits of equal weight ─────────── */}
      <section
        id="speakers"
        className={`${SECTION_FIT} bg-[var(--color-surface)]`}
      >
        <div className={WRAP}>
          <SectionTitle
            size="lg"
            title="Speakers"
            action={{ href: speakersHref, label: "Ver todos" }}
          />
          {previewSpeakers.length === 0 ? (
            <p className="m-0 max-w-[40rem] text-step-0 text-[var(--color-text-secondary)]">
              Estamos definiendo la grilla de oradores. Volvé pronto para
              conocer al elenco.
            </p>
          ) : (
            // The portraits are square because the source photos are square
            // (Sessionize serves them at 400x400). A square frame shows each
            // one whole, never cropped or stretched, and gives all four the
            // same weight: same size, same baseline, nobody singled out.
            <ul className="m-0 grid list-none grid-cols-2 gap-x-5 gap-y-8 p-0 lg:grid-cols-4 lg:gap-x-6">
              {previewSpeakers.map((sp) => (
                <li key={sp.id} className="min-w-0 [overflow-wrap:anywhere]">
                  <NextLink
                    href={`${speakersHref}/${sp.slug}`}
                    className="block"
                  >
                    <Frame
                      label={sp.fullName}
                      photo={sp.profilePicture ?? undefined}
                      position="50% 20%"
                      className="mb-4 aspect-square w-full"
                      sizes="(min-width: 1024px) 290px, 50vw"
                    />
                  </NextLink>
                  <h3 className="m-0 mb-1 font-semibold text-step-1 leading-[1.15]">
                    {sp.fullName}
                  </h3>
                  {/* Identity only: the talk is credited in the agenda. The
                      tagline is dropped on short windows so the row fits. */}
                  <p className="hide-on-shorter m-0 text-base text-[var(--color-text-secondary)]">
                    {tieLast(sp.tagLine)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── La sede: navy band, photo bleeding off the edge ──── */}
      <section
        id="sede"
        className="fit-screen relative overflow-hidden bg-[var(--color-surface-inverse)] text-[var(--color-text-on-inverse)]"
      >
        <div className="grid w-full lg:grid-cols-[1fr_1.1fr]">
          <div className="flex min-w-0 flex-col justify-center px-5 py-[clamp(2.5rem,6svh,5rem)] sm:px-7 lg:pl-[max(1.75rem,calc((100vw-1240px)/2+1.75rem))] lg:pr-14">
            <p className="m-0 mb-3 text-base font-semibold text-[var(--color-text-on-inverse-secondary)]">
              La sede
            </p>
            <h2 className="m-0 mb-5 font-display text-step-3 leading-[1.04] tracking-[-0.01em]">
              {venue.name}, {eventInfo.location.city}
            </h2>
            <p className="m-0 mb-8 max-w-[30rem] text-step-0 text-[var(--color-text-on-inverse-secondary)]">
              {venue.address}
            </p>
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BTN_OUTLINE_ON_DARK} self-start`}
            >
              Ver en el mapa
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="relative min-h-[22rem] min-w-0 lg:min-h-[calc(100svh-var(--header-h))]">
            <Frame
              label={`Foto de la sede — ${venue.name}`}
              photo={venuePhoto}
              position="right"
              className="absolute inset-0 h-full w-full"
              sizes="(min-width: 1024px) 840px, 100vw"
            />
          </div>
        </div>
      </section>

      {/* ── Preguntas: question and answer, set as text ──────── */}
      <section id="faq" className={`${SECTION_FIT} bg-[var(--color-surface)]`}>
        <div className={WRAP}>
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[1fr_1.6fr] lg:items-center">
            <div>
              <SectionTitle size="lg" title="Preguntas frecuentes" />
              <p className="m-0 text-step-0 text-[var(--color-text-secondary)]">
                ¿No está tu pregunta?{" "}
                <a
                  href={`mailto:${eventInfo.contactEmail}`}
                  className={TEXT_LINK}
                >
                  Escribinos
                </a>
                .
              </p>
            </div>
            <dl className="m-0">
              {faq.map((f) => (
                <div key={f.id} className=" py-[clamp(0.875rem,2.6svh,1.5rem)]">
                  <dt className="m-0 mb-2 font-semibold text-step-1 leading-[1.2]">
                    {tieLast(f.question)}
                  </dt>
                  <dd className="m-0 max-w-[40rem] text-step-0 text-[var(--color-text-secondary)]">
                    {tieLast(f.answer)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Equipo: square portraits ─────────────────────────── */}
      <section
        id="equipo"
        className={`${SECTION_FIT} bg-[var(--color-surface-muted)]`}
      >
        <div className={WRAP}>
          <SectionTitle
            size="lg"
            title="Quiénes lo organizan"
            action={{ href: teamHref, label: "Ver el equipo" }}
          />
          {/* Square frames for square photos, as with the speakers. */}
          <ul className="m-0 grid list-none grid-cols-2 gap-x-5 gap-y-8 p-0 sm:grid-cols-3 lg:grid-cols-5">
            {previewTeam.map((tm) => (
              <li key={tm.id} className="min-w-0 [overflow-wrap:anywhere]">
                <Frame
                  label={tieLast(tm.name)}
                  photo={tm.photo}
                  position="50% 20%"
                  className="aspect-square w-full"
                  sizes="(min-width: 1024px) 240px, 50vw"
                />
                <h3 className="m-0 mb-1 mt-4 font-semibold text-step-1 leading-[1.15]">
                  {tieLast(tm.name)}
                </h3>
                <p className="hide-on-shorter m-0 text-base leading-[1.4] text-[var(--color-text-secondary)]">
                  {tieLast(tm.role)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Sponsors ─────────────────────────────────────────── */}
      <section
        id="sponsors"
        className={`${SECTION_FIT} bg-[var(--color-surface)]`}
      >
        <div className={WRAP}>
          {/* One action for anyone who wants to join, beside the title; the
              board itself says nothing more than who is already in. */}
          <SectionTitle
            size="lg"
            title="Sponsors"
            action={{ href: sponsorsHref, label: "Ser sponsor" }}
          />
          {sponsors.length === 0 ? (
            <p className="m-0 text-step-0 text-[var(--color-text-secondary)]">
              Aún no hay sponsors confirmados.
            </p>
          ) : (
            <SponsorBoard
              sponsors={sponsors}
              openSlots={0}
              slotHref={sponsorsHref}
            />
          )}
        </div>
      </section>

      {/* ── Cierre: una sola invitación ──────────────────────── */}
      <section
        id="participar"
        className="fit-screen bg-[var(--color-surface-hero)] text-[var(--color-text-on-hero)]"
      >
        <div className={`${WRAP} py-[clamp(2.5rem,6svh,5rem)]`}>
          <div className="max-w-[40rem]">
            <p className="m-0 mb-4 text-base font-semibold text-[var(--color-text-on-inverse-secondary)]">
              {dateLabel}
            </p>
            <h2 className="m-0 mb-8 font-display text-step-3 leading-[1.04] tracking-[-0.01em]">
              Te esperamos en {eventInfo.location.city}.
            </h2>
            {/* Three actions, three buttons: registering is the orange fill;
                giving a talk and volunteering are ruled buttons beside it. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <NextLink href={registerHref} className={BTN_PRIMARY}>
                Registrarme
              </NextLink>
              <NextLink href={cfpHref} className={BTN_OUTLINE_ON_DARK}>
                Proponer una charla
              </NextLink>
              <NextLink href={volunteersHref} className={BTN_OUTLINE_ON_DARK}>
                Ser voluntario/a
              </NextLink>
            </div>
            {eventInfo.cfpDeadline ? (
              <p className="m-0 mt-5 text-step-0 text-[var(--color-text-on-inverse-secondary)]">
                Las charlas se reciben hasta el{" "}
                {formatDate(eventInfo.cfpDeadline)}.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
