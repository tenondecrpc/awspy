import { type ZodType } from "zod";
import { ApiError, ApiValidationError } from "./errors";

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
};

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
  } = options;

  if (tolerateMissing && fallback === undefined) {
    throw new Error(
      "apiFetch: `fallback` must be provided when `tolerateMissing` is true."
    );
  }

  const validatedBody =
    body !== undefined && bodySchema ? bodySchema.parse(body) : body;

  const init: RequestInit & { next?: NextFetchOptions } = {
    method,
    headers: {
      accept: "application/json",
      ...(validatedBody !== undefined
        ? { "content-type": "application/json" }
        : {}),
      ...headers,
    },
    signal,
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
    // Network-level failures (DNS, connection refused, etc.). Treat as
    // missing under tolerateMissing.
    if (tolerateMissing) return fallback as T;
    throw err;
  }

  if (res.status === 404 && tolerateMissing) {
    return fallback as T;
  }

  const text = await res.text();
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
