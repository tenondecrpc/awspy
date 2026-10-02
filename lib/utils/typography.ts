// Typographic helpers for text that comes from data (taglines, talk titles,
// roles, answers), where the author cannot control where a line breaks.

const NBSP = "\u00a0";

/**
 * Ties the last two words of `text` with a non-breaking space, so the last
 * line of a wrapped block never holds a single word (an "orphan").
 *
 * Only texts of three or more words are touched, and only when the two last
 * words together are short enough (`maxTail` characters) not to overflow a
 * narrow column: binding two very long words would trade an orphan for a
 * horizontal scroll.
 *
 * Only the gap between the last two words changes. Every other character,
 * line breaks included, is kept, so multi-paragraph text rendered with
 * `white-space: pre-line` keeps its paragraphs. Two words on separate lines
 * are left apart.
 *
 * Returns "" for `null` or `undefined`; otherwise the text without trailing
 * whitespace.
 */
export function tieLast(text: string | null | undefined, maxTail = 24): string {
  if (!text) return "";
  const trimmed = text.trimEnd();
  if (trimmed.trim().split(/\s+/).length < 3) return trimmed;
  const tail = /(\S+)[ \t]+(\S+)$/.exec(trimmed);
  if (!tail) return trimmed;
  const [, a, b] = tail;
  if (a.length + 1 + b.length > maxTail) return trimmed;
  return `${trimmed.slice(0, tail.index)}${a}${NBSP}${b}`;
}
