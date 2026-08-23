import { describe, expect, it } from "vitest";
import { serializePublicBuildEnv } from "@/scripts/write-amplify-env";

describe("serializePublicBuildEnv", () => {
  it("writes only allowlisted public values", () => {
    const output = serializePublicBuildEnv({
      CURRENT_EDITION: "2026",
      NEXT_PUBLIC_SITE_URL: "https://example.test",
      NEXT_PUBLIC_SESSIONIZE_BASE_URL: "https://sessionize.example/api/v2",
      AWS_SECRET_ACCESS_KEY: "must-not-be-copied",
    });

    expect(output).toContain('CURRENT_EDITION="2026"');
    expect(output).toContain('NEXT_PUBLIC_SITE_URL="https://example.test"');
    expect(output).toContain("NEXT_PUBLIC_SESSIONIZE_BASE_URL");
    expect(output).not.toContain("AWS_SECRET_ACCESS_KEY");
    expect(output).not.toContain("must-not-be-copied");
  });

  it("fails with variable names only when required values are absent", () => {
    expect(() => serializePublicBuildEnv({})).toThrow(
      /CURRENT_EDITION, NEXT_PUBLIC_SITE_URL/
    );
  });

  it("rejects line breaks without echoing the value", () => {
    expect(() =>
      serializePublicBuildEnv({
        CURRENT_EDITION: "2026\ninjected=true",
        NEXT_PUBLIC_SITE_URL: "https://example.test",
      })
    ).toThrow(/CURRENT_EDITION contains a line break/);
  });
});
