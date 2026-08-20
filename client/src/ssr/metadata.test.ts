import { describe, expect, it } from "vitest";
import { getSsrHead } from "./metadata";

describe("server-side SEO metadata", () => {
  const origin = "https://zaverre.example";

  it("marks public catalogue and detail pages as indexable with canonical paths", () => {
    expect(getSsrHead("/cars", origin).canonicalPath).toBe("/cars");
    const vehicle = getSsrHead("/fleet/lamborghini-huracan-evo-spyder", origin);
    expect(vehicle.canonicalPath).toBe("/fleet/lamborghini-huracan-evo-spyder");
    expect(vehicle.schema?.["@type"]).toBe("Product");
  });

  it("keeps protected administration pages out of the index without returning 404", () => {
    const head = getSsrHead("/admin/vehicles", origin);
    expect(head.noindex).toBe(true);
    expect(head.notFound).toBeFalsy();
  });

  it("returns a real not-found contract for unknown public paths", () => {
    const head = getSsrHead("/fleet/not-a-real-vehicle", origin);
    expect(head.notFound).toBe(true);
    expect(head.noindex).toBe(true);
  });
});
