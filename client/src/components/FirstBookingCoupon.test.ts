import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./FirstBookingCoupon.tsx", import.meta.url), "utf8");
const detailStyles = readFileSync(new URL("../vehicle-glass.css", import.meta.url), "utf8");

describe("FirstBookingCoupon", () => {
  it("uses the public coupon mutation and states the one-phone rule", () => {
    expect(source).toContain("trpc.coupon.requestFirstBooking.useMutation()");
    expect(source).toContain("One coupon per phone number");
    expect(source).toContain("10% OFF");
    expect(detailStyles).toContain("The fixed first-booking coupon must never obscure a vehicle's public rate.");
    expect(detailStyles).toContain(".vehicle-detail-page .detail-price-panel,");
    expect(detailStyles).toContain("z-index: 43;");
  });
});
