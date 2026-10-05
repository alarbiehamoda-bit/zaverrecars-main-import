import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/BookingIntentDialog.tsx"), "utf8");

describe("booking intent dialog", () => {
  it("captures the lead before opening WhatsApp and includes a tracking reference", () => {
    expect(source).toContain("CONTINUE TO WHATSAPP");
    expect(source).toContain("window.open");
    expect(source).toContain("trpc.vehicle.createBooking.useMutation");
    expect(source).toContain("trackingId");
    expect(source).toContain("utmCampaign");
    expect(source).toContain("vehicleKey: subject.vehicleKey");
  });
});
