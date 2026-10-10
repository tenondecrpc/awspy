"use client";

// Countdown to the event start. Re-renders every minute (not every second)
// so the DOM updates stay cheap and the announcement is not noisy. Respects
// `prefers-reduced-motion` via the global CSS rule, but we also avoid any
// JS-driven animation on purpose.

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { calendarDaysBetween } from "@/lib/utils/datetime";

type CountdownProps = {
  targetDate: string;
  /**
   * `default`: muted panel used on light surfaces.
   * `hero`: the same cells, set in the light ink used on the dark hero.
   */
  tone?: "default" | "hero";
  /**
   * `grid` (default): the three-cell días/hs/min block.
   * `inline`: a single small "Faltan N días" line (see `headline`).
   * `display`: the same phrase as a single large serif line; the caller sets
   * its size and color (used for the days left in the hero).
   */
  variant?: "grid" | "inline" | "display";
  className?: string;
};

/** One count and its unit, as in "Faltan 7 días" or "Falta 1 hora". */
type Headline = {
  verb: "Falta" | "Faltan";
  value: number;
  unit: string;
};

type Parts = {
  days: number;
  hours: number;
  minutes: number;
  past: boolean;
  headline: Headline;
};

function phrase(value: number, singular: string, plural: string): Headline {
  return value === 1
    ? { verb: "Falta", value, unit: singular }
    : { verb: "Faltan", value, unit: plural };
}

// The display and inline variants count Asunción calendar days, the way an
// attendee counts them: on Saturday evening an event the next Saturday
// morning is "7 días" away, though only 6 whole 24-hour periods remain. On
// the day itself "0 días" says nothing, so they switch to the hours, then
// the minutes, still to go.
function headline(target: number, now: number): Headline {
  const days = calendarDaysBetween(now, target);
  if (days > 0) return phrase(days, "día", "días");
  const minutes = Math.ceil((target - now) / 60_000);
  if (minutes >= 60) return phrase(Math.floor(minutes / 60), "hora", "horas");
  return phrase(minutes, "minuto", "minutos");
}

function diff(target: number, now: number): Parts {
  const ms = target - now;
  if (ms <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      past: true,
      headline: phrase(0, "día", "días"),
    };
  }
  // The grid shows the exact time left, so its days are whole 24-hour
  // periods and the hours and minutes carry the rest.
  const totalMinutes = Math.floor(ms / 60_000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours - days * 24;
  const minutes = totalMinutes - totalHours * 60;
  return {
    days,
    hours,
    minutes,
    past: false,
    headline: headline(target, now),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function Countdown({
  targetDate,
  tone = "default",
  variant = "grid",
  className,
}: CountdownProps) {
  const target = new Date(targetDate).getTime();
  const [parts, setParts] = useState<Parts>(() => diff(target, Date.now()));

  useEffect(() => {
    if (Number.isNaN(target)) return;
    function tick() {
      setParts(diff(target, Date.now()));
    }
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [target]);

  if (Number.isNaN(target)) return null;

  if (variant === "display") {
    if (parts.past) {
      return (
        <p
          className={cn("m-0 font-display text-step-2", className)}
          role="status"
          aria-live="polite"
        >
          El evento ya comenzó
        </p>
      );
    }
    // The NUMBER is the information, so it is set huge in the display serif
    // and the words ("Faltan", "días") stay small beside it on one baseline.
    // The visual pieces are aria-hidden and the full phrase is written once
    // for assistive technology ("Faltan 15 días"), so the announcement and
    // text queries read it whole instead of as three fragments.
    const { verb, value, unit } = parts.headline;
    return (
      <div
        className={cn("flex items-baseline gap-[0.6em]", className)}
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">{`${verb} ${value} ${unit}`}</span>
        <span
          aria-hidden="true"
          className={`text-step-1 ${
            tone === "hero"
              ? "text-[var(--color-text-on-hero)]"
              : "text-[var(--color-text-secondary)]"
          }`}
        >
          {verb}
        </span>
        <span
          aria-hidden="true"
          className="font-display text-[clamp(3.5rem,18vw,7.5rem)] leading-[0.8] tracking-[-0.03em] tabular-nums"
        >
          {value}
        </span>
        <span
          aria-hidden="true"
          className={`text-step-1 ${
            tone === "hero"
              ? "text-[var(--color-text-on-hero)]"
              : "text-[var(--color-text-secondary)]"
          }`}
        >
          {unit}
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <p
        className={cn("text-sm text-[var(--color-text-muted)]", className)}
        role="status"
        aria-live="polite"
      >
        {parts.past
          ? "El evento ya comenzó"
          : `${parts.headline.verb} ${parts.headline.value} ${parts.headline.unit}`}
      </p>
    );
  }

  if (parts.past) {
    return (
      <div
        className={cn("text-center", className)}
        role="status"
        aria-live="polite"
      >
        <p
          className={cn(
            "text-sm font-semibold",
            tone === "hero"
              ? "text-[var(--color-text-on-hero)]"
              : "text-[var(--color-text-secondary)]"
          )}
        >
          El evento ya comenzó
        </p>
      </div>
    );
  }

  const isHero = tone === "hero";

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-3",
        isHero
          ? "w-full max-w-sm"
          : "mx-auto bg-[var(--color-surface-muted)] p-4 sm:max-w-md",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={`Faltan ${parts.days} días, ${parts.hours} horas y ${parts.minutes} minutos`}
    >
      {[
        { label: "días", value: parts.days },
        { label: "hs", value: parts.hours },
        { label: "min", value: parts.minutes },
      ].map((unit) => (
        <div
          key={unit.label}
          className={cn(
            "flex flex-col items-center justify-center",
            isHero && "gap-1 border-t-2 border-[var(--color-text-on-hero)] pt-3"
          )}
        >
          <span
            className={cn(
              "font-display tabular-nums",
              isHero
                ? "text-3xl leading-none text-[var(--color-text-on-hero)] sm:text-4xl"
                : "text-3xl sm:text-4xl"
            )}
          >
            {pad(unit.value)}
          </span>
          <span
            className={cn(
              "text-xs",
              isHero
                ? "text-[var(--color-text-on-hero)] opacity-75"
                : "text-[var(--color-text-secondary)]"
            )}
          >
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
