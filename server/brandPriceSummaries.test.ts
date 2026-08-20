import { describe, expect, it } from "vitest";
import { brandPriceSummaries } from "../client/src/config/brandPriceSummaries";
import { vehicleBrands, vehicleCatalog, vehicleFilterBrands } from "../client/src/config/vehicleCatalog";

describe("image-verified brand price summaries", () => {
  it("only exposes brands represented in the current catalogue", () => {
    expect(Object.keys(brandPriceSummaries).every((brand) => vehicleBrands.includes(brand))).toBe(true);
    expect(Object.keys(brandPriceSummaries).length).toBe(vehicleBrands.length - 1);
    expect(vehicleBrands).toEqual(expect.arrayContaining(["Brabus", "Mansory"]));
  });

  it("uses an ordered daily-rate range that exists in each corresponding catalogue group", () => {
    for (const [brand, summary] of Object.entries(brandPriceSummaries)) {
      const rates = vehicleCatalog.filter((vehicle) => vehicleFilterBrands(vehicle).includes(brand)).map((vehicle) => vehicle.priceAedPerDay);
      expect(summary.minimumAedPerDay).toBeLessThanOrEqual(summary.maximumAedPerDay);
      expect(rates).toContain(summary.minimumAedPerDay);
      expect(rates).toContain(summary.maximumAedPerDay);
    }
  });

  it("retains the source-verified Brabus and Mansory memberships without duplicating a vehicle", () => {
    expect(vehicleCatalog.filter((vehicle) => vehicleFilterBrands(vehicle).includes("Brabus"))).toHaveLength(3);
    expect(vehicleCatalog.filter((vehicle) => vehicleFilterBrands(vehicle).includes("Mansory"))).toHaveLength(5);
  });
});
