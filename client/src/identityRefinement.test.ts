import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./IdentityRefinement.css", import.meta.url), "utf8");

describe("identity refinement", () => {
  it("uses black, brown, beige, and gold in dark mode without the blue neon lockup", () => {
    expect(styles).toContain("--zvr-ink: #090807");
    expect(styles).toContain("--zvr-brown: #2d1b13");
    expect(styles).toContain("--zvr-beige: #e7d1b2");
    expect(styles).toContain("--zvr-gold: #d2a85a");
    expect(styles).toContain("content: none !important");
  });

  it("keeps the lockup and catalogue action hierarchy consistent", () => {
    expect(styles).toContain(".brand-lockup > .brand-mark");
    expect(styles).toContain(".brand-filter-all-button");
    expect(styles).toContain(".brand-filter-all-button");
    expect(styles).toContain(".vehicle-card .card-rate");
    expect(styles).toContain("#root .floating-contact-rail--home");
    expect(styles).toContain("bottom: 76px");
    expect(styles).toContain(".hero-copy h1 em");
    expect(styles).toContain("#root .hero-cinematic .hero-copy > .section-kicker span");
  });
});
