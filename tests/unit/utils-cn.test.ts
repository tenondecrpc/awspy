import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils/cn";

describe("cn", () => {
  it("joins truthy strings with spaces", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("ignores falsy values", () => {
    expect(cn("a", null, undefined, false, "b")).toBe("a b");
  });

  it("ignores empty strings", () => {
    expect(cn("a", "", "b")).toBe("a b");
  });

  it("flattens nested arrays", () => {
    expect(cn("a", ["b", ["c", null], "d"], false, "e")).toBe("a b c d e");
  });

  it("converts numbers to strings", () => {
    expect(cn("a", 0, 1, "b")).toBe("a 0 1 b");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(null, undefined, false, "")).toBe("");
  });
});
