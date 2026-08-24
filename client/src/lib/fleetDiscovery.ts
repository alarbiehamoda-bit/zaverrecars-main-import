import type { Vehicle } from "@/config/vehicleCatalog";

export type FleetSort = "curated" | "price-low" | "price-high" | "name";

export function discoverFleetVehicles(vehicles: Vehicle[], query: string, sort: FleetSort) {
  const normalizedQuery = query.trim().toLocaleLowerCase("en");
  const filtered = normalizedQuery
    ? vehicles.filter((vehicle) => `${vehicle.brand} ${vehicle.model} ${vehicle.fullName} ${vehicle.category}`.toLocaleLowerCase("en").includes(normalizedQuery))
    : vehicles;

  return [...filtered].sort((left, right) => {
    if (sort === "price-low") return left.priceAedPerDay - right.priceAedPerDay || left.index - right.index;
    if (sort === "price-high") return right.priceAedPerDay - left.priceAedPerDay || left.index - right.index;
    if (sort === "name") return left.fullName.localeCompare(right.fullName, "en");
    return left.index - right.index;
  });
}
