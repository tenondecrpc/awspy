// Class-name join helper. Filters out falsy values so callers can pass
// conditional class names inline:
//   <button className={cn("base", isPrimary && "primary", disabled && "muted")} />
//
// This is intentionally minimal. We do not bring in `clsx` to keep the bundle
// small and avoid a transitive dependency for a 10-line utility.

export type ClassValue =
  string | number | null | undefined | false | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  function push(value: ClassValue): void {
    if (value === null || value === undefined || value === false) return;
    if (typeof value === "string") {
      if (value.length > 0) out.push(value);
      return;
    }
    if (typeof value === "number") {
      out.push(String(value));
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) push(item);
    }
  }

  for (const input of inputs) push(input);

  return out.join(" ");
}
