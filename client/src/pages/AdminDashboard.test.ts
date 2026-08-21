import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const pagesDirectory = dirname(fileURLToPath(import.meta.url));
const sourceRoot = join(pagesDirectory, "..");
const appSource = readFileSync(join(sourceRoot, "App.tsx"), "utf8");
const dashboardSource = readFileSync(join(sourceRoot, "components", "DashboardLayout.tsx"), "utf8");
const vehiclesSource = readFileSync(join(pagesDirectory, "AdminVehicles.tsx"), "utf8");
const contentSource = readFileSync(join(pagesDirectory, "AdminContent.tsx"), "utf8");
const bookingsSource = readFileSync(join(pagesDirectory, "AdminBookings.tsx"), "utf8");

describe("admin dashboard contracts", () => {
  it("registers each administration route behind the shared dashboard shell", () => {
    expect(appSource).toContain('path="/admin/content" component={AdminContent}');
    expect(appSource).toContain('path="/admin/vehicles" component={AdminVehicles}');
    expect(appSource).toContain('path="/admin/pricing" component={AdminVehicles}');
    expect(appSource).toContain('path="/admin/import" component={AdminVehicles}');
    expect(appSource).toContain('path="/admin/bookings" component={AdminBookings}');
    expect(contentSource).toContain("<DashboardLayout>");
    expect(vehiclesSource).toContain("<DashboardLayout>");
    expect(bookingsSource).toContain("<DashboardLayout>");
  });

  it("requires authentication and the administrator role before rendering dashboard data", () => {
    expect(dashboardSource).toContain("if (!user)");
    expect(dashboardSource).toContain("startLogin()");
    expect(dashboardSource).toContain('if (user.role !== "admin")');
    expect(dashboardSource).toContain("Admin access required");
    expect(dashboardSource).toContain("setOpenMobile(false)");
  });

  it("keeps content, vehicle media, pricing, and booking-status management wired to admin procedures", () => {
    expect(contentSource).toContain("cms.admin.saveJournal");
    expect(contentSource).toContain("cms.admin.deleteJournal");
    expect(contentSource).toContain("cms.admin.saveFaq");
    expect(vehiclesSource).toContain("vehicle.admin.saveContent");
    expect(vehiclesSource).toContain("vehicle.admin.uploadImage");
    expect(vehiclesSource).toContain("vehicle.admin.removeImage");
    expect(vehiclesSource).toContain("vehicle.admin.bulkUpdatePrices");
    expect(bookingsSource).toContain("cms.admin.updateBookingStatus");
  });
});
