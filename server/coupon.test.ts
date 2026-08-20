import { describe, expect, it } from "vitest";
import { createCouponCode, normaliseCouponPhone } from "./db";

describe("first-booking coupon helpers", () => {
  it("normalises a telephone number before the one-coupon check", () => {
    expect(normaliseCouponPhone("+971 50 123 4567")).toBe("971501234567");
  });

  it("rejects unusable telephone numbers", () => {
    expect(() => normaliseCouponPhone("123")).toThrow("valid phone number");
  });

  it("creates opaque coupon codes", () => {
    expect(createCouponCode()).toMatch(/^ZVR10-[A-F0-9]{8}$/);
  });
});
