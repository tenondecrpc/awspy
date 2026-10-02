// Contrast check for the site palette (app/globals.css, light and dark).
// Run: node design-system/scripts/check-contrast.mjs
// Exit code 1 if any required pair is below its minimum.
// Keep the values below in sync with the tokens in app/globals.css.

const lum = (hex) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const T = 4.5; // normal text
const U = 3; // UI / large text

const light = {
  paper: "#f7f2e8",
  paperDeep: "#ece3d0",
  warm: "#f4e6d2",
  card: "#ffffff",
  navy: "#08152f", // surface-inverse
  hero: "#000c2f",
  text1: "#08152f",
  text2: "#34415f",
  muted: "#4f586e",
  accent: "#0038a8",
  redLabel: "#c4152f",
  actionLabel: "#9a5200",
  success: "#1a6d32",
  onInvSecondary: "#c5ccea",
  onInvMuted: "#9aa5ca",
  redOnDark: "#ff5566",
  action: "#ff9900",
  onAction: "#08152f",
};
const dark = {
  surface: "#010928",
  muted: "#071438",
  elevated: "#0d1b46",
  text1: "#f7f8ff",
  text2: "#c5ccea",
  text3: "#9aa5ca",
  accent: "#74a8ff",
  red: "#ff5566",
  action: "#ff9900",
  onAction: "#000c2f",
};

const checks = [
  // [label, fg, bg, min]
  ["L text-primary / paper", light.text1, light.paper, T],
  ["L text-secondary / paper", light.text2, light.paper, T],
  ["L text-muted / paper", light.muted, light.paper, T],
  ["L text-muted / paper-deep", light.muted, light.paperDeep, T],
  ["L text-muted / warm", light.muted, light.warm, T],
  ["L text-secondary / paper-deep", light.text2, light.paperDeep, T],
  ["L link accent / paper", light.accent, light.paper, T],
  ["L link accent / paper-deep", light.accent, light.paperDeep, T],
  ["L red label / paper", light.redLabel, light.paper, T],
  ["L red label / paper-deep", light.redLabel, light.paperDeep, T],
  ["L action label / paper", light.actionLabel, light.paper, T],
  ["L action label / paper-deep", light.actionLabel, light.paperDeep, T],
  ["L success / paper-deep", light.success, light.paperDeep, T],
  ["L text / card", light.text1, light.card, T],
  ["L navy on orange button", light.onAction, light.action, T],
  ["L paper on hero", light.paper, light.hero, T],
  ["L secondary / navy band", light.onInvSecondary, light.navy, T],
  ["L muted / navy band", light.onInvMuted, light.navy, T],
  ["L red-on-dark / navy band", light.redOnDark, light.navy, T],
  ["L red-on-dark / hero", light.redOnDark, light.hero, T],
  ["L orange / navy band (UI)", light.action, light.navy, U],
  ["D text-primary / surface", dark.text1, dark.surface, T],
  ["D text-secondary / muted", dark.text2, dark.muted, T],
  ["D text-muted / elevated", dark.text3, dark.elevated, T],
  ["D link / surface", dark.accent, dark.surface, T],
  ["D link / elevated", dark.accent, dark.elevated, T],
  ["D red / surface", dark.red, dark.surface, T],
  ["D navy on orange button", dark.onAction, dark.action, T],
  ["D orange / surface (UI)", dark.action, dark.surface, U],
];

let failed = 0;
for (const [label, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${label}  ${fg} on ${bg}`,
  );
}
console.log(failed ? `\n${failed} failing pair(s)` : "\nAll pairs pass");
process.exit(failed ? 1 : 0);
