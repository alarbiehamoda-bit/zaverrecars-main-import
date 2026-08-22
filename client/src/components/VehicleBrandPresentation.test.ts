import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("./VehicleSystem.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./VehicleSystem.css", import.meta.url), "utf8");
const rebuiltCardStyles = readFileSync(new URL("./BrandCards.css", import.meta.url), "utf8");
const mobileStyles = readFileSync(new URL("../mobile.css", import.meta.url), "utf8");
const glassStyles = readFileSync(new URL("../vehicle-glass.css", import.meta.url), "utf8");
const fleetBrowseStyles = readFileSync(new URL("../pages/FleetBrowse.css", import.meta.url), "utf8");
const brandConfig = readFileSync(new URL("../config/brand.ts", import.meta.url), "utf8");
const zaverreMark = readFileSync(new URL("./ZaverreMark.tsx", import.meta.url), "utf8");

describe("vehicle brand and image presentation", () => {
  it("uses a source for every catalogue marque that needs a visual mark", () => {
    expect(component).toContain('"Maserati": "/manus-storage/maserati_63a12301.webp"');
  });

  it("prioritizes the supplied official icon assets for every supported catalogue marque", () => {
    expect(component).toContain('"Ferrari": "/manus-storage/ferrari_76367fe2.webp"');
    expect(component).toContain('"Audi": "/manus-storage/audi_050ae235.webp"');
    expect(component).toContain('"Lamborghini": "/manus-storage/lamborghini_28d5ee79.webp"');
    expect(component).toContain('"Bentley": "/manus-storage/bentley_d68a814c.webp"');
    expect(component).toContain('"Brabus": "/manus-storage/brabus_60a83651.webp"');
    expect(component).toContain('"Mansory": "/manus-storage/mansory_b1d8c549.webp"');
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

  it("gives rebuilt Brand Cards a neutral daylight surface and blue dark-mode icon wells", () => {
    expect(rebuiltCardStyles).toContain("Brand Cards 3.0");
    expect(rebuiltCardStyles).toContain("#b9cbd2");
    expect(rebuiltCardStyles).toContain("#0b4f78");
    expect(rebuiltCardStyles).toContain(".brand-cards.brand-cards--dark.brand-logo-rail .brand-filter-card-icon");
    expect(component).toContain('className={`brand-cards brand-cards--${theme} brand-logo-rail brand-filter-rail');
    expect(component).toContain('<a href={`/cars/${brandRouteSlug(brand.brandName)}`}');
    expect(rebuiltCardStyles).toContain("No mark receives a green or square");
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

  it("uses the same original marque source inside one contrast-safe independent icon for both themes", () => {
    expect(component).toContain('className="brand-filter-card-icon"');
    expect(component).toContain('<BrandMark brandName={brand.brandName} logoUrl={brand.logoUrl} className="brand-filter-mark" />');
    expect(rebuiltCardStyles).toContain("Independent filter icon primitive");
    expect(rebuiltCardStyles).toContain("object-fit: contain");
    expect(rebuiltCardStyles).toContain(".brand-filter-card-icon::before");
    expect(rebuiltCardStyles).toContain("#0b4f78");
  });

  it("keeps every sensitive light or dark marque on the same protected filter source", () => {
    expect(component).toContain("const source = brandHeaderAssets[brandName] || logoUrl");
    for (const marque of ["Rolls-Royce", "Mercedes-Benz", "Bentley", "Aston Martin", "Audi", "Porsche", "Maserati", "Lamborghini"]) {
      expect(component).toContain(`\"${marque}\": \"/manus-storage/`);
    }
    expect(component).toContain("filterBrands.map((brand) => <a href={`/cars/${brandRouteSlug(brand.brandName)}`");
    expect(component).toContain("<span className=\"brand-filter-card-icon\" style={iconWellStyle}><BrandMark brandName={brand.brandName}");
    expect(rebuiltCardStyles).toContain(".brand-filter-card-icon > :is(.brand-filter-mark");
    expect(rebuiltCardStyles).toContain("filter: contrast(1.14) saturate(1.06)");
    expect(component).toContain('"Rolls-Royce": "/manus-storage/rolls-royce_4c877ceb.webp"');
    expect(component).toContain('"Maserati": "/manus-storage/maserati_63a12301.webp"');
    expect(component).toContain('"Mercedes-Benz": "/manus-storage/mercedes-benz_e6c76c17.webp"');
  });

  it("maps every branded filter through one independent icon and the same BrandMark source", () => {
    const requiredMarques = ["Lamborghini", "Maserati", "Ferrari", "McLaren", "Mercedes-Benz", "Porsche", "Rolls-Royce", "Range Rover", "Audi", "BMW", "Bentley", "Aston Martin", "Cadillac", "Brabus", "Mansory"];
    for (const marque of requiredMarques) {
      expect(component).toContain(`\"${marque}\": \"/manus-storage/`);
    }
    expect(component).toContain("const source = brandHeaderAssets[brandName] || logoUrl");
    expect(component).toContain('<span className="brand-filter-card-icon" style={iconWellStyle}><BrandMark brandName={brand.brandName} logoUrl={brand.logoUrl} className="brand-filter-mark" /></span>');
    expect(rebuiltCardStyles).toContain(".brand-filter-card-icon");
    expect(rebuiltCardStyles).toContain("object-fit: contain");
  });

  it("keeps marque icon changes centralized and reflected in filter cards, vehicle cards, and brand headers", () => {
    expect(component).toContain("Single editable source for each marque icon");
    expect(component).toContain("const source = brandHeaderAssets[brandName] || logoUrl");
    expect(component).toContain("useEffect(() => setAvailable(Boolean(source)), [source])");
    expect(component).toContain('<BrandMark brandName={displayedBrand} logoUrl={displayedBrandLogo} className="vehicle-brand-ribbon-mark" />');
    expect(component).toContain('const displayedBrand = brandBadge?.brandName || vehicle.brand');
    expect(component).toContain('brandBadge={brandBadge}');
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
    expect(component).toContain('const usesSeekLogoCanvas = (source: string | undefined) => Boolean(source?.includes("seeklogo"));');
    expect(component).toContain('const sourceTreatmentClass = usesBuiltInSeekLogoCanvas ? "brand-mark--seeklogo-canvas" : ""');
    expect(styles).toContain('.brand-emblem-well .brand-mark--ferrari');
    expect(styles).toContain('.brand-mark--seeklogo-canvas');
    expect(styles).toContain('transform: scale(1.55) !important');
    expect(styles).toContain('transform: scale(2.2) !important');
    expect(styles).toContain('clip-path: inset(6% 12% 4% round 42%)');
    expect(glassStyles).toContain('.brand-mark--mercedes-benz, .brand-mark--aston-martin, .brand-mark--brabus, .brand-mark--mansory');
  });

  it("visually elevates the selected marque without changing its filter route", () => {
    expect(component).toContain('className={activeBrand === brand.brandName ? "active" : ""}');
    expect(component).toContain('aria-current={activeBrand === brand.brandName ? "page" : undefined}');
    expect(glassStyles).toContain(".brand-logo-rail :is(a, button).active");
    expect(glassStyles).toContain("#5bd0ff");
    expect(glassStyles).toContain(".brand-logo-rail :is(a, button).active::after");
  });

  it("uses Brand Cards semantics and the rebuilt neutral/blue palette", () => {
    expect(component).toContain('aria-label="Brand Cards"');
    expect(rebuiltCardStyles).toContain("#b9cbd2");
    expect(rebuiltCardStyles).toContain("#5ebce8");
    expect(rebuiltCardStyles).toContain("#0b4f78");
  });

  it("anchors the header lockup with neon", () => {
    expect(glassStyles).toContain("A fine neon baseline");
    expect(glassStyles).toContain("#48c8ff");
    expect(glassStyles).toContain("width: 100%");
  });
});
