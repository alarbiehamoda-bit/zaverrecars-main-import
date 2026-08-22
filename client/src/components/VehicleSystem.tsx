import { type CSSProperties, type PointerEvent as ReactPointerEvent, useRef, useState } from "react";
import { useEffect, useMemo } from "react";
import "./VehicleSystem.css";
import "./BrandCards.css";
import { useTheme } from "../contexts/ThemeContext";
import { Armchair, ArrowDownRight, ArrowUpRight, CarFront, ChevronRight, DoorOpen, Gauge, Timer } from "lucide-react";
import { resolveVehicleImageSettings, vehicleBrands, vehicleCatalog, vehicleFilterBrands, type Vehicle } from "@/config/vehicleCatalog";
import type { ManagedBrand } from "@/hooks/useManagedVehicleCatalog";
import { vehicleAssetUrl } from "@/lib/vehicleAssets";
import { brandRouteSlug } from "@/lib/fleetRoutes";
import { vehicleSlug } from "@/lib/vehicleDetail";
import { DirhamMark } from "@/components/DirhamMark";
import { vehicleSpecificationValue } from "@/lib/fleetPresentation";

// Single editable source for each marque icon. Updating one URL here updates brand cards, vehicle cards, and brand headers.
export const brandHeaderAssets: Record<string, string> = {
  "Lamborghini": "/manus-storage/lamborghini_28d5ee79.webp",
  "Maserati": "/manus-storage/maserati_63a12301.webp",
  "Ferrari": "/manus-storage/ferrari_76367fe2.webp",
  "McLaren": "/manus-storage/mclaren_562a6f2c.webp",
  "Mercedes-Benz": "/manus-storage/mercedes-benz_e6c76c17.webp",
  "Porsche": "/manus-storage/porsche_9f7e8dd2.webp",
  "Rolls-Royce": "/manus-storage/rolls-royce_4c877ceb.webp",
  "Range Rover": "/manus-storage/range-rover_efe196c3.webp",
  "Audi": "/manus-storage/audi_050ae235.webp",
  "BMW": "/manus-storage/bmw_596ae7a5.webp",
  "Bentley": "/manus-storage/bentley_d68a814c.webp",
  "Aston Martin": "/manus-storage/aston-martin_e2751bba.webp",
  "Cadillac": "/manus-storage/cadillac_d56f8ccd.webp",
  "Brabus": "/manus-storage/brabus_60a83651.webp",
  "Mansory": "/manus-storage/mansory_b1d8c549.webp",
};

export const brandSheetHeaders: Record<string, string> = {
  "Lamborghini": "/manus-storage/lamborghini-brand-header-from-user-reference_4e144aba.jpg",
  "Ferrari": "/manus-storage/ferrari-brand-header-from-user-reference_e6ebcd07.jpg",
  "McLaren": "/manus-storage/mclaren-brand-header-from-user-reference_1c88e897.jpg",
  "Mercedes-Benz": "/manus-storage/mercedes-benz-brand-header-from-user-reference_91f77606.jpg",
  "Porsche": "/manus-storage/porsche-brand-header-from-user-reference_9fa47405.jpg",
  "Rolls-Royce": "/manus-storage/rolls-royce-brand-header-from-user-reference_39a5cf9f.jpg",
  "Audi": "/manus-storage/audi-brand-header-from-user-reference_ab88493f.jpg",
  "BMW": "/manus-storage/bmw-brand-header-from-user-reference_1c9875ce.jpg",
  "Bentley": "/manus-storage/bentley-brand-header-from-user-reference_a5f393a3.jpg",
  "Aston Martin": "/manus-storage/aston-martin-brand-header-from-user-reference_3d4e6d58.jpg",
  "Cadillac": "/manus-storage/cadillac-brand-header-from-user-reference_eb546591.jpg",
};

const highContrastMarkBrands = new Set([
  "Bentley",
  "Maserati",
  "McLaren",
  "Range Rover",
]);

// Only the old SeekLogo preview images need a blend-mode correction. The
// approved source assets below already have an alpha channel and stay unaltered.
const usesSeekLogoCanvas = (source: string | undefined) => Boolean(source?.includes("seeklogo"));

