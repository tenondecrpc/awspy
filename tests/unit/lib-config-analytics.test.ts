import { afterEach, describe, expect, it } from "vitest";
import { getGaMeasurementId } from "@/lib/config/analytics";

const ORIGINAL_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

afterEach(() => {
  if (ORIGINAL_ID === undefined)
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  else process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = ORIGINAL_ID;
});

describe("getGaMeasurementId", () => {
  it("disables analytics when the variable is unset or blank", () => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    expect(getGaMeasurementId()).toBeNull();

    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "  ";
    expect(getGaMeasurementId()).toBeNull();
  });

  it("returns a well-formed GA4 measurement ID", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = " G-AB12CD34EF ";
    expect(getGaMeasurementId()).toBe("G-AB12CD34EF");
  });

  it.each([
    "UA-12345-1",
    "GTM-ABC123",
    "g-ab12cd34ef",
    'G-ABC");alert(1);//',
    "G-ABC</script>",
  ])("fails the build on a malformed ID without echoing it: %s", (value) => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = value;
    expect(() => getGaMeasurementId()).toThrow(
      /^NEXT_PUBLIC_GA_MEASUREMENT_ID must be a GA4 measurement ID/
    );
    try {
      getGaMeasurementId();
    } catch (error) {
      expect((error as Error).message).not.toContain(value);
    }
  });
});
