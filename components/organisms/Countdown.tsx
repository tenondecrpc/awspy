"use client";

// Countdown to the event start. Re-renders every minute (not every second)
// so the DOM updates stay cheap and the announcement is not noisy. Respects
// `prefers-reduced-motion` via the global CSS rule, but we also avoid any
// JS-driven animation on purpose.

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

type CountdownProps = {
  targetDate: string;
  /**
   * `default`: muted panel used on light surfaces.
   * `hero`: the same cells, set in the light ink used on the dark hero.
   */
  tone?: "default" | "hero";
  /**
   * `grid` (default): the three-cell días/hs/min block.
   * `inline`: a single small "Faltan N días" line.
   * `display`: the same phrase as a single large serif line; the caller sets
   * its size and color (used for the days left in the hero).
   */
  variant?: "grid" | "inline" | "display";
  className?: string;
};

type Parts = {
  days: number;
  hours: number;
  minutes: number;
  past: boolean;
};

function diff(target: number, now: number): Parts {
  const ms = target - now;
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, past: true };
  const totalMinutes = Math.floor(ms / 60_000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours - days * 24;
  const minutes = totalMinutes - totalHours * 60;
  return { days, hours, minutes, past: false };
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
    return (
      <div
        className={cn("flex items-baseline gap-[0.6em]", className)}
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">{`Faltan ${parts.days} días`}</span>
        <span
          aria-hidden="true"
          className={`text-step-1 ${
            tone === "hero"
              ? "text-[var(--color-text-on-hero)]"
              : "text-[var(--color-text-secondary)]"
          }`}
        >
          Faltan
        </span>
        <span
          aria-hidden="true"
          className="font-display text-[min(7.5rem,12svh,18vw)] leading-[0.8] tracking-[-0.03em] tabular-nums"
        >
          {parts.days}
        </span>
        <span
          aria-hidden="true"
          className={`text-step-1 ${
            tone === "hero"
              ? "text-[var(--color-text-on-hero)]"
              : "text-[var(--color-text-secondary)]"
          }`}
        >
          días
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
        {parts.past ? "El evento ya comenzó" : `Faltan ${parts.days} días`}
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
