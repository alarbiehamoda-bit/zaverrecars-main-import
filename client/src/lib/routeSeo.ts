import { journalArticles } from "@/config/homeContent";
import { vehicleCatalog } from "@/config/vehicleCatalog";
import { brand } from "@/config/brand";
import { brandFromRouteSlug, categoryFromRouteSlug } from "@/lib/fleetRoutes";
import { vehicleFromSlug } from "@/lib/vehicleDetail";

const siteName = "ZAVERRE";
const fallbackDescription = "Explore ZAVERRE's curated luxury car rental collection in Dubai, including exotic cars, performance SUVs and direct availability enquiries.";

function dubaiAutoRentalSchema(url: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRental",
        "@id": `${url}#auto-rental`,
        name: siteName,
        url,
        image: brand.heroTexture,
        description: fallbackDescription,
        areaServed: { "@type": "City", name: "Dubai" },
        knowsAbout: ["Luxury car rental", "Exotic car rental", "Supercar rental"],
        priceRange: "AED",
      },
      { "@type": "WebSite", "@id": `${url}#website`, name: siteName, url, inLanguage: "en" },
    ],
  };
}

export type RouteSeo = {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
  schema?: Record<string, unknown>;
};

export function getRouteSeo(pathname: string, origin: string): RouteSeo {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const url = `${origin}${path}`;
  if (path === "/") {
    return {
      title: "Luxury Car Rental Dubai | Exotic & Supercars | ZAVERRE",
      description: fallbackDescription,
      image: brand.heroTexture,
      schema: dubaiAutoRentalSchema(url),
    };
  }
  if (path === "/cars") {
    return {
      title: "Luxury & Exotic Cars for Rent in Dubai | ZAVERRE",
      description: "Browse ZAVERRE's current luxury cars, performance SUVs, convertibles and exotic cars for rental enquiries in Dubai.",
      schema: { "@context": "https://schema.org", "@type": "CollectionPage", name: "ZAVERRE Car Collection", url },
    };
  }
  if (path.startsWith("/cars/category/")) {
    const category = categoryFromRouteSlug(path.slice("/cars/category/".length));
    if (category) {
      return {
        title: `${category.label} for Rent in Dubai | ZAVERRE`,
        description: `Browse the current ZAVERRE collection of ${category.label.toLowerCase()} available for direct rental enquiries in Dubai.`,
        schema: { "@context": "https://schema.org", "@type": "CollectionPage", name: `ZAVERRE ${category.label}`, url },
      };
    }
  }
  if (path.startsWith("/cars/")) {
    const brand = brandFromRouteSlug(path.slice("/cars/".length));
    if (brand) {
      return {
        title: `${brand} Rental in Dubai | ZAVERRE`,
        description: `Browse the current ZAVERRE ${brand} collection and enquire directly about availability and daily rental details in Dubai.`,
        schema: { "@context": "https://schema.org", "@type": "CollectionPage", name: `ZAVERRE ${brand} Collection`, url },
      };
    }
  }
  if (path.startsWith("/fleet/")) {
    const vehicle = vehicleFromSlug(path.slice("/fleet/".length));
    if (vehicle) {
      const description = vehicle.description || `${vehicle.fullName} is available from ZAVERRE for a direct luxury car rental enquiry in Dubai.`;
      return {
        title: `${vehicle.fullName} Rental in Dubai | ZAVERRE`,
        description,
        image: vehicle.image,
        schema: {
          "@context": "https://schema.org",
          "@type": "Product",
          name: vehicle.fullName,
          description,
          image: toAbsoluteUrl(vehicle.image, origin),
          category: vehicle.category,
          url,
          offers: {
            "@type": "Offer",
            priceCurrency: "AED",
            price: vehicle.priceAedPerDay,
            url,
          },
        },
      };
    }
  }
  if (path.startsWith("/journal/")) {
    const article = journalArticles.find((item) => item.slug === path.slice("/journal/".length));
    if (article) {
      return {
        title: `${article.title} | ZAVERRE Journal`,
        description: article.summary,
        image: article.image,
        schema: { "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description: article.summary, image: toAbsoluteUrl(article.image, origin), mainEntityOfPage: url, publisher: { "@type": "Organization", name: siteName, url: origin } },
      };
    }
  }
  if (path.startsWith("/admin")) return { title: "ZAVERRE Management", description: "Protected ZAVERRE management area.", noindex: true };
  return { title: "Page not found | ZAVERRE", description: fallbackDescription, noindex: true };
}

export function toAbsoluteUrl(value: string, origin: string) {
  try { return new URL(value, origin).toString(); } catch { return origin; }
}

export function knownPublicRoute(pathname: string) {
  const route = getRouteSeo(pathname, "https://example.com");
  return !route.noindex && (pathname === "/" || pathname === "/cars" || pathname.startsWith("/cars/") || pathname.startsWith("/fleet/") || pathname.startsWith("/journal/"));
}

export const seoVehicleCount = vehicleCatalog.length;
