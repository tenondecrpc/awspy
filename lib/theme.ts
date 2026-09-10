export const THEME_STORAGE_KEY = "awscdpy-color-theme-v1";

export type ColorTheme = "light" | "dark";

export function isColorTheme(value: unknown): value is ColorTheme {
  return value === "light" || value === "dark";
}
