import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./index.css", import.meta.url), "utf8");
const identityStyles = readFileSync(new URL("./IdentityRefinement.css", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("./pages/Home.tsx", import.meta.url), "utf8");
const menuSource = readFileSync(new URL("./components/PublicMobileMenu.tsx", import.meta.url), "utf8");

describe("mobile menu button theme", () => {
  it("uses blue for the three-line menu icon in the light theme while preserving the dark default", () => {
    expect(styles).toContain(".menu-button { background: transparent; border: 0; color: #f7f1e5");
    expect(styles).toContain(".zaverre-day .menu-button { color: #075b9a; }");
  });

  it("includes a direct Home action inside the three-line mobile menu", () => {
    expect(menuSource).toContain('onClick={() => goHome()}>Home<ChevronRight size={18} /></button>');
    expect(menuSource).toContain('className="mobile-menu public-mobile-menu"');
  });

  it("places the three-line menu directly beside the theme control", () => {
    expect(menuSource.indexOf("<ThemeToggle />")).toBeLessThan(menuSource.indexOf('className="menu-button"'));
    expect(homeSource.indexOf("<PublicMobileMenu")).toBeLessThan(homeSource.indexOf('className="header-book"'));
  });

  it("uses comfortable mobile touch targets and closes the menu before navigating to Fleet", () => {
    expect(identityStyles).toContain("min-height: 44px");
    expect(identityStyles).toContain("max-height: calc(100dvh - 76px)");
    expect(menuSource).toContain("const goFleet");
    expect(menuSource).toContain('navigate("/cars")');
  });
});
