import { z, type ZodType } from "zod";
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
};

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Define it in your environment before calling the API."
    );
  }
  return url.replace(/\/$/, "");
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
  } = options;

  const validatedBody =
    body !== undefined && bodySchema ? bodySchema.parse(body) : body;

  const init: RequestInit & { next?: NextFetchOptions } = {
    method,
    headers: {
      accept: "application/json",
      ...(validatedBody !== undefined ? { "content-type": "application/json" } : {}),
      ...headers,
    },
    signal,
  };

  if (validatedBody !== undefined) {
    init.body = JSON.stringify(validatedBody);
  }
  if (cache) init.cache = cache;
  if (next) init.next = next;

  const url = path.startsWith("/") ? `${getBaseUrl()}${path}` : `${getBaseUrl()}/${path}`;
  const res = await fetch(url, init);

  const text = await res.text();
  const payload: unknown = text.length > 0 ? safeJsonParse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, payload);
  }

  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new ApiValidationError(
      `Response from ${method} ${path} did not match expected schema`,
      result.error.issues
    );
  }
  return result.data;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const Empty = z.unknown().transform(() => undefined as void);
