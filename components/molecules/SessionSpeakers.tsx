// Session speakers molecule. Credits a session to the people who give it: a
// row of overlapping round portraits, then "Por Ana, Bruno y Carla" with each
// name linked to the speaker's page. The agenda uses it so every talk carries
// its speaker reference, which lets the speakers list stay identity-only.
//
// The portraits are decorative (`alt=""`): every name is spelled out right
// after them, so a screen reader would only hear each one twice. A speaker
// with no photo gets an initials disc in the same slot.

import Image from "next/image";
import NextLink from "next/link";
import { cn } from "@/lib/utils/cn";

export type SessionSpeakerRef = {
  id: string;
  name: string;
  /** Detail-page slug. Absent when the speaker is not on the speakers list. */
  slug?: string;
  photo?: string | null;
};

type SessionSpeakersProps = {
  speakers: SessionSpeakerRef[];
  /** Path prefix for the detail links (e.g. `/editions/2025/speakers`). */
  basePath: string;
  className?: string;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Spanish list punctuation: "A", "A y B", "A, B y C". */
function separatorBefore(index: number, count: number): string {
  if (index === 0) return "";
  return index === count - 1 ? " y " : ", ";
}

export function SessionSpeakers({
  speakers,
  basePath,
  className,
}: SessionSpeakersProps) {
  if (speakers.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span aria-hidden="true" className="flex flex-none -space-x-2">
        {speakers.map((sp) => (
          <span
            key={sp.id}
            className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[var(--color-accent-soft)] font-mono text-[10.5px] font-semibold text-[var(--color-accent-strong)] ring-2 ring-[var(--color-surface)]"
          >
            {sp.photo ? (
              <Image
                src={sp.photo}
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              initials(sp.name)
            )}
          </span>
        ))}
      </span>
      <p className="m-0 min-w-0 text-[13.5px] text-[var(--color-text-muted)]">
        Por{" "}
        {speakers.map((sp, i) => (
          <span key={sp.id}>
            {separatorBefore(i, speakers.length)}
            {sp.slug ? (
              <NextLink
                href={`${basePath}/${sp.slug}`}
                className="font-semibold text-[var(--color-accent)] hover:underline"
              >
                {sp.name}
              </NextLink>
            ) : (
              <span className="font-semibold text-[var(--color-text-secondary)]">
                {sp.name}
              </span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}