const categoryLabel: Record<Vehicle["category"], string> = { Performance: "Performance", "Luxury SUV": "Luxury SUV", Convertible: "Convertible" };
const price = (value: number) => new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(value);

export function BrandMark({ brandName, logoUrl, className = "" }: { brandName: string; logoUrl?: string | null; className?: string }) {
  // The verified reference asset is authoritative for the catalogue brands so
  // filters, headers and cards always share the same original source. An
  // administrator-provided asset remains the fallback for unlisted marques.
  const source = brandHeaderAssets[brandName] || logoUrl;
  const usesBuiltInSeekLogoCanvas = Boolean(source && source === brandHeaderAssets[brandName] && usesSeekLogoCanvas(source));
  const [available, setAvailable] = useState(Boolean(source));
  useEffect(() => setAvailable(Boolean(source)), [source]);
  const identityClass = `brand-mark--${brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const contrastClass = highContrastMarkBrands.has(brandName) ? "brand-mark--high-contrast" : "";
  const sourceTreatmentClass = usesBuiltInSeekLogoCanvas ? "brand-mark--seeklogo-canvas" : "";
  if (available && source) return <img className={`${identityClass} ${contrastClass} ${sourceTreatmentClass} ${className}`.trim()} src={source} alt={`${brandName} mark`} loading="lazy" decoding="async" onError={() => setAvailable(false)} />;
  const initials = brandName.split(/\s|-/).filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  return <span className={`brand-mark-fallback ${identityClass} ${className}`.trim()} aria-label={`${brandName} mark`} title={brandName}>{initials}</span>;
}

export function VehicleCard({ vehicle, onDetails, onBook, className = "", imageLoading = "lazy", brandBadge }: { vehicle: Vehicle; onDetails: (vehicle: Vehicle) => void; onBook: (vehicle: Vehicle) => void; className?: string; imageLoading?: "eager" | "lazy"; brandBadge?: { brandName: string; logoUrl?: string | null } }) {
  const [imageAvailable, setImageAvailable] = useState(true);
  const imageSettings = resolveVehicleImageSettings(vehicle.imageSettings);
  const imageStyle = {
    objectFit: imageSettings.fit,
    objectPosition: imageSettings.position,
    "--vehicle-image-scale": String(imageSettings.scale),
    "--vehicle-image-hover-scale": String(imageSettings.scale),
    "--vehicle-image-offset-x": `${imageSettings.offsetX}%`,
    "--vehicle-image-offset-y": `${imageSettings.offsetY}%`,
  } as CSSProperties;
  const cardSpecifications = [
    { label: "Engine", icon: Gauge },
    { label: "0–100", sourceLabel: "0–100 km/h", icon: Timer },
    { label: "Doors", icon: DoorOpen },
    { label: "Seats", icon: Armchair },
  ].flatMap((specification) => {
    const value = vehicleSpecificationValue(vehicle, specification.sourceLabel ?? specification.label);
    return value ? [{ ...specification, value }] : [];
  });
  const managedFacts = vehicle.cardPresentation?.facts?.length ? vehicle.cardPresentation.facts : undefined;
  const ctaLabel = vehicle.cardPresentation?.ctaLabel || "BOOK NOW";
  const displayedBrand = brandBadge?.brandName || vehicle.brand;
  const displayedBrandLogo = brandBadge?.logoUrl ?? vehicle.brandLogoUrl;

  return <article id={`vehicle-card-${vehicle.id}`} className={`vehicle-card group ${className}`.trim()}>
    <a href={`/fleet/${vehicleSlug(vehicle)}`} className="vehicle-image-wrap" onClick={(event) => { event.preventDefault(); onDetails(vehicle); }} aria-label={`View details for ${vehicle.fullName}`}>
      {imageAvailable ? <img src={vehicleAssetUrl(vehicle.image)} alt={vehicle.fullName} decoding="async" loading={imageLoading} width="640" height="390" className="vehicle-image" style={imageStyle} onError={() => setImageAvailable(false)} /> : <span className="vehicle-image-fallback" aria-label={`${vehicle.fullName} verified source image is temporarily unavailable`}><span>{vehicle.brand}</span><strong>{vehicle.model}</strong><i>VERIFIED SOURCE<br />TEMPORARILY UNAVAILABLE</i></span>}
      <div className="vehicle-image-shade" /><span className="vehicle-number">{String(vehicle.index).padStart(2, "0")}</span><span className="vehicle-arrow"><ArrowUpRight size={15} /></span>
    </a>
      <div className="vehicle-card-body">
      <div className="vehicle-brand-ribbon" aria-label={`${displayedBrand} marque`}>
        <span className="vehicle-brand-ribbon__seal brand-emblem-well brand-emblem-well--catalogue"><BrandMark brandName={displayedBrand} logoUrl={displayedBrandLogo} className="vehicle-brand-ribbon-mark" /></span>
        <span className="vehicle-brand-ribbon__identity"><strong>{displayedBrand}</strong><i>{vehicle.cardPresentation?.kicker || "CURATED MARQUE"}</i></span>
      </div>
      <h3 className="font-display text-[#f7f1e5]">{vehicle.cardPresentation?.title || vehicle.model}</h3>
      {managedFacts ? <div className="card-spec-list" aria-label={`${vehicle.fullName} managed quick specifications`}>{managedFacts.map((specification) => <span key={specification.label} className="card-spec-item"><Gauge size={14} aria-hidden="true" /><small>{specification.label}</small><b>{specification.value}</b></span>)}</div> : cardSpecifications.length ? <div className="card-spec-list" aria-label={`${vehicle.fullName} verified quick specifications`}>{cardSpecifications.map((specification) => { const Icon = specification.icon; return <span key={specification.label} className="card-spec-item"><Icon size={14} aria-hidden="true" /><small>{specification.label}</small><b>{specification.value}</b></span>; })}</div> : <div className="card-facts"><span>{categoryLabel[vehicle.category]}</span>{vehicle.color && <span>{vehicle.color}</span>}</div>}
      <div className="card-rate" aria-label={`Daily rental rate: AED ${price(vehicle.priceAedPerDay)}, excluding VAT`}>
        <div className="card-rate__meta"><span className="card-rate__eyebrow">DAILY RATE</span><small>EXCL. VAT</small></div>
        <strong className="card-rate__value"><span className="card-rate__currency" aria-label="United Arab Emirates dirham"><DirhamMark /></span><b>{price(vehicle.priceAedPerDay)}</b><i>PER DAY</i></strong>
      </div>
      <div className="card-actions"><button type="button" className="card-book" onClick={() => onBook(vehicle)}>{ctaLabel} <ArrowDownRight size={14} /></button><a href={`/fleet/${vehicleSlug(vehicle)}`} className="card-details" onClick={(event) => { event.preventDefault(); onDetails(vehicle); }}>VIEW DETAILS + PHOTOS <ChevronRight size={14} /></a></div>
    </div>
  </article>;
}

export function BrandFilterRail({ activeBrand, onSelect, brands, vehicles }: { activeBrand: string; onSelect: (brand: string) => void; brands?: ManagedBrand[]; vehicles?: Vehicle[] }) {
  const { theme } = useTheme();
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, moved: false, pointerId: -1, startX: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const filterBrands = useMemo<ManagedBrand[]>(() => brands ?? vehicleBrands.filter((brandName) => brandName !== "All").map((brandName) => ({ brandName, displayName: brandName })), [brands]);
  const filterVehicles = vehicles ?? vehicleCatalog;
  const brandVehicleCounts = useMemo(() => Object.fromEntries([["All", filterVehicles.length], ...filterBrands.map((brand) => [brand.brandName, filterVehicles.filter((vehicle) => vehicle.brand === brand.brandName || vehicleFilterBrands(vehicle).includes(brand.brandName)).length])]), [filterBrands, filterVehicles]);
  const iconWellStyle = {
    background: theme === "dark" ? "radial-gradient(circle at 50% 40%, #413a2e 0%, #171511 73%)" : "radial-gradient(circle at 50% 40%, #eee7d8 0%, #cbc0aa 73%)",
    borderRadius: "999px",
    overflow: "hidden",
  };
  const brandCardStyle = { background: "transparent", backgroundImage: "none", border: "0", borderRadius: "0", boxShadow: "none", padding: "0" };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = { active: true, moved: false, pointerId: event.pointerId, startX: event.clientX, scrollLeft: rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 4) drag.moved = true;
    rail.scrollLeft = drag.scrollLeft - delta;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    if (rail?.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    dragRef.current.active = false;
    setIsDragging(false);
  };

  const selectBrand = (event: React.MouseEvent<HTMLAnchorElement>, brandName: string) => {
    if (dragRef.current.moved) { event.preventDefault(); return; }
    event.preventDefault();
    onSelect(brandName);
  };

  return <div ref={railRef} className={`brand-cards brand-cards--${theme} brand-logo-rail brand-filter-rail${isDragging ? " is-dragging" : ""}`} aria-label="Brand Cards" data-filter-part="brand-cards" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
    <a href="/cars" key="All" className={activeBrand === "All" ? "active" : ""} style={brandCardStyle} onClick={(event) => selectBrand(event, "All")} aria-current={activeBrand === "All" ? "page" : undefined} aria-label={`Show all ${brandVehicleCounts.All} vehicles`}><span className="brand-filter-card-surface" aria-hidden="true" /><span className="brand-filter-card-icon" style={iconWellStyle} aria-hidden="true"><CarFront size={28} strokeWidth={1.45} /></span><small>ALL</small><b className="brand-filter-model-count">{brandVehicleCounts.All} {brandVehicleCounts.All === 1 ? "MODEL" : "MODELS"}</b></a>
    {filterBrands.map((brand) => <a href={`/cars/${brandRouteSlug(brand.brandName)}`} key={brand.brandName} className={activeBrand === brand.brandName ? "active" : ""} style={brandCardStyle} onClick={(event) => selectBrand(event, brand.brandName)} aria-current={activeBrand === brand.brandName ? "page" : undefined} aria-label={`Show ${brandVehicleCounts[brand.brandName]} ${brand.displayName} vehicles`}>
      <span className="brand-filter-card-surface" aria-hidden="true" /><span className="brand-filter-card-icon" style={iconWellStyle}><BrandMark brandName={brand.brandName} logoUrl={brand.logoUrl} className="brand-filter-mark" /></span>
      <small>{brand.displayName}</small><b className="brand-filter-model-count">{brandVehicleCounts[brand.brandName]} {brandVehicleCounts[brand.brandName] === 1 ? "MODEL" : "MODELS"}</b>
    </a>)}
  </div>;
}

export function MasterVehicleGrid({ vehicles, onDetails, onBook, layout = "grid", brandBadge }: { vehicles: Vehicle[]; onDetails: (vehicle: Vehicle) => void; onBook: (vehicle: Vehicle) => void; layout?: "grid" | "vertical" | "carousel"; brandBadge?: { brandName: string; logoUrl?: string | null } }) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, moved: false, pointerId: -1, startX: 0, startScrollLeft: 0 });
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (layout !== "carousel" || (event.pointerType === "mouse" && event.button !== 0)) return;
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = { active: true, moved: false, pointerId: event.pointerId, startX: event.clientX, startScrollLeft: rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 4) drag.moved = true;
    rail.scrollLeft = drag.startScrollLeft - delta;
  };
  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    if (rail?.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    drag.active = false;
    setIsDragging(false);
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 80);
    }
  };
  return <div ref={railRef} className={`master-vehicle-grid master-vehicle-grid--${layout}${isDragging ? " is-dragging" : ""}`} aria-label={layout === "carousel" ? "Swipe or drag through similar vehicles" : "Vehicle collection"} role={layout === "carousel" ? "region" : undefined} aria-roledescription={layout === "carousel" ? "horizontal vehicle carousel" : undefined} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onClickCapture={(event) => { if (suppressClickRef.current) { event.preventDefault(); event.stopPropagation(); } }}>{vehicles.map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} onDetails={onDetails} onBook={onBook} className="featured-vehicle-card master-vehicle-card" imageLoading={index < 3 ? "eager" : "lazy"} brandBadge={brandBadge} />)}</div>;
}
