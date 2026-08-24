import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("./components/VehicleSystem.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./ThemeConsistency.css", import.meta.url), "utf8");

describe("vehicle title contrast", () => {
  it("uses the shared title hook with a darker light-mode name and lighter dark-mode name", () => {
    expect(component).toContain('className="vehicle-card-title font-display"');
    expect(styles).toContain("#02070b");
    expect(styles).toContain("#fff3e3");
  });
});

