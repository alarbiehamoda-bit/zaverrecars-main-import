import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const schemaSource = readFileSync(resolve(process.cwd(), "drizzle/schema.ts"), "utf8");
const routerSource = readFileSync(resolve(process.cwd(), "server/routers/vehicle.ts"), "utf8");
const dialogSource = readFileSync(resolve(process.cwd(), "client/src/components/BookingIntentDialog.tsx"), "utf8");
const adminSource = readFileSync(resolve(process.cwd(), "client/src/pages/AdminBookings.tsx"), "utf8");

describe("lead capture integration contracts", () => {
  it("extends the existing booking enquiry model instead of creating a duplicate lead table", () => {
    expect(schemaSource).toContain('export const bookingEnquiries = mysqlTable("bookingEnquiries"');
    expect(schemaSource).toContain('"qualified", "converted"');
    expect(schemaSource).toContain("trackingId");
    expect(schemaSource).toContain("utmCampaign");
    expect(schemaSource).not.toContain("export const leads =");
  });

  it("captures source and attribution in the public mutation and carries the tracking ID to WhatsApp", () => {
    expect(routerSource).toContain("leadVehicleKey");
    expect(routerSource).toContain("trackingId");
    expect(routerSource).toContain("lead.created");
    expect(dialogSource).toContain("trpc.vehicle.createBooking.useMutation");
    expect(dialogSource).toContain("utmSource");
    expect(dialogSource).toContain("ZAVERRE enquiry ID");
  });

  it("exposes CRM status and activity timeline in the existing admin inbox", () => {
    expect(adminSource).toContain("LEAD_STATUSES");
    expect(adminSource).toContain("snapshot.data?.leadActivity");
    expect(adminSource).toContain("Lead status");
    expect(adminSource).toContain("WhatsApp follow-up");
  });
});
