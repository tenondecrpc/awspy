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
   * `hero`: frosted glass boxes sitting directly on the midnight-blue hero.
   */
  tone?: "default" | "hero";
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

  if (parts.past) {
    return (
      <div
        className={cn("text-center", className)}
        role="status"
        aria-live="polite"
      >
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-wide",
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
          : "mx-auto rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] p-4 sm:max-w-md",
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
            isHero &&
              "glass-panel gap-1 rounded-[var(--radius-lg)] px-2 py-3 sm:py-4"
          )}
        >
          <span
            className={cn(
              "font-bold tabular-nums",
              isHero
                ? "text-3xl leading-none text-[var(--color-text-on-hero)] sm:text-4xl"
                : "text-3xl sm:text-4xl"
            )}
          >
            {pad(unit.value)}
          </span>
          <span
            className={cn(
              "text-xs uppercase tracking-wide",
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
