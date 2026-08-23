// Organizer card molecule. Photo (or initials placeholder), name, role, and
// links. The photo is sourced from the organizer record (Sessionize-like
// URL) when set; otherwise the consumer can reference a file under
// `public/team/<slug>.jpg`. When no
// asset resolves, the Placeholder atom reserves space and shows initials.

import Image from "next/image";
import { Link } from "@/components/atoms/Link";
import { Placeholder } from "@/components/atoms/Placeholder";
import type { Organizer } from "@/lib/content/organizers";

type OrganizerCardProps = {
  organizer: Organizer;
};

const SOCIAL_LABELS: Record<keyof NonNullable<Organizer["links"]>, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter",
  github: "GitHub",
  website: "Sitio",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function OrganizerCard({ organizer }: OrganizerCardProps) {
  const linkEntries = (
    Object.entries(organizer.links ?? {}) as Array<
      [keyof typeof SOCIAL_LABELS, string | undefined]
    >
  ).filter(([, url]) => Boolean(url));

  return (
    <article className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] p-4 text-center shadow-sm">
      <div className="h-[120px] w-[120px]">
        {organizer.photo ? (
          <Image
            src={organizer.photo}
            alt=""
            width={120}
            height={120}
            sizes="120px"
            className="h-[120px] w-[120px] rounded-full object-cover"
          />
        ) : (
          <Placeholder
            kind="avatar"
            label={initials(organizer.name)}
            className="h-[120px] w-[120px]"
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-semibold">{organizer.name}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {organizer.role}
        </p>
      </div>
      {linkEntries.length > 0 ? (
        <ul className="mt-2 flex flex-wrap justify-center gap-2 text-sm">
          {linkEntries.map(([key, url]) => (
            <li key={key}>
              <Link href={url as string} external>
                {SOCIAL_LABELS[key]}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
