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
    expect(component).toContain('"Maserati": "/manus-storage/image-extractpics-22_4e531ab7.webp"');
  });

  it("prioritizes the supplied and background-cleaned assets for every catalogue marque", () => {
    expect(component).toContain('"Ferrari": "/manus-storage/ferrari-optimized_317e7910.webp"');
    expect(component).toContain('"Audi": "/manus-storage/audi-optimized_42f6ed84.webp"');
    expect(component).toContain('"Lamborghini": "/manus-storage/lamborghini-optimized_c206dfb4.webp"');
    expect(component).toContain('"Bentley": "/manus-storage/bentley-optimized_2dc7a26d.webp"');
    expect(component).toContain('"Brabus": "/manus-storage/image-extractpics-27_43c08169.webp"');
    expect(component).toContain('"Mansory": "/manus-storage/image-extractpics-25_e551cd05.webp"');
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
    expect(component).toContain('className="vehicle-brand-ribbon__seal"');
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
    expect(component).toContain('className={`brand-logo-rail brand-filter-rail');
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

  it("anchors the header lockup with neon", () => {
    expect(glassStyles).toContain("A fine neon baseline");
    expect(glassStyles).toContain("#48c8ff");
    expect(glassStyles).toContain("width: 100%");
  });
});
