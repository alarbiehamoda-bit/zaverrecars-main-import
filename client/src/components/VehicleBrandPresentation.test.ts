import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("./VehicleSystem.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./VehicleSystem.css", import.meta.url), "utf8");
const filterStyles = readFileSync(new URL("./BrandCards.css", import.meta.url), "utf8");
const brandSystemStyles = readFileSync(new URL("./BrandSystem.css", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");

const marques = ["Lamborghini", "Maserati", "Ferrari", "McLaren", "Mercedes-Benz", "Porsche", "Rolls-Royce", "Range Rover", "Audi", "BMW", "Bentley", "Aston Martin", "Cadillac", "Brabus", "Mansory"];

describe("brand presentation system", () => {
  it("keeps one verified source mapping and one optical-fit profile for all catalogue marques", () => {
    expect(component).toContain("export const brandHeaderAssets");
    expect(component).toContain("export const brandLogoFits");
    for (const marque of marques) {
      expect(component).toContain(`"${marque}": "/manus-storage/`);
    }
    expect(component).toContain('"Range Rover": "/manus-storage/land-rover-logo-2021_0484ad78.png"');
    expect(component).toContain("const source = brandHeaderAssets[brandName] || logoUrl");
    expect(component).not.toContain("brandFilterAssets");
  });

  it("renders every context through BrandMark without stretching or per-context source overrides", () => {
    expect(component).toContain('className="vehicle-brand-ribbon__seal brand-emblem-well brand-emblem-well--catalogue"');
    expect(component).toContain('className="brand-filter-card-icon brand-emblem-well brand-emblem-well--filter"');
    expect(component).toContain('<BrandMark brandName={displayedBrand} logoUrl={displayedBrandLogo} className="vehicle-brand-ribbon-mark" />');
    expect(component).not.toContain("sourceOverride");
    expect(styles).toContain("object-fit: contain");
    expect(styles).toContain("object-position: center");
    expect(styles).not.toContain("clip-path");
  });

  it("defines one proportional circular emblem well with deliberate fits for wide, round, crest, and tall assets", () => {
    expect(styles).toContain(".brand-emblem-well {");
    expect(styles).toContain("border-radius: 50%");
    expect(styles).toContain(".brand-mark--fit-wide");
    expect(styles).toContain(".brand-mark--fit-round");
    expect(styles).toContain(".brand-mark--fit-crest");
    expect(styles).toContain(".brand-mark--fit-tall");
    expect(styles).toContain(".brand-mark--brabus { filter: brightness(0)");
  });

  it("keeps the same warm emblem material readable in both themes and separate from card layouts", () => {
    expect(styles).toContain("--brand-well-light");
    expect(styles).toContain("--brand-well-dark");
    expect(styles).toContain('html[data-theme="light"] .brand-emblem-well');
    expect(styles).toContain(".vehicle-brand-ribbon__seal.brand-emblem-well--catalogue");
    expect(filterStyles).toContain(".brand-cards.brand-logo-rail > a {");
    expect(filterStyles).toContain("background: transparent");
  });

  it("keeps the marquee touch-friendly, focusable, and operable after a drag gesture", () => {
    expect(filterStyles).toContain("touch-action: manipulation");
    expect(filterStyles).toContain("scroll-snap-type: x proximity");
    expect(filterStyles).toContain(":focus-visible");
    expect(component).toContain("window.setTimeout(() => { dragRef.current.moved = false; }, 0)");
    expect(component).toContain('aria-label="Brand Cards"');
  });

  it("uses larger but contained marque wells and readable labels in the brand cards", () => {
    expect(filterStyles).toContain("flex: 0 0 86px");
    expect(filterStyles).toContain("grid-template-rows: 64px");
    expect(filterStyles).toContain("font-size: 8px");
    expect(brandSystemStyles).toContain("height: 64px");
    expect(brandSystemStyles).toContain("max-width: 84%");
  });

  it("prioritizes visible and requested catalogue logos while leaving the remaining marks lazy", () => {
    expect(component).toContain('loading={priority ? "eager" : "lazy"}');
    expect(component).toContain('fetchPriority={priority ? "high" : "auto"}');
    expect(component).toContain("prioritizeVisibleLogos && index < 5");
    expect(component).toContain('const priorityBrandMarks = new Set(["Aston Martin", "Bentley", "Brabus", "Rolls-Royce"])');
    expect(brandSystemStyles).toContain(".brand-mark--aston-martin");
    expect(brandSystemStyles).toContain(".brand-mark--bentley");
    expect(brandSystemStyles).toContain(".brand-mark--brabus");
    expect(brandSystemStyles).toContain(".brand-mark--rolls-royce");
    expect(brandSystemStyles).toContain(".fleet-browse-brand-logo.brand-emblem-well > .brand-mark--aston-martin");
    expect(homeSource).toContain("prioritizeVisibleLogos");
  });
});
