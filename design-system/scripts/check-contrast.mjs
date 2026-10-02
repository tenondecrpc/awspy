// Contrast check for the brand-alignment proposal (brand-alignment.md).
// Run: node design-system/scripts/check-contrast.mjs
// Exit code 1 if any required pair is below its minimum.

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
  surface: "#ffffff",
  muted: "#eef2fd",
  warm: "#fff6e8",
  soft: "#e8efff",
  inverse: "#232f3e",
  accent: "#075ab0",
  accentStrong: "#054a8f",
  text1: "#08152f",
  text2: "#34415f",
  text3: "#5b647a",
  onInvSecondary: "#c5ccea",
  onInvMuted: "#9aa5ca",
  redOnDark: "#ff6b78",
  action: "#ff9900",
  onAction: "#08152f",
};
const dark = {
  surface: "#0f1b2a",
  muted: "#16202c",
  elevated: "#1b2838",
  soft: "#12304f",
  accent: "#539fe5",
  text1: "#f7f8ff",
  text2: "#c5ccea",
  text3: "#9aa5ca",
  action: "#ff9900",
  onAction: "#000c2f",
  red: "#ff6b78",
};

const checks = [
  // [label, fg, bg, min]
  ["L text-primary / surface", light.text1, light.surface, T],
  ["L text-secondary / muted", light.text2, light.muted, T],
  ["L text-muted / muted", light.text3, light.muted, T],
  ["L text-muted / warm", light.text3, light.warm, T],
  ["L accent link / surface", light.accent, light.surface, T],
  ["L accent link / muted", light.accent, light.muted, T],
  ["L accent link / soft", light.accent, light.soft, T],
  ["L accent link / warm", light.accent, light.warm, T],
  ["L white on accent button", "#ffffff", light.accent, T],
  ["L white on accent-strong", "#ffffff", light.accentStrong, T],
  ["L navy on orange button", light.onAction, light.action, T],
  ["L white / squid ink", "#ffffff", light.inverse, T],
  ["L secondary / squid ink", light.onInvSecondary, light.inverse, T],
  ["L muted / squid ink", light.onInvMuted, light.inverse, T],
  ["L orange / squid ink (UI)", light.action, light.inverse, U],
  ["L red-on-dark / squid ink", light.redOnDark, light.inverse, T],
  ["D text-primary / surface", dark.text1, dark.surface, T],
  ["D text-secondary / muted", dark.text2, dark.muted, T],
  ["D text-muted / elevated", dark.text3, dark.elevated, T],
  ["D link / surface", dark.accent, dark.surface, T],
  ["D link / muted", dark.accent, dark.muted, T],
  ["D link / elevated", dark.accent, dark.elevated, T],
  ["D link / soft", dark.accent, dark.soft, T],
  ["D navy on orange button", dark.onAction, dark.action, T],
  ["D orange / surface (UI)", dark.action, dark.surface, U],
  ["D red / surface", dark.red, dark.surface, T],
  ["D red / elevated", dark.red, dark.elevated, T],
  ["D accent-strong / surface", "#7bb8f0", dark.surface, T],
  ["D accent-strong / elevated", "#7bb8f0", dark.elevated, T],
  ["D text-secondary / warm", dark.text2, "#1c2330", T],
  ["D text-muted / warm", dark.text3, "#1c2330", T],
  ["D link / warm", dark.accent, "#1c2330", T],
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
