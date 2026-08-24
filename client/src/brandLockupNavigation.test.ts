import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync(new URL("./pages/Home.tsx", import.meta.url), "utf8");
const fleet = readFileSync(new URL("./pages/FleetBrowse.tsx", import.meta.url), "utf8");
const detail = readFileSync(new URL("./pages/VehicleDetail.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./vehicle-glass.css", import.meta.url), "utf8");

describe("public brand lockups", () => {
  it("remain visual identity only, leaving navigation to explicit controls", () => {
    for (const source of [home, fleet, detail]) {
      expect(source).toContain('<div className="brand-lockup" aria-label="ZAVERRE">');
      expect(source).not.toContain('className="brand-lockup" onClick=');
    }
    expect(styles).toContain(".brand-lockup { pointer-events: none;");
  });
});
