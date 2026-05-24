// Speaker card molecule. Renders the speaker's photo (or initials fallback),
// full name, and tagline. Wraps the whole card in a link to the detail page
// for keyboard navigation.

import Image from "next/image";
import NextLink from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Speaker } from "@/lib/api/sessionize";

type SpeakerCardProps = {
  speaker: Speaker;
  /** Path prefix for the detail link (e.g. `/speakers` or
   *  `/editions/2025/speakers`). */
  basePath?: string;
  className?: string;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function SpeakerCard({
  speaker,
  basePath = "/speakers",
  className,
}: SpeakerCardProps) {
  const detailHref = `${basePath}/${speaker.slug}`;

  return (
    <article
      className={cn(
        "group flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 shadow-sm",
        className
      )}
    >
      {speaker.profilePicture ? (
        <Image
          src={speaker.profilePicture}
          alt=""
          width={120}
          height={120}
          sizes="120px"
          className="h-[120px] w-[120px] rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-3xl font-bold text-[var(--color-accent-strong)]"
        >
          {initials(speaker.fullName)}
        </div>
      )}
      <div className="flex flex-col items-center gap-1 text-center">
        <NextLink
          href={detailHref}
          className="font-semibold text-[var(--color-text-primary)] hover:underline"
        >
          {speaker.fullName}
        </NextLink>
        {speaker.tagLine ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {speaker.tagLine}
          </p>
        ) : null}
      </div>
    </article>
  );
}
