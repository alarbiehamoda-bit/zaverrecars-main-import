import { existsSync, readFileSync } from "node:fs";
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
const packageManifest = read("package.json");

describe("performance delivery contracts", () => {
  it("uses optimized assets for the transparent global logo and primary hero", () => {
    expect(brandSource).toContain("zaverre-mark-gold-transparent_5b35d875.png");
    expect(brandSource).toContain("zaverre-mark-blue-transparent_e67bc456.png");
    expect(brandSource).toContain("zaverre-hero-orange-lamborghini-optimized_e9595c1a.webp");
  });

  it("defers non-critical imagery while prioritizing page-level visual content", () => {
    expect(vehicleSystemSource).toContain('decoding="async" loading={imageLoading} width="640" height="390"');
    expect(vehicleSystemSource).toContain('imageLoading = "lazy"');
    expect(journalSource).toContain('decoding="async" fetchPriority="high"');
    expect(gallerySource).toContain('loading="lazy" decoding="async"');
    expect(homeSource).not.toContain("brand.folioTexture");
  });

  it("preloads the site fonts while keeping the first public render typographically stable", () => {
    expect(indexTemplate).toContain('rel="preload" as="style"');
    expect(indexTemplate).toContain("display=swap");
    expect(indexTemplate).toContain('rel="stylesheet"');
    expect(indexTemplate).not.toContain('media="print"');
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

  it("keeps unused template chat and presentation packages out of the production dependency graph", () => {
    expect(existsSync(`${root}/client/src/components/AIChatBox.tsx`)).toBe(false);
    expect(existsSync(`${root}/client/src/components/ManusDialog.tsx`)).toBe(false);
    expect(existsSync(`${root}/client/src/components/ui/carousel.tsx`)).toBe(false);
    expect(existsSync(`${root}/client/src/components/ui/chart.tsx`)).toBe(false);
    expect(packageManifest).not.toContain('"streamdown"');
    expect(packageManifest).not.toContain('"recharts"');
    expect(packageManifest).not.toContain('"embla-carousel-react"');
  });
});
