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
};

export function OrganizersGrid({
  organizers,
  eventInfo,
  isLoading = false,
}: OrganizersGridProps) {
  if (isLoading && organizers.length === 0) {
    return (
      <LoadingGrid
        columns={3}
        rows={2}
        itemAspectRatio={1}
        loadingLabel="Cargando equipo"
      />
    );
  }
  if (organizers.length === 0) {
    return (
      <EmptyState
        variant="team"
        title="Equipo en formación"
        description="Estamos sumando voluntarios al equipo organizador. Si querés colaborar, escribinos."
        actionHref={`mailto:${eventInfo.contactEmail}?subject=Voluntariado%20AWS%20Community%20Day%20Paraguay`}
        actionLabel="Quiero colaborar"
      />
    );
  }
  return (
    <ul
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Equipo organizador"
    >
      {organizers.map((o) => (
        <li key={o.id}>
          <OrganizerCard organizer={o} />
        </li>
      ))}
    </ul>
  );
}
