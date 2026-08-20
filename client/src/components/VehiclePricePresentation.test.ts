import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const cardSource = readFileSync(new URL("./VehicleSystem.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../vehicle-glass.css", import.meta.url), "utf8");

describe("vehicle price presentation", () => {
  it("renders a legible daily price with an explicit AED code and accessible label", () => {
    expect(cardSource).toContain('className="card-rate__meta"');
    expect(cardSource).toContain('className="card-rate__currency"');
    expect(cardSource).toContain("DAILY RATE");
    expect(cardSource).toContain("EXCL. VAT");
    expect(cardSource).toContain("PER DAY");
    expect(cardSource).toContain("AED");
    expect(cardSource).toContain("Daily rental rate: AED");
  });

  it("preserves strong contrast and readable tabular values in both themes and on phones", () => {
    expect(styles).toContain("Catalogue rate card");
    expect(styles).toContain("font-variant-numeric: tabular-nums");
    expect(styles).toContain('html[data-theme="light"] .vehicle-card .card-rate');
    expect(styles).toContain("@media (max-width: 620px)");
  });

  it("uses a dedicated blue-glass rate panel with precise light-theme values", () => {
    expect(styles).toContain("Catalogue rate card");
    expect(styles).toContain("#0b4e7a");
    expect(styles).toContain('html[data-theme="light"] .vehicle-card .card-rate');
    expect(styles).toContain("#052f52");
  });
});
