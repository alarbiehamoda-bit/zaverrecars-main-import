import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUp, CarFront, ChevronLeft, Crown, Gauge, MessageCircle, Phone, Search, Wind, type LucideIcon } from "lucide-react";
import { useLocation } from "wouter";
import "./FleetBrowse.css";
import { ZaverreMark } from "@/components/ZaverreMark";
import { vehicleFilterBrands, type Vehicle } from "@/config/vehicleCatalog";
import { useManagedVehicleCatalog } from "@/hooks/useManagedVehicleCatalog";
import { BrandFilterRail, BrandMark, MasterVehicleGrid } from "@/components/VehicleSystem";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { brandRouteSlug } from "@/lib/fleetRoutes";
import { fleetCategoryDefinitions, fleetCategoryFromSlug } from "@/lib/fleetPresentation";
import { vehicleSlug } from "@/lib/vehicleDetail";
import { contact, whatsappUrl } from "@/config/contact";

const fleetReturnStorageKey = "zaverre.return-to-fleet";

type FleetReturnTarget = {
  fleetPath: string;
  vehicleId: string;
};

const categoryFilterIcons: Record<"all" | "performance" | "luxury-suv" | "convertibles", LucideIcon> = {
  all: CarFront,
  performance: Gauge,
  "luxury-suv": Crown,
  convertibles: Wind,
};

