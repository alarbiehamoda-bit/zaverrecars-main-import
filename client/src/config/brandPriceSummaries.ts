import { vehicleBrands, vehicleCatalog, vehicleFilterBrands } from "./vehicleCatalog";

/** Daily-rate ranges calculated only from the active workbook-matched fleet. */
export type BrandPriceSummary = {
  minimumAedPerDay: number;
  maximumAedPerDay: number;
};

export const brandPriceSummaries: Record<string, BrandPriceSummary> = Object.fromEntries(
  vehicleBrands.filter((brand) => brand !== "All").map((brand) => {
    const rates = vehicleCatalog
      .filter((vehicle) => vehicleFilterBrands(vehicle).includes(brand))
      .map((vehicle) => vehicle.priceAedPerDay)
      .sort((left, right) => left - right);
    return [brand, { minimumAedPerDay: rates[0], maximumAedPerDay: rates.at(-1)! }];
  }),
);

const aedFormatter = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });

export function formatBrandDailyRate(summary: BrandPriceSummary) {
  const minimum = `AED ${aedFormatter.format(summary.minimumAedPerDay)}`;
  if (summary.minimumAedPerDay === summary.maximumAedPerDay) return `${minimum} / DAY`;
  return `${minimum} — AED ${aedFormatter.format(summary.maximumAedPerDay)} / DAY`;
}
