import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("./VehicleSystem.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./VehicleSystem.css", import.meta.url), "utf8");
const mobileStyles = readFileSync(new URL("../mobile.css", import.meta.url), "utf8");
const glassStyles = readFileSync(new URL("../vehicle-glass.css", import.meta.url), "utf8");
const fleetBrowseStyles = readFileSync(new URL("../pages/FleetBrowse.css", import.meta.url), "utf8");
const brandConfig = readFileSync(new URL("../config/brand.ts", import.meta.url), "utf8");
const zaverreMark = readFileSync(new URL("./ZaverreMark.tsx", import.meta.url), "utf8");

describe("vehicle brand and image presentation", () => {
  it("uses a source for every catalogue marque that needs a visual mark", () => {
    expect(component).toContain('"Maserati": "/manus-storage/maserati-official_d4054f33.png"');
  });

  it("prioritizes the supplied official icon assets for every supported catalogue marque", () => {
    expect(component).toContain('"Ferrari": "/manus-storage/ferrari-seeklogo_a02187e7.png"');
    expect(component).toContain('"Audi": "/manus-storage/audi-official_e7f4fc02.webp"');
    expect(component).toContain('"Lamborghini": "/manus-storage/lamborghini-official_f1c7d272.png"');
    expect(component).toContain('"Bentley": "/manus-storage/bentley-official_175d4ef0.webp"');
    expect(component).toContain('"Brabus": "/manus-storage/brabus-seeklogo_b14da961.png"');
    expect(component).toContain('"Mansory": "/manus-storage/mansory-seeklogo_04657e8d.png"');
  });

  it("keeps vehicle photos uncropped and makes marque badges a prominent, consistent marque plate", () => {
    expect(styles).toContain("border-radius: 10px");
    expect(styles).toContain("border-radius: 12px");
    expect(styles).toContain("transform: none !important");
    expect(mobileStyles).toContain("aspect-ratio: 4 / 3 !important");
    expect(mobileStyles).toContain("object-fit: contain !important");
    expect(fleetBrowseStyles).toContain("border-radius: 22px");
    expect(fleetBrowseStyles).toContain("transform: none !important");
    expect(fleetBrowseStyles).toContain("mix-blend-mode: screen");
    expect(styles).toContain("mix-blend-mode: screen");
    expect(component).toContain('className="vehicle-brand-ribbon__seal brand-emblem-well brand-emblem-well--catalogue"');
    expect(component).toContain('className="vehicle-brand-ribbon__identity"');
    expect(styles).toContain("Elevated marque plate");
    expect(styles).toContain("filter: contrast(1.18) saturate(1.16)");
    expect(styles).toContain("height: 48px");
    expect(mobileStyles).toContain("flex-basis: 67px !important");
  });

  it("keeps the header ZAVERRE mark transparent and visually prominent", () => {
    expect(glassStyles).toContain(".brand-lockup .zaverre-mark.brand-mark");
    expect(glassStyles).toContain("flex: 0 0 62px");
    expect(glassStyles).toContain("background: transparent !important");
    expect(brandConfig).toContain("zaverre-mark-gold-transparent");
    expect(brandConfig).toContain("zaverre-mark-blue-transparent");
    expect(zaverreMark).toContain('theme === "light" ? brand.monogramBlue : brand.monogramGold');
    expect(mobileStyles).toContain("height: 48px !important");
    expect(mobileStyles).toContain("background: transparent !important");
  });

  it("gives marque plates a light-brown daylight backdrop and a warm beige dark-mode backdrop", () => {
    expect(styles).toContain('html:not([data-theme="light"]) .vehicle-brand-ribbon');
    expect(glassStyles).toContain("Marque plates");
    expect(glassStyles).toContain("#f4dfc5");
    expect(glassStyles).toContain("#fff0d8");
    expect(glassStyles).toContain("#372114");
    expect(glassStyles).toContain("#332116");
    expect(glassStyles).toContain('.brand-logo-rail :is(a, button)');
    expect(component).toContain('className={`brand-cards brand-logo-rail brand-filter-rail');
    expect(component).toContain('<a href={`/cars/${brandRouteSlug(brand.brandName)}`}');
    expect(styles).toContain("mix-blend-mode: normal");
  });

  it("keeps showroom filter links on a neutral glass surface with enlarged contained marks", () => {
    expect(glassStyles).toContain("Showroom navigation");
    expect(glassStyles).toContain(".fleet-browse-page .brand-logo-rail :is(a, button)");
    expect(glassStyles).toContain("rgba(255, 255, 255, .98)");
    expect(glassStyles).toContain("#fff0d8");
    expect(glassStyles).toContain("height: 52px");
    expect(glassStyles).toContain(".fleet-browse-toolbar .eyebrow");
    expect(glassStyles).toContain("#0b385a");
  });

  it("uses the same original marque source inside one contrast-safe icon well for both themes", () => {
    expect(component).toContain('className="brand-filter-icon-well brand-emblem-well brand-emblem-well--filter"');
    expect(component).toContain('<BrandMark brandName={brand.brandName} logoUrl={brand.logoUrl} className="brand-filter-mark" />');
    expect(glassStyles).toContain("One consistent icon well");
    expect(glassStyles).toContain("object-fit: contain");
    expect(glassStyles).toContain("background: transparent !important");
    expect(glassStyles).toContain("mix-blend-mode: normal !important");
    expect(glassStyles).toContain('html[data-theme="light"] .fleet-browse-page .brand-logo-rail .brand-filter-icon-well');
    expect(glassStyles).toContain('html:not([data-theme="light"]) .fleet-browse-page .brand-logo-rail .brand-filter-icon-well');
    expect(styles).toContain("luxury-car-brand-icon-backplate-flat_d566d058.png");
    expect(styles).toContain("Automotive icon language");
    expect(styles).toContain(".brand-emblem-well::after");
    expect(styles).toContain(".brand-emblem-well > .brand-filter-mark");
  });

  it("keeps every sensitive light or dark marque on the same protected filter source", () => {
    expect(component).toContain("const source = logoUrl || brandHeaderAssets[brandName]");
    for (const marque of ["Rolls-Royce", "Mercedes-Benz", "Bentley", "Aston Martin", "Audi", "Porsche", "Maserati", "Lamborghini"]) {
      expect(component).toContain(`\"${marque}\": \"/manus-storage/`);
    }
    expect(component).toContain("filterBrands.map((brand) => <a href={`/cars/${brandRouteSlug(brand.brandName)}`");
    expect(component).toContain("<span className=\"brand-filter-icon-well brand-emblem-well brand-emblem-well--filter\"><BrandMark brandName={brand.brandName}");
    expect(glassStyles).toContain(".brand-filter-icon-well .brand-filter-mark");
    expect(glassStyles).toContain("filter: contrast(1.12) saturate(1.08)");
    expect(component).toContain('"Rolls-Royce": "/manus-storage/rolls-royce-official_e602eacf.webp"');
    expect(component).toContain('"Maserati": "/manus-storage/maserati-official_d4054f33.png"');
    expect(component).toContain('"Mercedes-Benz": "/manus-storage/mercedes-benz-seeklogo_144df8a1.png"');
  });

  it("maps every branded filter through one icon-well and the same BrandMark source", () => {
    const requiredMarques = ["Lamborghini", "Maserati", "Ferrari", "McLaren", "Mercedes-Benz", "Porsche", "Rolls-Royce", "Range Rover", "Audi", "BMW", "Bentley", "Aston Martin", "Cadillac", "Brabus", "Mansory"];
    for (const marque of requiredMarques) {
      expect(component).toContain(`\"${marque}\": \"/manus-storage/`);
    }
    expect(component).toContain("const source = logoUrl || brandHeaderAssets[brandName]");
    expect(component).toContain('<span className="brand-filter-icon-well brand-emblem-well brand-emblem-well--filter"><BrandMark brandName={brand.brandName} logoUrl={brand.logoUrl} className="brand-filter-mark" /></span>');
    expect(glassStyles).toContain(".brand-filter-icon-well .brand-filter-mark");
    expect(glassStyles).toContain("object-fit: contain");
  });

  it("keeps marque icon changes centralized and reflected in filter cards, vehicle cards, and brand headers", () => {
    expect(component).toContain("Single editable source for each marque icon");
    expect(component).toContain("const source = logoUrl || brandHeaderAssets[brandName]");
    expect(component).toContain("useEffect(() => setAvailable(Boolean(source)), [source])");
    expect(component).toContain('<BrandMark brandName={vehicle.brand} logoUrl={vehicle.brandLogoUrl} className="vehicle-brand-ribbon-mark" />');
    expect(component).toContain('<BrandMark brandName={brand.brandName} logoUrl={brand.logoUrl} className="brand-filter-mark" />');
    expect(component).toContain('loading="lazy"');
    expect(glassStyles).toContain('object-fit: contain');
  });

  it("keeps wide and crest-shaped uploaded marks contained on the neutral marque well", () => {
    expect(component).not.toContain('  "Audi",\n  "Bentley"');
    expect(component).not.toContain('  "BMW",\n  "Maserati"');
    expect(glassStyles).toContain('.brand-mark--audi');
    expect(glassStyles).toContain('max-height: 54% !important');
    expect(glassStyles).toContain(':is(.brand-mark--bmw, .brand-mark--lamborghini)');
    expect(glassStyles).toContain('height: 76% !important');
    expect(component).toContain('const seekLogoCanvasBrands = new Set(["Ferrari", "Mercedes-Benz", "Aston Martin", "Brabus", "Mansory"])');
    expect(component).toContain('const sourceTreatmentClass = usesBuiltInSeekLogoCanvas ? "brand-mark--seeklogo-canvas" : ""');
    expect(styles).toContain('.brand-emblem-well .brand-mark--ferrari');
    expect(styles).toContain('.brand-mark--seeklogo-canvas');
    expect(styles).toContain('transform: scale(1.42) !important');
    expect(styles).toContain('transform: scale(1.55) !important');
    expect(glassStyles).toContain('.brand-mark--mercedes-benz, .brand-mark--aston-martin, .brand-mark--brabus, .brand-mark--mansory');
  });

  it("visually elevates the selected marque without changing its filter route", () => {
    expect(component).toContain('className={activeBrand === brand.brandName ? "active" : ""}');
    expect(component).toContain('aria-current={activeBrand === brand.brandName ? "page" : undefined}');
    expect(glassStyles).toContain(".brand-logo-rail :is(a, button).active");
    expect(glassStyles).toContain("#5bd0ff");
    expect(glassStyles).toContain(".brand-logo-rail :is(a, button).active::after");
  });

  it("uses Brand Cards semantics and the requested brown, beige, and light-olive card palette", () => {
    expect(component).toContain('aria-label="Brand Cards"');
    expect(glassStyles).toContain("Brand Cards palette");
    expect(glassStyles).toContain("#8d654e");
    expect(glassStyles).toContain("#f3e2c4");
    expect(glassStyles).toContain("#d6d6a8");
  });

  it("anchors the header lockup with neon", () => {
    expect(glassStyles).toContain("A fine neon baseline");
    expect(glassStyles).toContain("#48c8ff");
    expect(glassStyles).toContain("width: 100%");
  });
});
