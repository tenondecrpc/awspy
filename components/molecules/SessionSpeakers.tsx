// Session speakers molecule. Credits a session to the people who give it: a
// small round portrait (initials when there is none) and the name, linked to
// the speaker's page. Used by the agenda cards and the confirmed-talks list.

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
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const NAME =
  "text-step--1 font-semibold leading-tight text-[var(--color-text-primary)]";

export function SessionSpeakers({
  speakers,
  basePath,
  className,
}: SessionSpeakersProps) {
  if (speakers.length === 0) return null;

  return (
    <ul
      aria-label={speakers.length === 1 ? "Speaker" : "Speakers"}
      className={cn(
        "m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0",
        className
      )}
    >
      {speakers.map((sp) => (
        <li key={sp.id} className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface-muted)] text-xs font-semibold text-[var(--color-text-secondary)]"
          >
            {sp.photo ? (
              <Image
                src={sp.photo}
                alt=""
                fill
                sizes="36px"
                className="object-cover object-[50%_20%]"
              />
            ) : (
              initials(sp.name)
            )}
          </span>
          {sp.slug ? (
            <NextLink
              href={`${basePath}/${sp.slug}`}
              className={cn(
                NAME,
                "inline-flex min-h-[var(--size-touch)] items-center underline decoration-[var(--color-border-subtle)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]"
              )}
            >
              {sp.name}
            </NextLink>
          ) : (
            <span className={NAME}>{sp.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
