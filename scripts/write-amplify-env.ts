import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const REQUIRED_PUBLIC_BUILD_ENV = [
  "CURRENT_EDITION",
  "NEXT_PUBLIC_SITE_URL",
] as const;

export const OPTIONAL_PUBLIC_BUILD_ENV = [
  "NEXT_PUBLIC_SESSIONIZE_BASE_URL",
] as const;

export function serializePublicBuildEnv(
  environment: Readonly<Record<string, string | undefined>>
): string {
  const missing = REQUIRED_PUBLIC_BUILD_ENV.filter((key) => !environment[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required public build variables: ${missing.join(", ")}`
    );
  }

  const keys = [...REQUIRED_PUBLIC_BUILD_ENV, ...OPTIONAL_PUBLIC_BUILD_ENV];
  const lines = keys.flatMap((key) => {
    const value = environment[key];
    if (value === undefined || value === "") return [];
    if (/[\0\r\n]/.test(value)) {
      throw new Error(`Public build variable ${key} contains a line break`);
    }
    return `${key}=${JSON.stringify(value)}`;
  });
  return `${lines.join("\n")}\n`;
}

export function writePublicBuildEnv(
  environment: Readonly<Record<string, string | undefined>> = process.env,
  outputPath = ".env.production"
): void {
  writeFileSync(outputPath, serializePublicBuildEnv(environment), {
    encoding: "utf8",
    mode: 0o600,
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  writePublicBuildEnv();
  console.log("Wrote allowlisted public build configuration.");
}
