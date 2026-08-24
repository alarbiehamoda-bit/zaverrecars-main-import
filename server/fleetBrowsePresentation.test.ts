import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const fleetBrowseSource = readFileSync(new URL("../client/src/pages/FleetBrowse.tsx", import.meta.url), "utf8");
const vehicleSystemSource = readFileSync(new URL("../client/src/components/VehicleSystem.tsx", import.meta.url), "utf8");
const fleetBrowseStyles = readFileSync(new URL("../client/src/pages/FleetBrowse.css", import.meta.url), "utf8");
const glassStyles = readFileSync(new URL("../client/src/vehicle-glass.css", import.meta.url), "utf8");
const detailSource = readFileSync(new URL("../client/src/pages/VehicleDetail.tsx", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const globalStyles = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");
const vehicleAssetsSource = readFileSync(new URL("../client/src/lib/vehicleAssets.ts", import.meta.url), "utf8");

describe("fleet browse presentation", () => {
  it("keeps the all-cars and marque collections in the same vertical card layout", () => {
    expect(fleetBrowseSource).toContain('layout="vertical"');
    expect(fleetBrowseSource).not.toContain('layout={activeBrand ? "vertical" : "grid"}');
    expect(fleetBrowseStyles).toContain("master-vehicle-grid--vertical");
    expect(fleetBrowseSource).toContain("vehicleCatalog.filter");
    expect(vehicleSystemSource).toContain("vehicles.map((vehicle, index)");
  });

  it("keeps the primary vehicle photograph uncropped inside a stable card frame", () => {
    expect(fleetBrowseStyles).toContain("grid-template-columns: minmax(0, min(100%, 620px))");
    expect(readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8")).toContain("aspect-ratio: 16 / 10");
    expect(readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8")).toContain("object-fit: contain");
  });

  it("renders a shared brand ribbon and primary booking actions without a duplicate WhatsApp row", () => {
    expect(vehicleSystemSource).toContain("vehicle-brand-ribbon");
    expect(vehicleSystemSource).not.toContain("vehicle-visual-caption");
    expect(vehicleSystemSource).toContain('className="card-actions"');
    expect(vehicleSystemSource).not.toContain("whatsappUrl(vehicleMessage(vehicle))");
  });

  it("keeps the long collection easy to return from without adding brand text over vehicle images", () => {
    expect(fleetBrowseSource).toContain("fleet-back-to-top");
    expect(fleetBrowseSource).toContain("showBackToTop");
    expect(fleetBrowseSource).toContain("window.scrollTo");
  });

  it("keeps enhanced scrolling calm when reduced motion is requested", () => {
    expect(glassStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(glassStyles).toContain("html { scroll-behavior: auto; }");
    expect(glassStyles).toContain("master-vehicle-grid { scroll-behavior: auto !important; }");
  });

  it("keeps all-cars cards visible immediately without an entry animation on return", () => {
    expect(fleetBrowseStyles).toContain("animation: none");
    expect(fleetBrowseStyles).not.toContain("animation-timeline: view()");
    expect(fleetBrowseStyles).toContain("opacity: 1");
  });

  it("uses restrained text and card motion only when motion has not been reduced", () => {
    expect(glassStyles).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(glassStyles).toContain("zaverre-title-sheen");
    expect(glassStyles).toContain("zaverre-card-breathe");
    expect(glassStyles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("uses transparent mark assets for the verified marque circles and a restrained card-hover scale", () => {
    expect(vehicleSystemSource).toContain("/manus-storage/porsche_3b231689.webp");
    expect(vehicleSystemSource).toContain("/manus-storage/lamborghini_1a09a414.webp");
    expect(vehicleSystemSource).toContain("/manus-storage/mercedes-benz_a8a53dc1.png");
    expect(vehicleSystemSource).toContain("/manus-storage/rolls-royce_3e890ee3.png");
    expect(vehicleSystemSource).toContain("/manus-storage/land-rover-logo-2021_0484ad78.png");
    expect(vehicleSystemSource).toContain("brand-mark-fallback");
    expect(vehicleSystemSource).toContain('"--vehicle-image-hover-scale": String(imageSettings.scale)');
    expect(glassStyles).toContain("box-shadow: inset 0 -28px 40px rgba(0, 0, 0, .32), 0 16px 30px rgba(0, 0, 0, .18)");
  });

  it("keeps the return control above the WhatsApp action and clear of mobile safe areas", () => {
    expect(fleetBrowseStyles).toContain("env(safe-area-inset-bottom)");
    expect(fleetBrowseStyles).toContain("bottom: calc(104px + env(safe-area-inset-bottom))");
    expect(fleetBrowseStyles).toContain("padding: 28px 14px 108px");
    expect(fleetBrowseStyles).toContain("z-index: 34");
    expect(fleetBrowseSource).toContain("document.scrollingElement");
    expect(fleetBrowseSource).toContain("window.requestAnimationFrame");
  });

  it("places verified WhatsApp and call actions beneath the floating return control", () => {
    expect(fleetBrowseSource).toContain("fleet-floating-actions");
    expect(fleetBrowseSource).toContain("fleet-quick-contact--whatsapp");
    expect(fleetBrowseSource).toContain("fleet-quick-contact--call");
    expect(fleetBrowseSource).toContain("contact.whatsappInternational");
    expect(fleetBrowseStyles).toContain("flex-direction: column");
    expect(globalStyles).toContain(".delivery-location-grid li { align-items: center; background: rgba(47,111,170,.08)");
  });

  it("keeps the delivery title brown while vehicle booking remains delegated to the surrounding page action", () => {
    expect(glassStyles).toContain(".delivery-section .delivery-intro h2");
    expect(glassStyles).toContain("color: #765128 !important");
    expect(vehicleSystemSource).toContain("onBook(vehicle)");
    expect(vehicleSystemSource).not.toContain("WHATSAPP ENQUIRY");
  });

  it("returns from a detail page to the exact vehicle card that opened it", () => {
    expect(fleetBrowseSource).toContain('fleetReturnStorageKey = "zaverre.return-to-fleet"');
    expect(fleetBrowseSource).toContain("window.sessionStorage.setItem");
    expect(fleetBrowseSource).toContain("function restoreVehicleCard(vehicleId: string)");
    expect(fleetBrowseSource).toContain("window.scrollTo({ top: targetTop, left: 0, behavior: \"auto\" })");
    expect(fleetBrowseSource).toContain("window.requestAnimationFrame");
    expect(vehicleSystemSource).toContain("id={`vehicle-card-${vehicle.id}`}");
    expect(detailSource).toContain("returnToOrigin");
  });

  it("adds a calm hero-title treatment while keeping primary calls to action softer", () => {
    expect(homeSource).toContain("<h1>{hero.titleFirst}");
    expect(homeSource).toContain("<GoldRule label={hero.kicker} />");
    expect(glassStyles).toContain(".hero-copy h1");
    expect(glassStyles).toContain("zaverre-title-sheen 12s");
    expect(globalStyles).toContain(".hero-cta .button");
    expect(globalStyles).toContain("background: rgba(199,167,120,.86)");
  });

  it("keeps the completed Artura Spider source on the current project origin", () => {
    expect(vehicleSystemSource).toContain("vehicleAssetUrl(vehicle.image)");
    expect(vehicleAssetsSource).toContain("mclaren-artura-spider-orange-complete_22778bd3.webp");
  });

  it("uses blue delivery list text and dividers without animated line accents", () => {
    expect(globalStyles).toContain("background: rgba(47,111,170,.08)");
    expect(globalStyles).toContain("border: 1px solid rgba(39,102,161,.34)");
    expect(globalStyles).toContain("color: #175f9f");
    expect(glassStyles).not.toContain(".delivery-location-grid li::after");
    expect(glassStyles).not.toContain(".contact-links a::after");
  });

  it("keeps the brand name bar separate from the catalogue cards", () => {
    expect(fleetBrowseSource).toContain("brand-name-bar");
    expect(fleetBrowseSource).toContain("fleet-browse-brand-logo");
    expect(fleetBrowseSource).not.toContain("brand-sheet-header");
    expect(fleetBrowseSource).toContain("fleet-browse-hero--brand");
  });

  it("keeps a compact fleet browser with marque navigation and deterministic category routes", () => {
    expect(fleetBrowseSource).not.toContain("fleet-filter-panel\" aria-label");
    expect(fleetBrowseSource).toContain("fleetCategoryFromSlug");
    expect(fleetBrowseSource).not.toContain('placeholder="Search brand, model, engine…"');
    expect(fleetBrowseSource).not.toContain("Search vehicles by brand, model, category, or verified specification");
    expect(fleetBrowseSource).toContain("BrandFilterRail");
    expect(readFileSync(new URL("../client/src/components/VehicleSystem.tsx", import.meta.url), "utf8")).toContain("brand-filter-model-count");
    expect(readFileSync(new URL("../client/src/components/VehicleSystem.tsx", import.meta.url), "utf8")).not.toContain("className=\"brand-filter-count\"");
    expect(readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8")).toContain('/cars/category/:categorySlug');
  });

  it("uses icon-led verified quick specifications without inventing values", () => {
    expect(vehicleSystemSource).toContain("card-spec-list");
    expect(vehicleSystemSource).toContain("vehicleSpecificationValue");
    expect(vehicleSystemSource).toContain("0–100 km/h");
    expect(detailSource).toContain("SpecificationIcon");
    expect(detailSource).toContain("detail-spec-grid--iconic");
    expect(detailSource).toContain("LONGER DURATIONS");
  });

  it("keeps a single counted filter entry per brand with a logo or a consistent fallback mark", () => {
    expect(vehicleSystemSource).toContain("const brandVehicleCounts");
    expect(vehicleSystemSource).toContain("const filterBrands");
    expect(vehicleSystemSource).toContain("filterBrands.map((brand)");
    expect(vehicleSystemSource).toContain("brandVehicleCounts[brand.brandName]");
    expect(vehicleSystemSource).toContain("const initials = brandName.split");
    expect(vehicleSystemSource).toContain("vehicle.brand === brand.brandName");
    expect(vehicleSystemSource).toContain("vehicleFilterBrands(vehicle).includes(brand.brandName)");
  });

  it("keeps search-filter counters light beige in dark mode and light brown in daylight mode", () => {
    expect(glassStyles).toContain(".brand-filter-count,");
    expect(glassStyles).toContain(".brand-filter-model-count");
    expect(glassStyles).toContain("color: #edd9b5");
    expect(glassStyles).toContain('html[data-theme="light"] :is(.brand-filter-count, .brand-filter-model-count)');
    expect(glassStyles).toContain("color: #b97956");
  });

  it("uses the marque rail as the only visible collection discovery control", () => {
    expect(fleetBrowseSource).not.toContain("fleet-category-rail");
    expect(fleetBrowseSource).not.toContain("SEARCH COLLECTION");
    expect(fleetBrowseSource).not.toContain("discoverFleetVehicles");
    expect(vehicleSystemSource).toContain('className={`brand-filter-all-button${activeBrand === "All" ? " active" : ""}`}');
    expect(vehicleSystemSource).toContain("VIEW ALL CARS");
  });

  it("keeps the all-cars action and marquee card rail touch-friendly and visually explicit", () => {
    expect(vehicleSystemSource).toContain("brand-filter-stack");
    expect(vehicleSystemSource).toContain("brand-logo-rail brand-filter-rail");
    expect(readFileSync(new URL("../client/src/components/BrandCards.css", import.meta.url), "utf8")).toContain(".brand-filter-all-button");
    expect(readFileSync(new URL("../client/src/components/BrandCards.css", import.meta.url), "utf8")).toContain("scrollbar-width: none;");
  });

  it("names the showroom controls as Filter Top, Filter Holder, and Brand Cards", () => {
    expect(fleetBrowseSource).toContain('className="fleet-browse-toolbar filter-top"');
    expect(fleetBrowseSource).toContain('aria-label="Filter Top"');
    expect(fleetBrowseSource).toContain('className="filter-holder"');
    expect(fleetBrowseSource).toContain('aria-label="Filter Holder"');
    expect(fleetBrowseSource).toContain("FILTER TOP");
    expect(fleetBrowseSource).toContain("BRAND CARDS");
    expect(vehicleSystemSource).toContain('aria-label="Brand Cards"');
  });
});
