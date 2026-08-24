import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const page = readFileSync(resolve(import.meta.dirname, "AdminFoundation.tsx"), "utf8");
const router = readFileSync(resolve(import.meta.dirname, "../App.tsx"), "utf8");

describe("admin foundation controls", () => {
  it("keeps the approved deposit policy and vehicle operational controls inside admin only", () => {
    expect(page).toContain("Default rule: AED 5,000, refundable within 25 days.");
    expect(page).toContain("trpc.foundation.saveDepositPolicy");
    expect(page).toContain("trpc.foundation.saveVehicleOperation");
    expect(router).toContain('path="/admin/foundation"');
  });
});
