import { z } from "zod";

function hasProtocol(value: string, allowed: ReadonlySet<string>): boolean {
  try {
    return allowed.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

const HTTP_PROTOCOLS = new Set(["http:", "https:"]);
const HTTPS_PROTOCOLS = new Set(["https:"]);

export const HttpUrlSchema = z
  .string()
  .url()
  .refine((value) => hasProtocol(value, HTTP_PROTOCOLS), {
    message: "URL must use http or https",
  });

export const HttpsUrlSchema = z
  .string()
  .url()
  .refine((value) => hasProtocol(value, HTTPS_PROTOCOLS), {
    message: "URL must use https",
  });

export function isSafeMarkdownHref(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (value.startsWith("#")) return true;
  return HttpUrlSchema.safeParse(value).success;
}
