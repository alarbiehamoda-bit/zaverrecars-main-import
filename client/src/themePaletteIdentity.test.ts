import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./ThemeConsistency.css", import.meta.url), "utf8");

describe("theme palette identity", () => {
  it("uses a dark-to-light blue system in light mode", () => {
    expect(styles).toContain("#e9f8ff");
    expect(styles).toContain("#91cef0");
    expect(styles).toContain("#174a70");
    expect(styles).toContain("#0a2e4a");
  });

  it("uses a brown-and-beige system in dark mode", () => {
    expect(styles).toContain("#211511");
    expect(styles).toContain("#67432f");
    expect(styles).toContain("#c7a583");
    expect(styles).toContain("#6f4933");
  });
});

