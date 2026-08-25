import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./ThemeConsistency.css", import.meta.url), "utf8");

describe("theme consistency", () => {
  it("keeps light mode on the requested dark-to-light blue identity", () => {
    expect(styles).toContain("#e9f8ff");
    expect(styles).toContain("#91cef0");
    expect(styles).toContain("#174a70");
    expect(styles).toContain("#root .zaverre-day");
  });

  it("keeps the floating contact rail available on small screens", () => {
    expect(styles).toContain("@media (max-width: 620px)");
    expect(styles).toContain("#root .floating-contact-rail { bottom: 14px; display: grid !important; right: 12px; }");
  });
});
