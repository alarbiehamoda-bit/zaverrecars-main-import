import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./vehicle-glass.css", import.meta.url), "utf8");

describe("catalogue card sizing", () => {
  it("uses a consistent footprint for homepage and fleet catalogue cards", () => {
    expect(styles).toContain("Catalogue card rhythm");
    expect(styles).toContain(".featured-vehicle-card");
    expect(styles).toContain(".master-vehicle-grid--vertical");
    expect(styles).toContain("height: 620px !important");
    expect(styles).toContain("height: 590px !important");
  });

  it("removes the visual AED caption beneath the dirham symbol while keeping compact icon spacing", () => {
    expect(styles).toContain(".vehicle-card .card-rate__currency");
    expect(styles).toContain("flex-basis: 28px");
    expect(styles).toContain("flex-basis: 24px");
  });
});
