import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const toggleSource = readFileSync(resolve(process.cwd(), "client/src/components/ThemeToggle.tsx"), "utf8");
const gallerySource = readFileSync(resolve(process.cwd(), "client/src/components/CarGallery.tsx"), "utf8");
const globalStyles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const vehicleGlassStyles = readFileSync(resolve(process.cwd(), "client/src/vehicle-glass.css"), "utf8");
const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("theme and touch gallery controls", () => {
  it("enables a persistent dark and day-mode toggle from the application shell", () => {
    expect(appSource).toContain('ThemeProvider defaultTheme="dark" switchable');
    expect(toggleSource).toContain("Switch to day mode");
    expect(toggleSource).toContain("Switch to dark mode");
    expect(globalStyles).toContain(".detail-header-actions .theme-toggle { display: inline-flex");
    expect(vehicleGlassStyles).toContain("Rebuilt daylight palette");
    expect(vehicleGlassStyles).toContain("#154d80");
    expect(vehicleGlassStyles).toContain("#65bff5");
    expect(vehicleGlassStyles).toContain("rgba(57, 184, 255, .42)");
    expect(vehicleGlassStyles).toContain("rgba(3, 22, 39, .86)");
    expect(vehicleGlassStyles).toContain(".hero-cinematic::after { display: none; }");
    expect(vehicleGlassStyles).toContain("#f5fbff !important");
    expect(vehicleGlassStyles).toContain("#c5eaff !important");
    expect(vehicleGlassStyles).toContain(".journal-card :is(h2, h3, h4)");
    expect(vehicleGlassStyles).toContain(".booking-form :is(input, select, textarea)");
    expect(vehicleGlassStyles).toContain(".home-faq-list [data-slot=\"accordion-item\"]");
    expect(vehicleGlassStyles).toContain("border-radius: 20px");
    expect(vehicleGlassStyles).toContain("background: #073b62");
    expect(vehicleGlassStyles).toContain("rgba(2, 7, 12, .72)");
    expect(vehicleGlassStyles).toContain("color: #f3d355 !important");
    expect(vehicleGlassStyles).toContain("color: #8d3344 !important");
    expect(vehicleGlassStyles).toContain(".journal-card::after");
    expect(vehicleGlassStyles).toContain("fleet-filter-panel");
    expect(vehicleGlassStyles).toContain("Theme changes replace colours immediately");
    expect(vehicleGlassStyles).toContain(".detail-booking-form label");
    expect(vehicleGlassStyles).toContain(".detail-faq-item button");
    expect(vehicleGlassStyles).toContain(".vehicle-card .card-rate .dirham-mark");
    expect(vehicleGlassStyles).toContain("#62c8ff");
    expect(vehicleGlassStyles).toContain("theme-transitioning");
    expect(vehicleGlassStyles).toContain(".detail-reservation-panel");
    expect(vehicleGlassStyles).toContain(".journal-card .journal-card-overlay > strong");
    expect(vehicleGlassStyles).toContain("#e4c49f");
    expect(vehicleGlassStyles).toContain("html[data-theme=\"light\"] .theme-toggle");
    expect(vehicleGlassStyles).toContain("hero-copy > .section-kicker");
    expect(vehicleGlassStyles).toContain("#0b4772");
    expect(vehicleGlassStyles).toContain("#ffe0b7");
    expect(vehicleGlassStyles).toContain("#8a2419");
    expect(vehicleGlassStyles).toContain("Daylight catalogue hierarchy");
    expect(vehicleGlassStyles).toContain(".fleet-browse-page .search-field");
    expect(vehicleGlassStyles).toContain(".brand-filter-count");
    expect(vehicleGlassStyles).toContain("#146ba4");
    expect(vehicleGlassStyles).toContain("#5f3020");
    expect(vehicleGlassStyles).toContain("detail-rental-price .dirham-mark");
    expect(vehicleGlassStyles).toContain("#ef7d2c");
    expect(vehicleGlassStyles).toContain("hero-section.hero-cinematic");
    expect(vehicleGlassStyles).toContain("70svh");
    expect(homeSource).toContain("brand.heroTexture");
  });

  it("keeps gallery navigation driven by touch gestures rather than previous and next arrow controls", () => {
    expect(gallerySource).toContain("onPointerDown");
    expect(gallerySource).toContain("navigateImage(difference < 0 ? 1 : -1)");
    expect(gallerySource).not.toContain('className="gallery-nav left"');
    expect(gallerySource).toContain('className="gallery-swipe-cues"');
  });
});
