import { describe, expect, it } from "vitest";
import { getRouteSeo, knownPublicRoute } from "./routeSeo";
import { isUsablePublicImage } from "./sharingPreview";

describe("route SEO metadata", () => {
  const origin = "https://zafirresto-7drjfdgb.manus.space";
  it("builds unique, fact-based metadata for a vehicle and an article", () => {
    const home = getRouteSeo("/", origin);
    const vehicle = getRouteSeo("/fleet/aston-martin-dbx-707", origin);
    const article = getRouteSeo("/journal/ferrari-lamborghini-rental-guide-dubai", origin);
    expect(vehicle.title).toContain("Aston Martin DBX 707");
    expect(vehicle.image).toBeTruthy();
    expect((vehicle.schema?.offers as { availability?: string } | undefined)?.availability).toBeUndefined();
    expect(article.title).toContain("Ferrari or Lamborghini");
    expect(article.schema?.["@type"]).toBe("BlogPosting");
    expect(home.title).toContain("Luxury Car Rental Dubai");
    expect(home.schema?.["@graph"]).toEqual(expect.arrayContaining([expect.objectContaining({ "@type": "AutoRental" })]));
  });
  it("applies project and page-level sharing overrides with a safe fallback", () => {
    const custom = { projectTitle: "ZAVERRE Share", projectDescription: "Direct luxury arrivals in Dubai.", projectImageUrl: "https://cdn.example.com/zaverre-share.png", logoUrl: "/manus-storage/logo.png", pages: { "/cars": { title: "Browse ZAVERRE Cars", description: "Choose your next arrival.", imageUrl: "/manus-storage/cars-share.png" } } };
    expect(getRouteSeo("/cars", origin, custom).title).toBe("Browse ZAVERRE Cars");
    expect(getRouteSeo("/cars", origin, custom).image).toBe("/manus-storage/cars-share.png");
    expect(getRouteSeo("/fleet/aston-martin-dbx-707", origin, custom).image).toBe("https://cdn.example.com/zaverre-share.png");
    expect(isUsablePublicImage("data:image/png;base64,invalid")).toBe(false);
    expect(isUsablePublicImage("http://example.com/image.png")).toBe(false);
    expect(isUsablePublicImage("https://example.com/image.png")).toBe(true);
  });
  it("marks only unknown and management routes as noindex", () => {
    expect(getRouteSeo("/admin/vehicles", origin).noindex).toBe(true);
    expect(getRouteSeo("/not-real", origin).noindex).toBe(true);
    expect(knownPublicRoute("/cars/ferrari")).toBe(true);
    expect(knownPublicRoute("/fleet/not-real")).toBe(false);
  });
});
