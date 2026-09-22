// Home page, rebuilt from scratch to reproduce the "Home Light" mockup
// (`AWS Community Day Paraguay (colored)/Home Light.dc.html`) 1:1 — same
// sections, same order, same colors (via exact design tokens), same spacing.
//
// Only the data/functionality is wired to the real app: the countdown (live),
// and the speakers / sponsors / FAQ / organizers sections (from Sessionize and
// versioned content). The overview copy that the mockup hard-codes (stats,
// pillars, the agenda-at-a-glance, and the "tres formas" cards) is kept as
// static presentational content, exactly as in the mockup.

import NextLink from "next/link";
// Imported rather than referenced by path so the optimizer's upstream is the
// content-hashed `/_next/static/media/` copy: replacing the file changes the
// URL, which is what makes a long optimizer TTL safe, and the import also
// carries the blur placeholder for the LCP frame.
import heroPhoto from "@/public/assets/anterior.jpg";
import venuePhoto from "@/public/assets/venue/cover.jpg";
import { Countdown } from "@/components/organisms/Countdown";
import {
  Frame,
  NumberHeading,
  H2,
  NUM_ON_DARK,
  RULE,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { formatDate, formatTime } from "@/lib/utils/datetime";
import type { EventInfo } from "@/lib/content/event-info";
import type { Speaker } from "@/lib/api/sessionize";
import { SponsorSlotCard } from "@/components/molecules/SponsorSlotCard";
import { SponsorTile } from "@/components/molecules/SponsorTile";
import { listAvailableTiers } from "@/lib/content/sponsors";
import type { Sponsor } from "@/lib/content/sponsors";
import type { Sponsorship } from "@/lib/content/sponsorship";
import type { FAQItem } from "@/lib/content/faq";
import type { Organizer } from "@/lib/content/organizers";
import type { Venue } from "@/lib/content/venue";

type HomeTemplateProps = {
  eventInfo: EventInfo;
  venue: Venue;
  speakers: Speaker[];
  sponsors: Sponsor[];
  /** Edition prospectus. `null` when this edition has not published one. */
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

const MARQUEE_ICONS = [
  "compute-ec2",
  "compute-lambda",
  "compute-fargate",
  "storage-s3",
  "database-rds",
  "database-dynamodb",
  "network-cloudfront",
  "network-route53",
  "ai-bedrock",
  "ai-sagemaker",
  "security-iam",
  "security-cognito",
];

const PILLARS = [
  {
    n: "01",
    title: "Contenido técnico real",
    body: "Casos, arquitecturas y errores aprendidos en producción.",
  },
  {
    n: "02",
    title: "Hecho por la comunidad",
    body: "Voluntarios del AWS User Group Paraguay y Canindeyú.",
  },
  {
    n: "03",
    title: "Entrada libre",
    body: "Acceso sin costo, con registro previo.",
  },
  {
    n: "04",
    title: "Talleres hands-on",
    body: "Traé tu notebook: tres labs guiados durante la jornada.",
  },
];

const AGENDA = [
  {
    time: "08:00",
    title: "Acreditación",
    note: "Café de bienvenida y entrega de credenciales",
    track: "Hall",
  },
  {
    time: "09:00",
    title: "Keynote de apertura",
    note: "La nube que construye la comunidad",
    track: "Auditorio",
  },
  {
    time: "10:00",
    title: "Bloque de charlas",
    note: "Serverless, observabilidad, seguridad",
    track: "2 salas",
  },
  {
    time: "12:30",
    title: "Almuerzo y networking",
    note: "Espacio de sponsors abierto",
    track: "Hall",
  },
  {
    time: "13:30",
    title: "Hands-on labs",
    note: "Bedrock, infraestructura como código, contenedores",
    track: "3 salas",
  },
  {
    time: "16:00",
    title: "Panel y cierre",
    note: "Cómo sigue la comunidad en Paraguay",
    track: "Auditorio",
  },
];

export function HomeTemplate({
  eventInfo,
  venue,
  speakers,
  sponsors,
  sponsorship = null,
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
  // Open tiers fill the sponsor board while the real logos are still being
  // signed, so it never renders as a bare line of text.
  const packages = sponsorship?.packages ?? [];
  const availableTiers = listAvailableTiers(packages, sponsors);
  const priceByTier = new Map(packages.map((p) => [p.tier, p.price]));

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        id="contenido-principal"
        className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface-muted)]"
      >
        <div className={WRAP}>
          <div className="grid items-stretch gap-0 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
            <div className="flex min-w-0 flex-col justify-center py-14 pr-0 lg:pr-12">
              <div className="mb-7 flex items-center gap-3">
                <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Primera edición
                </span>
                <span className={RULE} aria-hidden="true" />
                <span
                  className={
                    "inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.1em] " +
                    (isOpen
                      ? "text-[var(--color-success)]"
                      : "text-[var(--color-text-secondary)]")
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      "h-[7px] w-[7px] rounded-full " +
                      (isOpen
                        ? "bg-[var(--color-success)]"
                        : "bg-[var(--color-text-muted)]")
                    }
                  />
                  {isOpen ? "Registro abierto" : "Registro próximamente"}
                </span>
              </div>

              <h1 className="m-0 mb-6 text-[clamp(40px,6vw,78px)] font-extrabold leading-[0.94] tracking-[-0.045em] text-[var(--color-text-primary)]">
                AWS
                <br />
                Community&nbsp;Day
                <br />
                <span className="text-[var(--color-action-label)]">
                  Paraguay
                </span>
              </h1>

              <p className="m-0 mb-8 max-w-[32rem] text-[18px] leading-[1.55] text-[var(--color-text-secondary)]">
                Una jornada gratuita hecha por la comunidad AWS local. Charlas
                técnicas, talleres hands-on y networking, en español, en{" "}
                {eventInfo.location.city}.
              </p>

              <dl className="m-0 mb-[34px] grid border-t border-[var(--color-text-primary)] [grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr))]">
                {[
                  { k: "Fecha", v: dateLabel },
                  { k: "Horario", v: timeLabel },
                  { k: "Sede", v: eventInfo.location.summary },
                  { k: "Entrada", v: "Gratuita" },
                ].map((d, i) => (
                  <div
                    key={d.k}
                    className={
                      "border-b border-[var(--color-border-subtle)] py-3.5 " +
                      (i === 0
                        ? "pr-4"
                        : "border-l border-[var(--color-border-subtle)] px-4")
                    }
                  >
                    <dt className="mb-[5px] font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      {d.k}
                    </dt>
                    <dd className="m-0 text-[15px] font-semibold">{d.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap items-center gap-3">
                <NextLink
                  href={registerHref}
                  className="inline-flex items-center rounded-[4px] bg-[var(--color-action)] px-[30px] py-[15px] text-[16px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
                >
                  Registrarme gratis
                </NextLink>
                <NextLink
                  href={cfpHref}
                  className="inline-flex items-center rounded-[4px] border-[1.5px] border-[var(--color-text-primary)] px-7 py-[15px] text-[16px] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
                >
                  Proponer una charla
                </NextLink>
                <Countdown
                  targetDate={eventInfo.dates.start}
                  variant="inline"
                />
              </div>
            </div>

            <div className="min-h-[520px] min-w-0 border-l border-[var(--color-text-primary)]">
              <Frame
                label="Foto principal — comunidad / edición anterior"
                photo={heroPhoto}
                className="h-full w-full"
                // Measured cover-rendered widths: 692px on a 390px phone (the
                // 520px min-height drives it, not the viewport) and 1128-1172px
                // from 900px up. Stated in px so the srcset keeps every rung —
                // the previous `190vw` pruned it to 1920/2048/3840, which is
                // why phones were downloading the largest entry.
                sizes="(min-width: 700px) 1200px, 700px"
                preload
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── AWS service icon marquee ─────────────────────────── */}
      <div className="overflow-hidden border-b border-[var(--color-text-primary)] bg-[var(--color-surface-inverse)] py-3.5">
        <div className="flex w-max animate-[acd-marquee_40s_linear_infinite] gap-14">
          {[0, 1].map((row) => (
            <div
              key={row}
              className="flex items-center gap-14"
              aria-hidden="true"
            >
              {MARQUEE_ICONS.map((icon) => (
                <span
                  key={icon}
                  className="block h-[26px] w-[26px] bg-[var(--color-text-on-inverse)] opacity-75"
                  style={{
                    maskImage: `url(/assets/icons/${icon}.svg)`,
                    WebkitMaskImage: `url(/assets/icons/${icon}.svg)`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Cifras esperadas ─────────────────────────────────── */}
      {eventInfo.expectedFigures.length > 0 ? (
        <section
          aria-label="Esperamos contar con"
          className="border-b border-[var(--color-text-primary)]"
        >
          <div className={WRAP}>
            <ul className="m-0 grid list-none p-0 [grid-template-columns:repeat(auto-fit,minmax(min(160px,100%),1fr))]">
              {eventInfo.expectedFigures.map((figure) => (
                <li
                  key={figure.label}
                  className="min-w-0 border-l border-[var(--color-border-subtle)] px-[18px] pb-[26px] pt-7"
                >
                  <div className="text-[38px] font-extrabold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
                    {figure.value}
                  </div>
                  <div className="mt-[9px] text-[13px] text-[var(--color-text-muted)]">
                    {figure.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── 01 · Qué es el Community Day ─────────────────────── */}
      <section
        id="sobre"
        className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface-warm)]"
      >
        <div className={`${WRAP} py-[72px]`}>
          <NumberHeading n="01" title="Qué es el Community Day" />
          <div className="grid items-start gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
            <div className="min-w-0">
              <p className="m-0 mb-5 max-w-[34rem] text-[20px] font-medium leading-[1.5] text-[var(--color-text-primary)]">
                Un evento de la comunidad, para la comunidad. Sin filtro
                comercial, con contenido técnico que se usa el lunes siguiente.
              </p>
              <p className="m-0 mb-7 max-w-[34rem] text-[16px] text-[var(--color-text-secondary)]">
                Lo organizan voluntarios del AWS User Group Paraguay junto al
                user group de Canindeyú. El acceso es sin costo, con registro
                previo.
              </p>
              <div className="grid max-w-[34rem] border-t border-[var(--color-text-primary)]">
                {PILLARS.map((p) => (
                  <div
                    key={p.n}
                    className="flex gap-4 border-b border-[var(--color-border-subtle)] py-4"
                  >
                    <span className="flex-none pt-[3px] font-mono text-[11.5px] text-[var(--color-text-muted)]">
                      {p.n}
                    </span>
                    <div className="min-w-0">
                      <h3 className="m-0 mb-[3px] text-[15.5px] font-bold">
                        {p.title}
                      </h3>
                      <p className="m-0 text-[14px] text-[var(--color-text-muted)]">
                        {p.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid min-w-0 grid-cols-2 grid-rows-[190px_130px] gap-2.5">
              <Frame
                label="Sala llena durante una charla"
                photo="/assets/charla.jpg"
                className="col-span-2"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
              <Frame
                label="Networking"
                photo="/assets/networking.jpg"
                sizes="(min-width: 1024px) 280px, 50vw"
              />
              <Frame
                label="Taller hands-on"
                photo="/assets/handson.jpg"
                sizes="(min-width: 1024px) 280px, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Agenda ──────────────────────────────────────── */}
      <section
        id="agenda"
        className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface)]"
      >
        <div className={`${WRAP} py-[72px]`}>
          <NumberHeading
            n="02"
            title="Agenda del día"
            action={{ href: scheduleHref, label: "Agenda completa" }}
          />
          <div className="border-t border-[var(--color-text-primary)]">
            {AGENDA.map((a) => (
              // Four fixed columns only fit from `sm` up. Below it the row
              // stacks: time and room share the first line, then the title,
              // then the note. Placement is explicit rather than left to
              // auto-flow, so the source order still reads time-title-note-room
              // and the `sm` reset is a plain `auto` on every child.
              <div
                key={a.time}
                className="grid items-baseline gap-x-5 gap-y-1.5 border-b border-[var(--color-border-subtle)] px-1 py-[18px] [grid-template-columns:minmax(0,1fr)_auto] sm:gap-y-0 sm:[grid-template-columns:minmax(86px,110px)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(90px,130px)]"
              >
                <span className="col-start-1 row-start-1 font-mono text-[14px] font-medium text-[var(--color-text-primary)] sm:col-start-auto sm:row-start-auto">
                  {a.time}
                </span>
                <span className="col-span-2 col-start-1 row-start-2 min-w-0 text-[16.5px] font-bold tracking-[-0.015em] sm:col-span-1 sm:col-start-auto sm:row-start-auto">
                  {a.title}
                </span>
                <span className="col-span-2 col-start-1 row-start-3 min-w-0 text-[14px] text-[var(--color-text-muted)] sm:col-span-1 sm:col-start-auto sm:row-start-auto">
                  {a.note}
                </span>
                <span className="col-start-2 row-start-1 justify-self-end whitespace-nowrap rounded-[3px] border border-[var(--color-border-subtle)] px-[9px] py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] sm:col-start-auto sm:row-start-auto sm:justify-self-start">
                  {a.track}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · Speakers ────────────────────────────────────── */}
      <section
        id="speakers"
        className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface-muted)]"
      >
        <div className={`${WRAP} py-[72px]`}>
          <NumberHeading
            n="03"
            title="Speakers"
            action={{ href: speakersHref, label: "Ver todos" }}
          />
          {previewSpeakers.length === 0 ? (
            <p className="text-[15px] text-[var(--color-text-secondary)]">
              Estamos definiendo la grilla de oradores. Volvé pronto para
              conocer al elenco.
            </p>
          ) : (
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))]">
              {previewSpeakers.map((sp, i) => (
                <article key={sp.id} className="min-w-0">
                  <NextLink href={`${speakersHref}/${sp.slug}`}>
                    <Frame
                      label={sp.fullName}
                      photo={sp.profilePicture ?? undefined}
                      className="mb-3.5 aspect-[3/4] w-full"
                      sizes="(min-width: 640px) 380px, 100vw"
                    />
                  </NextLink>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="m-0 mb-0.5 text-[17px] font-bold tracking-[-0.02em]">
                        {sp.fullName}
                      </h3>
                      <p className="m-0 mb-2 text-[13px] text-[var(--color-text-muted)]">
                        {sp.tagLine ?? ""}
                      </p>
                      <p className="m-0 text-[13.5px] font-semibold leading-[1.4] text-[var(--color-accent)]">
                        {sp.sessions[0]?.name ?? ""}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 04 · La sede ─────────────────────────────────────── */}
      <section
        id="sede"
        className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface-inverse)] text-[var(--color-text-on-inverse)]"
      >
        <div className={WRAP}>
          <div className="grid items-stretch [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
            <div className="flex min-w-0 flex-col justify-center py-[72px] pr-0 lg:pr-12">
              <div className="mb-7 flex items-baseline gap-4">
                <span className={NUM_ON_DARK}>04</span>
                <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-text-on-inverse-muted)]">
                  La sede
                </span>
              </div>
              <h2 className={`${H2} mb-4`}>
                {venue.name}
                <br />
                {eventInfo.location.city}
              </h2>
              <p className="m-0 mb-7 max-w-[30rem] text-[16px] text-[var(--color-text-on-inverse-secondary)]">
                {venue.address}. Auditorio principal, salas de taller y espacio
                de networking en el mismo edificio.
              </p>
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center self-start whitespace-nowrap rounded-[4px] border-[1.5px] border-[var(--color-text-on-inverse)] px-[26px] py-[13px] text-[15px] font-semibold text-[var(--color-text-on-inverse)] transition-colors hover:bg-[var(--color-text-on-inverse)] hover:text-[var(--color-surface-inverse)]"
              >
                Ver en el mapa
              </a>
            </div>
            <div className="relative min-h-[440px] min-w-0 border-l border-[var(--color-border-on-inverse)]">
              <Frame
                label={`Foto de la sede — ${venue.name}`}
                photo={venuePhoto}
                position="right"
                className="h-full w-full"
                // The 440px min-height drives the cover crop of this 16:9
                // photo, so the rendered width sits at 780-840px on every
                // viewport rather than tracking one.
                sizes="840px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · FAQ ─────────────────────────────────────────── */}
      <section
        id="faq"
        className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface)]"
      >
        <div className={`${WRAP} py-[72px]`}>
          <NumberHeading n="05" title="Preguntas frecuentes" />
          <div className="grid gap-x-14 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
            {faq.map((f) => (
              <div
                key={f.id}
                className="min-w-0 border-b border-[var(--color-border-subtle)] py-[18px]"
              >
                <h3 className="m-0 mb-1.5 text-[16px] font-bold tracking-[-0.015em]">
                  {f.question}
                </h3>
                <p className="m-0 text-[14.5px] text-[var(--color-text-secondary)]">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-[26px] text-[14.5px] text-[var(--color-text-muted)]">
            ¿No está tu pregunta?{" "}
            <a
              href={`mailto:${eventInfo.contactEmail}`}
              className="font-semibold text-[var(--color-accent)]"
            >
              Escribinos
            </a>
            .
          </p>
        </div>
      </section>

      {/* ── 06 · Equipo ──────────────────────────────────────── */}
      <section
        id="equipo"
        className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface-warm)]"
      >
        <div className={`${WRAP} py-[72px]`}>
          <NumberHeading
            n="06"
            title="Quiénes lo organizan"
            action={{ href: teamHref, label: "Ver el equipo" }}
          />
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr))]">
            {previewTeam.map((tm) => (
              <div key={tm.id} className="min-w-0">
                <Frame
                  label={tm.name}
                  photo={tm.photo}
                  className="aspect-square w-full"
                />
                <h3 className="m-0 mb-[3px] mt-3 text-[15px] font-bold tracking-[-0.015em]">
                  {tm.name}
                </h3>
                <p className="m-0 text-[12.5px] leading-[1.4] text-[var(--color-text-muted)]">
                  {tm.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 · Sponsors ────────────────────────────────────── */}
      <section
        id="sponsors"
        className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface)]"
      >
        <div className={`${WRAP} py-[72px]`}>
          <NumberHeading
            n="07"
            title="Sponsors"
            action={{ href: sponsorsHref, label: "Ver todos" }}
          />
          {sponsors.length === 0 && availableTiers.length === 0 ? (
            <p className="text-[15px] text-[var(--color-text-secondary)]">
              Aún no hay sponsors confirmados.
            </p>
          ) : (
            <div className="grid border-l border-t border-[var(--color-border-subtle)] [grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr))]">
              {sponsors.map((sponsor) => (
                <SponsorTile key={sponsor.id} sponsor={sponsor} />
              ))}
              {availableTiers.map((tier) => (
                <SponsorSlotCard
                  key={tier}
                  tier={tier}
                  price={priceByTier.get(tier)}
                  href={sponsorsHref}
                />
              ))}
            </div>
          )}
          <p className="mt-6 text-[15px] text-[var(--color-text-secondary)]">
            ¿Tu organización quiere sumarse?{" "}
            <a
              href={`mailto:${eventInfo.contactEmail}?subject=Sponsor%20AWS%20Community%20Day%20Paraguay`}
              className="font-bold text-[var(--color-accent)]"
            >
              Escribinos
            </a>{" "}
            y te pasamos los paquetes.
          </p>
        </div>
      </section>

      {/* ── 08 · Tres formas de ser parte ────────────────────── */}
      <section
        id="participar"
        className="border-b border-[var(--color-text-primary)] bg-[var(--color-surface-muted)]"
      >
        <div className={`${WRAP} py-[72px]`}>
          <NumberHeading n="08" title="Tres formas de ser parte" />
          <div className="grid border-l border-t border-[var(--color-text-primary)] [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]">
            {[
              {
                href: registerHref,
                eyebrow: "Asistir",
                title: "Registrarme",
                body: "Entrada gratuita vía Eventbrite. Cupos limitados por la capacidad del auditorio.",
              },
              {
                href: cfpHref,
                eyebrow: "Hablar",
                title: "Proponer una charla",
                body: "Convocatoria de charlas abierta en Sessionize hasta el 30 de septiembre de 2026.",
              },
              {
                href: volunteersHref,
                eyebrow: "Ayudar",
                title: "Ser voluntario/a",
                body: "No hace falta experiencia previa, solo ganas de dar una mano.",
              },
            ].map((c) => (
              <NextLink
                key={c.title}
                href={c.href}
                className="group/card flex min-w-0 flex-col gap-2 border-b border-r border-[var(--color-border-subtle)] p-[26px] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-action)]"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  {c.eyebrow}
                </span>
                <span className="text-[21px] font-extrabold tracking-[-0.025em]">
                  {c.title}
                </span>
                <span className="text-[14px] text-[var(--color-text-secondary)]">
                  {c.body}
                </span>
                <span className="mt-2 text-[15px] font-bold" aria-hidden="true">
                  →
                </span>
              </NextLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
