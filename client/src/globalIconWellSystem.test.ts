import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("global icon-well system", () => {
  it("shares the olive icon surface across the recurring showroom components", () => {
    const tokens = read("./global-icon-wells.css");
    const index = read("./index.css");
    const glass = read("./vehicle-glass.css");

    expect(index).toContain('@import "./global-icon-wells.css"');
    expect(tokens).toContain("--zvr-icon-well-bg");
    expect(tokens).toContain(".brand-card-identifier");
    expect(tokens).toContain(".card-spec-item svg");
    expect(tokens).toContain(".detail-spec-grid--iconic > div > svg");
    expect(glass).toContain(".fleet-category-icon-well");
    expect(glass).toContain("var(--zvr-icon-well-bg)");
  });

  it("keeps the shared icon well responsive for vehicle details", () => {
    const tokens = read("./global-icon-wells.css");

    expect(tokens).toContain("@media (max-width: 760px)");
    expect(tokens).toContain("height: 29px");
    expect(tokens).toContain("width: 29px");
  });
});
