import { vehicleCatalog, type Vehicle } from "@/config/vehicleCatalog";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function vehicleSlug(vehicle: Vehicle) {
  const matchingModels = vehicleCatalog.filter(
    (item) => item.brand === vehicle.brand && item.model === vehicle.model,
  );
  const base = `${normalize(vehicle.brand)}-${normalize(vehicle.model)}`;
  if (matchingModels.length === 1) return base;
  return `${base}-${normalize(vehicle.color || String(vehicle.index))}`;
}

export function vehicleFromSlug(slug: string | undefined) {
  return vehicleCatalog.find((vehicle) => vehicleSlug(vehicle) === slug);
}

export function readStringArray(serialized?: string | null) {
  if (!serialized) return [] as string[];
  try {
    const parsed: unknown = JSON.parse(serialized);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [];
  } catch {
    return [];
  }
}

export function readDetailPairs(serialized?: string | null) {
  if (!serialized) return [] as Array<{ label: string; value: string }>;
  try {
    const parsed: unknown = JSON.parse(serialized);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (
        item &&
        typeof item === "object" &&
        "label" in item &&
        "value" in item &&
        typeof item.label === "string" &&
        typeof item.value === "string" &&
        item.label.trim() &&
        item.value.trim()
      ) {
        return [{ label: item.label, value: item.value }];
      }
      return [];
    });
  } catch {
    return [];
  }
}

export function completePublicDetailPairs(items: Array<{ label: string; value: string }>) {
  return items.filter((item, index, entries) => entries.findIndex((candidate) => candidate.label === item.label) === index);
}

export const displayPrice = (value: number) =>
  new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(value);