function CategoryFilterLink({ href, active, label, count, Icon, onSelect }: { href: string; active: boolean; label: string; count: number; Icon: LucideIcon; onSelect: () => void }) {
  return <a href={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined} onClick={(event) => { event.preventDefault(); onSelect(); }}><span className="fleet-category-icon-well" aria-hidden="true"><Icon size={16} strokeWidth={1.7} /></span><span className="fleet-category-label">{label}</span><b className="fleet-category-count">{count}</b></a>;
}

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
  const [query, setQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const activeBrand = brandSlug ? brands.find((brand) => brandRouteSlug(brand.brandName) === brandSlug)?.brandName : undefined;
  const activeBrandMeta = activeBrand ? brands.find((brand) => brand.brandName === activeBrand) : undefined;
  const activeCategory = fleetCategoryFromSlug(categorySlug);
  const normalized = query.trim().toLowerCase();
  const activeBrandCount = activeBrand ? vehicleCatalog.filter((vehicle) => vehicle.brand === activeBrand || vehicleFilterBrands(vehicle).includes(activeBrand)).length : 0;
  const categoryCounts = useMemo<Record<string, number>>(() => Object.fromEntries(fleetCategoryDefinitions.map((category) => [category.slug, vehicleCatalog.filter((vehicle) => vehicle.category === category.category).length])), [vehicleCatalog]);
  const vehicles = useMemo(() => vehicleCatalog.filter((vehicle) => {
    const brandMatches = !activeBrand || vehicle.brand === activeBrand || vehicleFilterBrands(vehicle).includes(activeBrand);
    const categoryMatches = !activeCategory || vehicle.category === activeCategory.category;
    const searchSource = [vehicle.brand, vehicle.model, vehicle.fullName, vehicle.category, vehicle.color, ...vehicle.specifications.map((item) => `${item.label} ${item.value}`)].filter(Boolean).join(" ").toLowerCase();
    const searchMatches = !normalized || searchSource.includes(normalized);
    return brandMatches && categoryMatches && searchMatches;
  }).sort((a, b) => a.index - b.index), [activeBrand, activeCategory, normalized, vehicleCatalog]);
  const pageTitle = activeBrand || activeCategory?.label || "All cars";

  const selectBrand = (brandName: string) => navigate(brandName === "All" ? "/cars" : `/cars/${brandRouteSlug(brandName)}`);
  const selectCategory = (slug: string) => navigate(slug === "all" ? "/cars" : `/cars/category/${slug}`);
  const bookVehicle = (vehicle: Vehicle) => window.open(whatsappUrl(`Hello ZAVERRE, I would like to reserve the ${vehicle.fullName}. Please confirm availability and the final daily rate.`), "_blank", "noopener,noreferrer");
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

  return <main className={`fleet-browse-page${theme === "light" ? " zaverre-day" : ""}`}>
    <header className="fleet-browse-header">
      <a className="brand-lockup" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }} aria-label="ZAVERRE home"><ZaverreMark className="brand-mark" /><span>ZAVERRE</span></a>
      <div className="fleet-header-actions"><ThemeToggle /><button className="header-book" onClick={() => window.open(whatsappUrl("Hello ZAVERRE, I would like to enquire about the fleet."), "_blank", "noopener,noreferrer")}>BOOK NOW <ArrowDownRight size={16} /></button></div>
    </header>
    {activeBrand && <section className="brand-name-bar" aria-label={`${activeBrand} brand name`}><strong>{activeBrand}</strong></section>}
    <section className={`fleet-browse-hero${activeBrand ? " fleet-browse-hero--brand" : ""}`}>
      <div className="fleet-browse-hero-copy">
        {activeBrand ? <div className="fleet-browse-brand-information"><div className="fleet-browse-brand-logo"><BrandMark brandName={activeBrand} logoUrl={activeBrandMeta?.logoUrl} /></div><p className="fleet-browse-brand-count"><b>{activeBrandCount}</b><span>{activeBrandCount === 1 ? "vehicle" : "vehicles"}</span></p></div> : <><p className="eyebrow">ZAVERRE COLLECTION</p><h1>{pageTitle}</h1><p>Every vehicle currently available in the ZAVERRE catalogue, presented through the same primary card system.</p></>}
      </div>
      {!activeBrand && <div className="fleet-browse-count"><span>{vehicles.length}</span><small>{vehicles.length === 1 ? "vehicle" : "vehicles"}</small></div>}
    </section>
    <section className="fleet-browse-content" aria-labelledby="fleet-browse-title">
      <div className="fleet-browse-toolbar">
        <div><p className="eyebrow">SHOWROOM NAVIGATION</p><h2 id="fleet-browse-title">Browse <em>the fleet.</em></h2></div>
        <label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search brand, model, engine…" aria-label="Search vehicles by brand, model, category, or verified specification" /></label>
      </div>
      <BrandFilterRail activeBrand={activeBrand || "All"} onSelect={selectBrand} brands={brands} vehicles={vehicleCatalog} />
      <div className="fleet-category-rail" aria-label="Vehicle category filters"><CategoryFilterLink href="/cars" active={!activeCategory} label="ALL CARS" count={vehicleCatalog.length} Icon={categoryFilterIcons.all} onSelect={() => selectCategory("all")} />{fleetCategoryDefinitions.map((category) => <CategoryFilterLink href={`/cars/category/${category.slug}`} key={category.slug} active={activeCategory?.slug === category.slug} label={category.label} count={categoryCounts[category.slug]} Icon={categoryFilterIcons[category.slug]} onSelect={() => selectCategory(category.slug)} />)}</div>
      {vehicles.length ? <MasterVehicleGrid vehicles={vehicles} layout="vertical" onDetails={openVehicleDetails} onBook={bookVehicle} /> : <div className="empty-state">No verified ZAVERRE vehicle matches this search.</div>}
    </section>
    {showBackToTop && <div className="fleet-floating-actions" aria-label="Fleet return and contact actions">
      <button type="button" className="fleet-back-to-top" onClick={backToTop} aria-label="Back to the top of the vehicle collection"><ArrowUp size={16} /><span>BACK TO TOP</span></button>
      <a className="fleet-quick-contact fleet-quick-contact--whatsapp" href={whatsappUrl("Hello ZAVERRE, I would like help choosing a vehicle from the fleet.")} target="_blank" rel="noreferrer" aria-label="Contact ZAVERRE on WhatsApp"><MessageCircle size={15} /><span>WHATSAPP</span></a>
      <a className="fleet-quick-contact fleet-quick-contact--call" href={`tel:+${contact.whatsappInternational}`} aria-label="Call ZAVERRE"><Phone size={14} /><span>CALL</span></a>
    </div>}
  </main>;
}
