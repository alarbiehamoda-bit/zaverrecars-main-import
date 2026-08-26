import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./IdentityRefinement.css", import.meta.url), "utf8");
const completionStyles = readFileSync(new URL("./DesignCompletion.css", import.meta.url), "utf8");

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
    expect(styles).not.toContain("floating-contact-rail--home > :not");
    expect(styles).toContain(".hero-copy h1 em");
    expect(styles).toContain("#root .hero-cinematic .hero-copy > .section-kicker span");
    expect(styles).toContain("#root .brand-emblem-well");
    expect(styles).toContain("#root .vehicle-brand-ribbon");
    expect(styles).toContain("-webkit-line-clamp: 2");
    expect(styles).toContain("#d9f4ff");
    expect(styles).toContain("#392215");
    expect(styles).toContain("#f4dfbd");
    expect(styles).toContain("min-height: 44px");
    expect(styles).toContain(".delivery-section");
    expect(styles).toContain("#f8e6c9");
    expect(styles).toContain("CONSIDERED ARRIVAL stays legible");
    expect(styles).toContain("#4a2818");
    expect(styles).toContain("brand-mark--fit-standard");
    expect(styles).toContain("#fff3d8");
    expect(styles).toContain("#e7f8ff");
    expect(styles).toContain("#63c9f4");
    expect(styles).toContain(".hero-cinematic .hero-copy > .hero-brand");
    expect(styles).toContain("#0a9fd8");
    expect(styles).toContain("drop-shadow(0 0 6px rgba(10,200,255,.62))");
    expect(styles).toContain(".site-footer .footer-brand > .footer-brand__mark");
    expect(styles).toContain("height: 32px");
    expect(styles).toContain("min-height: 580px");
    expect(styles).toContain("overflow: visible");
    expect(styles).toContain("flex: 0 0 44px");
    expect(styles).toContain("height: 154px");
    expect(styles).toContain("height: 138px");
    expect(styles).toContain("overflow-y: auto !important");
    expect(styles).toContain("overscroll-behavior-y: auto");
    expect(styles).toContain("#root > main { touch-action: pan-y; }");
    expect(styles).toContain("grid-template-columns: 52px minmax(0, 1fr) 52px");
    expect(styles).toContain(".vehicle-brand-ribbon::after { height: 52px");
    expect(styles).toContain("Interaction polish: responsive depth");
    expect(styles).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toContain(".vehicle-card:hover { transform: translateY(-4px)");
    expect(styles).toContain(".home-video-feature:hover { transform: translateY(-3px)");
    expect(completionStyles).toContain("Final public composition");
    expect(completionStyles).toContain(".fleet-browse-content::before");
    expect(completionStyles).toContain(".journal-article-body aside");
  });
});
