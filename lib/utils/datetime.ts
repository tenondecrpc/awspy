// Date and time formatting helpers. All output is rendered in the
// America/Asuncion time zone and Spanish locale because the audience is the
// AWS Community Day Paraguay attendee base. See spec FR-016 (UI in Spanish)
// and research R7 (time zone handling).
//
// All inputs are accepted as either a `Date`, an ISO-8601 string parseable by
// `new Date(...)`, or a numeric timestamp in milliseconds.

const TIME_ZONE = "America/Asuncion";

// `es-PY` is the most accurate locale, but Node's ICU sometimes lacks the
// region-specific data; we list `es` as a fallback so formatting still works.
const LOCALES: readonly string[] = ["es-PY", "es"];

export type DateInput = Date | string | number;

function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  return new Date(input);
}

function isValid(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

const WALL_TIME =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?$/;

/** Minutes east of UTC that Asunción observes at the given instant. */
function asuncionOffsetAt(ms: number): number {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(ms))
    .find((part) => part.type === "timeZoneName")?.value;
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name ?? "");
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "-" ? -minutes : minutes;
}

/**
 * Pins a zone-less wall-clock time to Asunción, returning it with the offset
 * that zone observed at that moment (`2026-10-17T09:00:00` becomes
 * `2026-10-17T09:00:00-03:00`). A value that already names its zone is
 * returned untouched.
 *
 * Sessionize sends announced schedule times in the event's zone with no
 * designator. `new Date()` reads such a string in the server's zone, which is
 * UTC on Amplify, so without this every session would render three hours
 * early.
 */
export function wallTimeToInstant(value: string): string {
  const match = WALL_TIME.exec(value);
  if (!match) return value;
  const [, year, month, day, hour, minute, second = "00", fraction = ""] =
    match;
  const asUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );
  // Read the offset at the guessed instant, then again once corrected, so a
  // time next to a daylight-saving change resolves to the right side of it.
  const offset = asuncionOffsetAt(asUtc - asuncionOffsetAt(asUtc) * 60_000);
  const sign = offset < 0 ? "-" : "+";
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${fraction}${sign}${hh}:${mm}`;
}

/**
 * Formats a date as a long Spanish weekday + day + month + year. Example:
 *   "sábado, 23 de mayo de 2026"
 */
export function formatDate(input: DateInput): string {
  const date = toDate(input);
  if (!isValid(date)) return "";
  return new Intl.DateTimeFormat(LOCALES, {
    timeZone: TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Formats a time as 24h `HH:mm`.
 */
export function formatTime(input: DateInput): string {
  const date = toDate(input);
  if (!isValid(date)) return "";
  return new Intl.DateTimeFormat(LOCALES, {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Formats a full date + time. Example:
 *   "23 de mayo, 09:00"
 */
export function formatDateTime(input: DateInput): string {
  const date = toDate(input);
  if (!isValid(date)) return "";
  return new Intl.DateTimeFormat(LOCALES, {
    timeZone: TIME_ZONE,
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Formats a time range. When start and end fall on the same calendar day in
 * the Asunción time zone, returns `HH:mm - HH:mm`. When they do not (e.g. a
 * session crosses midnight), the start day is shown explicitly so the reader
 * is not misled.
 *
 * Per data-model and research R7, schedule rendering groups sessions by their
 * start day; this helper exists for slot-level labeling.
 */
export function formatTimeRange(
  startInput: DateInput,
  endInput: DateInput
): string {
  const start = toDate(startInput);
  const end = toDate(endInput);
  if (!isValid(start) || !isValid(end)) return "";

  const startDay = startOfDayKey(start);
  const endDay = startOfDayKey(end);

  if (startDay === endDay) {
    return `${formatTime(start)} - ${formatTime(end)}`;
  }
  // Different days: prefix the end with its calendar day so we never display
  // a misleading "23:30 - 00:30" without context.
  const endLabel = `${formatTime(end)} (${formatDateTime(end)})`;
  return `${formatTime(start)} - ${endLabel}`;
}

/**
 * Returns the day-of-month identifier for a date in the Asunción time zone.
 * Used to determine whether two timestamps fall on the same calendar day,
 * which matters for the schedule grouping logic referenced in research R7.
 */
export function startOfDayKey(input: DateInput): string {
  const date = toDate(input);
  if (!isValid(date)) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
