import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// React Testing Library should auto-cleanup, but with the current Vitest +
// RTL combination we observed leaked DOM between component tests. Calling
// cleanup() explicitly removes that risk.
afterEach(() => {
  cleanup();
});
