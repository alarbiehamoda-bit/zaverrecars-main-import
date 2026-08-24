import { describe, expect, it } from "vitest";
import { getRouteSeo, knownPublicRoute } from "./routeSeo";

describe("route SEO metadata", () => {
  const origin = "https://zafirresto-7drjfdgb.manus.space";
  it("builds unique, fact-based metadata for a vehicle and an article", () => {
    const home = getRouteSeo("/", origin);
    const vehicle = getRouteSeo("/fleet/aston-martin-dbx-707", origin);
    const article = getRouteSeo("/journal/ferrari-lamborghini-rental-guide-dubai", origin);
    expect(vehicle.title).toContain("Aston Martin DBX 707");
    expect(vehicle.image).toBeTruthy();
    expect(article.title).toContain("Ferrari or Lamborghini");
    expect(article.schema?.["@type"]).toBe("BlogPosting");
    expect(home.title).toContain("Luxury Car Rental Dubai");
    expect(home.schema?.["@graph"]).toEqual(expect.arrayContaining([expect.objectContaining({ "@type": "AutoRental" })]));
  });
  it("marks only unknown and management routes as noindex", () => {
    expect(getRouteSeo("/admin/vehicles", origin).noindex).toBe(true);
    expect(getRouteSeo("/not-real", origin).noindex).toBe(true);
    expect(knownPublicRoute("/cars/ferrari")).toBe(true);
    expect(knownPublicRoute("/fleet/not-real")).toBe(false);
  });
});
