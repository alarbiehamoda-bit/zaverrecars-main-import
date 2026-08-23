import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./ThemeConsistency.css", import.meta.url), "utf8");

describe("theme consistency", () => {
  it("keeps light mode as a warm parchment inversion rather than a cool-blue alternate interface", () => {
    expect(styles).toContain("#f8f2e7");
    expect(styles).toContain("#ebdfca");
    expect(styles).toContain("#f5eddf");
    expect(styles).toContain("#root .zaverre-day");
  });

  it("protects small-screen section content from the fixed contact rail", () => {
    expect(styles).toContain("@media (max-width: 620px)");
    expect(styles).toContain("#root .floating-contact-rail { display: none !important; }");
  });
});
