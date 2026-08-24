import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./performancePresentation.css", import.meta.url), "utf8");

describe("performance presentation", () => {
  it("keeps public sections fully resolved instead of using placeholder layout during first paint", () => {
    expect(styles).toContain("content-visibility: visible");
    expect(styles).toContain("contain: none");
    expect(styles).toContain(".featured-vehicles-section");
    expect(styles).not.toContain(".hero-section");
  });
});
