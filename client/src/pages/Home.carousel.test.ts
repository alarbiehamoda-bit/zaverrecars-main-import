import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const homeSource = source("client/src/pages/Home.tsx");
const systemSource = source("client/src/components/VehicleSystem.tsx");
const fleetSource = source("client/src/pages/FleetBrowse.tsx");
const appSource = source("client/src/App.tsx");
const detailSource = source("client/src/pages/VehicleDetail.tsx");

describe("unified vehicle system safeguards", () => {
  it("keeps the homepage three featured cards tied to the master card component", () => {
    expect(homeSource).toContain("function FeaturedVehicles");
    expect(homeSource).toContain("featuredVehicleIds");
    expect(homeSource).toContain("cms.featuredVehicleKeys");
    expect(homeSource).toContain("vehicles.length !== 3");
    expect(homeSource).toContain("<VehicleCard vehicle={vehicle}");
  });

  it("centralizes vehicle image settings, actions, marque marks, and the verified-source fallback", () => {
    expect(systemSource).toContain("export function VehicleCard");
    expect(systemSource).toContain("resolveVehicleImageSettings");
    expect(systemSource).toContain("export function BrandMark");
    expect(systemSource).toContain("<BrandMark brandName={vehicle.brand}");
    expect(systemSource).toContain("VERIFIED SOURCE");
    expect(systemSource).toContain("TEMPORARILY UNAVAILABLE");
    expect(systemSource).toContain("BOOK NOW");
    expect(systemSource).toContain("VIEW DETAILS + PHOTOS");
    expect(systemSource).not.toContain("WHATSAPP ENQUIRY");
  });

  it("uses one brand filter component for all cars, brand pages, and the homepage navigation", () => {
    expect(systemSource).toContain("export function BrandFilterRail");
    expect(fleetSource).toContain("<BrandFilterRail activeBrand={activeBrand || \"All\"}");
    expect(homeSource).toContain('<BrandFilterRail activeBrand=""');
    expect(homeSource).toContain('brandName === "All" ? "/cars"');
  });

  it("provides dedicated all-cars and brand routes using the managed brand registry", () => {
    expect(appSource).toContain('path="/cars"');
    expect(appSource).toContain('path="/cars/:brandSlug"');
    expect(fleetSource).toContain("brands.find");
    expect(fleetSource).toContain("brands={brands}");
    expect(fleetSource).toContain("brandRouteSlug");
  });

  it("keeps public routes synchronous for SSR hydration while administration remains deferred", () => {
    expect(appSource).toContain('import FleetBrowse from "./pages/FleetBrowse"');
    expect(appSource).toContain('import VehicleDetail from "./pages/VehicleDetail"');
    expect(appSource).toContain('import JournalArticle from "./pages/JournalArticle"');
    expect(appSource).toContain('lazy(() => import("./pages/AdminVehicles"))');
    expect(appSource).toContain("<Suspense");
  });

  it("uses the master grid in fleet views and a dedicated horizontal carousel in related-vehicle sections", () => {
    expect(systemSource).toContain("export function MasterVehicleGrid");
    expect(systemSource).toContain('className="featured-vehicle-card master-vehicle-card"');
    expect(fleetSource).toContain("<MasterVehicleGrid vehicles={vehicles}");
    expect(detailSource).toContain("function RelatedVehicleCarousel");
    expect(detailSource).toContain("detail-related-grid--carousel");
    expect(detailSource).toContain("RelatedVehicleCarousel vehicles={similarVehicles}");
    expect(detailSource).toContain("detail-related-master-card");
  });

  it("routes booking actions through direct WhatsApp contact without an inline request form or duplicate card enquiry row", () => {
    expect(homeSource).not.toContain('id="booking"');
    expect(homeSource).toContain("const openGeneralEnquiry");
    expect(homeSource).toContain("window.open(whatsappHref(managedContact, vehicleMessage(vehicle))");
    expect(fleetSource).toContain("window.open(whatsappUrl(`Hello ZAVERRE, I would like to reserve the ${vehicle.fullName}");
    expect(systemSource).toContain("onBook(vehicle)");
    expect(systemSource).not.toContain("whatsappUrl(vehicleMessage(vehicle))");
  });

  it("keeps the active related-vehicle carousel drag-safe on mouse and touch input", () => {
    expect(systemSource).toContain("const startDrag = (event: ReactPointerEvent<HTMLDivElement>)");
    expect(systemSource).toContain("pointerId: event.pointerId");
    expect(systemSource).toContain("const moveDrag = (event: ReactPointerEvent<HTMLDivElement>)");
    expect(systemSource).toContain("event.preventDefault();");
  });
});
