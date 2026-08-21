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

  it("balances catalogue card seals with the Brand Cards icon holder in both themes", () => {
    expect(styles).toContain("--catalogue-marque-well-background");
    expect(styles).toContain("#d6d6a8");
    expect(styles).toContain("#aeb47b");
    expect(styles).toContain("rgba(67, 75, 41, .56)");
  });
});
