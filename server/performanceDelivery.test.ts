import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(`${root}/${path}`, "utf8");
const brandSource = read("client/src/config/brand.ts");
const homeSource = read("client/src/pages/Home.tsx");
const journalSource = read("client/src/pages/JournalArticle.tsx");
const gallerySource = read("client/src/components/CarGallery.tsx");
const vehicleSystemSource = read("client/src/components/VehicleSystem.tsx");
const serverSource = read("server/_core/index.ts");
const viteSource = read("server/_core/vite.ts");
const viteConfigSource = read("vite.config.ts");
const storageProxySource = read("server/_core/storageProxy.ts");
const indexTemplate = read("client/index.html");

describe("performance delivery contracts", () => {
  it("uses optimized WebP assets for the global logo and primary hero", () => {
    expect(brandSource).toContain("zaverre-logo-transparent-optimized_c58adddb.webp");
    expect(brandSource).toContain("zaverre-hero-orange-lamborghini-optimized_e9595c1a.webp");
  });

  it("defers non-critical imagery while prioritizing page-level visual content", () => {
    expect(vehicleSystemSource).toContain('decoding="async" loading={imageLoading} width="640" height="390"');
    expect(vehicleSystemSource).toContain('imageLoading = "lazy"');
    expect(journalSource).toContain('decoding="async" fetchPriority="high"');
    expect(gallerySource).toContain('loading="lazy" decoding="async"');
    expect(homeSource).not.toContain("brand.folioTexture");
  });

  it("loads the site fonts without blocking first paint", () => {
    expect(indexTemplate).toContain('rel="preload" as="style"');
    expect(indexTemplate).toContain("display=swap");
    expect(indexTemplate).toContain('media="print"');
  });

  it("enables Brotli-capable compression and long-lived immutable static asset caching", () => {
    expect(serverSource).toContain("compression({ threshold: 1024");
    expect(serverSource).toContain("BROTLI_PARAM_QUALITY");
    expect(viteSource).toContain('maxAge: "1y", immutable: true');
    expect(viteSource).toContain('rel="preload" as="image"');
    expect(viteConfigSource).toContain("catalogue: [");
    expect(viteConfigSource).toContain("const isProductionBuild");
    expect(storageProxySource).toContain('public, max-age=900');
  });
});
