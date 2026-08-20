import { describe, expect, it } from "vitest";
import { getPublicSeoPaths, isKnownApplicationPath, robotsText, sitemapXml } from "./seo";

describe("public SEO route inventory", () => {
  const origin = "https://zafirresto-7drjfdgb.manus.space";

  it("lists only public canonical routes in the sitemap", () => {
    const paths = getPublicSeoPaths();
    expect(paths).toContain("/");
    expect(paths).toContain("/cars");
    expect(paths).toContain("/cars/ferrari");
    expect(paths).toContain("/cars/category/luxury-suv");
    expect(paths).toContain("/cars/category/convertibles");
    expect(paths).toContain("/fleet/aston-martin-dbx-707");
    expect(paths).toContain("/journal/ferrari-lamborghini-rental-guide-dubai");
    expect(paths.some((path) => path.startsWith("/admin"))).toBe(false);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("generates a crawl policy and XML sitemap for public routes only", () => {
    expect(robotsText(origin)).toContain("Disallow: /admin");
    expect(robotsText(origin)).toContain(`Sitemap: ${origin}/sitemap.xml`);
    expect(sitemapXml(origin)).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemapXml(origin)).toContain(`${origin}/fleet/aston-martin-dbx-707`);
    expect(sitemapXml(origin)).not.toContain(`${origin}/admin`);
  });

  it("recognizes valid routes while rejecting unknown public slugs", () => {
    expect(isKnownApplicationPath("/cars")).toBe(true);
    expect(isKnownApplicationPath("/cars/ferrari")).toBe(true);
    expect(isKnownApplicationPath("/fleet/aston-martin-dbx-707")).toBe(true);
    expect(isKnownApplicationPath("/admin/vehicles")).toBe(true);
    expect(isKnownApplicationPath("/fleet/not-a-real-car")).toBe(false);
    expect(isKnownApplicationPath("/this-page-does-not-exist")).toBe(false);
  });
});
