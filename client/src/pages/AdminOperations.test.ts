import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AdminOperations.tsx", import.meta.url), "utf8");
const router = readFileSync(new URL("../../../server/routers/operations.ts", import.meta.url), "utf8");
const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const db = readFileSync(new URL("../../../server/db.ts", import.meta.url), "utf8");

describe("operations cockpit", () => {
  it("reads its overview through an admin-protected operations router", () => {
    expect(source).toContain("trpc.operations.overview.useQuery");
    expect(source).toContain("trpc.cms.public.useQuery");
    expect(source).toContain("trpc.brand.publicPresentationList.useQuery");
    expect(source).toContain("PUBLIC DELIVERY");
    expect(source).toContain("AI review workflow");
    expect(source).toContain("No public settings are published yet");
    expect(router).toContain("adminProcedure.query");
    expect(router).toContain("getAdminOperationsSnapshot");
    expect(router).toContain("getAdminServiceHealth");
    expect(router).toContain("health: adminProcedure.query");
  });

  it("registers the operations cockpit as the default administration route", () => {
    expect(app).toContain('path="/admin" component={AdminOperations}');
    expect(source).toContain("Booking pipeline");
    expect(source).toContain("Brand workspace");
    expect(source).toContain("Pricing desk");
    expect(source).toContain("Catalogue import");
    expect(source).toContain("Review-led workflow");
  });

  it("derives booking metrics from the full operational set and limits only the visible queue", () => {
    expect(db).toContain("newBookings: bookings.filter");
    expect(db).toContain("recentBookings: bookings.slice(0, 8)");
    expect(db).toContain("getAdminServiceHealth");
  });
});
