import { describe, expect, it } from "vitest";
import { resolveVehicleImageSettings, vehicleCatalog } from "./vehicleCatalog";

describe("vehicle card image settings", () => {
  it("preserves each catalogue image at its original ratio and documented angle", () => {
    vehicleCatalog.forEach((vehicle) => {
      const settings = resolveVehicleImageSettings(vehicle.imageSettings);
      expect(settings).toMatchObject({
        fit: "contain",
        position: "center",
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      });
    });
  });

  it("allows only the framing values a vehicle needs to override", () => {
    expect(resolveVehicleImageSettings({ position: "top", scale: 0.96, offsetY: -3 })).toMatchObject({
      fit: "contain",
      position: "top",
      scale: 0.96,
      offsetX: 0,
      offsetY: -3,
    });
  });
});
