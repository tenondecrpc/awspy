// Typographic helpers for text that comes from data (taglines, talk titles,
// roles, answers), where the author cannot control where a line breaks.

const NBSP = " ";

/**
 * Ties the last two words of `text` with a non-breaking space, so the last
 * line of a wrapped block never holds a single word (an "orphan").
 *
 * Only texts of three or more words are touched, and only when the two last
 * words together are short enough (`maxTail` characters) not to overflow a
 * narrow column: binding two very long words would trade an orphan for a
 * horizontal scroll.
 *
 * Returns the text unchanged for `null`, `undefined` or short strings, so it is
 * safe to call on optional fields.
 */
export function tieLast(text: string | null | undefined, maxTail = 24): string {
  if (!text) return "";
  const trimmed = text.trimEnd();
  const words = trimmed.split(/\s+/);
  if (words.length < 3) return trimmed;
  const a = words[words.length - 2];
  const b = words[words.length - 1];
  if (a.length + 1 + b.length > maxTail) return trimmed;
  const head = words.slice(0, -2).join(" ");
  return `${head} ${a}${NBSP}${b}`;
}
