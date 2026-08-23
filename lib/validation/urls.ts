import { z } from "zod";
import { REMOTE_IMAGE_HOSTS } from "@/lib/config/image-hosts";

function hasProtocol(value: string, allowed: ReadonlySet<string>): boolean {
  try {
    const url = new URL(value);
    return (
      allowed.has(url.protocol) && url.username === "" && url.password === ""
    );
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

const remoteImageHosts = new Set<string>(REMOTE_IMAGE_HOSTS);

function hasConfiguredImageHost(value: string): boolean {
  try {
    return remoteImageHosts.has(new URL(value).hostname);
  } catch {
    return false;
  }
}

export const RemoteImageUrlSchema = HttpsUrlSchema.refine(
  hasConfiguredImageHost,
  { message: "Remote image host is not configured" }
);

export function isSafeMarkdownHref(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (value.startsWith("#")) return true;
  return HttpUrlSchema.safeParse(value).success;
}
