import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sourceRoot = resolve(process.cwd(), "client/src");

function read(relativePath: string) {
  return readFileSync(resolve(sourceRoot, relativePath), "utf8");
}

describe("ZAVERRE visual polish layer", () => {
  it("is loaded in both client and SSR entry points", () => {
    expect(read("entry-client.tsx")).toContain('import "./VisualPolish.css";');
    expect(read("entry-server.tsx")).toContain('import "./VisualPolish.css";');
  });

  it("stays presentation-only and covers the public showroom surfaces", () => {
    const css = read("VisualPolish.css");
    expect(css).toContain(".hero-cinematic");
    expect(css).toContain(".fleet-browse-page");
    expect(css).toContain(".master-vehicle-grid--vertical .vehicle-card");
    expect(css).toContain(".vehicle-detail-page");
    expect(css).toContain("larger names and a calmer showroom-card presentation");
    expect(css).toContain("color: #f1e7d8 !important");
    expect(css).toContain(".brand-filter-model-count");
    expect(css).toContain("#f5c84b");
    expect(css).toContain("Light mode copy correction: recolour blue sentences, not button surfaces.");
    expect(css).toContain("stroke: #fff !important");
    expect(css).toContain("display: none !important");
    expect(css).toContain("font-size: 13px");
    expect(css).toContain('html[data-theme="light"]');
    expect(css).toContain("prefers-reduced-motion");
    expect(css).not.toContain("visibility: hidden");
  });
});
