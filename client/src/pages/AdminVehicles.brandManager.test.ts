import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AdminVehicles.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("../../../server/routers/brand.ts", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../components/DashboardLayout.tsx", import.meta.url), "utf8");

describe("brand manager control room", () => {
  it("provides searchable brand controls, public visibility, previews, and live route access", () => {
    expect(source).toContain('location.startsWith("/admin/brands")');
    expect(source).toContain("brand-manager-summary");
    expect(source).toContain("brand-manager-toolbar");
    expect(source).toContain("toggleBrandVisibility");
    expect(source).toContain("brandRouteSlug(brand.brandName)");
  });

  it("accepts a transparent SVG logo alongside raster brand logo formats", () => {
    expect(source).toContain("image/svg+xml");
    expect(routerSource).toContain('"image/svg+xml"');
    expect(routerSource).toContain('return "svg"');
  });

  it("exposes a ZAVERRE-styled protected administration entry point", () => {
    expect(layoutSource).toContain("admin-auth-gate");
    expect(layoutSource).toContain("ZAVERRE / MANAGEMENT");
    expect(layoutSource).toContain("Brand manager");
  });
});
