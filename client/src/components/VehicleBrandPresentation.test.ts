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
    expect(component).toContain('"Maserati": "/manus-storage/maserati-mark-transparent');
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
});
