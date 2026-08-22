import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

describe("shared brand emblem well", () => {
  it("marks every rendered marque context with the same reusable holder class", () => {
    expect(read("client/src/components/VehicleSystem.tsx")).toContain("brand-emblem-well--catalogue");
    expect(read("client/src/components/VehicleSystem.tsx")).toContain("brand-filter-card-icon");
    expect(read("client/src/pages/FleetBrowse.tsx")).toContain("brand-emblem-well--hero");
    expect(read("client/src/pages/AdminVehicles.tsx")).toContain("brand-card-logo");
    expect(read("client/src/pages/AdminVehicles.tsx")).toContain("brand-logo-preview");
  });

  it("defines one circular stone-and-metal well with protected contrast in both themes", () => {
    const styles = read("client/src/vehicle-glass.css");
    const brandCardStyles = read("client/src/components/BrandCards.css");
    expect(styles).toContain("Unified marque well");
    expect(styles).toContain(".brand-emblem-well");
    expect(styles).toContain(".brand-card-logo");
    expect(styles).toContain(".brand-logo-preview");
    expect(styles).toContain("Circular marque icon");
    expect(styles).toContain("border-radius: 50% !important");
    expect(styles).toContain("aspect-ratio: 1");
    expect(styles).toContain("transform: scale(1.55) !important");
    expect(styles).toContain("transform: scale(2.2) !important");
    expect(styles).toContain("Final theme lock");
    expect(styles).toContain("#fdfaf1");
    expect(styles).toContain("html:not([data-theme=\"light\"]) :is(.brand-emblem-well");
    expect(styles).toContain(".brand-mark--high-contrast");
    expect(brandCardStyles).toContain("Independent filter icon primitive");
    expect(brandCardStyles).toContain(".brand-filter-card-icon");
    expect(brandCardStyles).toContain("#0b4f78");
  });
});
