import { describe, expect, it } from "vitest";
import { workbookFleetEntries } from "../client/src/data/workbookFleet";

describe("ZAVERRE catalogue pricing", () => {
  const price = (name: string) => workbookFleetEntries.find((vehicle) => vehicle.fullName === name)?.priceAedPerDay;

  it("applies the attached catalogue prices to the matched flagship vehicles", () => {
    expect(price("Lamborghini Revuelto")).toBe(11000);
    expect(price("Ferrari Purosangue Novitec")).toBe(10000);
    expect(price("Mercedes-Benz AMG GT63 Coupe")).toBe(2200);
    expect(price("Porsche 911 GT3 RS")).toBe(6500);
    expect(price("Rolls-Royce Cullinan Mansory")).toBe(5500);
  });

  it("keeps the fleet source complete and numeric after the price overlay", () => {
    expect(workbookFleetEntries).toHaveLength(95);
    expect(workbookFleetEntries.every((vehicle) => Number.isFinite(vehicle.priceAedPerDay))).toBe(true);
  });
});
