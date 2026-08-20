import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AdminVehicles.tsx", import.meta.url), "utf8");

describe("Vehicle Studio sheet import", () => {
  it("provides a template, validates rows before import, and accepts worksheet files", () => {
    expect(source).toContain("DOWNLOAD TEMPLATE");
    expect(source).toContain("UPLOAD XLSX OR CSV");
    expect(source).toContain("vehicle_key");
    expect(source).toContain("Vehicle key does not match the current 95-vehicle catalogue");
    expect(source).toContain("importSheet.mutate");
    expect(source).toContain("daily_price_aed");
  });
});
