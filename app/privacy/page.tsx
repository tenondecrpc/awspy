import {
  PageHeader,
  SECTION_Y,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { getGaMeasurementId } from "@/lib/config/analytics";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Privacidad",
    description:
      "Cómo trata la privacidad el sitio del AWS Community Day Paraguay: analítica, registro, convocatoria de speakers y voluntariado.",
    path: "/privacy",
  });
}

const H3 =
  "m-0 mb-2 mt-10 font-display text-step-2 text-[var(--color-text-primary)]";
const P =
  "m-0 mb-4 text-step-0 leading-[1.65] text-[var(--color-text-secondary)]";
const LINK =
  "font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]";

export default function PrivacyPage() {
  const { eventInfo } = getEdition(currentEdition());
  const analyticsOn = getGaMeasurementId() !== null;

  return (
    <>
      <PageHeader
        title="Privacidad"
        description="Qué hace y qué no hace este sitio con tus datos."
      />

      <section>
        <div className={`${WRAP} ${SECTION_Y} !pt-4`}>
          <div className="max-w-[42rem]">
            <h2 className={`${H3} mt-0`}>Este sitio</h2>
            <p className={P}>
              Este sitio no recopila datos personales: no tiene cuentas ni
              formularios propios.
            </p>

            <h2 className={H3}>Analítica</h2>
            {analyticsOn ? (
              <p className={P}>
                Usamos Google Analytics para medir las visitas. Guarda cookies
                en tu navegador. Las señales de Google y la personalización de
                anuncios están desactivadas.
              </p>
            ) : (
              <p className={P}>
                La analítica solo se carga cuando los organizadores configuran
                un identificador de Google Analytics. En esta versión del sitio
                no está activa y no se guardan cookies de medición.
              </p>
            )}

            <h2 className={H3}>Registro y entradas</h2>
            <p className={P}>
              El registro se hace en Eventbrite, un sitio externo. Los datos que
              cargues ahí los trata Eventbrite según{" "}
              <a
                href="https://www.eventbrite.com/help/en-us/articles/460838/eventbrite-privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                su política de privacidad
              </a>
              .
            </p>

            <h2 className={H3}>Convocatoria de speakers</h2>
            <p className={P}>
              Las propuestas de charlas se envían por Sessionize, también un
              sitio externo, con sus propias condiciones.
            </p>

            <h2 className={H3}>Voluntariado</h2>
            <p className={P}>
              La postulación de voluntariado es un Google Form. Lo que completes
              ahí queda sujeto a la{" "}
              <a
                href="https://policies.google.com/privacy?hl=es-419"
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                Política de Privacidad de Google
              </a>
              .
            </p>

            <h2 className={H3}>Consultas</h2>
            <p className={P}>
              Para preguntas sobre este texto o sobre tus datos, escribinos a{" "}
              <a href={`mailto:${eventInfo.contactEmail}`} className={LINK}>
                {eventInfo.contactEmail}
              </a>
              .
            </p>

            <p className="m-0 mt-10 text-base text-[var(--color-text-muted)]">
              Este texto describe lo que hace el sitio hoy y puede ser revisado
              por los organizadores.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
