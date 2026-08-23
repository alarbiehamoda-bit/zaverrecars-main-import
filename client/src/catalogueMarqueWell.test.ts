import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("./components/VehicleSystem.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./components/VehicleSystem.css", import.meta.url), "utf8");

describe("catalogue marque well", () => {
  it("uses the shared emblem well and BrandMark for every vehicle card", () => {
    expect(component).toContain('className="vehicle-brand-ribbon__seal brand-emblem-well brand-emblem-well--catalogue"');
    expect(component).toContain('<BrandMark brandName={displayedBrand} logoUrl={displayedBrandLogo} className="vehicle-brand-ribbon-mark" />');
    expect(component).toContain('const displayedBrand = brandBadge?.brandName || vehicle.brand');
  });

  it("sizes catalogue seals through the shared system rather than a parallel surface", () => {
    expect(styles).toContain(".vehicle-brand-ribbon__seal.brand-emblem-well--catalogue");
    expect(styles).toContain(".brand-emblem-well > .brand-mark--fit-wide");
    expect(styles).toContain(".brand-emblem-well > .brand-mark--fit-crest");
  });
});
