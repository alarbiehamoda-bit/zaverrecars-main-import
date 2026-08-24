import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const stylesheet = readFileSync(join(currentDirectory, "mobile.css"), "utf8");

describe("mobile presentation rules", () => {
  it("keeps the brand assets, hero content, and cards compact on phones", () => {
    expect(stylesheet).toContain("/* Mobile clarity pass");
    expect(stylesheet).toContain(".brand-mark { background: #12110f");
    expect(stylesheet).toContain(".hero-cta .button { font-size: 9px");
    expect(stylesheet).toContain(".vehicle-card-body h3, .featured-vehicle-card .vehicle-card-body h3 { font-size: 1.6rem");
    expect(stylesheet).toContain("/* Mobile comfort scale");
    expect(stylesheet).toContain(".horizontal-fleet .vehicle-card, .vertical-fleet .vehicle-card, .brand-stack-card .vehicle-card, .brand-free-scroll-card .vehicle-card { height: 484px");
    expect(stylesheet).toContain(".fleet-browse-page .master-vehicle-grid--vertical { gap: 9px !important; max-width: 302px !important;");
    expect(stylesheet).toContain("Medium phone scale");
    expect(stylesheet).toContain(".vehicle-detail-page .detail-related-grid--carousel .detail-related-master-card { height: 600px");
    expect(stylesheet).toContain("Compact-plus phone scale");
    expect(stylesheet).toContain(".vehicle-detail-page .detail-related-grid--carousel .detail-related-master-card { height: 540px");
  });

  it("centres fleet-detail content with the established display font", () => {
    expect(stylesheet).toContain(".detail-spec-grid--iconic > div, .detail-rental-grid > div");
    expect(stylesheet).toContain("text-align: center !important;");
    expect(stylesheet).toContain('font-family: "Cormorant Garamond", Georgia, serif !important;');
    expect(stylesheet).toContain(".detail-spec-grid--iconic > div { grid-template-columns: 1fr !important; }");
  });

  it("compacts vehicle-detail content without targeting the gallery in the final density pass", () => {
    expect(stylesheet).toContain("Detail-page phone density");
    expect(stylesheet).toContain(".vehicle-detail-page .detail-intro h1 { font-size: clamp(34px, 9.8vw, 43px)");
    expect(stylesheet).toContain(".vehicle-detail-page .detail-spec-grid--iconic > div,");
    expect(stylesheet).toContain(".vehicle-detail-page .detail-final-cta");
    expect(stylesheet).toContain("excludes .detail-gallery");
  });
});
