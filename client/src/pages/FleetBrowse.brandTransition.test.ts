import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(new URL("./FleetBrowse.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../vehicle-glass.css", import.meta.url), "utf8");

describe("fleet brand transition", () => {
  it("remounts the vehicle collection when the active brand changes so the transition can run", () => {
    expect(pageSource).toContain("const collectionTransitionKey");
    expect(pageSource).toContain('key={collectionTransitionKey}');
    expect(pageSource).toContain('className="fleet-collection-transition"');
  });

  it("uses a short transform-and-opacity transition while respecting reduced motion", () => {
    expect(styles).toContain("prefers-reduced-motion: no-preference");
    expect(styles).toContain("fleet-brand-transition");
    expect(styles).toContain("opacity: 0");
    expect(styles).toContain("translateY(10px)");
  });
});
