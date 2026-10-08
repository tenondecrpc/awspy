import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { KeynotesListSchema, getKeynotes } from "@/lib/content/keynotes";

const VALID = {
  id: "ada-lovelace",
  name: "Ada Lovelace",
  role: "Head of Analytical Engines",
  organization: "Demo Cloud",
  photo: "/assets/keynotes/ada-lovelace.jpg",
};

describe("KeynotesListSchema", () => {
  it("accepts a keynote with a repo photo", () => {
    expect(KeynotesListSchema.safeParse([VALID]).success).toBe(true);
  });

  it("rejects a photo outside /assets/keynotes/", () => {
    const result = KeynotesListSchema.safeParse([
      { ...VALID, photo: "/team/ada-lovelace.jpg" },
    ]);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/\/assets\/keynotes\//);
  });

  it("rejects a remote photo URL", () => {
    const result = KeynotesListSchema.safeParse([
      { ...VALID, photo: "https://cdn.sessionize.com/image/ada.jpg" },
    ]);
    expect(result.success).toBe(false);
  });

  it("rejects a LinkedIn link, which only Sessionize may provide", () => {
    const result = KeynotesListSchema.safeParse([
      { ...VALID, linkedin: "https://www.linkedin.com/in/ada" },
    ]);
    expect(result.success).toBe(false);
  });

  it("rejects a duplicated id", () => {
    const result = KeynotesListSchema.safeParse([VALID, VALID]);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/is duplicated/);
  });

  it("rejects an empty role", () => {
    const result = KeynotesListSchema.safeParse([{ ...VALID, role: "" }]);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual([0, "role"]);
  });
});

describe("getKeynotes", () => {
  it("loads the two confirmed 2026 keynotes in order", () => {
    const keynotes = getKeynotes("2026");
    expect(keynotes.map((k) => [k.name, k.organization])).toEqual([
      ["Nelly Andrade", "Amazon Web Services"],
      ["Cristian Yegros", "Servicio Nacional de Promoción Profesional"],
    ]);
  });

  it("points every 2026 photo at a file that ships in public/", () => {
    for (const k of getKeynotes("2026")) {
      expect(existsSync(join(process.cwd(), "public", k.photo))).toBe(true);
    }
  });

  it("returns an empty list for an edition with no keynotes", () => {
    expect(getKeynotes("1999")).toEqual([]);
  });
});
