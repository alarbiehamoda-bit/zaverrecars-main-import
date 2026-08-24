import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

describe("shared brand emblem well", () => {
  it("marks filter, catalogue, and brand-header contexts with the reusable holder", () => {
    const component = read("client/src/components/VehicleSystem.tsx");
    const fleet = read("client/src/pages/FleetBrowse.tsx");
    expect(component).toContain("brand-emblem-well--catalogue");
    expect(component).toContain("brand-emblem-well--filter");
    expect(fleet).toContain("brand-emblem-well--hero");
  });

  it("uses proportional containment and the same two theme materials without legacy cropping", () => {
    const styles = read("client/src/components/VehicleSystem.css");
    expect(styles).toContain(".brand-emblem-well {");
    expect(styles).toContain("aspect-ratio: 1");
    expect(styles).toContain("object-fit: contain");
    expect(styles).toContain("--brand-well-light");
    expect(styles).toContain("--brand-well-dark");
    expect(styles).not.toContain("clip-path");
  });

  it("keeps the enlarged glass-blue system and Land Rover correction inside the shared holder", () => {
    const system = read("client/src/components/BrandSystem.css");
    const rail = read("client/src/components/BrandCards.css");
    expect(system).toContain("rgba(191,239,255,.62)");
    expect(system).toContain("brand-mark--range-rover");
    expect(system).toContain("transform: scale(1.16)");
    expect(system).toContain("object-fit: contain");
    expect(rail).toContain("grid-template-rows: 60px");
    expect(rail).toContain("grid-template-rows: 62px");
  });
});
