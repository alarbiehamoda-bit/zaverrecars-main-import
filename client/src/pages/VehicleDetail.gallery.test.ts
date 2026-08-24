import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const detailSource = readFileSync(new URL("./VehicleDetail.tsx", import.meta.url), "utf8");
const gallerySource = readFileSync(new URL("../components/CarGallery.tsx", import.meta.url), "utf8");
const enhancementStyles = readFileSync(new URL("./VehicleDetailEnhancements.css", import.meta.url), "utf8");
const archiveGallerySource = readFileSync(new URL("../data/archiveVehicleGalleries.ts", import.meta.url), "utf8");

describe("vehicle detail gallery behavior", () => {
  it("returns to the origin immediately and reserves a separate double tap on ZAVERRE for home", () => {
    expect(detailSource).toContain("const homeTapTimer");
    expect(detailSource).toContain("const [homeTapArmed, setHomeTapArmed]");
    expect(detailSource).toContain("const returnToOrigin");
    expect(detailSource).toContain('onClick={returnToOrigin}>ALL BRANDS');
    expect(detailSource).toContain('onClick={returnToOrigin}>FLEET');
    expect(detailSource).toContain("setHomeTapArmed(true)");
    expect(detailSource).toContain("PRESS AGAIN FOR HOME");
    expect(detailSource).toContain("window.setTimeout");
    expect(detailSource).toContain('navigate("/")');
    expect(detailSource).toContain("onClick={handleHomeTap}");
  });

  it("keeps extra gallery controls conditional on real additional images", () => {
    expect(detailSource).toContain("<CarGallery vehicleName={vehicle.fullName} images={gallery}");
    expect(gallerySource).toContain("gallery.length > 1");
    expect(gallerySource).toContain("gallery-thumbnails");
    expect(gallerySource).toContain("navigateImage");
    expect(gallerySource).toContain("onPointerUp");
    expect(gallerySource).toContain("setPointerCapture");
    expect(gallerySource).toContain('className="gallery-nav left"');
    expect(gallerySource).toContain('className="gallery-nav right"');
    expect(gallerySource).toContain("Show next gallery image");
  });

  it("keeps the first-booking offer in the booking flow rather than over the mobile reservation action", () => {
    expect(detailSource).toContain('<div className="detail-coupon-slot"><FirstBookingCoupon /></div>');
    expect(detailSource).toContain("detail-quick-actions");
    expect(detailSource.indexOf("detail-coupon-slot")).toBeLessThan(detailSource.indexOf("detail-basic-section"));
  });

  it("uses image position in thumbnail keys after normalizing and removing duplicate gallery sources", () => {
    expect(gallerySource).toContain("key={`${image.src}-${index}`}");
    expect(detailSource).toContain("const candidates = [");
    expect(detailSource).toContain("const seen = new Set<string>()");
    expect(detailSource).toContain("galleryAssetKey(image.src)");
  });

  it("keeps the verified primary image available for the lightbox in the shared component", () => {
    expect(gallerySource).toContain("detail-main-image-trigger");
    expect(gallerySource).toContain("setLightboxOpen(true)");
  });

  it("uses a drag-safe horizontal carousel for similar vehicles", () => {
    expect(detailSource).toContain("function RelatedVehicleCarousel");
    expect(detailSource).toContain("detail-related-grid--carousel");
    expect(detailSource).toContain("setPointerCapture");
    expect(detailSource).toContain("handleRailKeyDown");
    expect(detailSource).toContain('tabIndex={0}');
    expect(detailSource).toContain("scrollBy({");
    expect(detailSource).toContain("VehicleCard key={item.id}");
    expect(detailSource).not.toContain("detail-related-carousel-controls");
    expect(detailSource).toContain("Vehicle image:");
    expect(enhancementStyles).toContain("height: 720px");
    expect(enhancementStyles).toContain("overflow: hidden");
    expect(enhancementStyles).toContain("grid-template-rows: auto minmax(44px, auto) auto auto 52px");
    expect(enhancementStyles).toContain("touch-action: pan-x pan-y");
    expect(enhancementStyles).toContain("-webkit-overflow-scrolling: touch");
  });

  it("places verified source angles after the pricing image in the exact source sequence", () => {
    expect(detailSource).toContain("archiveGalleryByVehicleId[vehicle.id]");
    expect(detailSource).toContain("vehicle.image,");
    expect(detailSource).toContain("...archiveGallery,");
    expect(detailSource).toContain("const sourceImages");
    expect(detailSource).toContain("galleryAssetKey(image.src)");
    expect(archiveGallerySource).toContain("excludedImageIndex");
    expect(archiveGallerySource).toContain("index !== source.excludedImageIndex");
  });

  it("keeps a partner-gallery source for every catalog vehicle", () => {
    const sourceVehicleIds = archiveGallerySource.match(/"vehicle-\d{3}"/g) ?? [];
    expect(sourceVehicleIds.length).toBeGreaterThanOrEqual(81);
    expect(sourceVehicleIds).toContain('"vehicle-082"');
    expect(sourceVehicleIds).toContain('"vehicle-092"');
  });

  it("uses the corresponding partner model for every Audi gallery", () => {
    expect(archiveGallerySource).toMatch(/"vehicle-063": \{\s+"archiveId": "partner-003"/);
    expect(archiveGallerySource).toMatch(/"vehicle-064": \{\s+"archiveId": "partner-007"/);
    expect(archiveGallerySource).toMatch(/"vehicle-065": \{\s+"archiveId": "partner-008"/);
    expect(archiveGallerySource).toMatch(/"vehicle-066": \{\s+"archiveId": "partner-006"/);
    expect(archiveGallerySource).toMatch(/"vehicle-067": \{\s+"archiveId": "partner-005"/);
    expect(archiveGallerySource).toMatch(/"vehicle-068": \{\s+"archiveId": "partner-004"/);
  });

  it("quarantines images repeated across partner vehicle records", () => {
    expect(archiveGallerySource).toContain("const partnerImageUsage = new Map<string, number>();");
    expect(archiveGallerySource).toContain("(partnerImageUsage.get(src) ?? 0) === 1");
  });

  it("renders archive angles only for verified, non-shared partner sources", () => {
    expect(archiveGallerySource).toContain("source.verified === true");
    expect(archiveGallerySource).toContain("const catalogSourceUsage = new Map<string, number>();");
    expect(archiveGallerySource).toContain("(catalogSourceUsage.get(source.archiveId) ?? 0) === 1");
  });

  it("quarantines confirmed model conflicts instead of showing their partner galleries", () => {
    expect(archiveGallerySource).toMatch(/"vehicle-052": \{\s+"archiveId": "partner-085"\s+\}/);
    expect(archiveGallerySource).toMatch(/"vehicle-072": \{\s+"archiveId": "partner-015"\s+\}/);
    expect(archiveGallerySource).toMatch(/"vehicle-073": \{\s+"archiveId": "partner-015"\s+\}/);
  });

  it("keeps the SF90 and each Huracan STO gallery bound to their reviewed partner source", () => {
    expect(archiveGallerySource).toMatch(/"vehicle-018": \{\s+"archiveId": "partner-032"/);
    expect(archiveGallerySource).toMatch(/"vehicle-003": \{\s+"archiveId": "partner-042"/);
    expect(archiveGallerySource).toMatch(/"vehicle-005": \{\s+"archiveId": "partner-043"/);
  });
});
