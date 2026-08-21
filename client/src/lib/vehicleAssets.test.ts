import { describe, expect, it } from "vitest";
import { galleryAssetKey } from "./vehicleAssets";

describe("galleryAssetKey", () => {
  it("treats relative and absolute storage URLs for the same image as one gallery asset", () => {
    expect(galleryAssetKey("/manus-storage/audi-r8.jpg")).toBe(
      galleryAssetKey("https://luxcarrent-fy6ozqfy.manus.space/manus-storage/audi-r8.jpg"),
    );
  });

  it("ignores transient query parameters when comparing gallery images", () => {
    expect(galleryAssetKey("https://example.com/car.jpg?signature=one")).toBe(
      galleryAssetKey("https://example.com/car.jpg?signature=two"),
    );
  });
});
