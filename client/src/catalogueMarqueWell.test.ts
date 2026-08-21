import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("./components/VehicleSystem.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./components/VehicleSystem.css", import.meta.url), "utf8");

describe("catalogue marque well", () => {
  it("uses one reusable Aston Martin-style seal for every vehicle card", () => {
    expect(component).toContain('className="vehicle-brand-ribbon__seal"');
    expect(component).toContain('<BrandMark brandName={vehicle.brand}');
    expect(styles).toContain("Catalogue marque well");
    expect(styles).toContain(".vehicle-card .vehicle-brand-ribbon__seal");
  });

  it("keeps separate well surfaces for dark and light catalogue cards", () => {
    expect(styles).toContain("--catalogue-marque-well-background");
    expect(styles).toContain('html[data-theme="light"] .vehicle-card');
    expect(styles).toContain("#e8eef0");
    expect(styles).toContain("rgba(67,57,42,.94)");
  });
});
