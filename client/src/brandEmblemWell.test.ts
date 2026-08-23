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
});
