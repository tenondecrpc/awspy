import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import {
  ApiError,
  ApiResponseSizeError,
  ApiValidationError,
} from "@/lib/api/errors";

const SAMPLE_BASE = "https://example.test";

function mockFetch(
  impl: (...args: Parameters<typeof fetch>) => Promise<Response>
): void {
  vi.stubGlobal("fetch", vi.fn(impl));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiFetch", () => {
  it("parses and returns a successful JSON body", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ id: "abc", name: "Test" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
    );

    const schema = z.object({ id: z.string(), name: z.string() });
    const result = await apiFetch("/things/abc", {
      schema,
      baseUrl: SAMPLE_BASE,
    });
    expect(result).toEqual({ id: "abc", name: "Test" });
  });

  it("throws ApiValidationError on schema drift", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ id: 123 }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
    );

    const schema = z.object({ id: z.string() });
    await expect(
      apiFetch("/things/abc", { schema, baseUrl: SAMPLE_BASE })
    ).rejects.toBeInstanceOf(ApiValidationError);
  });

  it("returns the list fallback on 404 when tolerateMissing is true", async () => {
    mockFetch(async () => new Response("", { status: 404 }));

    const schema = z.array(z.object({ id: z.string() }));
    const result = await apiFetch("/things", {
      schema,
      baseUrl: SAMPLE_BASE,
      tolerateMissing: true,
      fallback: [],
    });
    expect(result).toEqual([]);
  });

  it("returns the null fallback on 5xx when tolerateMissing is true", async () => {
    mockFetch(async () => new Response("Server boom", { status: 500 }));

    const schema = z.object({ id: z.string() }).nullable();
    const result = await apiFetch("/things/abc", {
      schema,
      baseUrl: SAMPLE_BASE,
      tolerateMissing: true,
      fallback: null,
    });
    expect(result).toBeNull();
  });

  it("returns the fallback when the response is not valid JSON and tolerateMissing is true", async () => {
    mockFetch(
      async () =>
        new Response("<html>oops</html>", {
          status: 200,
          headers: { "content-type": "text/html" },
        })
    );

    const schema = z.array(z.unknown());
    const result = await apiFetch("/things", {
      schema,
      baseUrl: SAMPLE_BASE,
      tolerateMissing: true,
      fallback: [],
    });
    expect(result).toEqual([]);
  });

  it("returns the fallback on a network error when tolerateMissing is true", async () => {
    mockFetch(async () => {
      throw new TypeError("network down");
    });

    const schema = z.array(z.unknown());
    const result = await apiFetch("/things", {
      schema,
      baseUrl: SAMPLE_BASE,
      tolerateMissing: true,
      fallback: [],
    });
    expect(result).toEqual([]);
  });

  it("throws ApiError on 5xx when tolerateMissing is false", async () => {
    mockFetch(async () => new Response("nope", { status: 500 }));

    const schema = z.object({ id: z.string() });
    await expect(
      apiFetch("/things/abc", { schema, baseUrl: SAMPLE_BASE })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("requires a fallback when tolerateMissing is true", async () => {
    const schema = z.array(z.unknown());
    await expect(
      apiFetch("/things", {
        schema,
        baseUrl: SAMPLE_BASE,
        tolerateMissing: true,
      })
    ).rejects.toThrow(/fallback/);
  });

  it("supports absolute URLs as the path argument", async () => {
    const calls: string[] = [];
    mockFetch(async (input) => {
      calls.push(typeof input === "string" ? input : input.toString());
      return new Response("[]", {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const schema = z.array(z.unknown());
    await apiFetch("https://other.example/api/things", { schema });
    expect(calls[0]).toBe("https://other.example/api/things");
  });

  it("aborts a request after the configured timeout", async () => {
    vi.useFakeTimers();
    mockFetch(
      async (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        })
    );

    const request = apiFetch("/things", {
      schema: z.array(z.unknown()),
      baseUrl: SAMPLE_BASE,
      timeoutMs: 25,
    });
    const rejection = expect(request).rejects.toMatchObject({
      name: "AbortError",
    });

    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    vi.useRealTimers();
  });

  it("returns the fallback when a tolerated request times out", async () => {
    vi.useFakeTimers();
    mockFetch(
      async (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        })
    );

    const request = apiFetch("/things", {
      schema: z.array(z.unknown()),
      baseUrl: SAMPLE_BASE,
      tolerateMissing: true,
      fallback: [],
      timeoutMs: 25,
    });
    await vi.advanceTimersByTimeAsync(25);

    await expect(request).resolves.toEqual([]);
    vi.useRealTimers();
  });

  it("rejects invalid timeout values before fetching", async () => {
    await expect(
      apiFetch("/things", {
        schema: z.array(z.unknown()),
        baseUrl: SAMPLE_BASE,
        timeoutMs: 0,
      })
    ).rejects.toThrow(/positive number/);
  });

  it("rejects responses larger than the configured byte limit", async () => {
    mockFetch(async () => new Response(JSON.stringify({ value: "too long" })));

    await expect(
      apiFetch("/things", {
        schema: z.object({ value: z.string() }),
        baseUrl: SAMPLE_BASE,
        maxResponseBytes: 10,
      })
    ).rejects.toBeInstanceOf(ApiResponseSizeError);
  });

  it("uses the fallback when a tolerated response exceeds the byte limit", async () => {
    mockFetch(async () => new Response(JSON.stringify(["too long"])));

    await expect(
      apiFetch("/things", {
        schema: z.array(z.string()),
        baseUrl: SAMPLE_BASE,
        tolerateMissing: true,
        fallback: [],
        maxResponseBytes: 5,
      })
    ).resolves.toEqual([]);
  });
});
