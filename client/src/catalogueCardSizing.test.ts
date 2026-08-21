import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./vehicle-glass.css", import.meta.url), "utf8");

describe("catalogue card sizing", () => {
  it("uses a consistent footprint for homepage and fleet catalogue cards", () => {
    expect(styles).toContain("Catalogue card rhythm");
    expect(styles).toContain(".featured-vehicle-card");
    expect(styles).toContain(".master-vehicle-grid--vertical");
    expect(styles).toContain("height: 620px !important");
    expect(styles).toContain("height: 570px !important");
  });

  it("removes the visual AED caption, preserves comfortable mobile controls, and uses an orange dirham mark", () => {
    expect(styles).toContain(".vehicle-card .card-rate__currency");
    expect(styles).toContain("flex-basis: 28px");
    expect(styles).toContain("flex-basis: 24px");
    expect(styles).toContain(".fleet-browse-page .master-vehicle-grid--vertical .vehicle-image-wrap { aspect-ratio: 16 / 9");
    expect(styles).toContain(".vehicle-card .vehicle-brand-ribbon { margin-bottom: 10px; min-height: 51px");
    expect(styles).toContain(".vehicle-card .card-actions { flex: 0 0 48px");
    expect(styles).toContain(".vehicle-card .card-whatsapp { flex: 0 0 40px");
    expect(styles).toContain(".vehicle-card .card-rate .dirham-mark");
    expect(styles).toContain("#ef7d2c");
  });

  it("uses one primary-card model across catalogue contexts after removing the duplicate enquiry row", () => {
    expect(styles).toContain("Unified primary-card geometry");
    expect(styles).toContain(".detail-related-master-card");
    expect(styles).toContain("height: 620px !important");
    expect(styles).toContain("height: 570px !important");
    expect(styles).toContain(".vehicle-brand-ribbon__identity i");
  });
});
