import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUp, ChevronLeft, MessageCircle, Phone, Search } from "lucide-react";
import { useLocation } from "wouter";
import "./FleetBrowse.css";
import { ZaverreMark } from "@/components/ZaverreMark";
import { vehicleFilterBrands, type Vehicle } from "@/config/vehicleCatalog";
import { useManagedVehicleCatalog } from "@/hooks/useManagedVehicleCatalog";
import { BrandFilterRail, BrandMark, MasterVehicleGrid } from "@/components/VehicleSystem";
import { PublicMobileMenu } from "@/components/PublicMobileMenu";
import { BookingIntentDialog, type BookingIntentSubject } from "@/components/BookingIntentDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { brandRouteSlug } from "@/lib/fleetRoutes";
import { fleetCategoryFromSlug } from "@/lib/fleetPresentation";
import { vehicleSlug } from "@/lib/vehicleDetail";
import { contact, whatsappUrl } from "@/config/contact";

const fleetReturnStorageKey = "zaverre.return-to-fleet";

type FleetReturnTarget = {
  fleetPath: string;
  vehicleId: string;
};

function restoreVehicleCard(vehicleId: string) {
  const card = document.getElementById(`vehicle-card-${vehicleId}`);
  const pageScroller = document.scrollingElement;
  if (!card || !pageScroller) return false;

  const targetTop = Math.max(0, pageScroller.scrollTop + card.getBoundingClientRect().top - window.innerHeight * 0.22);
  pageScroller.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = targetTop;
  document.body.scrollTop = targetTop;
  window.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
  window.requestAnimationFrame(() => window.scrollTo({ top: targetTop, left: 0, behavior: "auto" }));
  return true;
}

