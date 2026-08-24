import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const section = readFileSync(new URL("./HomeExperienceSections.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("delivery presentation", () => {
  it("keeps the descriptive delivery text brown while preserving the delivery policy copy", () => {
    expect(section).toContain("ZAVERRE reviews the collection or delivery location");
    expect(section).toContain("Delivery arrangements and fees are confirmed by location");
    expect(styles).toContain(".delivery-intro > p:not(.eyebrow) { color: #7b552a;");
  });
});
