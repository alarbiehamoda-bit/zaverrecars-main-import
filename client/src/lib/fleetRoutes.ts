import { vehicleBrands } from "@/config/vehicleCatalog";
import { fleetCategoryFromSlug } from "@/lib/fleetPresentation";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const brandRouteSlug = (brandName: string) => normalize(brandName);
export const brandFromRouteSlug = (slug?: string) => vehicleBrands.find((brandName) => brandName !== "All" && brandRouteSlug(brandName) === slug);
export const categoryFromRouteSlug = (slug?: string) => fleetCategoryFromSlug(slug);
