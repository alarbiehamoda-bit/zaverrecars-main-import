import { describe, expect, it } from "vitest";
import { capabilityAllows } from "./foundationAccess";

describe("foundation capability policy", () => {
  it("allows a direct capability and a system-wide administrator capability", () => {
    expect(capabilityAllows(["operations.read"], "operations.read")).toBe(true);
    expect(capabilityAllows(["manage.all"], "deposit.write")).toBe(true);
  });

  it("does not grant sensitive deposit access from an unrelated role", () => {
    expect(capabilityAllows(["content.write"], "deposit.read")).toBe(false);
  });
});
