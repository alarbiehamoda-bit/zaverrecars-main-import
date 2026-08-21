import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("./components/VehicleSystem.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./vehicle-glass.css", import.meta.url), "utf8");

describe("light marque contrast", () => {
  it("marks white and light brand artwork for a local contrast treatment", () => {
    expect(component).toContain("highContrastMarkBrands");
    expect(component).toContain('"Aston Martin"');
    expect(component).toContain('"Audi"');
    expect(component).toContain('"BMW"');
    expect(component).toContain("brand-mark--high-contrast");
  });

  it("adds a dark inset plate only inside the brand-card contexts", () => {
    expect(styles).toContain("Light mark contrast plate");
    expect(styles).toContain(".brand-filter-icon-well");
    expect(styles).toContain(".brand-card-identifier");
    expect(styles).toContain(".vehicle-brand-ribbon__seal");
    expect(styles).toContain("rgba(26, 47, 38, .98)");
  });
});
