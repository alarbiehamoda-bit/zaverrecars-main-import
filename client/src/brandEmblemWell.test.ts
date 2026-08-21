import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

describe("shared brand emblem well", () => {
  it("marks every rendered marque context with the same reusable holder class", () => {
    expect(read("client/src/components/VehicleSystem.tsx")).toContain("brand-emblem-well--catalogue");
    expect(read("client/src/components/VehicleSystem.tsx")).toContain("brand-emblem-well--filter");
    expect(read("client/src/pages/FleetBrowse.tsx")).toContain("brand-emblem-well--hero");
    expect(read("client/src/pages/AdminVehicles.tsx")).toContain("brand-card-logo");
    expect(read("client/src/pages/AdminVehicles.tsx")).toContain("brand-logo-preview");
  });

  it("defines a single olive well with an inset border and protected light-mark contrast in both themes", () => {
    const styles = read("client/src/vehicle-glass.css");
    expect(styles).toContain("Unified marque well");
    expect(styles).toContain(".brand-emblem-well");
    expect(styles).toContain(".brand-card-logo");
    expect(styles).toContain(".brand-logo-preview");
    expect(styles).toContain("#d6d6a8");
    expect(styles).toContain("Final theme lock");
    expect(styles).toContain("#deddb2");
    expect(styles).toContain("html:not([data-theme=\"light\"]) :is(.brand-emblem-well");
    expect(styles).toContain(".brand-mark--high-contrast");
  });
});
