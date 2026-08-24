import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./performancePresentation.css", import.meta.url), "utf8");

describe("performance presentation", () => {
  it("defers rendering only for below-the-fold content sections", () => {
    expect(styles).toContain("content-visibility: auto");
    expect(styles).toContain("contain-intrinsic-size: auto 860px");
    expect(styles).toContain(".featured-vehicles-section");
    expect(styles).not.toContain(".hero-section");
  });
});

