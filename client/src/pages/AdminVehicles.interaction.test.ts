import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const studio = readFileSync(new URL("./AdminVehicles.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../components/AdminZaverreShell.css", import.meta.url), "utf8");

describe("admin interaction resilience", () => {
  it("keeps the administration shell opaque and pointer-enabled", () => {
    expect(css).toContain("opacity: 1 !important");
    expect(css).toContain("pointer-events: auto");
    expect(css).toContain("z-index: 60");
  });

  it("exposes the approval-first assistant actions inside the vehicle studio", () => {
    expect(studio).toContain("adminAssistant.draft.useMutation");
    expect(studio).toContain("CREATE PROPOSAL");
    expect(studio).toContain("ADMIN REVIEW REQUIRED");
  });
});