export default function FleetBrowse() {
  const { theme } = useTheme();
  const { catalog: vehicleCatalog, brands } = useManagedVehicleCatalog();
  const [location, navigate] = useLocation();
  const fleetPath = location.split("?")[0];
  const pathSegments = fleetPath.split("/").filter(Boolean);
  const isCategoryRoute = pathSegments[1] === "category";
  const brandSlug = isCategoryRoute ? undefined : pathSegments[1];
  const categorySlug = isCategoryRoute ? pathSegments[2] : undefined;
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [bookingTarget, setBookingTarget] = useState<BookingIntentSubject | null>(null);
  const [vehicleNameQuery, setVehicleNameQuery] = useState("");
  const activeBrand = brandSlug ? brands.find((brand) => brandRouteSlug(brand.brandName) === brandSlug)?.brandName : undefined;
  const activeBrandMeta = activeBrand ? brands.find((brand) => brand.brandName === activeBrand) : undefined;
  const activeCategory = fleetCategoryFromSlug(categorySlug);
  const activeBrandCount = activeBrand ? vehicleCatalog.filter((vehicle) => vehicle.brand === activeBrand || vehicleFilterBrands(vehicle).includes(activeBrand)).length : 0;
  const collectionVehicles = useMemo(() => vehicleCatalog.filter((vehicle) => {
    const brandMatches = !activeBrand || vehicle.brand === activeBrand || vehicleFilterBrands(vehicle).includes(activeBrand);
    const categoryMatches = !activeCategory || vehicle.category === activeCategory.category;
    return brandMatches && categoryMatches;
  }).sort((a, b) => a.index - b.index), [activeBrand, activeCategory, vehicleCatalog]);
  const normalizedVehicleNameQuery = vehicleNameQuery.trim().toLocaleLowerCase();
  const vehicles = useMemo(() => collectionVehicles.filter((vehicle) => !normalizedVehicleNameQuery || vehicle.fullName.toLocaleLowerCase().includes(normalizedVehicleNameQuery)), [collectionVehicles, normalizedVehicleNameQuery]);
  const pageTitle = activeBrand || activeCategory?.label || "All cars";
  const collectionTransitionKey = activeBrand ? `brand-${brandRouteSlug(activeBrand)}` : activeCategory ? `category-${activeCategory.slug}` : "all-cars";

  const selectBrand = (brandName: string) => navigate(brandName === "All" ? "/cars" : `/cars/${brandRouteSlug(brandName)}`);
  const openBookingIntent = (vehicle?: Vehicle) => setBookingTarget(vehicle
    ? { label: vehicle.fullName, message: `Hello ZAVERRE, I would like to reserve the ${vehicle.fullName}. Please confirm availability and the final daily rate.` }
    : { label: "the ZAVERRE collection", message: "Hello ZAVERRE, I would like to enquire about the fleet. Please share availability and rental details." });
  const openVehicleDetails = (vehicle: Vehicle) => {
    const target: FleetReturnTarget = { fleetPath, vehicleId: vehicle.id };
    window.sessionStorage.setItem(fleetReturnStorageKey, JSON.stringify(target));
    navigate(`/fleet/${vehicleSlug(vehicle)}`);
  };
  const backToTop = () => {
    const pageScroller = document.scrollingElement;
    pageScroller?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  };

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 720);
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    return () => window.removeEventListener("scroll", updateBackToTop);
  }, []);

  useEffect(() => {
    const storedTarget = window.sessionStorage.getItem(fleetReturnStorageKey);
    if (!storedTarget) return;

    let target: FleetReturnTarget | null = null;
    try {
      target = JSON.parse(storedTarget) as FleetReturnTarget;
    } catch {
      window.sessionStorage.removeItem(fleetReturnStorageKey);
      return;
    }

    if (!target || target.fleetPath !== fleetPath || !vehicles.some((vehicle) => vehicle.id === target.vehicleId)) return;

    const restorationTimer = window.setTimeout(() => {
      if (restoreVehicleCard(target.vehicleId)) window.sessionStorage.removeItem(fleetReturnStorageKey);
    }, 120);

    return () => window.clearTimeout(restorationTimer);
  }, [fleetPath, vehicles]);

  if ((brandSlug && !activeBrand) || (categorySlug && !activeCategory)) {
    return <main className={`fleet-browse-page${theme === "light" ? " zaverre-day" : ""}`}><a className="fleet-browse-back" href="/cars" onClick={(event) => { event.preventDefault(); navigate("/cars"); }}><ChevronLeft size={17} /> BACK TO ALL CARS</a><div className="fleet-browse-empty"><p className="eyebrow">ZAVERRE COLLECTION</p><h1>Brand not found.</h1></div></main>;
  }

  return <main id="main-content" className={`fleet-browse-page${theme === "light" ? " zaverre-day" : ""}`}>
    <header className="fleet-browse-header">
      <div className="brand-lockup" aria-label="ZAVERRE"><ZaverreMark className="brand-mark" /><span>ZAVERRE</span></div>
      <div className="fleet-header-actions"><PublicMobileMenu onBook={() => openBookingIntent()} /><button className="header-book" onClick={() => openBookingIntent()}>BOOK NOW <ArrowDownRight size={16} /></button></div>
    </header>
    {activeBrand && <section className="brand-name-bar" aria-label={`${activeBrand} brand name`}><strong>{activeBrand}</strong></section>}
    <section className={`fleet-browse-hero${activeBrand ? " fleet-browse-hero--brand" : ""}`}>
      <div className="fleet-browse-hero-copy">
        {activeBrand ? <div className="fleet-browse-brand-information"><div className="fleet-browse-brand-logo brand-emblem-well brand-emblem-well--hero"><BrandMark brandName={activeBrand} logoUrl={activeBrandMeta?.logoUrl} /></div><p className="fleet-browse-brand-count"><b>{activeBrandCount}</b><span>{activeBrandCount === 1 ? "vehicle" : "vehicles"}</span></p></div> : <><p className="eyebrow">ZAVERRE COLLECTION</p><h1>{pageTitle}</h1><p>Every vehicle currently available in the ZAVERRE catalogue, presented through the same primary card system.</p></>}
      </div>
      {!activeBrand && <div className="fleet-browse-count"><span>{vehicles.length}</span><small>{vehicles.length === 1 ? "vehicle" : "vehicles"}</small></div>}
    </section>
    <section className="fleet-browse-content" aria-labelledby="fleet-browse-title">
      <div className="fleet-browse-toolbar filter-top" aria-label="Filter Top" data-filter-part="filter-top">
        <div><p className="eyebrow"><span>FILTER TOP</span><i aria-hidden="true">/</i><span>BRAND CARDS</span></p><h2 id="fleet-browse-title">Browse <em>the fleet.</em></h2></div>
        <label className="fleet-name-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search by vehicle name</span><input type="search" value={vehicleNameQuery} onChange={(event) => setVehicleNameQuery(event.target.value)} placeholder="Search by vehicle name" aria-label="Search by vehicle name" autoComplete="off" /></label>
      </div>
      <div className="filter-holder" aria-label="Filter Holder" data-filter-part="filter-holder"><BrandFilterRail activeBrand={activeBrand || "All"} onSelect={selectBrand} brands={brands} vehicles={vehicleCatalog} prioritizeVisibleLogos /></div>
      {vehicles.length ? <div key={collectionTransitionKey} className="fleet-collection-transition" data-active-brand={activeBrand || "all"}><MasterVehicleGrid vehicles={vehicles} layout="vertical" onDetails={openVehicleDetails} onBook={openBookingIntent} brandBadge={activeBrand ? { brandName: activeBrand, logoUrl: activeBrandMeta?.logoUrl } : undefined} /></div> : <div className="empty-state">No verified ZAVERRE vehicle matches this name.</div>}
    </section>
    {showBackToTop && <div className="fleet-floating-actions" aria-label="Fleet return and contact actions">
      <button type="button" className="fleet-back-to-top" onClick={backToTop} aria-label="Back to the top of the vehicle collection"><ArrowUp size={16} /><span>BACK TO TOP</span></button>
      <a className="fleet-quick-contact fleet-quick-contact--whatsapp" href={whatsappUrl("Hello ZAVERRE, I would like help choosing a vehicle from the fleet.")} target="_blank" rel="noreferrer" aria-label="Contact ZAVERRE on WhatsApp"><MessageCircle size={15} /><span>WHATSAPP</span></a>
      <a className="fleet-quick-contact fleet-quick-contact--call" href={`tel:+${contact.whatsappInternational}`} aria-label="Call ZAVERRE"><Phone size={14} /><span>CALL</span></a>
    </div>}
    <BookingIntentDialog open={Boolean(bookingTarget)} onOpenChange={(open) => { if (!open) setBookingTarget(null); }} subject={bookingTarget} whatsappNumber={contact.whatsappInternational} />
  </main>;
}
