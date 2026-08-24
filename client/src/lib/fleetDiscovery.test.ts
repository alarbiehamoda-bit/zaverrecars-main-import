import { describe, expect, it } from "vitest";
import { vehicleCatalog } from "@/config/vehicleCatalog";
import { discoverFleetVehicles } from "./fleetDiscovery";

describe("fleet discovery", () => {
  it("finds verified vehicles by brand, model, and category without changing the source catalogue", () => {
    const results = discoverFleetVehicles(vehicleCatalog, "Bentley", "curated");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((vehicle) => vehicle.fullName.includes("Bentley"))).toBe(true);
    expect(vehicleCatalog).toHaveLength(95);
  });

  it("sorts copies of the catalogue by the selected public daily price", () => {
    const ascending = discoverFleetVehicles(vehicleCatalog, "", "price-low");
    const descending = discoverFleetVehicles(vehicleCatalog, "", "price-high");
    expect(ascending[0].priceAedPerDay).toBeLessThanOrEqual(ascending[1].priceAedPerDay);
    expect(descending[0].priceAedPerDay).toBeGreaterThanOrEqual(descending[1].priceAedPerDay);
    expect(vehicleCatalog[0].index).toBe(1);
  });
});
