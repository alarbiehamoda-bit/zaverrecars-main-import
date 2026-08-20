import { journalArticles } from "../client/src/config/homeContent";
import { vehicleCatalog, vehicleBrands } from "../client/src/config/vehicleCatalog";
import { brandFromRouteSlug, brandRouteSlug, categoryFromRouteSlug } from "../client/src/lib/fleetRoutes";
import { vehicleFromSlug, vehicleSlug } from "../client/src/lib/vehicleDetail";

const indexedCategories = ["performance", "luxury-suv", "convertibles"] as const;
const adminPaths = new Set(["/admin", "/admin/content", "/admin/vehicles", "/admin/bookings"]);

const normalizePath = (pathname: string) => pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
const xmlEscape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function getPublicSeoPaths() {
  const brands = vehicleBrands.filter((brand) => brand !== "All").map((brand) => `/cars/${brandRouteSlug(brand)}`);
  const categories = indexedCategories.map((category) => `/cars/category/${category}`);
  const vehicles = vehicleCatalog.map((vehicle) => `/fleet/${vehicleSlug(vehicle)}`);
  const articles = journalArticles.map((article) => `/journal/${article.slug}`);
  return ["/", "/cars", ...categories, ...brands, ...vehicles, ...articles];
}

export function isKnownApplicationPath(pathname: string) {
  const path = normalizePath(pathname);
  if (adminPaths.has(path) || path === "/" || path === "/cars" || path === "/404") return true;
  if (path.startsWith("/cars/category/")) return Boolean(categoryFromRouteSlug(path.slice("/cars/category/".length)));
  if (path.startsWith("/cars/")) return Boolean(brandFromRouteSlug(path.slice("/cars/".length)));
  if (path.startsWith("/fleet/")) return Boolean(vehicleFromSlug(path.slice("/fleet/".length)));
  if (path.startsWith("/journal/")) return journalArticles.some((article) => article.slug === path.slice("/journal/".length));
  return false;
}

export function robotsText(origin: string) {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`;
}

export function sitemapXml(origin: string) {
  const urls = getPublicSeoPaths().map((path) => `  <url><loc>${xmlEscape(`${origin}${path}`)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
