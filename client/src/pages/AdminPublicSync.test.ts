import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const detail = readFileSync(new URL("./VehicleDetail.tsx", import.meta.url), "utf8");
const content = readFileSync(new URL("./AdminContent.tsx", import.meta.url), "utf8");
const floatingRail = readFileSync(new URL("../components/FloatingContactRail.tsx", import.meta.url), "utf8");
const vehicles = readFileSync(new URL("./AdminVehicles.tsx", import.meta.url), "utf8");
const assistant = readFileSync(new URL("../../../server/routers/adminAssistant.ts", import.meta.url), "utf8");

describe("administration to public-site synchronization", () => {
  it("uses managed brand data in both public brand surfaces", () => {
    expect(home).toContain("brands={managedBrands}");
    expect(detail).toContain("useManagedVehicleCatalog");
    expect(detail).toContain("return managedCatalog");
  });

  it("uses the CMS source for global and vehicle-detail contact actions", () => {
    expect(floatingRail).toContain("useCmsContent");
    expect(floatingRail).toContain("whatsappHref(contact, message)");
    expect(detail).toContain("const { contact } = useCmsContent()");
    expect(detail).toContain("whatsappHref(contact, safeMessage(vehicle))");
  });

  it("invalidates the public CMS query after each content-editor save", () => {
    expect(content).toContain("utils.cms.public.invalidate()");
    expect(content).toContain("Public source connected.");
    expect(content).toContain("Public source is empty.");
  });

  it("keeps AI requests as review-only proposals routed to an editor", () => {
    expect(vehicles).toContain("openAssistantAction");
    expect(assistant).toContain("requiresApproval: z.literal(true)");
    expect(assistant).toContain("Never claim that a change was already applied");
  });
});
