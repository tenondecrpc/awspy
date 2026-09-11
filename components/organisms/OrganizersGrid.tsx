import { OrganizerCard } from "@/components/molecules/OrganizerCard";
import { EmptyState } from "@/components/organisms/EmptyState";
import { LoadingGrid } from "@/components/atoms/LoadingGrid";
import type { Organizer } from "@/lib/content/organizers";
import type { EventInfo } from "@/lib/content/event-info";

type OrganizersGridProps = {
  organizers: Organizer[];
  eventInfo: EventInfo;
  /** When true and the list is empty, render a skeleton instead. */
  isLoading?: boolean;
  volunteersHref?: string;
};

export function OrganizersGrid({
  organizers,
  eventInfo,
  isLoading = false,
  volunteersHref = "/volunteers",
}: OrganizersGridProps) {
  if (isLoading && organizers.length === 0) {
    return (
      <LoadingGrid
        columns={2}
        rows={3}
        itemAspectRatio={2.5}
        gap="lg"
        loadingLabel="Cargando equipo"
      />
    );
  }
  if (organizers.length === 0) {
    return (
      <EmptyState
        variant="team"
        title="Equipo en formación"
        description={
          eventInfo.volunteerRegistrationUrl
            ? "Estamos sumando voluntarios al equipo organizador. Si querés colaborar, completá el formulario."
            : "Estamos sumando voluntarios al equipo organizador. Si querés colaborar, escribinos."
        }
        actionHref={
          eventInfo.volunteerRegistrationUrl
            ? volunteersHref
            : `mailto:${eventInfo.contactEmail}?subject=Voluntariado%20AWS%20Community%20Day%20Paraguay`
        }
        actionLabel="Quiero colaborar"
      />
    );
  }
  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8"
      aria-label="Equipo organizador"
    >
      {organizers.map((o, index) => (
        <li key={o.id} className="h-full">
          <OrganizerCard organizer={o} accentIndex={index} />
        </li>
      ))}
    </ul>
  );
}
