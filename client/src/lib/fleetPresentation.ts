import type { Vehicle } from "@/config/vehicleCatalog";

export const fleetCategoryDefinitions = [
  { slug: "performance", label: "Performance", category: "Performance" },
  { slug: "luxury-suv", label: "Luxury SUVs", category: "Luxury SUV" },
  { slug: "convertibles", label: "Convertibles", category: "Convertible" },
] as const;

export type FleetCategorySlug = (typeof fleetCategoryDefinitions)[number]["slug"];

export function fleetCategoryFromSlug(slug?: string) {
  return fleetCategoryDefinitions.find((category) => category.slug === slug);
}

export function vehicleSpecificationValue(vehicle: Vehicle, label: string) {
  return vehicle.specifications.find((specification) => specification.label === label)?.value;
}

export function uniqueVehicleSpecificationValues(vehicles: Vehicle[], label: string) {
  return Array.from(
    new Set(
      vehicles
        .map((vehicle) => vehicleSpecificationValue(vehicle, label))
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((a, b) => a.localeCompare(b, "en"));
}

export const fleetPriceBands = [
  { value: "all", label: "Any public daily rate", maximum: null },
  { value: "2500", label: "Up to AED 2,500 / day", maximum: 2500 },
  { value: "5000", label: "Up to AED 5,000 / day", maximum: 5000 },
  { value: "10000", label: "Up to AED 10,000 / day", maximum: 10000 },
] as const;
