import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./index.css", import.meta.url), "utf8");
const identityStyles = readFileSync(new URL("./IdentityRefinement.css", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("./pages/Home.tsx", import.meta.url), "utf8");

describe("mobile menu button theme", () => {
  it("uses blue for the three-line menu icon in the light theme while preserving the dark default", () => {
    expect(styles).toContain(".menu-button { background: transparent; border: 0; color: #f7f1e5");
    expect(styles).toContain(".zaverre-day .menu-button { color: #075b9a; }");
  });

  it("includes a direct Home action inside the three-line mobile menu", () => {
    expect(homeSource).toContain('<button onClick={() => scrollTo("top")}>Home<ChevronRight size={18} /></button>');
    expect(homeSource).toContain('className="mobile-menu"');
  });

  it("places the three-line menu directly beside the theme control", () => {
    expect(homeSource.indexOf("<ThemeToggle />")).toBeLessThan(homeSource.indexOf('className="menu-button"'));
    expect(homeSource.indexOf('className="menu-button"')).toBeLessThan(homeSource.indexOf('className="header-book"'));
  });

  it("uses comfortable mobile touch targets and closes the menu before navigating to Fleet", () => {
    expect(identityStyles).toContain("min-height: 44px");
    expect(identityStyles).toContain("max-height: calc(100dvh - 76px)");
    expect(homeSource).toContain("const navigateToFleet");
    expect(homeSource).toContain("setMenuOpen(false)");
  });
});
