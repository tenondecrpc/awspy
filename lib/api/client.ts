import { type ZodType } from "zod";
import { ApiError, ApiResponseSizeError, ApiValidationError } from "./errors";

type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

type ApiFetchOptions<T> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  bodySchema?: ZodType<unknown>;
  schema: ZodType<T>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: NextFetchOptions;
  /**
   * When true, 404 responses and JSON parse failures resolve to `fallback`
   * instead of throwing. The success path still validates the body with the
   * provided schema and throws on schema drift.
   * Defaults to false to preserve the loud-failure default behavior.
   */
  tolerateMissing?: boolean;
  /**
   * Value returned when `tolerateMissing` is true and the request 404s or the
   * body fails to parse as JSON. Required when `tolerateMissing` is true.
   * Use `[]` for list endpoints and `null` for single-resource endpoints.
   */
  fallback?: T;
  /**
   * Optional override for the request URL base. When provided, `path` is
   * appended directly without consulting the env var. Useful for the
   * Sessionize client which targets a fixed external host.
   */
  baseUrl?: string;
  /** Request deadline in milliseconds. Defaults to 8 seconds. */
  timeoutMs?: number;
  /** Maximum decoded response size in bytes. Defaults to 2 MiB. */
  maxResponseBytes?: number;
};

const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

async function readBoundedText(
  response: Response,
  maximumBytes: number
): Promise<string> {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    throw new ApiResponseSizeError(maximumBytes);
  }
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        await reader.cancel();
        throw new ApiResponseSizeError(maximumBytes);
      }
      chunks.push(decoder.decode(value, { stream: true }));
    }
    chunks.push(decoder.decode());
    return chunks.join("");
  } finally {
    reader.releaseLock();
  }
}

function getDefaultBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Define it in your environment before calling the API."
    );
  }
  return url.replace(/\/$/, "");
}

function buildUrl(path: string, baseUrl?: string): string {
  // Absolute URLs are passed through verbatim.
  if (/^https?:\/\//i.test(path)) return path;

  const base = (baseUrl ?? getDefaultBaseUrl()).replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions<T>
): Promise<T> {
  const {
    method = "GET",
    body,
    bodySchema,
    schema,
    headers,
    signal,
    cache,
    next,
    tolerateMissing = false,
    fallback,
    baseUrl,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxResponseBytes = DEFAULT_MAX_RESPONSE_BYTES,
  } = options;

  if (tolerateMissing && fallback === undefined) {
    throw new Error(
      "apiFetch: `fallback` must be provided when `tolerateMissing` is true."
    );
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("apiFetch: `timeoutMs` must be a positive number.");
  }
  if (!Number.isFinite(maxResponseBytes) || maxResponseBytes <= 0) {
    throw new Error("apiFetch: `maxResponseBytes` must be a positive number.");
  }

  const validatedBody =
    body !== undefined && bodySchema ? bodySchema.parse(body) : body;

  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);
  const requestSignal = signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal;

  const init: RequestInit & { next?: NextFetchOptions } = {
    method,
    headers: {
      accept: "application/json",
      ...(validatedBody !== undefined
        ? { "content-type": "application/json" }
        : {}),
      ...headers,
    },
    signal: requestSignal,
  };

  if (validatedBody !== undefined) {
    init.body = JSON.stringify(validatedBody);
  }
  if (cache) init.cache = cache;
  if (next) init.next = next;

  const url = buildUrl(path, baseUrl);

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    clearTimeout(timeout);
    // Network-level failures (DNS, connection refused, etc.). Treat as
    // missing under tolerateMissing.
    if (tolerateMissing) return fallback as T;
    throw err;
  }

  if (res.status === 404 && tolerateMissing) {
    clearTimeout(timeout);
    return fallback as T;
  }

  let text: string;
  try {
    text = await readBoundedText(res, maxResponseBytes);
  } catch (err) {
    if (tolerateMissing) return fallback as T;
    throw err;
  } finally {
    clearTimeout(timeout);
  }
  let payload: unknown = null;
  if (text.length > 0) {
    try {
      payload = JSON.parse(text);
    } catch {
      // Not JSON. Under tolerateMissing, fall back. Otherwise expose the raw
      // body via ApiError below.
      if (!res.ok) {
        if (tolerateMissing) return fallback as T;
        throw new ApiError(res.status, res.statusText, text);
      }
      if (tolerateMissing) return fallback as T;
      throw new ApiValidationError(
        `Response from ${method} ${path} was not valid JSON`,
        []
      );
    }
  }

  if (!res.ok) {
    if (tolerateMissing) return fallback as T;
    throw new ApiError(res.status, res.statusText, payload);
  }

  const result = schema.safeParse(payload);
  if (!result.success) {
    if (tolerateMissing) return fallback as T;
    throw new ApiValidationError(
      `Response from ${method} ${path} did not match expected schema`,
      result.error.issues
    );
  }
  return result.data;
}
