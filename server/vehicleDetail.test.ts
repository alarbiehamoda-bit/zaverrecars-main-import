import { featuredVehicleIds, vehicleCatalog } from "../client/src/config/vehicleCatalog";
import { archiveGalleryByVehicleId } from "../client/src/data/archiveVehicleGalleries";
import { workbookImageSourceByVehicleId } from "../client/src/data/workbookFleet";
import {
  readDetailPairs,
  readStringArray,
  completePublicDetailPairs,
  vehicleFromSlug,
  vehicleSlug,
} from "../client/src/lib/vehicleDetail";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const detailPageSource = readFileSync(resolve(process.cwd(), "client/src/pages/VehicleDetail.tsx"), "utf8");

describe("vehicle detail helpers", () => {
  it("creates stable, resolvable detail routes for every verified vehicle", () => {
    const slugs = vehicleCatalog.map(vehicleSlug);
    expect(slugs.length).toBeGreaterThanOrEqual(60);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(vehicleFromSlug(slug)?.id).toMatch(/^vehicle-\d{3}$/);
    }
  });

  it("uses one documented source image for each verified vehicle", () => {
    const images = vehicleCatalog.map((vehicle) => vehicle.image);
    expect(images.length).toBeGreaterThanOrEqual(60);
    expect(new Set(images).size).toBe(images.length);
    expect(images.every((image) => image.startsWith("/manus-storage/") || image.startsWith("https://cdn.sanity.io/"))).toBe(true);
    expect(images.some((image) => image.includes("ready-source-"))).toBe(false);
  });

  it("keeps the homepage limited to three verified feature records", () => {
    expect(featuredVehicleIds).toHaveLength(3);
    expect(featuredVehicleIds.every((id) => vehicleCatalog.some((vehicle) => vehicle.id === id))).toBe(true);
  });

  it("uses public prices from verified source records and confirmed August pricing overrides", () => {
    const vantage = vehicleCatalog.find((vehicle) => vehicle.fullName === "Aston Martin Vantage");
    const ferrari296 = vehicleCatalog.find((vehicle) => vehicle.fullName === "Ferrari 296 GTS Spyder");
    const rangeRover = vehicleCatalog.find((vehicle) => vehicle.brand === "Range Rover");
    expect(vantage?.priceAedPerDay).toBe(1750);
    expect(vantage?.priceSource).toBe("uploaded-workbook");
    expect(vantage?.image).toMatch(/^https:\/\/cdn\.sanity\.io\//);
    expect(ferrari296?.priceAedPerDay).toBe(3950);
    expect(ferrari296?.specifications).toContainEqual({ label: "Power", value: "819 horsepower" });
    expect(rangeRover?.priceAedPerDay).toBeGreaterThan(0);
    expect(rangeRover?.specifications.some((specification) => specification.label === "Year" && specification.value.length > 0)).toBe(true);
  });

  it("uses no imported galleries while the priced local catalogue set is active", () => {
    expect(vehicleCatalog.every((vehicle) => vehicle.gallery === undefined)).toBe(true);
  });

  it("keeps documented detail fields public without adding default values for missing specifications", () => {
    for (const vehicle of vehicleCatalog) {
      expect(vehicle.fullName).toBeTruthy();
      const publicDescription = vehicle.description?.trim() || `The ${vehicle.fullName} is presented by ZAVERRE as an individual ${vehicle.category.toLowerCase()} option.`;
      expect(publicDescription.length).toBeGreaterThan(40);
      expect(vehicle.conditions.length).toBeGreaterThan(0);
      const publicSpecs = completePublicDetailPairs(vehicle.specifications);
      expect(publicSpecs.every((item) => item.label.trim().length > 0 && item.value.trim().length > 0)).toBe(true);
      expect(publicSpecs.some((item) => item.value === "Available on request")).toBe(false);
    }
  });

  it("accepts only usable public field values from editable JSON", () => {
    expect(readStringArray('["Navigation", "", 6, "Bluetooth"]')).toEqual([
      "Navigation",
      "Bluetooth",
    ]);
    expect(readStringArray("not json")).toEqual([]);
    expect(readDetailPairs('[{"label":"Mileage","value":"250 km/day"}]')).toEqual([
      { label: "Mileage", value: "250 km/day" },
    ]);
    expect(readDetailPairs('[{"label":"Mileage"}]')).toEqual([]);
  });

  it("keeps a documented Porsche card with a source image and public details", () => {
    const porsche = vehicleCatalog.find((vehicle) => vehicle.brand === "Porsche");
    expect(porsche?.priceAedPerDay).toBeGreaterThan(0);
    expect(porsche?.image).toMatch(/^https:\/\/cdn\.sanity\.io\//);
    expect(porsche?.specifications.length).toBeGreaterThan(0);
  });

  it("keeps the 95 source-record cards with their exact gallery order and a unified image angle", () => {
    expect(vehicleCatalog).toHaveLength(95);
    expect(new Set(vehicleCatalog.map((vehicle) => vehicle.id)).size).toBe(vehicleCatalog.length);
    for (const vehicle of vehicleCatalog) {
      const gallery = archiveGalleryByVehicleId[vehicle.id] ?? [];
      const sourcePositions = workbookImageSourceByVehicleId[vehicle.id] ?? [];
      expect(vehicle.image).toMatch(/^https:\/\/cdn\.sanity\.io\//);
      expect(vehicle.sourceReference).toMatch(/^https:\/\//);
      expect(vehicle.priceAedPerDay).toBeGreaterThan(0);
      expect(vehicle.specifications.length).toBeGreaterThan(0);
      expect(vehicle.imageSettings).toMatchObject({ fit: "contain", position: "center" });
      expect(gallery.length).toBeGreaterThan(0);
      expect(sourcePositions.map((image) => image.position)).toEqual(Array.from({ length: sourcePositions.length }, (_, index) => index + 1));
      expect(sourcePositions.map((image) => image.sourceUrl)).toEqual([vehicle.image, ...gallery]);
    }
  });

  it("uses direct reservation contact on detail pages instead of an inline booking form", () => {
    expect(detailPageSource).toContain("detail-reservation-panel");
    expect(detailPageSource).toContain("WHATSAPP ZAVERRE");
    expect(detailPageSource).not.toContain('className="detail-booking-form"');
    expect(detailPageSource).not.toContain("createBooking.mutate");
  });
});
